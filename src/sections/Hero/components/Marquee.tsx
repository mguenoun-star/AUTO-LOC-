import React from 'react';
import { motion } from 'framer-motion';
import { marqueeImages } from '../utils/marqueeData';

export default function Marquee() {
  return (
    <div className="absolute bottom-0 left-0 w-full h-28 bg-black/20 backdrop-blur-xl flex items-center border-t border-white/5 z-20 overflow-hidden transform translate-y-16">
      <div className="flex whitespace-nowrap items-center w-full">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="flex gap-4 px-4"
        >
          {[...marqueeImages, ...marqueeImages, ...marqueeImages].map((img, i) => (
            <div key={i} className="relative group w-48 h-20 rounded-2xl overflow-hidden border border-white/5 shrink-0 transition-transform hover:scale-105 active:scale-95 cursor-crosshair">
              <img
                src={img}
                alt="Marquee Vehicle"
                className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                <span className="text-[7px] font-black uppercase tracking-[0.3em] text-white">Hyper Series</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}