export type EmotionType = 
  | 'Scared' 
  | 'Embarrassed' 
  | 'Angry' 
  | 'Hopeful' 
  | 'Confused' 
  | 'Sad' 
  | 'Frustrated'
  | 'Neutral';

export interface EmotionDetection {
  primary_emotion: EmotionType;
  intensity: number; // 1-10
  opening_acknowledgment: string;
}

interface EmotionTheme {
  bgClass: string;
  textClass: string;
  borderClass: string;
  icon: string;
}

export const EMOTION_THEMES: Record<EmotionType, EmotionTheme> = {
  Scared: {
    bgClass: 'bg-indigo-50',
    textClass: 'text-indigo-700',
    borderClass: 'border-indigo-200',
    icon: '🫂',
  },
  Embarrassed: {
    bgClass: 'bg-rose-50',
    textClass: 'text-rose-700',
    borderClass: 'border-rose-200',
    icon: '❤️',
  },
  Angry: {
    bgClass: 'bg-red-50',
    textClass: 'text-red-700',
    borderClass: 'border-red-200',
    icon: '❤️‍🩹',
  },
  Hopeful: {
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200',
    icon: '✨',
  },
  Confused: {
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-200',
    icon: '💡',
  },
  Sad: {
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-700',
    borderClass: 'border-blue-200',
    icon: '🌧️',
  },
  Frustrated: {
    bgClass: 'bg-orange-50',
    textClass: 'text-orange-700',
    borderClass: 'border-orange-200',
    icon: '🍃',
  },
  Neutral: {
    bgClass: 'bg-purple-50',
    textClass: 'text-purple-700',
    borderClass: 'border-purple-200',
    icon: '💜',
  },
};
