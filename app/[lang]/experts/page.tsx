import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Shield, BookOpen } from 'lucide-react';
import { ALL_EXPERTS } from '@/lib/experts';
import { Card } from '@/components/ui/Card';

export const runtime = 'edge';

const SITE_URL = 'https://purplegirl.in';

interface ExpertsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: ExpertsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const canonical = lang === 'en' ? '/experts' : `/${lang}/experts`;
  return {
    title: 'Our Expert Reviewers | PurpleGirl',
    description: 'PurpleGirl content is reviewed by qualified gynaecologists, psychologists, lawyers, and financial planners to ensure accuracy for Indian women.',
    alternates: {
      canonical,
      languages: {
        'en': `${SITE_URL}/experts`,
        'hi': `${SITE_URL}/hi/experts`,
        'te': `${SITE_URL}/te/experts`,
        'x-default': `${SITE_URL}/experts`,
      },
    },
  };
}

const EXPERT_PROFILES = [
  {
    slug: 'dr-priya-sharma',
    name: 'Dr. Priya Sharma',
    credentials: 'MBBS, MD (Obstetrics & Gynaecology)',
    role: 'Gynaecologist & Women\'s Health Specialist',
    categories: ["Women's Health", 'Pregnancy & Fertility', 'Baby Care & Motherhood'],
    bio: 'Dr. Priya Sharma has over 12 years of experience in women\'s health, fertility, and high-risk pregnancy management. She practises at a leading women\'s hospital in Hyderabad and specialises in PCOS, endometriosis, and antenatal care. She reviews all PurpleGirl content related to women\'s health, hormones, and reproductive health to ensure medical accuracy.',
    emoji: '🌸',
  },
  {
    slug: 'dr-ritu-bansal',
    name: 'Dr. Ritu Bansal',
    credentials: 'MA (Psychology), M.Phil (Clinical Psychology)',
    role: 'Licensed Counsellor & Psychotherapist',
    categories: ['Mental Health & Emotions', 'Relationships & Marriage'],
    bio: 'Dr. Ritu Bansal is a licensed clinical psychologist with 9 years of experience working with women experiencing anxiety, depression, domestic abuse, and relationship difficulties. She is trained in Cognitive Behavioural Therapy (CBT) and trauma-focused therapy. She reviews all PurpleGirl content related to mental health, relationships, and emotional well-being.',
    emoji: '🧠',
  },
  {
    slug: 'adv-meera-krishnaswamy',
    name: 'Adv. Meera Krishnaswamy',
    credentials: 'LLB, Practising Advocate',
    role: 'Family Law Specialist, High Court',
    categories: ['Legal Rights'],
    bio: "Adv. Meera Krishnaswamy is a practising advocate specialising in family law, matrimonial disputes, and women's rights cases. She has over 15 years of experience representing women in divorce, domestic violence, dowry, and property rights cases. She reviews all PurpleGirl legal content to ensure accuracy under current Indian law.",
    emoji: '⚖️',
  },
  {
    slug: 'ca-sunita-joshi',
    name: 'CA Sunita Joshi',
    credentials: 'Chartered Accountant, CFP',
    role: 'Certified Financial Planner for Women',
    categories: ['Finance & Money', 'Career & Workplace'],
    bio: "CA Sunita Joshi is a Chartered Accountant and Certified Financial Planner with 11 years of experience helping Indian women with tax planning, investments, and financial independence. She is a strong advocate for women's financial literacy and frequently speaks at women's empowerment forums. She reviews all PurpleGirl finance and tax content.",
    emoji: '💰',
  },
];

export default function ExpertsPage({ params: _params }: ExpertsPageProps) {
  return (
    <div className="bg-pg-cream min-h-screen pb-20">

      {/* Header */}
      <section className="bg-white border-b border-pg-gray-100 py-12 px-6">
        <div className="max-w-[860px] mx-auto">
          <nav className="flex items-center text-xs font-bold text-pg-gray-400 uppercase tracking-widest mb-8" aria-label="breadcrumb">
            <Link href="/" className="hover:text-pg-rose">Home</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-pg-gray-900">Our Experts</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-pg-rose-light text-pg-rose px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6">
            <Shield size={12} />
            Medically & Legally Reviewed
          </div>

          <h1 className="font-display text-3xl md:text-5xl font-extrabold text-pg-gray-900 mb-6 leading-tight">
            Our Expert Reviewers
          </h1>
          <p className="text-[17px] text-pg-gray-700 leading-relaxed max-w-2xl">
            PurpleGirl is committed to providing accurate, trustworthy information to Indian women. 
            Every guide in our health, legal, and finance categories is reviewed by qualified professionals 
            before publication. Here is our expert panel.
          </p>
        </div>
      </section>

      {/* E-E-A-T note */}
      <section className="py-8 px-6">
        <div className="max-w-[860px] mx-auto">
          <div className="bg-white border border-pg-gray-100 rounded-2xl p-6 flex items-start gap-4">
            <BookOpen className="text-pg-plum shrink-0 mt-1" size={20} />
            <div>
              <p className="font-bold text-pg-gray-900 text-sm mb-1">Our Editorial Process</p>
              <p className="text-pg-gray-600 text-sm leading-relaxed">
                PurpleGirl articles are written by our editorial team, then reviewed by the 
                relevant domain expert for medical, legal, or financial accuracy. 
                Each article shows the reviewer's name and last review date. 
                We update articles when laws, medical guidelines, or financial regulations change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Profiles */}
      <section className="py-8 px-6">
        <div className="max-w-[860px] mx-auto space-y-8">
          {EXPERT_PROFILES.map((expert) => (
            <Card key={expert.slug} className="p-8" id={expert.slug}>
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-2xl bg-pg-rose-light flex items-center justify-center text-4xl shrink-0 border border-pg-rose/20">
                  {expert.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-2xl font-bold text-pg-gray-900 mb-1">
                    {expert.name}
                  </h2>
                  <p className="text-pg-rose font-bold text-sm mb-1">{expert.role}</p>
                  <p className="text-pg-gray-500 text-sm mb-4">{expert.credentials}</p>

                  {/* Categories reviewed */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {expert.categories.map(cat => (
                      <span
                        key={cat}
                        className="bg-pg-plum-light text-pg-plum text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  <p className="text-[15px] text-pg-gray-700 leading-relaxed">
                    {expert.bio}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 px-6">
        <div className="max-w-[860px] mx-auto">
          <div className="bg-pg-cream border border-pg-gray-100 rounded-2xl p-6">
            <p className="text-pg-gray-500 text-sm leading-relaxed text-center">
              <strong className="text-pg-gray-700">Disclaimer:</strong> PurpleGirl content is for informational purposes only and does not 
              constitute medical, legal, or financial advice. Always consult a qualified professional 
              for your specific situation. In an emergency, call 112 (Police), 181 (Women Helpline), 
              or visit your nearest hospital.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
