'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X, ChevronDown, ChevronRight, Zap, TrendingUp, Flame, HelpCircle, Calendar, Bookmark, MessagesSquare } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

const topLinks = [
  { label: 'Saved Guides', icon: Bookmark, href: '/saved' },
  { label: 'Trending Now', icon: TrendingUp, href: '/search?q=trending' },
  { label: 'Public Q&A Feed', icon: MessagesSquare, href: '/questions' },
  { label: 'Quizzes 🔥', icon: Flame, href: '/quizzes' },
  { label: 'Ask Anonymously', icon: HelpCircle, href: '/ask' },
];

const categoryColumns = [
  {
    title: '💕 Relationships & Marriage',
    slug: 'relationships-marriage',
    links: [
      { label: 'Signs of a Toxic Partner', filter: 'toxic' },
      { label: 'Mother-in-Law Problems', filter: 'in-laws' },
      { label: 'Long Distance Love', filter: 'long-distance' },
    ],
  },
  {
    title: '🏠 Family & Parenting',
    slug: 'family-parenting',
    links: [
      { label: 'Dealing with Parents', filter: 'parents' },
      { label: 'Raising Kids Alone', filter: 'single-parenting' },
      { label: 'Joint Family Life', filter: 'joint-family' },
    ],
  },
  {
    title: '🫴 Baby Care & Motherhood',
    slug: 'baby-care-motherhood',
    links: [
      { label: 'Newborn Sleep Tips', filter: 'sleep' },
      { label: 'Breastfeeding Help', filter: 'breastfeeding' },
      { label: 'Baby Growth Guide', filter: 'growth' },
    ],
  },
  {
    title: '🫄 Pregnancy & Fertility',
    slug: 'pregnancy-fertility',
    links: [
      { label: 'Trimester by Trimester', filter: 'trimester' },
      { label: 'IVF & Fertility', filter: 'ivf' },
      { label: 'Miscarriage & Recovery', filter: 'recovery' },
    ],
  },
  {
    title: "🌸 Women's Health",
    slug: 'womens-health',
    links: [
      { label: 'PCOS & Hormones', filter: 'pcos' },
      { label: 'Period Problems', filter: 'period' },
      { label: 'Thyroid & Weight', filter: 'thyroid' },
    ],
  },
  {
    title: '🧘 Mental Health & Emotions',
    slug: 'mental-health-emotions',
    links: [
      { label: 'Anxiety & Stress', filter: 'anxiety' },
      { label: 'Depression & Sadness', filter: 'depression' },
      { label: 'Building Self-Worth', filter: 'self-worth' },
    ],
  },
  {
    title: '🏃 Weight & Fitness',
    slug: 'weight-fitness',
    links: [
      { label: 'Weight Loss for Women', filter: 'weight-loss' },
      { label: 'Home Workouts', filter: 'home-workouts' },
      { label: 'Diet & Nutrition', filter: 'diet' },
    ],
  },
  {
    title: '🍛 Food & Indian Cooking',
    slug: 'food-indian-cooking',
    links: [
      { label: 'Healthy Indian Recipes', filter: 'healthy' },
      { label: 'Diet Meal Plans', filter: 'meal-plans' },
      { label: 'Festive Cooking', filter: 'festive' },
    ],
  },
  {
    title: '✨ Skin & Beauty',
    slug: 'skin-beauty',
    links: [
      { label: 'Acne & Dark Spots', filter: 'acne' },
      { label: 'Natural Skincare', filter: 'natural' },
      { label: 'Glow Tips', filter: 'glow' },
    ],
  },
  {
    title: '💇 Hair Care',
    slug: 'hair-care',
    links: [
      { label: 'Hair Fall Solutions', filter: 'hair-fall' },
      { label: 'Oiling & Growth', filter: 'growth' },
      { label: 'Hair Styles for Indians', filter: 'styles' },
    ],
  },
  {
    title: '👗 Fashion & Style',
    slug: 'fashion-style',
    links: [
      { label: 'Saree Draping', filter: 'saree' },
      { label: 'Body Type Outfits', filter: 'body-type' },
      { label: 'Budget Fashion', filter: 'budget' },
    ],
  },
  {
    title: '🪔 Festivals & Traditions',
    slug: 'festivals-traditions',
    links: [
      { label: 'Karwa Chauth', filter: 'karwa-chauth' },
      { label: 'Navratri & Garba', filter: 'navratri' },
      { label: 'Diwali Beauty', filter: 'diwali' },
    ],
  },
  {
    title: '💼 Career & Workplace',
    slug: 'career-workplace',
    links: [
      { label: 'Salary Negotiation', filter: 'salary' },
      { label: 'Workplace Harassment', filter: 'harassment' },
      { label: 'Career After Break', filter: 'career-break' },
    ],
  },
  {
    title: '💰 Finance & Money',
    slug: 'finance-money',
    links: [
      { label: 'Savings for Women', filter: 'savings' },
      { label: 'Investment Basics', filter: 'investment' },
      { label: 'Financial Independence', filter: 'independence' },
    ],
  },
  {
    title: '⚖️ Legal Rights',
    slug: 'legal-rights',
    links: [
      { label: 'Divorce Law India', filter: 'divorce' },
      { label: 'Property Rights', filter: 'property' },
      { label: 'Domestic Violence Act', filter: 'domestic-violence' },
    ],
  },
  {
    title: '🌱 Self-Growth & Confidence',
    slug: 'self-growth-confidence',
    links: [
      { label: 'Setting Boundaries', filter: 'boundaries' },
      { label: 'Building Confidence', filter: 'confidence' },
      { label: 'Finding Your Purpose', filter: 'purpose' },
    ],
  },
];

