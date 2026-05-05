'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { AdminVehicle } from '@/types';

function approvalBadge(approval: AdminVehicle['approval']) {
  if (approval === 'approved') return 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/20';
  if (approval === 'rejected') return 'bg-red-500/20 text-red-300 border border-red-400/20';
  return 'bg-amber-500/20 text-amber-300 border border-amber-400/20';
}

function availabilityBadge(status: AdminVehicle['status']) {
  if (status === 'available') return 'bg-blue-500/20 text-blue-300 border border-blue-400/20';
  return 'bg-zinc-500/20 text-zinc-300 border border-zinc-400/20';
}

export default function HostListingCard({ listing }: { listing: AdminVehicle }) {
  const { current } = useTheme();

  return (
    <div className={`rounded-[2rem] border ${current.card} p-5 space-y-4`}>
      <div className="flex items-start gap-4">
        <img
          src={listing.image}
          alt={listing.name}
          className="w-24 h-16 rounded-xl object-cover border border-white/10"
          referrerPolicy="no-referrer"
        />
        <div className="flex-1">
          <div className="text-xs font-black uppercase tracking-widest opacity-50">{listing.id}</div>
          <h3 className="text-lg font-black uppercase tracking-tight">{listing.name}</h3>
          <p className={`text-xs ${current.subtext}`}>{listing.type}</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black uppercase tracking-widest opacity-50">Price</div>
          <div className="text-xl font-black">${listing.pricePerDay}</div>
          <div className={`text-[10px] ${current.subtext}`}>per day</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-xl bg-white/5 border border-white/10 p-3">
          <div className={`text-[9px] uppercase tracking-widest ${current.subtext}`}>Seats</div>
          <div className="text-sm font-bold">{listing.seats}</div>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-3">
          <div className={`text-[9px] uppercase tracking-widest ${current.subtext}`}>Fuel</div>
          <div className="text-sm font-bold">{listing.fuel}</div>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-3">
          <div className={`text-[9px] uppercase tracking-widest ${current.subtext}`}>Transmission</div>
          <div className="text-sm font-bold">{listing.transmission}</div>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-3">
          <div className={`text-[9px] uppercase tracking-widest ${current.subtext}`}>Updated</div>
          <div className="text-sm font-bold">{listing.updatedAt}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.16em] ${approvalBadge(listing.approval)}`}>
          {listing.approval}
        </span>
        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.16em] ${availabilityBadge(listing.status)}`}>
          {listing.status}
        </span>
      </div>
    </div>
  );
}
