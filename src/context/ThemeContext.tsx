'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ThemeKey, ThemeConfig } from '../types';
import { themes } from '../constants';

interface ThemeContextType {
  theme: ThemeKey;
  current: ThemeConfig;
  setTheme: (theme: ThemeKey) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeKey>('luxury');

  const cycleTheme = () => {
    const keys = Object.keys(themes) as ThemeKey[];
    const nextIndex = (keys.indexOf(theme) + 1) % keys.length;
    setThemeState(keys[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      current: themes[theme], 
      setTheme: setThemeState, 
      cycleTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
