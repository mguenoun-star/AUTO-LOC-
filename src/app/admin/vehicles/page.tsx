'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, CircleOff, PencilLine, Plus, RefreshCw, Search, Trash2, XCircle } from 'lucide-react';
import AdminTable from '@/components/admin/AdminTable';
import { AdminEmptyState, AdminErrorState, AdminLoadingState } from '@/components/admin/AdminStates';
import { useTheme } from '@/context/ThemeContext';
import { createAdminVehicle, deleteAdminVehicle, listAdminVehicles, setVehicleApproval, setVehicleAvailability, updateAdminVehicle } from '@/services/adminApi';
import { AdminVehicle } from '@/types';

interface VehicleForm { name: string; type: string; image: string; pricePerDay: string; seats: string; fuel: string; transmission: string; }
const emptyForm: VehicleForm = { name: '', type: '', image: '', pricePerDay: '', seats: '', fuel: '', transmission: '' };

function approvalBadge(approval: AdminVehicle['approval']) {
  if (approval === 'approved') return 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/20';
  if (approval === 'rejected') return 'bg-red-500/20 text-red-300 border border-red-400/20';
  return 'bg-amber-500/20 text-amber-300 border border-amber-400/20';
}
function availabilityBadge(status: AdminVehicle['status']) {
  if (status === 'available') return 'bg-blue-500/20 text-blue-300 border border-blue-400/20';
  return 'bg-zinc-500/20 text-zinc-300 border border-zinc-400/20';
}

