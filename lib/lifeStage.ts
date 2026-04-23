export const LIFE_STAGE_CATEGORIES: Record<string, string[]> = {
  'student':       ['beauty-skincare', 'mental-wellness', 'career-money', 'relationships-love'],
  'single':        ['relationships-love', 'career-money', 'fashion-style', 'mental-wellness'],
  'married':       ['relationships-love', 'health-basics', 'food-nutrition', 'lifestyle'],
  'pregnant':      ['pregnancy-baby-care', 'health-basics', 'food-nutrition', 'mental-wellness'],
  'career':        ['career-money', 'mental-wellness', 'fashion-style', 'self-care-glow-up'],
  'family-work':   ['health-basics', 'food-nutrition', 'mental-wellness', 'career-money'],
  'rebuilding':    ['mental-wellness', 'health-basics', 'relationships-love', 'self-care-glow-up'],
  'exploring':     ['beauty-skincare', 'lifestyle', 'food-nutrition', 'fashion-style'],
}

export function getLifeStageGreeting(stage: string): string {
  const greetings: Record<string, string> = {
    'student': 'Hey girl, navigating life is hard. We got you 💜',
    'single': 'Your season of growth starts here 💜',
    'married': 'New chapter, new questions. Sister is here 💜',
    'pregnant': 'The most important journey of your life. We are with you 💜',
    'career': 'Ambitious women deserve real answers 💜',
    'family-work': 'Doing it all is hard. Let us make it easier 💜',
    'rebuilding': 'Starting over takes courage. You have it 💜',
    'exploring': 'Curiosity is your superpower 💜',
  }
  return greetings[stage] || 'Welcome to your safe space 💜'
}
