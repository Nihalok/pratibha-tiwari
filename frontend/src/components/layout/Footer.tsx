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
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-primary text-white pt-20 pb-10 mt-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* ROW 2: Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <BrandLogo 
              isLight 
              showTagline 
              className="items-start text-left scale-90 origin-left" 
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            />
            <p className="text-white leading-relaxed">
              Empowering people through communication, confidence, and leadership. Based in Abu Dhabi, UAE.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/coachpratibha/" target="_blank" rel="noreferrer" className="hover:text-secondary transition-colors"><Instagram size={20} /></a>
              <a href="https://www.facebook.com/lifecoachpratibha" target="_blank" rel="noreferrer" className="hover:text-secondary transition-colors"><Facebook size={20} /></a>
              <a href="https://www.linkedin.com/in/coachpratibhatiwari/" target="_blank" rel="noreferrer" className="hover:text-secondary transition-colors"><Linkedin size={20} /></a>
              <a href="https://www.youtube.com/channel/UC6FaarE5WYbyY6S5P7OPJxQ" target="_blank" rel="noreferrer" className="hover:text-secondary transition-colors"><Youtube size={20} /></a>
              <a href="https://podcasters.spotify.com/pod/show/pratibha-tiwari8" target="_blank" rel="noreferrer" className="hover:text-secondary transition-colors"><Music size={20} /></a>
            </div>
          </div>

          <div>
            <h5 className="font-mono text-xs uppercase tracking-widest text-secondary mb-6">Navigation</h5>
            <ul className="space-y-4 text-white text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Story</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Pathways & Programs</Link></li>
              <li><Link to="/insights" className="hover:text-white transition-colors">Insights & Media</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Hub</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-xs uppercase tracking-widest text-secondary mb-6">Programs</h5>
            <ul className="space-y-4 text-white text-sm">
              <li><Link to="/services#executive-coaching" onClick={() => handleLinkClick('executive-coaching')} className="hover:text-white transition-colors">Executive Coaching</Link></li>
              <li><Link to="/services#corporate-training" onClick={() => handleLinkClick('corporate-training')} className="hover:text-white transition-colors">Corporate Training</Link></li>
              <li><Link to="/services#career-shaping" onClick={() => handleLinkClick('career-shaping')} className="hover:text-white transition-colors">Career Shaping</Link></li>
              <li><Link to="/services#executive-coaching" onClick={() => handleLinkClick('executive-coaching')} className="hover:text-white transition-colors">EI Workshops</Link></li>
              <li><Link to="/services#purposeful-leadership" onClick={() => handleLinkClick('purposeful-leadership')} className="hover:text-white transition-colors">Purposeful Leadership</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-xs uppercase tracking-widest text-secondary mb-6">Contact Hub</h5>
            <ul className="space-y-4 text-white text-sm">
              <li>Abu Dhabi, UAE</li>
              <li>Global Digital Delivery</li>
              <li><a href="https://calendly.com/dsdtrainings/30min" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Book a Session</a></li>
            </ul>
          </div>
        </div>

        {/* ROW 3: Legal */}
        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white text-sm">
            © 2026 Pratibha Tiwari · Design Super Destiny. All Rights Reserved.
          </p>
          <div className="flex space-x-8 text-white text-sm">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
