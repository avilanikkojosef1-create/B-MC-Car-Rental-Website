import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Mail, Phone, MapPin, Lock } from 'lucide-react';
import { APP_NAME } from '../constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-slate-300 pt-16 pb-8 border-t border-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-12 w-12 overflow-hidden rounded-lg shadow-md">
                <img 
                  src="https://lh3.googleusercontent.com/d/1NTrmuXUBS1UbbUHXLCP3lF0RIo_NOGJN" 
                  alt={APP_NAME} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">{APP_NAME}</span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed text-sm">
              The wheels that take you there. Premium car rental services in Tacloban City, Leyte, and Samar.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61565879651066" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-secondary transition-colors" 
                title="Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
            
            <div className="mt-4 text-xs text-slate-500">
               <p>FB: B&MC CAR RENTAL Tacloban</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6 border-b-2 border-secondary inline-block pb-1">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/terms" className="hover:text-secondary transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-secondary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/faq" className="hover:text-secondary transition-colors">FAQ</Link></li>
              <li><Link to="/requirements" className="hover:text-secondary transition-colors">Rental Requirements</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-2">
            <h4 className="text-white font-semibold text-lg mb-6 border-b-2 border-secondary inline-block pb-1">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-secondary mt-1 flex-shrink-0" />
                <span className="text-sm">Brgy 74 Nula tula Tacloban City, Tacloban City, Philippines, 6500</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-secondary flex-shrink-0" />
                <span className="text-sm font-mono">0926 841 6776</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-secondary flex-shrink-0" />
                <span className="text-sm">carrentalbmc@gmail.com</span>
              </li>
            </ul>
            
            {/* Social Media Promo Replacement */}
            <div className="mt-8 border-t border-slate-800 pt-6">
                <h5 className="text-secondary font-bold mb-2 text-sm uppercase tracking-wide">Get Exclusive Deals</h5>
                <p className="text-slate-400 text-sm mb-4">
                    Follow us on Facebook to catch our latest travel promos and discount vouchers!
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                    {APP_NAME} provides reliable <span className="text-slate-400">car rental Tacloban City</span> services across Leyte, Philippines. From <span className="text-slate-400">Tacloban airport car rental</span> to long-term <span className="text-slate-400">self drive</span> options, we are your trusted travel partner in the region.
                </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
             <Link to="/admin" className="flex items-center gap-1 hover:text-white transition-colors text-slate-400 font-medium">
                <Lock size={14} /> Admin
             </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};