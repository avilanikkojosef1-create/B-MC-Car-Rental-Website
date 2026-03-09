import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CAR_FLEET, APP_NAME } from '../constants';
import { CarCard } from '../components/CarCard';
import { ShieldCheck, UserCheck, ArrowRight, Search, ThumbsUp, Wallet, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Car } from '../types';

export const Home: React.FC = () => {
  const [featuredCars, setFeaturedCars] = useState<Car[]>(CAR_FLEET.slice(0, 3));
  const navigate = useNavigate();
  
  const [searchParams, setSearchParams] = useState({
    location: '',
    pickupDate: '',
    returnDate: ''
  });

  const handleSearch = () => {
    const params = new URLSearchParams({
      location: searchParams.location || 'Tacloban City',
      pickup: searchParams.pickupDate,
      return: searchParams.returnDate
    });
    navigate(`/fleet?${params.toString()}`);
  };

  useEffect(() => {
    const fetchFeatured = async () => {
       // Fetch top 3 cars
       const { data } = await supabase.from('cars').select('*').limit(3).order('created_at', { ascending: false });
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
          setFeaturedCars(mappedCars);
       }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="bg-clean-white">
      
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-primary">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1920" 
            alt={`${APP_NAME} Hero`} 
            className="w-full h-full object-cover object-center brightness-110 contrast-105"
            referrerPolicy="no-referrer"
          />
          
          {/* Enhanced Dark Overlay for Text Visibility - Adjusted for "Pop" */}
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-black/20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full pt-24 pb-12">
          
          {/* Quick Search Widget */}
          <div className="max-w-5xl mx-auto mb-16 bg-white/10 backdrop-blur-xl p-2 rounded-3xl border border-white/20 shadow-2xl animate-fade-in-up">
            <div className="bg-white rounded-[1.4rem] p-6 md:p-8 grid grid-cols-1 md:grid-cols-4 gap-6 items-end text-left">
              
              {/* Pick Up Location */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Pick Up Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={18} />
                  <input 
                    type="text"
                    value={searchParams.location}
                    onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
                    placeholder="Enter pickup location"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm font-semibold text-slate-700"
                  />
                </div>
              </div>

              {/* Pick Up Date */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Pick Up Date & Time</label>
                <div className="relative">
                  <input 
                    type="datetime-local" 
                    value={searchParams.pickupDate}
                    onChange={(e) => setSearchParams({...searchParams, pickupDate: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm font-semibold text-slate-700 cursor-pointer"
                  />
                </div>
              </div>

              {/* Return Date */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Return Date & Time</label>
                <div className="relative">
                  <input 
                    type="datetime-local" 
                    value={searchParams.returnDate}
                    onChange={(e) => setSearchParams({...searchParams, returnDate: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm font-semibold text-slate-700 cursor-pointer"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div>
                <button 
                  onClick={handleSearch}
                  className="w-full bg-accent text-white py-3.5 rounded-xl font-bold text-sm hover:bg-primary transition-all shadow-lg shadow-accent/20 uppercase tracking-widest flex items-center justify-center gap-2 group"
                >
                  Search Cars <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          </div>

          <h2 className="text-secondary font-bold tracking-[0.2em] mb-6 animate-fade-in-up text-sm md:text-base bg-primary/80 inline-block px-6 py-2 rounded-full border border-secondary/50 shadow-lg backdrop-blur-md">
            {APP_NAME}
          </h2>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-8 leading-tight tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] max-w-4xl mx-auto">
            With Our Car Rental Services, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-clean-white">
              The Adventure Begins As Soon As You Hit The Ignition.
            </span>
          </h1>

          <p className="mt-8 text-white/80 text-sm font-medium drop-shadow-md">
            Trusted by 5,000+ travelers in Eastern Visayas
          </p>

        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-clean-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-pitch-black mb-4">How It Works</h2>
            <p className="text-slate-500 max-w-2xl mx-auto mb-16">Simple steps to get you on the road in minutes.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200 -z-10"></div>

                {/* Step 1 */}
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-white border-4 border-secondary/20 rounded-full flex items-center justify-center text-secondary mb-6 shadow-xl">
                        <Search size={32} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-xl font-bold text-pitch-black mb-2">1. Choose Your Car</h3>
                    <p className="text-slate-600 px-8">Browse our fleet of hatchbacks, sedans, SUVs, and vans.</p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-white border-4 border-secondary/20 rounded-full flex items-center justify-center text-secondary mb-6 shadow-xl">
                        <UserCheck size={32} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-xl font-bold text-pitch-black mb-2">2. Book & Confirm</h3>
                    <p className="text-slate-600 px-8">Select your dates and provide your requirements.</p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-white border-4 border-secondary/20 rounded-full flex items-center justify-center text-secondary mb-6 shadow-xl">
                        <ShieldCheck size={32} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-xl font-bold text-pitch-black mb-2">3. Drive Away</h3>
                    <p className="text-slate-600 px-8">Pick up your car or have it delivered to you in Tacloban.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-primary py-12 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 text-slate-300">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="text-secondary" size={32} />
                    <span className="font-bold text-lg">Verified Insurance</span>
                </div>
                <div className="flex items-center gap-3">
                    <Wallet className="text-secondary" size={32} />
                    <span className="font-bold text-lg">Best Price Guarantee</span>
                </div>
                <div className="flex items-center gap-3">
                    <ThumbsUp className="text-secondary" size={32} />
                    <span className="font-bold text-lg">24/7 Roadside Assistance</span>
                </div>
            </div>
        </div>
      </section>

      {/* Featured Fleet */}
      <section className="py-24 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-primary font-bold tracking-wide uppercase text-sm">Our Premium Fleet</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-pitch-black mt-2">Find the Perfect Ride</h2>
            </div>
            <Link to="/fleet" className="flex items-center text-primary font-bold hover:text-secondary transition-colors bg-white px-6 py-3 rounded-full shadow-sm hover:shadow-md border border-slate-100">
              View All Cars <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-clean-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-pitch-black mb-12 text-center">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    {name: "Charles Yu", role: "Tourist", quote: "Excellent service! We rented an Innova for our family trip to Samar. The car was clean and the staff was very professional."},
                    {name: "Maria Santos", role: "Business Traveler", quote: `${APP_NAME} is my go-to in Tacloban. The rates are transparent and the Wigo I rented was perfect for city driving.`},
                    {name: "David Smith", role: "Adventure Seeker", quote: "Rented a Montero for a week. Handled the roads perfectly. Highly recommend their 24/7 support!"}
                ].map((testimonial, idx) => (
                    <div key={idx} className="bg-light-gray p-8 rounded-2xl border border-slate-100 relative">
                        <div className="text-secondary text-6xl font-serif absolute top-4 left-6 opacity-20">"</div>
                        <p className="text-slate-700 italic mb-6 relative z-10">{testimonial.quote}</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center text-primary font-bold">
                                {testimonial.name[0]}
                            </div>
                            <div>
                                <h4 className="font-bold text-pitch-black text-sm">{testimonial.name}</h4>
                                <span className="text-xs text-slate-500">{testimonial.role}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-secondary rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-accent rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Ready to drive?</h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust {APP_NAME} for their travel needs in Tacloban. 
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/booking" className="bg-accent text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-accent transition-colors uppercase tracking-wide">
                    Book Your Ride
                </Link>
                <Link to="/contact" className="border border-white/20 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-secondary/20 hover:border-secondary transition-colors uppercase tracking-wide">
                    Contact Us
                </Link>
            </div>
        </div>
      </section>
    </div>
  );
};