'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarClock, CarFront, Clock3, RefreshCw, Users } from 'lucide-react';
import AdminTable from '@/components/admin/AdminTable';
import { AdminEmptyState, AdminErrorState, AdminLoadingState } from '@/components/admin/AdminStates';
import { useTheme } from '@/context/ThemeContext';
import { getAdminDashboard } from '@/services/adminApi';
import { AdminBooking, AdminDashboardPayload } from '@/types';

function bookingStatusClass(status: AdminBooking['status']) {
  if (status === 'pending') return 'bg-amber-500/20 text-amber-300 border border-amber-400/20';
  if (status === 'cancelled') return 'bg-red-500/20 text-red-300 border border-red-400/20';
  if (status === 'completed') return 'bg-green-500/20 text-green-300 border border-green-400/20';
  if (status === 'ongoing') return 'bg-blue-500/20 text-blue-300 border border-blue-400/20';
  return 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/20';
}

export default function AdminDashboard() {
  const { current } = useTheme();
  const [data, setData] = useState<AdminDashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAdminDashboard();
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadDashboard(); }, [loadDashboard]);

  if (loading) {
    return (
      <AdminLoadingState
        title="Loading dashboard"
        hint="Fetching the latest stats and booking activity."
      />
    );
  }

  if (error) {
    return (
      <AdminErrorState
        title="Unable to load dashboard"
        hint={error}
      />
    );
  }

  if (!data) {
    return (
      <AdminEmptyState
        title="No dashboard data"
        hint="No stats or bookings are available yet."
      />
    );
  }

  return (
    <section className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-2">Admin Dashboard</h1>
          <p className={`${current.subtext} text-sm sm:text-base`}>Overview of users, bookings, vehicles, and the latest reservation activity.</p>
        </div>
        <button
          type="button"
          onClick={() => void loadDashboard()}
          className="px-4 py-2 rounded-lg border border-current/20 hover:bg-current hover:text-black transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl border border-current/10 bg-current/5"
        >
          <Users className="w-8 h-8 mb-4 text-blue-500" />
          <div className="text-3xl font-black mb-1">{data.stats.totalUsers}</div>
          <div className={`${current.subtext} text-sm`}>Total Users</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-xl border border-current/10 bg-current/5"
        >
          <Users className="w-8 h-8 mb-4 text-green-500" />
          <div className="text-3xl font-black mb-1">{data.stats.activeUsers}</div>
          <div className={`${current.subtext} text-sm`}>Active Users</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-xl border border-current/10 bg-current/5"
        >
          <CalendarClock className="w-8 h-8 mb-4 text-purple-500" />
          <div className="text-3xl font-black mb-1">{data.stats.totalBookings}</div>
          <div className={`${current.subtext} text-sm`}>Total Bookings</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-xl border border-current/10 bg-current/5"
        >
          <Clock3 className="w-8 h-8 mb-4 text-amber-500" />
          <div className="text-3xl font-black mb-1">{data.stats.pendingBookings}</div>
          <div className={`${current.subtext} text-sm`}>Pending Bookings</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-xl border border-current/10 bg-current/5"
        >
          <CarFront className="w-8 h-8 mb-4 text-cyan-500" />
          <div className="text-3xl font-black mb-1">{data.stats.totalVehicles}</div>
          <div className={`${current.subtext} text-sm`}>Total Vehicles</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-xl border border-current/10 bg-current/5"
        >
          <CarFront className="w-8 h-8 mb-4 text-orange-500" />
          <div className="text-3xl font-black mb-1">{data.stats.pendingListings}</div>
          <div className={`${current.subtext} text-sm`}>Pending Listings</div>
        </motion.div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tighter">Recent Bookings</h2>
        <AdminTable columns={['User', 'Vehicle', 'Dates', 'Total', 'Status', 'Created']}>
          {data.recentBookings.map((booking) => (
            <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="px-5 py-4">
                <p className="font-semibold text-sm">{booking.userName}</p>
                <p className="text-[11px] opacity-50">{booking.userEmail}</p>
              </td>
              <td className="px-5 py-4 text-sm font-semibold">{booking.vehicleName}</td>
              <td className="px-5 py-4 text-xs opacity-80">{booking.startDate} - {booking.endDate}</td>
              <td className="px-5 py-4 font-black text-sm">${booking.total}</td>
              <td className="px-5 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${bookingStatusClass(booking.status)}`}>
                  {booking.status}
                </span>
              </td>
              <td className="px-5 py-4 text-xs opacity-80">{booking.createdAt}</td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </section>
  );
}