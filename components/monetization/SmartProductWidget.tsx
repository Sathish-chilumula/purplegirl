'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

interface SmartProductWidgetProps {
  category: string;
  title: string;
}

// A comprehensive dictionary mapping keywords to high-converting affiliate products
const PRODUCT_MAP = [
  {
    keywords: ['acne', 'pimple', 'dark spot', 'pigment', 'glowing'],
    name: 'Minimalist 10% Vitamin C Face Serum',
    desc: 'Brightens skin, reduces dark spots and hyperpigmentation for glowing skin.',
    url: 'https://www.nykaa.com/search/result/?q=minimalist+vitamin+c+serum',
    price: '₹699',
    brand: 'Minimalist',
    tag: 'Dermatologist Recommended',
  },
  {
    keywords: ['hair fall', 'dandruff', 'hair growth', 'split ends'],
    name: 'Mamaearth Onion Hair Oil',
    desc: 'Reduces hair fall and promotes hair growth with the goodness of onion and redendal.',
    url: 'https://www.amazon.in/s?k=mamaearth+onion+hair+oil',
    price: '₹399',
    brand: 'Mamaearth',
    tag: 'Best for Hair Fall',
  },
  {
    keywords: ['pcos', 'hormone', 'weight', 'pcod'],
    name: 'Oziva Plant Based HerBalance for PCOS',
    desc: 'Ayurvedic herbs for hormonal balance, better cycles, and reduced PCOS symptoms.',
    url: 'https://www.amazon.in/s?k=oziva+pcos+herbalance',
    price: '₹899',
    brand: 'OZiva',
    tag: 'Women\'s Health',
  },
  {
    keywords: ['period', 'cramp', 'pain'],
    name: 'Nua Cramp Comfort Heat Patches',
    desc: 'Soothes period cramps instantly with up to 8 hours of continuous, comforting heat.',
    url: 'https://www.amazon.in/s?k=nua+heat+patch',
    price: '₹299',
    brand: 'Nua',
    tag: 'Instant Relief',
  },
  {
    keywords: ['stress', 'anxiety', 'in-law', 'toxic', 'sleep'],
    name: 'Plum Goodness Sleep-a-holic Pillow Mist',
    desc: 'Calming lavender mist to help you relax, de-stress, and sleep peacefully after a long day.',
    url: 'https://www.nykaa.com/search/result/?q=plum+sleep+mist',
    price: '₹350',
    brand: 'Plum',
    tag: 'Self Care',
  },
  {
    keywords: ['career', 'interview', 'work', 'office', 'salary'],
    name: 'Zouk Vegan Leather Work Tote',
    desc: 'Spacious, stylish, and professional tote bag perfect for carrying your laptop and office essentials.',
    url: 'https://www.amazon.in/s?k=zouk+laptop+bag',
    price: '₹1,499',
    brand: 'Zouk',
    tag: 'Office Essential',
  },
  {
    keywords: ['saree', 'kurta', 'wedding', 'festival', 'diwali'],
    name: 'BIBA Women Elegant Kurta Set',
    desc: 'Beautiful, comfortable ethnic wear perfect for festivals, office, or casual outings.',
    url: 'https://www.myntra.com/biba-kurta-sets',
    price: '₹1,599',
    brand: 'BIBA',
    tag: 'Bestseller',
  },
  {
    keywords: ['makeup', 'lipstick', 'beauty', 'look'],
    name: 'Nykaa Matte to Last Liquid Lipstick',
    desc: 'Long-lasting, transfer-proof matte lipstick that stays flawless all day.',
    url: 'https://www.nykaa.com/search/result/?q=nykaa+matte+lipstick',
    price: '₹599',
    brand: 'Nykaa',
    tag: 'Editor\'s Pick',
  },
  {
    keywords: ['kitchen', 'cooking', 'recipe', 'food', 'time saving'],
    name: 'Pigeon by Stovekraft Manual Chopper',
    desc: 'Save precious time in the kitchen with this effortless vegetable chopper.',
    url: 'https://www.amazon.in/s?k=pigeon+chopper',
    price: '₹249',
    brand: 'Pigeon',
    tag: 'Time Saver',
  },
  {
    keywords: ['baby', 'pregnancy', 'motherhood', 'newborn'],
    name: 'Sebamed Baby Lotion',
    desc: 'Gentle, pH 5.5 balanced lotion to protect and nourish your baby\'s delicate skin.',
    url: 'https://www.amazon.in/s?k=sebamed+baby+lotion',
    price: '₹450',
    brand: 'Sebamed',
    tag: 'Pediatrician Recommended',
  }
];

export default function SmartProductWidget({ category, title }: SmartProductWidgetProps) {
  const searchString = `${title.toLowerCase()} ${category.toLowerCase()}`;
  
  // Find the first product where any of its keywords exist in the title or category
  let match = PRODUCT_MAP.find(product => 
    product.keywords.some(kw => searchString.includes(kw))
  );

  // If no specific match, generate a dynamic Amazon search link based on the title
  // and use a generic fallback layout
  if (!match) {
    const safeTitleSearch = encodeURIComponent(title.split(' ').slice(0, 3).join(' '));
    match = {
      keywords: [],
      name: 'Explore products related to this topic',
      desc: `Find highly-rated essentials and solutions for ${title.toLowerCase()}.`,
      url: `https://www.amazon.in/s?k=${safeTitleSearch}`,
      price: 'Shop Now',
      brand: 'Amazon India',
      tag: 'Trending',
    };
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-10 p-6 rounded-2xl border-2 border-pg-rose-light bg-gradient-to-br from-white to-pg-plum-light/30 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 text-pg-plum">
        <ShoppingBag size={120} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-pg-rose text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1">
            <Sparkles size={12} />
            {match.tag}
          </span>
          <span className="text-xs text-pg-gray-500 uppercase tracking-widest font-semibold">{match.brand}</span>
        </div>
        
        <h3 className="text-2xl font-display font-bold text-pg-gray-900 mb-2">
          {match.name}
        </h3>
        
        <p className="text-pg-gray-700 mb-6 max-w-md">
          {match.desc}
        </p>
        
        <div className="flex items-center gap-6">
          <span className="text-2xl font-bold text-pg-plum">{match.price}</span>
          <a 
            href={match.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 bg-pg-plum text-white px-6 py-3 rounded-full font-semibold hover:bg-pg-plum-dark transition-colors"
          >
            Check Price
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
