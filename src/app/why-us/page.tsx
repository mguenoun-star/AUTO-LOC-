'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Star, Globe, Clock, Heart } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const strengths = [
  { icon: Shield, title: 'Absolute Security', desc: 'Every vehicle in our fleet is maintained to aerospace standards. Your safety is our primary engineering requirement.' },
  { icon: Zap, title: 'Instant Access', desc: 'Our booking system uses real-time telemetry to ensure your vehicle is ready the second you arrive.' },
  { icon: Star, title: 'Elite Hangar', desc: "We own one of the world's most curated automotive collections, ranging from vintage classics to hyper-prototypes." },
  { icon: Globe, title: 'Global Network', desc: 'Access your membership benefits across 40 major cities worldwide with seamless cross-border service.' },
  { icon: Clock, title: '24/7 Concierge', desc: 'A dedicated lifestyle manager is assigned to every member, ensuring no request is too small.' },
  { icon: Heart, title: 'Passion Driven', desc: 'We are more than a rental service. We are a community of enthusiasts dedicated to the art of the drive.' },
];

export default function WhyUs() {
  const { current } = useTheme();

  return (
    <main className={`min-h-screen ${current.bg} ${current.text} relative overflow-hidden pb-10`}>
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/30 blur-[150px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 blur-[150px] rounded-full pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 pt-40 relative z-10">
        <div className="text-center mb-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-10 backdrop-blur-md"
          >
            <Star className="w-3 h-3" /> The Standard of Excellence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-8"
          >
            Beyond <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Expectations.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`max-w-2xl mx-auto text-lg md:text-xl ${current.subtext} font-light leading-relaxed`}
          >
            We don&apos;t just rent cars. We curate an automotive experience designed to elevate every journey. Simple, seamless, and unmistakably premium.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-20 items-start">
          <div className="lg:sticky lg:top-40 lg:w-1/3">
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-6 leading-none"
            >
              Our Core <br /><span className="text-blue-500">Pillars</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className={`${current.subtext} mb-8 leading-relaxed text-lg`}
            >
              Every detail is engineered to perfection. From our diverse fleet to our 24/7 concierge, we ensure your ride is flawless.
            </motion.p>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              viewport={{ once: true }}
              className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
            />
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {strengths.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: (i % 2) * 0.1, duration: 0.5 }}
                className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(37,99,235,0.1)] transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 border border-white/5">
                  <s.icon className="w-6 h-6 text-blue-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">{s.title}</h3>
                <p className={`text-sm ${current.subtext} leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity`}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-40 text-center max-w-4xl mx-auto py-20 relative"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent via-blue-500/50 to-transparent" />
          <Zap className="w-8 h-8 text-blue-500 mx-auto mb-8 opacity-50" />
          <h2 className="text-3xl md:text-5xl font-light italic leading-snug mb-10 text-white/90">
            &quot;To drive an AutoLoc vehicle is to understand that the destination is merely a formality of the journey.&quot;
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">— The AutoLoc Engineers</p>
        </motion.div>
      </div>
    </main>
  );
}
