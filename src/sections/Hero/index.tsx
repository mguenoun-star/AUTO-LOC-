import React from 'react';
import HeroContent from './components/HeroContent';
import HeroVisual from './components/HeroVisual';
import Marquee from './components/Marquee';
import { Car, ThemeConfig } from '@/types';

interface HeroProps {
  featuredCar: Car;
  theme: ThemeConfig;
}

export default function Hero({ featuredCar, theme }: HeroProps) {
  return (
    <section className="relative min-h-screen grid grid-cols-12 pt-20">
      <HeroContent theme={theme} />
      <HeroVisual featuredCar={featuredCar} theme={theme} />
      <Marquee />
      <div className="absolute bottom-32 left-10 hidden md:flex flex-col items-center gap-8 z-20">
        <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
        <p className="[writing-mode:vertical-rl] text-[10px] font-bold uppercase tracking-[0.3em] opacity-20 transform rotate-180">Discovery Circle</p>
      </div>
    </section>
  );
}