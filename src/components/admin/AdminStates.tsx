'use client';

import React from 'react';
import { AlertTriangle, Inbox, LoaderCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface StateProps {
  title: string;
  hint: string;
}

export function AdminLoadingState({ title, hint }: StateProps) {
  const { current } = useTheme();
  return (
    <div className={`rounded-[1.75rem] border ${current.card} p-12 text-center`}>
      <LoaderCircle className="w-10 h-10 mx-auto animate-spin text-blue-400 mb-4" />
      <h3 className="text-xl font-black uppercase tracking-tight mb-2">{title}</h3>
      <p className="opacity-60 text-sm">{hint}</p>
    </div>
  );
}

export function AdminErrorState({ title, hint }: StateProps) {
  const { current } = useTheme();
  return (
    <div className={`rounded-[1.75rem] border border-red-500/30 bg-red-500/10 p-12 text-center ${current.text}`}>
      <AlertTriangle className="w-10 h-10 mx-auto text-red-400 mb-4" />
      <h3 className="text-xl font-black uppercase tracking-tight mb-2">{title}</h3>
      <p className="opacity-70 text-sm">{hint}</p>
    </div>
  );
}

export function AdminEmptyState({ title, hint }: StateProps) {
  const { current } = useTheme();
  return (
    <div className={`rounded-[1.75rem] border ${current.card} p-12 text-center`}>
      <Inbox className="w-10 h-10 mx-auto text-blue-400 mb-4" />
      <h3 className="text-xl font-black uppercase tracking-tight mb-2">{title}</h3>
      <p className="opacity-60 text-sm">{hint}</p>
    </div>
  );
}
