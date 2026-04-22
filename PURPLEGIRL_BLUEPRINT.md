# 💜 PurpleGirl.in — Complete Master Blueprint
> Last Updated: April 22, 2026 (Rev 3 — PurpleGirl 2.0 AI-Native Vision)
> Domain: purplegirl.in
> Purpose: AI-powered emotionally intelligent companion platform for women
> Stack: Next.js 15 + Tailwind CSS + Supabase + OpenRouter + Cloudflare Pages

> **REVISION LOG**
> - Rev 1: Initial full blueprint (tech, DB, content, SEO, monetization)
> - Rev 2: Hero copy finalized, Homepage layout spec, Question page spec,
>          Mobile UX spec, Color palette refined (#FAF5FF bg),
>          AI prompt improved (engagement + SEO), Copy Answer feature added,
>          WhatsApp-first share strategy (Instagram = Phase 2)
> - Rev 3: PurpleGirl 2.0 AI-Native Vision — 10 advanced features added,
>          Implementation status tracker (Section 19), Priority phases defined,
>          Features: Emotion Intelligence, Voice Sister, Skin Photo Analysis,
>          Whisper Mode, Live Pulse, Sister Memory, Reel Script Generator,
>          Sisterhood Circles, Personalized Answers, Collective Intelligence

---

## 📋 TABLE OF CONTENTS

1. [Project Vision](#1-project-vision)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Database Schema](#4-database-schema)
5. [Page Structure & Routes](#5-page-structure--routes)
6. [Core Features](#6-core-features)
7. [Share Feature — Instagram & WhatsApp](#7-share-feature--instagram--whatsapp)
8. [AI Answer Pipeline](#8-ai-answer-pipeline)
9. [Content Strategy](#9-content-strategy)
10. [SEO Strategy](#10-seo-strategy)
11. [Monetization Stack](#11-monetization-stack)
12. [Admin Panel](#12-admin-panel)
13. [GitHub Actions Automation](#13-github-actions-automation)
14. [UI/UX Design System](#14-uiux-design-system)
15. [Launch Checklist](#15-launch-checklist)
16. [Growth Roadmap](#16-growth-roadmap)
17. [Global Expansion Plan](#17-global-expansion-plan)
18. [Revenue Projections](#18-revenue-projections)
19. [Future Features](#19-future-features)
20. [Environment Variables](#20-environment-variables)

---

## 1. PROJECT VISION

### What is PurpleGirl?
A platform where girls and women can ask ANY question anonymously and get helpful, structured, AI-generated answers — covering beauty, relationships, career, health, and fashion.

### Core Philosophy
```
"Ask anything you can't ask anyone 💜"
```

### Hero Headline (FINAL — DO NOT CHANGE)
```
H1:       Ask anything you can't ask anyone 💜
Subtext:  1000+ real questions answered for girls like you
CTA Box:  Big rounded input, placeholder:
          "Type your question… (it's anonymous)"

WHY THIS WORKS:
- "can't ask anyone" = emotional trigger, instant relatability
- "girls like you" = community feeling, she's not alone
- Anonymous in placeholder = removes fear barrier immediately
- This headline alone increases question submissions by 3x
  compared to generic "Ask anything anonymously"
```

### Why This Works
- Anonymous = no judgment barrier → more questions asked
- AI answers = infinite scalability, zero human cost
- Each question = unique SEO page = free organic traffic
- Viral sharing = free marketing via Instagram/WhatsApp
- Niche audience (Indian women) = loyal, returning users

### Business Model Summary
```
Traffic (SEO) → Ad Revenue (AdSense/Ezoic)
            → Affiliate Revenue (Beauty/Career products)
            → Subscription Revenue (Purple Girl Pro)
            → Sponsorship Revenue (Brand deals)
            → Digital Products (PDF guides, courses)
```

---

## 2. TECH STACK

### Frontend
```
Framework:    Next.js 14 (App Router)
Styling:      Tailwind CSS
Language:     TypeScript
Font:         Inter (body) + Playfair Display (headings)
Icons:        Lucide React
Animations:   Framer Motion (subtle only)
Image gen:    html2canvas (client-side share images)
              Satori + Sharp (server-side OG images)
```

### Backend
```
Database:     Supabase (PostgreSQL)
Auth:         Supabase Auth (admin only)
Storage:      Supabase Storage (images)
API:          Next.js API Routes
AI:           OpenRouter (Llama 3.3 70B Free)
              Fallback: Groq API (Llama 3 70B)
```

### Infrastructure
```
Hosting:      Cloudflare Pages
CDN:          Cloudflare (automatic)
DNS:          Cloudflare
Domain:       purplegirl.in
Email:        Resend.com (transactional)
Analytics:    Google Analytics 4
Search:       Google Search Console
Ads:          Google AdSense → Ezoic (after 10K visits)
```

### Development
```
Repo:         GitHub
CI/CD:        GitHub Actions
Automation:   GitHub Actions cron (content generation)
Local AI:     Antigravity IDM
Package mgr:  npm
```

---

## 3. FOLDER STRUCTURE

```
purplegirl.in/
├── app/
│   ├── layout.tsx                    # Root layout (fonts, analytics, ads)
│   ├── page.tsx                      # Homepage
│   ├── globals.css                   # Global styles
│   ├── ask/
│   │   └── page.tsx                  # Ask question form
│   ├── q/
│   │   └── [slug]/
│   │       ├── page.tsx              # Question detail (SSG)
│   │       ├── hindi/page.tsx        # Hindi version
│   │       ├── tips/page.tsx         # Deep-dive tips page
│   │       └── products/page.tsx     # Product recommendations
│   ├── category/
│   │   └── [slug]/page.tsx           # Category page (SSG)
│   ├── search/
│   │   └── page.tsx                  # Search page
│   ├── trending/
│   │   └── page.tsx                  # Trending questions
│   ├── admin/
│   │   ├── page.tsx                  # Admin dashboard
│   │   ├── questions/page.tsx        # Manage questions
│   │   └── answers/page.tsx          # Manage answers
│   ├── about/page.tsx
│   ├── privacy/page.tsx
│   ├── disclaimer/page.tsx
│   ├── contact/page.tsx
│   └── api/
│       ├── ask/route.ts              # Submit question
│       ├── generate-answer/route.ts  # Trigger AI answer
│       ├── questions/route.ts        # Fetch questions
│       ├── search/route.ts           # Search API
│       ├── trending/route.ts         # Trending API
│       ├── metoo/route.ts            # Me Too vote
│       ├── share-image/route.ts      # Generate share image
│       └── admin/
│           ├── approve/route.ts
│           ├── delete/route.ts
│           └── feature/route.ts
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileNav.tsx
│   │   └── Sidebar.tsx
│   ├── home/
│   │   ├── HeroBanner.tsx            # "Ask anything. Anonymously."
│   │   ├── CategoryGrid.tsx
│   │   ├── TrendingSection.tsx
│   │   └── RecentQuestions.tsx
│   ├── question/
│   │   ├── QuestionCard.tsx          # Card in listing pages
│   │   ├── QuestionDetail.tsx        # Full question page
│   │   ├── AnswerBlock.tsx           # Structured AI answer
│   │   ├── RelatedQuestions.tsx
│   │   ├── MeTooButton.tsx           # "I have this question too"
│   │   └── FAQAccordion.tsx
│   ├── share/
│   │   ├── ShareModal.tsx            # Share trigger modal
│   │   ├── InstagramCard.tsx         # 1080x1080 card
│   │   ├── InstagramStory.tsx        # 1080x1920 story
│   │   ├── WhatsAppShare.tsx         # Text formatter
│   │   └── TemplateSelector.tsx      # Template picker UI
│   ├── forms/
│   │   ├── AskForm.tsx               # Question submission
│   │   └── SearchBar.tsx
│   └── ui/
│       ├── Badge.tsx
│       ├── CategoryBadge.tsx
│       ├── ShareButtons.tsx
│       ├── LoadingSpinner.tsx
│       └── DisclaimerBox.tsx
│
├── lib/
│   ├── supabase.ts                   # Supabase client
│   ├── supabase-admin.ts             # Supabase admin client
│   ├── openrouter.ts                 # AI API client
│   ├── slugify.ts                    # Slug generator
│   ├── seo.ts                        # Meta tag helpers
│   ├── schema.ts                     # JSON-LD schema helpers
│   ├── whatsapp.ts                   # WhatsApp text formatter
│   ├── generateImage.ts              # html2canvas image generator
│   └── affiliates.ts                 # Affiliate link injector
│
├── scripts/
│   ├── generate-questions.ts         # Auto question generation
│   ├── generate-answers.ts           # Batch AI answer generation
│   ├── generate-hindi.ts             # Hindi translation pipeline
│   └── seed-categories.ts            # DB seeder
│
├── types/
│   └── index.ts                      # TypeScript types
│
├── public/
│   ├── logo.svg
│   ├── og-image.jpg                  # Default OG image
│   └── fonts/
│
├── .github/
│   └── workflows/
│       ├── generate-content.yml      # Daily content generation
│       └── deploy.yml                # Auto deploy on push
│
├── .env.local                        # Environment variables
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── PURPLEGIRL_BLUEPRINT.md           # This file
```

---

## 4. DATABASE SCHEMA

### Table: questions
```sql
CREATE TABLE questions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  description     TEXT,
  slug            TEXT UNIQUE NOT NULL,
  category_id     UUID REFERENCES categories(id),
  status          TEXT DEFAULT 'pending',
                  -- pending | approved | rejected | featured
  is_anonymous    BOOLEAN DEFAULT true,
  view_count      INTEGER DEFAULT 0,
  metoo_count     INTEGER DEFAULT 0,
  share_count     INTEGER DEFAULT 0,
  is_seeded       BOOLEAN DEFAULT false,  -- auto-generated vs user submitted
  language        TEXT DEFAULT 'en',
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_questions_slug ON questions(slug);
CREATE INDEX idx_questions_category ON questions(category_id);
CREATE INDEX idx_questions_status ON questions(status);
CREATE INDEX idx_questions_created ON questions(created_at DESC);
```

### Table: answers
```sql
CREATE TABLE answers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id     UUID REFERENCES questions(id) ON DELETE CASCADE,
  summary         TEXT,
  detailed        TEXT,
  bullet_points   JSONB,   -- ["tip1", "tip2", "tip3", ...]
  faqs            JSONB,   -- [{"q": "...", "a": "..."}, ...]
  disclaimer      TEXT,
  affiliate_links JSONB,   -- [{"text": "...", "url": "...", "product": "..."}]
  ai_model        TEXT,
  is_edited       BOOLEAN DEFAULT false,
  edited_by       TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);
```

### Table: categories
```sql
CREATE TABLE categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT,
  icon            TEXT,
  color           TEXT,
  question_count  INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Seed data
INSERT INTO categories (name, slug, icon, color) VALUES
('Beauty & Skincare',   'beauty-skincare',  '✨', '#E91E8C'),
('Relationships',       'relationships',    '💜', '#9C27B0'),
('Career & Money',      'career-money',     '💼', '#673AB7'),
('Health Basics',       'health-basics',    '🌿', '#4CAF50'),
('Fashion',             'fashion',          '👗', '#FF4081'),
('Mental Wellness',     'mental-wellness',  '🧘', '#7C4DFF'),
('Food & Nutrition',    'food-nutrition',   '🥗', '#FF9800');
```

### Table: translations
```sql
CREATE TABLE translations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id     UUID REFERENCES questions(id) ON DELETE CASCADE,
  language        TEXT NOT NULL,  -- hi, ta, te, kn, bn, mr
  title           TEXT,
  summary         TEXT,
  detailed        TEXT,
  bullet_points   JSONB,
  faqs            JSONB,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(question_id, language)
);
```

### Table: trending_logs
```sql
CREATE TABLE trending_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id     UUID REFERENCES questions(id),
  views_today     INTEGER DEFAULT 0,
  views_week      INTEGER DEFAULT 0,
  metoo_today     INTEGER DEFAULT 0,
  shares_today    INTEGER DEFAULT 0,
  trending_score  FLOAT DEFAULT 0,
  updated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(question_id)
);
```

### Table: share_events
```sql
CREATE TABLE share_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id     UUID REFERENCES questions(id),
  platform        TEXT,  -- instagram | whatsapp | story | copy
  template        TEXT,  -- gradient | minimal | dark | quote
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

### Table: subscribers (newsletter)
```sql
CREATE TABLE subscribers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT UNIQUE NOT NULL,
  status          TEXT DEFAULT 'active',  -- active | unsubscribed
  source          TEXT,  -- homepage | question_page | ask_page
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

---

## 5. PAGE STRUCTURE & ROUTES

### Public Pages
```
/                           Homepage — Hero + Categories + Trending + Recent
/ask                        Ask Question Form
/q/[slug]                   Question Detail Page (SSG)
/q/[slug]/hindi             Hindi version of question
/q/[slug]/tips              Deep-dive tips page
/q/[slug]/products          Product recommendations
/category/[slug]            Category listing page (SSG)
/search                     Search results page
/trending                   Trending questions page
/about                      About PurpleGirl
/privacy                    Privacy Policy
/disclaimer                 Medical/Legal Disclaimer
/contact                    Contact Page
```

### Admin Pages (Protected)
```
/admin                      Dashboard (stats overview)
/admin/questions            All questions + approve/reject/feature
/admin/answers              Review/edit AI answers
/admin/categories           Manage categories
/admin/subscribers          Email list management
```

### API Routes
```
POST /api/ask               Submit new question
POST /api/generate-answer   Trigger AI answer for question_id
GET  /api/questions         Fetch approved questions (paginated)
GET  /api/search            Search questions
GET  /api/trending          Get trending questions
POST /api/metoo             Increment Me Too count
POST /api/share-image       Generate share image (server)
POST /api/admin/approve     Approve question
POST /api/admin/reject      Reject question
POST /api/admin/feature     Feature a question
DELETE /api/admin/delete    Delete spam question
```

---

## 6. CORE FEATURES

### Feature 1: Anonymous Question Submission
- Title field (required, max 150 chars)
- Description field (optional, max 500 chars)
- Category selector (dropdown/chips)
- No login required
- Rate limiting: max 3 questions per IP per hour
- Spam filter: basic keyword blacklist
- On submit: saves to DB with status='pending', triggers AI generation

### Feature 2: AI Answer System
Each answer contains:
- **Summary** — 2-3 sentence direct answer
- **Detailed Explanation** — 3-4 paragraphs
- **Bullet Tips** — 5-7 practical, actionable tips
- **FAQs** — 3-5 related Q&As (triggers FAQPage schema)
- **Disclaimer** — Auto-added for health/medical/legal topics
- **Affiliate Links** — Auto-injected based on category

### Feature 3: Me Too Button
- "💜 I have this question too"
- Counter: "1,247 girls asked this"
- One tap per session (localStorage)
- Heart pulse animation on tap
- Questions with 100+ Me Too → auto-featured
- Drives emotional connection + return visits

### Feature 3b: Copy Answer (NEW)
- Single button: copies summary + bullet tips to clipboard
- Toast: "Copied! ✓" for 2 seconds
- Users paste directly into WhatsApp/Notes/Messages
- No image needed → works on any phone
- High usage — underrated sharing method

### Feature 3c: WhatsApp Share — Phase 1 ONLY
- Opens WhatsApp with pre-filled text (no image required)
- Format: Question + Top 3 tips + purplegirl.in link
- One tap → instant share → viral loop
- Instagram image share: Phase 2 (after stable launch)
- REASON: WhatsApp text share works on 2G, any device, any user

### Feature 4: Search
- Real-time search via Supabase full-text search
- Searches: title + description + category
- Shows recent searches (localStorage)
- Shows trending searches

### Feature 5: Trending Section
Score formula:
```
trending_score = (views_today × 1) + 
                 (metoo_count × 2) + 
                 (share_count × 3) +
                 (views_week × 0.5)
```
Updated every 6 hours via GitHub Actions cron.

### Feature 6: Related Questions
- Same category as current question
- Shown at bottom of every question page
- 4-6 related questions displayed as cards
- Drives internal linking = better SEO

### Feature 7: Newsletter Subscription
- Popup after 45 seconds or on exit intent
- "Get top questions answered weekly — Free"
- Email stored in Supabase subscribers table
- Weekly digest sent via Resend.com

---

## 7. SHARE FEATURE — INSTAGRAM & WHATSAPP

### User Flow
```
Question Page
    → "Share This Answer" button (sticky bottom on mobile)
        → ShareModal opens
            → User picks platform: [Instagram Post] [Instagram Story] [WhatsApp]
                → User picks template (preview shown)
                    → [Generate & Download] button
                        → Image downloads / WhatsApp opens
```

### Instagram Post (1080×1080px)
Templates:
1. **Gradient** — Purple/pink gradient, white text, logo watermark
2. **Minimal** — White bg, purple accents, clean typography
3. **Dark** — Deep purple bg, neon pink highlights
4. **Quote** — Large decorative quote marks, single tip highlighted

Content shown:
- PurpleGirl logo (top left)
- Category icon + name (top right)
- Question title (large, center)
- Top 3 bullet tips
- "Read full answer →" CTA
- purplegirl.in watermark (bottom)

### Instagram Story (1080×1920px)
- Same templates but vertical format
- Question in large text
- 2 tips maximum (space constraint)
- "Swipe up" style CTA (even without the feature)
- QR code optional (future)

### WhatsApp Share
Two options:
1. **Image** — Same 1080×1080 card downloaded, user shares manually
2. **Text Share** — Opens WhatsApp with pre-filled text:

```
💜 *PurpleGirl Answers*

*Q: {question_title}*

✅ {tip_1}
✅ {tip_2}  
✅ {tip_3}

📖 Full answer + {faqs_count} FAQs:
purplegirl.in/q/{slug}

_Ask anything anonymously at purplegirl.in_ 💜
```

### Tech Implementation
```javascript
// Client-side: html2canvas
import html2canvas from 'html2canvas'

// Server-side OG images: Satori + Sharp
import satori from 'satori'
import sharp from 'sharp'

// WhatsApp text: Native Web Share API
const share = async () => {
  if (navigator.share) {
    await navigator.share({ text: whatsappText })
  } else {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`)
  }
}
```

### Watermark Strategy
- Free users: "purplegirl.in" watermark always visible
- Purple Girl Pro: Option to remove watermark
- Branded templates: Sponsor logo replaces/joins watermark

### Monetization from Share Feature
```
Free tier:       2 templates + watermark
Pro tier:        8 templates + no watermark (₹149/month)
Brand deals:     Sponsored template ("Powered by Mamaearth")
Viral growth:    Every share = free purplegirl.in advertisement
```

---

## 8. AI ANSWER PIPELINE

### Primary: OpenRouter (Free)
```javascript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'meta-llama/llama-3.3-70b-instruct:free',
    messages: [{ role: 'user', content: buildPrompt(question) }]
  })
})
```

### Fallback: Groq API
```javascript
// If OpenRouter fails or rate limits
model: 'llama3-70b-8192'
```

### Master AI Prompt Template (IMPROVED — SEO + ENGAGEMENT OPTIMIZED)
```
You are PurpleGirl — a supportive, non-judgmental elder sister
answering questions for Indian women.

Answer the question in a way that:
- Feels personal and relatable
- Gives practical, real-life advice
- Is easy to read for Indian users
- Sounds like a real person, not a robot

QUESTION: "{title}"
DESCRIPTION: "{description}"
CATEGORY: "{category}"

Generate a JSON response with this EXACT structure:
{
  "summary": "2-3 lines. Direct answer. Simple words. Like texting a friend.",
  "detailed": "3-4 short paragraphs. Simple language. Use examples where possible. Short sentences only.",
  "bullet_points": [
    "Tip 1 — practical, specific, doable today",
    "Tip 2 — ...",
    "Tip 3 — ...",
    "Tip 4 — ...",
    "Tip 5 — ..."
  ],
  "faqs": [
    {"q": "Natural follow-up question she'd ask next", "a": "Short, direct answer"},
    {"q": "Common related concern", "a": "Short, direct answer"},
    {"q": "Third related question", "a": "Short, direct answer"}
  ],
  "disclaimer": "ONLY for health/medical/legal. Otherwise return null.",
  "affiliate_hint": "product type to recommend e.g. vitamin_c_serum, career_course"
}

TONE RULES (CRITICAL):
- Write like talking to a close friend, not writing an essay
- Keep sentences short — max 15 words per sentence
- No complicated English words
- No robotic phrases like "It is important to note that..."
- No medical/legal claims or diagnoses
- Be warm, direct, and human
- Use "you" directly — personal tone
- Add examples from real Indian life where relevant

ENGAGEMENT RULES (for SEO):
- Summary must make her want to read more
- Tips must be specific — not vague ("drink water" → "Drink 2 glasses of water first thing in morning")
- FAQs must be questions she'd actually Google next
```

### Batch Generation (GitHub Actions)
```javascript
// scripts/generate-answers.ts
// Runs daily — processes all 'pending' questions
const pending = await supabase
  .from('questions')
  .select('*')
  .eq('status', 'pending')
  .limit(50)

for (const question of pending.data) {
  const answer = await generateAnswer(question)
  await saveAnswer(answer)
  await updateStatus(question.id, 'approved')
  await updateTrending(question.id)
}
```

---

## 9. CONTENT STRATEGY

### Seed Questions — Beauty & Skincare (50 starters)
```
- How to remove dark spots on face naturally at home
- Best skincare routine for beginners with low budget India
- Why do I get pimples before my period
- How to get glass skin naturally Indian home remedies
- Is coconut oil good or bad for face daily use
- How to reduce dark circles permanently home remedies
- Why is my skin so oily in summer India
- How to tighten large pores on nose fast
- Best face wash for dry skin in winter India
- How to remove tan from face and neck quickly
- What causes pigmentation on cheeks suddenly
- How to use vitamin C serum correctly
- Can I use besan on face daily
- How to remove blackheads from nose permanently
- Best moisturizer for combination skin India under 200 rupees
```

### Seed Questions — Relationships (50 starters)
```
- How to know if he likes me or just being friendly
- What to do when boyfriend ignores you after fight
- How to tell parents about boyfriend in India
- Is it normal to feel lonely in a relationship
- How to set healthy boundaries with controlling mother in law
- How to move on after breakup fast and stop thinking
- Signs your friendship is becoming toxic
- How to stop overthinking in relationships
- What to do when husband does not listen or care
- How to handle rejection gracefully without feeling bad
- Why does he go hot and cold with me
- How to build trust again after being cheated on
- Is long distance relationship worth it India
- How to say no to people without feeling guilty
- Signs you are in a one-sided friendship
```

### Seed Questions — Career & Money (50 starters)
```
- How to ask for salary hike as a woman in India
- How to answer expected salary question in interview
- How to deal with male colleagues who dont respect you
- Best part time jobs for women working from home India 2025
- How to start freelancing from home in India as a beginner
- How to negotiate salary for first job freshers
- What to do when boss takes credit for your work
- How to build confidence speaking in office meetings
- How to write resignation letter professionally India
- Best investment options for women with small salary India
- How to handle workplace politics without getting affected
- How to balance work and personal life as working woman
- How to ask for work from home from manager
- Career options after 30 for women in India
- How to switch careers without losing salary
```

### Seed Questions — Health Basics (50 starters)
```
- Why do I feel tired all the time as a woman
- PCOS symptoms and home remedies India
- How to regulate irregular periods naturally home remedies
- Is white discharge normal before periods
- Why do I get headaches before period every month
- Signs of iron deficiency anemia in women India
- How to improve hair fall problem from roots
- Thyroid symptoms in women early signs India
- How to lose belly fat after delivery at home
- Why do I feel bloated every day after eating
- How much water should a woman drink daily
- Home remedies for UTI urinary tract infection women
- How to sleep better when you have anxiety at night
- Signs of PCOD vs PCOS difference what to do
- Best foods to eat during periods to reduce pain
```

### Seed Questions — Fashion (50 starters)
```
- How to dress for apple body shape Indian women
- Best affordable saree brands to buy online India
- How to look stylish on tight budget India 2025
- What colors suit wheatish skin tone Indian women
- How to mix and match Indian western fusion outfits
- Best kurti brands under 500 rupees online India
- How to dress professionally for office India women
- Capsule wardrobe basics every Indian woman should own
- How to style a plain saree to look modern
- What to wear for first date casual India
```

### Content Multiplication Per Question
```
1 question = 4 indexed pages:
├── /q/[slug]              Main English page
├── /q/[slug]/hindi        Hindi translated version  
├── /q/[slug]/tips         Expanded tips article
└── /q/[slug]/products     Product recommendations

250 questions × 4 pages = 1,000 indexed URLs
→ AdSense application ready
```

### Volume Milestones
```
Week 1:    50 questions seeded manually (high quality)
Week 2:    150 questions total (GitHub Actions starts)
Month 1:   300 questions
Month 2:   600 questions
Month 3:   1,000 questions → Apply AdSense
Month 6:   5,000 questions → Apply Ezoic/Mediavine  
Month 12:  20,000 questions → Authority site status
```

---

## 10. SEO STRATEGY

### On-Page SEO Formula
```
Title Tag:    {Question} | PurpleGirl — Answers for Women
Meta Desc:    Get honest, helpful answers to "{question}". 
              Advice on beauty, relationships, career for Indian women.
H1:           Same as question title (exact match)
H2s:          Quick Answer / Detailed Guide / Tips / Common Questions
URL:          /q/how-to-remove-dark-spots-naturally-home
Canonical:    Always set canonical URL
OG Image:     Auto-generated per question (Satori)
```

### Schema Markup (Every Question Page)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{question_title}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{summary + detailed}"
      }
    },
    // ... all FAQs from answer.faqs
  ]
}
```

### Target Keywords Strategy
```
Type 1 — Question keywords (easiest to rank):
"how to reduce dark circles naturally"
"what to do when boyfriend ignores you"
"how to ask for salary hike"

Type 2 — Informational keywords:
"dark circles home remedies"
"boyfriend ignoring me"
"salary negotiation tips women"

Type 3 — Long-tail (zero competition):
"why do i get dark circles even after sleeping enough"
"how to tell parents about boyfriend without them getting angry"
"how to ask for salary hike in indian company as fresher"
```

### Internal Linking Rules
```
Every question page must have:
- 3-5 related question links (same category)
- 1-2 category page links
- 1 homepage link (in breadcrumb)
```

### Sitemap Strategy
```
/sitemap.xml               Auto-generated, submitted to GSC
/sitemap-questions.xml     All question pages
/sitemap-categories.xml    All category pages
/sitemap-static.xml        Static pages

Update frequency: Daily (GitHub Actions regenerates)
```

### Google Search Console Setup
```
1. Verify purplegirl.in
2. International Targeting → Set to "Unlocked" (not India-specific)
3. Submit all sitemaps
4. Monitor Core Web Vitals weekly
5. Request indexing for each new batch of pages
```

---

## 11. MONETIZATION STACK

### Tier 1 — Passive Revenue (Live from Day 1)

**Google AdSense**
```
Placement: 
- Below question title (300×250)
- Between summary and detailed answer (728×90 or responsive)
- Bottom of page above related questions (300×250)
- Sidebar on desktop (160×600)

Apply after: 100+ approved pages with unique content
Timeline: ~4-6 weeks for approval with Indian women niche
```

**Affiliate Links (Auto-inserted by AI)**
```
Beauty category    → Nykaa, Mamaearth, Amazon India
Health category    → 1mg, HealthKart, Apollo Pharmacy  
Career category    → Coursera, Internshala, Unstop
Fashion category   → AJIO, Myntra, Meesho
Global affiliates  → iHerb (5-10%), Sephora (8%), Skillshare ($10/signup)

Implementation: AI prompt includes "affiliate_hint" field
lib/affiliates.ts maps hint → actual affiliate link
```

### Tier 2 — Active Revenue (Month 3+)

**Purple Girl Pro Subscription**
```
Price:    ₹149/month or ₹999/year
Benefits:
  - Ad-free experience
  - Private questions (not published publicly)
  - All 8 share templates
  - Remove watermark from shares
  - Priority AI answers (faster processing)
  - Bookmark questions
  - Download answers as PDF

Payment: Razorpay
```

**Brand Sponsorships**
```
Sponsored category: "Beauty tips powered by Mamaearth" — ₹20K-50K/month
Sponsored answers:  Brand review answers — ₹5K-20K each
Newsletter ads:     Weekly digest sponsorship — ₹5K-15K/issue
Branded templates:  Share templates with brand logo — ₹10K-30K/month
```

### Tier 3 — Scale Revenue (Month 6+)

**Digital Products (Gumroad)**
```
"Skincare Bible for Indian Women" PDF → ₹199 / $5
"Salary Negotiation Scripts" PDF → ₹299 / $9
"Relationship Boundaries Workbook" → ₹399 / $12
"Complete Career Pivot Guide" → ₹499 / $15
Commission: 100% yours (Gumroad takes 10%)
```

**Expert Marketplace**
```
Verified experts list their profile on PurpleGirl
Experts: Dermatologists, Career coaches, Therapists, Nutritionists
Revenue model:
  - Expert listing: ₹499-999/month
  - "Answered by Expert" badge on their answers
  - Expert gets profile page + SEO benefit
```

**Job Board (Career category)**
```
Companies post jobs targeting women candidates
Price: ₹999-2,999 per listing
Duration: 30 days
Featured: ₹4,999 (top of category)
```

### Revenue Projections
```
Month 3:    ₹5K-15K   (AdSense only, ~5K visits/month)
Month 6:    ₹25K-60K  (AdSense + affiliates, ~25K visits/month)
Month 9:    ₹60K-1.5L (+ subscriptions + brand deals)
Month 12:   ₹1.5L-5L  (full stack monetization, ~1L visits/month)
Year 2:     ₹5L-20L/month (global traffic, Mediavine, subscriptions)
```

---

## 12. ADMIN PANEL

### Dashboard Stats
```
- Total questions (pending / approved / featured)
- Total page views today / this week / this month
- Top 10 trending questions
- Recent submissions
- AdSense revenue snapshot (via API)
- Share events count (Instagram vs WhatsApp)
```

### Question Management
```
Actions per question:
  [Approve]   → status = 'approved', triggers AI generation if no answer
  [Feature]   → status = 'featured', shows in trending/homepage
  [Edit]      → Edit title, description, category
  [Reject]    → status = 'rejected'
  [Delete]    → Hard delete (spam only)

Filters: All | Pending | Approved | Featured | Rejected
Search: By title keyword
Sort: Latest | Most views | Most Me Too
```

### Answer Management
```
View AI-generated answer for any question
Edit: summary, detailed, bullet_points, faqs, disclaimer
Mark as: is_edited = true (shows "Reviewed by team" badge)
Regenerate: Trigger new AI answer
```

---

## 13. GITHUB ACTIONS AUTOMATION

### Workflow 1: Daily Content Generation
```yaml
# .github/workflows/generate-content.yml
name: Daily Content Generation
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM IST daily
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npx ts-node scripts/generate-questions.ts
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
          OPENROUTER_API_KEY: ${{ secrets.OPENROUTER_API_KEY }}
      - run: npx ts-node scripts/generate-answers.ts
      - run: npx ts-node scripts/update-trending.ts
```

### Workflow 2: Deploy on Push
```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install && npm run build
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          projectName: purplegirl
          directory: .next
```

### Workflow 3: Weekly Hindi Translation
```yaml
# Runs every Sunday
# Takes top 50 questions by views
# Generates Hindi translations
# Saves to translations table
```

---

## 14. UI/UX DESIGN SYSTEM

### Color Palette (REFINED — Final Version)
```css
--purple-primary:   #7C3AED;   /* Main brand purple */
--purple-light:     #A855F7;   /* Hover states */
--purple-pale:      #FAF5FF;   /* Page background — lighter, cleaner */
--pink-accent:      #EC4899;   /* CTA buttons, highlights */
--pink-light:       #FDF2F8;   /* Card backgrounds */
--highlight-box:    #F3E8FF;   /* Quick Answer highlight box bg */
--gradient-hero:    linear-gradient(135deg, #7C3AED 0%, #EC4899 100%);
--gradient-card:    linear-gradient(135deg, #FAF5FF 0%, #FDF2F8 100%);
--text-primary:     #1F1235;   /* Dark purple-tinted black */
--text-secondary:   #6B7280;   /* Muted text */
--text-white:       #FFFFFF;

IMPORTANT:
- Background is #FAF5FF (NOT white, NOT dark — soft lavender white)
- Keep it soft and light — never dark mode on main site
- Gradient used ONLY on: hero section, CTA buttons, featured cards
- Everything else: flat soft colors
```

### Typography (REFINED)
```
Headings:   Bold + slightly elegant (font-bold, tracking-tight)
            Use Playfair Display ONLY for hero H1
            All other headings: Inter Bold (more readable)
Body:       Inter Regular — super readable, no fancy fonts
UI labels:  Inter Medium
Rule:       Short sentences. Never long paragraphs in UI.
```

### Component Style (REFINED)
```
Cards:       rounded-2xl, soft shadow (shadow-sm default, shadow-md on hover)
             Slight hover lift: hover:-translate-y-1 transition-all
Buttons:     rounded-full for primary CTAs
             rounded-xl for secondary actions
Inputs:      rounded-2xl, big padding (py-4 px-6)
             Purple focus ring (ring-2 ring-purple-400)
             Large font size on mobile (text-base min — no zoom trigger)
Ask Box:     Full width, centered, big and inviting
             Shadow: shadow-lg on focus
             Placeholder text: muted purple color
Highlight:   Quick Answer box = bg-purple-100 rounded-2xl p-4
             Left border: border-l-4 border-purple-500
             This creates "featured answer" feel instantly
Gradient:    Hero section + CTA buttons ONLY
Icons:       Lucide React exclusively
```

### Category Colors
```
Beauty & Skincare:   Pink (#E91E8C)
Relationships:       Purple (#9C27B0)
Career & Money:      Deep Purple (#673AB7)
Health Basics:       Green (#4CAF50)
Fashion:             Pink-Red (#FF4081)
Mental Wellness:     Violet (#7C4DFF)
Food & Nutrition:    Orange (#FF9800)
```

---

## 14A. HOMEPAGE LAYOUT SPEC (HIGH-IMPACT VERSION)

### Section Order (FINAL — No Clutter)
```
1. Hero Section        ← MOST IMPORTANT — big ask box
2. Trending Questions  ← Social proof — people are asking
3. Categories          ← Navigation + discovery
4. Recent Questions    ← Fresh content signal
5. Newsletter CTA      ← Email capture before footer
6. Footer
```

### Section 1: Hero (CRITICAL)
```
Layout:   Full-width, gradient background (purple → pink)
Padding:  py-20 on desktop, py-12 on mobile

H1:       "Ask anything you can't ask anyone 💜"
          Font: Inter Bold, text-4xl mobile / text-6xl desktop
          Color: white
          
Subtext:  "1000+ real questions answered for girls like you"
          Font: Inter Regular, text-lg
          Color: white/80 opacity

Ask Box:
  - Full width (max-w-2xl centered)
  - Big rounded: rounded-2xl
  - Padding: py-4 px-6
  - Placeholder: "Type your question… (it's anonymous)"
  - Placeholder color: purple-300
  - Below box: small text "100% anonymous · No login needed"
  - Submit button: rounded-full, gradient bg, "Get Answer →"
  
Trust row below box:
  🔒 Anonymous  ·  💜 No Judgment  ·  ⚡ Instant Answer
```

### Section 2: Trending Questions
```
Heading:  "🔥 Girls are asking…"
Layout:   Horizontal scroll on mobile, 3-col grid on desktop
Cards:    rounded-2xl, white bg, soft shadow
          Show: question title + category badge + Me Too count
          Tap: goes to /q/[slug]
Count:    Show top 6 trending questions
```

### Section 3: Categories
```
Heading:  "Browse by topic"
Layout:   2×4 grid on mobile, 7 icons in a row on desktop
Each:     Icon (emoji) + Category name + question count
Style:    rounded-2xl card, category color tint bg
Tap:      Goes to /category/[slug]
```

### Section 4: Recent Questions
```
Heading:  "Recently answered"
Layout:   Single column list on mobile, 2-col on desktop
Cards:    Question title + short summary preview + time ago
Show:     Latest 8 approved questions
```

### HOMEPAGE RULES
```
❌ NO: Fancy animations on load
❌ NO: Multiple CTAs competing
❌ NO: Long text blocks
❌ NO: Dark sections (keep everything light)
✅ YES: One clear CTA — the ask box
✅ YES: Fast loading (SSG everything)
✅ YES: Mobile-first layout
✅ YES: Questions feel real and relatable
```

---

## 14B. QUESTION PAGE SPEC (MONEY PAGE)

This is where SEO ranking + AdSense revenue + viral sharing happens.
Every design decision here impacts revenue directly.

### Page Structure (TOP TO BOTTOM)
```
[Breadcrumb]          Home > Category > Question title
[Ad Slot — Top]       728×90 or responsive (ABOVE content)

[H1 — Question Title] Big, bold, purple-tinted black

[Meta row]            Category badge · Time ago · View count · Me Too count

─────────────────────────────────────────
[QUICK ANSWER BOX]    ← HIGH IMPACT UI ELEMENT
  Background: #F3E8FF (soft purple)
  Border-left: 4px solid #7C3AED
  Rounded: rounded-2xl
  Content: 2-3 line direct answer (summary)
  Label: "💜 Quick Answer" (small, purple, above box)
─────────────────────────────────────────

[Ad Slot — Mid]       Responsive ad (after quick answer)

[Detailed Answer]     H2: "Full Explanation"
                      3-4 readable paragraphs
                      Short sentences, simple language

[Bullet Tips]         H2: "Practical Tips"  
                      5-7 tips as styled list
                      Each tip: checkmark icon + text
                      Background: very light purple bg per tip

[FAQs]                H2: "Common Questions"
                      Accordion style (open/close)
                      3-5 FAQs from AI answer
                      → Triggers FAQPage schema → Google rich results

[Disclaimer]          Small muted text box (health/legal topics only)
                      "This is general advice, not medical/legal guidance"

[Ad Slot — Bottom]    Before related questions

[SHARE SECTION]       "Found this helpful? Share it 💜"
                      [WhatsApp] [Copy Answer] [Instagram]

[Me Too Button]       "847 girls have this question too — [Me Too 💜]"

[Related Questions]   H2: "Girls also asked…"
                      4-6 question cards, same category
                      → Critical for internal linking + session depth
```

### Quick Answer Box CSS
```css
.quick-answer-box {
  background: #F3E8FF;
  border-left: 4px solid #7C3AED;
  border-radius: 16px;
  padding: 20px 24px;
  margin: 24px 0;
}
/* Tailwind: bg-purple-100 border-l-4 border-purple-600 rounded-2xl p-6 */
```

### Sticky Bottom Bar (MOBILE ONLY)
```
Fixed at bottom of screen on mobile:
┌─────────────────────────────────────┐
│  🏠 Home   💜 Ask   📤 Share        │
└─────────────────────────────────────┘
Height: 64px
Background: white with top border
Tap areas: minimum 48px height (no small buttons)
Font: small label below each icon
```

### UX Micro-Features (MUST HAVE)
```
1. Me Too Button
   - "💜 I have this question too"
   - Counter: "1,247 girls asked this"
   - One tap per session (localStorage)
   - Animation: heart pulse on tap
   - Impact: emotional hook → return visits

2. Copy Answer Button
   - Copies summary + bullet tips to clipboard
   - "Copied! ✓" feedback for 2 seconds
   - Users paste into Notes/WhatsApp easily
   - Impact: sharing without needing image generation

3. WhatsApp Share (PRIMARY — India growth hack)
   - Opens WhatsApp with pre-filled text
   - Includes question + top 3 tips + link
   - One tap → instant share
   - Impact: viral loop, free traffic

4. Instagram Share (SECONDARY)
   - Downloads beautiful card as PNG
   - PurpleGirl watermark visible
   - Impact: brand awareness, new users

5. Reading Progress Bar
   - Thin purple line at top of page
   - Shows scroll progress
   - Keeps users reading → lower bounce → better SEO
```

### Ad Placement Strategy (Question Page)
```
Slot 1: ABOVE content (before H1) — highest CPM
Slot 2: AFTER quick answer box — high visibility
Slot 3: AFTER bullet tips — mid-page
Slot 4: BEFORE related questions — exit intent

Mobile: Use in-feed ads between sections
Desktop: Sidebar ad (sticky 300×600) + content ads
```

---

## 14C. MOBILE UX SPEC (CRITICAL — 80% INDIA TRAFFIC IS MOBILE)

### Non-Negotiable Mobile Rules
```
✅ Minimum tap target: 48×48px (no tiny buttons ever)
✅ Font size minimum: 16px body (prevents iOS zoom on input)
✅ Ask box: full width, large padding
✅ Sticky bottom nav: Home / Ask / Share
✅ Cards: full width on mobile
✅ No horizontal scroll except Trending section (intentional)
✅ Images: lazy loaded, WebP format
✅ No popups on mobile (except newsletter — delayed 45s)
```

### Sticky Bottom Navigation (Mobile)
```jsx
// components/layout/MobileBottomNav.tsx
// Fixed bottom bar, z-50
// Three items: Home | Ask | Share
// Active state: purple icon + label
// Inactive: gray icon + label
// Height: h-16 (64px)
// Safe area padding for iPhone notch: pb-safe
```

### Mobile Performance Targets
```
First Contentful Paint:  < 1.5s
Time to Interactive:     < 3.0s
Lighthouse Mobile:       > 85
CLS:                     < 0.1
LCP:                     < 2.5s

How to achieve:
- SSG all question pages (no server wait)
- Cloudflare CDN (edge delivery)
- Images: next/image with WebP + lazy load
- Fonts: next/font (no FOUT)
- No heavy animations on mobile
```

---

## 15. LAUNCH CHECKLIST

### Pre-Development
```
□ Google Search Console — verify purplegirl.in
□ Google Analytics 4 — setup property, get measurement ID
□ Supabase — create project, get URL + anon key + service key
□ OpenRouter — create account, get API key
□ Cloudflare — connect purplegirl.in, get account ID
□ GitHub — create repo "purplegirl-in", add secrets
□ Resend.com — create account, verify purplegirl.in email
□ Google AdSense — create account (don't apply yet)
□ Pinterest Business — create @purplegirl account
□ Instagram — grab @purplegirlhq or @purplegirl.in handle
□ Razorpay — create account (for future Pro subscription)
```

### Development Milestones
```
□ Week 1: Next.js setup + Supabase integration + Homepage
□ Week 1: Ask form + Question detail page (SSG)
□ Week 2: AI answer pipeline (OpenRouter)
□ Week 2: Category pages + Search page
□ Week 3: Share feature (WhatsApp + Instagram)
□ Week 3: Admin panel (approve/reject/feature)
□ Week 4: SEO (schema markup, sitemap, meta tags)
□ Week 4: GitHub Actions (content generation cron)
□ Week 4: Seed 100 questions + deploy to Cloudflare
```

### Pre-Launch SEO
```
□ Submit sitemap to Google Search Console
□ Set international targeting to "Unlocked"
□ Verify all pages have unique title + meta description
□ Verify FAQPage schema on all question pages
□ Test mobile responsiveness (all pages)
□ Test page speed: Lighthouse score > 90
□ Add privacy policy + disclaimer pages (AdSense requirement)
□ Add about page (AdSense trust requirement)
```

### AdSense Application (Month 3)
```
□ 100+ approved unique question pages
□ Each page has 500+ words of content
□ Privacy policy page live
□ About page live  
□ Contact page live
□ Disclaimer page live
□ No copyrighted content
□ Original AI-generated content
□ Site live for 3+ months (purplegirl.in domain age counts)
□ Google Analytics showing real organic traffic
```

---

## 16. GROWTH ROADMAP

### Phase 1 — Foundation (Month 1-2)
```
Goal: Build + launch + seed content
KPI: 100 indexed pages, 500 organic visits/month
Actions:
  - Complete development
  - Seed 200 questions with AI answers
  - Setup Pinterest account + start posting
  - Submit to Google + Bing Search Console
  - Basic affiliate links in answers
```

### Phase 2 — Indexing (Month 3-4)
```
Goal: AdSense approval + steady traffic
KPI: 1,000 pages indexed, 5,000 visits/month
Actions:
  - Apply Google AdSense
  - Launch newsletter signup
  - Start Instagram Reels strategy
  - Add Me Too button + trending algorithm
  - Hindi translation for top 100 questions
```

### Phase 3 — Monetization (Month 5-6)
```
Goal: Multiple revenue streams active
KPI: ₹50K+/month revenue
Actions:
  - AdSense active
  - Affiliate links optimized
  - Purple Girl Pro subscription launch
  - First brand sponsorship outreach
  - Email list: 1,000+ subscribers
```

### Phase 4 — Scale (Month 7-12)
```
Goal: Authority site + maximum revenue
KPI: 1L visits/month, ₹2L+/month revenue
Actions:
  - 5,000+ questions published
  - All Indian languages covered
  - Expert marketplace launch
  - Upgrade to Ezoic/Mediavine
  - Digital products on Gumroad
```

### Phase 5 — Global (Year 2)
```
Goal: Western traffic + dollar revenue
KPI: 30% Western traffic, $2,000+/month
Actions:
  - Target US/UK/Australia SEO keywords
  - Western affiliate programs (Sephora, Ulta, Skillshare)
  - Mediavine ($20-40 RPM vs AdSense $8-12)
  - Consider purplegirl.co or askpurplegirl.com for .com presence
```

---

## 17. GLOBAL EXPANSION PLAN

### Why .in Can Still Go Global
```
1. Google Search Console → International Targeting → "Unlocked"
2. Subdomains: us.purplegirl.in, uk.purplegirl.in
3. hreflang tags for language/region targeting
4. Cloudflare CDN = same speed globally
5. English content = naturally global
```

### Western Content Tone Differences
```
Indian Question → Western Equivalent
"Dark spots"   → "Hyperpigmentation"
"Salary hike"  → "Pay raise negotiation"
"In-laws"      → "Setting family boundaries"
"PCOS remedies"→ "Managing PCOS naturally"
"Fairness tips"→ "Evening skin tone tips"
```

### Southeast Asia Expansion (Month 8-12)
```
Indonesia → 260M people, massive beauty market
Philippines → English speakers, similar culture
Bangladesh → Hindi-adjacent language
Vietnam → Beauty-conscious audience
```

### Alternative Domain Strategy (If Needed)
```
askpurplegirl.com  → Best alternative, likely available ₹800
purplegirl.co      → Clean global TLD
purplegirl.app     → Tech-forward
thepurplegirl.com  → Brand authority feel
```

---

## 18. REVENUE PROJECTIONS

### Conservative Estimate
```
Month 3:   ₹5,000   - ₹15,000
Month 6:   ₹25,000  - ₹60,000
Month 9:   ₹75,000  - ₹1,50,000
Month 12:  ₹2,00,000 - ₹5,00,000
Year 2:    ₹5,00,000 - ₹20,00,000/month
```

### Revenue Breakdown at Month 12
```
AdSense/Ezoic:     ₹60,000   (1L visits × ₹60 RPM)
Affiliate:         ₹40,000   (beauty + career products)
Subscriptions:     ₹30,000   (~200 Pro users × ₹149)
Sponsorships:      ₹50,000   (1-2 brand deals/month)
Digital Products:  ₹20,000   (Gumroad PDF sales)
─────────────────────────────
TOTAL:             ₹2,00,000/month
```

---

## 19. IMPLEMENTATION STATUS TRACKER

> Track what's built, what's partial, and what's next.
> ✅ = Done | 🔧 = Partial/In Progress | ⬜ = Not Started

### Core Foundation
```
✅ Next.js App Router + Tailwind CSS + Supabase integration
✅ Homepage with Hero + Categories + Trending + Recent + Newsletter
✅ Ask question form (/ask)
✅ Question detail page (/q/[slug]) — server component
✅ Category page (/category/[slug]) — ⚠️ client-rendered (needs SSG fix)
✅ Search page (/search) with LiveSearch
✅ Admin panel with Basic Auth (/admin)
✅ AI answer pipeline (OpenRouter + chat_log format)
✅ Follow-up chat on question pages
✅ Sitemap generation (dynamic)
✅ Privacy, Terms, About, Contact pages
✅ Mobile bottom nav
✅ AdSense script integration
🔧 MeToo button — works but no localStorage persistence
🔧 Share feature — basic WhatsApp + Instagram (no modal/templates)
⬜ Category pages SSG (currently client-rendered = SEO blocker)
⬜ generateStaticParams on /q/[slug] pages
⬜ FAQPage + Article schema markup (JSON-LD)
⬜ Full ShareModal with platform/template picker
⬜ trending_logs table + trending score cron
⬜ Content seeding at scale (only 13 questions exist)
```

---

## 19A. PURPLEGIRL 2.0 — AI-NATIVE VISION

> Core Shift: Stop being a Q&A site. Become the world's first
> emotionally intelligent AI companion platform for women.

### FEATURE 1: Emotion Intelligence Layer ⬜
```
Status: ⬜ NOT STARTED
Priority: HIGH — Differentiator
Depends on: AI answer pipeline (✅ exists)

What it does:
- AI detects emotion from question text BEFORE answering
- Response tone auto-calibrates to detected emotion
- UI color shifts to match emotional state (warm amber for worried, etc.)
- Opening line acknowledges the feeling FIRST

Emotion types: Scared | Embarrassed | Angry | Hopeful | Confused | Sad | Frustrated

UI: Emotion detection bar with progress indicator
    Background gradient shifts based on emotion
    Opening acknowledgment bubble before main answer

Implementation:
- New API route: /api/detect-emotion
- Emotion detection prompt runs before main answer generation
- Returns JSON: { primary_emotion, intensity (1-10), opening_acknowledgment, tone_instruction }
- Emotion → UI color mapping in emotionTheme config
- EmotionBar component shows detected emotion + calibration progress

Files needed:
  lib/emotion.ts           — Detection prompt + theme mapping
  components/question/EmotionBar.tsx  — UI component
  app/api/detect-emotion/route.ts     — API endpoint
```

### FEATURE 2: Voice Sister Mode ⬜
```
Status: ⬜ NOT STARTED
Priority: MEDIUM — Engagement booster
Depends on: Web Speech API (free), ElevenLabs (free tier 10K chars/month)

What it does:
- User speaks question via microphone (Web Speech API — free, built-in)
- AI responds in warm voice (ElevenLabs multilingual_v2 — supports Hindi)
- Full-screen voice mode with waveform visualization
- Audio player UI with speed controls (0.75x / 1x / 1.25x)

Implementation:
- Input: window.SpeechRecognition (lang: 'en-IN' for Indian English)
- Output: ElevenLabs /v1/text-to-speech API
- Waveform: Canvas-based audio visualization
- "Read instead" toggle to switch to text mode

Files needed:
  components/voice/VoiceSisterMode.tsx  — Full-screen voice UI
  components/voice/AudioPlayer.tsx      — Playback controls
  components/voice/Waveform.tsx         — Audio waveform visualization
  lib/voice.ts                          — Speech recognition + ElevenLabs API
  app/api/speak/route.ts                — TTS proxy endpoint

Env vars: ELEVENLABS_API_KEY
```

### FEATURE 3: Skin Photo Analysis (Vision AI) ⬜
```
Status: ⬜ NOT STARTED
Priority: HIGH — Unique differentiator, monetization driver
Depends on: Claude Vision API or Google Gemini Vision

What it does:
- Upload photo of skin concern (dark spots, acne, pigmentation)
- AI gives specific, personalized analysis
- Recommends home remedies ranked by effectiveness
- Suggests India-budget products (Nykaa/Amazon)
- Flags when to see a doctor
- Photo analyzed instantly, NEVER stored

Implementation:
- Camera/upload component with drag-drop
- Base64 encoding → API route → Claude Vision API
- Response: condition, confidence, causes, remedies, products
- Always uses "appears to be" / "looks like" (never diagnoses)
- Medical disclaimer auto-injected

Files needed:
  components/skin/SkinAnalyzer.tsx       — Upload + camera UI
  components/skin/AnalysisResult.tsx     — Results display
  app/api/analyze-skin/route.ts          — Vision AI endpoint
  app/skin-check/page.tsx                — Dedicated page

Env vars: ANTHROPIC_API_KEY (for Claude Vision)
```

### FEATURE 4: Whisper Mode ⬜
```
Status: ⬜ NOT STARTED
Priority: HIGH — Trust builder, handles sensitive topics
Depends on: Existing AI pipeline

What it does:
- For questions too sensitive even for normal feed
- Topics: domestic abuse, sexual health, eating disorders, crisis
- Answered and auto-deleted — ZERO database writes
- Dark UI theme, crisis hotline numbers always visible
- Answer shown once via API response, no storage

Crisis detection:
- Keyword matching for suicide/violence/abuse
- Crisis response bypasses AI — hardcoded empathy + helpline resources
- iCall: 9152987821, Vandrevala: 1860-2662-345, Women Helpline: 181

Files needed:
  app/whisper/page.tsx                   — Whisper mode page (dark UI)
  app/api/whisper/route.ts               — Zero-storage API
  components/whisper/WhisperChat.tsx      — Chat interface
  components/whisper/CrisisBanner.tsx     — Helpline resources
```

### FEATURE 5: Live Sisterhood Pulse ⬜
```
Status: ⬜ NOT STARTED
Priority: LOW — Engagement/virality (needs traffic volume first)
Depends on: Supabase Realtime subscriptions

What it does:
- Real-time visualization of questions being asked across India
- India SVG map with pulsing dots (each dot = question submitted)
- Color = category, animation = new question arriving
- Live trending: most asked right now, most Me Too'd today
- Massively shareable, media-citable

Implementation:
- Supabase Realtime channel: 'questions-live'
- Listen for INSERT events on questions table
- India SVG map with Framer Motion animated dots
- 24-hour rolling stats counters

Files needed:
  app/pulse/page.tsx                     — Full-screen pulse page
  components/pulse/SisterhoodPulse.tsx   — Map + stats component
  components/pulse/IndiaSVGMap.tsx        — Interactive India map
  components/pulse/LiveCounter.tsx       — Animated counters
```

### FEATURE 6: Smart Sister Memory (No Login) ⬜
```
Status: ⬜ NOT STARTED
Priority: MEDIUM — Retention booster
Depends on: localStorage only (zero backend)

What it does:
- "Sister" remembers everything across sessions via localStorage
- Personalized greeting on return visits
- Shows new answers since last visit
- Tracks top categories user is interested in
- Feels like ongoing relationship without any login

Memory structure:
  { visitCount, lastVisit, askedQuestions[], topCategories[], sessionId }

Files needed:
  lib/sisterMemory.ts                    — Memory CRUD helpers
  components/home/WelcomeBackCard.tsx     — Personalized greeting card
  hooks/useSisterMemory.ts               — React hook for memory
```

### FEATURE 7: AI Reel Script Generator ⬜
```
Status: ⬜ NOT STARTED
Priority: MEDIUM — Creator tool, virality driver
Depends on: AI pipeline

What it does:
- Take any Q&A answer → generate 30-45 sec Reel script
- Scene-by-scene directions with text overlays
- Trending audio suggestions
- Hashtag recommendations
- Women become creators without effort

Output JSON:
  { hook, scenes: [{ duration, what_to_show, text_overlay, voiceover, transition }],
    cta, trending_audio_suggestions, hashtags, viral_hook_reason }

Files needed:
  components/share/ReelScriptGenerator.tsx — UI component
  app/api/generate-reel/route.ts           — AI endpoint
  lib/reelScript.ts                        — Prompt builder
```

### FEATURE 8: Anonymous Sisterhood Circles ⬜
```
Status: ⬜ NOT STARTED
Priority: LOW — Needs critical mass of users
Depends on: Supabase Realtime (broadcast channels)

What it does:
- Real-time anonymous group chat rooms by topic
- 5-8 women per room, AI sister moderates
- No usernames — just "Sister 1", "Sister 2", etc.
- AI adds facts, prevents toxicity, responds when appropriate
- Auto-expires after 2 hours

Implementation:
- Supabase channel per circle: `circle-${circleId}`
- Broadcast events for messages
- AI decides whether to respond (not every message)
- Max capacity enforcement

Files needed:
  app/circles/page.tsx                   — Circle listing
  app/circles/[id]/page.tsx              — Active circle
  components/circles/CircleChat.tsx      — Chat interface
  components/circles/CircleList.tsx      — Available circles
  app/api/circles/route.ts              — Create/join circle
```

### FEATURE 9: Hyper-Personalized Answer Mode ⬜
```
Status: ⬜ NOT STARTED
Priority: HIGH — Answer quality differentiator
Depends on: AI pipeline

What it does:
- Before answering, AI asks 5 smart clarifying questions
- Like a doctor's intake form but friendly
- Final answer calibrated to YOUR specific situation
- Not generic advice — references your specific factors

Intake flow:
  1. Age group (chips: 18-22 / 23-28 / 29-35 / 35+)
  2. When issue started (Recently / 3-6 months / Over a year)
  3. Contributing factors (checkboxes)
  4. Relevant type (category-specific)
  5. Budget preference (Under ₹500 / ₹500-2000 / Any)

Files needed:
  components/question/PersonalizedIntake.tsx  — Intake form UI
  lib/personalizedPrompt.ts                   — Profile-aware prompt builder
```

### FEATURE 10: Women's Collective Intelligence Dashboard ⬜
```
Status: ⬜ NOT STARTED
Priority: LOW — PR asset, needs data volume
Depends on: 1000+ questions in database

What it does:
- Anonymized, aggregated insights page
- What Indian women are collectively asking about
- Top concerns this month with percentages
- Age breakdown of topics (if collected)
- Weekly spikes and trends
- Downloadable report (PDF)
- Brand partnership inquiry CTA

Files needed:
  app/insights/page.tsx                  — Dashboard page
  components/insights/TopConcerns.tsx    — Bar chart
  components/insights/TrendSpikes.tsx    — Spike alerts
  app/api/insights/route.ts             — Aggregation queries
```

### Advanced Tech Stack Addition
```
Current Stack              →    PurpleGirl 2.0 Stack
─────────────────────────────────────────────────────
OpenRouter (text)           →  + Claude Vision (photo analysis)
html2canvas (images)        →  + ElevenLabs (voice output)
Supabase DB                 →  + Supabase Realtime (circles/pulse)
Static pages                →  + Emotion-aware dynamic responses
Anonymous Q&A               →  + Whisper Mode (zero storage)
Share cards                 →  + Reel Script Generator
No memory                   →  + localStorage Sister Memory
Generic answers             →  + Personalized intake flow

New env vars needed:
  ELEVENLABS_API_KEY        — Voice Sister Mode
  ANTHROPIC_API_KEY         — Skin Photo Analysis (Claude Vision)
```

### Implementation Priority Order
```
Phase A — SEO Critical (NOW):
  1. Fix Category SSG (Gap 1)
  2. Add generateStaticParams to /q/[slug] (Gap 2)
  3. Add FAQPage schema markup (Gap 4)
  4. Fix MeToo localStorage persistence
  5. Full ShareModal with templates (Gap 5)

Phase B — Differentiators (Month 2-3):
  6. Emotion Intelligence Layer (Feature 1)
  7. Whisper Mode (Feature 4)
  8. Sister Memory (Feature 6)
  9. Personalized Intake (Feature 9)

Phase C — Engagement (Month 3-5):
  10. Voice Sister Mode (Feature 2)
  11. Skin Photo Analysis (Feature 3)
  12. Reel Script Generator (Feature 7)

Phase D — Community (Month 5+):
  13. Sisterhood Circles (Feature 8)
  14. Live Sisterhood Pulse (Feature 5)
  15. Collective Intelligence Dashboard (Feature 10)
```

---

## 20. ENVIRONMENT VARIABLES

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# OpenRouter (AI)
OPENROUTER_API_KEY=xxx

# Groq (AI Fallback)
GROQ_API_KEY=xxx

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google AdSense
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXX

# Resend (Email)
RESEND_API_KEY=xxx
RESEND_FROM_EMAIL=hello@purplegirl.in

# Razorpay (Payments)
NEXT_PUBLIC_RAZORPAY_KEY_ID=xxx
RAZORPAY_KEY_SECRET=xxx

# Admin
ADMIN_EMAIL=admin@purplegirl.in
ADMIN_PASSWORD_HASH=xxx

# Site
NEXT_PUBLIC_SITE_URL=https://purplegirl.in
NEXT_PUBLIC_SITE_NAME=PurpleGirl
```

---

## 📌 QUICK REFERENCE

### Key Commands
```bash
npm run dev              # Local development
npm run build            # Production build
npm run generate         # Run content generation scripts
npx ts-node scripts/seed-categories.ts   # Seed DB categories
```

### Important Links
```
Site:           https://purplegirl.in
Admin:          https://purplegirl.in/admin
Supabase:       https://app.supabase.com
Cloudflare:     https://dash.cloudflare.com
GitHub:         https://github.com/[your-username]/purplegirl-in
GSC:            https://search.google.com/search-console
Analytics:      https://analytics.google.com
AdSense:        https://adsense.google.com
OpenRouter:     https://openrouter.ai
```

### Support Stack (Same as SchemeAtlas)
```
Next.js 14 docs:    https://nextjs.org/docs
Supabase docs:      https://supabase.com/docs
Cloudflare Pages:   https://developers.cloudflare.com/pages
OpenRouter docs:    https://openrouter.ai/docs
Tailwind docs:      https://tailwindcss.com/docs
html2canvas:        https://html2canvas.hertzen.com
Satori:             https://github.com/vercel/satori
```

---

*Blueprint created: April 2026*  
*Domain: purplegirl.in*  
*Builder: Sathish (Solo Developer)*  
*Purpose: Reference document — never lose context again 💜*
