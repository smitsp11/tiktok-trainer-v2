# Architecture Documentation

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     TikTok Trainer App                       │
│                    (React Native + Expo)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    App.tsx (Root)                            │
│  • SafeAreaProvider                                          │
│  • NavigationContainer                                       │
│  • RootNavigator                                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│               Navigation Layer                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  RootNavigator (Stack)                              │   │
│  │  • Checks onboarding status                         │   │
│  │  • Routes to appropriate flow                       │   │
│  └─────────────────────────────────────────────────────┘   │
│           │                            │                     │
│           ▼                            ▼                     │
│  ┌─────────────────┐        ┌─────────────────┐           │
│  │  Onboarding     │        │   Main Tabs     │           │
│  │  (Stack)        │        │   (Bottom Tabs) │           │
│  └─────────────────┘        └─────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App.tsx
└── NavigationContainer
    └── RootNavigator
        ├── OnboardingFlow (if not completed)
        │   ├── WelcomeScreen
        │   ├── NameInputScreen
        │   └── ScheduleSetupScreen
        │
        └── MainTabs (if onboarding complete)
            ├── Home Tab
            │   └── DashboardScreen
            │       ├── StreakTracker
            │       ├── PromptCard (multiple)
            │       └── StatCard (multiple)
            │
            ├── Progress Tab
            │   └── ProgressScreen
            │       ├── Calendar
            │       ├── StatCard (multiple)
            │       └── ReflectionItem (multiple)
            │
            ├── Badges Tab
            │   └── BadgesScreen
            │       ├── FilterTab (multiple)
            │       └── BadgeCard (multiple)
            │
            └── Settings Tab
                └── SettingsScreen
                    ├── SettingRow (multiple)
                    └── SettingRowWithSwitch (multiple)
```

## State Management Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    Global State (Zustand)                     │
│                      useAppStore.ts                           │
├──────────────────────────────────────────────────────────────┤
│  State:                                                       │
│  • onboarding: OnboardingState                               │
│  • schedule: ScheduleActivity[]                              │
│  • prompts: Prompt[]                                         │
│  • reflections: Reflection[]                                 │
│  • badges: Badge[]                                           │
│  • streakData: StreakData                                    │
│  • preferences: UserPreferences                              │
├──────────────────────────────────────────────────────────────┤
│  Actions:                                                     │
│  • initializeApp()                                           │
│  • completeOnboarding()                                      │
│  • addReflection()                                           │
│  • refreshPrompts()                                          │
│  • checkAndUpdateBadges()                                    │
│  • updatePreferences()                                       │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    Persistence Layer                          │
│                    (AsyncStorage)                             │
├──────────────────────────────────────────────────────────────┤
│  Keys:                                                        │
│  • @onboarding                                               │
│  • @schedule                                                 │
│  • @reflections                                              │
│  • @badges                                                   │
│  • @streak                                                   │
│  • @preferences                                              │
│  • @prompts                                                  │
└──────────────────────────────────────────────────────────────┘
```

## Service Layer Architecture

```
┌────────────────────────────────────────────────────────────┐
│                     Services Layer                          │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  storage.ts                                         │  │
│  │  • getOnboardingState()                            │  │
│  │  • saveReflection()                                │  │
│  │  • getSchedule()                                   │  │
│  │  • updatePreferences()                             │  │
│  └─────────────────────────────────────────────────────┘  │
│                          │                                  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  promptService.ts                                   │  │
│  │  • generatePromptsForSchedule()                    │  │
│  │  • getUpcomingPrompts()                            │  │
│  │  • shouldTriggerPrompt()                           │  │
│  └─────────────────────────────────────────────────────┘  │
│                          │                                  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  streakService.ts                                   │  │
│  │  • calculateStreak()                               │  │
│  │  • getStreakPercentage()                           │  │
│  │  • getStreakEmoji()                                │  │
│  └─────────────────────────────────────────────────────┘  │
│                          │                                  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  badgeService.ts                                    │  │
│  │  • checkBadgeUnlocks()                             │  │
│  │  • getNewlyUnlockedBadges()                        │  │
│  └─────────────────────────────────────────────────────┘  │
│                          │                                  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  notificationService.ts                             │  │
│  │  • requestNotificationPermissions()                │  │
│  │  • schedulePromptNotification()                    │  │
│  │  • sendImmediateNotification()                     │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Onboarding Flow

```
User Opens App
      │
      ▼
