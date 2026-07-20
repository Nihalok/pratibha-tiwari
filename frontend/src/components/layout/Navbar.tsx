/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  MessageSquare, 
  Mail,
  Menu,
  X,
  ArrowRight
} from 'lucide-react';
import BrandLogo from './BrandLogo';

const navLinks = [
  { name: 'ABOUT', href: '/about', icon: User },
  { name: 'SERVICES', href: '/services', icon: Briefcase },
  { name: 'ASSESSMENT', href: '/career-assessment', icon: GraduationCap },
  { name: 'INSIGHTS', href: '/insights', icon: MessageSquare },
  { name: 'CONTACT', href: '/contact', icon: Mail },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
      isScrolled ? 'py-2' : 'py-6'
    }`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className={`relative flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 rounded-full border border-white/40 backdrop-blur-xl transition-all duration-500 bg-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-white/20 z-[105]`}>
          {/* Logo */}
          <div className="flex items-center h-12 w-28 md:w-44 relative">
            <div className="absolute left-0 top-1/2 -translate-y-[50%] z-20">
              <BrandLogo 
                className="scale-[0.32] md:scale-[0.42] origin-left drop-shadow-xl" 
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              />
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href + '/'));
              const Icon = link.icon;
              return (
                <Link 
                  key={link.name} 
                  to={link.href}
                  className="relative group/nav flex flex-col items-center space-y-1 py-1"
                >
                  <Icon 
                    size={18} 
                    className={`transition-colors duration-300 ${
                      isActive ? 'text-gold' : 'text-primary/70 group-hover/nav:text-gold'
                    }`} 
                  />
                  <span 
                    className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-colors duration-300 ${
                      isActive ? 'text-gold' : 'text-primary/70 group-hover/nav:text-gold'
                    }`}
                  >
                    {link.name}
                  </span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeNavLine"
                      className="absolute -bottom-1 left-2 right-2 h-0.5 bg-gold rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              to="/contact"
              className="hidden sm:flex items-center space-x-2 bg-secondary text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 hover:scale-105"
            >
              <span>Consultation</span>
              <ArrowRight size={14} />
            </Link>

            <button 
              className="lg:hidden p-2 text-primary focus:outline-none cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu & Backdrop Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[95] lg:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute top-full left-4 right-4 sm:left-6 sm:right-6 mt-3 p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-gold/20 shadow-2xl z-[100] lg:hidden"
            >
              <div className="grid grid-cols-2 gap-3 mb-6">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href + '/'));
                  const Icon = link.icon;
                  return (
                    <Link 
                      key={link.name} 
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 border ${
                        isActive 
                          ? 'bg-gold/10 border-gold/20 text-gold font-bold' 
                          : 'border-slate-100 text-primary/80 hover:text-gold hover:bg-gold/5'
                      }`}
                    >
                      <Icon size={22} className="transition-colors" />
                      <span className="text-[11px] uppercase font-bold tracking-widest mt-1.5 transition-colors">{link.name}</span>
                    </Link>
                  );
                })}
              </div>
              <Link 
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-4 bg-secondary text-white rounded-2xl flex items-center justify-center space-x-3 font-bold uppercase tracking-widest text-xs shadow-lg shadow-secondary/20"
              >
                <span>Book Consultation</span>
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
