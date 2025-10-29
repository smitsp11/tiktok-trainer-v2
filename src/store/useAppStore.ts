import { create } from 'zustand';
import {
  OnboardingState,
  ScheduleActivity,
  Prompt,
  Reflection,
  Badge,
  StreakData,
  UserPreferences,
} from '../types';
import * as storage from '../services/storage';
import { generatePromptsForSchedule } from '../services/promptService';
import { calculateStreak } from '../services/streakService';
import { checkBadgeUnlocks } from '../services/badgeService';
import { scheduleAllPromptNotifications } from '../services/notificationService';

interface AppState {
  // Onboarding
  onboarding: OnboardingState | null;
  isOnboardingComplete: boolean;

  // Schedule & Prompts
  schedule: ScheduleActivity[];
  prompts: Prompt[];

  // Reflections
  reflections: Reflection[];

  // Gamification
  badges: Badge[];
  streakData: StreakData;

  // Preferences
  preferences: UserPreferences;

  // Loading states
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  initializeApp: () => Promise<void>;
  updateOnboarding: (state: OnboardingState) => Promise<void>;
  completeOnboarding: (schedule: ScheduleActivity[], userName: string) => Promise<void>;
  addScheduleActivity: (activity: ScheduleActivity) => Promise<void>;
  removeScheduleActivity: (activityId: string) => Promise<void>;
  updateSchedule: (schedule: ScheduleActivity[]) => Promise<void>;
  addReflection: (reflection: Reflection) => Promise<void>;
  markPromptCompleted: (promptId: string) => Promise<void>;
  refreshPrompts: () => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  checkAndUpdateBadges: () => Promise<Badge[]>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  onboarding: null,
  isOnboardingComplete: false,
  schedule: [],
  prompts: [],
  reflections: [],
  badges: [],
  streakData: {
    currentStreak: 0,
    longestStreak: 0,
    totalReflections: 0,
    reflectionDates: [],
  },
  preferences: {
    notifications: {
      enabled: true,
      promptBeforeActivity: 0,
      promptAfterActivity: 15,
    },
    favoritePromptTypes: [],
    videoDuration: 60,
    darkMode: false,
  },
  isLoading: false,
  isInitialized: false,

  // Initialize app - load all data from storage
  initializeApp: async () => {
    set({ isLoading: true });
    try {
      const [onboarding, schedule, reflections, badges, streakData, preferences, prompts] =
        await Promise.all([
          storage.getOnboardingState(),
          storage.getSchedule(),
          storage.getReflections(),
          storage.getBadges(),
          storage.getStreakData(),
          storage.getPreferences(),
          storage.getPrompts(),
        ]);

      // Calculate current streak from reflections
      const calculatedStreak = calculateStreak(reflections);

      set({
        onboarding,
        isOnboardingComplete: onboarding?.completed || false,
        schedule,
        reflections,
        badges,
        streakData: calculatedStreak,
        preferences,
        prompts,
        isInitialized: true,
        isLoading: false,
      });

      // Check for badge unlocks
      await get().checkAndUpdateBadges();
    } catch (error) {
      console.error('Error initializing app:', error);
      set({ isLoading: false, isInitialized: true });
    }
  },

  // Update onboarding state
  updateOnboarding: async (onboardingState) => {
    await storage.saveOnboardingState(onboardingState);
    set({ onboarding: onboardingState });
  },

  // Complete onboarding
  completeOnboarding: async (schedule, userName) => {
    const onboardingState: OnboardingState = {
      completed: true,
      currentStep: 3,
      userName,
      weeklySchedule: schedule,
    };

    await storage.saveOnboardingState(onboardingState);
    await storage.saveSchedule(schedule);

    // Generate initial prompts
    const newPrompts = generatePromptsForSchedule(schedule, 15);
    await storage.savePrompts(newPrompts);

    // Schedule notifications
    await scheduleAllPromptNotifications(newPrompts);

    set({
      onboarding: onboardingState,
      isOnboardingComplete: true,
      schedule,
      prompts: newPrompts,
    });
  },

  // Add schedule activity
  addScheduleActivity: async (activity) => {
    const currentSchedule = get().schedule;
    const updatedSchedule = [...currentSchedule, activity];
    await storage.saveSchedule(updatedSchedule);
    set({ schedule: updatedSchedule });
    await get().refreshPrompts();
  },

  // Remove schedule activity
  removeScheduleActivity: async (activityId) => {
    const currentSchedule = get().schedule;
    const updatedSchedule = currentSchedule.filter(a => a.id !== activityId);
    await storage.saveSchedule(updatedSchedule);
    set({ schedule: updatedSchedule });
    await get().refreshPrompts();
  },

  // Update entire schedule
  updateSchedule: async (schedule) => {
    await storage.saveSchedule(schedule);
    set({ schedule });
    await get().refreshPrompts();
  },

  // Add reflection
  addReflection: async (reflection) => {
    await storage.saveReflection(reflection);
    const reflections = [...get().reflections, reflection];
    const streakData = calculateStreak(reflections);

    await storage.saveStreakData(streakData);

    set({ reflections, streakData });

    // Mark prompt as completed
    await storage.markPromptCompleted(reflection.promptId);
    const prompts = get().prompts.map(p =>
      p.id === reflection.promptId ? { ...p, completed: true } : p
    );
    set({ prompts });

    // Check for new badge unlocks
    const newBadges = await get().checkAndUpdateBadges();
    return newBadges;
  },

  // Mark prompt as completed
  markPromptCompleted: async (promptId) => {
    await storage.markPromptCompleted(promptId);
    const prompts = get().prompts.map(p =>
      p.id === promptId ? { ...p, completed: true } : p
    );
    set({ prompts });
  },

  // Refresh prompts based on schedule
  refreshPrompts: async () => {
    const { schedule, preferences } = get();
    const newPrompts = generatePromptsForSchedule(
      schedule,
      preferences.notifications.promptAfterActivity
    );
    await storage.savePrompts(newPrompts);
    await scheduleAllPromptNotifications(newPrompts);
    set({ prompts: newPrompts });
  },

  // Update preferences
  updatePreferences: async (newPreferences) => {
    const currentPreferences = get().preferences;
    const updatedPreferences = { ...currentPreferences, ...newPreferences };
    await storage.savePreferences(updatedPreferences);
    set({ preferences: updatedPreferences });

    // Refresh prompts if notification timing changed
    if (newPreferences.notifications) {
      await get().refreshPrompts();
    }
  },

  // Check and update badges
  checkAndUpdateBadges: async () => {
    const { reflections, streakData, badges } = get();
    const updatedBadges = checkBadgeUnlocks(reflections, streakData, badges);
    await storage.saveBadges(updatedBadges);
    set({ badges: updatedBadges });
    return updatedBadges;
  },
}));

