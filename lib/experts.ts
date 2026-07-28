/**
 * experts.ts
 *
 * Maps article categories to expert reviewer credentials.
 * Used on the how-to article page to show the E-E-A-T credibility layer.
 */

export interface Expert {
  name: string;
  credentials: string;
  role: string;
  avatarInitials: string;
  profileSlug: string;
  disclaimer?: string;
}

const EXPERTS: Record<string, Expert> = {
  'relationships-marriage': {
    name: 'PurpleGirl Relationship Desk',
    credentials: 'Researched & Reviewed by Experienced Relationship Editors',
    role: 'Peer Guidance & Communication Advice',
    avatarInitials: 'PR',
    profileSlug: 'editorial',
    disclaimer: 'This content offers general communication and peer relationship advice. It is not clinical marriage therapy.',
  },
  'career-workplace': {
    name: 'PurpleGirl Career & Workplace Desk',
    credentials: 'Curated by Workplace Strategy & Career Researchers',
    role: 'Workplace Etiquette & Professional Growth',
    avatarInitials: 'PC',
    profileSlug: 'editorial',
    disclaimer: 'This guide provides practical career tips and workplace guidance.',
  },
  'skin-beauty': {
    name: 'PurpleGirl Beauty & Skincare Desk',
    credentials: 'Researched by Skincare & Lifestyle Editors',
    role: 'Daily Skincare Routines & Lifestyle Tips',
    avatarInitials: 'PB',
    profileSlug: 'editorial',
    disclaimer: 'For educational lifestyle purposes only. For persistent skin conditions, consult a certified dermatologist.',
  },
  'hair-care': {
    name: 'PurpleGirl Hair & Grooming Desk',
    credentials: 'Researched by Haircare & Beauty Editors',
    role: 'Routine Haircare & Natural Care Tips',
    avatarInitials: 'PH',
    profileSlug: 'editorial',
    disclaimer: 'General lifestyle tips for daily haircare.',
  },
  'family-parenting': {
    name: 'PurpleGirl Family & Community Desk',
    credentials: 'Curated by Community & Parenting Researchers',
    role: 'Social Coping Strategies & Family Harmony',
    avatarInitials: 'PF',
    profileSlug: 'editorial',
  },
  'self-growth-confidence': {
    name: 'PurpleGirl Self-Growth & Wellness Desk',
    credentials: 'Researched by Self-Improvement & Personal Growth Editors',
    role: 'Mindfulness & Confidence Building',
    avatarInitials: 'PS',
    profileSlug: 'editorial',
  },
  'home-household': {
    name: 'PurpleGirl Living & Home Desk',
    credentials: 'Curated by Home & Living Editors',
    role: 'Home Organization & Life Hacks',
    avatarInitials: 'PL',
    profileSlug: 'editorial',
  },
  'festivals-traditions': {
    name: 'PurpleGirl Culture & Traditions Desk',
    credentials: 'Curated by Culture & Lifestyle Writers',
    role: 'Festivals & Indian Living',
    avatarInitials: 'PC',
    profileSlug: 'editorial',
  },
};

const DEFAULT_EXPERT: Expert = {
  name: 'PurpleGirl Editorial Team',
  credentials: 'Researched & Written by Experienced Lifestyle & Community Editors',
  role: 'Editorial Board',
  avatarInitials: 'PG',
  profileSlug: 'editorial',
  disclaimer: 'Our content is created for practical lifestyle guidance and general informational purposes.',
};

export function getExpertForCategory(category: string): Expert {
  return EXPERTS[category] || DEFAULT_EXPERT;
}

export const ALL_EXPERTS: Expert[] = [
  EXPERTS['relationships-marriage'],
  EXPERTS['career-workplace'],
  EXPERTS['skin-beauty'],
  EXPERTS['self-growth-confidence'],
  EXPERTS['home-household'],
];
