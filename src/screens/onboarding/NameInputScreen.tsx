import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

interface NameInputScreenProps {
  onNext: (name: string) => void;
  onBack: () => void;
}

export const NameInputScreen: React.FC<NameInputScreenProps> = ({ onNext, onBack }) => {
  const [name, setName] = useState('');

  const handleNext = () => {
    if (name.trim()) {
      onNext(name.trim());
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.emoji}>👋</Text>
        <Text style={styles.title}>What's your name?</Text>
        <Text style={styles.subtitle}>
          Let's personalize your experience
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor={Colors.textLight}
          value={name}
          onChangeText={setName}
          autoFocus
          returnKeyType="next"
          onSubmitEditing={handleNext}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, !name.trim() && styles.buttonDisabled]}
        onPress={handleNext}
        disabled={!name.trim()}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: Spacing.lg,
  },
  content: {
    flex: 1,
  },
  backButton: {
    marginBottom: Spacing.xl,
  },
  backButtonText: {
    ...Typography.body,
    color: Colors.primary,
  },
  emoji: {
    fontSize: 80,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  input: {
    ...Typography.h2,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    paddingVertical: Spacing.md,
    textAlign: 'center',
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.borderLight,
  },
  buttonText: {
    ...Typography.bodyBold,
    color: '#FFFFFF',
  },
});

