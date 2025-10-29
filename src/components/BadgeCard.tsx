import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { Badge } from '../types';

interface BadgeCardProps {
  badge: Badge;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
  const isUnlocked = !!badge.unlockedAt;
  const progress = badge.progress || 0;
  const total = badge.total || 1;
  const progressPercentage = Math.min((progress / total) * 100, 100);

  return (
    <View style={[styles.container, !isUnlocked && styles.containerLocked]}>
      <Text style={[styles.icon, !isUnlocked && styles.iconLocked]}>
        {badge.icon}
      </Text>
      <Text style={[styles.name, !isUnlocked && styles.textLocked]}>
        {badge.name}
      </Text>
      <Text style={[styles.description, !isUnlocked && styles.textLocked]}>
        {badge.description}
      </Text>

      {!isUnlocked && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progressPercentage}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {progress} / {total}
          </Text>
        </View>
      )}

      {isUnlocked && (
        <View style={styles.unlockedBadge}>
          <Text style={styles.unlockedText}>Unlocked! 🎉</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    width: 160,
    ...Shadows.sm,
  },
  containerLocked: {
    opacity: 0.6,
  },
  icon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  iconLocked: {
    opacity: 0.3,
  },
  name: {
    ...Typography.bodyBold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  description: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  textLocked: {
    color: Colors.textLight,
  },
  progressContainer: {
    width: '100%',
    marginTop: Spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  progressText: {
    ...Typography.small,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  unlockedBadge: {
    backgroundColor: Colors.success + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
  },
  unlockedText: {
    ...Typography.small,
    color: Colors.success,
    fontWeight: '600',
  },
});

