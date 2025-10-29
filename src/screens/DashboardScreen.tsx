import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { useAppStore } from '../store/useAppStore';
import { StreakTracker } from '../components/StreakTracker';
import { PromptCard } from '../components/PromptCard';
import { getUpcomingPrompts } from '../services/promptService';
import { MOTIVATIONAL_MESSAGES } from '../constants/prompts';

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const {
    onboarding,
    prompts,
    streakData,
    reflections,
    badges,
    refreshPrompts,
    isLoading,
  } = useAppStore();

  const [refreshing, setRefreshing] = React.useState(false);

  const upcomingPrompts = getUpcomingPrompts(prompts, 5);
  const unlockedBadges = badges.filter(b => b.unlockedAt);
  const motivationalMessage =
    MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshPrompts();
    setRefreshing(false);
  };

  const handlePromptPress = (promptId: string) => {
    navigation.navigate('Camera', { promptId });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hi, {onboarding?.userName || 'there'}! 👋
          </Text>
          <Text style={styles.motivational}>{motivationalMessage}</Text>
        </View>
        <TouchableOpacity
          style={styles.badgeButton}
          onPress={() => navigation.navigate('Badges')}
        >
          <Text style={styles.badgeEmoji}>🏆</Text>
          <Text style={styles.badgeCount}>{unlockedBadges.length}</Text>
        </TouchableOpacity>
      </View>

      {/* Streak Tracker */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Streak</Text>
        <StreakTracker streakData={streakData} />
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <StatCard
          label="This Week"
          value={getThisWeekCount(reflections)}
          icon="📊"
        />
        <StatCard
          label="Total Videos"
          value={reflections.length}
          icon="🎬"
        />
        <StatCard
          label="Badges"
          value={unlockedBadges.length}
          icon="🏆"
        />
      </View>

      {/* Upcoming Prompts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Prompts</Text>
          {upcomingPrompts.length > 0 && (
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          )}
        </View>

        {upcomingPrompts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={styles.emptyText}>No upcoming prompts</Text>
            <Text style={styles.emptySubtext}>
              Add activities to your schedule to get personalized prompts
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <Text style={styles.addButtonText}>Manage Schedule</Text>
            </TouchableOpacity>
          </View>
        ) : (
          upcomingPrompts.map(prompt => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onPress={() => handlePromptPress(prompt.id)}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

interface StatCardProps {
  label: string;
  value: number;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => (
  <View style={styles.statCard}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const getThisWeekCount = (reflections: any[]): number => {
  const now = new Date();
  const currentDay = now.getDay();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - currentDay);
  weekStart.setHours(0, 0, 0, 0);

  return reflections.filter(r => new Date(r.createdAt) >= weekStart).length;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  greeting: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  motivational: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  badgeButton: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.full,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeEmoji: {
    fontSize: 24,
  },
  badgeCount: {
    ...Typography.small,
    color: Colors.primary,
    fontWeight: '700',
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
  },
  seeAll: {
    ...Typography.body,
    color: Colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  statValue: {
    ...Typography.h2,
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyText: {
    ...Typography.bodyBold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  addButtonText: {
    ...Typography.bodyBold,
    color: '#FFFFFF',
  },
});

