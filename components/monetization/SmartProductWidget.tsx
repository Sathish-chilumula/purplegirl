'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Sparkles, ShoppingBag, Scale, Heart, TrendingUp, Stethoscope } from 'lucide-react';

interface SmartProductWidgetProps {
  category: string;
  title: string;
}

// ── High-CPC Affiliate Partners (§5.2 from prompt) ────────────────────────────
// Matched by category slug first, then by keyword fallback

interface AffiliateProduct {
  keywords?: string[];
  name: string;
  desc: string;
  url: string;
  cta: string;
  brand: string;
  tag: string;
  badge?: string; // e.g. "₹100–300 CPC"
  icon: 'legal' | 'finance' | 'health' | 'therapy' | 'beauty' | 'baby' | 'general';
}

// Category-slug → primary affiliate (high-CPC categories first)
const CATEGORY_AFFILIATE: Record<string, AffiliateProduct> = {
  'legal-rights': {
    name: 'Free Legal Consultation for Women',
    desc: 'Get a free 15-minute consultation with a women\'s rights lawyer via Vakil Search. No registration needed.',
    url: 'https://vakilsearch.com/women-legal-services',
    cta: 'Book Free Consultation',
    brand: 'Vakil Search',
    tag: 'Legal Help',
    badge: 'Free First Call',
    icon: 'legal',
  },
  'finance-money': {
    name: 'Start SIP with ₹500/month — Groww',
    desc: 'India\'s simplest investment app for beginners. Start a Systematic Investment Plan in under 5 minutes. No paperwork.',
    url: 'https://groww.in/mutual-funds',
    cta: 'Start Investing Free',
    brand: 'Groww',
    tag: 'Investment',
    badge: 'Zero Commission',
    icon: 'finance',
  },
  'career-workplace': {
    name: 'Women\'s Health Insurance — Policybazaar',
    desc: 'Compare health insurance plans designed for working women in India. Coverage from ₹300/month.',
    url: 'https://www.policybazaar.com/health-insurance/women-health-insurance/',
    cta: 'Compare Plans Free',
    brand: 'Policybazaar',
    tag: 'Insurance',
    badge: '₹100–300 CPC',
    icon: 'health',
  },
  'mental-health-emotions': {
    name: 'Online Therapy with Indian Psychologists',
    desc: 'Licensed Indian psychologists — available in Hindi, Telugu, and English. First session at ₹499.',
    url: 'https://www.yourdost.com',
    cta: 'Book a Session',
    brand: 'YourDOST',
    tag: 'Therapy',
    badge: 'Licensed Experts',
    icon: 'therapy',
  },
  'relationships-marriage': {
    name: 'Couples Counselling — Talk to a Therapist',
    desc: 'BetterLYF connects you with relationship counsellors who understand Indian family dynamics.',
    url: 'https://www.betterlyf.com/couples-counseling',
    cta: 'Start Counselling',
    brand: 'BetterLYF',
    tag: 'Relationships',
    badge: 'Private & Secure',
    icon: 'therapy',
  },
  'womens-health': {
    name: 'Oziva HerBalance — PCOS & Hormonal Support',
    desc: 'Plant-based supplement clinically formulated for PCOS, hormonal balance, and regular cycles.',
    url: 'https://www.amazon.in/s?k=oziva+herbalance+pcos',
    cta: 'Check on Amazon',
    brand: 'OZiva',
    tag: 'Women\'s Health',
    badge: 'Bestseller',
    icon: 'health',
  },
  'pregnancy-fertility': {
    name: 'IVF & Fertility Insurance — Policybazaar',
    desc: 'Compare fertility treatment coverage plans in India. Some plans cover IVF up to ₹2 lakh.',
    url: 'https://www.policybazaar.com/health-insurance/',
    cta: 'Compare Plans',
    brand: 'Policybazaar',
    tag: 'Fertility Insurance',
    badge: 'IVF Covered',
    icon: 'health',
  },
  'baby-care-motherhood': {
    name: 'Sebamed Baby Skincare Starter Kit',
    desc: 'pH 5.5 balanced baby skincare recommended by Indian paediatricians for newborn skin.',
    url: 'https://www.amazon.in/s?k=sebamed+baby+starter+kit',
    cta: 'Shop on Amazon',
    brand: 'Sebamed',
    tag: 'Baby Care',
    badge: 'Paediatrician Approved',
    icon: 'baby',
  },
  'skin-beauty': {
    name: 'Minimalist Skincare Kit for Indian Skin',
    desc: 'Evidence-based, dermatologist-tested skincare formulated for Indian skin tones and climates.',
    url: 'https://www.nykaa.com/brands/minimalist',
    cta: 'Shop on Nykaa',
    brand: 'Minimalist',
    tag: 'Skincare',
    badge: 'Dermatologist Pick',
    icon: 'beauty',
  },
};

