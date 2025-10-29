# Assets Directory

This directory should contain the following image files for your app:

## Required Assets

1. **icon.png** (1024x1024px)
   - Main app icon
   - Should be a square PNG with no transparency for iOS
   - Used for both iOS and Android

2. **splash.png** (1284x2778px)
   - Splash screen shown while app loads
   - Should be centered on a white background

3. **adaptive-icon.png** (1024x1024px)
   - Android adaptive icon
   - Should have a transparent background
   - Keep important elements in the center safe zone (512x512px)

4. **favicon.png** (48x48px)
   - Web favicon
   - Small icon for browser tab

5. **notification-icon.png** (Optional)
   - Android notification icon
   - Should be white on transparent background
   - 96x96px recommended

## Quick Setup

You can use any of these methods to create your assets:

### Method 1: Use Online Generators
- [App Icon Generator](https://www.appicon.co/) - Generate all sizes from one image
- [Expo Asset Generator](https://www.npmjs.com/package/expo-asset-generator)

### Method 2: Use Figma/Photoshop
- Design your icon at 1024x1024px
- Export as PNG
- Create variations for splash screen

### Method 3: Temporary Placeholders
For testing, you can use simple colored squares with text:
- Create a 1024x1024 image with your app name
- Use a solid background color (e.g., #6366F1)
- Add white text in the center

## Design Tips

- Keep it simple and recognizable
- Use your brand colors
- Test on both light and dark backgrounds
- Ensure icon is visible at small sizes (60x60px)
- Avoid text in icons (hard to read when small)

## Example Icon Ideas

For TikTok Trainer, you could use:
- 🎬 Camera emoji on gradient background
- 🔥 Fire emoji (represents streaks)
- 📊 Graph showing growth
- ⚡ Lightning bolt (energy/motivation)

Once you have your assets, place them in this directory and rebuild the app!

