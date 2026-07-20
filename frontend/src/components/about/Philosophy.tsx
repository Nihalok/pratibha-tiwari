/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

export default function Philosophy() {
  return (
    <section className="py-32 bg-secondary text-white text-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Orbs */}
        <motion.div 
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-gold/10 blur-[100px] rounded-full  will-change-transform" 
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 0],
            y: [0, 60, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-48 -right-24 w-[700px] h-[700px] bg-primary/20 blur-[120px] rounded-full  will-change-transform" 
        />
        
        {/* Pulsing Stardust - Optimized */}
        <motion.div 
          animate={{ opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" 
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.6em] text-gold mb-16 block font-bold">The Sovereign Philosophy</span>
          <blockquote className="space-y-12">
            <p className="text-4xl md:text-6xl lg:text-7xl font-serif italic leading-[1.1] tracking-tight text-white">
              <span className="text-gold ">"</span>The future doesn't belong to the most intelligent leaders. It belongs to those who combine <span className="text-gold">Human Intelligence</span>, <span className="text-gold">Emotional Intelligence</span>, and <span className="text-gold">Artificial Intelligence</span> with purpose<span className="text-gold ">"</span>
            </p>
            <footer className="flex flex-col items-center pt-16">
              <div className="w-16 h-px bg-gold/50 mb-8" />
              <cite className="font-serif text-3xl md:text-4xl not-italic tracking-wide text-white">Pratibha Tiwari</cite>
              <div className="flex items-center space-x-3 mt-6">
                <span className="text-[10px] uppercase tracking-[0.4em] text-mist font-bold">Founder</span>
                <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-mist font-bold">Design Super Destiny</span>
              </div>
            </footer>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}
