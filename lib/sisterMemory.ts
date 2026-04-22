export interface SisterMemory {
  visitCount: number;
  lastVisit: string | null;
  askedQuestions: string[]; // Slugs of questions they asked
  topCategories: Record<string, number>; // Category slug -> count of visits
  nickname: string | null;
  sessionId: string;
}

const MEMORY_KEY = 'purplegirl_memory';

export function getMemory(): SisterMemory {
  if (typeof window === 'undefined') {
    return {
      visitCount: 0,
      lastVisit: null,
      askedQuestions: [],
      topCategories: {},
      nickname: null,
      sessionId: 'server',
    };
  }

  const stored = localStorage.getItem(MEMORY_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Merge with defaults to handle version updates
      return {
        visitCount: 1,
        lastVisit: null,
        askedQuestions: [],
        topCategories: {},
        nickname: null,
        sessionId: crypto.randomUUID(),
        ...parsed
      };
    } catch (e) {
      console.error('Failed to parse SisterMemory', e);
    }
  }

  const newMemory: SisterMemory = {
    visitCount: 1,
    lastVisit: new Date().toISOString(),
    askedQuestions: [],
    topCategories: {},
    nickname: null,
    sessionId: crypto.randomUUID(),
  };

  localStorage.setItem(MEMORY_KEY, JSON.stringify(newMemory));
  return newMemory;
}

export function updateMemory(updates: Partial<SisterMemory>) {
  if (typeof window === 'undefined') return;
  const current = getMemory();
  const updated = { ...current, ...updates };
  localStorage.setItem(MEMORY_KEY, JSON.stringify(updated));
}

export function recordCategoryVisit(categorySlug: string) {
  if (typeof window === 'undefined') return;
  const current = getMemory();
  const topCategories = { ...(current.topCategories || {}) };
  topCategories[categorySlug] = (topCategories[categorySlug] || 0) + 1;
  updateMemory({ topCategories });
}

export function recordQuestionAsk(questionSlug: string) {
  if (typeof window === 'undefined') return;
  const current = getMemory();
  const askedQuestions = [...current.askedQuestions, questionSlug];
  // Deduplicate just in case
  updateMemory({ askedQuestions: Array.from(new Set(askedQuestions)) });
}

export function registerVisit() {
  if (typeof window === 'undefined') return;
  const current = getMemory();
  const now = new Date();
  
  // Only increment visit count if last visit was more than 12 hours ago
  const last = current.lastVisit ? new Date(current.lastVisit) : null;
  let visitCount = current.visitCount;
  
  if (!last || now.getTime() - last.getTime() > 12 * 60 * 60 * 1000) {
    visitCount += 1;
  }
  
  updateMemory({
    visitCount,
    lastVisit: now.toISOString(),
  });
}
