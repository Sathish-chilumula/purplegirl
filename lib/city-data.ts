/**
 * city-data.ts
 *
 * Content for city-specific landing pages at /city/[city]/[topic].
 * Targets high-CPC local search queries with almost no competition.
 */

export interface CityTopic {
  topicSlug: string;
  topicName: string;
  categorySlug: string;
  categoryName: string;
  emoji: string;
  metaTitleTemplate: string;   // use {{city}} placeholder
  metaDescTemplate: string;    // use {{city}} placeholder
  h1Template: string;
  introTemplate: string;       // use {{city}} placeholder
  sections: {
    heading: string;
    body: string;
  }[];
  thingsToKnow: string[];
  relatedGuides: { title: string; slug: string }[];
}

export interface CityData {
  slug: string;
  name: string;
  state: string;
  population: string;
  localTip?: string; // city-specific callout
}

export const CITIES: CityData[] = [
  { slug: 'hyderabad', name: 'Hyderabad', state: 'Telangana', population: '1 crore+', localTip: 'Apollo, CARE, and Yashoda are top-rated hospital groups in Hyderabad.' },
  { slug: 'mumbai', name: 'Mumbai', state: 'Maharashtra', population: '2 crore+', localTip: 'Mumbai has iCall (free counselling) and the iWill platform for online therapy.' },
  { slug: 'bangalore', name: 'Bangalore', state: 'Karnataka', population: '1.3 crore+', localTip: 'NIMHANS in Bangalore is India\'s premier mental health institution — walk-in OPD available.' },
  { slug: 'delhi', name: 'Delhi', state: 'Delhi NCR', population: '3 crore+', localTip: 'AIIMS Delhi has a free gynecology OPD. The Delhi Women\'s Commission can be reached at 011-23379181.' },
  { slug: 'chennai', name: 'Chennai', state: 'Tamil Nadu', population: '90 lakh+', localTip: 'Apollo Chennai and MIOT International are leading women\'s health centres.' },
  { slug: 'kolkata', name: 'Kolkata', state: 'West Bengal', population: '1.5 crore+', localTip: 'SSKM (Government Medical College) offers free OPD. The Women Helpline in West Bengal is 181.' },
  { slug: 'pune', name: 'Pune', state: 'Maharashtra', population: '70 lakh+', localTip: 'Pune has strong IVF infrastructure with clinics like Nova IVF and Bloom IVF.' },
];

