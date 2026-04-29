import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About PurpleGirl | Anonymous Advice for Indian Women",
  description: "PurpleGirl is India's trusted anonymous platform for women — honest how-to guides on relationships, health, career, and more. No login, no judgment.",
};

export default function AboutPage() {
  return (
    <div className="bg-pg-cream min-h-screen pb-24">
      {/* Hero */}
      <div className="bg-pg-rose-light border-b border-pg-rose/10 py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-white text-pg-rose text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Our Story
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-pg-gray-900 mb-4 leading-tight">
            Built for the Question<br />You Can't Ask Anyone Else
          </h1>
          <p className="text-lg text-pg-gray-700 max-w-2xl mx-auto">
            PurpleGirl is India's anonymous elder sister — a safe, judgment-free space where women 
            can find honest guides, ask private questions, and get real, practical answers.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        
        <section>
          <h2 className="font-display text-3xl font-bold text-pg-gray-900 mb-4">Our Mission</h2>
          <p className="text-pg-gray-700 leading-relaxed text-lg">
            Every woman deserves access to reliable, empathetic, and practical advice. 
            Whether it's a question about relationships, PCOS, career breaks, toxic in-laws, or finances — 
            we know that asking can feel impossible when no one around you understands.
          </p>
          <p className="text-pg-gray-700 leading-relaxed text-lg mt-4">
            PurpleGirl is <strong>100% anonymous</strong>. We don't require login, we don't track who asks what. 
            We just focus on real, actionable guides written for the way Indian women actually live.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl font-bold text-pg-gray-900 mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { emoji: '🔍', title: 'Browse Guides', desc: 'Step-by-step how-to guides written like a trusted older sister would explain them.' },
              { emoji: '💬', title: 'Ask Anonymously', desc: 'Type your question. No name, no email. Get a warm, honest AI response instantly.' },
              { emoji: '📊', title: 'Take Quizzes', desc: 'Insightful quizzes about your relationships, mental health, and personality.' },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-pg-gray-100">
                <div className="text-3xl mb-3">{emoji}</div>
                <h3 className="font-sans font-bold text-pg-gray-900 mb-2">{title}</h3>
                <p className="text-pg-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-pg-gray-100">
          <h2 className="font-display text-2xl font-bold text-pg-gray-900 mb-3">Disclaimer</h2>
          <p className="text-pg-gray-500 text-sm leading-relaxed">
            The content on PurpleGirl.in is for informational and educational purposes only. 
            It does not substitute professional medical, legal, or psychological advice. 
            Always consult a qualified professional for your specific situation.
          </p>
        </section>

        <div className="text-center pt-4">
          <Link
            href="/ask"
            className="inline-flex items-center gap-2 bg-pg-rose text-white font-bold px-10 py-4 rounded-2xl text-lg hover:bg-pg-rose-dark transition-colors shadow-sm"
          >
            Ask a Question Anonymously →
          </Link>
        </div>
      </div>
    </div>
  );
}