// Split into 4 columns (4 rows per column)
const col1 = categoryColumns.slice(0, 4);
const col2 = categoryColumns.slice(4, 8);
const col3 = categoryColumns.slice(8, 12);
const col4 = categoryColumns.slice(12, 16);

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExploreOpen(false);
      }
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setExploreOpen(false);
      }
    };

    if (exploreOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [exploreOpen]);

  const handleLinkClick = () => {
    setExploreOpen(false);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-pg-gray-100">
      <div className="max-w-content mx-auto px-6 h-20 flex items-center justify-between gap-8 relative" ref={dropdownRef}>
        
        {/* Logo */}
        <Link href="/" onClick={handleLinkClick} className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-pg-rose flex items-center justify-center shadow-lg shadow-pg-rose/20 text-white font-display font-black text-xl italic">
            P
          </div>
          <span className="font-display font-black text-2xl text-pg-gray-900 tracking-tight">
            PurpleGirl
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 h-full">
          <Link
            href="/"
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              pathname === '/' 
                ? 'bg-pg-rose-light text-pg-rose' 
                : 'text-pg-gray-500 hover:text-pg-rose hover:bg-pg-gray-100'
            }`}
          >
            Home
          </Link>
          
          <button
            onClick={() => setExploreOpen(!exploreOpen)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1 ${
              exploreOpen || pathname.includes('/category') 
                ? 'bg-pg-rose-light text-pg-rose' 
                : 'text-pg-gray-500 hover:text-pg-rose hover:bg-pg-gray-100'
            }`}
          >
            Explore <ChevronDown size={14} className={`transition-transform duration-200 ${exploreOpen ? 'rotate-180' : ''}`} />
          </button>

          <Link
            href="/quizzes"
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              pathname === '/quizzes' 
                ? 'bg-pg-rose-light text-pg-rose' 
                : 'text-pg-gray-500 hover:text-pg-rose hover:bg-pg-gray-100'
            }`}
          >
            Quizzes
          </Link>
        </nav>

        {/* Desktop Mega Menu Dropdown */}
        {exploreOpen && (
          <div 
            className="hidden lg:block absolute top-[80px] left-0 w-full bg-white border-b border-pg-rose/20 shadow-xl shadow-pg-rose/5 transform transition-all duration-180 ease-out z-50 animate-in fade-in slide-in-from-top-2"
          >
            <div className="max-w-content mx-auto p-8">
              
              {/* Top Row Links */}
              <div className="flex flex-wrap gap-3 mb-8 pb-6 border-b border-pg-gray-100">
                {topLinks.map((link) => (
                  <Link 
                    key={link.label}
                    href={link.href}
                    onClick={handleLinkClick}
                    className="flex items-center gap-1.5 px-4 py-2 bg-pg-rose-light text-pg-rose rounded-full text-[13px] font-sans font-bold hover:bg-pg-rose hover:text-white transition-colors"
                  >
                    <link.icon size={14} />
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* 4 Columns */}
              <div className="grid grid-cols-4 gap-8">
                {[col1, col2, col3, col4].map((col, idx) => (
                  <div key={idx} className="space-y-8">
                    {col.map((category) => (
                      <div key={category.slug}>
                        <Link 
                          href={`/category/${category.slug}`}
                          onClick={handleLinkClick}
                          className="font-sans text-[14px] font-bold text-pg-rose mb-3 block hover:underline"
                        >
                          {category.title}
                        </Link>
                        <ul className="space-y-2.5">
                          {category.links.map((link) => (
                            <li key={link.label}>
                              <Link 
                                href={`/category/${category.slug}?filter=${link.filter}`}
                                onClick={handleLinkClick}
                                className="font-sans text-[13px] text-pg-gray-700 hover:text-pg-rose hover:underline block"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/search" className="hidden sm:flex p-2 text-pg-gray-400 hover:text-pg-rose transition-colors" aria-label="Search">
            <Search size={20} />
          </Link>
          <Link href="/ask" className="hidden md:block">
            <Button variant="primary" className="py-2 px-6 text-sm shadow-sm">
              Ask Anonymously
            </Button>
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-pg-gray-900"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden fixed top-[80px] left-0 w-full h-[calc(100vh-80px)] overflow-y-auto bg-white flex flex-col z-[100] animate-in fade-in slide-in-from-top-4 pb-12">
          
          <div className="p-6 space-y-2">
            <Link
              href="/"
              onClick={handleLinkClick}
              className="block px-6 py-4 rounded-2xl text-lg font-bold text-pg-gray-700 active:bg-pg-gray-100"
            >
              Home
            </Link>
            
            <div className="px-6 py-4 rounded-2xl text-lg font-bold text-pg-gray-700">
              <div className="flex items-center gap-2 mb-4 text-pg-rose">
                Explore Categories <ChevronDown size={18} />
              </div>
              <div className="space-y-4">
                {categoryColumns.map((cat) => (
                  <div key={cat.slug} className="border border-pg-gray-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenAccordion(openAccordion === cat.slug ? null : cat.slug)}
                      className="w-full flex items-center justify-between p-4 bg-pg-cream text-left font-sans text-[15px] font-bold"
                    >
                      {cat.title}
                      <ChevronRight size={16} className={`transition-transform ${openAccordion === cat.slug ? 'rotate-90 text-pg-rose' : 'text-pg-gray-400'}`} />
                    </button>
                    {openAccordion === cat.slug && (
                      <div className="bg-white p-4 space-y-3">
                        {cat.links.map(link => (
                          <Link
                            key={link.label}
                            href={`/category/${cat.slug}?filter=${link.filter}`}
                            onClick={handleLinkClick}
                            className="block font-sans text-[14px] text-pg-gray-600 pl-4 py-1"
                          >
                            {link.label}
                          </Link>
                        ))}
                        <Link
                          href={`/category/${cat.slug}`}
                          onClick={handleLinkClick}
                          className="block font-sans text-[14px] font-bold text-pg-rose pl-4 pt-2 mt-2 border-t border-pg-gray-50"
                        >
                          View All in {cat.title.split(' ').slice(1).join(' ')} →
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/#quizzes"
              onClick={handleLinkClick}
              className="block px-6 py-4 rounded-2xl text-lg font-bold text-pg-gray-700 active:bg-pg-gray-100"
            >
              Quizzes
            </Link>
          </div>

          <div className="p-6 mt-auto border-t border-pg-gray-100">
            <Link href="/ask" onClick={handleLinkClick}>
              <Button variant="primary" className="w-full py-4 text-lg shadow-md">
                Ask Anonymously
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
