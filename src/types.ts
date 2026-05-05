import type { FuelType, TransmissionType, VehicleType } from '@/db/vehicle-options';

export type ThemeKey = 'luxury' | 'solar' | 'cyber';

export interface ThemeConfig {
  name: string;
  bg: string;
  accent: string;
  btn: string;
  mesh: string;
  text: string;
  card: string;
  subtext: string;
  glow: string;
  navBg: string;
}

export interface Car {
  id: string;
  name: string;
  type: string;
  image: string;
  pricePerDay: number;
  seats: number;
  fuel: string;
  power: string;
  transmission: string;
}

export interface Reservation {
  id: string;
  carName: string;
  image: string;
  startDate: string;
  endDate: string;
  total: number;
  status: 'pending' | 'confirmed' | 'ongoing' | 'cancelled' | 'completed';
}

export type AdminRole = 'admin' | 'manager' | 'support' | 'user';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AdminRole;
  status: 'active' | 'suspended';
  createdAt: string;
  permis_picture: string | null;
  permis_verified: boolean;
}

export type VehicleApproval = 'approved' | 'pending' | 'rejected';
export type { VehicleType, FuelType, TransmissionType } from '@/db/vehicle-options';

export interface AdminVehicle {
  id: string;
  name: string;
  type: VehicleType;
  image: string;
  pricePerDay: number;
  seats: number;
  fuel: FuelType;
  transmission: TransmissionType;
  status: 'available' | 'unavailable';
  approval: VehicleApproval;
  updatedAt: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled';

export interface AdminBooking {
  id: string;
  userName: string;
  userEmail: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  total: number;
  status: BookingStatus;
  createdAt: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalBookings: number;
  pendingBookings: number;
  totalVehicles: number;
  pendingListings: number;
}

export interface AdminDashboardPayload {
  stats: AdminDashboardStats;
  recentBookings: AdminBooking[];
}

export interface AdminApiResponse<T> {
  endpoint: string;
  data: T;
}
