import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Shield, HeartHandshake, PenTool, UserCheck, Scale } from "lucide-react";

export const runtime = 'edge';

interface AboutPageProps {
  params: Promise<{ lang: string }>;
}

const SITE_URL = 'https://purplegirl.in';

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "About PurpleGirl | Lifestyle & Relationship Guides for Indian Women",
    description: "PurpleGirl is India's anonymous lifestyle platform for women — practical guides on relationships, confidence, daily life hacks, workplace scenarios, skincare routines, and home organization.",
    alternates: {
      canonical: lang === 'en' ? `${SITE_URL}/about` : `${SITE_URL}/${lang}/about`,
      languages: {
        'en': `${SITE_URL}/about`,
        'x-default': `${SITE_URL}/about`,
      },
    },
  };
}

export default function AboutPage() {
  return (
    <div className="bg-pg-cream min-h-screen pb-24">
      {/* Hero */}
      <div className="bg-pg-rose-light border-b border-pg-rose/10 py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-white text-pg-rose text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 shadow-sm">
            Our Mission
          </span>
          <h1 className="font-display text-4xl md:text-[48px] font-bold text-pg-gray-900 mb-6 leading-tight">
            Practical Advice &amp; Lifestyle Guides<br />for Everyday Indian Living
          </h1>
          <p className="text-lg md:text-[20px] text-pg-gray-700 max-w-2xl mx-auto leading-relaxed">
            PurpleGirl is a dedicated lifestyle publication — a safe, judgment-free space where women 
            find practical step-by-step guides on relationships, communication, skincare, career growth, and daily life.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-pg-gray-900 mb-4">Who We Are</h2>
            <p className="text-pg-gray-700 leading-relaxed text-[17px] mb-4">
              PurpleGirl was founded by a team of Indian women writers and lifestyle researchers who recognized a clear need: <strong>Modern Indian women need empathetic, realistic, and culturally grounded advice for everyday life scenarios.</strong>
            </p>
            <p className="text-pg-gray-700 leading-relaxed text-[17px]">
              Whether navigating awkward workplace conversations, finding simple skincare routines for Indian weather, managing household dynamics, or building personal confidence—our guides break down practical solutions into actionable steps.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-pg-rose/20 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-pg-rose/5 rounded-bl-full" />
             <Shield className="text-pg-rose w-10 h-10 mb-4" />
             <h3 className="font-display text-xl font-bold text-pg-gray-900 mb-2">Our Content Pillars</h3>
             <ul className="space-y-3 text-pg-gray-700 text-[15px]">
               <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-pg-rose shrink-0 mt-0.5"/> <strong>Relationships &amp; Communication:</strong> Peer guidance &amp; social dynamics</li>
               <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-pg-rose shrink-0 mt-0.5"/> <strong>Daily Life Hacks &amp; Confidence:</strong> Mindset &amp; personal growth</li>
               <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-pg-rose shrink-0 mt-0.5"/> <strong>Career &amp; Workplace:</strong> Professional etiquette &amp; career tips</li>
               <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-pg-rose shrink-0 mt-0.5"/> <strong>Skincare &amp; Lifestyle:</strong> Natural care &amp; routine tips</li>
             </ul>
          </div>
        </section>

        {/* Editorial Team — E-E-A-T signals */}
        <section>
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-pg-gray-900 mb-4">Our Editorial Team</h2>
            <p className="text-pg-gray-700 text-[17px] max-w-2xl mx-auto">
              Every guide on PurpleGirl is researched, structured, and reviewed by our editorial team to ensure accuracy, clarity, and genuine empathy.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-pg-gray-100 text-center">
              <div className="bg-pg-rose-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <PenTool className="text-pg-rose" size={24} />
              </div>
              <h3 className="font-sans font-bold text-pg-gray-900 mb-1">Ananya Rao</h3>
              <p className="text-pg-rose text-xs font-bold uppercase tracking-widest mb-3">Lead Lifestyle Editor</p>
              <p className="text-pg-gray-500 text-sm leading-relaxed">
                8+ years in women's lifestyle and relationship journalism. Specializes in workplace dynamics, communication, and social wellness.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-pg-gray-100 text-center">
              <div className="bg-pg-rose-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="text-pg-rose" size={24} />
              </div>
              <h3 className="font-sans font-bold text-pg-gray-900 mb-1">Kavita Sen</h3>
              <p className="text-pg-rose text-xs font-bold uppercase tracking-widest mb-3">Skincare &amp; Beauty Writer</p>
              <p className="text-pg-gray-500 text-sm leading-relaxed">
                Focuses on practical skincare routines, hair care, and natural wellness tips tailored to Indian climate and everyday routines.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-pg-gray-100 text-center">
              <div className="bg-pg-rose-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scale className="text-pg-rose" size={24} />
              </div>
              <h3 className="font-sans font-bold text-pg-gray-900 mb-1">Meera Nair</h3>
              <p className="text-pg-rose text-xs font-bold uppercase tracking-widest mb-3">Career &amp; Growth Researcher</p>
              <p className="text-pg-gray-500 text-sm leading-relaxed">
                Writes on career transitions, interview etiquette, personal finance literacy, and productivity hacks for young professional women.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-pg-gray-900 mb-4">Our Editorial Standards</h2>
            <p className="text-pg-gray-700 text-[17px] max-w-2xl mx-auto">
              We take the trust of our readers seriously. Here is how we ensure our content is reliable, practical, and non-preachy.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-pg-gray-100 text-center">
              <div className="bg-pg-rose-light w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartHandshake className="text-pg-rose" size={24} />
              </div>
              <h3 className="font-sans font-bold text-pg-gray-900 mb-2">Empathetic Approach</h3>
              <p className="text-pg-gray-500 text-sm leading-relaxed">Every guide starts by acknowledging real-life scenarios without judgment or lecture.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-pg-gray-100 text-center">
              <div className="bg-pg-rose-light w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <PenTool className="text-pg-rose" size={24} />
              </div>
              <h3 className="font-sans font-bold text-pg-gray-900 mb-2">Actionable Steps</h3>
              <p className="text-pg-gray-500 text-sm leading-relaxed">All guides provide structured, numbered advice with realistic Indian cultural context.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-pg-gray-100 text-center">
              <div className="bg-pg-rose-light w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-pg-rose" size={24} />
              </div>
              <h3 className="font-sans font-bold text-pg-gray-900 mb-2">Non-Clinical Focus</h3>
              <p className="text-pg-gray-500 text-sm leading-relaxed">We focus exclusively on general lifestyle and peer support, directing readers to certified professionals for specialized needs.</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-pg-gray-100 text-center max-w-3xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-pg-gray-900 mb-3">General Disclaimer</h2>
          <p className="text-pg-gray-500 text-[15px] leading-relaxed">
            The content on PurpleGirl.in is provided for informational and educational lifestyle purposes only. 
            It does not substitute for licensed professional medical, psychological, or legal counsel. 
            Always consult a licensed practitioner for clinical or legal concerns.{' '}
            <Link href="/disclaimer" className="text-pg-rose font-bold hover:underline">Read our full disclaimer →</Link>
          </p>
        </section>

        <div className="text-center pt-8">
          <Link
            href="/ask"
            className="inline-flex items-center justify-center bg-pg-rose text-white font-bold px-10 py-4 rounded-2xl text-[17px] hover:bg-pg-rose-dark transition-colors shadow-sm"
          >
            Ask a Question Anonymously
          </Link>
        </div>
      </div>
    </div>
  );
}

