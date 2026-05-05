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
  status: 'ongoing' | 'cancelled' | 'completed';
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
}

export type VehicleApproval = 'approved' | 'pending' | 'rejected';

export interface AdminVehicle {
  id: string;
  name: string;
  type: string;
  image: string;
  pricePerDay: number;
  seats: number;
  fuel: string;
  transmission: string;
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
