'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Activity, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';

interface Props { dict: any; lang: string; }

// Symptom definitions per language
const getSymptoms = (lang: string) => [
  { id: 'irregular_periods', label: { en: 'Irregular or missed periods', hi: 'अनियमित या छूटे हुए पीरियड', te: 'అసాధారణ లేదా తప్పిపోయిన పీరియడ్‌లు' }[lang] || 'Irregular or missed periods', conditions: ['pcos', 'thyroid'] },
  { id: 'weight_gain', label: { en: 'Unexplained weight gain', hi: 'बिना कारण वजन बढ़ना', te: 'అనూహ్యంగా బరువు పెరగడం' }[lang] || 'Unexplained weight gain', conditions: ['pcos', 'thyroid', 'hormonal'] },
  { id: 'hair_fall', label: { en: 'Excessive hair fall or thinning', hi: 'अत्यधिक बाल झड़ना', te: 'అధిక జుట్టు రాలడం' }[lang] || 'Excessive hair fall', conditions: ['pcos', 'thyroid'] },
  { id: 'acne', label: { en: 'Persistent acne (especially jawline)', hi: 'जिद्दी मुंहासे (खासकर जबड़े पर)', te: 'పట్టుదలతో మొటిమలు' }[lang] || 'Persistent acne', conditions: ['pcos', 'hormonal'] },
  { id: 'fatigue', label: { en: 'Constant fatigue and low energy', hi: 'लगातार थकान और ऊर्जा की कमी', te: 'నిరంతర అలసట మరియు తక్కువ శక్తి' }[lang] || 'Constant fatigue', conditions: ['thyroid', 'hormonal'] },
  { id: 'mood_swings', label: { en: 'Mood swings / anxiety / depression', hi: 'मूड स्विंग / चिंता / अवसाद', te: 'మూడ్ స్వింగ్స్ / ఆందోళన / నిరాశ' }[lang] || 'Mood swings', conditions: ['hormonal', 'thyroid'] },
  { id: 'facial_hair', label: { en: 'Facial hair or body hair growth', hi: 'चेहरे या शरीर पर बाल उगना', te: 'మొహంపై లేదా శరీరంపై వెంట్రుకలు' }[lang] || 'Facial hair growth', conditions: ['pcos'] },
  { id: 'cold_intolerance', label: { en: 'Always feeling cold / dry skin', hi: 'हमेशा ठंड लगना / शुष्क त्वचा', te: 'ఎప్పుడూ చలిగా అనిపించడం / పొడి చర్మం' }[lang] || 'Always feeling cold', conditions: ['thyroid'] },
  { id: 'difficulty_conceiving', label: { en: 'Difficulty getting pregnant', hi: 'गर्भधारण में कठिनाई', te: 'గర్భం దాల్చడంలో ఇబ్బంది' }[lang] || 'Difficulty conceiving', conditions: ['pcos', 'hormonal'] },
  { id: 'bloating', label: { en: 'Bloating / abdominal pain', hi: 'पेट फूलना / पेट दर्द', te: 'వాపు / పొత్తి కడుపు నొప్పి' }[lang] || 'Bloating', conditions: ['hormonal', 'pcos'] },
];

