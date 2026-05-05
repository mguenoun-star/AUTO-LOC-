import React from 'react';
import { motion } from 'framer-motion';
import CarCard from '@/components/ui/CarCard';
import { Car, ThemeConfig } from '@/types';

interface HeroVisualProps {
  featuredCar: Car;
  theme: ThemeConfig;
}

export default function HeroVisual({ featuredCar, theme }: HeroVisualProps) {
  return (
    <div className="hidden lg:flex col-span-5 bg-white/3 border-l border-white/5 flex-col items-center justify-center p-16 relative">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full"
      >
        <CarCard car={featuredCar} theme={theme} />
      </motion.div>
    </div>
  );
}