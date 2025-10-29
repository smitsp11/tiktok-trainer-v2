# TikTok Trainer

An AI-powered content creation trainer app that helps you build consistent video reflection habits through gamification, smart scheduling, and context-aware prompts.

## What It Does

- **Schedule Integration**: Add your weekly activities (gym, classes, meetings, study sessions)
- **Smart Prompts**: Get personalized reflection questions after each activity
- **Video Reflections**: Record quick video reflections with the built-in camera
- **Streak Tracking**: Build daily streaks with a GitHub-style 30-day visualization
- **Gamification**: Unlock 10+ badges as you hit milestones
- **Progress Analytics**: Track your consistency with calendar views and detailed stats

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Expo Go](https://expo.dev/go) app on your iOS or Android device

## Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/smitsp11/tiktok-trainer-v2.git
cd tiktok-trainer-v2
```

2. **Clean install dependencies** (important - avoids version conflicts)
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --force
```

3. **Start the development server**
```bash
npm start
```

4. **Run on your device**
   - Install **Expo Go** from the App Store (iOS) or Google Play (Android)
   - Scan the QR code shown in your terminal with:
     - **iOS**: Camera app
     - **Android**: Expo Go app
   - The app will load on your device

## Troubleshooting

### Dependency Conflicts
If you see ERESOLVE errors during installation:
```bash
rm -rf node_modules package-lock.json
npm install --force
```

### Missing Babel Plugin
If you see "Cannot find module 'babel-plugin-module-resolver'":
```bash
npm install --save-dev babel-plugin-module-resolver
```

### Asset Warnings
Asset warnings about missing icons can be safely ignored - the app will still run. Default placeholder icons are included.

### Package Version Warnings
The app is configured for Expo SDK 54. Version warnings can be safely ignored if the app runs correctly.

## First Run

When you first launch the app:
1. **Welcome Screen** - Learn about the features
2. **Enter Your Name** - Personalize your experience
3. **Build Your Schedule** - Add weekly activities
4. **Start Reflecting** - Record your first video!

## Tech Stack

- React Native with Expo SDK 54
- TypeScript
- Zustand (state management)
- React Navigation
- Expo Camera, Notifications, AV
- AsyncStorage

---

Built using React Native and Expo