// Keyword-based fallback (for categories without a direct mapping)
const KEYWORD_PRODUCTS: AffiliateProduct[] = [
  {
    keywords: ['hair fall', 'dandruff', 'hair growth'],
    name: 'Mamaearth Onion Hair Oil',
    desc: 'Reduces hair fall with the power of onion and redendal. 4.2★ on Amazon.',
    url: 'https://www.amazon.in/s?k=mamaearth+onion+hair+oil',
    cta: 'Shop on Amazon',
    brand: 'Mamaearth',
    tag: 'Hair Care',
    icon: 'beauty',
  },
  {
    keywords: ['period', 'cramp', 'pain'],
    name: 'Nua Cramp Comfort Heat Patches',
    desc: 'Up to 8 hours of continuous heat for period cramp relief — discreet and wearable.',
    url: 'https://www.amazon.in/s?k=nua+heat+patch',
    cta: 'Shop on Amazon',
    brand: 'Nua',
    tag: 'Period Care',
    icon: 'health',
  },
  {
    keywords: ['kitchen', 'cooking', 'recipe', 'meal prep'],
    name: 'Pigeon Manual Vegetable Chopper',
    desc: 'Save 20 minutes per day in the kitchen. India\'s bestselling chopper.',
    url: 'https://www.amazon.in/s?k=pigeon+chopper',
    cta: 'Shop on Amazon',
    brand: 'Pigeon',
    tag: 'Kitchen',
    icon: 'general',
  },
  {
    keywords: ['invest', 'mutual fund', 'sip', 'ppf', 'saving'],
    name: 'Start SIP with ₹500/month — Groww',
    desc: 'Zero commission mutual funds. Start in 5 minutes, no paperwork.',
    url: 'https://groww.in/mutual-funds',
    cta: 'Start Free',
    brand: 'Groww',
    tag: 'Investment',
    icon: 'finance',
  },
];

const ICON_MAP = {
  legal: Scale,
  finance: TrendingUp,
  health: Stethoscope,
  therapy: Heart,
  beauty: Sparkles,
  baby: Heart,
  general: ShoppingBag,
};

export default function SmartProductWidget({ category, title }: SmartProductWidgetProps) {
  // 1. Try category-level match first (highest CPC)
  let product: AffiliateProduct | null = CATEGORY_AFFILIATE[category] || null;

  // 2. Fallback: keyword match against article title
  if (!product) {
    const titleLower = title.toLowerCase();
    product = KEYWORD_PRODUCTS.find(p =>
      p.keywords?.some(kw => titleLower.includes(kw))
    ) || null;
  }

  // 3. Final fallback: generic Amazon search
  if (!product) {
    const safeTitleSearch = encodeURIComponent(title.split(' ').slice(0, 4).join(' '));
    product = {
      name: 'Find products related to this guide',
      desc: `Shop top-rated essentials for ${title.toLowerCase()} on Amazon India.`,
      url: `https://www.amazon.in/s?k=${safeTitleSearch}`,
      cta: 'Search on Amazon',
      brand: 'Amazon India',
      tag: 'Curated Picks',
      icon: 'general',
    };
  }

  const IconComponent = ICON_MAP[product.icon] || ShoppingBag;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-10 rounded-2xl border border-pg-gray-100 bg-gradient-to-br from-white to-pg-cream overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-6 flex flex-col sm:flex-row items-start gap-5">
        {/* Icon */}
        <div className="w-14 h-14 bg-pg-rose-light rounded-2xl flex items-center justify-center shrink-0">
          <IconComponent size={24} className="text-pg-rose" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-pg-rose text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles size={10} /> {product.tag}
            </span>
            <span className="text-[11px] text-pg-gray-400 font-bold uppercase tracking-widest">
              {product.brand}
            </span>
            {product.badge && (
              <span className="text-[10px] text-pg-plum font-bold border border-pg-plum/30 px-2 py-0.5 rounded-full">
                {product.badge}
              </span>
            )}
          </div>

          <h3 className="font-display font-bold text-[18px] text-pg-gray-900 mb-2 leading-tight">
            {product.name}
          </h3>

          <p className="text-pg-gray-600 text-sm mb-5 leading-relaxed">
            {product.desc}
          </p>

          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-2 bg-pg-plum text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-pg-plum-dark transition-colors group"
          >
            {product.cta}
            <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
