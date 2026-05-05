'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, UploadCloud, CarFront, DollarSign, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { createAdminVehicle } from '@/services/adminApi';
import { AdminVehicle } from '@/types';
import HostListingCard from './HostListingCard';
import { hostPerks, hostSteps } from '../utils/hostData';

interface HostFormState {
  name: string;
  type: string;
  image: string;
  pricePerDay: string;
  seats: string;
  fuel: string;
  transmission: string;
}

const emptyForm: HostFormState = {
  name: '',
  type: '',
  image: '',
  pricePerDay: '',
  seats: '',
  fuel: '',
  transmission: '',
};

const demoForm: HostFormState = {
  name: 'Aston Martin Vantage',
  type: 'Grand Tourer',
  image: 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=1200',
  pricePerDay: '240',
  seats: '2',
  fuel: 'Petrol',
  transmission: 'Auto',
};

function formatMoney(value: number) {
  return value.toLocaleString('en-US');
}

export default function HostPage() {
  const { current } = useTheme();
  const [form, setForm] = useState<HostFormState>(emptyForm);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [listings, setListings] = useState<AdminVehicle[]>([]);
  const [lastListing, setLastListing] = useState<AdminVehicle | null>(null);

  const priceValue = Number(form.pricePerDay);
  const seatsValue = Number(form.seats);
  const hasImage = form.image.trim().length > 0;

  const earningsEstimate = useMemo(() => {
    if (!Number.isFinite(priceValue) || priceValue <= 0) return 0;
    return Math.round(priceValue * 18);
  }, [priceValue]);

  const handleChange = (key: keyof HostFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = {
      name: form.name.trim(),
      type: form.type.trim(),
      image: form.image.trim(),
      fuel: form.fuel.trim(),
      transmission: form.transmission.trim(),
    };

    if (!trimmed.name || !trimmed.type || !trimmed.image || !trimmed.fuel || !trimmed.transmission) {
      setError('Please fill all required fields.');
      setStatus('idle');
      return;
    }

    if (!Number.isFinite(priceValue) || priceValue <= 0 || !Number.isFinite(seatsValue) || seatsValue <= 0) {
      setError('Price and seats must be positive numbers.');
      setStatus('idle');
      return;
    }

    setStatus('submitting');
    setError(null);

    try {
      const response = await createAdminVehicle({
        name: trimmed.name,
        type: trimmed.type,
        image: trimmed.image,
        pricePerDay: priceValue,
        seats: seatsValue,
        fuel: trimmed.fuel,
        transmission: trimmed.transmission,
        status: 'available',
        approval: 'approved',
      });

      setListings((prev) => [response.data, ...prev]);
      setLastListing(response.data);
      setForm(emptyForm);
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit listing.');
      setStatus('idle');
    }
  };

  const handleReset = () => {
    setForm(emptyForm);
    setStatus('idle');
    setError(null);
  };

  const handleDemoFill = () => {
    setForm(demoForm);
    setStatus('idle');
    setError(null);
  };

  return (
    <main className={`min-h-screen pt-32 pb-24 px-6 ${current.bg} ${current.text} relative overflow-hidden`}>
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-indigo-500/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-[0.24em] text-blue-400 mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" /> Host Program
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter mb-4"
          >
            List your vehicle. Start earning.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`max-w-2xl text-lg ${current.subtext}`}
          >
            Share your car with our premium members. Submit your listing, go live instantly, and earn from every booking.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`lg:col-span-7 rounded-[2.5rem] border ${current.card} p-6 sm:p-10 space-y-8`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">New listing</h2>
                <p className={`text-sm ${current.subtext}`}>Complete every detail to publish instantly.</p>
              </div>
              <button
                type="button"
                onClick={handleDemoFill}
                className="inline-flex items-center gap-2 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 hover:bg-blue-500/20 transition-colors"
              >
                <CarFront className="w-4 h-4" /> Use demo vehicle
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { key: 'name', label: 'Vehicle name', placeholder: 'BMW 5 Series' },
                  { key: 'type', label: 'Type', placeholder: 'Sedan' },
                  { key: 'image', label: 'Hero image URL', placeholder: 'https://...' },
                  { key: 'pricePerDay', label: 'Price per day', placeholder: '95', type: 'number' },
                  { key: 'seats', label: 'Seats', placeholder: '5', type: 'number' },
                  { key: 'fuel', label: 'Fuel', placeholder: 'Petrol' },
                  { key: 'transmission', label: 'Transmission', placeholder: 'Auto' },
                ].map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${current.subtext}`}>
                      {field.label}
                    </label>
                    <input
                      type={field.type ?? 'text'}
                      value={form[field.key as keyof HostFormState]}
                      onChange={(event) => handleChange(field.key as keyof HostFormState, event.target.value)}
                      placeholder={field.placeholder}
                      className={`w-full rounded-2xl border ${current.card} px-4 py-3 text-sm outline-none focus:border-blue-500/60 transition-colors`}
                    />
                  </div>
                ))}
              </div>

              {error && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}

              {status === 'success' && lastListing && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-200">Listing {lastListing.id} submitted.</p>
                      <p className="text-xs text-emerald-200/80">Your vehicle is live now and ready to be booked.</p>
                    </div>
                  </div>
                  <Link
                    href="/fleet"
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200 hover:text-emerald-100"
                  >
                    View fleet
                  </Link>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className={`flex-1 inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] ${current.btn} transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {status === 'submitting' ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" /> Submit listing
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className={`inline-flex items-center justify-center rounded-2xl border ${current.card} px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-colors`}
                >
                  Reset
                </button>
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className={`rounded-[2.5rem] border ${current.card} p-6 space-y-6`}>
              <div className="aspect-[16/10] rounded-[2rem] overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                {hasImage ? (
                  <img
                    src={form.image}
                    alt={form.name || 'Vehicle preview'}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className={`text-[10px] font-black uppercase tracking-[0.3em] ${current.subtext}`}>
                    Image preview
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${current.subtext}`}>Preview</p>
                    <h3 className="text-xl font-black uppercase tracking-tight">{form.name || 'Vehicle name'}</h3>
                    <p className={`text-xs ${current.subtext}`}>{form.type || 'Vehicle type'}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-widest">
                    ${Number.isFinite(priceValue) && priceValue > 0 ? priceValue : 0}/day
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <div className={`text-[9px] uppercase tracking-widest ${current.subtext}`}>Seats</div>
                    <div className="text-sm font-bold">{Number.isFinite(seatsValue) && seatsValue > 0 ? seatsValue : '--'}</div>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <div className={`text-[9px] uppercase tracking-widest ${current.subtext}`}>Fuel</div>
                    <div className="text-sm font-bold">{form.fuel || '--'}</div>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <div className={`text-[9px] uppercase tracking-widest ${current.subtext}`}>Transmission</div>
                    <div className="text-sm font-bold">{form.transmission || '--'}</div>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <div className={`text-[9px] uppercase tracking-widest ${current.subtext}`}>Estimate</div>
                    <div className="text-sm font-bold">${earningsEstimate ? formatMoney(earningsEstimate) : '--'}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`rounded-[2.5rem] border ${current.card} p-6 space-y-5`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${current.subtext}`}>Estimated monthly</p>
                  <p className="text-3xl font-black">${earningsEstimate ? formatMoney(earningsEstimate) : 0}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-300" />
                </div>
              </div>
              <p className={`text-xs ${current.subtext}`}>
                Estimates assume 18 booked days per month. Actual earnings depend on demand and approval.
              </p>
            </div>

            <div className={`rounded-[2.5rem] border ${current.card} p-6 space-y-5`}>
              <h4 className="text-sm font-black uppercase tracking-[0.2em]">How it works</h4>
              <div className="space-y-4">
                {hostSteps.map((step, index) => (
                  <div key={step.title} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[11px] font-black">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{step.title}</div>
                      <div className={`text-xs ${current.subtext}`}>{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-[2.5rem] border ${current.card} p-6 space-y-4`}>
              <h4 className="text-sm font-black uppercase tracking-[0.2em]">Why host with us</h4>
              <div className="grid grid-cols-1 gap-4">
                {hostPerks.map((perk) => (
                  <div key={perk.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <perk.icon className="w-5 h-5 text-blue-300" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">{perk.title}</div>
                      <div className={`text-xs ${current.subtext}`}>{perk.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <section className="mt-16 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight">Recent listings</h2>
              <p className={`text-sm ${current.subtext}`}>New submissions appear here with their current approval status.</p>
            </div>
            <Link
              href="/fleet"
              className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 hover:text-blue-300"
            >
              View fleet
            </Link>
          </div>

          {listings.length === 0 ? (
            <div className={`rounded-[2rem] border ${current.card} p-10 text-center`}>
              <CarFront className="w-10 h-10 mx-auto text-blue-400 mb-4" />
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">No listings yet</h3>
              <p className={`text-sm ${current.subtext}`}>
                Submit your first vehicle to see it appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {listings.map((listing) => (
                <HostListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
