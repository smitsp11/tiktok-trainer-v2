import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { Prompt } from '../types';
import { format } from 'date-fns';

interface PromptCardProps {
  prompt: Prompt;
  onPress: () => void;
}

const ACTIVITY_COLORS: Record<string, string> = {
  gym: Colors.gym,
  class: Colors.class,
  meeting: Colors.meeting,
  study: Colors.study,
  other: Colors.other,
};

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, onPress }) => {
  const color = ACTIVITY_COLORS[prompt.contextType] || Colors.other;
  const timeString = format(prompt.scheduledTime, 'h:mm a');

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.indicator, { backgroundColor: color }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.activityTitle}>{prompt.activityTitle}</Text>
          <Text style={styles.time}>{timeString}</Text>
        </View>
        <Text style={styles.question}>{prompt.question}</Text>
        {prompt.completed && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>✓ Completed</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  indicator: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  activityTitle: {
    ...Typography.bodyBold,
    color: Colors.text,
  },
  time: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  question: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  completedBadge: {
    marginTop: Spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: Colors.success + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  completedText: {
    ...Typography.small,
    color: Colors.success,
    fontWeight: '600',
  },
});

