'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

interface SmartProductWidgetProps {
  category: string;
  title: string;
}

// A simple dictionary mapping categories or keywords to high-converting Indian products
const PRODUCT_MAP: Record<string, { name: string; desc: string; url: string; price: string; brand: string; tag: string }> = {
  'skin-beauty': {
    name: 'Minimalist 10% Vitamin C Face Serum',
    desc: 'Brightens skin, reduces dark spots and hyperpigmentation for glowing skin.',
    url: 'https://www.nykaa.com/search/result/?q=minimalist+vitamin+c+serum',
    price: '₹699',
    brand: 'Minimalist',
    tag: 'Dermatologist Recommended',
  },
  'fashion-style': {
    name: 'Biba Women Kurta Set',
    desc: 'Elegant, comfortable ethnic wear perfect for daily office or casual outings.',
    url: 'https://www.myntra.com/biba-kurta-sets',
    price: '₹1,599',
    brand: 'BIBA',
    tag: 'Bestseller',
  },
  'health-wellness': {
    name: 'Oziva Protein & Herbs for Women',
    desc: 'Clean protein with Ayurvedic herbs for better metabolism and hormonal balance.',
    url: 'https://www.amazon.in/s?k=oziva+protein+for+women',
    price: '₹1,449',
    brand: 'OZiva',
    tag: 'Women\'s Health',
  },
  'home-household': {
    name: 'Pigeon by Stovekraft Chopper',
    desc: 'Save time in the kitchen with this effortless manual vegetable chopper.',
    url: 'https://www.amazon.in/s?k=pigeon+chopper',
    price: '₹249',
    brand: 'Pigeon',
    tag: 'Time Saver',
  },
  'default': {
    name: 'Nykaa Cosmetics Matte to Last Liquid Lipstick',
    desc: 'Long-lasting, transfer-proof matte lipstick for everyday confidence.',
    url: 'https://www.nykaa.com/search/result/?q=nykaa+matte+lipstick',
    price: '₹599',
    brand: 'Nykaa',
    tag: 'Editor\'s Pick',
  }
};

export default function SmartProductWidget({ category, title }: SmartProductWidgetProps) {
  // Simple keyword matching, fallback to category, then fallback to default
  const lowerTitle = title.toLowerCase();
  
  let match = PRODUCT_MAP['default'];
  
  if (lowerTitle.includes('acne') || lowerTitle.includes('dark spot') || lowerTitle.includes('pigment')) {
    match = PRODUCT_MAP['skin-beauty'];
  } else if (lowerTitle.includes('saree') || lowerTitle.includes('kurta') || lowerTitle.includes('dress')) {
    match = PRODUCT_MAP['fashion-style'];
  } else if (lowerTitle.includes('kitchen') || lowerTitle.includes('chore')) {
    match = PRODUCT_MAP['home-household'];
  } else if (PRODUCT_MAP[category]) {
    match = PRODUCT_MAP[category];
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
