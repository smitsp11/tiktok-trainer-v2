// Activity Types
export type ActivityType = 'gym' | 'class' | 'meeting' | 'study' | 'other';

// Schedule Activity
export interface ScheduleActivity {
  id: string;
  title: string;
  type: ActivityType;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  location?: string;
  description?: string;
}

// Prompt
export interface Prompt {
  id: string;
  activityId: string;
  activityTitle: string;
  question: string;
  scheduledTime: Date;
  completed: boolean;
  contextType: ActivityType;
}

// Video Reflection
export interface Reflection {
  id: string;
  promptId: string;
  videoUri: string;
  duration: number; // in seconds
  createdAt: Date;
  transcription?: string;
  mood?: 'great' | 'good' | 'okay' | 'tired' | 'stressed';
}

// Badge
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  requirement: string;
  progress?: number;
  total?: number;
}

// Streak Data
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalReflections: number;
  reflectionDates: string[]; // ISO date strings
}

// User Progress
export interface UserProgress {
  weeklyGoal: number;
  completedThisWeek: number;
  totalReflections: number;
  badges: Badge[];
  streakData: StreakData;
}

// Onboarding State
export interface OnboardingState {
  completed: boolean;
  currentStep: number;
  userName?: string;
  weeklySchedule: ScheduleActivity[];
}

// Notification Settings
export interface NotificationSettings {
  enabled: boolean;
  promptBeforeActivity: number; // minutes before
  promptAfterActivity: number; // minutes after
  reminderTime?: string; // daily reminder time HH:mm
}

// User Preferences
export interface UserPreferences {
  notifications: NotificationSettings;
  favoritePromptTypes: ActivityType[];
  videoDuration: number; // max seconds
  darkMode: boolean;
}

