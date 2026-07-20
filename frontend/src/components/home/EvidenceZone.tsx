/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const staticTestimonials = [
  {
    text: "Pratibha's communication coaching completely transformed my confidence and presentation skills. I got the promotion I'd been chasing for 3 years.",
    name: "Senior Manager",
    location: "UAE"
  },
  {
    text: "Her emotional intelligence workshops changed the way I communicate with my team and family. Genuinely life-changing.",
    name: "Operations Director",
    location: "Abu Dhabi"
  },
  {
    text: "The sessions are practical, powerful, and deeply personal. She sees through you in the best possible way.",
    name: "Entrepreneur",
    location: "Dubai"
  },
  {
    text: "After attending Pratibha's personality development classes, my son changed completely — more confident, greeting people, answering in school with confidence.",
    name: "Parent",
    location: "Abu Dhabi"
  }
];

export default function EvidenceZone() {
  const [items, setItems] = useState<any[]>(staticTestimonials);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const fetchReal = async () => {
      try {
        const response = await fetch('/api/testimonials/home', { signal: controller.signal });
        clearTimeout(timeoutId);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && data.data.length > 0) {
            const dynamicItems = data.data.map((t: any) => ({
              text: t.quote,
              name: t.name,
              location: t.title || 'Client'
            }));
            setItems([...dynamicItems, ...staticTestimonials.filter(st => !dynamicItems.some(di => di.name === st.name))]);
          }
        }
      } catch (_e) {
        // Silently fall back to static testimonials
      }
    };
    fetchReal();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % items.length);
  const prev = () => setCurrent((prev) => (prev - 1 + items.length) % items.length);

  return (
    <section className="py-32 bg-transparent relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 text-[18vw] font-serif italic text-primary select-none pointer-events-none -translate-y-1/2 -translate-x-1/4">
        Evidence
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="font-mono text-[10px] uppercase tracking-[0.6em] text-secondary mb-6 block font-bold"
            >
              Proven Transformation
            </motion.span>
            <h2 className="text-6xl lg:text-7xl font-serif text-primary leading-tight italic">The <span className="not-italic">Legacy of Voice.</span></h2>
          </div>
          <div className="flex space-x-6 pb-2">
            <button 
              onClick={prev} 
              className="w-14 h-14 rounded-full border border-gold/30 flex items-center justify-center text-primary hover:bg-secondary hover:border-secondary hover:text-white transition-all duration-500 group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={next} 
              className="w-14 h-14 rounded-full border border-gold/30 flex items-center justify-center text-primary hover:bg-secondary hover:border-secondary hover:text-white transition-all duration-500 group"
            >
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="relative h-[550px] md:h-[450px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <div className="bg-white p-12 lg:p-24 rounded-[60px] shadow-[0_50px_100px_-20px_rgba(26,58,92,0.08)] border border-gold/5 relative flex flex-col justify-center h-full overflow-hidden group">
                {/* Decorative gold quote */}
                <div className="absolute -top-10 -right-10 text-[200px] font-serif italic text-gold pointer-events-none group-hover:text-gold transition-colors duration-700 select-none">
                  "
                </div>

                <div className="relative z-10 space-y-12">
                  <div className="space-y-4">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                      ))}
                    </div>
                    <blockquote className="text-3xl md:text-4xl lg:text-5xl font-serif text-primary italic leading-[1.1] tracking-tight font-light">
                      "{items[current].text}"
                    </blockquote>
                  </div>
                  
                  <div className="flex items-center space-x-8 pt-4">
                    <div className="w-20 h-px bg-secondary opacity-30" />
                    <div>
                      <div className="text-2xl font-serif text-primary tracking-wide">{items[current].name}</div>
                      <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-mist mt-2 font-bold">{items[current].location}</div>
                    </div>
                  </div>
                </div>

                <div className="absolute right-12 bottom-12 flex items-center space-x-2 text-[9px] font-mono text-gold uppercase tracking-widest">
                  <span>Authorized Testimony</span>
                  <div className="w-1 h-1 rounded-full bg-gold/20" />
                  <span>{current + 1} / {items.length}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="max-w-2xl mx-auto mt-20 flex space-x-3 h-0.5">
          {items.map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrent(i)}
              className={`flex-1 transition-all duration-700 rounded-full ${i === current ? 'bg-secondary ring-4 ring-secondary/5' : 'bg-gold/10'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