┌─────────────┐
│ Initialize  │
│     App     │
└─────────────┘
      │
      ▼
  Onboarding
  Complete?
      │
      ├─── No ──────────┐
      │                 ▼
      │         ┌──────────────┐
      │         │   Welcome    │
      │         │    Screen    │
      │         └──────────────┘
      │                 │
      │                 ▼
      │         ┌──────────────┐
      │         │  Name Input  │
      │         │    Screen    │
      │         └──────────────┘
      │                 │
      │                 ▼
      │         ┌──────────────┐
      │         │   Schedule   │
      │         │    Setup     │
      │         └──────────────┘
      │                 │
      │                 ▼
      │         Save to Storage
      │                 │
      └─── Yes ─────────┴──────┐
                                ▼
                        ┌──────────────┐
                        │  Dashboard   │
                        │    Screen    │
                        └──────────────┘
```

### 2. Reflection Recording Flow

```
User on Dashboard
      │
      ▼
Sees Upcoming Prompt
      │
      ▼
Taps Prompt Card
      │
      ▼
┌─────────────────┐
│  Camera Screen  │
│   Opens (Modal) │
└─────────────────┘
      │
      ▼
  Permission
  Granted?
      │
      ├─── No ──────> Show Permission UI
      │
      └─── Yes ─────┐
                    ▼
              ┌────────────┐
              │   Record   │
              │   Video    │
              └────────────┘
                    │
                    ▼
              ┌────────────┐
              │  Preview   │
              │   Video    │
              └────────────┘
                    │
                    ▼
                Accept?
                    │
      ┌─────────────┼─────────────┐
      │ No          │ Yes         │
      ▼             ▼             │
   Retake      Save to Storage    │
                    │              │
                    ▼              │
           Update Reflection[]     │
                    │              │
                    ▼              │
         Calculate New Streak      │
                    │              │
                    ▼              │
        Check Badge Unlocks        │
                    │              │
                    ▼              │
          Update Prompts[]         │
                    │              │
                    ▼              │
           Show Success            │
                    │              │
                    ▼              │
         Return to Dashboard       │
                                   │
      └────────────────────────────┘
```

### 3. Badge Unlock Flow

```
User Completes Action
      │
      ▼
┌───────────────────┐
│  Store Action     │
│  (addReflection)  │
└───────────────────┘
      │
      ▼
┌───────────────────┐
│ Calculate Streak  │
└───────────────────┘
      │
      ▼
┌───────────────────┐
│Check Badge Logic  │
│ (badgeService)    │
└───────────────────┘
      │
      ▼
  New Badge
  Unlocked?
      │
      ├─── No ────> Update Progress Only
      │
      └─── Yes ───┐
                  ▼
         ┌─────────────────┐
         │  Update Badge   │
         │  unlockAt Date  │
         └─────────────────┘
                  │
                  ▼
         ┌─────────────────┐
         │Send Notification│
         │  "Badge Earned!"│
         └─────────────────┘
                  │
                  ▼
         ┌─────────────────┐
         │  Update UI      │
         │  Show Badge     │
         └─────────────────┘
```

## Module Dependencies

```
┌──────────────────────────────────────────────────────────┐
│                    App Entry Point                        │
│                       App.tsx                             │
└──────────────────────────────────────────────────────────┘
                          │
           ┌──────────────┼──────────────┐
           ▼              ▼              ▼
    ┌───────────┐  ┌───────────┐  ┌───────────┐
    │Navigation │  │   Store   │  │  Screens  │
    └───────────┘  └───────────┘  └───────────┘
           │              │              │
           │              │              ▼
           │              │        ┌───────────┐
           │              │        │Components │
           │              │        └───────────┘
           │              │              │
           │              ▼              ▼
           │        ┌────────────────────────┐
           └───────>│      Services          │
                    │  • storage             │
                    │  • prompts             │
                    │  • streaks             │
                    │  • badges              │
                    │  • notifications       │
                    └────────────────────────┘
                              │
                              ▼
                    ┌────────────────────────┐
                    │     Constants          │
                    │  • theme               │
                    │  • badges              │
                    │  • prompts             │
                    └────────────────────────┘
                              │
                              ▼
                    ┌────────────────────────┐
                    │       Types            │
                    └────────────────────────┘
