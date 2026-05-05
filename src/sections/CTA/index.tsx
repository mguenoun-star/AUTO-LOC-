import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ThemeConfig } from '@/types';

interface CTAProps {
  theme: ThemeConfig;
}

export default function CTA({ theme }: CTAProps) {
  return (
    <section className="py-40 px-6">
      <motion.div
        whileInView={{ scale: [0.95, 1], opacity: [0, 1] }}
        viewport={{ once: true }}
        className={`max-w-6xl mx-auto relative rounded-[2.5rem] sm:rounded-[4rem] overflow-hidden p-10 md:p-32 text-center border ${theme.card}`}
      >
        <motion.div
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: '120%', opacity: [0, 0.15, 0.15, 0] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute top-1/2 -translate-y-1/2 w-[800px] pointer-events-none mix-blend-overlay z-0"
        >
          <img
            src="https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=1400"
            alt="Elite Vehicle"
            className="w-full h-auto grayscale filter brightness-200"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <div className={`absolute inset-0 opacity-15 bg-gradient-to-br ${theme.accent} blur-3xl`} />
        <div className="relative z-10">
          <h2 className="text-6xl md:text-9xl font-black tracking-tighter mb-12 uppercase leading-none">Your journey<br />awaits.</h2>
          <p className={`${theme.subtext} text-xl md:text-2xl max-w-2xl mx-auto mb-16 font-medium italic`}>
            &quot;The most exclusive keys are reserved for our members. Sign in now to unlock private rates and elite hangar access.&quot;
          </p>
          <Link href="/login" className={`inline-block px-20 py-7 text-white font-black uppercase text-xs tracking-[0.3em] rounded-full ${theme.glow} hover:scale-110 transition-all bg-blue-600`}>
            Connect to Collection
          </Link>
        </div>
      </motion.div>
    </section>
  );
}