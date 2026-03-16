import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Booking } from '../types';
import { LogOut, LayoutDashboard, Users, Plus, Edit, Trash2, Search, Save, X, Upload, Calendar, CheckCircle, XCircle, Loader2, AlertCircle, Database, Copy, Check, Settings, RefreshCw, Facebook } from 'lucide-react';
import { supabase, getSupabaseConfig } from '../lib/supabase';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'fleet' | 'bookings'>('fleet');
  
  // Data State
  const [fleet, setFleet] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [connectionError, setConnectionError] = useState<string>('');
  const [githubStatus, setGithubStatus] = useState<{ 
    connected: boolean; 
    user?: any; 
    error?: string;
    statusCode?: number;
    isProduction?: boolean;
    debug?: {
      exists: boolean;
      length: number;
      hasVitePrefix?: boolean;
      tokenStart?: string;
      axiosError?: string;
    }
  } | null>(null);
  const [checkingGithub, setCheckingGithub] = useState(false);

  // Settings State
  const [projectUrl, setProjectUrl] = useState(localStorage.getItem('supabaseProjectUrl') || '');
  const [anonKey, setAnonKey] = useState(localStorage.getItem('supabaseAnonKey') || '');
  const [showSettings, setShowSettings] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCar, setCurrentCar] = useState<Partial<Car>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin');
      return;
    }
    fetchRealData();
    checkGithubStatus();
  }, [navigate]);

  const checkGithubStatus = async () => {
    setCheckingGithub(true);
    try {
      const response = await fetch('/api/github/status');
      const data = await response.json();
      setGithubStatus(data);
    } catch (error) {
      setGithubStatus({ connected: false, error: 'Failed to fetch status' });
    } finally {
      setCheckingGithub(false);
    }
  };

  const fetchRealData = async () => {
    setLoading(true);
    setConnectionError('');
    try {
      // Fetch Cars
      const { data: carsData, error: carError } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (carError) {
        console.error("Error fetching cars:", carError);
        setConnectionError(carError.message);
        
        // Check for specific connection/setup errors
        // 42P01: Relation does not exist (Missing tables)
        // Failed to fetch: Network error or wrong URL
        if (carError.code === '42P01' || carError.code === 'PGRST205' || carError.message?.includes('does not exist') || carError.message?.includes('Failed to fetch')) {
            setIsConnected(false);
            setNeedsSetup(true);
            setLoading(false);
            return; // Stop execution here
        }
        
        // Only fallback if it's NOT a missing table error
        if (fleet.length === 0) setFleet([]); 
      } else if (carsData) {
        setIsConnected(true);
        // Map DB columns (snake_case) to App types (camelCase)
        const mappedCars: Car[] = carsData.map((c: any) => ({
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
          excessHourRate: c.excess_hour_rate
        }));
        setFleet(mappedCars);
      }

      // Fetch Bookings
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (bookingError) {
         if (bookingError.code === '42P01' || bookingError.code === 'PGRST205' || bookingError.message?.includes('does not exist')) {
             setNeedsSetup(true);
             setLoading(false);
             return;
         }
      } else if (bookingData) {
        setBookings(bookingData as Booking[]);
      }

    } catch (e: any) {
      console.error(e);
      setIsConnected(false);
      setConnectionError(e.message || "Unknown error occurred");
      setNeedsSetup(true); // Assume setup needed if completely failed
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    navigate('/admin');
  };

  const handleSaveSettings = () => {
    const trimmedUrl = projectUrl.trim();
    const trimmedKey = anonKey.trim();

    if (!trimmedUrl) {
        alert("Please enter a Project URL.");
        return;
    }

    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
        alert("Invalid URL. It must start with http:// or https://");
        return;
    }

    if (!trimmedKey) {
        alert("Please enter a valid API Key.");
        return;
    }
    
    localStorage.setItem('supabaseProjectUrl', trimmedUrl);
    localStorage.setItem('supabaseAnonKey', trimmedKey);
    window.location.reload();
  };

  const handleResetSettings = () => {
    localStorage.removeItem('supabaseProjectUrl');
    localStorage.removeItem('supabaseAnonKey');
    window.location.reload();
  };

  const openAddModal = () => {
    setCurrentCar({
      name: '',
      category: 'Sedan',
      features: [],
      imageUrl: '',
      pricePerDay: 1500,
      seats: '5',
      transmission: 'Automatic',
      fuelType: 'Unleaded',
      carWashFee: 200,
      excessHourRate: 200
    });
    setImageFile(null);
    setNewFeature('');
    setIsModalOpen(true);
  };

  const openEditModal = (car: Car) => {
    setCurrentCar({ ...car });
    setImageFile(null);
    setNewFeature('');
    setIsModalOpen(true);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setCurrentCar(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setCurrentCar(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      // Create a local preview
      setCurrentCar(prev => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
    }
  };

  const handleSaveCar = async () => {
    setIsSaving(true);
    
    try {
      if (!currentCar.name || !currentCar.category) {
        alert("Please fill in both the vehicle name and category.");
        setIsSaving(false);
        return;
      }

      let finalImageUrl = currentCar.imageUrl;

      // 1. Upload Image to Supabase Storage if a new file is selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        // Attempt upload
        const { error: uploadError } = await supabase.storage
            .from('car-images')
            .upload(fileName, imageFile);
        
        if (uploadError) {
             console.warn("Image upload issue:", uploadError);
             if (!finalImageUrl) finalImageUrl = 'https://via.placeholder.com/400x300?text=Car+Image';
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('car-images')
                .getPublicUrl(fileName);
            finalImageUrl = publicUrl;
        }
      }

      // 2. Prepare Data for DB (Convert to snake_case)
      const dbData = {
        name: currentCar.name,
        category: currentCar.category,
        price_per_day: currentCar.pricePerDay || 0,
        excess_hour_rate: currentCar.excessHourRate || 200,
        transmission: currentCar.transmission,
        fuel_type: currentCar.fuelType,
        seats: currentCar.seats,
        image_url: finalImageUrl,
        features: currentCar.features || [],
        car_wash_fee: currentCar.carWashFee || 0
      };

      if (currentCar.id) {
        // Update existing
        const { error } = await supabase.from('cars').update(dbData).eq('id', currentCar.id);
        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase.from('cars').insert([dbData]);
        if (error) throw error;
      }

      await fetchRealData(); // Refresh list
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error saving car", error);
      alert(`Save Failed: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCar = async (id: string) => {
    if (confirm("Are you sure you want to delete this vehicle permanently?")) {
      const { error } = await supabase.from('cars').delete().eq('id', id);
      if (error) {
        alert(`Delete Failed: ${error.message}`);
      } else {
        fetchRealData();
      }
    }
  };

  const updateBookingStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', id);
      
    if (error) {
      alert(`Update Failed: ${error.message}`);
    } else {
      // Optimistic update
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus as any } : b));
    }
  };

  const [newFeature, setNewFeature] = useState('');

  // SQL Script for Missing Tables
  const SQL_SCRIPT = `-- 1. Create Cars Table
create table if not exists public.cars (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  category text not null,
  price_per_day numeric not null,
  excess_hour_rate numeric default 200,
  seats text not null,
  transmission text not null,
  fuel_type text not null,
  image_url text,
  features text[] default '{}',
  car_wash_fee numeric default 0
);

-- Ensure missing columns exist in case table was created earlier
do $$
begin
  if not exists (select from information_schema.columns where table_name = 'cars' and column_name = 'excess_hour_rate') then
    alter table public.cars add column excess_hour_rate numeric default 200;
  end if;
  if not exists (select from information_schema.columns where table_name = 'cars' and column_name = 'car_wash_fee') then
    alter table public.cars add column car_wash_fee numeric default 0;
  end if;
end $$;

-- 3. Force Schema Cache Reload
notify pgrst, 'reload schema';

-- 2. Create Bookings Table
create table if not exists public.bookings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_name text not null,
  user_email text,
  contact_number text not null,
  facebook_account text,
  pickup_location text,
  dropoff_location text,
  start_date timestamp with time zone,
  duration text,
  car_type text,
  special_requests text,
  status text default 'Pending'
);

-- 3. Create Admin Settings Table
create table if not exists public.admin_settings (
  id text primary key,
  value text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create Storage Bucket (If not exists)
insert into storage.buckets (id, name, public) 
values ('car-images', 'car-images', true)
on conflict (id) do nothing;

-- 4. Enable RLS
alter table public.cars enable row level security;
alter table public.bookings enable row level security;
alter table public.admin_settings enable row level security;

-- 5. Create Policies (Drop first to avoid "already exists" errors)
-- Admin Settings Policies
drop policy if exists "Public Read Admin Settings" on public.admin_settings;
create policy "Public Read Admin Settings" on public.admin_settings for select using (true);

drop policy if exists "Public Update Admin Settings" on public.admin_settings;
create policy "Public Update Admin Settings" on public.admin_settings for update using (true);

drop policy if exists "Public Insert Admin Settings" on public.admin_settings;
create policy "Public Insert Admin Settings" on public.admin_settings for insert with check (true);

-- Cars Policies
drop policy if exists "Public Read Cars" on public.cars;
create policy "Public Read Cars" on public.cars for select using (true);

drop policy if exists "Public Write Cars" on public.cars;
create policy "Public Write Cars" on public.cars for insert with check (true);

drop policy if exists "Public Update Cars" on public.cars;
create policy "Public Update Cars" on public.cars for update using (true);

drop policy if exists "Public Delete Cars" on public.cars;
create policy "Public Delete Cars" on public.cars for delete using (true);

-- Bookings Policies
drop policy if exists "Public Read Bookings" on public.bookings;
create policy "Public Read Bookings" on public.bookings for select using (true);

drop policy if exists "Public Write Bookings" on public.bookings;
create policy "Public Write Bookings" on public.bookings for insert with check (true);

drop policy if exists "Public Update Bookings" on public.bookings;
create policy "Public Update Bookings" on public.bookings for update using (true);

-- Storage Policies
drop policy if exists "Public Access Storage" on storage.objects;
create policy "Public Access Storage" on storage.objects for select using ( bucket_id = 'car-images' );

drop policy if exists "Public Insert Storage" on storage.objects;
create policy "Public Insert Storage" on storage.objects for insert with check ( bucket_id = 'car-images' );
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(SQL_SCRIPT);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (needsSetup) {
      return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
             <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-700">
                <div className="text-center mb-6">
                    <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Database className="text-red-600" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Database Connection Issue</h1>
                    {connectionError && (
                         <div className="mt-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-mono inline-block border border-red-100">
                            Error: {connectionError}
                        </div>
                    )}
                </div>

                {/* Connection Settings */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <Settings size={18} /> Connection Settings
                        </h3>
                     </div>
                     
                     <p className="text-sm text-slate-600 mb-4">
                        If you have created your Supabase project, please enter your credentials here. You can find these in your Supabase Dashboard under <strong>Project Settings &gt; API</strong>.
                     </p>

                     {localStorage.getItem('supabaseProjectUrl') && (
                        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                          <AlertCircle className="text-amber-600 shrink-0" size={18} />
                          <div className="text-xs text-amber-800">
                            <p className="font-bold mb-1">Using Custom Credentials</p>
                            <p>The app is currently using credentials saved in this browser's local storage. This overrides the system environment variables.</p>
                          </div>
                        </div>
                      )}

                     <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Project URL</label>
                            <input 
                                type="text" 
                                value={projectUrl} 
                                onChange={(e) => setProjectUrl(e.target.value)}
                                placeholder="https://your-project.supabase.co"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-orange-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Anon Public Key</label>
                            <input 
                                type="password" 
                                value={anonKey} 
                                onChange={(e) => setAnonKey(e.target.value)}
                                placeholder="your-anon-key"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-orange-500 outline-none"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={handleSaveSettings}
                                className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition-colors flex items-center gap-2"
                            >
                                <RefreshCw size={16} /> Save & Connect
                            </button>
                             <button 
                                onClick={handleResetSettings}
                                className="text-slate-500 text-sm hover:text-red-600 underline"
                            >
                                Reset to Default
                            </button>
                        </div>
                     </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                    <h3 className="font-bold text-slate-800 mb-2 text-sm uppercase tracking-wide">Connected, but missing tables?</h3>
                    <p className="text-sm text-slate-600 mb-4">Run this SQL script in your Supabase SQL Editor to create the necessary tables.</p>
                    
                    <div className="relative">
                        <div className="absolute top-0 right-0 p-2">
                            <button 
                                onClick={copyToClipboard}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    copySuccess ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                            >
                                {copySuccess ? <><Check size={14}/> Copied!</> : <><Copy size={14}/> Copy SQL</>}
                            </button>
                        </div>
                        <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl text-xs overflow-auto h-40 font-mono border border-slate-700">
                            {SQL_SCRIPT}
                        </pre>
                    </div>
                </div>
                
                <div className="mt-8 text-center space-y-3">
                    <button onClick={() => window.location.reload()} className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors w-full sm:w-auto">
                        Refresh Page
                    </button>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => setNeedsSetup(false)} className="text-slate-400 text-sm hover:text-slate-600">
                            Back to Dashboard
                        </button>
                    </div>
                </div>
             </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="bg-orange-600 p-1.5 rounded text-white font-bold">SC</div>
            <span className="text-lg font-bold tracking-tight text-white">ADMIN PANEL</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            <button 
              onClick={() => setActiveTab('fleet')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'fleet' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
                <LayoutDashboard size={20} /> Fleet Manager
            </button>
            <button 
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'bookings' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
                <Users size={20} /> Bookings
            </button>
            
            <button 
              onClick={() => setNeedsSetup(true)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-slate-400 hover:text-white hover:bg-slate-800`}
            >
                <Database size={20} /> Database Setup
            </button>

            <div className="pt-4 mt-4 border-t border-slate-800">
                <div className="px-4 py-2">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Status</h3>
                        <button 
                            onClick={checkGithubStatus}
                            disabled={checkingGithub}
                            className="p-1 hover:bg-slate-800 rounded-md transition-colors text-slate-500 hover:text-white disabled:opacity-50"
                            title="Refresh Status"
                        >
                            <RefreshCw size={12} className={checkingGithub ? 'animate-spin' : ''} />
                        </button>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">GitHub API</span>
                            {checkingGithub ? (
                                <Loader2 size={12} className="animate-spin text-slate-500" />
                            ) : (
                                <span className={`flex items-center gap-1 ${githubStatus?.connected ? 'text-green-400' : 'text-red-400'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${githubStatus?.connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                    {githubStatus?.connected ? 'Connected' : 'Disconnected'}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Supabase DB</span>
                            <span className={`flex items-center gap-1 ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                {isConnected ? 'Connected' : 'Disconnected'}
                            </span>
                        </div>
                        {githubStatus?.connected && githubStatus.user && (
                            <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg">
                                <img src={githubStatus.user.avatar_url} alt="" className="w-6 h-6 rounded-full" />
                                <div className="overflow-hidden">
                                    <p className="text-[10px] font-bold text-white truncate">{githubStatus.user.login}</p>
                                    <p className="text-[8px] text-slate-500 truncate">App Connection</p>
                                </div>
                            </div>
                        )}
                        {!githubStatus?.connected && !checkingGithub && (
                            <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-[10px] text-red-400 font-bold mb-1">
                                    {githubStatus?.error === 'GITHUB_TOKEN not configured' ? 'Action Required:' : 'Connection Error:'}
                                </p>
                                <p className="text-[9px] text-slate-400 leading-tight">
                                    {githubStatus?.error === 'GITHUB_TOKEN not configured' ? (
                                        <div className="space-y-1">
                                            <p>Go to <span className="text-white font-bold">Settings</span> menu and set <span className="text-orange-400 font-bold">GITHUB_TOKEN</span>.</p>
                                            
                                            {githubStatus?.isProduction && (
                                                <div className="p-1.5 bg-orange-500/20 border border-orange-500/30 rounded mt-1">
                                                    <p className="text-[8px] text-orange-200 font-bold uppercase mb-0.5">Deployment Sync Required</p>
                                                    <p className="text-[8px] text-orange-300 leading-tight">
                                                        You are running the <span className="font-bold">Shared App</span>. Changes to settings require you to click <span className="text-white font-bold underline">"Share"</span> again in AI Studio to update the deployment.
                                                    </p>
                                                </div>
                                            )}

                                            {githubStatus?.debug && (
                                                <div className="text-[8px] opacity-50 space-y-0.5">
                                                    <p>Status: {githubStatus.debug.exists ? `Found (${githubStatus.debug.length} chars)` : 'Not found in environment'}</p>
                                                    <p>Prefix: {githubStatus.debug.hasVitePrefix ? 'VITE_' : 'None'}</p>
                                                    <p>Token: {githubStatus.debug.tokenStart}</p>
                                                    {githubStatus.debug.axiosError && githubStatus.debug.axiosError !== 'none' && (
                                                        <p>Axios Code: {githubStatus.debug.axiosError}</p>
                                                    )}
                                                </div>
                                            )}
                                            <p className="text-[8px] text-orange-300/70 italic mt-1">Note: If using the Shared App, you must click "Share" again after updating settings.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            <span className="text-red-300 italic">{githubStatus?.error || 'Unknown error'}</span>
                                            {githubStatus?.statusCode && (
                                                <p className="text-[8px] opacity-50">HTTP Status: {githubStatus.statusCode}</p>
                                            )}
                                            {githubStatus?.debug && (
                                                <div className="text-[8px] opacity-50 space-y-0.5">
                                                    <p>Status: {githubStatus.debug.exists ? `Found (${githubStatus.debug.length} chars)` : 'Not found in environment'}</p>
                                                    <p>Prefix: {githubStatus.debug.hasVitePrefix ? 'VITE_' : 'None'}</p>
                                                    <p>Token: {githubStatus.debug.tokenStart}</p>
                                                    {githubStatus.debug.axiosError && githubStatus.debug.axiosError !== 'none' && (
                                                        <p>Axios Code: {githubStatus.debug.axiosError}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
        <div className="p-4 border-t border-slate-800">
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm w-full px-2">
                <LogOut size={16} /> Sign Out
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen">
        <div className="p-8 pb-24">
            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                          {activeTab === 'fleet' ? 'Fleet Management' : 'Booking Requests'}
                        </h1>
                        <p className="text-slate-500">
                          {activeTab === 'fleet' ? 'Manage your prices and images' : 'View customer inquiries'}
                        </p>
                    </div>
                    {isConnected !== null && (
                        <div className={`hidden lg:flex px-3 py-1 rounded-full text-xs font-bold items-center gap-1.5 ${isConnected ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                            <span className="max-w-[150px] truncate" title={getSupabaseConfig().url}>
                                {isConnected ? `Connected: ${getSupabaseConfig().url}` : 'Supabase Disconnected'}
                            </span>
                        </div>
                    )}
                </div>
                <div className="md:hidden">
                    <button onClick={handleLogout} className="bg-white p-2 rounded-lg shadow-sm text-red-500"><LogOut size={20} /></button>
                </div>
            </header>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 size={40} className="animate-spin text-orange-600" />
                </div>
            ) : (
                <>
                {activeTab === 'fleet' ? (
                /* FLEET TAB */
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative flex-1 md:max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input type="text" placeholder="Search vehicle..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                        </div>
                        <button onClick={openAddModal} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition-colors flex items-center gap-2">
                            <Plus size={16} /> Add Vehicle
                        </button>
                    </div>
                    {fleet.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <AlertCircle className="mx-auto mb-3 opacity-50" size={48} />
                            <p>No vehicles found in database. Click "Add Vehicle" to start.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                        <th className="p-4 font-bold border-b border-slate-100">Vehicle</th>
                                        <th className="p-4 font-bold border-b border-slate-100">Category</th>
                                        <th className="p-4 font-bold border-b border-slate-100">Daily Rate</th>
                                        <th className="p-4 font-bold border-b border-slate-100 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {fleet.map((car) => (
                                        <tr key={car.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 border-b border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                                                        <img src={car.imageUrl || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-slate-900 block">{car.name}</span>
                                                        <span className="text-xs text-slate-400">{car.fuelType} • {car.transmission}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 border-b border-slate-100">
                                                <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold uppercase border border-slate-200">{car.category}</span>
                                            </td>
                                            <td className="p-4 border-b border-slate-100 font-bold text-orange-600">
                                                ₱{car.pricePerDay.toLocaleString()}
                                            </td>
                                            <td className="p-4 border-b border-slate-100 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => openEditModal(car)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button onClick={() => handleDeleteCar(car.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                ) : (
                /* BOOKINGS TAB */
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {bookings.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                             <AlertCircle className="mx-auto mb-3 opacity-50" size={48} />
                             <p>No bookings yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                        <th className="p-4 font-bold border-b border-slate-100">Customer</th>
                                        <th className="p-4 font-bold border-b border-slate-100">Trip Details</th>
                                        <th className="p-4 font-bold border-b border-slate-100">Requested Car</th>
                                        <th className="p-4 font-bold border-b border-slate-100">Status</th>
                                        <th className="p-4 font-bold border-b border-slate-100 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {bookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 border-b border-slate-100">
                                                <div className="font-bold text-slate-900">{booking.user_name}</div>
                                                <div className="text-xs text-slate-500">{booking.contact_number}</div>
                                                {booking.facebook_account && (
                                                    <div className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                                                        <Facebook size={10} /> {booking.facebook_account}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 border-b border-slate-100">
                                                <div className="flex items-center gap-1 text-slate-600">
                                                    <Calendar size={12}/> 
                                                    {booking.start_date ? new Date(booking.start_date).toLocaleDateString() : 'N/A'}
                                                </div>
                                                <div className="text-xs text-slate-400">{booking.duration} • {booking.pickup_location}</div>
                                            </td>
                                            <td className="p-4 border-b border-slate-100 text-slate-900 font-medium">
                                                {booking.car_type}
                                            </td>
                                            <td className="p-4 border-b border-slate-100">
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${
                                                booking.status === 'Pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                                                booking.status === 'Confirmed' ? 'bg-green-50 text-green-600 border-green-200' :
                                                'bg-slate-100 text-slate-500 border-slate-200'
                                                }`}>
                                                {booking.status}
                                                </span>
                                            </td>
                                            <td className="p-4 border-b border-slate-100 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => updateBookingStatus(booking.id, 'Confirmed')}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Confirm"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => updateBookingStatus(booking.id, 'Cancelled')}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Reject"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                )}
                </>
            )}
        </div>
      </main>

      {/* EDIT/ADD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900">
                {currentCar.id ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Vehicle Image</label>
                <div className="relative group cursor-pointer border-2 border-dashed border-slate-300 rounded-xl p-4 hover:border-orange-500 transition-colors text-center bg-slate-50">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {currentCar.imageUrl ? (
                    <img src={currentCar.imageUrl} alt="Preview" className="h-40 w-full object-cover rounded-lg" />
                  ) : (
                    <div className="py-8">
                      <Upload className="mx-auto text-slate-400 mb-2" size={32} />
                      <p className="text-sm text-slate-500">Click to upload image</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-700">Name</label>
                  <input 
                    type="text" 
                    value={currentCar.name || ''} 
                    onChange={e => setCurrentCar(prev => ({...prev, name: e.target.value}))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700">Category</label>
                  <select 
                     value={currentCar.category || 'Sedan'}
                     onChange={e => setCurrentCar(prev => ({...prev, category: e.target.value as any}))}
                     className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  >
                    {['Hatchback', 'Sedan', 'SUV', 'Van', 'MPV', 'Pickup', 'L300'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-700">Price (₱)</label>
                  <input 
                    type="number" 
                    value={currentCar.pricePerDay ?? ''} 
                    onChange={e => {
                        const val = e.target.value;
                        setCurrentCar(prev => ({...prev, pricePerDay: val === '' ? undefined : parseFloat(val)}));
                    }}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono"
                  />
                </div>
                 <div>
                   <label className="text-sm font-bold text-slate-700">Transmission</label>
                   <select 
                     value={currentCar.transmission || 'Automatic'}
                     onChange={e => setCurrentCar(prev => ({...prev, transmission: e.target.value as any}))}
                     className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-700">Excess Hour Rate (₱)</label>
                  <input 
                    type="number" 
                    value={currentCar.excessHourRate ?? ''} 
                    onChange={e => {
                        const val = e.target.value;
                        setCurrentCar(prev => ({...prev, excessHourRate: val === '' ? undefined : parseFloat(val)}));
                    }}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700">Seats</label>
                  <input 
                    type="text" 
                    value={currentCar.seats || ''} 
                    onChange={e => setCurrentCar(prev => ({...prev, seats: e.target.value}))}
                    placeholder="e.g., 5"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="text-sm font-bold text-slate-700">Fuel</label>
                  <select 
                     value={currentCar.fuelType || 'Unleaded'}
                     onChange={e => setCurrentCar(prev => ({...prev, fuelType: e.target.value as any}))}
                     className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="Unleaded">Unleaded</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>
                 <div>
                    <label className="text-sm font-bold text-slate-700">Car Wash Fee (₱)</label>
                    <input 
                        type="number" 
                        value={currentCar.carWashFee ?? ''} 
                        onChange={e => {
                            const val = e.target.value;
                            setCurrentCar(prev => ({...prev, carWashFee: val === '' ? undefined : parseFloat(val)}));
                        }}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono"
                    />
                  </div>
              </div>

              {/* Features Editor */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Features</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newFeature}
                    onChange={e => setNewFeature(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && addFeature()}
                    placeholder="Add a feature (e.g. Bluetooth)"
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  />
                  <button 
                    onClick={addFeature}
                    className="bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-sm font-bold hover:bg-slate-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(currentCar.features || []).map((feature, idx) => (
                    <span key={idx} className="bg-orange-50 text-orange-700 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 border border-orange-100">
                      {feature}
                      <button onClick={() => removeFeature(idx)} className="hover:text-red-600">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveCar}
                disabled={isSaving}
                className="flex-1 py-3 bg-slate-900 text-white font-bold hover:bg-black rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isSaving ? 'Saving...' : <><Save size={18} /> Save Vehicle</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};