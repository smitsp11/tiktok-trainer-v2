import { ActivityType } from '../types';

export const PROMPT_TEMPLATES: Record<ActivityType, string[]> = {
  gym: [
    "How did your workout feel today?",
    "What exercise challenged you the most?",
    "Did you hit a new personal record?",
    "What's your energy level after this workout?",
    "Share one thing you're proud of from today's session!",
    "How are you feeling physically after this workout?",
  ],
  class: [
    "What was the most interesting thing you learned today?",
    "Share a key takeaway from your class!",
    "What concept are you still thinking about?",
    "Did anything surprise you in today's lesson?",
    "What question do you still have?",
    "How would you explain today's topic to a friend?",
  ],
  meeting: [
    "What was decided in this meeting?",
    "Share the most valuable insight from the discussion!",
    "What action items did you take away?",
    "How productive was this meeting on a scale of 1-10?",
    "What could have made this meeting better?",
  ],
  study: [
    "What topic did you cover in your study session?",
    "Share one thing that finally clicked for you!",
    "What's still confusing that you need to review?",
    "How focused were you during this session?",
    "What study technique worked best today?",
  ],
  other: [
    "How did this activity go?",
    "What did you take away from this experience?",
    "Share a quick reflection on what just happened!",
    "How are you feeling right now?",
    "What's one word to describe this activity?",
  ],
};

export const getRandomPrompt = (activityType: ActivityType): string => {
  const prompts = PROMPT_TEMPLATES[activityType];
  return prompts[Math.floor(Math.random() * prompts.length)];
};

export const MOTIVATIONAL_MESSAGES = [
  "You're building great habits! 🌟",
  "Consistency is key! Keep it up! 💪",
  "Your future self will thank you! 🚀",
  "Small steps, big progress! 👏",
  "You're on fire! 🔥",
  "Building momentum every day! ⚡",
];

