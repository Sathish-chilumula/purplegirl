/**
 * wiki-terms.ts
 *
 * Static knowledge base for /wiki/[slug] definition pages.
 * Edge-compatible — no Supabase call needed.
 * Each entry gives a full definition, key facts, and related guide slugs.
 */

export interface WikiTerm {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  categorySlug: string;
  emoji: string;
  shortDef: string; // 1-sentence plain-English definition
  intro: string;    // 2-3 sentence intro paragraph
  sections: {
    heading: string;
    body: string;
  }[];
  keyFacts: string[];
  relatedGuides: {
    title: string;
    slug: string;
  }[];
  relatedWiki: string[]; // other wiki slugs
}

export const WIKI_TERMS: WikiTerm[] = [
  {
    slug: 'pcos',
    title: 'What is PCOS?',
    metaTitle: 'What is PCOS? — Causes, Symptoms & Treatment for Indian Women | PurpleGirl',
    metaDescription: 'PCOS (Polycystic Ovary Syndrome) explained simply. Learn the causes, signs, and how Indian women manage PCOS with diet and treatment.',
    category: "Women's Health",
    categorySlug: 'womens-health',
    emoji: '🌸',
    shortDef: 'PCOS (Polycystic Ovary Syndrome) is a hormonal condition that affects how a woman\'s ovaries work.',
    intro: 'PCOS is one of the most common hormonal conditions in India — affecting 1 in 5 women of reproductive age. It happens when the ovaries produce too many androgens (male hormones), disrupting the normal menstrual cycle. Despite being extremely common, it is widely misunderstood and often goes undiagnosed for years.',
    sections: [
      {
        heading: 'What Actually Happens in PCOS?',
        body: "In a healthy cycle, the ovaries release one egg each month. With PCOS, hormonal imbalance means eggs don't mature properly — they form small fluid-filled sacs (cysts) instead of being released. This causes irregular or absent periods and raises levels of androgens, which leads to symptoms like acne, excess hair, and weight gain. The name is slightly misleading — you don't need to have cysts to have PCOS, and having cysts doesn't automatically mean PCOS.",
      },
      {
        heading: 'Common Symptoms',
        body: "Symptoms vary widely between women. Common signs include: irregular or missed periods (fewer than 8 per year), excess hair on face, chest, or back (hirsutism), acne or oily skin, thinning hair on the scalp, weight gain (especially around the belly), difficulty getting pregnant, dark patches of skin around the neck or armpits, and mood swings or depression. Many women only discover they have PCOS when they struggle to conceive.",
      },
      {
        heading: 'How is PCOS Diagnosed?',
        body: "A doctor diagnoses PCOS using the Rotterdam Criteria — you need at least 2 of 3 signs: (1) irregular or absent ovulation, (2) excess androgen levels (from blood test or symptoms), (3) polycystic ovaries on ultrasound. A single blood test or ultrasound alone cannot confirm or rule out PCOS. Common tests include: hormonal panel (LH, FSH, testosterone, AMH), thyroid function test, fasting glucose and insulin levels, and a pelvic ultrasound.",
      },
      {
        heading: 'PCOS and Indian Women',
        body: "Indian women are at higher risk of PCOS-related insulin resistance compared to Western populations due to genetic factors and dietary patterns high in refined carbohydrates. Studies show 20–25% of Indian women of reproductive age have PCOS, compared to 8–13% globally. The condition is frequently dismissed as 'just irregular periods' or linked to stress — causing years of delayed diagnosis. PCOS is not caused by eating too much or laziness. It is a genetic hormonal condition.",
      },
      {
        heading: 'Management and Treatment',
        body: "PCOS has no cure, but symptoms are very manageable. Lifestyle changes are the first-line treatment: eating a low-glycaemic diet (less white rice, maida, sugar), regular exercise (even 30 minutes of walking helps), and maintaining a healthy weight (even 5–10% weight loss can restore periods). Medical treatment includes metformin (for insulin resistance), hormonal birth control (to regulate periods), and fertility medications like clomiphene for those trying to conceive. Speak to a gynaecologist who specialises in endocrinology for a personalised plan.",
      },
    ],
    keyFacts: [
      '1 in 5 Indian women have PCOS',
      "You don't need cysts to have PCOS",
      'PCOS is the most common cause of female infertility in India',
      'Lifestyle changes can reverse many symptoms',
      'PCOS does not mean you cannot get pregnant',
      'Thyroid issues often co-exist with PCOS — get both tested',
    ],
    relatedGuides: [
      { title: 'PCOS Diet Plan for Indian Women', slug: 'pcos-diet-plan-indian-women' },
      { title: 'How to Manage PCOS Naturally', slug: 'how-to-manage-pcos-naturally-india' },
      { title: 'PCOS and Pregnancy — What You Need to Know', slug: 'pcos-pregnancy-guide-india' },
    ],
    relatedWiki: ['ivf'],
  },

  {
    slug: 'gaslighting',
    title: 'What is Gaslighting?',
    metaTitle: 'What is Gaslighting? Signs, Examples & How to Respond | PurpleGirl',
    metaDescription: 'Gaslighting is a form of emotional abuse where someone makes you doubt your own memory and feelings. Learn the signs and how Indian women can protect themselves.',
    category: 'Relationships & Marriage',
    categorySlug: 'relationships-marriage',
    emoji: '🧠',
    shortDef: "Gaslighting is a form of psychological manipulation where someone makes you doubt your own memory, feelings, or sanity.",
    intro: "Gaslighting is emotional abuse that is invisible — there are no bruises, no raised voices, just a slow erosion of your confidence in your own mind. The term comes from a 1944 film where a husband dims the gaslights and then tells his wife she is imagining it. In relationships, it is one of the most dangerous forms of control because the victim often blames themselves.",
    sections: [
      {
        heading: 'How Gaslighting Works',
        body: "A gaslighter systematically rewrites reality to make you question your own perceptions. It often starts subtly — dismissing your feelings as oversensitive, denying things they said, or minimising events you clearly remember. Over time, the cumulative effect makes you so uncertain of your own judgment that you start depending on the abuser to tell you what is real. This is deliberate — it keeps you unable to trust yourself enough to leave.",
      },
      {
        heading: 'Common Examples in Indian Families',
        body: 'Gaslighting in Indian households often looks like: "You are too sensitive, this is just how our family talks." / "I never said that, you are making things up again." / "Your own parents agree with me — ask them." / "You are crazy if you think I was flirting." / "You only feel this way because your friends are putting ideas in your head." / "I do everything for this family and you complain about nothing." / "In our culture, this is normal. What is your problem?" The cultural expectation of female sacrifice makes Indian women more vulnerable to accepting gaslighting as normal.',
      },
      {
        heading: 'Signs You Are Being Gaslighted',
        body: "You may be experiencing gaslighting if you: constantly second-guess yourself before speaking; apologise frequently without knowing what you did wrong; feel confused or 'crazy' after conversations with this person; make excuses for your partner's behaviour to friends and family; feel like you used to be more confident and happy; frequently ask yourself 'Am I being unreasonable?' Check: does this feeling only happen with one specific person? That is a strong signal.",
      },
      {
        heading: 'The Long-Term Damage',
        body: "Sustained gaslighting causes anxiety, depression, and a condition called trauma bonding — where you feel intensely loyal to the person harming you. Many women leave abusive relationships and still hear their abuser's voice in their head telling them they are wrong. Recovery requires rebuilding trust in your own perceptions, often with the help of a therapist who specialises in narcissistic abuse.",
      },
      {
        heading: 'What You Can Do',
        body: "Start keeping a private journal — dates, exact words, what happened. When gaslighting is ongoing, your written record becomes an anchor to reality. Confide in one trusted person outside the relationship. Do not try to 'prove' gaslighting to the gaslighter — they will deny it and use your attempt against you. If you are in danger, contact iCall (9152987821) or the Women Helpline (181). For emotional support, the anonymous ask box on PurpleGirl is available 24/7.",
      },
    ],
    keyFacts: [
      'Gaslighting is a recognised form of domestic abuse',
      'It affects men and women, but women are statistically more targeted',
      'Gaslighting often co-occurs with other forms of emotional and physical abuse',
      'The abuser may not be consciously aware they are doing it',
      'Leaving a gaslighting relationship is one of the hardest things to do — your self-trust has been damaged',
      'Recovery is possible with therapy and support',
    ],
    relatedGuides: [
      { title: 'Signs Your Marriage is Emotionally Abusive', slug: 'signs-emotionally-abusive-marriage-india' },
      { title: 'How to Leave a Toxic Relationship Safely', slug: 'how-to-leave-toxic-relationship-india' },
    ],
    relatedWiki: ['section-498a'],
  },

  {
    slug: 'itr',
    title: 'What is ITR (Income Tax Return)?',
    metaTitle: 'What is ITR (Income Tax Return)? Complete Guide for Indian Women | PurpleGirl',
    metaDescription: 'ITR (Income Tax Return) explained simply. Who must file, when, and why it benefits Indian women — including housewives, freelancers, and salaried women.',
    category: 'Finance & Money',
    categorySlug: 'finance-money',
    emoji: '💰',
    shortDef: 'ITR (Income Tax Return) is a form you file with the Indian Income Tax Department declaring your income and the tax you have paid or owe.',
    intro: "Filing an Income Tax Return is often seen as complicated or only for businesspeople — but every earning Indian woman should understand it. Even housewives and women with no income can benefit from filing an ITR. It is one of the most important financial documents you can own.",
    sections: [
      {
        heading: 'What is an ITR and Why Does It Matter?',
        body: "An Income Tax Return is an official declaration to the government about your income for a financial year (April to March). Even if your income is below the taxable limit, filing a return creates an official record of your financial existence. Banks, visa consulates, lenders, and government schemes all ask for ITR documents. A woman who has never filed an ITR has a much harder time getting a loan in her own name, getting a visa, or claiming government benefits.",
      },
      {
        heading: 'Who Must File ITR in India?',
        body: "You are required to file an ITR if: your gross total income exceeds ₹2.5 lakh per year (₹3 lakh if you are above 60). Even below these limits, you must file if: you have a foreign bank account or foreign income; your electricity bill exceeded ₹1 lakh in a year; you want to claim a refund on tax deducted; you deposited more than ₹1 crore in bank accounts; you want to carry forward a business loss.",
      },
      {
        heading: 'Why Housewives Should File ITR',
        body: "Even with zero personal income, filing an ITR benefits housewives: (1) If you later receive money from selling property, jewellery, or investments, you will need to show ITR history. (2) Many government loan schemes for women require 2 years of ITR. (3) If your husband transfers money to you and you invest it — those returns are taxable in your hands, and filing is required. (4) Visa applications for countries like the US, UK, and Schengen require ITR proof. (5) In case of divorce, your own financial records are critical. File a nil return — it costs nothing and creates your financial identity.",
      },
      {
        heading: 'How to File ITR Online',
        body: "Visit incometax.gov.in. Register with your PAN number. Download Form 26AS — this shows all tax deducted in your name. Choose the correct ITR form (ITR-1 for salaried; ITR-2 for capital gains; ITR-3 for business income). Fill in income, deductions (Section 80C, 80D for health insurance), and verify tax paid. Submit and e-verify using Aadhaar OTP or net banking. The deadline is typically 31 July for individuals. Late filing attracts a penalty of ₹5,000 (or ₹1,000 if income is below ₹5 lakh).",
      },
    ],
    keyFacts: [
      'The ITR deadline is 31 July each year',
      'You can file for up to 2 previous years (belated returns)',
      'Filing ITR builds your credit score indirectly',
      'Tax refunds from TDS deductions only happen if you file',
      'Form 26AS is your tax credit statement — always download it first',
      'Women entrepreneurs can claim home office expenses as deductions',
    ],
    relatedGuides: [
      { title: 'How to File ITR as a Housewife in India', slug: 'how-to-file-itr-housewife-india' },
      { title: 'Best Mutual Funds for Women Beginners in India', slug: 'best-mutual-funds-women-india' },
    ],
    relatedWiki: [],
  },

  {
    slug: 'ivf',
    title: 'What is IVF?',
    metaTitle: 'What is IVF? Cost, Process & Success Rate in India | PurpleGirl',
    metaDescription: 'IVF (In Vitro Fertilisation) explained simply. Understand the process, realistic success rates, and IVF cost in India for 2025.',
    category: 'Pregnancy & Fertility',
    categorySlug: 'pregnancy-fertility',
    emoji: '🤱',
    shortDef: "IVF (In Vitro Fertilisation) is a fertility treatment where an egg is fertilised by sperm outside the body in a laboratory, then transferred to the uterus.",
    intro: "IVF has helped millions of Indian families have children after years of struggling to conceive. Understanding exactly what happens — step by step — removes the fear of the unknown and helps you make informed decisions with your doctor. IVF is not a last resort; in many cases, it is the most effective first option.",
    sections: [
      {
        heading: 'How IVF Works — Step by Step',
        body: "Step 1 — Ovarian Stimulation (10–14 days): Daily hormone injections stimulate your ovaries to produce multiple eggs instead of the usual one. Step 2 — Egg Retrieval (Day 14–15): Under mild sedation, a doctor uses a fine needle guided by ultrasound to collect eggs from the ovaries. This takes about 20 minutes. Step 3 — Fertilisation: Eggs are combined with sperm in a laboratory dish. If sperm quality is low, a single sperm is injected directly into each egg (ICSI). Step 4 — Embryo Development (3–5 days): Fertilised eggs are monitored as they develop into embryos. Step 5 — Embryo Transfer: One or two embryos are placed into the uterus using a thin catheter. No anaesthesia needed. Step 6 — Pregnancy Test: After 14 days, a blood test checks if the embryo has implanted successfully.",
      },
      {
        heading: 'IVF Success Rates in India',
        body: "IVF success depends heavily on age. Average success rates per cycle in India: under 35 years — 40–50%; 35–37 years — 30–40%; 38–40 years — 20–30%; over 40 years — 10–15%. These are per-cycle rates — many women need 2–3 cycles. Clinics with inflated success rate claims (above 60%) should raise red flags. Always ask for 'live birth rate per cycle started' — not just 'positive pregnancy rate'.",
      },
      {
        heading: 'IVF Cost in India (2025)',
        body: "A single IVF cycle costs ₹1.2–2.5 lakh in most Indian cities. This includes: hormone injections (₹25,000–60,000), egg retrieval procedure, embryology lab fees, and embryo transfer. Additional costs: ICSI (₹15,000–25,000 extra if needed), embryo freezing (₹15,000–30,000 per year storage), preimplantation genetic testing (₹40,000–80,000 if needed). Government hospitals (AIIMS, PGIMER) offer IVF at subsidised rates — sometimes as low as ₹30,000–50,000, but waiting lists are long. Avoid clinics offering IVF below ₹80,000 — cut-price IVF often cuts corners on lab quality.",
      },
      {
        heading: 'Who Should Consider IVF?',
        body: "IVF is recommended when: fallopian tubes are blocked or damaged; the male partner has very low sperm count or motility; a woman has severe endometriosis; previous fertility treatments (IUI, ovulation induction) have failed after 3–4 cycles; age is above 38 and time is a factor; or when using donor eggs or sperm. PCOS alone rarely requires IVF — most PCOS-related infertility responds to simpler treatments like clomiphene or letrozole.",
      },
      {
        heading: 'Emotional Side of IVF',
        body: "IVF is physically and emotionally demanding. The hormones cause mood swings; the two-week wait after transfer is agonising; and a failed cycle can feel like grief. It is essential to: have your partner or a support person attend appointments; join an IVF support community (many on WhatsApp and Facebook for Indian women); and speak to a counsellor if anxiety or depression develops. Failed cycles do not mean IVF will never work — ask your doctor what to adjust before the next cycle.",
      },
    ],
    keyFacts: [
      'IVF does not increase your risk of cancer',
      'Twins are more common with IVF (if two embryos transferred)',
      'Frozen embryo transfers often have better success rates than fresh',
      'PCOS patients are at higher risk of Ovarian Hyperstimulation Syndrome (OHSS) — tell your doctor',
      'Age of the egg matters most — donor eggs significantly improve success over 42',
      'IVF babies have the same health outcomes as naturally conceived babies',
    ],
    relatedGuides: [
      { title: 'IVF Cost in India — Complete Guide 2025', slug: 'ivf-cost-india-complete-guide' },
      { title: 'PCOS and Pregnancy — What You Need to Know', slug: 'pcos-pregnancy-guide-india' },
    ],
    relatedWiki: ['pcos'],
  },

  {
    slug: 'section-498a',
    title: 'What is Section 498A?',
    metaTitle: 'What is Section 498A? Rights of Married Women in India | PurpleGirl',
    metaDescription: 'Section 498A IPC protects married Indian women from cruelty by husband or in-laws. Understand what qualifies as cruelty, how to file, and your rights.',
    category: 'Legal Rights',
    categorySlug: 'legal-rights',
    emoji: '⚖️',
    shortDef: "Section 498A of the Indian Penal Code makes it a criminal offence for a husband or his relatives to subject a wife to cruelty.",
    intro: "Section 498A was introduced in 1983 specifically to protect married Indian women from cruelty at the hands of husbands and in-laws — including physical violence, emotional abuse, and dowry harassment. It is a cognisable and non-bailable offence, meaning police can arrest without a warrant and bail is not automatic. Understanding this law is the first step to knowing your rights.",
    sections: [
      {
        heading: 'What Counts as Cruelty Under 498A?',
        body: "The law defines cruelty as: (1) Any conduct by the husband or his relatives that drives a woman to suicide or causes grave injury to her health — physical or mental. (2) Harassment to force the woman or her family to give dowry or any other property. Cruelty under 498A is broader than physical violence. It includes: constant verbal abuse and humiliation; being locked in the house; threats; being denied food or medical care; being forced to work and hand over all earnings; harassment specifically connected to dowry demands.",
      },
      {
        heading: 'Who Can File a Complaint?',
        body: "The complaint can be filed by: the woman herself; her parents or siblings; any relative; or the police can take suo-motu cognizance if they have information. The woman does not have to have left the matrimonial home to file. A complaint can be filed even if the woman is still living with her husband. The limitation period (time to file) is 3 years from the date of cruelty.",
      },
      {
        heading: 'What Happens After Filing?',
        body: "Section 498A is cognisable and non-bailable. This means: police must register an FIR when a complaint is made; they can arrest the accused without a magistrate's warrant; the accused must apply to a Sessions Court for anticipatory bail (which may or may not be granted). After arrest, the accused can apply for regular bail. The case is tried in a Magistrate's Court. If convicted, the husband or relatives can face up to 3 years imprisonment and/or a fine.",
      },
      {
        heading: 'The Misuse Controversy',
        body: "Section 498A has been controversial due to allegations of misuse — where the law is invoked to harass the husband's family in divorce disputes. In 2014, the Supreme Court in Arnesh Kumar v State of Bihar ruled that police cannot arrest immediately; they must conduct an investigation first. In practice, this has made it harder for genuine victims to get quick action. If you are filing a genuine complaint, document everything — messages, photos of injuries, witnesses — to ensure your case is strong.",
      },
      {
        heading: 'Related Laws You Should Know',
        body: "498A often works alongside: Protection of Women from Domestic Violence Act 2005 (civil law — allows protection orders, residence orders, compensation); Dowry Prohibition Act 1961 (criminal penalty for giving or taking dowry); Section 304B IPC (dowry death — if a woman dies within 7 years of marriage under suspicious circumstances). A good family law advocate will advise you on combining these for maximum protection.",
      },
    ],
    keyFacts: [
      'Section 498A is a cognisable, non-bailable, and non-compoundable offence',
      'Non-compoundable means the case cannot be withdrawn once filed (in most states)',
      'Supreme Court ruled in 2014 that arrests must not be automatic',
      'The punishment is up to 3 years imprisonment + fine',
      'Both husband and in-laws can be charged',
      'You can file a complaint even if still living in the matrimonial home',
    ],
    relatedGuides: [
      { title: 'How to File a Domestic Violence Complaint in India', slug: 'domestic-violence-complaint-india' },
      { title: 'How to File for Divorce in India — Step by Step', slug: 'how-to-file-divorce-india' },
    ],
    relatedWiki: ['dowry-prohibition-act', 'gaslighting'],
  },

  {
    slug: 'dowry-prohibition-act',
    title: 'What is the Dowry Prohibition Act?',
    metaTitle: 'What is the Dowry Prohibition Act 1961? Your Rights as an Indian Woman | PurpleGirl',
    metaDescription: 'The Dowry Prohibition Act 1961 makes giving and taking dowry illegal in India. Understand what counts as dowry, the punishment, and how to report dowry harassment.',
    category: 'Legal Rights',
    categorySlug: 'legal-rights',
    emoji: '⚖️',
    shortDef: "The Dowry Prohibition Act 1961 makes it illegal in India to give or receive dowry in connection with a marriage.",
    intro: "Dowry — the money, property, or gifts demanded by a groom's family from a bride's family — has been illegal in India since 1961. Yet dowry-related violence and deaths remain a serious problem. The Dowry Prohibition Act, combined with Section 498A IPC and Section 304B IPC (dowry death), form India's legal shield for married women. Knowing this law is your armour.",
    sections: [
      {
        heading: 'What is Dowry Under the Law?',
        body: "The Dowry Prohibition Act 1961 defines dowry as any property or valuable security given or agreed to be given directly or indirectly — (a) by one party to a marriage to the other party; or (b) by the parents of either party, or by any other person — as a condition of the marriage. Importantly, the law covers both demands before AND after marriage. Gifts given voluntarily (with love, no demand) are not dowry. But if gifts are given under pressure or as a demand, they qualify as dowry.",
      },
      {
        heading: 'What is Illegal Under the Act?',
        body: "Three things are criminal: (1) Giving dowry — punishable by 5 years imprisonment or ₹15,000 fine (whichever is higher). (2) Taking dowry — same punishment. (3) Demanding dowry — punishable by at least 6 months imprisonment, up to 2 years, and/or ₹10,000 fine. The demand alone — even if no dowry was actually given — is a criminal offence. A wedding card that lists 'gifts expected' could be considered demand evidence.",
      },
      {
        heading: 'Stridhan — What Belongs to the Wife',
        body: "Stridhan is the property — jewellery, gifts, cash — given to a woman personally at the time of her marriage or afterwards. Stridhan belongs entirely to the wife. The husband or in-laws have no legal right to it. If they take it, refuse to return it, or use it without her consent, it is criminal misappropriation. Many Indian women do not know that the gold jewellery gifted to them by their parents at the wedding is legally theirs — not the household's.",
      },
      {
        heading: 'Section 304B — Dowry Death',
        body: "If a woman dies within 7 years of marriage from burns, bodily injury, or suspicious circumstances, and she was subjected to cruelty or harassment related to dowry demands, it is treated as a 'dowry death' under Section 304B IPC. This is punishable by a minimum of 7 years, up to life imprisonment. The law presumes the husband and in-laws are guilty — they must prove otherwise. This reverse burden of proof is intentional and powerful.",
      },
      {
        heading: 'How to Report Dowry Harassment',
        body: "If you or someone you know is facing dowry demands or harassment: (1) Call Women Helpline 181 (available 24/7, free). (2) File a complaint at your nearest police station — give them a written complaint with specific incidents and dates. (3) Contact the National Commission for Women (ncwapps.nic.in) for online complaints. (4) Approach a women's cell at your city's police commissioner office — they handle matrimonial cases sensitively. Keep evidence: screenshots of messages demanding dowry are powerful in court.",
      },
    ],
    keyFacts: [
      'Dowry has been illegal in India since 1961',
      'Demanding dowry is a crime — even if no dowry is given',
      'Stridhan (jewellery etc. given to bride) belongs legally to the wife',
      'Dowry death carries a minimum 7-year sentence',
      'Parents who give dowry under duress cannot be prosecuted',
      'The National Commission for Women accepts online dowry complaints',
    ],
    relatedGuides: [
      { title: 'Property Rights of Wife After Husband Death in India', slug: 'property-rights-wife-husband-death-india' },
      { title: 'How to File for Divorce in India', slug: 'how-to-file-divorce-india' },
    ],
    relatedWiki: ['section-498a', 'gaslighting'],
  },
];

export function getWikiTerm(slug: string): WikiTerm | undefined {
  return WIKI_TERMS.find(t => t.slug === slug);
}

export function getAllWikiSlugs(): string[] {
  return WIKI_TERMS.map(t => t.slug);
}
