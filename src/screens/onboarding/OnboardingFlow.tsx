import React, { useState } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { NameInputScreen } from './NameInputScreen';
import { ScheduleSetupScreen } from './ScheduleSetupScreen';
import { ScheduleActivity } from '../../types';
import { useAppStore } from '../../store/useAppStore';

export const OnboardingFlow: React.FC = () => {
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState('');
  const completeOnboarding = useAppStore(state => state.completeOnboarding);

  const handleWelcomeNext = () => {
    setStep(1);
  };

  const handleNameNext = (name: string) => {
    setUserName(name);
    setStep(2);
  };

  const handleScheduleComplete = async (schedule: ScheduleActivity[]) => {
    await completeOnboarding(schedule, userName);
  };

  const handleBackToWelcome = () => {
    setStep(0);
  };

  const handleBackToName = () => {
    setStep(1);
  };

  if (step === 0) {
    return <WelcomeScreen onNext={handleWelcomeNext} />;
  }

  if (step === 1) {
    return <NameInputScreen onNext={handleNameNext} onBack={handleBackToWelcome} />;
  }

  return <ScheduleSetupScreen onComplete={handleScheduleComplete} onBack={handleBackToName} />;
};

