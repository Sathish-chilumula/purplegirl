/**
 * compare-data.ts
 *
 * Static content for /compare/[slug] pages.
 * Targets "X vs Y" queries — high search volume, low competition.
 */

export interface CompareItem {
  label: string;
  points: string[];
}

export interface CompareRow {
  aspect: string;
  a: string;
  b: string;
  winner?: 'a' | 'b' | 'both' | 'depends';
}

export interface ComparePage {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  labelA: string;
  labelB: string;
  emoji: string;
  category: string;
  categorySlug: string;
  intro: string;
  quickVerdict: string;
  table: CompareRow[];
  verdictA: CompareItem;
  verdictB: CompareItem;
  recommendation: string;
  relatedGuides: { title: string; slug: string }[];
  relatedWiki?: string[];
}

export const COMPARE_PAGES: ComparePage[] = [
  {
    slug: 'pcos-vs-thyroid-symptoms',
    title: 'PCOS vs Thyroid — How to Know the Difference',
    metaTitle: 'PCOS vs Thyroid Symptoms — How to Tell the Difference | PurpleGirl',
    metaDescription: 'PCOS and thyroid problems have nearly identical symptoms in Indian women. Learn how to tell them apart, what tests to ask for, and whether you might have both.',
    labelA: 'PCOS',
    labelB: 'Thyroid Disorder',
    emoji: '🌸',
    category: "Women's Health",
    categorySlug: 'womens-health',
    intro: "PCOS (Polycystic Ovary Syndrome) and thyroid disorders are two of the most common hormonal conditions in Indian women — and they look almost identical on the surface. Irregular periods, weight gain, fatigue, hair fall, mood swings: all of these can be caused by either condition. Many women have both simultaneously. This comparison tells you exactly how to distinguish them and what to ask your doctor.",
    quickVerdict: 'You cannot tell PCOS from thyroid based on symptoms alone. You need a blood test. Importantly, 25–40% of women with PCOS also have a thyroid disorder — so ruling one out doesn\'t rule out the other.',
    table: [
      {
        aspect: 'Irregular periods',
        a: 'Very common — periods may be absent for months',
        b: 'Common with hypothyroidism — cycles become longer and heavier',
        winner: 'both',
      },
      {
        aspect: 'Weight gain',
        a: 'Common — especially around belly and hips (insulin resistance)',
        b: 'Common with hypothyroidism — often harder to lose despite diet',
        winner: 'both',
      },
      {
        aspect: 'Hair fall',
        a: 'Hair falls from scalp; excess hair grows on face/body',
        b: 'Diffuse hair thinning all over scalp; eyebrows may thin at edges',
        winner: 'depends',
      },
      {
        aspect: 'Acne',
        a: 'Very common — hormonal acne on chin/jaw',
        b: 'Less common; dry skin is more typical',
        winner: 'a',
      },
      {
        aspect: 'Fatigue',
        a: 'Present but usually not extreme',
        b: 'Severe fatigue is the hallmark of hypothyroidism',
        winner: 'b',
      },
      {
        aspect: 'Cold sensitivity',
        a: 'Not a feature of PCOS',
        b: 'Feeling cold all the time is classic hypothyroidism',
        winner: 'b',
      },
      {
        aspect: 'Fertility impact',
        a: 'Can cause infertility due to lack of ovulation',
        b: 'Can cause infertility and miscarriage if untreated',
        winner: 'both',
      },
      {
        aspect: 'Diagnosis test',
        a: 'LH, FSH, testosterone, AMH + pelvic ultrasound',
        b: 'TSH, T3, T4 blood test',
        winner: 'depends',
      },
    ],
    verdictA: {
      label: 'PCOS is more likely if you have:',
      points: [
        'Excess facial/body hair (hirsutism)',
        'Hormonal acne on chin and jaw',
        'Irregular periods that come every 35–90 days or less than 8 per year',
        'Darkening of skin around neck/armpits (acanthosis nigricans)',
        'Ultrasound shows cysts on ovaries',
        'High androgen levels on blood test',
      ],
    },
    verdictB: {
      label: 'Thyroid disorder is more likely if you have:',
      points: [
        'Feeling cold even when others are comfortable',
        'Severe fatigue that doesn\'t improve with rest',
        'Constipation + dry skin + hair falling from eyebrow edges',
        'Feeling anxious + fast heartbeat + difficulty sleeping (hyperthyroidism)',
        'Your mother or sister has thyroid disease (strong genetic link)',
        'High TSH on blood test',
      ],
    },
    recommendation: 'Ask your doctor for both a thyroid panel (TSH, T3, T4) AND a hormonal panel (LH, FSH, testosterone, AMH) at the same time. These are standard, inexpensive blood tests. Treating one without checking for the other is a common mistake. Both conditions are very manageable with the right diagnosis.',
    relatedGuides: [
      { title: 'PCOS Diet Plan for Indian Women', slug: 'pcos-diet-plan-indian-women' },
      { title: 'How to Talk to Your Gynaecologist About PCOS', slug: 'how-to-talk-gynaecologist-sensitive-issues' },
    ],
    relatedWiki: ['pcos'],
  },
  {
    slug: 'sip-vs-rd-vs-fd-india',
    title: 'SIP vs RD vs FD — Which is Best for Indian Women in 2025?',
    metaTitle: 'SIP vs RD vs FD — Which is Best for Indian Women in 2025? | PurpleGirl',
    metaDescription: 'Comparing SIP, Recurring Deposit, and Fixed Deposit for Indian women saving in 2025. Tax treatment, returns, flexibility, and which to choose for your situation.',
    labelA: 'SIP (Mutual Fund)',
    labelB: 'RD / FD (Bank Deposit)',
    emoji: '💰',
    category: 'Finance & Money',
    categorySlug: 'finance-money',
    intro: 'For Indian women starting to invest — especially with limited amounts — the choice between SIP (Systematic Investment Plan in mutual funds), Recurring Deposit (RD), and Fixed Deposit (FD) is one of the most common questions. Each has real advantages and real risks. This comparison cuts through the confusion.',
    quickVerdict: 'For growing long-term wealth (5+ years): SIP wins. For guaranteed, safe savings (1–3 years): FD wins. For monthly savings discipline with safety: RD works. Most women should have both — SIP for wealth building and FD for emergency fund.',
    table: [
      {
        aspect: 'Returns (expected)',
        a: '10–15% p.a. (long-term, not guaranteed)',
        b: 'FD: 6.5–7.5% p.a. (guaranteed); RD: similar to FD',
        winner: 'a',
      },
      {
        aspect: 'Safety',
        a: 'Market-linked — can lose value in short term',
        b: 'FD/RD up to ₹5 lakh insured by RBI (DICGC)',
        winner: 'b',
      },
      {
        aspect: 'Tax on returns',
        a: 'LTCG 12.5% after ₹1.25L gains (ELSS FDs save tax under 80C)',
        b: 'Interest fully taxable as income — added to your tax slab',
        winner: 'a',
      },
      {
        aspect: 'Minimum investment',
        a: '₹500/month SIP (some funds ₹100)',
        b: 'FD: typically ₹1,000+; RD: ₹100/month',
        winner: 'a',
      },
      {
        aspect: 'Liquidity (access to money)',
        a: 'Redeemable anytime (ELSS locked 3 years); funds in 2–3 days',
        b: 'FD: penalty for early withdrawal; RD: can close with minor penalty',
        winner: 'a',
      },
      {
        aspect: 'Effort to start',
        a: 'Need KYC + Aadhaar/PAN; easy via Groww/Zerodha',
        b: 'Available at any bank; minimal paperwork needed',
        winner: 'b',
      },
      {
        aspect: 'Good for whom',
        a: 'Long-term goals: retirement, child education, home purchase',
        b: 'Emergency fund, short-term goals, risk-averse investors',
        winner: 'depends',
      },
    ],
    verdictA: {
      label: 'Choose SIP if:',
      points: [
        'You are investing for 5+ years',
        'You want inflation-beating returns over time',
        'You can handle short-term value fluctuations without panic',
        'You want to build long-term wealth (retirement, child\'s education)',
        'Start with ₹500–1,000/month in a large-cap or index fund',
      ],
    },
    verdictB: {
      label: 'Choose FD/RD if:',
      points: [
        'You need the money in 1–3 years',
        'You cannot afford to risk the principal amount',
        'You are building an emergency fund (3–6 months expenses)',
        'You are risk-averse or new to investing',
        'Your income is irregular and you need stability',
      ],
    },
    recommendation: 'The smartest strategy: keep 3–6 months of expenses in an FD as emergency fund (safety first), then invest any surplus in SIP for long-term goals. Don\'t choose one or the other — use both for different purposes. Start your SIP today even with ₹500. Time in market beats timing the market.',
    relatedGuides: [
      { title: 'Best Mutual Funds for Women Beginners in India', slug: 'best-mutual-funds-women-india' },
      { title: 'How to File ITR as a Housewife in India', slug: 'how-to-file-itr-housewife-india' },
    ],
    relatedWiki: ['itr'],
  },
  {
    slug: 'online-therapy-platforms-india',
    title: 'Best Online Therapy Platforms in India — Compared (2025)',
    metaTitle: 'YourDOST vs BetterLYF vs iCall — Best Online Therapy in India 2025 | PurpleGirl',
    metaDescription: 'Comparing the best online therapy platforms for Indian women in 2025: YourDOST, BetterLYF, iCall, and Wysa. Cost, privacy, quality, and which to choose.',
    labelA: 'Paid Platforms (YourDOST / BetterLYF)',
    labelB: 'Free/Low-Cost (iCall / Wysa)',
    emoji: '🧠',
    category: 'Mental Health',
    categorySlug: 'mental-health-emotions',
    intro: 'Finding an online therapist in India as a woman has never been easier — but choosing between platforms is confusing. Prices range from ₹0 to ₹3,000 per session. Privacy policies differ. Therapist quality varies. This comparison helps you choose the right platform for your situation and budget.',
    quickVerdict: 'For immediate, free support: use iCall (9152987821) or Wysa. For ongoing structured therapy with a consistent therapist: YourDOST or BetterLYF. For the most qualified specialists: seek a private RCI-registered psychologist directly.',
    table: [
      {
        aspect: 'Cost per session',
        a: 'YourDOST: ₹1,000–2,500; BetterLYF: ₹700–2,000',
        b: 'iCall: ₹100–500 (sliding scale); Wysa: free AI + ₹399 human',
        winner: 'b',
      },
      {
        aspect: 'Therapist qualifications',
        a: 'Screened psychologists and counsellors; credentials listed',
        b: 'iCall: trained counsellors supervised by TISS; Wysa: AI + some humans',
        winner: 'a',
      },
      {
        aspect: 'Privacy',
        a: 'Both have privacy policies; anonymous accounts available',
        b: 'iCall: fully confidential; Wysa: anonymous app, no account needed',
        winner: 'b',
      },
      {
        aspect: 'Languages',
        a: 'English, Hindi; limited regional languages',
        b: 'iCall: Hindi, English + select regional; Wysa: English only',
        winner: 'a',
      },
      {
        aspect: 'Formats available',
        a: 'Video, voice, text chat',
        b: 'iCall: voice/video; Wysa: text-based AI + optional human',
        winner: 'a',
      },
      {
        aspect: 'Waiting time',
        a: 'Usually book within 24–48 hours',
        b: 'iCall: varies by demand; Wysa: immediate (AI)',
        winner: 'a',
      },
      {
        aspect: 'Best for',
        a: 'Ongoing therapy, specific diagnosis, structured support',
        b: 'Immediate crisis support, affordability, first-time users',
        winner: 'depends',
      },
    ],
    verdictA: {
      label: 'Choose YourDOST or BetterLYF if:',
      points: [
        'You want ongoing weekly therapy with the same therapist',
        'You have a specific diagnosis (anxiety, depression, relationship issues)',
        'You need video sessions and structured treatment plans',
        'You can afford ₹700–2,500 per session',
        'You want therapist credentials verified before booking',
      ],
    },
    verdictB: {
      label: 'Choose iCall or Wysa if:',
      points: [
        'You need support right now and cannot wait for an appointment',
        'Budget is very limited (iCall accepts sliding scale ₹100–500)',
        'You want to try therapy anonymously before committing',
        'You are in a crisis and need immediate support',
        'You want to start with AI tools to track moods and learn CBT basics',
      ],
    },
    recommendation: 'Start with Wysa or iCall to try therapy for free. If you find it helpful, invest in a consistent YourDOST or BetterLYF therapist for ongoing work. For serious conditions (trauma, severe depression, OCD), skip platforms and see a private RCI-registered psychologist directly — ask for referrals from NIMHANS or local mental health organisations.',
    relatedGuides: [
      { title: 'Signs You Need to See a Therapist', slug: 'signs-you-need-therapist-india' },
      { title: 'How to Talk to Your Family About Therapy', slug: 'how-to-tell-family-about-therapy-india' },
    ],
    relatedWiki: ['gaslighting'],
  },
  {
    slug: 'divorce-vs-legal-separation-india',
    title: 'Divorce vs Legal Separation in India — What is the Difference?',
    metaTitle: 'Divorce vs Legal Separation in India — Complete Comparison | PurpleGirl',
    metaDescription: 'Divorce and legal separation are different legal processes in India. This comparison explains the difference, what rights you get, and which is better for your situation.',
    labelA: 'Divorce',
    labelB: 'Judicial Separation',
    emoji: '⚖️',
    category: 'Legal Rights',
    categorySlug: 'legal-rights',
    intro: 'In India, many women in troubled marriages do not know that "legal separation" (called judicial separation under the Hindu Marriage Act) is an option before full divorce. Both processes protect your rights — but they have very different legal consequences. This comparison helps you understand which path fits your situation.',
    quickVerdict: 'Judicial separation lets you live apart legally without ending the marriage — useful if you are unsure about divorce or have religious/social concerns. Divorce permanently dissolves the marriage but requires either mutual consent or contested grounds. Both protect your maintenance rights.',
    table: [
      {
        aspect: 'What it does',
        a: 'Permanently dissolves the marriage. Both parties are free to remarry.',
        b: 'Legally acknowledges separation but marriage is not dissolved. Neither can remarry.',
        winner: 'depends',
      },
      {
        aspect: 'Can you remarry?',
        a: 'Yes, after divorce decree is final.',
        b: 'No — you are still legally married.',
        winner: 'depends',
      },
      {
        aspect: 'Maintenance rights',
        a: 'Wife can claim permanent alimony and maintenance under Section 25 HMA.',
        b: 'Wife can claim maintenance during separation under Section 25 HMA.',
        winner: 'both',
      },
      {
        aspect: 'How long it takes',
        a: 'Mutual consent: min 6 months; Contested: 2–7 years',
        b: 'Generally 6–18 months for judicial separation decree',
        winner: 'b',
      },
      {
        aspect: 'Can you change your mind?',
        a: 'Mutual consent: can withdraw within 6-month cooling-off period. After decree: no.',
        b: 'Can apply to revoke separation and resume marriage at any time.',
        winner: 'b',
      },
      {
        aspect: 'Child custody',
        a: 'Custody decided permanently in divorce proceedings.',
        b: 'Temporary custody arrangements made during separation period.',
        winner: 'depends',
      },
      {
        aspect: 'Social/family acceptance',
        a: 'Stigma in some communities, but legally clean break.',
        b: 'Seen as less final — may be more acceptable to family initially.',
        winner: 'b',
      },
    ],
    verdictA: {
      label: 'Choose Divorce if:',
      points: [
        'You are certain the marriage cannot be reconciled',
        'You want to be legally free to remarry in the future',
        'There has been cruelty, adultery, or desertion',
        'Both parties agree (mutual consent divorce is faster and cheaper)',
        'You need permanent, legally enforceable alimony settlement',
      ],
    },
    verdictB: {
      label: 'Choose Judicial Separation if:',
      points: [
        'You need to live separately but are unsure about full divorce',
        'Your religion or community has strong views against divorce',
        'You want to protect your legal rights while taking time to decide',
        'You need maintenance from your spouse during separation',
        'You want to preserve the option to reconcile later',
      ],
    },
    recommendation: 'Speak to a family lawyer before deciding — most initial consultations are free (or use Legal Aid via your District Legal Services Authority). Both options protect your maintenance and property rights. Judicial separation is often a first step that gives you space and legal protection while you decide about divorce.',
    relatedGuides: [
      { title: 'How to File for Divorce in India', slug: 'how-to-file-divorce-india' },
      { title: 'Maintenance Rights of Wife in India', slug: 'maintenance-rights-wife-india' },
    ],
    relatedWiki: ['section-498a'],
  },
];

export function getComparePage(slug: string): ComparePage | undefined {
  return COMPARE_PAGES.find(p => p.slug === slug);
}

export function getAllCompareSlugs(): string[] {
  return COMPARE_PAGES.map(p => p.slug);
}
