/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Instagram, Facebook, Linkedin, Youtube, Music, ArrowRight } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleLinkClick = (anchorId: string) => {
    if (location.pathname === '/services') {
      const element = document.getElementById(anchorId);
      if (element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetY = rect.top + scrollTop - 112; // 112px offset for sticky navbar
        if ((window as any).lenis) {
          (window as any).lenis.scrollTo(targetY, { immediate: false });
        } else {
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <footer className="bg-primary text-white pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10 mt-12 sm:mt-16 md:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ROW 2: Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-16 text-center sm:text-left">
          <div className="space-y-6 flex flex-col items-center sm:items-start col-span-1 sm:col-span-2 lg:col-span-1">
            <BrandLogo 
              isLight 
              showTagline 
              className="scale-90 origin-center sm:origin-left" 
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            />
            <p className="text-white/80 leading-relaxed text-sm sm:text-base max-w-sm">
              Empowering people through communication, confidence, and leadership. Based in Abu Dhabi, UAE.
            </p>
            <div className="flex justify-center sm:justify-start space-x-4">
              <a href="https://www.instagram.com/coachpratibha/" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors p-1" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="https://www.facebook.com/lifecoachpratibha" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors p-1" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="https://www.linkedin.com/in/coachpratibhatiwari/" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors p-1" aria-label="LinkedIn"><Linkedin size={20} /></a>
              <a href="https://www.youtube.com/channel/UC6FaarE5WYbyY6S5P7OPJxQ" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors p-1" aria-label="YouTube"><Youtube size={20} /></a>
              <a href="https://podcasters.spotify.com/pod/show/pratibha-tiwari8" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors p-1" aria-label="Spotify Podcast"><Music size={20} /></a>
            </div>
          </div>

          <div>
            <h5 className="font-mono text-xs uppercase tracking-widest text-gold font-bold mb-4 sm:mb-6">Navigation</h5>
            <ul className="space-y-3 sm:space-y-4 text-white/80 text-sm">
              <li><Link to="/" className="hover:text-gold transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-gold transition-colors">About Story</Link></li>
              <li><Link to="/services" className="hover:text-gold transition-colors">Pathways & Programs</Link></li>
              <li><Link to="/insights" className="hover:text-gold transition-colors">Insights & Media</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition-colors">Contact Hub</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-xs uppercase tracking-widest text-gold font-bold mb-4 sm:mb-6">Programs</h5>
            <ul className="space-y-3 sm:space-y-4 text-white/80 text-sm">
              <li><Link to="/services#executive-coaching" onClick={() => handleLinkClick('executive-coaching')} className="hover:text-gold transition-colors">Executive Coaching</Link></li>
              <li><Link to="/services#corporate-training" onClick={() => handleLinkClick('corporate-training')} className="hover:text-gold transition-colors">Corporate Training</Link></li>
              <li><Link to="/services#career-shaping" onClick={() => handleLinkClick('career-shaping')} className="hover:text-gold transition-colors">Career Shaping</Link></li>
              <li><Link to="/services#executive-coaching" onClick={() => handleLinkClick('executive-coaching')} className="hover:text-gold transition-colors">EI Workshops</Link></li>
              <li><Link to="/services#purposeful-leadership" onClick={() => handleLinkClick('purposeful-leadership')} className="hover:text-gold transition-colors">Purposeful Leadership</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-xs uppercase tracking-widest text-gold font-bold mb-4 sm:mb-6">Contact Hub</h5>
            <ul className="space-y-3 sm:space-y-4 text-white/80 text-sm">
              <li>Abu Dhabi, UAE</li>
              <li>Global Digital Delivery</li>
              <li><a href="https://calendly.com/dsdtrainings/30min" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors text-gold font-medium">Book a Session</a></li>
            </ul>
          </div>
        </div>

        {/* ROW 3: Legal */}
        <div className="border-t border-white/10 pt-6 sm:pt-10 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 text-center sm:text-left">
          <p className="text-white/70 text-xs sm:text-sm">
            © 2026 Pratibha Tiwari · Design Super Destiny. All Rights Reserved.
          </p>
          <div className="flex space-x-6 sm:space-x-8 text-white/70 text-xs sm:text-sm">
            <Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
