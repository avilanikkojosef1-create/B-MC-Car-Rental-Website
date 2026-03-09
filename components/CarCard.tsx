import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from '../types';
import { Fuel, Settings, Users, Check } from 'lucide-react';

interface CarCardProps {
  car: Car;
  durationDays?: number;
  searchParams?: {
    location: string;
    pickup: string;
    return: string;
  };
}

export const CarCard: React.FC<CarCardProps> = ({ car, durationDays, searchParams }) => {
  const bookingParams = new URLSearchParams({
    carId: car.id,
    carName: car.name,
    price: car.pricePerDay.toString(),
    excessRate: car.excessHourRate.toString(),
    ...(searchParams || {})
  });

  let totalPrice = null;
  let excessHours = 0;
  let days = 0;

  if (searchParams?.pickup && searchParams?.return) {
    const start = new Date(searchParams.pickup);
    const end = new Date(searchParams.return);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalHours = diffTime / (1000 * 60 * 60);
    
    days = Math.floor(totalHours / 24);
    const rawExcess = totalHours % 24;
    // Only charge if excess is 1 hour or more
    excessHours = rawExcess >= 1 ? Math.ceil(rawExcess) : 0;
    
    if (days === 0 && totalHours > 0) {
      days = 1;
      excessHours = 0;
    }
    
    totalPrice = (car.pricePerDay * days) + (excessHours * car.excessHourRate) + (car.carWashFee || 0);
  } else if (durationDays) {
    days = durationDays;
    totalPrice = (car.pricePerDay * durationDays) + (car.carWashFee || 0);
  }

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-slate-200">
        <img 
          src={car.imageUrl} 
          alt={car.name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback image if the user's custom link is broken
            e.currentTarget.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800';
          }}
        />
        <div className="absolute top-3 left-3 bg-primary/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-secondary border border-secondary/20">
          {car.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-pitch-black group-hover:text-primary transition-colors">{car.name}</h3>
          <div className="text-right flex flex-col items-end">
            <div>
                <span className="text-xl font-bold text-primary">₱{car.pricePerDay.toLocaleString()}</span>
                <span className="text-sm text-slate-500">/day</span>
            </div>
            {car.carWashFee && (
                <span className="text-xs text-slate-400 font-medium">+ ₱{car.carWashFee} Car Wash</span>
            )}
          </div>
        </div>

        {totalPrice !== null && (
          <div className="mb-4 p-3 bg-secondary/10 rounded-lg border border-secondary/20">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total for {days} day/s {excessHours > 0 ? `& ${excessHours} hr/s` : ''}</span>
              <span className="text-lg font-extrabold text-primary">₱{totalPrice.toLocaleString()}</span>
            </div>
            {excessHours > 0 && (
              <div className="text-[10px] text-slate-400 text-right italic">
                (Includes ₱{(excessHours * car.excessHourRate).toLocaleString()} excess hour charge)
              </div>
            )}
          </div>
        )}

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-4 border-b border-slate-100 mb-4">
          <div className="flex flex-col items-center text-center">
            <Settings size={18} className="text-slate-400 mb-1 group-hover:text-secondary transition-colors" />
            <span className="text-xs text-slate-600">{car.transmission}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Fuel size={18} className="text-slate-400 mb-1 group-hover:text-secondary transition-colors" />
            <span className="text-xs text-slate-600">{car.fuelType}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Users size={18} className="text-slate-400 mb-1 group-hover:text-secondary transition-colors" />
            <span className="text-xs text-slate-600">{car.seats} Seats</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex-1">
            <ul className="space-y-1 mb-4">
            {car.features.slice(0, 2).map((feature, idx) => (
                <li key={idx} className="flex items-center text-sm text-slate-500">
                <Check size={14} className="text-secondary mr-2" />
                {feature}
                </li>
            ))}
            </ul>
        </div>

        {/* Action Button */}
        <Link to={`/booking?${bookingParams.toString()}`} className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-accent transition-colors mt-auto border border-primary hover:border-accent text-center block">
          Book This Car
        </Link>
      </div>
    </div>
  );
};
