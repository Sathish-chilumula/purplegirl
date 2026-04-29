# 💜 PurpleGirl.in — Master Blueprint (V4 — Final Unified Vision)

> **Philosophy:** "Answer the question she typed when nobody was watching."
> **Core Strategy:** Negative Marketing (Pain-First) + "Silent Question" Funnel.

---

## 1. PROJECT VISION & CORE STRATEGY

### The "Silent Question" Funnel
Most women in India Google their most private problems at 2 AM in a private window. They don't ask friends; they Google the pain.
1. **Pain Moment:** She has a problem she cannot tell anyone.
2. **Silent Search:** She types her exact pain into Google (e.g., "signs emotionally abusive marriage India").
3. **The Answer:** PurpleGirl's article H1 matches her search exactly.
4. **The Connection (Mirror Moment):** The intro paragraph makes her feel SEEN ("This article was written for me"). Bounce rate drops.
5. **The Value:** She reads practical, judgment-free steps. Google AdSense ads load.
6. **The Conversion:** She sees the highly specific Anonymous Ask Box and submits her unique question.
7. **The Flywheel:** The AI answers instantly. Her Q&A is later reviewed and becomes a new long-tail keyword article.

### Title Formulas (Pain-First)
Every article title must follow these patterns (No clever wordplay, exact search phrases only):
- **Pattern 1:** "How to [deal with / handle / survive / cope with] [painful situation]"
- **Pattern 2:** "What to Do When [painful situation]"
- **Pattern 3:** "Signs/Is It Normal That [hidden fear or question]"
- **Pattern 4:** "Why [painful thing happens] and What to Do"
- **Pattern 5:** The Question Title ("Should I Leave My Husband?")

---

## 2. TECH STACK & ARCHITECTURE

| Component | Technology |
| :--- | :--- |
| **Framework** | Next.js 14 App Router (TypeScript) |
| **Database/Auth**| Supabase (PostgreSQL + Auth + RLS) |
| **Hosting** | Cloudflare Pages |
| **AI Content** | Groq API (Primary) + Gemini Flash 2.5 Lite (Fallback) |
| **Monetization**| Google AdSense |
| **Styling** | Tailwind CSS + CSS Variables (`globals.css`) |
| **Automation** | GitHub Actions (Daily/Weekly Cron Jobs) |

---

## 3. DESIGN SYSTEM (`globals.css` & `tailwind.config.ts`)

### Color Palette (CSS Variables)
- `--pg-rose`: `#E91E8C` (Primary Brand — Deep rose/pink)
- `--pg-rose-light`: `#FCE4F3` (Light tint backgrounds)
- `--pg-rose-dark`: `#B5146A` (Hover state)
- `--pg-plum`: `#6B21A8` (Accent purple)
- `--pg-plum-light`: `#F3E8FF`
- `--pg-cream`: `#FFF9FB` (Page background)
- `--pg-white`: `#FFFFFF`
- `--pg-gray-100` to `--pg-gray-900`: Standard gray scale
- `--pg-success`: `#059669` | `--pg-warning`: `#D97706`

### Typography
- **Headings:** "Playfair Display" (Elegant, trustworthy)
- **Body & UI:** "DM Sans" (Clean, readable)

### UI Rules
- White cards with `1px` border (`#E5E7EB`) and `12px` border-radius. No drop shadows.
- Primary Buttons: Solid Rose (`#E91E8C`), white text, hover to `#B5146A`.
- Max content width: `1200px` centered. Article content max width: `780px` (readability).

---

## 4. DATABASE SCHEMA (Supabase)

### Table: `categories`
- `id` (uuid pk), `slug` (text unique), `name` (text), `name_hi` (text), `description` (text)
- `icon_emoji` (text), `article_count` (int default 0), `display_order` (int)

### Table: `articles`
- `id` (uuid pk), `slug` (text unique), `title` (text - exact search phrase)
- `meta_description` (text), `category` (text), `subcategory` (text), `language` (text default 'en')
- `content_json` (jsonb - see structure below), `intro` (text), `expert_tip` (text)
- `related_article_slugs` (text[]), `tags` (text[])
- `reading_time_mins` (int), `view_count` (int default 0), `is_published` (boolean default false)
- `generated_at` (timestamptz), `published_at` (timestamptz), `created_at` (timestamptz)

