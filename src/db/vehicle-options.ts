import * as DbEnums from './enums';

const enumMap = DbEnums as Record<string, readonly string[]>;

function readEnumArray(key: string, fallback: readonly string[]) {
  const value = enumMap[key];
  return Array.isArray(value) && value.length > 0 ? value : fallback;
}

export const VEHICLE_TYPES = readEnumArray('VEHICLE_TYPE', [
  'Sedan',
  'SUV',
  'Coupe',
  'Hatchback',
  'Convertible',
  'Wagon',
  'Van',
  'Pickup',
  'Sports Car',
  'Luxury',
  'Electric',
  'Hybrid',
] as const);
export type VehicleType = (typeof VEHICLE_TYPES)[number];

export const FUEL_TYPES = readEnumArray('FUEL_TYPE', ['Petrol', 'Diesel', 'Electric', 'Hybrid'] as const);
export type FuelType = (typeof FUEL_TYPES)[number];

export const TRANSMISSIONS = readEnumArray('TRANSMISSION_TYPE', ['Auto', 'Manual'] as const);
export type TransmissionType = (typeof TRANSMISSIONS)[number];

