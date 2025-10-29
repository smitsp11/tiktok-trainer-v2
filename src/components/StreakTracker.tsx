import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { StreakData } from '../types';
import { getStreakEmoji } from '../services/streakService';
import { format, subDays, startOfDay } from 'date-fns';

interface StreakTrackerProps {
  streakData: StreakData;
}

export const StreakTracker: React.FC<StreakTrackerProps> = ({ streakData }) => {
  const days = 30;
  const today = startOfDay(new Date());
  const cells = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const hasReflection = streakData.reflectionDates.includes(dateStr);
    cells.push({ date: dateStr, hasReflection });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.streakNumber}>
            {getStreakEmoji(streakData.currentStreak)} {streakData.currentStreak}
          </Text>
          <Text style={styles.streakLabel}>Day Streak</Text>
        </View>
        <View style={styles.stats}>
          <Stat label="Longest" value={streakData.longestStreak.toString()} />
          <Stat label="Total" value={streakData.totalReflections.toString()} />
        </View>
      </View>

      <View style={styles.grid}>
        {cells.map((cell, index) => (
          <View
            key={index}
            style={[
              styles.cell,
              cell.hasReflection ? styles.cellActive : styles.cellInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

interface StatProps {
  label: string;
  value: string;
}

const Stat: React.FC<StatProps> = ({ label, value }) => (
  <View style={styles.stat}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  streakNumber: {
    ...Typography.h1,
    color: Colors.text,
  },
  streakLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    ...Typography.h3,
    color: Colors.primary,
  },
  statLabel: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  cell: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  cellActive: {
    backgroundColor: Colors.streak,
  },
  cellInactive: {
    backgroundColor: Colors.streakInactive,
  },
});

