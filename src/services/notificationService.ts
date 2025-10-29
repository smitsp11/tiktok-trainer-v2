import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Prompt } from '../types';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permission denied');
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6366F1',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

export const schedulePromptNotification = async (prompt: Prompt): Promise<string | null> => {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📹 Time to reflect!',
        body: prompt.question,
        data: { promptId: prompt.id, activityTitle: prompt.activityTitle },
        sound: true,
      },
      trigger: {
        date: prompt.scheduledTime,
      },
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

export const scheduleAllPromptNotifications = async (prompts: Prompt[]): Promise<void> => {
  try {
    // Cancel all existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule new ones
    for (const prompt of prompts) {
      if (!prompt.completed) {
        await schedulePromptNotification(prompt);
      }
    }
  } catch (error) {
    console.error('Error scheduling all notifications:', error);
  }
};

export const sendImmediateNotification = async (
  title: string,
  body: string,
  data?: any
): Promise<void> => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.error('Error sending immediate notification:', error);
  }
};

export const cancelNotification = async (notificationId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
};

