import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { useAppStore } from '../store/useAppStore';
import { format, startOfMonth, endOfMonth } from 'date-fns';

interface ProgressScreenProps {
  navigation: any;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ navigation }) => {
  const { reflections, streakData } = useAppStore();

  // Prepare marked dates for calendar
  const markedDates: any = {};
  streakData.reflectionDates.forEach(date => {
    markedDates[date] = {
      marked: true,
      dotColor: Colors.primary,
      selected: true,
      selectedColor: Colors.primary,
    };
  });

  // Calculate stats
  const thisMonth = reflections.filter(r => {
    const date = new Date(r.createdAt);
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    );
  }).length;

  const averagePerWeek = streakData.reflectionDates.length > 0
    ? ((reflections.length / Math.max(streakData.reflectionDates.length, 1)) * 7).toFixed(1)
    : '0.0';

  const completionRate = streakData.reflectionDates.length > 0
    ? ((streakData.currentStreak / streakData.reflectionDates.length) * 100).toFixed(0)
    : '0';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Your Progress</Text>

      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <Calendar
          markedDates={markedDates}
          theme={{
            backgroundColor: Colors.card,
            calendarBackground: Colors.card,
            textSectionTitleColor: Colors.textSecondary,
            selectedDayBackgroundColor: Colors.primary,
            selectedDayTextColor: '#FFFFFF',
            todayTextColor: Colors.primary,
            dayTextColor: Colors.text,
            textDisabledColor: Colors.textLight,
            dotColor: Colors.primary,
            selectedDotColor: '#FFFFFF',
            arrowColor: Colors.primary,
            monthTextColor: Colors.text,
            textDayFontFamily: 'System',
            textMonthFontFamily: 'System',
            textDayHeaderFontFamily: 'System',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
        />
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          title="This Month"
          value={thisMonth.toString()}
          subtitle="reflections"
          color={Colors.primary}
        />
        <StatCard
          title="Weekly Avg"
          value={averagePerWeek}
          subtitle="per week"
          color={Colors.secondary}
        />
        <StatCard
          title="Longest Streak"
          value={streakData.longestStreak.toString()}
          subtitle="days"
          color={Colors.success}
        />
        <StatCard
          title="Total Videos"
          value={reflections.length.toString()}
          subtitle="all time"
          color={Colors.warning}
        />
      </View>

      {/* Activity Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {reflections.slice(0, 10).map((reflection, index) => (
          <ReflectionItem
            key={reflection.id}
            reflection={reflection}
            onPress={() => {
              // Could navigate to video player
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, color }) => (
  <View style={styles.statCard}>
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statSubtitle}>{subtitle}</Text>
  </View>
);

interface ReflectionItemProps {
  reflection: any;
  onPress: () => void;
}

const ReflectionItem: React.FC<ReflectionItemProps> = ({ reflection, onPress }) => (
  <TouchableOpacity style={styles.reflectionItem} onPress={onPress}>
    <View style={styles.reflectionIcon}>
      <Text style={styles.reflectionIconText}>🎬</Text>
    </View>
    <View style={styles.reflectionInfo}>
      <Text style={styles.reflectionDate}>
        {format(new Date(reflection.createdAt), 'MMM d, yyyy')}
      </Text>
      <Text style={styles.reflectionTime}>
        {format(new Date(reflection.createdAt), 'h:mm a')} • {reflection.duration}s
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingTop: 60,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: Spacing.xl,
  },
  calendarContainer: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  statTitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  statValue: {
    ...Typography.h1,
    marginBottom: 4,
  },
  statSubtitle: {
    ...Typography.small,
    color: Colors.textLight,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  reflectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  reflectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  reflectionIconText: {
    fontSize: 24,
  },
  reflectionInfo: {
    flex: 1,
  },
  reflectionDate: {
    ...Typography.bodyBold,
    color: Colors.text,
    marginBottom: 4,
  },
  reflectionTime: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});

