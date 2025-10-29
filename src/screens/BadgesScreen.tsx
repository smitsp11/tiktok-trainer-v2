import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { useAppStore } from '../store/useAppStore';
import { BadgeCard } from '../components/BadgeCard';

interface BadgesScreenProps {
  navigation: any;
}

export const BadgesScreen: React.FC<BadgesScreenProps> = ({ navigation }) => {
  const { badges } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const unlockedBadges = badges.filter(b => b.unlockedAt);
  const lockedBadges = badges.filter(b => !b.unlockedAt);

  const displayBadges =
    filter === 'all'
      ? badges
      : filter === 'unlocked'
      ? unlockedBadges
      : lockedBadges;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Badges</Text>
        <Text style={styles.subtitle}>
          {unlockedBadges.length} of {badges.length} unlocked
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <FilterTab
          label="All"
          count={badges.length}
          active={filter === 'all'}
          onPress={() => setFilter('all')}
        />
        <FilterTab
          label="Unlocked"
          count={unlockedBadges.length}
          active={filter === 'unlocked'}
          onPress={() => setFilter('unlocked')}
        />
        <FilterTab
          label="Locked"
          count={lockedBadges.length}
          active={filter === 'locked'}
          onPress={() => setFilter('locked')}
        />
      </View>

      {/* Badges Grid */}
      <ScrollView
        style={styles.badgesList}
        contentContainerStyle={styles.badgesContent}
        showsVerticalScrollIndicator={false}
      >
        {displayBadges.map(badge => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </ScrollView>
    </View>
  );
};

interface FilterTabProps {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
}

const FilterTab: React.FC<FilterTabProps> = ({ label, count, active, onPress }) => (
  <TouchableOpacity
    style={[styles.filterTab, active && styles.filterTabActive]}
    onPress={onPress}
  >
    <Text style={[styles.filterTabText, active && styles.filterTabTextActive]}>
      {label} ({count})
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  filterTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
  },
  filterTabText: {
    ...Typography.bodyBold,
    color: Colors.textSecondary,
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  badgesList: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  badgesContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
});