export const TOPICS: CityTopic[] = [
  {
    topicSlug: 'gynaecologist',
    topicName: 'Best Gynaecologist',
    categorySlug: 'womens-health',
    categoryName: "Women's Health",
    emoji: '🌸',
    metaTitleTemplate: 'Best Gynaecologist in {{city}} — How to Find the Right Doctor | PurpleGirl',
    metaDescTemplate: 'How to find a trusted gynaecologist in {{city}}. What to look for, what to ask, and which questions you can finally ask anonymously.',
    h1Template: 'How to Find the Best Gynaecologist in {{city}}',
    introTemplate: "Finding a gynaecologist you can trust in {{city}} is one of the most important health decisions you will make. Whether you need help with PCOS, period problems, pregnancy, or a routine check-up — the right doctor changes everything. This guide will tell you exactly how to find, evaluate, and prepare for your first appointment in {{city}}.",
    sections: [
      {
        heading: 'What to Look for in a Gynaecologist',
        body: "A good gynaecologist should make you feel heard, not judged. Key things to look for: (1) Specialisation — does she handle your specific concern (PCOS, fertility, menopause)? Ask explicitly. (2) Hospital affiliation — which hospitals she operates at matters for emergencies. (3) Availability — can you get an appointment within a reasonable time? (4) Language — can she consult in your preferred language? (5) Willingness to explain — does she explain your diagnosis clearly, or just write prescriptions? In {{city}}, where options are many, you can afford to be selective.",
      },
      {
        heading: 'Questions to Ask on Your First Visit',
        body: "Come prepared with these questions: What tests do I need, and why? What are my treatment options? What happens if I don't treat this? Are there lifestyle changes that can help alongside medication? How often do I need to follow up? Can I reach you between appointments if something changes? A gynaecologist who welcomes these questions is a good sign. One who dismisses them is not the right fit.",
      },
      {
        heading: 'Government vs Private Options in {{city}}',
        body: "Government hospitals in {{city}} offer free or subsidised gynaecology OPD. Wait times can be long, but the quality of care is often excellent. Private clinics offer faster appointments and more time per consultation, but costs vary widely. Some private gynaecologists charge ₹200–₹500 per consultation; specialists in premium clinics may charge ₹1,000–₹2,000. Always ask the consultation fee before booking. Health insurance often covers specialist consultations — check your policy.",
      },
      {
        heading: 'Red Flags to Watch For',
        body: "Avoid gynaecologists who: dismiss your symptoms as 'normal' without examination; recommend surgery without offering non-surgical alternatives; make you feel embarrassed for asking questions; don't explain why they are prescribing a specific medication; charge for unnecessary tests. If something feels wrong, trust your instinct. You have the right to a second opinion — always.",
      },
    ],
    thingsToKnow: [
      'You can see a gynaecologist without your husband or family\'s permission',
      'All consultations are strictly confidential',
      'You can ask for a female gynaecologist — this is a valid request',
      'Bring a list of your symptoms, medications, and last period date',
      'Your family history is important — note if any relatives have PCOS, fibroids, or cancer',
      'You can ask to see the doctor alone if family accompanies you',
    ],
    relatedGuides: [
      { title: 'How to Talk to Your Gynaecologist About Sensitive Issues', slug: 'how-to-talk-gynaecologist-sensitive-issues' },
      { title: 'What is PCOS?', slug: '/wiki/pcos' },
    ],
  },
  {
    topicSlug: 'ivf-clinic',
    topicName: 'IVF Clinics',
    categorySlug: 'pregnancy-fertility',
    categoryName: 'Pregnancy & Fertility',
    emoji: '🤱',
    metaTitleTemplate: 'IVF Clinics in {{city}} — How to Choose the Right One | PurpleGirl',
    metaDescTemplate: 'How to choose an IVF clinic in {{city}}: what questions to ask, realistic success rates, cost, and red flags to avoid.',
    h1Template: 'How to Choose an IVF Clinic in {{city}}',
    introTemplate: "Choosing the right IVF clinic in {{city}} is one of the most important decisions of your fertility journey. Success rates, costs, and doctor experience vary enormously between clinics. This guide helps you evaluate your options without being overwhelmed by marketing claims.",
    sections: [
      {
        heading: 'What to Ask Every IVF Clinic',
        body: "Before committing to any clinic, ask: (1) What is your live birth rate per cycle started for my age group? (Not 'positive pregnancy rate' — that is misleading.) (2) How many IVF cycles do you do per year? (Volume matters for lab quality.) (3) What is your policy on single embryo transfer? (Good clinics prefer this to reduce twin risk.) (4) What is included in the quoted price, and what costs extra? (5) Who will be my primary doctor — will it always be the same person? (6) What support do you offer if a cycle fails?",
      },
      {
        heading: 'Understanding Success Rate Claims',
        body: "IVF clinics in {{city}} will all claim high success rates. Be sceptical. Always ask for 'live birth rate per cycle started' — not 'clinical pregnancy rate' or 'positive HCG rate'. Clinics that report 60–80% success rates are using misleading metrics. Realistic live birth rates by age: under 35 — 40–50%; 35–40 — 20–35%; over 40 — 10–20% (unless using donor eggs). A clinic that gives you realistic numbers is more trustworthy than one with inflated claims.",
      },
      {
        heading: 'IVF Cost Comparison in {{city}}',
        body: "IVF costs in {{city}} range from ₹1.2–2.5 lakh per cycle. This typically includes: hormone injections, egg retrieval, embryology lab, embryo transfer. Additional costs to ask about: ICSI (if needed) — ₹15,000–25,000 extra; embryo freezing — ₹15,000–30,000 per year; genetic testing (PGT) — ₹40,000–80,000; monitoring scans — sometimes charged per scan. Always get a written cost estimate before starting. Compare at least 2–3 clinics.",
      },
      {
        heading: 'Red Flags in IVF Clinics',
        body: "Walk away if a clinic: quotes very low prices (below ₹80,000) — lab quality is usually compromised; refuses to give you their live birth rate statistics; pressures you to do multiple embryo transfers 'for better chances'; recommends IVF before simpler treatments (IUI, medication) without clear justification; doesn't assign you a consistent primary doctor. The best clinics welcome your questions and give you time.",
      },
    ],
    thingsToKnow: [
      'Both partners need to be evaluated before IVF is recommended',
      'IVF is not the first step — simpler treatments may work for you',
      'Frozen embryo transfers often have better success rates than fresh',
      'PCOS patients need dose-adjusted stimulation protocols — mention this',
      'Some companies offer IVF insurance coverage — check before you pay out of pocket',
      'Government hospitals (AIIMS, JIPMER) offer IVF at heavily subsidised rates',
    ],
    relatedGuides: [
      { title: 'What is IVF?', slug: '/wiki/ivf' },
      { title: 'PCOS and Pregnancy Guide', slug: 'pcos-pregnancy-guide-india' },
    ],
  },
  {
    topicSlug: 'therapist',
    topicName: 'Therapist / Counsellor',
    categorySlug: 'mental-health-emotions',
    categoryName: 'Mental Health',
    emoji: '🧠',
    metaTitleTemplate: 'How to Find an Affordable Therapist in {{city}} | PurpleGirl',
    metaDescTemplate: 'Find trusted, affordable therapists and counsellors in {{city}}. Online and in-person options, what to ask, and how to start your mental health journey.',
    h1Template: 'How to Find an Affordable Therapist or Counsellor in {{city}}',
    introTemplate: "Finding a therapist in {{city}} who you trust, can afford, and feel safe with is harder than it should be. Mental health care in India is still stigmatised and underinsured — but that is changing. This guide cuts through the confusion so you can take your first step.",
    sections: [
      {
        heading: 'Online Therapy vs In-Person in {{city}}',
        body: "Online therapy (video call) has become the preferred option for many women in {{city}} — it is private, removes commute time, and is often 30–40% cheaper than in-person. Online platforms like iCall, YourDOST, BetterLYF, and Wysa offer Indian therapists. In-person therapy is better for: severe depression or trauma (where physical presence matters); if you have tried online therapy and found it harder to open up. Starting online and transitioning in-person is a perfectly valid approach.",
      },
      {
        heading: 'Understanding Qualifications',
        body: "In India, there is no licensing requirement for the title 'counsellor' — anyone can use it. Look for: Registered Clinical Psychologist (RCI-registered) — the gold standard. M.Phil (Clinical Psychology) — trained specifically in assessment and therapy. MA (Psychology) with additional therapy training — many good therapists have this background. Psychiatrist (MD Psychiatry) — a medical doctor who can prescribe medication. For most non-medication therapy, an RCI-registered psychologist or M.Phil-trained counsellor is ideal.",
      },
      {
        heading: 'How Much Does Therapy Cost in {{city}}?',
        body: "Therapy in {{city}}: Online (iCall, YourDOST, BetterLYF) — ₹500–1,500 per session. Private psychologists (in-person) — ₹1,000–3,000 per session. Hospital outpatient psychology (e.g. NIMHANS, government hospitals) — free or ₹100–500. Student psychologists (supervised training) — ₹200–500. Community health centres — often free. Most therapists offer sliding scale fees — ask directly. 'I cannot afford your full fee, what options do you have?' is a completely valid question.",
      },
      {
        heading: 'What to Expect in Your First Session',
        body: "The first session is usually an intake/assessment — the therapist will ask about what brought you in, your history, and your goals. You don't have to share everything immediately. The first session is also for YOU to evaluate the therapist — do you feel heard? Is their approach clear? Do they explain what therapy will look like? It is completely normal to try 2–3 therapists before finding the right fit. Therapy is a relationship — fit matters.",
      },
    ],
    thingsToKnow: [
      'Therapy is confidential — what you share stays in the room',
      'A therapist cannot share your information without your consent (with narrow legal exceptions)',
      'You can stop therapy at any time — you are not obligated to continue',
      'Therapy takes time — most people see improvement after 6–12 sessions',
      'Medication and therapy together is often more effective than either alone',
      'iCall (9152987821) offers free counselling for anyone in India',
    ],
    relatedGuides: [
      { title: 'Signs You Need to See a Therapist', slug: 'signs-you-need-therapist-india' },
      { title: 'How to Talk to Your Family About Therapy in India', slug: 'how-to-tell-family-about-therapy-india' },
    ],
  },
  {
    topicSlug: 'divorce-lawyer',
    topicName: 'Divorce Lawyer',
    categorySlug: 'legal-rights',
    categoryName: 'Legal Rights',
    emoji: '⚖️',
    metaTitleTemplate: 'How to Find a Divorce Lawyer in {{city}} — Step by Step Guide | PurpleGirl',
    metaDescTemplate: 'Finding a divorce lawyer in {{city}} who understands women\'s rights. What to ask, how much it costs, and how to protect yourself during the process.',
    h1Template: 'How to Find a Divorce Lawyer in {{city}}',
    introTemplate: "The decision to consult a divorce lawyer is one of the hardest steps any woman takes. In {{city}}, you have options — from legal aid for women who cannot afford fees to experienced private family law advocates. This guide helps you find the right legal help without being taken advantage of.",
    sections: [
      {
        heading: 'Types of Divorce in India',
        body: "There are two main types: Mutual Consent Divorce — both spouses agree to divorce. This is faster (6 months) and less expensive. Contested Divorce — one spouse does not consent. Grounds include cruelty, adultery, desertion, or irretrievable breakdown. This can take 2–5 years. Maintenance, custody, and property division are negotiated or decided by the court in both types. Even in a mutual consent divorce, having your own lawyer protects your interests — do not share one lawyer with your spouse.",
      },
      {
        heading: 'How to Find a Reliable Family Lawyer in {{city}}',
        body: "Ask for referrals from: women's NGOs in {{city}} (they often have vetted lawyer lists); the State Bar Council (bar.co.in) for registered advocates; the District Legal Services Authority (DLSA) for free/subsidised legal aid. For free legal aid: every Indian woman is entitled to free legal aid from the State Legal Services Authority (SLSA) if she cannot afford a lawyer. Contact your district's DLSA — they are legally required to provide a lawyer at no cost. Private lawyers in {{city}} specialising in family law typically charge ₹5,000–₹50,000+ depending on complexity.",
      },
      {
        heading: 'What to Bring to Your First Legal Consultation',
        body: "Documents to bring: marriage certificate; Aadhaar card, PAN card; all property documents (flat, land, vehicles) — both yours and joint; bank account statements (yours and joint accounts); children's birth certificates (if applicable); any evidence of abuse, cruelty, or dowry demands (screenshots, photos, medical reports, police complaints); income proof (salary slips, ITR) — both yours and spouse's if available. The more documentation you bring, the better your lawyer can advise you.",
      },
      {
        heading: 'Protecting Yourself During Divorce',
        body: "Immediately open a bank account in your own name if you don't have one. Secure copies of all important documents — original or photographed. Do not sign any documents your spouse gives you without your lawyer reviewing them first. If you have children, document your primary caregiver role (school records, medical records, activity photos). Do not leave the matrimonial home without legal advice — in some cases, leaving voluntarily can affect your maintenance and property claims. Protect your financial records — know what assets exist.",
      },
    ],
    thingsToKnow: [
      'You are entitled to free legal aid — contact your District Legal Services Authority',
      'Maintenance can be claimed even during separation, before divorce is finalised',
      'Stridhan (your jewellery and gifts) belongs to you, even during divorce proceedings',
      'Child custody is decided based on the child\'s best interest, not automatically given to the father',
      'Divorce does not require the consent of in-laws — only the two spouses (and court)',
      'You can file from the city where you currently reside, even if the marriage was elsewhere',
    ],
    relatedGuides: [
      { title: 'How to File for Divorce in India', slug: 'how-to-file-divorce-india' },
      { title: 'What is Section 498A?', slug: '/wiki/section-498a' },
    ],
  },
  {
    topicSlug: 'pcos-specialist',
    topicName: 'PCOS Specialist',
    categorySlug: 'womens-health',
    categoryName: "Women's Health",
    emoji: '🌸',
    metaTitleTemplate: 'PCOS Specialist in {{city}} — How to Get the Right Diagnosis | PurpleGirl',
    metaDescTemplate: 'Finding a PCOS specialist in {{city}} who truly understands the condition. What tests to ask for, what treatment to expect, and how to advocate for yourself.',
    h1Template: 'How to Find a PCOS Specialist in {{city}}',
    introTemplate: "PCOS affects 1 in 5 Indian women, but it is still widely misdiagnosed or dismissed. In {{city}}, finding a doctor who truly understands PCOS — beyond just prescribing birth control pills — can make a life-changing difference. This guide tells you exactly who to see and what to ask.",
    sections: [
      {
        heading: 'Who Should You See for PCOS?',
        body: "The best specialist for PCOS depends on your main concern: Irregular periods, acne, hair growth → Gynaecologist or Reproductive Endocrinologist. Insulin resistance, weight management → Endocrinologist (diabetes specialist). Infertility related to PCOS → Reproductive Endocrinologist or Fertility Specialist. Hair loss (scalp) from PCOS → Dermatologist + Endocrinologist. In reality, PCOS requires a team approach. Start with a gynaecologist — they will refer you to other specialists as needed.",
      },
      {
        heading: 'Tests to Ask For',
        body: "A thorough PCOS workup includes: Hormonal panel — LH, FSH, testosterone (total and free), AMH (anti-Müllerian hormone), DHEAS, prolactin. Thyroid function — TSH, T3, T4 (thyroid issues often co-exist with PCOS). Metabolic panel — fasting blood sugar, fasting insulin, HbA1c, lipid profile. Pelvic ultrasound — looking for ovarian volume and follicle count. Vitamin levels — Vitamin D and B12 deficiency are very common in PCOS. If your doctor only orders a pelvic ultrasound and declares 'you have PCOS' — that is incomplete. Diagnosis requires at least 2 of 3 Rotterdam criteria.",
      },
      {
        heading: 'Questions to Ask Your PCOS Doctor',
        body: "Ask specifically: What type of PCOS do I have? (Insulin-resistant, adrenal, post-pill, or inflammatory — treatment differs.) What is my AMH level and what does it mean for my fertility? Do I need medication, or can lifestyle changes manage this? What are the long-term health risks I should monitor for (diabetes, heart disease)? How often should I come back for monitoring? The best PCOS doctors take time to answer all of these.",
      },
    ],
    thingsToKnow: [
      'PCOS is not cured by birth control pills — they only mask symptoms temporarily',
      'Metformin (for insulin resistance) is often more effective long-term than hormonal pills',
      'Vitamin D deficiency worsens PCOS — get tested and supplement if low',
      'Even 5–10% weight loss (if overweight) can restore periods in PCOS',
      'PCOS does not mean you cannot get pregnant — most women with PCOS can conceive',
      'Inositol (myo-inositol) is a supplement backed by research for PCOS insulin resistance',
    ],
    relatedGuides: [
      { title: 'What is PCOS?', slug: '/wiki/pcos' },
      { title: 'PCOS Diet Plan for Indian Women', slug: 'pcos-diet-plan-indian-women' },
    ],
  },
];

export function getCityData(citySlug: string): CityData | undefined {
  return CITIES.find(c => c.slug === citySlug);
}

export function getTopicData(topicSlug: string): CityTopic | undefined {
  return TOPICS.find(t => t.topicSlug === topicSlug);
}

export function getAllCityTopicPairs(): { city: string; topic: string }[] {
  return CITIES.flatMap(city =>
    TOPICS.map(topic => ({ city: city.slug, topic: topic.topicSlug }))
  );
}

/** Replace {{city}} placeholder in template strings */
export function fillTemplate(template: string, cityName: string): string {
  return template.replace(/\{\{city\}\}/g, cityName);
}
