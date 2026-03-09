import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, CarFront } from 'lucide-react';
import { APP_NAME } from '../constants';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
    <Link
      to={to}
      className={`font-medium text-sm uppercase tracking-wide transition-colors ${
        isActive(to) ? 'text-primary font-bold' : 'text-slate-600 hover:text-primary'
      }`}
      onClick={() => setIsMenuOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-primary/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-14 w-14 overflow-hidden rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300">
              <img 
                src="https://lh3.googleusercontent.com/d/1NTrmuXUBS1UbbUHXLCP3lF0RIo_NOGJN" 
                alt={APP_NAME} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-black text-pitch-black tracking-tighter group-hover:text-primary transition-colors leading-none">{APP_NAME}</span>
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Rental Service</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/fleet">Our Fleet</NavLink>
            <NavLink to="/requirements">Requirements</NavLink>
            <NavLink to="/about">About Us</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <Link to="/booking" className="bg-accent text-white px-6 py-2.5 rounded-lg font-bold hover:bg-primary transition-colors shadow-lg shadow-accent/20 text-sm uppercase">
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-pitch-black hover:text-primary p-2"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-primary/10 absolute w-full left-0 shadow-xl z-50">
          <div className="px-6 pt-4 pb-8 space-y-4 flex flex-col">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/fleet">Our Fleet</NavLink>
            <NavLink to="/requirements">Requirements</NavLink>
            <NavLink to="/about">About Us</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <Link to="/booking" onClick={() => setIsMenuOpen(false)} className="w-full bg-accent text-white px-5 py-4 rounded-lg font-bold text-center uppercase tracking-wide hover:bg-primary transition-colors">
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