### Table: `questions` (Anonymous Q&A)
- `id` (uuid pk), `question_text` (text), `category` (text), `ai_answer` (text)
- `is_published` (boolean default false), `converted_to_article_slug` (text), `created_at` (timestamptz)
- **RLS:** Allow INSERT from anon, SELECT only for `is_published=true`.

### Table: `quizzes`
- `id` (uuid pk), `slug` (text unique), `title` (text), `category` (text), `description` (text)
- `questions_json` (jsonb), `result_types_json` (jsonb), `is_published` (boolean default true)

---

## 5. THE 18-CATEGORY MAP (Launch Tiers)

**🔴 Tier 1 (Launch - Highest India Search Volume)**
1. **Relationships & Marriage** (💕) - abuse, in-laws, toxic partners
2. **Women's Health** (🌸) - PCOS, periods, hormones, thyroid
3. **Mental Health & Emotions** (🧘) - depression, anxiety, burnout
4. **Skin & Beauty** (✨) - skincare, acne, dark spots, hair
5. **Family & Parenting** (🏠) - parents, in-laws, parenting
6. **Baby Care & Motherhood** (🤱) - newborn, feeding, sleep, growth

**🔵 Tier 2 (Month 2 - Solid Volume)**
7. **Fashion & Style** (👗)
8. **Career & Workplace** (💼) - salary, harassment, career break
9. **Pregnancy & Fertility** (🫄) - IVF, miscarriage
10. **Weight & Fitness** (🏃)
11. **Food & Indian Cooking** (🍛)
12. **Legal Rights** (⚖️) - divorce law, property, DV act

**🟡 Tier 3 (Month 3 - Niche/Loyal)**
13. **Sex & Intimacy** (🔒) - Private searches
14. **Finance & Money** (💰)
15. **Hair Care** (💇)
16. **Home & Household** (🏡)
17. **Festivals & Traditions** (🪔)
18. **Self-Growth & Confidence** (🌱)

---

## 6. PAGE STRUCTURES & SEO

### Homepage (WikiHow Style)
- **Section 1: Hero Search:** Rose-light bg, radial dots. H1: *"Find Your Answer. Safely. Anonymously."* Large search input. Trending tag pills.
- **Section 2: Category Grid:** 18 categories based on tiers.
- **Section 3: Featured How-To Guides:** Top published articles.
- **Section 4: Quizzes Strip:** Plum bg. Interactive personality quizzes.
- **Section 5: Anonymous Ask Box:** Pain-first copy: *"Is there a question you've been Googling alone at night? The one you can't ask your family. Or your husband. Or your friends. Ask it here. Completely anonymously. No name. No judgment."*

### Article Page (`/how-to/[slug]`)
Strict WikiHow DOM Structure for SEO:
- **Left Column (70%):** Breadcrumbs → H1 (Exact search query) → Meta → Intro (Mirror moment) → Ad Slot 1 → Steps (Numbered circles, H2 sub-questions, body, tips/internal CTAs) → Ad Slot 2 → Expert Tip Callout → Things You'll Need → FAQ Section (`<details><summary>`) → Related Articles → Ad Slot 3.
- **Right Sidebar (30%):** "More in [Category]", Quiz widget, Ad slot.
- **Schema:** Dual `HowTo` + `FAQPage` JSON-LD embedded.

### Quiz System (`/quiz/[slug]`)
Personality/insight quizzes managed in React `useState`. No right/wrong answers.
- Intro Screen → Question Screen (fade transitions, progress bar) → Result Screen (Canvas confetti, rose callout advice, WhatsApp share).

---

## 7. AUTOMATION & AI SYSTEM (GitHub Actions)

### AI System Prompt (The "Didi" Persona)
- **Tone:** Warm, non-judgmental, trusted older sister (didi). Never preachy.
- **Rules:** Acknowledge pain first, then practical steps. Simple English (Class 8). Indian cultural context (joint family, mil, mehendi, 181 helpline).
- **SEO:** Exact search phrase in intro, H2s as sub-questions, exact Google FAQs. Include natural internal links inside step bodies. Keyword density control.

### Cron Jobs
- **Daily (`generate-articles.js`):** Fetches from pain-first `titles-bank.json`, calls Groq API, validates JSON, inserts to Supabase, triggers Cloudflare deploy hook.
- **Weekly (`generate-quizzes.js`):** Generates personality quizzes.
- **Weekly (`translate-hindi.js`):** Translates top performing English articles to Hindi (`-hi` slug).
