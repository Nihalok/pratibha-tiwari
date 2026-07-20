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
      isScrolled ? 'py-2' : 'py-4 sm:py-6'
    }`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="relative flex items-center justify-between px-4 sm:px-5 md:px-8 xl:px-10 py-3 rounded-full border border-white/40 backdrop-blur-xl transition-all duration-500 bg-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-white/20 z-[105]">

          {/* Logo */}
          <div className="flex items-center h-11 w-24 sm:w-32 md:w-40 xl:w-48 relative shrink-0">
            <div className="absolute left-0 top-1/2 -translate-y-[50%] z-20">
              <BrandLogo 
                className="scale-[0.30] sm:scale-[0.36] md:scale-[0.42] origin-left drop-shadow-xl" 
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              />
            </div>
          </div>

          {/* Desktop Nav — visible only at lg+ */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-10">
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
                    size={16} 
                    className={`transition-colors duration-300 ${
                      isActive ? 'text-gold' : 'text-primary/70 group-hover/nav:text-gold'
                    }`} 
                  />
                  <span 
                    className={`text-[9px] xl:text-[10px] uppercase tracking-[0.15em] xl:tracking-[0.2em] font-bold transition-colors duration-300 ${
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

          {/* Right side: CTA + Hamburger */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* CTA only shows on lg+ where nav links are also visible */}
            <Link 
              to="/contact"
              className="hidden lg:flex items-center space-x-2 bg-secondary text-white px-5 xl:px-8 py-2.5 xl:py-3 rounded-full text-[10px] xl:text-xs font-bold uppercase tracking-widest hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 hover:scale-105 whitespace-nowrap"
            >
              <span>Consultation</span>
              <ArrowRight size={13} />
            </Link>

            {/* Hamburger — shows below lg */}
            <button 
              className="lg:hidden p-2 text-primary focus:outline-none cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Vertical Banner & Backdrop Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-primary/30 backdrop-blur-md z-[95] lg:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-full left-4 right-4 sm:left-6 sm:right-6 mt-3 p-5 sm:p-7 bg-white/95 backdrop-blur-2xl rounded-3xl border border-gold/20 shadow-[0_20px_50px_rgba(26,58,92,0.2)] z-[100] lg:hidden overflow-hidden"
            >
              <div className="flex flex-col space-y-2 mb-6">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href + '/'));
                  const Icon = link.icon;
                  return (
                    <Link 
                      key={link.name} 
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 border ${
                        isActive 
                          ? 'bg-gold/10 border-gold/30 text-gold font-bold shadow-sm' 
                          : 'border-slate-100/80 text-primary/80 hover:text-gold hover:bg-gold/5'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2.5 rounded-xl transition-colors ${isActive ? 'bg-gold/20 text-gold' : 'bg-primary/5 text-primary/70'}`}>
                          <Icon size={18} />
                        </div>
                        <span className="text-xs uppercase font-bold tracking-[0.2em]">{link.name}</span>
                      </div>
                      <ArrowRight size={14} className={`transition-transform ${isActive ? 'text-gold translate-x-1' : 'text-mist/50 opacity-60'}`} />
                    </Link>
                  );
                })}
              </div>
              <Link 
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-4 bg-secondary text-white rounded-2xl flex items-center justify-center space-x-3 font-bold uppercase tracking-widest text-xs shadow-xl shadow-secondary/20 hover:bg-secondary/90 active:scale-[0.98] transition-all"
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
