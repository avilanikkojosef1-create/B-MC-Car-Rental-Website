import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AIChat } from './components/AIChat';
import { Home } from './pages/Home';
import { Fleet } from './pages/Fleet';
import { Booking } from './pages/Booking';
import { TermsOfService } from './pages/TermsOfService';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { FAQ } from './pages/FAQ';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Hide Navbar on Admin pages if preferred, but keeping simple for now. 
            Ideally, check location and hide Nav/Footer for admin. */}
        <Routes>
          <Route path="/admin/*" element={null} />
          <Route path="*" element={<Navbar />} />
        </Routes>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/faq" element={<FAQ />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            <Route path="/requirements" element={
              <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Rental Requirements</h1>
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl text-left">
                  <ul className="list-disc space-y-3 text-slate-700 pl-5">
                    <li>Valid Driver's License</li>
                    <li>Government-issued ID for Deposit</li>
                    <li>Reservation fee of ₱500 (Non-refundable)</li>
                  </ul>
                </div>
              </div>
            } />
            <Route path="/about" element={
               <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50">
                  <h1 className="text-4xl font-bold text-slate-900 mb-4">About B&MC Car Rental Tacloban</h1>
                  <p className="max-w-2xl text-slate-600">B&MC CAR RENTAL Tacloban provides reliable car rental Tacloban City services across Leyte, Philippines. From Tacloban airport car rental to long-term self drive options, we are your trusted travel partner in the region.</p>
               </div>
            } />
            <Route path="/contact" element={
              <div className="min-h-screen bg-slate-50 py-12 px-4">
                <div className="max-w-5xl mx-auto">
                  <h1 className="text-4xl font-extrabold text-slate-900 mb-8 text-center">Contact Us</h1>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col justify-center">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Phone Number</h3>
                          <p className="text-2xl font-extrabold text-primary">0926 841 6776</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</h3>
                          <p className="text-xl font-bold text-slate-700">carrentalbmc@gmail.com</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Office Address</h3>
                          <p className="text-slate-600 leading-relaxed">
                            Brgy 74 Nula tula Tacloban City,<br />
                            Tacloban City, Philippines, 6500
                          </p>
                        </div>
                        <div className="pt-4">
                          <a 
                            href="https://www.facebook.com/profile.php?id=61565879651066" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                          >
                            Visit our Facebook Page
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Google Map */}
                    <div className="bg-white p-2 rounded-2xl shadow-lg h-[400px] overflow-hidden">
                      <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15655.844390317514!2d124.9782869!3d11.2384104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3308672000000001%3A0x7c7c7c7c7c7c7c7c!2sNula-Tula%2C%20Tacloban%20City%2C%20Leyte!5e0!3m2!1sen!2sph!4v1709110000000!5m2!1sen!2sph" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="B&MC Car Rental Tacloban Location"
                        className="rounded-xl"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            } />
             {/* Backward compatibility route */}
            <Route path="/locations" element={<div className="h-96 flex items-center justify-center text-2xl text-slate-400">See Contact Page for Location</div>} />
          </Routes>
        </main>
        
        <Routes>
          <Route path="/admin/*" element={null} />
          <Route path="*" element={<Footer />} />
        </Routes>
        <AIChat />
      </div>
    </Router>
  );
};

export default App;