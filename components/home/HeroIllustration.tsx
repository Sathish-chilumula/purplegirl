'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';

export function HeroIllustration() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full max-w-[420px] mx-auto"
    >
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/hero_women_v2.png"
          alt="Diverse Indian Women Illustration"
          width={420}
          height={380}
          priority
          className="w-full h-auto drop-shadow-2xl rounded-3xl"
        />
      </motion.div>
      
      {/* Sparkles effect */}
      <motion.div 
        initial={{ opacity: 0, rotate: -45 }}
        animate={{ opacity: [0.5, 1, 0.5], rotate: 45 }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-4 right-4 text-pg-gold text-2xl"
      >
        ✨
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, rotate: 45 }}
        animate={{ opacity: [0.3, 0.8, 0.3], rotate: -45 }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-12 left-2 text-pg-rose text-xl"
      >
        ✨
      </motion.div>
    </motion.div>
  );
}
