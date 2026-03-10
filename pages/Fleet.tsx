import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CarCard } from '../components/CarCard';
import { Search, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Car } from '../types';

export const Fleet: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pickupLocation = queryParams.get('location');
  const pickupDate = queryParams.get('pickup');
  const returnDate = queryParams.get('return');

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate duration in days
  let durationDays = 0;
  if (pickupDate && returnDate) {
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (durationDays === 0) durationDays = 1; // Minimum 1 day
  }

  // Updated categories based on new fleet
  const categories = ['All', 'Hatchback', 'Sedan', 'MPV', 'SUV', 'Compact SUV', 'Van', 'Pickup', 'L300'];

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false });
        
        if (error) {
          console.error("Supabase Error fetching cars:", error);
          return;
        }

        if (data && data.length > 0) {
          const mappedCars: Car[] = data.map((c: any) => ({
            id: c.id,
            name: c.name,
            category: c.category,
            pricePerDay: c.price_per_day,
            seats: c.seats,
            transmission: c.transmission,
            fuelType: c.fuel_type,
            imageUrl: c.image_url,
            features: c.features || [],
            carWashFee: c.car_wash_fee,
            excessHourRate: c.excess_hour_rate || 200 // Default fallback
          }));
          setCars(mappedCars);
        } else {
          // Fallback to empty if DB is empty
          setCars([]);
        }
      } catch (err) {
        console.error(err);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const filteredCars = cars.filter(car => {
    const matchesCategory = filterCategory === 'All' || car.category === filterCategory;
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-light-gray min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-pitch-black mb-4">Our Premium Fleet</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-4">
            From compact city cars to spacious vans for the whole family, we have the perfect vehicle for your Tacloban adventure.
          </p>
          <p className="text-sm text-slate-500 max-w-xl mx-auto italic">
            We offer the best <span className="text-primary font-semibold">rent a car Tacloban prices</span> for <span className="text-primary font-semibold">self drive</span> and chauffeured services.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  filterCategory === cat
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
           <div className="flex justify-center items-center py-20">
              <Loader2 size={40} className="animate-spin text-primary" />
           </div>
        ) : filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map(car => (
              <CarCard 
                key={car.id} 
                car={car} 
                durationDays={durationDays}
                searchParams={{
                  location: pickupLocation || '',
                  pickup: pickupDate || '',
                  return: returnDate || ''
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block p-4 rounded-full bg-slate-100 mb-4">
                <Search size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-pitch-black">No vehicles found</h3>
            <p className="text-slate-500">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};