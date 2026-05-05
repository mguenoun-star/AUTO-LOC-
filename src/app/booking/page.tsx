'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft, Calendar, ShieldCheck,
  Info, MapPin, CheckCircle2
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { listAdminVehicles } from '@/services/adminApi';
import { createUserReservation } from '@/services/reservationStore';
import { Car } from '@/types';
import { hasVerifiedLicense } from '@/lib/licenseGate';
import Link from 'next/link';

const fallbackCar: Car = {
  id: 'demo-car',
  name: 'Porsche 911 GT3',
  type: 'Sport',
  image: 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&cs=tinysrgb&w=1200',
  pricePerDay: 450,
  seats: 2,
  fuel: 'Petrol',
  power: '503 HP',
  transmission: 'Auto',
};

const parseDuration = (value: string) => {
  const cleaned = value.trim();
  if (!cleaned) return { startDate: 'Flexible', endDate: 'Flexible' };
  const parts = cleaned.split(/\s*-\s*/);
  if (parts.length >= 2) {
    return { startDate: parts[0].trim(), endDate: parts.slice(1).join(' - ').trim() };
  }
  return { startDate: cleaned, endDate: 'Flexible' };
};

function BookingContent() {
  const { current } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const carId = searchParams?.get('car');
  const [step, setStep] = useState(1);
  const [car, setCar] = useState<Car>(fallbackCar);
  const [pickupLocation, setPickupLocation] = useState('London Luxury Garage');
  const [duration, setDuration] = useState('Oct 20 - Oct 22');
  const [loadingCar, setLoadingCar] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    const loadCar = async () => {
      setLoadingCar(true);
      try {
        const response = await listAdminVehicles();
        const mapped = response.data.map((vehicle) => ({
          id: vehicle.id,
          name: vehicle.name,
          type: vehicle.type,
          image: vehicle.image,
          pricePerDay: vehicle.pricePerDay,
          seats: vehicle.seats,
          fuel: vehicle.fuel,
          power: 'N/A',
          transmission: vehicle.transmission,
        }));
        const selected = carId ? mapped.find((item) => item.id === carId) : mapped[0];
        if (active && selected) setCar(selected);
      } catch {
        if (active) setCar(fallbackCar);
      } finally {
        if (active) setLoadingCar(false);
      }
    };
    void loadCar();
    return () => { active = false; };
  }, [carId]);

  const baseDays = useMemo(() => 2, []);
  const totalCost = useMemo(() => car.pricePerDay * baseDays + 45, [car.pricePerDay, baseDays]);

  const handleNext = async () => {
    if (step < 2) {
      if (car.id === 'demo-car') {
        alert('Select a real vehicle from the Fleet page first.');
        return;
      }
      if (!user?.id) {
        alert('Sign in to complete a booking.');
        router.push('/login');
        return;
      }
      if (!hasVerifiedLicense(user)) {
        alert('Upload your driver license on your dashboard. It must be verified by an admin before you can book.');
        return;
      }
      setSubmitting(true);
      try {
        const { startDate, endDate } = parseDuration(duration);
        const userId = user.id;
        await createUserReservation(userId, car.id, {
          startDate,
          endDate,
          total: totalCost,
          status: 'ongoing',
        });
        setStep(step + 1);
      } catch (err) {
        console.error('Failed to create reservation:', err);
      } finally {
        setSubmitting(false);
      }
    } else {
      router.push('/dashboard');
    }
  };

  const bookingBlocked = user && !hasVerifiedLicense(user);

  return (
    <div className={`min-h-screen pt-32 pb-20 px-6 ${current.bg} ${current.text}`}>
      <div className="max-w-5xl mx-auto">
        {!user?.id && step === 1 && (
          <div className="mb-8 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-sm text-amber-100">
            Sign in required to reserve.{' '}
            <Link href="/login" className="underline font-bold">
              Login
            </Link>
          </div>
        )}
        {bookingBlocked && step === 1 && (
          <div className="mb-8 rounded-2xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-sm text-red-100">
            Upload your permit (photo/PDF via Cloudinary) on your dashboard. An administrator must approve it before booking.{' '}
            <Link href="/dashboard" className="underline font-bold">
              Go to Dashboard
            </Link>
          </div>
        )}
        <button onClick={() => router.back()} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 mb-12 transition-all">
          <ChevronLeft className="w-4 h-4" /> Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-10">
            <header>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4">Request your<br/>Reservation</h1>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                {[1, 2].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${step >= s ? 'bg-blue-600 text-white' : 'bg-white/5 border border-white/10'}`}>{s}</div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= s ? 'opacity-100' : 'opacity-30'}`}>{s === 1 ? 'Details' : 'Confirmation'}</span>
                    {s < 2 && <div className="w-8 h-px bg-white/10" />}
                  </div>
                ))}
              </div>
            </header>

            {step === 1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className={`p-4 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border ${current.card} space-y-8`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Pickup Location</label>
                      <div className="relative group">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                        <input
                          type="text"
                          value={pickupLocation}
                          onChange={(event) => setPickupLocation(event.target.value)}
                          placeholder="London Luxury Garage"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm outline-none focus:border-blue-500/50 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Duration</label>
                      <div className="relative group">
                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                        <input
                          type="text"
                          value={duration}
                          onChange={(event) => setDuration(event.target.value)}
                          placeholder="Oct 20 - Oct 22"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm outline-none focus:border-blue-500/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-tight">Additional Services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['Full Insurance', 'Private Driver', 'Airport Delivery', 'GPS Luxury Pack'].map(service => (
                        <div key={service} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                          <span className="text-xs font-bold">{service}</span>
                          <div className="w-5 h-5 rounded-md border border-white/20 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
                <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-8 animate-pulse">
                  <CheckCircle2 className="w-12 h-12 text-blue-500" />
                </div>
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Request Sent!</h2>
                <p className={`${current.subtext} mb-12 max-w-md mx-auto`}>Our team is reviewing your request. You will receive a <b>confirmation SMS and Email</b> within 15 minutes.</p>
              </motion.div>
            )}

            <button
              onClick={handleNext}
              disabled={
                submitting ||
                (step === 1 &&
                  ((!user?.id ||
                    !!bookingBlocked ||
                    car.id === 'demo-car')))
              }
              className={`w-full py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] transition-all shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${current.btn}`}
            >
              {submitting ? 'Sending...' : step === 2 ? 'Go to Dashboard' : 'Send Reservation Request'}
            </button>
          </div>

          <div className="lg:col-span-4">
            <div className={`sticky top-32 p-8 rounded-[2.5rem] border ${current.card} space-y-8`}>
              <div className="aspect-video rounded-3xl overflow-hidden mb-8 border border-white/5 shadow-2xl">
                <img src={car.image} alt={car.name} className="w-full h-full object-cover grayscale-[0.3]" />
              </div>
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Selected Vehicle</h4>
                    <p className="text-xl font-bold uppercase tracking-tight">{car.name}</p>
                    {loadingCar && (
                      <p className={`text-[10px] uppercase tracking-widest mt-2 ${current.subtext}`}>Loading details...</p>
                    )}
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                  </div>
                </div>
                <div className="space-y-4 pt-6 border-t border-white/5">
                  <div className="flex justify-between text-sm font-bold opacity-60"><span>Base Fare ({baseDays} Days)</span><span>${car.pricePerDay * baseDays}</span></div>
                  <div className="flex justify-between text-sm font-bold opacity-60"><span>Priority Service</span><span>$45</span></div>
                  <div className="flex justify-between text-sm font-bold opacity-60"><span>Insurance</span><span className="text-green-500">Free</span></div>
                  <div className="flex justify-between pt-4 border-t border-white/10">
                    <span className="text-sm font-black uppercase tracking-widest">Total cost</span>
                    <span className="text-2xl font-black tracking-tighter">${totalCost}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-4">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
                <p className="text-[10px] font-semibold leading-relaxed opacity-60 italic">Free cancellation up to 24 hours before pickup.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Booking() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}
