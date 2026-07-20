/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto rounded-[64px] overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary relative">
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary blur-[160px] -translate-y-1/2 translate-x-1/2 rounded-full" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/50 blur-[160px] translate-y-1/2 -translate-x-1/2 rounded-full" />
        </div>

        <div className="relative z-10 py-24 px-8 text-center max-w-4xl mx-auto space-y-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-serif text-white leading-[1.1]"
          >
            Your Next Level of Leadership Starts Here.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white text-xl leading-relaxed font-sans"
          >
            Empower your future with executive coaching, leadership development, and AI-ready skills designed to help you lead with confidence and create lasting impact.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center pt-6"
          >
            <Link 
              to="/contact" 
              className="bg-white text-primary px-10 py-5 rounded-full font-medium shadow-2xl hover:bg-sky transition-all hover:scale-105 flex items-center justify-center"
            >
              Book a Discovery Call <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link 
              to="/services" 
              className="border border-white/20 text-white px-10 py-5 rounded-full font-medium hover:bg-white/10 transition-all flex items-center justify-center backdrop-blur-sm"
            >
              Explore Programs
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
