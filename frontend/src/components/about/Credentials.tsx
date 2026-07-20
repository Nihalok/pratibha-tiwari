/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import CertificationsCarousel from './CertificationsCarousel';

const focusAreas = [
  'Executive Coaching',
  'AI Leadership',
  'Leadership Development',
  'Emotional Intelligence',
  'Executive Presence',
  'Corporate Training',
  'Executive Communication',
  'Career Coaching',
  'Public Speaking',
  'Personal Branding',
  'NLP Coaching',
  'Business Coaching'
];

export default function Credentials() {
  return (
    <section className="py-24 bg-pearl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="space-y-24">

          {/* Global Certifications - Elevated Carousel */}
          <div className="space-y-16">
            <div className="text-center space-y-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.6em] text-mist font-bold">Global Recognition</span>
              <h2 className="text-4xl md:text-6xl font-serif text-primary italic">Global Certifications</h2>
            </div>

            <CertificationsCarousel />
          </div>

          {/* Mastery & Focus - Premium Dark Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl sm:rounded-[3rem] overflow-hidden bg-secondary text-white p-6 sm:p-12 md:p-20 shadow-2xl"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/20 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 space-y-8 sm:space-y-16">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-10">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-px w-8 sm:w-10 bg-gold/40" />
                    <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.6em] text-gold font-bold">Domain Expertise</span>
                  </div>
                  <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif leading-tight italic">
                    Mastery <span className="text-gold">&</span> Focus
                  </h2>
                </div>
                <p className="max-w-md text-mist text-sm sm:text-lg font-normal leading-relaxed">
                  Bridging the gap between Human Intelligence and modern leadership through specialized methodologies and decades of practice.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 sm:gap-4">
                {focusAreas.map((area, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{
                      scale: 1.03,
                      backgroundColor: 'rgba(197, 160, 89, 0.1)',
                      borderColor: 'rgba(197, 160, 89, 0.4)'
                    }}
                    className="px-4 py-2 sm:px-6 sm:py-3.5 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs md:text-sm font-mono tracking-widest uppercase cursor-default transition-all duration-300 backdrop-blur-md group"
                  >
                    <span className="text-white group-hover:text-gold transition-colors">{area}</span>
                  </motion.div>
                ))}
              </div>

              {/* Bottom accent */}
              <div className="pt-8 sm:pt-12 border-t border-white/5 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="w-8 h-8 rounded-full border-2 border-secondary bg-gold/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                    </div>
                  ))}
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-gold">Expertise Excellence</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