const CONDITIONS: Record<string, { title: Record<string, string>; desc: Record<string, string>; links: { href: string; label: Record<string, string> }[] }> = {
  pcos: {
    title: { en: 'Possible PCOS', hi: 'संभावित PCOS', te: 'సాధ్యమైన PCOS' },
    desc: {
      en: 'Your symptoms are commonly associated with Polycystic Ovary Syndrome (PCOS). This is a hormonal condition affecting 1 in 5 Indian women. A gynaecologist can confirm with an ultrasound and blood tests.',
      hi: 'आपके लक्षण अक्सर पॉलीसिस्टिक ओवरी सिंड्रोम (PCOS) से जुड़े होते हैं। यह 5 में से 1 भारतीय महिला को प्रभावित करता है। एक स्त्री रोग विशेषज्ञ अल्ट्रासाउंड और रक्त परीक्षण से इसकी पुष्टि कर सकते हैं।',
      te: 'మీ లక్షణాలు తరచుగా పాలీసిస్టిక్ ఓవరీ సిండ్రోమ్ (PCOS)తో సంబంధం కలిగి ఉంటాయి. ఇది 5 మంది భారతీయ మహిళల్లో 1 మందిని ప్రభావితం చేస్తుంది.',
    },
    links: [
      { href: '/category/womens-health', label: { en: "Women's Health Guides", hi: 'महिला स्वास्थ्य गाइड', te: 'మహిళల ఆరోగ్య గైడ్‌లు' } },
      { href: '/category/pregnancy-fertility', label: { en: 'PCOS & Fertility', hi: 'PCOS और प्रजनन क्षमता', te: 'PCOS మరియు సంతానోత్పత్తి' } },
    ],
  },
  thyroid: {
    title: { en: 'Possible Thyroid Issue', hi: 'संभावित थायराइड समस्या', te: 'సాధ్యమైన థైరాయిడ్ సమస్య' },
    desc: {
      en: 'Your symptoms align with thyroid disorders (hypothyroidism or hyperthyroidism). A simple TSH blood test can diagnose this. Thyroid conditions are very treatable once diagnosed.',
      hi: 'आपके लक्षण थायराइड विकारों से मेल खाते हैं। एक साधारण TSH रक्त परीक्षण इसका निदान कर सकता है। थायराइड की स्थिति एक बार निदान होने के बाद बहुत उपचार योग्य है।',
      te: 'మీ లక్షణాలు థైరాయిడ్ రుగ్మతలతో సరిపోతాయి. సాధారణ TSH రక్త పరీక్ష దీన్ని నిర్ధారించగలదు.',
    },
    links: [
      { href: '/category/womens-health', label: { en: "Women's Health Guides", hi: 'महिला स्वास्थ्य गाइड', te: 'మహిళల ఆరోగ్య గైడ్‌లు' } },
    ],
  },
  hormonal: {
    title: { en: 'Hormonal Imbalance Signs', hi: 'हार्मोनल असंतुलन के संकेत', te: 'హార్మోన్ అసమతుల్యత సంకేతాలు' },
    desc: {
      en: 'Your symptoms suggest a general hormonal imbalance. This can be caused by stress, poor diet, sleep issues, or underlying conditions. A gynaecologist can order a hormone panel blood test.',
      hi: 'आपके लक्षण सामान्य हार्मोनल असंतुलन का संकेत देते हैं। यह तनाव, खराब आहार, नींद की समस्याओं के कारण हो सकता है।',
      te: 'మీ లక్షణాలు సాధారణ హార్మోన్ అసమతుల్యతను సూచిస్తున్నాయి. ఒత్తిడి, సరికాని ఆహారం, నిద్ర సమస్యల వల్ల ఇది జరగవచ్చు.',
    },
    links: [
      { href: '/category/mental-health', label: { en: 'Mental Health Guides', hi: 'मानसिक स्वास्थ्य गाइड', te: 'మానసిక ఆరోగ్య గైడ్‌లు' } },
      { href: '/category/womens-health', label: { en: "Women's Health", hi: 'महिला स्वास्थ्य', te: 'మహిళల ఆరోగ్యం' } },
    ],
  },
};

