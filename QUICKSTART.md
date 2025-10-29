# Quick Start Guide

## Installation & Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Replace Placeholder Assets

Before running the app, replace these placeholder image files with actual images:

- `assets/icon.png` - 1024x1024px app icon
- `assets/splash.png` - 1284x2778px splash screen
- `assets/adaptive-icon.png` - 1024x1024px Android adaptive icon
- `assets/favicon.png` - 48x48px web favicon
- `assets/notification-icon.png` - For Android notifications (optional)

You can use tools like:
- [App Icon Generator](https://www.appicon.co/)
- [Figma](https://www.figma.com/) for custom designs
- Or temporarily use emoji-based icons from free icon libraries

### Step 3: Start Development Server

```bash
npm start
```

This will open Expo DevTools in your browser.

### Step 4: Run on Your Device

#### Option A: Physical Device
1. Install **Expo Go** app on your iOS/Android device
2. Scan the QR code shown in the terminal or browser
3. The app will load on your device

#### Option B: iOS Simulator (Mac only)
```bash
npm run ios
```

#### Option C: Android Emulator
```bash
npm run android
```

## First Run Experience

When you first launch the app, you'll go through:

1. **Welcome Screen** - Introduction to the app
2. **Name Input** - Personalize your experience
3. **Schedule Setup** - Add your weekly activities
4. **Dashboard** - Start your reflection journey!

## Testing the App

### Add Sample Activities

Try adding these activities to your schedule:
- **Gym**: Monday, 7:00 AM - 8:00 AM
- **Class**: Tuesday & Thursday, 10:00 AM - 11:30 AM
- **Study**: Daily, 7:00 PM - 8:00 PM

### Test Recording

1. Navigate to the Dashboard
2. Tap on any prompt
3. Record a short video reflection
4. Save and watch your streak grow!

### Explore Features

- **Dashboard Tab**: View streaks and upcoming prompts
- **Progress Tab**: Check your calendar and stats
- **Badges Tab**: Track your achievements
- **Settings Tab**: Customize notifications and schedule

## Troubleshooting

### Camera Permission Issues

If camera doesn't work:
1. Go to device Settings
2. Find the Expo Go app
3. Enable Camera and Microphone permissions

### Notifications Not Appearing

1. Enable notifications in device settings
2. In app Settings tab, toggle "Enable Notifications"
3. Ensure notification permissions are granted to Expo Go

### App Crashes on Startup

1. Clear Expo cache:
```bash
expo start -c
```

2. Reinstall dependencies:
```bash
rm -rf node_modules
npm install
```

### Module Resolution Errors

If you get module resolution errors with the `@/` path alias:

1. Ensure `babel.config.js` is properly configured
2. Clear Metro bundler cache:
```bash
expo start -c
```

## Development Tips

### Hot Reload

The app supports hot reloading. Just save your files and see changes instantly!

### Debugging

- Shake your device to open developer menu
- Enable "Remote JS Debugging" for Chrome DevTools
- Use `console.log()` for debugging (visible in terminal)

### Storage Inspection

All data is stored locally using AsyncStorage. To reset:
1. Delete the app
2. Reinstall
3. Or add a "Clear Data" button in Settings

## Building for Production

### iOS

```bash
expo build:ios
```

Follow Expo's guide for Apple Developer account setup.

### Android

```bash
expo build:android
```

This will generate an APK or AAB file for Google Play Store.

## Customization Quick Tips

### Change Colors

Edit `src/constants/theme.ts`:
```typescript
export const Colors = {
  primary: '#6366F1', // Change this!
  // ...
};
```

### Add New Prompts

Edit `src/constants/prompts.ts`:
```typescript
gym: [
  "Your new prompt here!",
  // ...
],
```

### Adjust Notification Timing

In `src/store/useAppStore.ts`, modify the default:
```typescript
promptAfterActivity: 15, // minutes
```

## Next Steps

1. **Customize the theme** to match your brand
2. **Add more badge achievements**
3. **Create custom activity types**
4. **Implement cloud sync** (Firebase, Supabase)
5. **Add social features** for sharing reflections

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://reactnativepaper.com/)

## Need Help?

- Check the main README.md for detailed documentation
- Review code comments in each file
- Open an issue on GitHub

---

Happy reflecting! 🎬✨

