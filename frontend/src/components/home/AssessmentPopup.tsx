/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AssessmentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasClosed, setHasClosed] = useState(false);

  const handleClose = () => {
    setIsVisible(false);
    setHasClosed(true);
  };

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (hasClosed) return;
          
          // Show after scrolling down 600px
          if (window.scrollY > 600) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasClosed]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
          exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            duration: 0.6 
          }}
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[100] w-[calc(100vw-2rem)] max-w-[380px] sm:w-[350px] md:w-[380px] pointer-events-auto"
        >
          <div className="relative group">
            {/* Background glass layer */}
            <div className="absolute inset-0 bg-white/90 backdrop-blur-2xl rounded-[32px] border border-gold/10 shadow-[0_20px_50px_rgba(26,58,92,0.15)] transition-all duration-500 group-hover:shadow-[0_40px_80px_rgba(197,163,101,0.2)]" />
            
            {/* Colorful animated border glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary/20 via-gold/20 to-primary/20 rounded-[34px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm pointer-events-none" />

            <div className="relative p-7 md:p-8 space-y-6">
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-mist hover:text-secondary hover:bg-secondary/5 rounded-full transition-all duration-300 z-50 cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="flex items-start space-x-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/10 to-gold/10 flex items-center justify-center shrink-0 relative group-hover:scale-110 transition-transform duration-500">
                  <Sparkles size={24} className="text-secondary animate-pulse" />
                  <div className="absolute inset-0 bg-secondary/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="space-y-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-secondary font-bold">Readiness Audit</span>
                  <h3 className="text-xl md:text-2xl font-serif text-primary leading-tight italic">
                    Is your career ready for the <span className="not-italic text-secondary">AI Era?</span>
                  </h3>
                </div>
              </div>

              <p className="text-mist text-sm font-normal leading-relaxed">
                Take the 90-second diagnostic Pratibha utilizes with global leadership circles to benchmark executive sustainability.
              </p>

              <Link 
                to="/career-assessment"
                className="flex items-center justify-between w-full bg-primary text-white p-5 rounded-2xl group/btn overflow-hidden relative transition-all active:scale-95 hover:shadow-xl hover:shadow-primary/20"
              >
                <div className="absolute inset-0 bg-secondary translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500 ease-out" />
                <span className="relative z-10 text-[10px] uppercase tracking-widest font-bold">Start Diagnostic</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>

              <div className="flex justify-center">
                <div className="flex items-center space-x-1 opacity-20">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-1 h-1 rounded-full bg-gold" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
