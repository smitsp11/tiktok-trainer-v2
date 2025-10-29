import { Badge, Reflection, StreakData } from '../types';
import { AVAILABLE_BADGES } from '../constants/badges';
import { format, getHours } from 'date-fns';

export const checkBadgeUnlocks = (
  reflections: Reflection[],
  streakData: StreakData,
  currentBadges: Badge[]
): Badge[] => {
  const updatedBadges = [...currentBadges];

  AVAILABLE_BADGES.forEach(availableBadge => {
    const existingBadge = updatedBadges.find(b => b.id === availableBadge.id);

    if (!existingBadge) {
      // Initialize badge
      updatedBadges.push({
        ...availableBadge,
        progress: 0,
      });
    }
  });

  // Check each badge condition
  updatedBadges.forEach(badge => {
    if (badge.unlockedAt) return; // Already unlocked

    let progress = 0;
    let shouldUnlock = false;

    switch (badge.id) {
      case 'first-reflection':
        progress = reflections.length > 0 ? 1 : 0;
        shouldUnlock = reflections.length >= 1;
        break;

      case 'week-warrior':
        progress = streakData.currentStreak;
        shouldUnlock = streakData.currentStreak >= 7;
        break;

      case 'consistent-creator':
        const thisWeekReflections = getThisWeekReflectionCount(reflections);
        progress = thisWeekReflections;
        shouldUnlock = thisWeekReflections >= 5;
        break;

      case 'month-milestone':
        progress = streakData.currentStreak;
        shouldUnlock = streakData.currentStreak >= 30;
        break;

      case 'centurion':
        progress = reflections.length;
        shouldUnlock = reflections.length >= 100;
        break;

      case 'early-bird':
        const morningReflections = reflections.filter(
          r => getHours(r.createdAt) < 9
        ).length;
        progress = morningReflections;
        shouldUnlock = morningReflections >= 10;
        break;

      case 'night-owl':
        const eveningReflections = reflections.filter(
          r => getHours(r.createdAt) >= 20
        ).length;
        progress = eveningReflections;
        shouldUnlock = eveningReflections >= 10;
        break;

      case 'gym-enthusiast':
        const gymReflections = reflections.filter(
          r => r.promptId.includes('gym')
        ).length;
        progress = gymReflections;
        shouldUnlock = gymReflections >= 20;
        break;

      case 'scholar':
        const classReflections = reflections.filter(
          r => r.promptId.includes('class')
        ).length;
        progress = classReflections;
        shouldUnlock = classReflections >= 20;
        break;

      case 'comeback-kid':
        // Check if there was a broken streak and now a new 3-day streak
        if (streakData.currentStreak >= 3 && streakData.longestStreak > streakData.currentStreak) {
          progress = 3;
          shouldUnlock = true;
        }
        break;
    }

    badge.progress = progress;
    if (shouldUnlock && !badge.unlockedAt) {
      badge.unlockedAt = new Date();
    }
  });

  return updatedBadges;
};

const getThisWeekReflectionCount = (reflections: Reflection[]): number => {
  const now = new Date();
  const currentDay = now.getDay();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - currentDay);
  weekStart.setHours(0, 0, 0, 0);

  return reflections.filter(r => r.createdAt >= weekStart).length;
};

export const getNewlyUnlockedBadges = (
  oldBadges: Badge[],
  newBadges: Badge[]
): Badge[] => {
  return newBadges.filter(newBadge => {
    const oldBadge = oldBadges.find(b => b.id === newBadge.id);
    return newBadge.unlockedAt && (!oldBadge || !oldBadge.unlockedAt);
  });
};

