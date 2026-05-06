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
  avatarInitials: string; // for avatar display
  profileSlug: string;   // links to /experts page anchor
}

const EXPERTS: Record<string, Expert> = {
  'womens-health': {
    name: 'Dr. Priya Sharma',
    credentials: 'MBBS, MD (Obstetrics & Gynaecology)',
    role: 'Gynaecologist & Women\'s Health Specialist',
    avatarInitials: 'PS',
    profileSlug: 'dr-priya-sharma',
  },
  'pregnancy-fertility': {
    name: 'Dr. Priya Sharma',
    credentials: 'MBBS, MD (Obstetrics & Gynaecology)',
    role: 'Gynaecologist & Women\'s Health Specialist',
    avatarInitials: 'PS',
    profileSlug: 'dr-priya-sharma',
  },
  'baby-care-motherhood': {
    name: 'Dr. Priya Sharma',
    credentials: 'MBBS, MD (Obstetrics & Gynaecology)',
    role: 'Gynaecologist & Women\'s Health Specialist',
    avatarInitials: 'PS',
    profileSlug: 'dr-priya-sharma',
  },
  'mental-health-emotions': {
    name: 'Dr. Ritu Bansal',
    credentials: 'MA (Psychology), M.Phil (Clinical Psychology)',
    role: 'Licensed Counsellor & Psychotherapist',
    avatarInitials: 'RB',
    profileSlug: 'dr-ritu-bansal',
  },
  'relationships-marriage': {
    name: 'Dr. Ritu Bansal',
    credentials: 'MA (Psychology), M.Phil (Clinical Psychology)',
    role: 'Licensed Counsellor & Psychotherapist',
    avatarInitials: 'RB',
    profileSlug: 'dr-ritu-bansal',
  },
  'legal-rights': {
    name: 'Adv. Meera Krishnaswamy',
    credentials: 'LLB, Practising Advocate',
    role: 'Family Law Specialist, High Court',
    avatarInitials: 'MK',
    profileSlug: 'adv-meera-krishnaswamy',
  },
  'finance-money': {
    name: 'CA Sunita Joshi',
    credentials: 'Chartered Accountant, CFP',
    role: 'Certified Financial Planner for Women',
    avatarInitials: 'SJ',
    profileSlug: 'ca-sunita-joshi',
  },
  'career-workplace': {
    name: 'CA Sunita Joshi',
    credentials: 'Chartered Accountant, CFP',
    role: 'Certified Financial Planner for Women',
    avatarInitials: 'SJ',
    profileSlug: 'ca-sunita-joshi',
  },
};

const DEFAULT_EXPERT: Expert = {
  name: 'PurpleGirl Editorial Team',
  credentials: 'Reviewed by experienced women writers & researchers',
  role: 'Editorial Board',
  avatarInitials: 'PG',
  profileSlug: 'editorial-team',
};

export function getExpertForCategory(category: string): Expert {
  return EXPERTS[category] || DEFAULT_EXPERT;
}

export const ALL_EXPERTS: Expert[] = [
  EXPERTS['womens-health'],
  EXPERTS['mental-health-emotions'],
  EXPERTS['legal-rights'],
  EXPERTS['finance-money'],
];
