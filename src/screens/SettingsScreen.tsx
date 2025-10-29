import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { useAppStore } from '../store/useAppStore';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { onboarding, preferences, updatePreferences, schedule } = useAppStore();

  const handleToggleNotifications = (value: boolean) => {
    updatePreferences({
      notifications: {
        ...preferences.notifications,
        enabled: value,
      },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <SettingRow
          label="Name"
          value={onboarding?.userName || 'Not set'}
          onPress={() => {}}
        />
      </View>

      {/* Schedule Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Schedule</Text>
        <SettingRow
          label="Weekly Activities"
          value={`${schedule.length} activities`}
          onPress={() => {
            // Navigate to schedule editor
          }}
        />
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <SettingRowWithSwitch
          label="Enable Notifications"
          description="Get prompted after your activities"
          value={preferences.notifications.enabled}
          onValueChange={handleToggleNotifications}
        />
        <SettingRow
          label="Prompt Timing"
          value={`${preferences.notifications.promptAfterActivity} min after`}
          onPress={() => {}}
        />
      </View>

      {/* Video Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Video</Text>
        <SettingRow
          label="Max Recording Duration"
          value={`${preferences.videoDuration} seconds`}
          onPress={() => {}}
        />
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <SettingRow label="Version" value="1.0.0" onPress={() => {}} />
        <SettingRow
          label="Privacy Policy"
          value=""
          onPress={() => {}}
          showChevron
        />
        <SettingRow
          label="Terms of Service"
          value=""
          onPress={() => {}}
          showChevron
        />
      </View>
    </ScrollView>
  );
};

interface SettingRowProps {
  label: string;
  value: string;
  onPress: () => void;
  showChevron?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({
  label,
  value,
  onPress,
  showChevron = true,
}) => (
  <TouchableOpacity style={styles.settingRow} onPress={onPress}>
    <Text style={styles.settingLabel}>{label}</Text>
    <View style={styles.settingRight}>
      {value && <Text style={styles.settingValue}>{value}</Text>}
      {showChevron && <Text style={styles.chevron}>›</Text>}
    </View>
  </TouchableOpacity>
);

interface SettingRowWithSwitchProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const SettingRowWithSwitch: React.FC<SettingRowWithSwitchProps> = ({
  label,
  description,
  value,
  onValueChange,
}) => (
  <View style={styles.settingRow}>
    <View style={styles.settingLeft}>
      <Text style={styles.settingLabel}>{label}</Text>
      {description && (
        <Text style={styles.settingDescription}>{description}</Text>
      )}
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: Colors.borderLight, true: Colors.primary + '80' }}
      thumbColor={value ? Colors.primary : Colors.textLight}
    />
  </View>
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
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.bodyBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  settingLeft: {
    flex: 1,
  },
  settingLabel: {
    ...Typography.body,
    color: Colors.text,
  },
  settingDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  settingValue: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  chevron: {
    ...Typography.h2,
    color: Colors.textLight,
  },
});

