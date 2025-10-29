# TikTok Trainer - AI Content Trainer App

A comprehensive mobile application that helps users build a consistent video reflection habit through gamification, context-aware prompts, and progress tracking.

## Features

### 🎯 Smart Onboarding
- Personalized welcome flow
- Weekly schedule integration
- Activity-based prompt generation

### 📱 Main Dashboard
- GitHub-style streak tracker (30-day visualization)
- Upcoming contextual prompts
- Quick stats overview
- Badge progress display

### 🎬 Video Recording
- Embedded camera with front/back toggle
- Up to 60-second video reflections
- Real-time recording timer
- Preview and retake options

### 📊 Progress Tracking
- Interactive calendar with reflection markers
- Detailed analytics (monthly, weekly averages)
- Activity history timeline
- Comprehensive stats display

### 🏆 Gamification
- 10+ unique badges to unlock
- Streak-based achievements
- Activity-specific milestones
- Progress bars for locked badges

### 🔔 Smart Notifications
- Context-aware prompts after activities
- Customizable notification timing
- Badge unlock celebrations
- Non-intrusive reminder system

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Zustand** for state management
- **React Navigation** for routing
- **Expo Camera** for video recording
- **Expo Notifications** for push notifications
- **AsyncStorage** for local data persistence
- **date-fns** for date manipulation
- **react-native-calendars** for calendar views

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

### Installation

1. Clone the repository:
```bash
cd tiktok-trainer-v2
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on iOS:
```bash
npm run ios
```

5. Run on Android:
```bash
npm run android
```

## Project Structure

```
tiktok-trainer-v2/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── BadgeCard.tsx
│   │   ├── PromptCard.tsx
│   │   └── StreakTracker.tsx
│   ├── constants/           # App constants and theme
│   │   ├── badges.ts
│   │   ├── prompts.ts
│   │   └── theme.ts
│   ├── navigation/          # Navigation configuration
│   │   └── RootNavigator.tsx
│   ├── screens/             # App screens
│   │   ├── onboarding/     # Onboarding flow
│   │   ├── BadgesScreen.tsx
│   │   ├── CameraScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── ProgressScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/            # Business logic services
│   │   ├── badgeService.ts
│   │   ├── notificationService.ts
│   │   ├── promptService.ts
│   │   ├── storage.ts
│   │   └── streakService.ts
│   ├── store/               # State management
│   │   └── useAppStore.ts
│   └── types/               # TypeScript definitions
│       └── index.ts
├── App.tsx
├── app.json
├── package.json
└── tsconfig.json
```

## Key Features Explained

### Context-Aware Prompts

The app generates intelligent prompts based on your schedule:
- **Gym**: "How did your workout feel today?"
- **Class**: "What was the most interesting thing you learned?"
- **Meeting**: "Share the most valuable insight from the discussion!"
- **Study**: "What topic did you cover in your study session?"

### Streak System

- Tracks daily video reflections
- Visualizes 30-day activity history
- Calculates current and longest streaks
- Shows progress with dynamic emojis (🌱 → 🌿 → 🌳 → 🔥 → ⚡)

### Badge System

Achievements include:
- **First Steps**: Record your first reflection
- **Week Warrior**: Maintain a 7-day streak
- **Consistent Creator**: 5 reflections in one week
- **Monthly Master**: 30-day streak
- **Centurion**: 100 total reflections
- And more!

## User Flow

1. **Onboarding**
   - Welcome screen with app introduction
   - Name input for personalization
   - Schedule setup (add weekly activities)

2. **Daily Usage**
   - View upcoming prompts on dashboard
   - Receive notifications after scheduled activities
   - Open camera to record reflection
   - Review and save video
   - Track streak and unlock badges

3. **Progress Review**
   - Check calendar for reflection history
   - View detailed analytics
   - Explore unlocked badges
   - Adjust settings and schedule

## Customization

### Adding New Activity Types

Edit `src/types/index.ts`:
```typescript
export type ActivityType = 'gym' | 'class' | 'meeting' | 'study' | 'custom' | 'other';
```

Add prompts in `src/constants/prompts.ts`:
```typescript
export const PROMPT_TEMPLATES: Record<ActivityType, string[]> = {
  custom: [
    "Your custom prompt here",
    // ...
  ],
};
```

### Creating New Badges

Add to `src/constants/badges.ts`:
```typescript
{
  id: 'unique-badge-id',
  name: 'Badge Name',
  description: 'Badge description',
  icon: '🎉',
  requirement: 'Complete X reflections',
  total: X,
}
```

Implement unlock logic in `src/services/badgeService.ts`.

## Future Enhancements

- [ ] Cloud sync for multi-device support
- [ ] Video transcription and AI insights
- [ ] Social features (share reflections)
- [ ] Advanced analytics and trends
- [ ] Custom activity types and prompts
- [ ] Export reflections as montage video
- [ ] Integration with calendar apps
- [ ] Mood tracking over time

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using React Native and Expo

