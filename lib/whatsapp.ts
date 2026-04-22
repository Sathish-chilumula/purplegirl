/**
 * Build formatted WhatsApp share text from question data.
 * Adapted to use chat_log (the actual data shape) with bullet_points fallback.
 */
export function buildWhatsAppText(
  questionTitle: string,
  questionSlug: string,
  bulletPoints?: string[],
  chatLog?: string[]
): string {
  // Use bullet points if available, otherwise extract from first chat message
  const tips = (bulletPoints || []).slice(0, 3);
  const tipsText =
    tips.length > 0
      ? tips.map((t) => `✅ ${t}`).join('\n')
      : chatLog && chatLog[0]
        ? `💬 "${chatLog[0].slice(0, 200)}${chatLog[0].length > 200 ? '...' : ''}"`
        : '';

  return `💜 *PurpleGirl Answers*

*Q: ${questionTitle}*

${tipsText}

📖 Full answer + more tips:
purplegirl.in/q/${questionSlug}

_Ask anything anonymously at purplegirl.in_ 💜`;
}

/**
 * Open WhatsApp with pre-filled text.
 * Uses native Web Share API on mobile, falls back to wa.me link.
 */
export function openWhatsApp(text: string) {
  if (typeof navigator !== 'undefined' && navigator.share) {
    navigator
      .share({ text })
      .catch(() => {
        // User cancelled or share failed — fallback
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text)}`,
          '_blank'
        );
      });
  } else {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  }
}
