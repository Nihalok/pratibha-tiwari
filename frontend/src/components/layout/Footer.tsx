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
    <footer className="bg-primary text-white pt-12 sm:pt-16 md:pt-24 pb-8 sm:pb-12 mt-16 sm:mt-24 md:mt-32 border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">

        {/* Footer Main Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-8 pb-12 sm:pb-16 border-b border-white/10">
          
          {/* Brand Bio Column */}
          <div className="lg:col-span-5 space-y-6 flex flex-col items-start text-left">
            <BrandLogo 
              isLight 
              showTagline 
              className="scale-90 sm:scale-100 origin-left drop-shadow-md" 
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            />
            <p className="text-white/80 leading-relaxed text-sm sm:text-base max-w-md font-sans">
              Empowering executive leaders and global professionals through emotional intelligence, high-impact presence, and career sustainability.
            </p>

            {/* Social Badges Row */}
            <div className="flex items-center space-x-3 pt-2">
              {[
                { icon: Instagram, href: "https://www.instagram.com/coachpratibha/", label: "Instagram" },
                { icon: Facebook, href: "https://www.facebook.com/lifecoachpratibha", label: "Facebook" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/coachpratibhatiwari/", label: "LinkedIn" },
                { icon: Youtube, href: "https://www.youtube.com/channel/UC6FaarE5WYbyY6S5P7OPJxQ", label: "YouTube" },
                { icon: Music, href: "https://podcasters.spotify.com/pod/show/pratibha-tiwari8", label: "Spotify Podcast" }
              ].map((soc, i) => {
                const Icon = soc.icon;
                return (
                  <a 
                    key={i}
                    href={soc.href}
                    target="_blank" 
                    rel="noreferrer"
                    aria-label={soc.label}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-gold hover:bg-gold hover:text-primary transition-all duration-300 flex items-center justify-center text-white/90 shadow-sm"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Stack */}
          <div className="lg:col-span-2 text-left space-y-4">
            <h5 className="font-mono text-xs uppercase tracking-[0.25em] text-gold font-bold">Navigation</h5>
            <ul className="space-y-3 text-white/80 text-sm font-medium">
              <li><Link to="/" className="hover:text-gold transition-colors block">Home</Link></li>
              <li><Link to="/about" className="hover:text-gold transition-colors block">About Story</Link></li>
              <li><Link to="/services" className="hover:text-gold transition-colors block">Pathways & Programs</Link></li>
              <li><Link to="/career-assessment" className="hover:text-gold transition-colors block">Career Assessment</Link></li>
              <li><Link to="/insights" className="hover:text-gold transition-colors block">Insights & Media</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition-colors block">Contact Hub</Link></li>
            </ul>
          </div>

          {/* Programs Stack */}
          <div className="lg:col-span-2 text-left space-y-4">
            <h5 className="font-mono text-xs uppercase tracking-[0.25em] text-gold font-bold">Programs</h5>
            <ul className="space-y-3 text-white/80 text-sm font-medium">
              <li><Link to="/services#executive-coaching" onClick={() => handleLinkClick('executive-coaching')} className="hover:text-gold transition-colors block">Executive Coaching</Link></li>
              <li><Link to="/services#corporate-training" onClick={() => handleLinkClick('corporate-training')} className="hover:text-gold transition-colors block">Corporate Training</Link></li>
              <li><Link to="/services#career-shaping" onClick={() => handleLinkClick('career-shaping')} className="hover:text-gold transition-colors block">Career Shaping</Link></li>
              <li><Link to="/services#executive-coaching" onClick={() => handleLinkClick('executive-coaching')} className="hover:text-gold transition-colors block">EI Workshops</Link></li>
              <li><Link to="/services#purposeful-leadership" onClick={() => handleLinkClick('purposeful-leadership')} className="hover:text-gold transition-colors block">Purposeful Leadership</Link></li>
            </ul>
          </div>

          {/* Direct Advisory Stack */}
          <div className="lg:col-span-3 text-left space-y-4">
            <h5 className="font-mono text-xs uppercase tracking-[0.25em] text-gold font-bold">Global Hub</h5>
            <div className="space-y-3 text-white/80 text-sm font-medium">
              <p className="text-white/90">Abu Dhabi, United Arab Emirates</p>
              <p className="text-white/70 text-xs">Global Virtual & In-Person Engagements</p>
              <div className="pt-2">
                <a 
                  href="https://calendly.com/dsdtrainings/30min" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center space-x-2 bg-secondary text-white px-5 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gold hover:text-primary transition-all duration-300 shadow-lg"
                >
                  <span>Book Strategy Call</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom Legal Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
          <p className="text-white/60 text-xs font-mono">
            © 2026 Pratibha Tiwari · Design Super Destiny. All Rights Reserved.
          </p>
          <div className="flex space-x-6 text-white/70 text-xs font-medium">
            <Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
