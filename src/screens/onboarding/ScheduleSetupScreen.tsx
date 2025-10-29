import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { ScheduleActivity, ActivityType } from '../../types';

interface ScheduleSetupScreenProps {
  onComplete: (schedule: ScheduleActivity[]) => void;
  onBack: () => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const ACTIVITY_TYPES: { type: ActivityType; label: string; emoji: string }[] = [
  { type: 'gym', label: 'Gym', emoji: '💪' },
  { type: 'class', label: 'Class', emoji: '📚' },
  { type: 'meeting', label: 'Meeting', emoji: '👥' },
  { type: 'study', label: 'Study', emoji: '📖' },
  { type: 'other', label: 'Other', emoji: '📌' },
];

export const ScheduleSetupScreen: React.FC<ScheduleSetupScreenProps> = ({
  onComplete,
  onBack,
}) => {
  const [schedule, setSchedule] = useState<ScheduleActivity[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ScheduleActivity | null>(null);

  const handleAddActivity = () => {
    setEditingActivity({
      id: Date.now().toString(),
      title: '',
      type: 'other',
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '10:00',
    });
    setModalVisible(true);
  };

  const handleSaveActivity = () => {
    if (!editingActivity || !editingActivity.title.trim()) return;

    if (schedule.find(a => a.id === editingActivity.id)) {
      setSchedule(schedule.map(a => (a.id === editingActivity.id ? editingActivity : a)));
    } else {
      setSchedule([...schedule, editingActivity]);
    }

    setModalVisible(false);
    setEditingActivity(null);
  };

  const handleDeleteActivity = (id: string) => {
    setSchedule(schedule.filter(a => a.id !== id));
  };

  const handleComplete = () => {
    if (schedule.length > 0) {
      onComplete(schedule);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Build Your Schedule</Text>
        <Text style={styles.subtitle}>
          Add your weekly activities to get personalized prompts
        </Text>
      </View>

      <ScrollView style={styles.scheduleList} showsVerticalScrollIndicator={false}>
        {schedule.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={styles.emptyText}>No activities yet</Text>
            <Text style={styles.emptySubtext}>Tap the button below to add one</Text>
          </View>
        ) : (
          schedule.map(activity => (
            <ScheduleActivityCard
              key={activity.id}
              activity={activity}
              onEdit={() => {
                setEditingActivity(activity);
                setModalVisible(true);
              }}
              onDelete={() => handleDeleteActivity(activity.id)}
            />
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddActivity}>
          <Text style={styles.addButtonText}>+ Add Activity</Text>
        </TouchableOpacity>

        {schedule.length > 0 && (
          <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
            <Text style={styles.completeButtonText}>Complete Setup</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <ActivityEditor
          activity={editingActivity}
          onSave={handleSaveActivity}
          onCancel={() => {
            setModalVisible(false);
            setEditingActivity(null);
          }}
          onChange={setEditingActivity}
        />
      </Modal>
    </View>
  );
};

interface ScheduleActivityCardProps {
  activity: ScheduleActivity;
  onEdit: () => void;
  onDelete: () => void;
}

const ScheduleActivityCard: React.FC<ScheduleActivityCardProps> = ({
  activity,
  onEdit,
  onDelete,
}) => {
  const activityType = ACTIVITY_TYPES.find(t => t.type === activity.type);

  return (
    <TouchableOpacity style={styles.activityCard} onPress={onEdit}>
      <View style={styles.activityHeader}>
        <Text style={styles.activityEmoji}>{activityType?.emoji}</Text>
        <View style={styles.activityInfo}>
          <Text style={styles.activityTitle}>{activity.title}</Text>
          <Text style={styles.activityMeta}>
            {DAYS[activity.dayOfWeek]} • {activity.startTime} - {activity.endTime}
          </Text>
        </View>
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

interface ActivityEditorProps {
  activity: ScheduleActivity | null;
  onSave: () => void;
  onCancel: () => void;
  onChange: (activity: ScheduleActivity) => void;
}

const ActivityEditor: React.FC<ActivityEditorProps> = ({
  activity,
  onSave,
  onCancel,
  onChange,
}) => {
  if (!activity) return null;
  const isEditing = activity.id && activity.title; // Check if it's an existing activity

  return (
    <View style={styles.editorContainer}>
      <View style={styles.editorHeader}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.editorTitle}>
          {isEditing ? 'Edit' : 'Add'} Activity
        </Text>
        <TouchableOpacity onPress={onSave} disabled={!activity.title.trim()}>
          <Text
            style={[
              styles.saveText,
              !activity.title.trim() && styles.saveTextDisabled,
            ]}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.editorContent}>
        <Text style={styles.label}>Activity Name</Text>
        <TextInput
          style={styles.textInput}
          value={activity.title}
          onChangeText={text => onChange({ ...activity, title: text })}
          placeholder="e.g., Morning Workout"
          placeholderTextColor={Colors.textLight}
        />

        <Text style={styles.label}>Type</Text>
        <View style={styles.typeSelector}>
          {ACTIVITY_TYPES.map(type => (
            <TouchableOpacity
              key={type.type}
              style={[
                styles.typeButton,
                activity.type === type.type && styles.typeButtonActive,
              ]}
              onPress={() => onChange({ ...activity, type: type.type })}
            >
              <Text style={styles.typeEmoji}>{type.emoji}</Text>
              <Text
                style={[
                  styles.typeLabel,
                  activity.type === type.type && styles.typeLabelActive,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Day of Week</Text>
        <View style={styles.daySelector}>
          {DAYS.map((day, index) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                activity.dayOfWeek === index && styles.dayButtonActive,
              ]}
              onPress={() => onChange({ ...activity, dayOfWeek: index })}
            >
              <Text
                style={[
                  styles.dayText,
                  activity.dayOfWeek === index && styles.dayTextActive,
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Time</Text>
        <View style={styles.timeContainer}>
          <View style={styles.timeInput}>
            <Text style={styles.timeLabel}>Start</Text>
            <TextInput
              style={styles.timeTextInput}
              value={activity.startTime}
              onChangeText={text => onChange({ ...activity, startTime: text })}
              placeholder="09:00"
              placeholderTextColor={Colors.textLight}
            />
          </View>
          <Text style={styles.timeSeparator}>→</Text>
          <View style={styles.timeInput}>
            <Text style={styles.timeLabel}>End</Text>
            <TextInput
              style={styles.timeTextInput}
              value={activity.endTime}
              onChangeText={text => onChange({ ...activity, endTime: text })}
              placeholder="10:00"
              placeholderTextColor={Colors.textLight}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

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
  backButton: {
    ...Typography.body,
    color: Colors.primary,
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  scheduleList: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyText: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  activityCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityEmoji: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    ...Typography.bodyBold,
    color: Colors.text,
    marginBottom: 4,
  },
  activityMeta: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  deleteButton: {
    padding: Spacing.sm,
  },
  deleteButtonText: {
    ...Typography.h3,
    color: Colors.textLight,
  },
  footer: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  addButton: {
    backgroundColor: Colors.backgroundSecondary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  addButtonText: {
    ...Typography.bodyBold,
    color: Colors.primary,
  },
  completeButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  completeButtonText: {
    ...Typography.bodyBold,
    color: '#FFFFFF',
  },
  // Editor styles
  editorContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cancelText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  editorTitle: {
    ...Typography.h3,
    color: Colors.text,
  },
  saveText: {
    ...Typography.bodyBold,
    color: Colors.primary,
  },
  saveTextDisabled: {
    color: Colors.textLight,
  },
  editorContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  label: {
    ...Typography.bodyBold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  textInput: {
    ...Typography.body,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    color: Colors.text,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  typeButton: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  typeEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  typeLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  typeLabelActive: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  daySelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dayButton: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dayButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  dayText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  dayTextActive: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  timeInput: {
    flex: 1,
  },
  timeLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  timeTextInput: {
    ...Typography.body,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    color: Colors.text,
    textAlign: 'center',
  },
  timeSeparator: {
    ...Typography.h3,
    color: Colors.textLight,
    marginTop: 20,
  },
});

