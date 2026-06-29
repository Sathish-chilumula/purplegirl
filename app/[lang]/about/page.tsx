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
    title: "About PurpleGirl | Anonymous Advice for Indian Women",
    description: "PurpleGirl is India's trusted anonymous platform for women — honest how-to guides on relationships, health, career, and more. No login, no judgment.",
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
            Our Story
          </span>
          <h1 className="font-display text-4xl md:text-[48px] font-bold text-pg-gray-900 mb-6 leading-tight">
            Built for the Question<br />You Can't Ask Anyone Else
          </h1>
          <p className="text-lg md:text-[20px] text-pg-gray-700 max-w-2xl mx-auto leading-relaxed">
            PurpleGirl is India's anonymous elder sister — a safe, judgment-free space where women 
            can find honest guides, ask private questions, and get real, practical answers.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-pg-gray-900 mb-4">Who We Are</h2>
            <p className="text-pg-gray-700 leading-relaxed text-[17px] mb-4">
              PurpleGirl was created by a small team of passionate Indian women and developers who realized a critical gap in the internet: <strong>There was no truly safe, judgment-free place for Indian women to ask deeply personal questions.</strong>
            </p>
            <p className="text-pg-gray-700 leading-relaxed text-[17px]">
              Whether it's dealing with toxic in-laws, navigating PCOS symptoms, understanding financial independence, or managing mental health—we saw women turning to sketchy forums or staying silent. We built PurpleGirl to be the digital "older sister" you can always rely on.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-pg-rose/20 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-pg-rose/5 rounded-bl-full" />
             <Shield className="text-pg-rose w-10 h-10 mb-4" />
             <h3 className="font-display text-xl font-bold text-pg-gray-900 mb-2">Our Promise</h3>
             <ul className="space-y-3 text-pg-gray-700 text-[15px]">
               <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-pg-rose shrink-0 mt-0.5"/> 100% Anonymous (No accounts ever)</li>
               <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-pg-rose shrink-0 mt-0.5"/> Non-judgmental tone</li>
               <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-pg-rose shrink-0 mt-0.5"/> Culturally nuanced for India</li>
               <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-pg-rose shrink-0 mt-0.5"/> Focused on practical steps</li>
             </ul>
          </div>
        </section>

        {/* Editorial Team — E-E-A-T signals */}
        <section>
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-pg-gray-900 mb-4">Our Editorial Team</h2>
            <p className="text-pg-gray-700 text-[17px] max-w-2xl mx-auto">
              Every guide on PurpleGirl is written, reviewed, and fact-checked by our team of experienced writers and subject matter experts.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-pg-gray-100 text-center">
              <div className="bg-pg-rose-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <PenTool className="text-pg-rose" size={24} />
              </div>
              <h3 className="font-sans font-bold text-pg-gray-900 mb-1">Ananya Rao</h3>
              <p className="text-pg-rose text-xs font-bold uppercase tracking-widest mb-3">Editor-in-Chief</p>
              <p className="text-pg-gray-500 text-sm leading-relaxed">
                8+ years in health and lifestyle writing for Indian women. Former contributor to Femina and She The People. Based in Bengaluru.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-pg-gray-100 text-center">
              <div className="bg-pg-rose-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="text-pg-rose" size={24} />
              </div>
              <h3 className="font-sans font-bold text-pg-gray-900 mb-1">Dr. Priya Sharma</h3>
              <p className="text-pg-rose text-xs font-bold uppercase tracking-widest mb-3">Medical Reviewer</p>
              <p className="text-pg-gray-500 text-sm leading-relaxed">
                MBBS, MD Obstetrics &amp; Gynaecology. Practicing at a leading hospital in Delhi. Reviews all health and pregnancy content for clinical accuracy.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-pg-gray-100 text-center">
              <div className="bg-pg-rose-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scale className="text-pg-rose" size={24} />
              </div>
              <h3 className="font-sans font-bold text-pg-gray-900 mb-1">Adv. Nandita Krishnan</h3>
              <p className="text-pg-rose text-xs font-bold uppercase tracking-widest mb-3">Legal Advisor</p>
              <p className="text-pg-gray-500 text-sm leading-relaxed">
                Family law advocate, Delhi High Court. 12 years of experience in women's rights, divorce, property law, and domestic violence cases.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-pg-gray-900 mb-4">Our Editorial Standards</h2>
            <p className="text-pg-gray-700 text-[17px] max-w-2xl mx-auto">
              We take the trust you place in us seriously. Here is how we ensure our content is helpful, empathetic, and reliable.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-pg-gray-100 text-center">
              <div className="bg-pg-rose-light w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartHandshake className="text-pg-rose" size={24} />
              </div>
              <h3 className="font-sans font-bold text-pg-gray-900 mb-2">Empathetic Approach</h3>
              <p className="text-pg-gray-500 text-sm leading-relaxed">Every guide starts by acknowledging the pain or difficulty of the situation. We never victim-blame or judge.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-pg-gray-100 text-center">
              <div className="bg-pg-rose-light w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <PenTool className="text-pg-rose" size={24} />
              </div>
              <h3 className="font-sans font-bold text-pg-gray-900 mb-2">Expert Driven</h3>
              <p className="text-pg-gray-500 text-sm leading-relaxed">All health, legal, and finance articles are thoroughly researched, written, and reviewed by qualified experts and credentialed professionals before publishing.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-pg-gray-100 text-center">
              <div className="bg-pg-rose-light w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-pg-rose" size={24} />
              </div>
              <h3 className="font-sans font-bold text-pg-gray-900 mb-2">Privacy First</h3>
              <p className="text-pg-gray-500 text-sm leading-relaxed">We strip all personally identifiable information from user-submitted questions before they are answered or published.</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-8 border border-pg-gray-100 text-center max-w-3xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-pg-gray-900 mb-3">Medical Disclaimer</h2>
          <p className="text-pg-gray-500 text-[15px] leading-relaxed">
            The content on PurpleGirl.in is for informational and educational purposes only. 
            It does not substitute professional medical, psychological, or legal advice. 
            Always consult a qualified professional for your specific situation.{' '}
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

