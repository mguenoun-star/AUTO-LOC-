'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import Hero from '@/sections/Hero';
import Fleet from '@/sections/Fleet';
import CTA from '@/sections/CTA';
import { featuredCars } from '@/sections/Fleet/utils/featuredCars';

export default function Landing() {
  const { current, theme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${current.bg} ${current.text} overflow-hidden font-sans relative`}>
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none"></div>

      <Hero featuredCar={featuredCars[featuredCars.length - 1]} theme={current} />
      <Fleet theme={current} />
      <CTA theme={current} />
    </div>
  );
}
