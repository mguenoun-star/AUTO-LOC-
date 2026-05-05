import { supabase } from '@/lib/supabase';
import {
  AdminApiResponse,
  AdminBooking,
  AdminDashboardPayload,
  AdminUser,
  AdminVehicle,
  BookingStatus,
  VehicleApproval,
} from '../types';

const wrap = <T,>(endpoint: string, data: T): AdminApiResponse<T> => ({ endpoint, data });

// ─── DASHBOARD ──────────────────────────────────────────────────────────────

export async function getAdminDashboard(): Promise<AdminApiResponse<AdminDashboardPayload>> {
  const [usersRes, vehiclesRes, bookingsRes] = await Promise.all([
    supabase.from('profiles').select('id, status'),
    supabase.from('vehicles').select('id, approval'),
    supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(6),
  ]);

  const users = usersRes.data ?? [];
  const vehicles = vehiclesRes.data ?? [];
  const bookings = bookingsRes.data ?? [];

  // Fetch user names & vehicle names for recent bookings
  const recentBookings: AdminBooking[] = [];
  for (const b of bookings) {
    const [userRes, vehicleRes] = await Promise.all([
      supabase.from('profiles').select('name, email').eq('id', b.user_id).single(),
      supabase.from('vehicles').select('name').eq('id', b.vehicle_id).single(),
    ]);
    recentBookings.push({
      id: b.id,
      userName: userRes.data?.name ?? 'Unknown',
      userEmail: userRes.data?.email ?? '',
      vehicleName: vehicleRes.data?.name ?? 'Unknown',
      startDate: b.start_date,
      endDate: b.end_date,
      total: Number(b.total),
      status: b.status,
      createdAt: b.created_at,
    });
  }

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === 'active').length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b) => b.status === 'pending').length,
    totalVehicles: vehicles.length,
    pendingListings: vehicles.filter((v) => v.approval === 'pending').length,
  };

  return wrap('/admin/dashboard', { stats, recentBookings });
}

// ─── USERS ──────────────────────────────────────────────────────────────────

export async function listAdminUsers(search = ''): Promise<AdminApiResponse<AdminUser[]>> {
  let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });

  if (search.trim()) {
    const keyword = `%${search.trim()}%`;
    query = query.or(`name.ilike.${keyword},email.ilike.${keyword}`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const users: AdminUser[] = (data ?? []).map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone ?? '',
    role: u.role ?? 'user',
    status: u.status ?? 'active',
    createdAt: u.created_at,
  }));

  return wrap('/admin/users', users);
}