export function SymptomCheckerClient({ dict, lang }: Props) {
  const [step, setStep] = useState<'symptoms' | 'duration' | 'result'>('symptoms');
  const [selected, setSelected] = useState<string[]>([]);
  const [duration, setDuration] = useState('');
  const symptoms = getSymptoms(lang);

  const toggle = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  const getTopCondition = () => {
    const scores: Record<string, number> = { pcos: 0, thyroid: 0, hormonal: 0 };
    selected.forEach((id) => {
      const sym = symptoms.find((s) => s.id === id);
      sym?.conditions.forEach((c) => { scores[c]++; });
    });
    return Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || 'hormonal';
  };

  const reset = () => { setStep('symptoms'); setSelected([]); setDuration(''); };

  const ui = {
    title: { en: 'Symptom Checker', hi: 'लक्षण जांचकर्ता', te: 'లక్షణ తనిఖీ' }[lang] || 'Symptom Checker',
    subtitle: { en: 'Select all symptoms you are currently experiencing', hi: 'वर्तमान में अनुभव हो रहे सभी लक्षण चुनें', te: 'మీరు ప్రస్తుతం అనుభవిస్తున్న అన్ని లక్షణాలు ఎంచుకోండి' }[lang] || 'Select all symptoms',
    next: { en: 'Next →', hi: 'आगे →', te: 'తదుపరి →' }[lang] || 'Next →',
    step2_title: { en: 'How long have you had these symptoms?', hi: 'ये लक्षण कितने समय से हैं?', te: 'ఈ లక్షణాలు ఎంత కాలంగా ఉన్నాయి?' }[lang] || 'How long?',
    see_results: { en: 'See My Results', hi: 'परिणाम देखें', te: 'నా ఫలితాలు చూడండి' }[lang] || 'See Results',
    disclaimer: { en: '⚠️ This tool is for awareness only — not a medical diagnosis. Always consult a qualified doctor.', hi: '⚠️ यह उपकरण जागरूकता के लिए है — चिकित्सा निदान नहीं। हमेशा योग्य डॉक्टर से परामर्श करें।', te: '⚠️ ఈ సాధనం అవగాహన కోసం మాత్రమే — వైద్య నిర్ధారణ కాదు. ఎప్పుడూ అర్హులైన వైద్యుడిని సంప్రదించండి.' }[lang] || '',
    restart: { en: 'Start Over', hi: 'फिर से शुरू करें', te: 'మళ్ళీ ప్రారంభించండి' }[lang] || 'Start Over',
    read_guides: { en: 'Read Related Guides', hi: 'संबंधित गाइड पढ़ें', te: 'సంబంధిత గైడ్‌లు చదవండి' }[lang] || 'Read Guides',
    select_min: { en: 'Please select at least one symptom', hi: 'कृपया कम से कम एक लक्षण चुनें', te: 'దయచేసి కనీసం ఒక లక్షణం ఎంచుకోండి' }[lang] || 'Select at least one',
  };

  const durations = [
    { value: 'recent', label: { en: 'Less than 1 month', hi: '1 महीने से कम', te: '1 నెల కంటే తక్కువ' }[lang] || '< 1 month' },
    { value: 'months', label: { en: '1–6 months', hi: '1–6 महीने', te: '1–6 నెలలు' }[lang] || '1–6 months' },
    { value: 'long', label: { en: 'More than 6 months', hi: '6 महीने से अधिक', te: '6 నెలల కంటే ఎక్కువ' }[lang] || '> 6 months' },
  ];

  return (
    <div className="bg-pg-cream min-h-screen pb-24">
      {/* Hero */}
      <div className="bg-gradient-to-br from-pg-plum to-[#7C3AED] py-16 px-6 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <Activity className="mx-auto mb-4 opacity-90" size={48} />
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{ui.title}</h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto">{ui.subtitle}</p>
          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {['symptoms', 'duration', 'result'].map((s, i) => (
              <div key={s} className={`flex items-center gap-3 ${i > 0 ? 'ml-1' : ''}`}>
                {i > 0 && <div className="w-8 h-px bg-white/30" />}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step === s ? 'bg-white text-pg-plum' : ['symptoms', 'duration', 'result'].indexOf(step) > i ? 'bg-white/40 text-white' : 'bg-white/20 text-white/50'}`}>
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* STEP 1 — Select Symptoms */}
        {step === 'symptoms' && (
          <div className="bg-white rounded-3xl shadow-sm border border-pg-gray-200 p-6 md:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {symptoms.map((sym) => (
                <button
                  key={sym.id}
                  onClick={() => toggle(sym.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left text-sm font-medium transition-all ${selected.includes(sym.id) ? 'border-pg-plum bg-pg-plum/5 text-pg-plum font-bold' : 'border-pg-gray-200 text-pg-gray-700 hover:border-pg-plum/40'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${selected.includes(sym.id) ? 'border-pg-plum bg-pg-plum' : 'border-pg-gray-300'}`}>
                    {selected.includes(sym.id) && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  {sym.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => { if (selected.length === 0) return; setStep('duration'); }}
              disabled={selected.length === 0}
              className="w-full bg-pg-plum hover:bg-pg-plum-dark disabled:opacity-40 text-white font-bold px-6 py-4 rounded-xl transition-colors text-lg"
            >
              {selected.length === 0 ? ui.select_min : ui.next}
            </button>
          </div>
        )}

        {/* STEP 2 — Duration */}
        {step === 'duration' && (
          <div className="bg-white rounded-3xl shadow-sm border border-pg-gray-200 p-6 md:p-10">
            <h2 className="font-display text-2xl font-bold text-pg-gray-900 mb-6">{ui.step2_title}</h2>
            <div className="space-y-3 mb-8">
              {durations.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDuration(d.value)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left font-medium transition-all ${duration === d.value ? 'border-pg-plum bg-pg-plum/5 text-pg-plum font-bold' : 'border-pg-gray-200 text-pg-gray-700 hover:border-pg-plum/40'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${duration === d.value ? 'border-pg-plum bg-pg-plum' : 'border-pg-gray-300'}`}>
                    {duration === d.value && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  {d.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => { if (!duration) return; setStep('result'); }}
              disabled={!duration}
              className="w-full bg-pg-plum hover:bg-pg-plum-dark disabled:opacity-40 text-white font-bold px-6 py-4 rounded-xl transition-colors text-lg"
            >
              {ui.see_results}
            </button>
          </div>
        )}

        {/* STEP 3 — Results */}
        {step === 'result' && (() => {
          const condKey = getTopCondition();
          const cond = CONDITIONS[condKey];
          return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-3xl shadow-sm border border-pg-gray-200 p-6 md:p-10 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="text-pg-plum shrink-0" size={32} />
                  <h2 className="font-display text-2xl font-bold text-pg-gray-900">
                    {cond.title[lang] || cond.title.en}
                  </h2>
                </div>
                <p className="text-pg-gray-700 leading-relaxed mb-6">
                  {cond.desc[lang] || cond.desc.en}
                </p>

                {/* Selected symptoms summary */}
                <div className="bg-pg-rose-light rounded-2xl p-4 mb-6">
                  <p className="text-xs font-bold text-pg-rose uppercase tracking-widest mb-3">
                    {lang === 'hi' ? 'आपने ये लक्षण रिपोर्ट किए' : lang === 'te' ? 'మీరు ఈ లక్షణాలు నివేదించారు' : 'Symptoms you reported'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selected.map((id) => {
                      const sym = symptoms.find((s) => s.id === id);
                      return sym ? (
                        <span key={id} className="bg-white text-pg-gray-700 text-xs font-medium px-3 py-1 rounded-full border border-pg-rose/20">
                          {sym.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>

                <p className="text-xs text-pg-gray-400 italic mb-6">{ui.disclaimer}</p>

                <div className="space-y-3">
                  <p className="font-bold text-pg-gray-700 mb-2">{ui.read_guides}</p>
                  {cond.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-between bg-pg-cream p-4 rounded-xl border border-pg-gray-200 hover:border-pg-plum transition-colors group"
                    >
                      <span className="font-bold text-pg-gray-700 group-hover:text-pg-plum text-sm">
                        {link.label[lang] || link.label.en}
                      </span>
                      <ArrowRight size={16} className="text-pg-gray-400 group-hover:text-pg-plum" />
                    </Link>
                  ))}
                </div>
              </div>

              <button
                onClick={reset}
                className="w-full flex items-center justify-center gap-2 bg-white border border-pg-gray-200 hover:border-pg-plum text-pg-gray-600 hover:text-pg-plum font-bold px-6 py-4 rounded-xl transition-colors"
              >
                <RotateCcw size={16} /> {ui.restart}
              </button>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
