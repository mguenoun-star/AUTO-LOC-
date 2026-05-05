'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, ChevronDown, CarFront } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import CarCard from '@/components/ui/CarCard';
import { Car } from '@/types';
import { listAdminVehicles } from '@/services/adminApi';

const allCars: Car[] = [
  { id: '1', name: 'BMW 5 Series', type: 'Sedan', image: 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&cs=tinysrgb&w=1200', pricePerDay: 89, seats: 5, fuel: 'Petrol', power: '248 HP', transmission: 'Auto' },
  { id: '2', name: 'Mercedes GLE', type: 'SUV', image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1200', pricePerDay: 120, seats: 7, fuel: 'Diesel', power: '362 HP', transmission: 'Auto' },
  { id: '3', name: 'Porsche 911', type: 'Sport', image: 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&cs=tinysrgb&w=1200', pricePerDay: 220, seats: 2, fuel: 'Petrol', power: '443 HP', transmission: 'Manual' },
  { id: '4', name: 'Audi RS6', type: 'Avant', image: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=1200', pricePerDay: 180, seats: 5, fuel: 'Petrol', power: '591 HP', transmission: 'Auto' },
  { id: '5', name: 'Tesla Model S', type: 'Electric', image: 'https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg?auto=compress&cs=tinysrgb&w=1200', pricePerDay: 150, seats: 5, fuel: 'Electric', power: '670 HP', transmission: 'Direct' },
  { id: '6', name: 'Range Rover', type: 'SUV', image: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=1200', pricePerDay: 140, seats: 5, fuel: 'Hybrid', power: '398 HP', transmission: 'Auto' },
];

export default function Fleet() {
  const { current } = useTheme();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [cars, setCars] = useState<Car[]>(allCars);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadFleet = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await listAdminVehicles();
        const visible = response.data.filter((vehicle) => vehicle.approval === 'approved' && vehicle.status === 'available');
        const mapped: Car[] = visible.map((vehicle) => ({
          id: vehicle.id,
          name: vehicle.name,
          type: vehicle.type,
          image: vehicle.image,
          pricePerDay: vehicle.pricePerDay,
          seats: vehicle.seats,
          fuel: vehicle.fuel,
          power: 'N/A',
          transmission: vehicle.transmission,
        }));
        if (active && mapped.length > 0) {
          setCars(mapped);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to load fleet.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadFleet();
    return () => { active = false; };
  }, []);

  const typeOptions = useMemo(() => ['All', ...Array.from(new Set(cars.map((car) => car.type)))], [cars]);
  const normalizedSearch = search.trim().toLowerCase();

  const filteredCars = cars.filter((car) => {
    const matchesType = selectedType === 'All' || car.type === selectedType;
    if (!matchesType) return false;
    if (!normalizedSearch) return true;
    const haystack = `${car.name} ${car.type} ${car.fuel} ${car.transmission}`.toLowerCase();
    return haystack.includes(normalizedSearch);
  });

  const hasFilters = normalizedSearch.length > 0 || selectedType !== 'All';
  const handleReset = () => {
    setSearch('');
    setSelectedType('All');
  };

  return (
    <div className={`min-h-screen pt-32 pb-20 px-6 ${current.bg} ${current.text}`}>
      <div className="max-w-7xl mx-auto">
        <header className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-10"
          >
            <div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-6">The Fleet</h1>
              <p className={`${current.subtext} text-xl max-w-xl font-medium`}>
                Parcourez notre catalogue d&apos;exception. Trouvez la monture qui correspond à votre prochain chapitre.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 px-6 py-3 rounded-full text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <CarFront className="w-4 h-4" /> {filteredCars.length} Models Found
              </div>
            </div>
          </motion.div>
        </header>

        <div className="flex flex-col md:flex-row gap-6 mb-16">
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 group-focus-within:opacity-100 group-focus-within:text-blue-500 transition-all" />
            <input
              type="text"
              placeholder="Search by model, brand or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-6 pl-16 pr-6 text-sm focus:border-blue-500/50 outline-none transition-all placeholder:text-current/30"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-6 top-1/2 -translate-y-1/2 opacity-60" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="appearance-none flex items-center gap-3 pl-14 pr-12 py-6 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-black uppercase tracking-widest focus:outline-none focus:border-blue-500/50"
              >
                {typeOptions.map((type) => (
                  <option key={type} value={type} className="bg-black text-white">
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 opacity-40 absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button
              type="button"
              onClick={handleReset}
              disabled={!hasFilters}
              className="flex items-center gap-3 px-8 py-6 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-black uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <SlidersHorizontal className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>

        {hasFilters && (
          <div className={`mb-10 text-[10px] font-black uppercase tracking-[0.3em] ${current.subtext}`}>
            Filters: {selectedType === 'All' ? 'Any type' : selectedType}
            {normalizedSearch ? ` · search: "${normalizedSearch}"` : ''}
          </div>
        )}

        {loading && (
          <div className={`mb-8 text-[10px] font-black uppercase tracking-[0.3em] ${current.subtext}`}>
            Loading fleet...
          </div>
        )}

        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {filteredCars.length === 0 ? (
          <div className={`rounded-[2rem] border ${current.card} p-10 text-center`}>
            <CarFront className="w-10 h-10 mx-auto text-blue-400 mb-4" />
            <h3 className="text-xl font-black uppercase tracking-tight mb-2">No cars match</h3>
            <p className={`text-sm ${current.subtext}`}>Try another search term or reset your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} theme={current} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
