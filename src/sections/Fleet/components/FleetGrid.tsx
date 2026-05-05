import React from 'react';
import CarCard from '@/components/ui/CarCard';
import { Car, ThemeConfig } from '@/types';

interface FleetGridProps {
  cars: Car[];
  theme: ThemeConfig;
}

export default function FleetGrid({ cars, theme }: FleetGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} theme={theme} />
      ))}
    </div>
  );
}