export async function updateAdminUser(
  id: string,
  patch: Partial<Pick<AdminUser, 'name' | 'phone' | 'role'>>
): Promise<AdminApiResponse<AdminUser>> {
  const { data, error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  const user: AdminUser = {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone ?? '',
    role: data.role,
    status: data.status,
    createdAt: data.created_at,
  };

  return wrap(`/admin/users/${id}`, user);
}

export async function setAdminUserSuspended(
  id: string,
  suspended: boolean
): Promise<AdminApiResponse<AdminUser>> {
  const newStatus = suspended ? 'suspended' : 'active';
  const { data, error } = await supabase
    .from('profiles')
    .update({ status: newStatus })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  const user: AdminUser = {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone ?? '',
    role: data.role,
    status: data.status,
    createdAt: data.created_at,
  };

  return wrap(`/admin/users/${id}/suspend`, user);
}

export async function deleteAdminUser(id: string): Promise<AdminApiResponse<{ id: string }>> {
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return wrap(`/admin/users/${id}`, { id });
}

// ─── VEHICLES ───────────────────────────────────────────────────────────────

export async function listAdminVehicles(search = ''): Promise<AdminApiResponse<AdminVehicle[]>> {
  let query = supabase.from('vehicles').select('*').order('updated_at', { ascending: false });

  if (search.trim()) {
    const keyword = `%${search.trim()}%`;
    query = query.or(`name.ilike.${keyword},type.ilike.${keyword}`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const vehicles: AdminVehicle[] = (data ?? []).map((v) => ({
    id: v.id,
    name: v.name,
    type: v.type,
    image: v.image ?? '',
    pricePerDay: Number(v.price_per_day),
    seats: v.seats,
    fuel: v.fuel,
    transmission: v.transmission,
    status: v.status,
    approval: v.approval,
    updatedAt: v.updated_at,
  }));

  return wrap('/admin/vehicles', vehicles);
}

export async function createAdminVehicle(
  input: Omit<AdminVehicle, 'id' | 'updatedAt'>
): Promise<AdminApiResponse<AdminVehicle>> {
  const { data, error } = await supabase
    .from('vehicles')
    .insert({
      name: input.name,
      type: input.type,
      image: input.image,
      price_per_day: input.pricePerDay,
      seats: input.seats,
      fuel: input.fuel,
      transmission: input.transmission,
      status: input.status,
      approval: input.approval,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  const vehicle: AdminVehicle = {
    id: data.id,
    name: data.name,
    type: data.type,
    image: data.image ?? '',
    pricePerDay: Number(data.price_per_day),
    seats: data.seats,
    fuel: data.fuel,
    transmission: data.transmission,
    status: data.status,
    approval: data.approval,
    updatedAt: data.updated_at,
  };

  return wrap('/admin/vehicles', vehicle);
}

export async function updateAdminVehicle(
  id: string,
  patch: Partial<Omit<AdminVehicle, 'id'>>
): Promise<AdminApiResponse<AdminVehicle>> {
  // Map camelCase to snake_case for DB
  const dbPatch: Record<string, unknown> = {};
  if (patch.name !== undefined) dbPatch.name = patch.name;
  if (patch.type !== undefined) dbPatch.type = patch.type;
  if (patch.image !== undefined) dbPatch.image = patch.image;
  if (patch.pricePerDay !== undefined) dbPatch.price_per_day = patch.pricePerDay;
  if (patch.seats !== undefined) dbPatch.seats = patch.seats;
  if (patch.fuel !== undefined) dbPatch.fuel = patch.fuel;
  if (patch.transmission !== undefined) dbPatch.transmission = patch.transmission;
  if (patch.status !== undefined) dbPatch.status = patch.status;
  if (patch.approval !== undefined) dbPatch.approval = patch.approval;

  const { data, error } = await supabase
    .from('vehicles')
    .update(dbPatch)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  const vehicle: AdminVehicle = {
    id: data.id,
    name: data.name,
    type: data.type,
    image: data.image ?? '',
    pricePerDay: Number(data.price_per_day),
    seats: data.seats,
    fuel: data.fuel,
    transmission: data.transmission,
    status: data.status,
    approval: data.approval,
    updatedAt: data.updated_at,
  };

  return wrap(`/admin/vehicles/${id}`, vehicle);
}

export async function setVehicleApproval(
  id: string,
  approval: VehicleApproval
): Promise<AdminApiResponse<AdminVehicle>> {
  return updateAdminVehicle(id, { approval });
}

export async function setVehicleAvailability(
  id: string,
  status: AdminVehicle['status']
): Promise<AdminApiResponse<AdminVehicle>> {
  return updateAdminVehicle(id, { status });
}

export async function deleteAdminVehicle(id: string): Promise<AdminApiResponse<{ id: string }>> {
  const { error } = await supabase.from('vehicles').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return wrap(`/admin/vehicles/${id}`, { id });
}

// ─── BOOKINGS ───────────────────────────────────────────────────────────────

export async function listAdminBookings(
  status: BookingStatus | 'all' = 'all'
): Promise<AdminApiResponse<AdminBooking[]>> {
  let query = supabase
    .from('bookings')
    .select('*, profiles:user_id(name, email), vehicles:vehicle_id(name)')
    .order('created_at', { ascending: false });

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const bookings: AdminBooking[] = (data ?? []).map((b) => {
    const profile = b.profiles as unknown as { name: string; email: string } | null;
    const vehicle = b.vehicles as unknown as { name: string } | null;
    return {
      id: b.id,
      userName: profile?.name ?? 'Unknown',
      userEmail: profile?.email ?? '',
      vehicleName: vehicle?.name ?? 'Unknown',
      startDate: b.start_date,
      endDate: b.end_date,
      total: Number(b.total),
      status: b.status,
      createdAt: b.created_at,
    };
  });

  return wrap('/admin/bookings', bookings);
}

export async function updateAdminBooking(
  id: string,
  patch: Partial<Pick<AdminBooking, 'startDate' | 'endDate' | 'status'>>
): Promise<AdminApiResponse<AdminBooking>> {
  const dbPatch: Record<string, unknown> = {};
  if (patch.startDate !== undefined) dbPatch.start_date = patch.startDate;
  if (patch.endDate !== undefined) dbPatch.end_date = patch.endDate;
  if (patch.status !== undefined) dbPatch.status = patch.status;

  const { data, error } = await supabase
    .from('bookings')
    .update(dbPatch)
    .eq('id', id)
    .select('*, profiles:user_id(name, email), vehicles:vehicle_id(name)')
    .single();

  if (error) throw new Error(error.message);

  const profile = data.profiles as unknown as { name: string; email: string } | null;
  const vehicle = data.vehicles as unknown as { name: string } | null;

  const booking: AdminBooking = {
    id: data.id,
    userName: profile?.name ?? 'Unknown',
    userEmail: profile?.email ?? '',
    vehicleName: vehicle?.name ?? 'Unknown',
    startDate: data.start_date,
    endDate: data.end_date,
    total: Number(data.total),
    status: data.status,
    createdAt: data.created_at,
  };

  return wrap(`/admin/bookings/${id}`, booking);
}

export async function cancelAdminBooking(id: string): Promise<AdminApiResponse<AdminBooking>> {
  return updateAdminBooking(id, { status: 'cancelled' });
}
