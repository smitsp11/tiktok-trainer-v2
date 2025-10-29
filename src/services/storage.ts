import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ScheduleActivity,
  Reflection,
  Badge,
  StreakData,
  OnboardingState,
  UserPreferences,
  Prompt,
} from '../types';

const KEYS = {
  ONBOARDING: '@onboarding',
  SCHEDULE: '@schedule',
  REFLECTIONS: '@reflections',
  BADGES: '@badges',
  STREAK: '@streak',
  PREFERENCES: '@preferences',
  PROMPTS: '@prompts',
};

// Onboarding
export const getOnboardingState = async (): Promise<OnboardingState | null> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.ONBOARDING);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading onboarding state:', error);
    return null;
  }
};

export const saveOnboardingState = async (state: OnboardingState): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.ONBOARDING, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving onboarding state:', error);
  }
};

// Schedule
export const getSchedule = async (): Promise<ScheduleActivity[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.SCHEDULE);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading schedule:', error);
    return [];
  }
};

export const saveSchedule = async (schedule: ScheduleActivity[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.SCHEDULE, JSON.stringify(schedule));
  } catch (error) {
    console.error('Error saving schedule:', error);
  }
};

// Reflections
export const getReflections = async (): Promise<Reflection[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.REFLECTIONS);
    if (!data) return [];
    const reflections = JSON.parse(data);
    // Parse dates
    return reflections.map((r: any) => ({
      ...r,
      createdAt: new Date(r.createdAt),
    }));
  } catch (error) {
    console.error('Error reading reflections:', error);
    return [];
  }
};

export const saveReflection = async (reflection: Reflection): Promise<void> => {
  try {
    const reflections = await getReflections();
    reflections.push(reflection);
    await AsyncStorage.setItem(KEYS.REFLECTIONS, JSON.stringify(reflections));
  } catch (error) {
    console.error('Error saving reflection:', error);
  }
};

// Badges
export const getBadges = async (): Promise<Badge[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.BADGES);
    if (!data) return [];
    const badges = JSON.parse(data);
    // Parse dates
    return badges.map((b: any) => ({
      ...b,
      unlockedAt: b.unlockedAt ? new Date(b.unlockedAt) : undefined,
    }));
  } catch (error) {
    console.error('Error reading badges:', error);
    return [];
  }
};

export const saveBadges = async (badges: Badge[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.BADGES, JSON.stringify(badges));
  } catch (error) {
    console.error('Error saving badges:', error);
  }
};

export const unlockBadge = async (badgeId: string): Promise<void> => {
  try {
    const badges = await getBadges();
    const badge = badges.find(b => b.id === badgeId);
    if (badge && !badge.unlockedAt) {
      badge.unlockedAt = new Date();
      await saveBadges(badges);
    }
  } catch (error) {
    console.error('Error unlocking badge:', error);
  }
};

// Streak
export const getStreakData = async (): Promise<StreakData> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.STREAK);
    return data ? JSON.parse(data) : {
      currentStreak: 0,
      longestStreak: 0,
      totalReflections: 0,
      reflectionDates: [],
    };
  } catch (error) {
    console.error('Error reading streak data:', error);
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalReflections: 0,
      reflectionDates: [],
    };
  }
};

export const saveStreakData = async (streak: StreakData): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.STREAK, JSON.stringify(streak));
  } catch (error) {
    console.error('Error saving streak data:', error);
  }
};

// Preferences
export const getPreferences = async (): Promise<UserPreferences> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.PREFERENCES);
    return data ? JSON.parse(data) : {
      notifications: {
        enabled: true,
        promptBeforeActivity: 0,
        promptAfterActivity: 15,
      },
      favoritePromptTypes: [],
      videoDuration: 60,
      darkMode: false,
    };
  } catch (error) {
    console.error('Error reading preferences:', error);
    return {
      notifications: {
        enabled: true,
        promptBeforeActivity: 0,
        promptAfterActivity: 15,
      },
      favoritePromptTypes: [],
      videoDuration: 60,
      darkMode: false,
    };
  }
};

export const savePreferences = async (preferences: UserPreferences): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
};

// Prompts
export const getPrompts = async (): Promise<Prompt[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.PROMPTS);
    if (!data) return [];
    const prompts = JSON.parse(data);
    return prompts.map((p: any) => ({
      ...p,
      scheduledTime: new Date(p.scheduledTime),
    }));
  } catch (error) {
    console.error('Error reading prompts:', error);
    return [];
  }
};

export const savePrompts = async (prompts: Prompt[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.PROMPTS, JSON.stringify(prompts));
  } catch (error) {
    console.error('Error saving prompts:', error);
  }
};

export const markPromptCompleted = async (promptId: string): Promise<void> => {
  try {
    const prompts = await getPrompts();
    const prompt = prompts.find(p => p.id === promptId);
    if (prompt) {
      prompt.completed = true;
      await savePrompts(prompts);
    }
  } catch (error) {
    console.error('Error marking prompt completed:', error);
  }
};

