'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Ban, PencilLine, RefreshCw, Save, Search, Trash2, XCircle } from 'lucide-react';
import AdminTable from '@/components/admin/AdminTable';
import { AdminEmptyState, AdminErrorState, AdminLoadingState } from '@/components/admin/AdminStates';
import { useTheme } from '@/context/ThemeContext';
import { deleteAdminUser, listAdminUsers, setAdminUserSuspended, updateAdminUser } from '@/services/adminApi';
import { AdminRole, AdminUser } from '@/types';

const roleOptions: AdminRole[] = ['admin', 'manager', 'support', 'user'];

function roleBadge(role: AdminRole) {
  if (role === 'admin') return 'bg-blue-500/20 text-blue-300 border border-blue-400/20';
  if (role === 'manager') return 'bg-violet-500/20 text-violet-300 border border-violet-400/20';
  if (role === 'support') return 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/20';
  return 'bg-zinc-500/20 text-zinc-300 border border-zinc-400/20';
}

function statusBadge(status: AdminUser['status']) {
  if (status === 'active') return 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/20';
  return 'bg-amber-500/20 text-amber-300 border border-amber-400/20';
}

export default function AdminUsers() {
  const { current } = useTheme();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ name: string; phone: string; role: AdminRole }>({ name: '', phone: '', role: 'user' });

  const emptyHint = useMemo(() => search.trim().length > 0 ? `No users found for "${search}".` : 'No users available yet.', [search]);

  const loadUsers = async (term = search) => {
    setLoading(true); setError(null);
    try {
      const response = await listAdminUsers(term);
      setUsers(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load users');
    } finally { setLoading(false); setBusyId(null); }
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => { void loadUsers(search); }, 250);
    return () => { window.clearTimeout(timeout); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const startEdit = (user: AdminUser) => { setEditingId(user.id); setDraft({ name: user.name, phone: user.phone, role: user.role }); };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setBusyId(editingId); setError(null);
    try {
      await updateAdminUser(editingId, { name: draft.name.trim(), phone: draft.phone.trim(), role: draft.role });
      setEditingId(null);
      await loadUsers(search);
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to update user'); setBusyId(null); }
  };

  const handleSuspend = async (user: AdminUser) => {
    const willSuspend = user.status !== 'suspended';
    if (!window.confirm(willSuspend ? `Suspend ${user.name}?` : `Reactivate ${user.name}?`)) return;
    setBusyId(user.id); setError(null);
    try { await setAdminUserSuspended(user.id, willSuspend); await loadUsers(search); }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to update status'); setBusyId(null); }
  };

  const handleDelete = async (user: AdminUser) => {
    if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return;
    setBusyId(user.id); setError(null);
    try {
      await deleteAdminUser(user.id);
      if (editingId === user.id) setEditingId(null);
      await loadUsers(search);
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to delete user'); setBusyId(null); }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Users</h1>
          <p className={`${current.subtext} text-sm sm:text-base`}>Search, edit roles, suspend, and remove user accounts.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative min-w-0 sm:w-80">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by id, name, or email"
              className={`w-full rounded-2xl border ${current.card} py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500/50`} />
          </div>
          <button type="button" onClick={() => void loadUsers(search)}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl border ${current.card} px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all`}>
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </header>

      {loading && <AdminLoadingState title="Loading Users" hint="Fetching account records from admin API." />}
      {!loading && error && <AdminErrorState title="Users Error" hint={error} />}
      {!loading && !error && users.length === 0 && <AdminEmptyState title="No Users Found" hint={emptyHint} />}
      {!loading && !error && users.length > 0 && (
        <AdminTable columns={['User', 'Contact', 'Role', 'Status', 'Joined', 'Actions']} minWidth="min-w-[920px]">
          {users.map((user) => {
            const isEditing = editingId === user.id;
            const isBusy = busyId === user.id;
            return (
              <tr key={user.id} className="border-b border-white/5 align-top">
                <td className="px-5 py-4">
                  {isEditing ? (
                    <input type="text" value={draft.name} onChange={(e) => setDraft(p => ({ ...p, name: e.target.value }))}
                      className={`w-full rounded-xl border ${current.card} px-3 py-2 text-sm outline-none focus:border-blue-500/50`} />
                  ) : (<><p className="font-bold text-sm">{user.name}</p><p className="text-[11px] opacity-50">{user.id}</p></>)}
                </td>
                <td className="px-5 py-4">
                  {isEditing ? (
                    <input type="text" value={draft.phone} onChange={(e) => setDraft(p => ({ ...p, phone: e.target.value }))}
                      className={`w-full rounded-xl border ${current.card} px-3 py-2 text-sm outline-none focus:border-blue-500/50`} />
                  ) : (<><p className="text-sm">{user.email}</p><p className="text-[11px] opacity-50">{user.phone}</p></>)}
                </td>
                <td className="px-5 py-4">
                  {isEditing ? (
                    <select value={draft.role} onChange={(e) => setDraft(p => ({ ...p, role: e.target.value as AdminRole }))}
                      className={`rounded-xl border ${current.card} px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] outline-none focus:border-blue-500/50`}>
                      {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  ) : (
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.16em] ${roleBadge(user.role)}`}>{user.role}</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.16em] ${statusBadge(user.status)}`}>{user.status}</span>
                </td>
                <td className="px-5 py-4 text-xs opacity-70">{user.createdAt}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    {isEditing ? (
                      <>
                        <button type="button" disabled={isBusy} onClick={() => void handleSaveEdit()}
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
                        <button type="button" disabled={isBusy} onClick={() => startEdit(user)}
                          className={`inline-flex items-center gap-1 rounded-xl border ${current.card} px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] disabled:opacity-60`}>
                          <PencilLine className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button type="button" disabled={isBusy} onClick={() => void handleSuspend(user)}
                          className="inline-flex items-center gap-1 rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-amber-200 disabled:opacity-60">
                          <Ban className="w-3.5 h-3.5" /> {user.status === 'suspended' ? 'Restore' : 'Suspend'}
                        </button>
                        <button type="button" disabled={isBusy} onClick={() => void handleDelete(user)}
                          className="inline-flex items-center gap-1 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-red-200 disabled:opacity-60">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
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
