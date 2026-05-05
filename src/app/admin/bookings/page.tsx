'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Ban, PencilLine, RefreshCw, Save, Search, XCircle } from 'lucide-react';
import AdminTable from '@/components/admin/AdminTable';
import { AdminEmptyState, AdminErrorState, AdminLoadingState } from '@/components/admin/AdminStates';
import { useTheme } from '@/context/ThemeContext';
import { cancelAdminBooking, listAdminBookings, updateAdminBooking } from '@/services/adminApi';
import { AdminBooking, BookingStatus } from '@/types';

const statusFilters: Array<BookingStatus | 'all'> = ['all', 'pending', 'confirmed', 'ongoing', 'completed', 'cancelled'];

function statusBadge(status: AdminBooking['status']) {
  if (status === 'pending') return 'bg-amber-500/20 text-amber-300 border border-amber-400/20';
  if (status === 'confirmed') return 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/20';
  if (status === 'ongoing') return 'bg-blue-500/20 text-blue-300 border border-blue-400/20';
  if (status === 'completed') return 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/20';
  return 'bg-red-500/20 text-red-300 border border-red-400/20';
}

export default function AdminBookings() {
  const { current } = useTheme();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<BookingStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ startDate: string; endDate: string; status: BookingStatus }>({
    startDate: '', endDate: '', status: 'pending',
  });

  const filteredBookings = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return bookings;
    return bookings.filter((item) =>
      `${item.id} ${item.userName} ${item.userEmail} ${item.vehicleName}`.toLowerCase().includes(keyword)
    );
  }, [bookings, search]);

  const emptyHint = useMemo(() => {
    if (search.trim().length > 0) return `No bookings found for "${search}".`;
    if (status !== 'all') return `No bookings with status "${status}".`;
    return 'No bookings available yet.';
  }, [search, status]);

  const loadBookings = async (selectedStatus = status) => {
    setLoading(true); setError(null);
    try { const r = await listAdminBookings(selectedStatus); setBookings(r.data); }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to load bookings'); }
    finally { setLoading(false); setBusyId(null); }
  };

  useEffect(() => { void loadBookings(status); }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  const startEdit = (b: AdminBooking) => { setEditingId(b.id); setDraft({ startDate: b.startDate, endDate: b.endDate, status: b.status }); };

  const handleSave = async () => {
    if (!editingId) return;
    if (!draft.startDate || !draft.endDate) { setError('Please provide both start and end dates.'); return; }
    setBusyId(editingId); setError(null);
    try {
      await updateAdminBooking(editingId, { startDate: draft.startDate, endDate: draft.endDate, status: draft.status });
      setEditingId(null); await loadBookings(status);
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to modify booking'); setBusyId(null); }
  };

  const handleCancelBooking = async (booking: AdminBooking) => {
    if (!window.confirm(`Cancel booking ${booking.id}?`)) return;
    setBusyId(booking.id); setError(null);
    try {
      await cancelAdminBooking(booking.id);
      if (editingId === booking.id) setEditingId(null);
      await loadBookings(status);
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to cancel booking'); setBusyId(null); }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Bookings</h1>
          <p className={`${current.subtext} text-sm sm:text-base`}>View all bookings, filter by status, and cancel or modify reservations.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          <div className="relative min-w-0 sm:w-72">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search booking, user, vehicle"
              className={`w-full rounded-2xl border ${current.card} py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500/50`} />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value as BookingStatus | 'all')}
            className={`rounded-2xl border ${current.card} px-4 py-3 text-xs font-black uppercase tracking-[0.16em] outline-none focus:border-blue-500/50`}>
            {statusFilters.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <button type="button" onClick={() => void loadBookings(status)}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl border ${current.card} px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all`}>
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </header>

      {loading && <AdminLoadingState title="Loading Bookings" hint="Fetching reservation records." />}
      {!loading && error && <AdminErrorState title="Bookings Error" hint={error} />}
      {!loading && !error && filteredBookings.length === 0 && <AdminEmptyState title="No Bookings Found" hint={emptyHint} />}
      {!loading && !error && filteredBookings.length > 0 && (
        <AdminTable columns={['Booking', 'User', 'Vehicle', 'Dates', 'Total', 'Status', 'Actions']} minWidth="min-w-[1060px]">
          {filteredBookings.map((booking) => {
            const isEditing = editingId === booking.id;
            const isBusy = busyId === booking.id;
            return (
              <tr key={booking.id} className="border-b border-white/5 align-top">
                <td className="px-5 py-4">
                  <p className="font-bold text-sm">{booking.id}</p>
                  <p className="text-[11px] opacity-50">Created {booking.createdAt}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold">{booking.userName}</p>
                  <p className="text-[11px] opacity-50">{booking.userEmail}</p>
                </td>
                <td className="px-5 py-4 text-sm">{booking.vehicleName}</td>
                <td className="px-5 py-4">
                  {isEditing ? (
                    <div className="flex flex-col gap-2 min-w-40">
                      <input type="date" value={draft.startDate}
                        onChange={(e) => setDraft(p => ({ ...p, startDate: e.target.value }))}
                        className={`rounded-xl border ${current.card} px-2.5 py-2 text-xs outline-none focus:border-blue-500/50`} />
                      <input type="date" value={draft.endDate}
                        onChange={(e) => setDraft(p => ({ ...p, endDate: e.target.value }))}
                        className={`rounded-xl border ${current.card} px-2.5 py-2 text-xs outline-none focus:border-blue-500/50`} />
                    </div>
                  ) : (
                    <p className="text-xs opacity-80">{booking.startDate} to {booking.endDate}</p>
                  )}
                </td>
                <td className="px-5 py-4 font-black text-sm">${booking.total}</td>
                <td className="px-5 py-4">
                  {isEditing ? (
                    <select value={draft.status}
                      onChange={(e) => setDraft(p => ({ ...p, status: e.target.value as BookingStatus }))}
                      className={`rounded-xl border ${current.card} px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] outline-none focus:border-blue-500/50`}>
                      {statusFilters.filter((item): item is BookingStatus => item !== 'all').map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.16em] ${statusBadge(booking.status)}`}>
                      {booking.status}
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    {isEditing ? (
                      <>
                        <button type="button" disabled={isBusy} onClick={() => void handleSave()}
                          className="inline-flex items-center gap-1 rounded-xl bg-blue-600 hover:bg-blue-500 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white disabled:opacity-60">
                          <Save className="w-3.5 h-3.5" /> Save
                        </button>
                        <button type="button" disabled={isBusy} onClick={() => setEditingId(null)}
                          className={`inline-flex items-center gap-1 rounded-xl border ${current.card} px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] disabled:opacity-60`}>
                          <XCircle className="w-3.5 h-3.5" /> Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="button" disabled={isBusy} onClick={() => startEdit(booking)}
                          className={`inline-flex items-center gap-1 rounded-xl border ${current.card} px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] disabled:opacity-60`}>
                          <PencilLine className="w-3.5 h-3.5" /> Modify
                        </button>
                        <button type="button" disabled={isBusy || booking.status === 'cancelled'} onClick={() => void handleCancelBooking(booking)}
                          className="inline-flex items-center gap-1 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-red-200 disabled:opacity-60">
                          <Ban className="w-3.5 h-3.5" /> Cancel
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </AdminTable>
      )}
    </section>
  );
}
