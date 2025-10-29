import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Video, ResizeMode } from 'expo-av';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { useAppStore } from '../store/useAppStore';
import { Reflection } from '../types';
import { sendImmediateNotification } from '../services/notificationService';

const { width, height } = Dimensions.get('window');

interface CameraScreenProps {
  route: any;
  navigation: any;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({ route, navigation }) => {
  const { promptId } = route.params || {};
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const cameraRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { prompts, addReflection, checkAndUpdateBadges } = useAppStore();
  const prompt = prompts.find(p => p.id === promptId);

  const maxDuration = 60; // 60 seconds

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need camera access to record your reflections
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const startRecording = async () => {
    if (!cameraRef.current || isRecording) return;

    try {
      setIsRecording(true);
      setRecordingDuration(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => {
          const next = prev + 1;
          if (next >= maxDuration) {
            stopRecording();
          }
          return next;
        });
      }, 1000);

      const video = await cameraRef.current.recordAsync({
        maxDuration,
      });

      setRecordedVideo(video.uri);
    } catch (error) {
      console.error('Error recording video:', error);
      Alert.alert('Error', 'Failed to record video');
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const discardVideo = () => {
    setRecordedVideo(null);
    setRecordingDuration(0);
  };

  const saveReflection = async () => {
    if (!recordedVideo || !prompt) return;

    const reflection: Reflection = {
      id: Date.now().toString(),
      promptId: prompt.id,
      videoUri: recordedVideo,
      duration: recordingDuration,
      createdAt: new Date(),
    };

    await addReflection(reflection);

    // Check for new badges
    const badges = await checkAndUpdateBadges();
    const newlyUnlocked = badges.filter(
      b => b.unlockedAt && new Date(b.unlockedAt).getTime() > Date.now() - 5000
    );

    if (newlyUnlocked.length > 0) {
      await sendImmediateNotification(
        '🎉 Badge Unlocked!',
        `You earned: ${newlyUnlocked[0].name}`,
        { badgeId: newlyUnlocked[0].id }
      );
    }

    navigation.goBack();
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (recordedVideo) {
    return (
      <View style={styles.container}>
        <Video
          source={{ uri: recordedVideo }}
          style={styles.preview}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
        />

        <View style={styles.previewOverlay}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>Review Your Reflection</Text>
            {prompt && (
              <Text style={styles.previewPrompt}>{prompt.question}</Text>
            )}
          </View>

          <View style={styles.previewActions}>
            <TouchableOpacity
              style={[styles.previewButton, styles.discardButton]}
              onPress={discardVideo}
            >
              <Text style={styles.previewButtonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.previewButton, styles.saveButton]}
              onPress={saveReflection}
            >
              <Text style={styles.previewButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
      >
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            {prompt && (
              <View style={styles.promptContainer}>
                <Text style={styles.promptText}>{prompt.question}</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.flipButtonText}>🔄</Text>
            </TouchableOpacity>
          </View>

          {/* Recording indicator */}
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>
                {formatDuration(recordingDuration)} / {formatDuration(maxDuration)}
              </Text>
            </View>
          )}

          {/* Bottom controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={[
                styles.recordButton,
                isRecording && styles.recordButtonActive,
              ]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <View
                style={[
                  styles.recordButtonInner,
                  isRecording && styles.recordButtonInnerActive,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.background,
  },
  permissionText: {
    ...Typography.body,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  permissionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  permissionButtonText: {
    ...Typography.bodyBold,
    color: '#FFFFFF',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    ...Typography.h3,
    color: '#FFFFFF',
  },
  promptContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.md,
  },
  promptText: {
    ...Typography.body,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  flipButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipButtonText: {
    fontSize: 24,
  },
  recordingIndicator: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginRight: Spacing.sm,
  },
  recordingText: {
    ...Typography.bodyBold,
    color: '#FFFFFF',
  },
  controls: {
    paddingBottom: 60,
    alignItems: 'center',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButtonActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  recordButtonInnerActive: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#EF4444',
  },
  preview: {
    flex: 1,
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    paddingTop: 60,
    paddingBottom: 60,
  },
  previewHeader: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  previewTitle: {
    ...Typography.h3,
    color: '#FFFFFF',
    marginBottom: Spacing.sm,
  },
  previewPrompt: {
    ...Typography.body,
    color: 'rgba(255,255,255,0.8)',
  },
  previewActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  previewButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  discardButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  previewButtonText: {
    ...Typography.bodyBold,
    color: '#FFFFFF',
  },
});