```

## External Dependencies

```
┌──────────────────────────────────────────────────────────┐
│                 External Libraries                        │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  React Native Ecosystem                                  │
│  ├─ react-native         (UI framework)                 │
│  ├─ react                (component library)             │
│  └─ expo                 (development platform)          │
│                                                           │
│  Navigation                                              │
│  ├─ @react-navigation/native                            │
│  ├─ @react-navigation/native-stack                      │
│  └─ @react-navigation/bottom-tabs                       │
│                                                           │
│  State Management                                        │
│  └─ zustand              (lightweight state)            │
│                                                           │
│  Storage                                                 │
│  └─ @react-native-async-storage/async-storage          │
│                                                           │
│  Media                                                   │
│  ├─ expo-camera          (video recording)              │
│  └─ expo-av              (video playback)               │
│                                                           │
│  Notifications                                           │
│  └─ expo-notifications   (push notifications)           │
│                                                           │
│  UI Components                                           │
│  ├─ react-native-calendars                              │
│  ├─ expo-linear-gradient                                │
│  └─ react-native-safe-area-context                      │
│                                                           │
│  Utilities                                               │
│  └─ date-fns             (date manipulation)            │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

## Storage Schema

```
AsyncStorage Keys & Data Structure:

@onboarding
{
  completed: boolean,
  currentStep: number,
  userName: string,
  weeklySchedule: ScheduleActivity[]
}

@schedule
[
  {
    id: string,
    title: string,
    type: ActivityType,
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    location?: string,
    description?: string
  },
  ...
]

@reflections
[
  {
    id: string,
    promptId: string,
    videoUri: string,
    duration: number,
    createdAt: Date,
    transcription?: string,
    mood?: string
  },
  ...
]

@badges
[
  {
    id: string,
    name: string,
    description: string,
    icon: string,
    unlockedAt?: Date,
    requirement: string,
    progress: number,
    total: number
  },
  ...
]

@streak
{
  currentStreak: number,
  longestStreak: number,
  totalReflections: number,
  reflectionDates: string[]
}

@preferences
{
  notifications: {
    enabled: boolean,
    promptBeforeActivity: number,
    promptAfterActivity: number,
    reminderTime?: string
  },
  favoritePromptTypes: ActivityType[],
  videoDuration: number,
  darkMode: boolean
}

@prompts
[
  {
    id: string,
    activityId: string,
    activityTitle: string,
    question: string,
    scheduledTime: Date,
    completed: boolean,
    contextType: ActivityType
  },
  ...
]
```

## Event Flow

```
App Lifecycle Events:

1. App Launch
   → initializeApp()
   → Load all data from AsyncStorage
   → Check onboarding status
   → Request notification permissions
   → Navigate to appropriate screen

2. User Completes Reflection
   → Save video to local storage
   → Create Reflection object
   → Add to reflections array
   → Recalculate streak
   → Check badge unlocks
   → Update UI
   → Schedule next notifications

3. Daily Prompt Trigger
   → Check schedule
   → Find completed activities
   → Generate context-aware prompt
   → Send push notification
   → User taps notification
   → Navigate to Camera screen

4. Badge Unlock
   → User action triggers check
   → Compare progress to requirements
   → Update badge unlock timestamp
   → Send celebration notification
   → Show badge in UI
   → Update badge progress

5. Background Tasks
   → Schedule notifications (on app launch)
   → Update streaks (on midnight)
   → Cleanup old data (if needed)
```

## Security & Privacy

```
┌──────────────────────────────────────────────────────────┐
│                  Privacy Architecture                     │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Data Storage:          Local Only (AsyncStorage)        │
│  Video Files:           Device File System              │
│  User Data:             Never leaves device             │
│  Analytics:             None by default                 │
│  Tracking:              No tracking                     │
│                                                           │
│  Permissions:                                            │
│  ├─ Camera             Required for recording           │
│  ├─ Microphone         Required for video audio         │
│  └─ Notifications      Optional for prompts             │
│                                                           │
│  Network Access:        None (offline-first)            │
│  API Calls:             None in v1.0                    │
│  Third-party SDKs:      None (except Expo)              │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

## Performance Considerations

```
┌──────────────────────────────────────────────────────────┐
│              Performance Optimizations                    │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  React Optimizations:                                    │
│  ├─ Functional components                               │
│  ├─ React.memo for expensive components                 │
│  ├─ useCallback for event handlers                      │
│  └─ useMemo for computed values                         │
│                                                           │
│  Navigation:                                             │
│  ├─ Screen lazy loading                                 │
│  ├─ Modal presentation for Camera                       │
│  └─ Tab navigation for instant switching                │
│                                                           │
│  Data Management:                                        │
│  ├─ Zustand for minimal re-renders                      │
│  ├─ Batched AsyncStorage operations                     │
│  ├─ Debounced search/filter                            │
│  └─ Cached calculations (streaks, badges)               │
│                                                           │
│  Media:                                                  │
│  ├─ Video compression                                   │
│  ├─ Thumbnail generation (future)                       │
│  └─ Lazy video loading                                  │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

**Architecture designed for scalability, maintainability, and performance! 🚀**

