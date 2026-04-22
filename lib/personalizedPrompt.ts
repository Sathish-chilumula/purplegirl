export interface IntakeData {
  ageGroup?: string;
  duration?: string;
  keyFactors?: string[];
  tone?: string;
  budget?: string;
}

export function buildPersonalizedContext(intake: IntakeData): string {
  const parts = [];

  if (intake.ageGroup) {
    parts.push(`The user is in the age group: ${intake.ageGroup}.`);
  }
  
  if (intake.duration) {
    parts.push(`This situation has been ongoing for: ${intake.duration}.`);
  }
  
  if (intake.keyFactors && intake.keyFactors.length > 0) {
    parts.push(`Key factors to consider: ${intake.keyFactors.join(', ')}.`);
  }

  if (intake.budget) {
    parts.push(`Budget constraint for any recommendations: ${intake.budget}.`);
  }

  if (intake.tone) {
    parts.push(`The user prefers a tone that is: ${intake.tone}.`);
  }

  if (parts.length === 0) return '';

  return `\n\n--- PERSONALIZATION CONTEXT ---\n${parts.join('\n')}\nPlease tailor your advice and tone specifically to these parameters.`;
}