export default function AdminVehicles() {
  const { current } = useTheme();
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [form, setForm] = useState<VehicleForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const emptyHint = useMemo(() => search.trim().length > 0 ? `No vehicles found for "${search}".` : 'No vehicles yet. Add your first vehicle listing above.', [search]);

  const loadVehicles = async (term = search) => {
    setLoading(true); setError(null);
    try { const r = await listAdminVehicles(term); setVehicles(r.data); }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to load vehicles'); }
    finally { setLoading(false); setBusyId(null); }
  };

  useEffect(() => {
    const t = window.setTimeout(() => { void loadVehicles(search); }, 250);
    return () => { window.clearTimeout(t); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const resetForm = () => { setForm(emptyForm); setEditingId(null); };
  const startEdit = (v: AdminVehicle) => {
    setEditingId(v.id);
    setForm({ name: v.name, type: v.type, image: v.image, pricePerDay: String(v.pricePerDay), seats: String(v.seats), fuel: v.fuel, transmission: v.transmission });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pricePerDay = Number(form.pricePerDay); const seats = Number(form.seats);
    if (!form.name.trim() || !form.type.trim() || !form.image.trim() || !form.fuel.trim() || !form.transmission.trim()) { setError('Please fill all required fields.'); return; }
    if (!Number.isFinite(pricePerDay) || !Number.isFinite(seats) || pricePerDay <= 0 || seats <= 0) { setError('Price and seats must be positive numbers.'); return; }
    setError(null); setBusyId(editingId ?? 'create');
    try {
      const n = { name: form.name.trim(), type: form.type.trim(), image: form.image.trim(), pricePerDay, seats, fuel: form.fuel.trim(), transmission: form.transmission.trim() };
      if (editingId) { await updateAdminVehicle(editingId, n); }
      else { await createAdminVehicle({ ...n, status: 'available', approval: 'pending' }); }
      resetForm(); await loadVehicles(search);
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to save vehicle'); setBusyId(null); }
  };

  const handleDelete = async (v: AdminVehicle) => {
    if (!window.confirm(`Delete ${v.name}? Cannot be undone.`)) return;
    setBusyId(v.id); setError(null);
    try { await deleteAdminVehicle(v.id); if (editingId === v.id) resetForm(); await loadVehicles(search); }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to delete'); setBusyId(null); }
  };

  const handleApproval = async (id: string, approval: AdminVehicle['approval']) => {
    setBusyId(id); setError(null);
    try { await setVehicleApproval(id, approval); await loadVehicles(search); }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to update approval'); setBusyId(null); }
  };

  const handleAvailability = async (v: AdminVehicle) => {
    setBusyId(v.id); setError(null);
    try { await setVehicleAvailability(v.id, v.status === 'available' ? 'unavailable' : 'available'); await loadVehicles(search); }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to update availability'); setBusyId(null); }
  };

  const formFields = [
    { key: 'name', label: 'Name', placeholder: 'BMW 5 Series' },
    { key: 'type', label: 'Type', placeholder: 'Sedan' },
    { key: 'image', label: 'Image URL', placeholder: 'https://...' },
    { key: 'pricePerDay', label: 'Price / Day', placeholder: '89', type: 'number' },
    { key: 'seats', label: 'Seats', placeholder: '5', type: 'number' },
    { key: 'fuel', label: 'Fuel', placeholder: 'Petrol' },
    { key: 'transmission', label: 'Transmission', placeholder: 'Auto' },
  ];

  return (
    <section className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Vehicles</h1>
          <p className={`${current.subtext} text-sm sm:text-base`}>Add/edit vehicles, approve or reject listings, and control availability.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative min-w-0 sm:w-80">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by id, vehicle, or type"
              className={`w-full rounded-2xl border ${current.card} py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500/50`} />
          </div>
          <button type="button" onClick={() => void loadVehicles(search)}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl border ${current.card} px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all`}>
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className={`rounded-[1.75rem] border ${current.card} p-5 sm:p-6 space-y-5`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-lg font-black uppercase tracking-tight">{editingId ? `Edit ${editingId}` : 'Add Vehicle'}</h2>
          {editingId && (
            <button type="button" onClick={resetForm} className={`inline-flex items-center gap-1 rounded-xl border ${current.card} px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em]`}>
              <XCircle className="w-3.5 h-3.5" /> Cancel Edit
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {formFields.map((field) => (
            <div key={field.key} className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">{field.label}</label>
              <input type={field.type ?? 'text'} value={form[field.key as keyof VehicleForm]}
                onChange={(e) => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className={`w-full rounded-xl border ${current.card} px-3 py-2.5 text-sm outline-none focus:border-blue-500/50`} />
            </div>
          ))}
        </div>
        <button type="submit" disabled={busyId !== null}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white">
          <Plus className="w-4 h-4" /> {editingId ? 'Save Changes' : 'Add Vehicle'}
        </button>
      </form>

      {loading && <AdminLoadingState title="Loading Vehicles" hint="Fetching listings and approval states." />}
      {!loading && error && <AdminErrorState title="Vehicles Error" hint={error} />}
      {!loading && !error && vehicles.length === 0 && <AdminEmptyState title="No Vehicles Found" hint={emptyHint} />}
      {!loading && !error && vehicles.length > 0 && (
        <AdminTable columns={['Vehicle', 'Specs', 'Approval', 'Availability', 'Updated', 'Actions']} minWidth="min-w-[980px]">
          {vehicles.map((vehicle) => {
            const isBusy = busyId === vehicle.id;
            return (
              <tr key={vehicle.id} className="border-b border-white/5 align-top">
                <td className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <img src={vehicle.image} alt={vehicle.name} className="w-20 h-14 rounded-xl object-cover border border-white/10" referrerPolicy="no-referrer" />
                    <div><p className="font-bold text-sm">{vehicle.name}</p><p className="text-[11px] opacity-50">{vehicle.id}</p></div>
                  </div>
                </td>
                <td className="px-5 py-4 text-xs">
                  <p>{vehicle.type}</p>
                  <p className="opacity-60 mt-1">${vehicle.pricePerDay}/day | {vehicle.seats} seats</p>
                  <p className="opacity-50 mt-1">{vehicle.fuel} | {vehicle.transmission}</p>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.16em] ${approvalBadge(vehicle.approval)}`}>{vehicle.approval}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.16em] ${availabilityBadge(vehicle.status)}`}>{vehicle.status}</span>
                </td>
                <td className="px-5 py-4 text-xs opacity-70">{vehicle.updatedAt}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" disabled={isBusy} onClick={() => startEdit(vehicle)} className={`inline-flex items-center gap-1 rounded-xl border ${current.card} px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] disabled:opacity-60`}><PencilLine className="w-3.5 h-3.5" /> Edit</button>
                    <button type="button" disabled={isBusy} onClick={() => void handleApproval(vehicle.id, 'approved')} className="inline-flex items-center gap-1 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-200 disabled:opacity-60"><CheckCircle2 className="w-3.5 h-3.5" /> Approve</button>
                    <button type="button" disabled={isBusy} onClick={() => void handleApproval(vehicle.id, 'rejected')} className="inline-flex items-center gap-1 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-red-200 disabled:opacity-60"><XCircle className="w-3.5 h-3.5" /> Reject</button>
                    <button type="button" disabled={isBusy} onClick={() => void handleAvailability(vehicle)} className="inline-flex items-center gap-1 rounded-xl border border-blue-400/30 bg-blue-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-blue-200 disabled:opacity-60"><CircleOff className="w-3.5 h-3.5" /> {vehicle.status === 'available' ? 'Set Unavailable' : 'Set Available'}</button>
                    <button type="button" disabled={isBusy} onClick={() => void handleDelete(vehicle)} className="inline-flex items-center gap-1 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-red-200 disabled:opacity-60"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
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
