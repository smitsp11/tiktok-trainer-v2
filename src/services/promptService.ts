import { ScheduleActivity, Prompt, ActivityType } from '../types';
import { getRandomPrompt } from '../constants/prompts';
import { format, addMinutes, parse, isBefore, isAfter, startOfDay } from 'date-fns';

export const generatePromptsForSchedule = (
  schedule: ScheduleActivity[],
  afterMinutes: number = 15
): Prompt[] => {
  const prompts: Prompt[] = [];
  const today = new Date();
  const currentDayOfWeek = today.getDay();

  // Generate prompts for activities happening today
  const todayActivities = schedule.filter(a => a.dayOfWeek === currentDayOfWeek);

  todayActivities.forEach(activity => {
    const activityEndTime = parse(activity.endTime, 'HH:mm', today);
    const promptTime = addMinutes(activityEndTime, afterMinutes);

    // Only create prompts for future activities
    if (isAfter(promptTime, today)) {
      const prompt: Prompt = {
        id: `${activity.id}-${format(promptTime, 'yyyy-MM-dd-HH-mm')}`,
        activityId: activity.id,
        activityTitle: activity.title,
        question: getRandomPrompt(activity.type),
        scheduledTime: promptTime,
        completed: false,
        contextType: activity.type,
      };
      prompts.push(prompt);
    }
  });

  return prompts;
};

export const getUpcomingPrompts = (prompts: Prompt[], limit: number = 5): Prompt[] => {
  const now = new Date();
  return prompts
    .filter(p => !p.completed && isAfter(p.scheduledTime, now))
    .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime())
    .slice(0, limit);
};

export const getTodaysPrompts = (prompts: Prompt[]): Prompt[] => {
  const today = startOfDay(new Date());
  return prompts.filter(p => {
    const promptDay = startOfDay(p.scheduledTime);
    return promptDay.getTime() === today.getTime();
  });
};

export const shouldTriggerPrompt = (prompt: Prompt): boolean => {
  const now = new Date();
  const timeDiff = prompt.scheduledTime.getTime() - now.getTime();
  // Trigger if within 5 minutes of scheduled time
  return timeDiff <= 5 * 60 * 1000 && timeDiff >= -5 * 60 * 1000 && !prompt.completed;
};

