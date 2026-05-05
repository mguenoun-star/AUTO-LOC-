'use client';

import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface AdminTableProps {
  columns: string[];
  children: React.ReactNode;
  minWidth?: string;
}

export default function AdminTable({ columns, children, minWidth = 'min-w-[780px]' }: AdminTableProps) {
  const { current } = useTheme();
  return (
    <div className={`rounded-[1.75rem] border ${current.card} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className={`w-full ${minWidth}`}>
          <thead className="bg-black/20 border-b border-white/10">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}
