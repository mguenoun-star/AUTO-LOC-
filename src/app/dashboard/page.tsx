'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  User, Mail, Phone, ShieldCheck,
  Calendar, CreditCard, ChevronRight,
  TrendingUp, Activity, FileText, Upload, CarFront
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Reservation } from '@/types';
import { listUserReservations } from '@/services/reservationStore';
import { uploadLicenseToCloudinary } from '@/lib/cloudinaryUpload';
import { saveMyPermisPicture } from '@/services/profileService';
import { hasVerifiedLicense } from '@/lib/licenseGate';

export default function Dashboard() {
  const { current } = useTheme();
  const { user, refreshProfile } = useAuth();
  const [licenseBusy, setLicenseBusy] = useState(false);
  const [licenseError, setLicenseError] = useState<string | null>(null);
  const verified = user ? hasVerifiedLicense(user) : false;
  const hasPermisUpload = Boolean(user?.permis_picture?.trim());
  const licenseLabel = verified
    ? 'Verified'
    : hasPermisUpload
      ? 'Pending admin verification'
      : 'Not uploaded';
  const licenseStatusClass =
    verified ? 'text-green-500' : hasPermisUpload ? 'text-amber-500' : 'text-red-500';
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const handleLicenseFile = async (file: File | null) => {
    if (!file || !user?.id) return;
    setLicenseBusy(true);
    setLicenseError(null);
    try {
      const url = await uploadLicenseToCloudinary(file);
      await saveMyPermisPicture(user.id, url);
      await refreshProfile();
    } catch (e) {
      setLicenseError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setLicenseBusy(false);
    }
  };

  useEffect(() => {
    const loadReservations = async () => {
      const userId = user?.id ?? null;
      const stored = await listUserReservations(userId);
      setReservations(stored);
    };
    void loadReservations();
  }, [user?.id]);

  const displayName = user?.name || 'User';
  const displayEmail = user?.email || '';
  const displayPhone = user?.phone || '';

  return (
    <div className={`min-h-screen pt-32 pb-20 px-6 ${current.bg} ${current.text}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border ${current.card} relative overflow-hidden`}
          >
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${current.accent}`} />
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full border-4 border-current/10 p-1 mb-6">
                <div className="w-full h-full rounded-full bg-blue-500 overflow-hidden">
                  <img
                    src={user?.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"}
                    alt={displayName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <h2 className="text-3xl font-black tracking-tight mb-2 uppercase">{displayName}</h2>
              {verified && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full mb-8">
                <ShieldCheck className="w-3 h-3 text-green-500" />
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">License verified</span>
              </div>
              )}
              {!verified && (
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full mb-8">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                  Permit required for booking
                </span>
              </div>
              )}
              <div className="w-full space-y-6 text-left">
                {[
                  { label: 'Full Name', value: displayName, Icon: User },
                  { label: 'Email Address', value: displayEmail, Icon: Mail },
                  { label: 'Phone Number', value: displayPhone, Icon: Phone },
                ].map(({ label, value, Icon }) => (
                  <div key={label} className="space-y-1">
                    <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${current.subtext}`}>{label}</span>
                    <div className="flex items-center gap-3 text-sm font-bold">
                      <Icon className="w-4 h-4 opacity-40" /> {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border ${current.card}`}
          >
            <div className="flex items-center gap-3 mb-8">
              <FileText className="w-5 h-5 text-blue-500" />
              <h3 className="text-xl font-bold uppercase tracking-tight">Documents</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-current/5 ${licenseStatusClass}`}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Driver&apos;s license (Cloudinary)</div>
                    <div className={`text-[9px] font-black uppercase tracking-widest ${licenseStatusClass}`}>{licenseLabel}</div>
                    {user?.permis_picture ? (
                      <a
                        href={user.permis_picture}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-[10px] mt-2 inline-block underline ${current.subtext}`}
                      >
                        View uploaded file
                      </a>
                    ) : (
                      <p className={`text-[10px] mt-2 ${current.subtext}`}>Upload a photo or PDF of your permit.</p>
                    )}
                  </div>
                </div>
              </div>
              {licenseError && (
                <p className="text-xs text-red-300">{licenseError}</p>
              )}
              <input
                id="license-upload"
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                disabled={licenseBusy || !user?.id}
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  void handleLicenseFile(file);
                  event.target.value = '';
                }}
              />
              <label
                htmlFor="license-upload"
                className={`w-full mt-4 py-4 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all cursor-pointer ${licenseBusy ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <Upload className="w-4 h-4" /> {licenseBusy ? 'Uploading...' : user?.permis_picture ? 'Replace document' : 'Upload document'}
              </label>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: 'Total Rides', val: String(reservations.length), icon: Activity },
              { label: 'Miles Covered', val: '1,240', icon: TrendingUp },
              { label: 'Club Status', val: 'Gold', icon: ShieldCheck },
              { label: 'Saved', val: '$420', icon: CreditCard },
            ].map((stat, i) => (
              <div key={i} className={`rounded-3xl p-6 border ${current.card} flex flex-col gap-2`}>
                <stat.icon className="w-5 h-5 text-blue-500 mb-2" />
                <span className="text-2xl font-black lowercase tracking-tighter">{stat.val}</span>
                <span className={`text-[9px] font-bold uppercase tracking-[0.2em] ${current.subtext}`}>{stat.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border ${current.card}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-3">
                  <CarFront className="w-4 h-4" /> Host Program
                </div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-2">List Your Vehicle</h3>
                <p className={`${current.subtext} text-sm max-w-xl`}>
                  Turn your car into income. Submit your listing in minutes and get approved fast.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className={`rounded-2xl border ${current.card} px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em]`}>
                  Avg. earning $1,240/mo
                </div>
                <Link
                  href="/host"
                  className={`rounded-2xl px-5 py-4 text-[10px] font-black uppercase tracking-[0.2em] ${current.btn}`}
                >
                  Start Listing
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`flex-1 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border ${current.card}`}
          >
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black uppercase tracking-tight">Reservations</h3>
              <button className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 border-b border-blue-500/30">View All History</button>
            </div>
            <div className="space-y-6">
              {reservations.length === 0 && (
                <div className={`text-center py-10 ${current.subtext}`}>
                  <CarFront className="w-10 h-10 mx-auto text-blue-400 mb-4" />
                  <p className="text-sm">No reservations yet. Book your first ride!</p>
                </div>
              )}
              {reservations.map(res => (
                <div key={res.id} className="group relative rounded-3xl p-6 bg-black/20 border border-white/5 hover:border-blue-500/30 transition-all overflow-hidden">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shadow-2xl">
                      <img src={res.image} alt={res.carName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${current.subtext}`}>Reference</span>
                        <div className="text-sm font-bold">{res.id.slice(0, 12)}</div>
                        <div className="text-lg font-black uppercase tracking-tighter">{res.carName}</div>
                      </div>
                      <div className="space-y-1">
                        <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${current.subtext}`}>Period</span>
                        <div className="flex items-center gap-2 text-sm font-bold">
                          <Calendar className="w-4 h-4 opacity-40" /> {res.startDate} — {res.endDate}
                        </div>
                        <div className="text-[10px] font-bold opacity-60">Total: ${res.total}</div>
                      </div>
                      <div className="flex items-center justify-end md:justify-start lg:justify-end">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          res.status === 'ongoing' ? 'bg-blue-500/20 text-blue-500 border border-blue-500/20' :
                          res.status === 'cancelled' ? 'bg-red-500/20 text-red-500 border border-red-500/20' :
                          'bg-green-500/20 text-green-500 border border-green-500/20'
                        }`}>{res.status}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 opacity-0 group-hover:opacity-40 group-hover:translate-x-2 transition-all cursor-pointer" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
