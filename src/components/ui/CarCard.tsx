'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Fuel, Zap, Star } from 'lucide-react';
import Link from 'next/link';
import { Car, ThemeConfig } from '../../types';

interface CarCardProps {
  car: Car;
  theme: ThemeConfig;
}

const CarCard: React.FC<CarCardProps> = ({ car, theme }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={`group relative overflow-hidden rounded-[2.5rem] border ${theme.card} transition-all duration-500 p-4`}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem]">
        <img
          src={car.image}
          alt={car.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0 shadow-2xl"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 rounded-full bg-black/80 border border-white/10 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md">
          {car.type}: {car.name}
        </div>
      </div>

      <div className="mt-8 px-2 mb-4">
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <p className={`text-[9px] uppercase tracking-widest opacity-40 mb-1 ${theme.subtext}`}>Power</p>
            <p className="text-xl font-bold font-mono">{car.power}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <p className={`text-[9px] uppercase tracking-widest opacity-40 mb-1 ${theme.subtext}`}>Fuel</p>
            <p className="text-xl font-bold font-mono">{car.fuel}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <p className={`text-[9px] uppercase tracking-widest opacity-40 mb-1 ${theme.subtext}`}>Price/Day</p>
            <p className="text-xl font-bold font-mono">${car.pricePerDay}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <p className={`text-[9px] uppercase tracking-widest opacity-40 mb-1 ${theme.subtext}`}>Status</p>
            <p className="text-[11px] font-black uppercase tracking-widest text-green-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Available
            </p>
          </div>
        </div>

        <Link
          href={`/booking?car=${encodeURIComponent(car.id)}`}
          className="block w-full py-5 border border-blue-500/40 text-blue-400 hover:bg-blue-500 hover:text-white transition-all rounded-3xl font-black uppercase text-[10px] tracking-[0.4em] text-center"
        >
          Request Booking
        </Link>
      </div>
    </motion.div>
  );
};

export default CarCard;
