import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import FleetGrid from './components/FleetGrid';
import { featuredCars } from './utils/featuredCars';
import { ThemeConfig } from '@/types';

interface FleetProps {
  theme: ThemeConfig;
}

export default function Fleet({ theme }: FleetProps) {
  return (
    <section id="fleet" className="py-40 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-blue-500 font-black text-xs uppercase tracking-[0.4em] mb-6"
            >
              Curated Selection
            </motion.div>
            <h2 className="text-6xl md:text-7xl font-black tracking-tighter mb-8 uppercase leading-none">The Masterpiece<br />Collection</h2>
            <p className={`${theme.subtext} text-xl leading-relaxed`}>Découvrez notre flotte exclusive, où chaque véhicule est une invitation à l&apos;exceptionnel.</p>
          </div>
          <Link href="/fleet" className="px-10 py-5 rounded-full border border-current/20 font-bold text-xs uppercase tracking-widest group hover:bg-current hover:text-black transition-all">
            View All Fleet <ChevronRight className="w-4 h-4 inline ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <FleetGrid cars={featuredCars} theme={theme} />
      </div>
    </section>
  );
}