import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

const { width } = Dimensions.get('window');

interface WelcomeScreenProps {
  onNext: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  return (
    <LinearGradient
      colors={[Colors.primary, Colors.primaryDark]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>🎬</Text>
        <Text style={styles.title}>Welcome to TikTok Trainer</Text>
        <Text style={styles.subtitle}>
          Your AI-powered personal trainer for content creation
        </Text>

        <View style={styles.featuresContainer}>
          <FeatureItem
            emoji="📅"
            title="Smart Scheduling"
            description="Integrate your weekly schedule for personalized prompts"
          />
          <FeatureItem
            emoji="📹"
            title="Quick Reflections"
            description="Capture your thoughts with easy video recording"
          />
          <FeatureItem
            emoji="🔥"
            title="Build Streaks"
            description="Stay consistent and earn badges for your progress"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={onNext}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

interface FeatureItemProps {
  emoji: string;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ emoji, title, description }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureEmoji}>{emoji}</Text>
    <View style={styles.featureText}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 100,
    paddingBottom: 60,
    paddingHorizontal: Spacing.lg,
  },
  content: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  featuresContainer: {
    width: '100%',
    gap: Spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  featureEmoji: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...Typography.bodyBold,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDescription: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  buttonText: {
    ...Typography.bodyBold,
    color: Colors.primary,
  },
});

