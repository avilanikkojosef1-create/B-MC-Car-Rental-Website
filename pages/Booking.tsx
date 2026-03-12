import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Car as CarIcon, Users, Clock, User, FileText, MessageSquare, CheckCircle, Loader2, Facebook, Calendar, Wallet, ChevronDown, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getEnv } from '../lib/env';
import emailjs from '@emailjs/browser';
import { Car } from '../types';

export const Booking: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const form = useRef<HTMLFormElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fleet, setFleet] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  // Read query parameters
  const queryParams = new URLSearchParams(location.search);
  const carId = queryParams.get('carId');
  const carName = queryParams.get('carName');
  const pricePerDay = queryParams.get('price');
  const excessRate = queryParams.get('excessRate');
  const pickupLoc = queryParams.get('location') || 'Tacloban City';
  const pickupDate = queryParams.get('pickup');
  const returnDate = queryParams.get('return');

  useEffect(() => {
    const fetchFleet = async () => {
      try {
        const { data } = await supabase.from('cars').select('*');
        if (data) {
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
            excessHourRate: c.excess_hour_rate || 200
          }));
          setFleet(mappedCars);
          
          // If carId is in URL, set it as selected
          if (carId) {
            const car = mappedCars.find(c => c.id === carId);
            if (car) setSelectedCar(car);
          }
        }
      } catch (err) {
        console.error("Error fetching fleet for booking:", err);
      }
    };
    fetchFleet();
  }, [carId]);

  // Calculate duration and total
  let durationText = 'Not specified';
  let totalPrice = 0;
  let days = 0;
  let excessHours = 0;
  let excessAmount = 0;

  const currentPricePerDay = selectedCar ? selectedCar.pricePerDay : (pricePerDay ? parseInt(pricePerDay) : 0);
  const currentExcessRate = selectedCar ? selectedCar.excessHourRate : (excessRate ? parseInt(excessRate) : 200);

  if (pickupDate && returnDate) {
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalHours = diffTime / (1000 * 60 * 60);
    
    days = Math.floor(totalHours / 24);
    const rawExcess = totalHours % 24;
    // Only charge if excess is 1 hour or more
    excessHours = rawExcess >= 1 ? Math.ceil(rawExcess) : 0;
    
    // If less than 24 hours, it's at least 1 day
    if (days === 0 && totalHours > 0) {
      days = 1;
      excessHours = 0;
    }
    
    durationText = `${days} Day(s)${excessHours > 0 ? ` & ${excessHours} Hour(s)` : ''}`;
    
    if (currentPricePerDay) {
      totalPrice = currentPricePerDay * days;
      if (excessHours > 0 && currentExcessRate) {
        excessAmount = currentExcessRate * excessHours;
        totalPrice += excessAmount;
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCar && !carName) {
      alert("Please select a vehicle first.");
      return;
    }

    setIsLoading(true);

    if (!form.current) return;

    try {
      const formData = new FormData(form.current);
      const userName = formData.get('user_name') as string;
      const contactNumber = formData.get('contact_number') as string;
      const facebookAccount = formData.get('facebook_account') as string;
      const passengers = formData.get('passengers') as string;
      const purpose = formData.get('purpose') as string;
      const specialRequests = formData.get('special_requests') as string;
      const manualPickupLoc = formData.get('pickup_location') as string;

      // 1. Save to Supabase
      const { error: dbError } = await supabase.from('bookings').insert([{
        user_name: userName,
        user_email: '', 
        contact_number: contactNumber,
        facebook_account: facebookAccount,
        pickup_location: manualPickupLoc || pickupLoc,
        dropoff_location: 'As specified in search',
        start_date: pickupDate || new Date().toISOString(),
        duration: durationText,
        car_type: selectedCar?.name || carName || 'Any',
        special_requests: `Passengers: ${passengers}. Purpose: ${purpose}. ${specialRequests || ''}`,
        status: 'Pending'
      }]);

      if (dbError) {
        console.error("DB Error:", dbError);
      }

      // 2. Send Email via EmailJS
      const serviceId = getEnv('VITE_EMAILJS_SERVICE_ID');
      const templateId = getEnv('VITE_EMAILJS_TEMPLATE_ID');
      const publicKey = getEnv('VITE_EMAILJS_PUBLIC_KEY');

      if (serviceId && templateId && publicKey) {
        try {
          // Construct explicit parameters for the email template
          const templateParams = {
            user_name: userName,
            contact_number: contactNumber,
            facebook_account: facebookAccount,
            car_name: selectedCar?.name || carName || 'Any',
            pickup_location: manualPickupLoc || pickupLoc,
            pickup_date: pickupDate ? new Date(pickupDate).toLocaleString() : 'Not specified',
            return_date: returnDate ? new Date(returnDate).toLocaleString() : 'Not specified',
            duration: durationText,
            total_price: `₱${totalPrice.toLocaleString()}`,
            passengers: passengers,
            purpose: purpose,
            special_requests: specialRequests || 'None'
          };

          const result = await emailjs.send(
            serviceId,
            templateId,
            templateParams,
            publicKey
          );
          console.log('EMAILJS SUCCESS:', result.status, result.text);
        } catch (emailError: any) {
          console.error('EMAILJS ERROR:', emailError);
        }
      } else {
        const missing = [];
        if (!serviceId) missing.push('VITE_EMAILJS_SERVICE_ID');
        if (!templateId) missing.push('VITE_EMAILJS_TEMPLATE_ID');
        if (!publicKey) missing.push('VITE_EMAILJS_PUBLIC_KEY');
        
        console.error('EmailJS Configuration Missing:', missing.join(', '));
        console.warn('Please set these environment variables in AI Studio Settings to receive email notifications.');
      }
      
      setSubmittedData({
        userName,
        contactNumber,
        carName: selectedCar?.name || carName || 'Any',
        pickupDate,
        duration: durationText,
        totalPrice
      });
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('FAILED...', error);
      alert("Something went wrong with the request. Please check your internet connection or call us directly at 0926 841 6776.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    const facebookUrl = "https://www.facebook.com/profile.php?id=61565879651066";
    const phoneNumber = "+639268416776";

    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600 w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-pitch-black mb-4">Request Received!</h2>
          <p className="text-slate-600 mb-6 text-lg">
            Thank you for your interest in B&MC CAR RENTAL Tacloban. Your request has been saved to our system.
          </p>
          
          <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-100 text-left">
            <h4 className="font-bold text-slate-800 mb-2">Next Steps:</h4>
            <ul className="text-sm text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">1.</span>
                Our team will review your request in the Admin Dashboard.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">2.</span>
                We will contact you via phone or Facebook to confirm availability.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-bold">3.</span>
                For faster confirmation, you can message us on Facebook or call us directly.
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <a 
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#1877F2] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              <Facebook size={20} />
              Message us on Facebook
            </a>
            <a 
              href={`tel:${phoneNumber}`}
              className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              <Phone size={20} />
              Call +63 926 841 6776
            </a>
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-slate-100 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors uppercase tracking-wide mt-2"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-pitch-black mb-3">Book Your Ride</h1>
          <p className="text-lg text-slate-600">Complete the form below to request a reservation.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Progress Bar / Decor */}
          <div className="h-2 bg-gradient-to-r from-primary to-secondary w-full"></div>

          <div className="p-8 md:p-10 bg-white border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              Booking Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-slate-600">
                <CarIcon size={18} className="text-primary" />
                <div className="flex-1">
                  <span className="text-sm font-medium block mb-1">Vehicle:</span>
                  {carId || selectedCar ? (
                    <span className="text-slate-900 font-bold">{selectedCar?.name || carName}</span>
                  ) : (
                    <div className="relative">
                      <select 
                        onChange={(e) => {
                          const car = fleet.find(c => c.id === e.target.value);
                          if (car) setSelectedCar(car);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 appearance-none outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select a vehicle...</option>
                        {fleet.map(c => (
                          <option key={c.id} value={c.id}>{c.name} (₱{c.pricePerDay}/day)</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin size={18} className="text-primary" />
                <span className="text-sm font-medium">Pickup: <span className="text-slate-900 font-bold">{pickupLoc}</span></span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Calendar size={18} className="text-primary" />
                <span className="text-sm font-medium">Dates: <span className="text-slate-900 font-bold">{pickupDate ? new Date(pickupDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'TBD'} - {returnDate ? new Date(returnDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'TBD'}</span></span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Clock size={18} className="text-primary" />
                <span className="text-sm font-medium">Duration: <span className="text-slate-900 font-bold">{durationText}</span></span>
              </div>
              {totalPrice > 0 && (
                <div className="col-span-1 md:col-span-2 mt-2 p-4 bg-primary/5 rounded-xl border border-primary/10 space-y-2">
                  <div className="flex justify-between items-center text-sm text-slate-600">
                    <span>Base Rental ({days} day/s)</span>
                    <span className="font-bold">₱{(currentPricePerDay * days).toLocaleString()}</span>
                  </div>
                  {excessHours > 0 && (
                    <div className="flex justify-between items-center text-sm text-slate-600">
                      <span>Excess Hours ({excessHours} hr/s)</span>
                      <span className="font-bold text-orange-600">+ ₱{excessAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-primary/10 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Wallet size={18} className="text-primary" />
                      <span className="text-sm font-bold text-slate-700">Estimated Total</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-extrabold text-primary block">₱{totalPrice.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 italic">Excluding fuel & security deposit</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <form ref={form} onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
            {/* Hidden fields for EmailJS */}
            <input type="hidden" name="car_name" value={selectedCar?.name || carName || 'Any'} />
            <input type="hidden" name="pickup_date" value={pickupDate || ''} />
            <input type="hidden" name="return_date" value={returnDate || ''} />
            <input type="hidden" name="duration" value={durationText} />
            <input type="hidden" name="total_price" value={totalPrice} />
            
            {/* Section 1: Personal Details */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 pb-2 border-b border-slate-100">
                <User className="text-primary" size={24} /> 
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="user_name"
                    required
                    placeholder="Juan Dela Cruz"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400 font-medium"
                  />
                </div>
                
                {/* Contact Number */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Contact Number</label>
                  <input 
                    type="tel" 
                    name="contact_number"
                    required
                    placeholder="0912 345 6789"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400 font-medium"
                  />
                </div>

                {/* Facebook Account */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Facebook Account (Link or Name)</label>
                  <div className="relative">
                    <Facebook className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      name="facebook_account"
                      required
                      placeholder="facebook.com/juan.delacruz"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400 font-medium"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Section 2: Trip Details */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 pb-2 border-b border-slate-100">
                <MapPin className="text-primary" size={24} /> 
                Trip Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Pickup Location */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Pick up Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      name="pickup_location"
                      required
                      defaultValue={pickupLoc}
                      placeholder="Enter exact pickup address"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400 font-medium"
                    />
                  </div>
                </div>

                 {/* Passengers */}
                 <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">No. of Passengers</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input 
                      type="number" 
                      name="passengers"
                      min="1"
                      required
                      placeholder="e.g., 4"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400 font-medium"
                    />
                  </div>
                </div>

                 {/* Purpose */}
                 <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Purpose of Trip</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      name="purpose"
                      required
                      placeholder="Business, vacation, etc."
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400 font-medium"
                    />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Special Requests (Optional)</label>
                  <textarea 
                    name="special_requests"
                    rows={4}
                    placeholder="Extra stops, luggage, special timing..."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none placeholder:text-slate-400 font-medium"
                  ></textarea>
                </div>

              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-1 flex-shrink-0">
                <MessageSquare size={16} />
              </div>
              <div>
                <h4 className="font-bold text-blue-900 text-sm mb-1">What happens next?</h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  We'll contact you with available options and the estimated quote. No payment needed at this stage.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => navigate(-1)}
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors uppercase tracking-wide disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isLoading}
                className="flex-1 px-8 py-4 bg-accent text-white font-bold rounded-xl hover:bg-primary transition-colors shadow-lg shadow-accent/30 uppercase tracking-wide disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};