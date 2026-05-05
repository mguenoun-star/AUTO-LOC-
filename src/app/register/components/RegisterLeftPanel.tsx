'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { features } from '../utils/features';

export default function RegisterLeftPanel() {
  return (
    <div className="w-full lg:w-[45%] p-6 md:p-12 lg:p-20 flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-md w-full mx-auto"
      >
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span className="text-xl font-bold">EliteDrive</span>
        </div>

        <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-6">Join the Elite</h1>
        <p className="text-gray-600 mb-12 leading-relaxed">Create your account and unlock access to the world's most exclusive fleet.</p>

        <div className="space-y-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}