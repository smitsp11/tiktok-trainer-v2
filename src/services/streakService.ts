import { StreakData, Reflection } from '../types';
import { format, differenceInDays, startOfDay, parseISO } from 'date-fns';

export const calculateStreak = (reflections: Reflection[]): StreakData => {
  if (reflections.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalReflections: 0,
      reflectionDates: [],
    };
  }

  // Get unique dates when reflections were made
  const uniqueDates = Array.from(
    new Set(
      reflections.map(r => format(startOfDay(r.createdAt), 'yyyy-MM-dd'))
    )
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = startOfDay(new Date());
  const mostRecentDate = startOfDay(parseISO(uniqueDates[0]));

  // Calculate current streak
  const daysSinceLastReflection = differenceInDays(today, mostRecentDate);

  if (daysSinceLastReflection === 0) {
    currentStreak = 1;
    
    // Count consecutive days
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = parseISO(uniqueDates[i - 1]);
      const currDate = parseISO(uniqueDates[i]);
      const diff = differenceInDays(prevDate, currDate);

      if (diff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  } else if (daysSinceLastReflection === 1) {
    // Yesterday counts for current streak
    currentStreak = 1;
    
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = parseISO(uniqueDates[i - 1]);
      const currDate = parseISO(uniqueDates[i]);
      const diff = differenceInDays(prevDate, currDate);

      if (diff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  longestStreak = tempStreak;
  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = parseISO(uniqueDates[i - 1]);
    const currDate = parseISO(uniqueDates[i]);
    const diff = differenceInDays(prevDate, currDate);

    if (diff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  return {
    currentStreak,
    longestStreak,
    totalReflections: reflections.length,
    reflectionDates: uniqueDates,
  };
};

export const getStreakPercentage = (currentStreak: number, goal: number = 30): number => {
  return Math.min((currentStreak / goal) * 100, 100);
};

export const getStreakEmoji = (streak: number): string => {
  if (streak === 0) return '😴';
  if (streak < 3) return '🌱';
  if (streak < 7) return '🌿';
  if (streak < 14) return '🌳';
  if (streak < 30) return '🔥';
  return '⚡';
};

