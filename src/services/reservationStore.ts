import { supabase } from '@/lib/supabase';
import { Reservation } from '@/types';

export const listUserReservations = async (userId: string | null | undefined): Promise<Reservation[]> => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('bookings')
    .select('*, vehicles(name, image)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((b: any) => ({
    id: b.id,
    carName: b.vehicles?.name ?? 'Unknown Vehicle',
    image: b.vehicles?.image ?? '',
    startDate: b.start_date,
    endDate: b.end_date,
    total: Number(b.total),
    status: b.status,
  }));
};

export const createUserReservation = async (
  userId: string,
  vehicleId: string,
  input: Omit<Reservation, 'id' | 'status' | 'carName' | 'image'> & { status?: Reservation['status'] }
): Promise<Reservation> => {
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      user_id: userId,
      vehicle_id: vehicleId,
      start_date: input.startDate,
      end_date: input.endDate,
      total: input.total,
      status: input.status ?? 'ongoing',
    })
    .select('*, vehicles(name, image)')
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    carName: data.vehicles?.name ?? 'Unknown Vehicle',
    image: data.vehicles?.image ?? '',
    startDate: data.start_date,
    endDate: data.end_date,
    total: Number(data.total),
    status: data.status,
  };
};
