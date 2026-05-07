'use client';

import React, { useState } from 'react';
import { Calendar, Droplets, Heart, Info, ArrowRight, Share2 } from 'lucide-react';
import Link from 'next/link';

interface Props {
  dict: any;
  lang: string;
}

export function PeriodCalculatorClient({ dict, lang }: Props) {
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [periodLength, setPeriodLength] = useState('5');

  const [results, setResults] = useState<{
    nextPeriod: Date;
    ovulationDate: Date;
    fertileStart: Date;
    fertileEnd: Date;
  } | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastPeriod) return;

    const startDate = new Date(lastPeriod);
    const cycle = parseInt(cycleLength, 10);

    const nextPeriod = new Date(startDate);
    nextPeriod.setDate(nextPeriod.getDate() + cycle);

    const ovulationDate = new Date(nextPeriod);
    ovulationDate.setDate(ovulationDate.getDate() - 14);

    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(fertileStart.getDate() - 5);

    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    setResults({ nextPeriod, ovulationDate, fertileStart, fertileEnd });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: labels.hero_title,
          text: 'I just used this private Period & Ovulation Calculator on PurpleGirl. It is completely anonymous and very easy to use!',
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const locale = lang === 'hi' ? 'hi-IN' : lang === 'te' ? 'te-IN' : 'en-IN';
  const formatDate = (date: Date) =>
    date.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' });

  const labels = {
    hero_title: dict.calculator_period_title,
    hero_desc: dict.calculator_period_desc,
    label_last_period: {
      en: 'First day of your last period',
      hi: 'आपके आखिरी पीरियड का पहला दिन',
      te: 'మీ చివరి పీరియడ్ మొదటి రోజు',
    }[lang] || 'First day of your last period',
    label_cycle: {
      en: 'Cycle Length (Days)',
      hi: 'चक्र की अवधि (दिन)',
      te: 'సైకిల్ వ్యవధి (రోజులు)',
    }[lang] || 'Cycle Length (Days)',
    label_period: {
      en: 'Period Length (Days)',
      hi: 'पीरियड की अवधि (दिन)',
      te: 'పీరియడ్ వ్యవధి (రోజులు)',
    }[lang] || 'Period Length (Days)',
    usually_28: {
      en: 'Usually 28 days',
      hi: 'आमतौर पर 28 दिन',
      te: 'సాధారణంగా 28 రోజులు',
    }[lang] || 'Usually 28 days',
    usually_5: {
      en: 'Usually 5 days',
      hi: 'आमतौर पर 5 दिन',
      te: 'సాధారణంగా 5 రోజులు',
    }[lang] || 'Usually 5 days',
    results_title: {
      en: 'Your Results',
      hi: 'आपके परिणाम',
      te: 'మీ ఫలితాలు',
    }[lang] || 'Your Results',
    fertile_desc: {
      en: (s: string, e: string) => `You are most likely to get pregnant if you have sex between ${s} and ${e}.`,
      hi: (s: string, e: string) => `${s} और ${e} के बीच संभोग करने से गर्भधारण की संभावना सबसे अधिक है।`,
      te: (s: string, e: string) => `${s} మరియు ${e} మధ్య సంభోగం చేస్తే గర్భం దాల్చే అవకాశం అత్యధికంగా ఉంటుంది.`,
    }[lang] || ((s: string, e: string) => `Fertile window: ${s} – ${e}`),
    disclaimer: {
      en: 'This calculator provides estimates based on averages. It should not be used as a guaranteed form of birth control or medical advice. Consult a doctor for irregular cycles.',
      hi: 'यह कैलकुलेटर औसत के आधार पर अनुमान देता है। इसे जन्म नियंत्रण या चिकित्सा सलाह के रूप में न लें। अनियमित चक्र के लिए डॉक्टर से सलाह लें।',
      te: 'ఈ కాల్కులేటర్ సగటు అంచనాలు మాత్రమే ఇస్తుంది. వైద్య సలహాగా పరిగణించవద్దు. సాధారణ కాని సైకిల్‌కు వైద్యుడిని సంప్రదించండి.',
    }[lang] || '',
    related_title: {
      en: 'Related Guides',
      hi: 'संबंधित गाइड',
      te: 'సంబంధిత గైడ్‌లు',
    }[lang] || 'Related Guides',
  };

  return (
    <div className="bg-pg-cream min-h-screen pb-24">
      {/* Hero */}
      <div className="bg-pg-rose border-b border-pg-rose-dark py-16 px-6 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <Droplets className="mx-auto mb-4 text-white opacity-90" size={48} />
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {labels.hero_title}
          </h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto">
            {labels.hero_desc}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl mx-auto px-6 py-12 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-sm border border-pg-gray-200 p-6 md:p-10 mb-10">
          <form onSubmit={calculate} className="space-y-6">
            <div>
              <label className="block font-bold text-pg-gray-900 mb-2">
                {labels.label_last_period}
              </label>
              <input
                type="date"
                required
                value={lastPeriod}
                onChange={(e) => setLastPeriod(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-pg-gray-300 focus:border-pg-rose outline-none text-pg-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-pg-gray-900 mb-2">
                  {labels.label_cycle}
                </label>
                <input
                  type="number"
                  min="20"
                  max="45"
                  required
                  value={cycleLength}
                  onChange={(e) => setCycleLength(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-pg-gray-300 focus:border-pg-rose outline-none text-pg-gray-900"
                />
                <p className="text-xs text-pg-gray-500 mt-1">{labels.usually_28}</p>
              </div>
              <div>
                <label className="block font-bold text-pg-gray-900 mb-2">
                  {labels.label_period}
                </label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  required
                  value={periodLength}
                  onChange={(e) => setPeriodLength(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-pg-gray-300 focus:border-pg-rose outline-none text-pg-gray-900"
                />
                <p className="text-xs text-pg-gray-500 mt-1">{labels.usually_5}</p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-pg-plum hover:bg-pg-plum-dark text-white font-bold px-6 py-4 rounded-xl transition-colors mt-4 text-lg"
            >
              {dict.calculator_calculate}
            </button>
          </form>
        </div>

        {/* Results */}
        {results && (
          <div className="bg-pg-rose-light rounded-3xl border border-pg-rose/20 p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            <div className="flex justify-center items-center mb-6 relative">
              <h2 className="font-display text-2xl font-bold text-pg-gray-900 text-center">
                {labels.results_title}
              </h2>
              <button 
                onClick={handleShare}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full text-pg-rose hover:bg-pg-rose hover:text-white transition-colors shadow-sm"
                aria-label="Share results"
                title="Share this tool"
              >
                <Share2 size={18} />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="bg-pg-rose/10 text-pg-rose w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Droplets size={24} />
                </div>
                <h3 className="text-sm font-bold text-pg-gray-500 uppercase tracking-widest mb-1">
                  {dict.calculator_next_period}
                </h3>
                <p className="font-display text-2xl font-bold text-pg-gray-900">
                  {formatDate(results.nextPeriod)}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="bg-pg-plum/10 text-pg-plum w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart size={24} />
                </div>
                <h3 className="text-sm font-bold text-pg-gray-500 uppercase tracking-widest mb-1">
                  {dict.calculator_ovulation}
                </h3>
                <p className="font-display text-2xl font-bold text-pg-gray-900">
                  {formatDate(results.ovulationDate)}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <h3 className="font-bold text-pg-gray-900 mb-2 flex items-center gap-2">
                <Calendar size={18} className="text-pg-rose" /> {dict.calculator_fertile_window}
              </h3>
              <p className="text-pg-gray-700">
                {labels.fertile_desc(
                  formatDate(results.fertileStart),
                  formatDate(results.fertileEnd)
                )}
              </p>
            </div>

            <div className="flex items-start gap-3 text-xs text-pg-gray-500 bg-white/50 p-4 rounded-xl">
              <Info className="shrink-0 mt-0.5" size={16} />
              <p>{labels.disclaimer}</p>
            </div>
          </div>
        )}

        {/* Related Guides */}
        <div className="mt-12">
          <h3 className="font-display font-bold text-xl text-pg-gray-900 mb-4">
            {labels.related_title}
          </h3>
          <div className="space-y-3">
            <Link
              href="/category/womens-health"
              className="flex items-center justify-between bg-white p-4 rounded-xl border border-pg-gray-200 hover:border-pg-rose transition-colors group"
            >
              <span className="font-bold text-pg-gray-700 group-hover:text-pg-rose">
                {lang === 'hi' ? 'PCOS और अनियमित पीरियड' : lang === 'te' ? 'PCOS మరియు అసాధారణ పీరియడ్‌లు' : 'PCOS & Irregular Periods'}
              </span>
              <ArrowRight size={18} className="text-pg-gray-400 group-hover:text-pg-rose" />
            </Link>
            <Link
              href="/category/pregnancy-fertility"
              className="flex items-center justify-between bg-white p-4 rounded-xl border border-pg-gray-200 hover:border-pg-rose transition-colors group"
            >
              <span className="font-bold text-pg-gray-700 group-hover:text-pg-rose">
                {lang === 'hi' ? 'गर्भावस्था और प्रजनन सलाह' : lang === 'te' ? 'గర్భం మరియు సంతానోత్పత్తి సలహా' : 'Pregnancy & Fertility Advice'}
              </span>
              <ArrowRight size={18} className="text-pg-gray-400 group-hover:text-pg-rose" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
