import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { ThemeConfig } from '@/types';

interface HeroContentProps {
  theme: ThemeConfig;
}

export default function HeroContent({ theme }: HeroContentProps) {
  return (
    <div className="col-span-12 lg:col-span-7 flex flex-col justify-center px-8 md:px-20 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-blue-500/30 text-[9px] font-bold tracking-[0.4em] uppercase mb-10 bg-blue-500/5 w-fit backdrop-blur-sm"
      >
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Experience the future
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="text-[40px] sm:text-[60px] md:text-[110px] font-black tracking-tighter leading-[0.82] mb-12 uppercase"
      >
        BEYOND <br />
        <span className={`bg-clip-text text-transparent bg-gradient-to-r ${theme.accent}`}>DRIVING.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`${theme.subtext} text-xl md:text-2xl max-w-lg mb-16 font-light leading-relaxed`}
      >
        Automotive excellence redefined. Access the world&apos;s most exclusive fleet with a single touch.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center gap-10"
      >
        <Link href="/register" className={`px-12 py-6 rounded-full font-black uppercase text-[10px] tracking-[0.2em] transition-all hover:scale-105 ${theme.glow} ${theme.btn}`}>
          Start Engine
        </Link>
        <button className="flex items-center gap-4 font-bold text-[10px] uppercase tracking-widest hover:opacity-50 transition-all group">
          <span className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <Play className="w-4 h-4 fill-current ml-1" />
          </span>
          Watch Film
        </button>
      </motion.div>
    </div>
  );
}