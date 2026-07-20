/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, CheckCircle2, Mic, Star, Users, MapPin, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import pratibhaPortrait from '../../assets/images/coach-pratibha-hero-new.png';

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "12%"]);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] lg:min-h-screen flex flex-col pt-32 sm:pt-36 lg:pt-32 pb-8 overflow-hidden bg-[#FDFBF7] z-0">
      {/* Dynamic Background Accents - Matching the cream/sand texture */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Soft Sand Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#F5E6D3_0%,transparent_70%)] " />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,#EAD9C2_0%,transparent_60%)] opacity-30" />

        {/* Abstract Wavy Lines (Simulating the image background) */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] stroke-gold" viewBox="0 0 1440 900" fill="none">
          <path d="M-100 450C200 350 400 550 700 450C1000 350 1200 550 1500 450" strokeWidth="2" strokeDasharray="10 10" />
          <path d="M-100 650C200 550 400 750 700 650C1000 550 1200 750 1500 650" strokeWidth="1" />
        </svg>

        {/* Ambient Decorative Blobs */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], x: [0, 10, 0], y: [0, -10, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-0 w-[800px] h-[800px] bg-gold/5 blur-[120px] rounded-full"
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10 w-full flex-grow">
        {/* Left Content Column */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-left"
        >
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-5xl sm:text-7xl md:text-8xl xl:text-[90px] font-serif text-primary leading-[1.1] tracking-tighter">
              Lead with <span className="italic text-gold">Confidence.</span><br />
              Thrive in the <br />
              Age of <span className="not-italic">AI.</span>
            </h1>

            <div className="w-24 h-px bg-gold/40 mt-8 mb-10" />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="text-lg md:text-xl lg:text-2xl text-primary max-w-xl leading-relaxed font-normal"
            >
              Helping executives, business leaders, entrepreneurs, and organizations across the UAE develop exceptional leadership, executive communication, emotional intelligence, and AI-ready decision-making skills to succeed in today's rapidly evolving business landscape.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="flex flex-wrap gap-4 md:gap-8 pt-4"
            >
              {[
                { icon: CheckCircle2, text: "ICF-PCC Coach" },
                { icon: Mic, text: "TEDx Speaker" },
                { icon: Globe, text: "Global Presence" }
              ].map((badge, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-primary">
                  <badge.icon size={16} className="text-gold" />
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold">{badge.text}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="flex flex-col sm:flex-row gap-4 pt-8"
            >
              <Link
                to="/contact"
                className="bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-secondary transition-all shadow-xl shadow-primary/10 flex items-center justify-center group"
              >
                Book a Discovery Call
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/services"
                className="border border-primary/10 text-primary px-8 py-4 rounded-full font-bold hover:bg-white hover:border-primary transition-all flex items-center justify-center"
              >
                Explore Leadership Programs
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="pt-12"
            >
              <div className="inline-block">
                <span className="font-signature text-6xl md:text-7xl lg:text-8xl text-primary block mb-2 tracking-wider">
                  Pratibha Tiwari
                </span>
                <div className="flex items-center gap-4">
                  <div className="h-[2px] w-12 bg-gold/60" />
                  <span className="font-sans text-[10px] md:text-[12px] uppercase tracking-[0.5em] text-primary font-black">
                    Leadership Strategist
                  </span>
                  <div className="h-[2px] w-12 bg-gold/60" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Image Column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-[580px]">
            {/* The Large Dark Circle Background */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 1.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] h-[95%] bg-[#0A1929] rounded-full shadow-2xl overflow-hidden border-8 border-white/50"
            />

            {/* Main Portrait Image */}
            <div className="relative z-10 overflow-hidden rounded-b-full">
              <motion.img
                style={{ y: imageY }}
                src={pratibhaPortrait}
                alt="Pratibha Tiwari"
                className="w-full h-auto object-cover relative z-10"
                loading="eager"
                decoding="async"
              />
            </div>

            {/* Leaf Accents (Simplified as SVG) */}
            <motion.div
              initial={{ opacity: 0, rotate: -20 }}
              whileInView={{ opacity: 0.4, rotate: 0 }}
              transition={{ delay: 1, duration: 2 }}
              className="absolute -left-16 bottom-1/4 z-20 w-48 h-48 pointer-events-none"
            >
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-gold">
                <path d="M10 90C30 70 40 40 40 10" stroke="currentColor" strokeWidth="0.5" />
                <ellipse cx="40" cy="15" rx="5" ry="12" transform="rotate(30 40 15)" fill="currentColor" opacity="0.3" />
                <ellipse cx="35" cy="35" rx="4" ry="10" transform="rotate(45 35 35)" fill="currentColor" opacity="0.4" />
                <ellipse cx="30" cy="55" rx="3" ry="8" transform="rotate(60 30 55)" fill="currentColor" opacity="0.3" />
              </svg>
            </motion.div>

            {/* TEDx Badge - Circular with precise labels */}
            <motion.div
              initial={{ rotate: -20, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 5, scale: 1, opacity: 1 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 80 }}
              className="absolute top-4 left-4 md:top-8 md:left-8 z-30"
            >
              <div className="bg-white w-28 h-28 md:w-36 md:h-36 rounded-full border border-gold/10 shadow-2xl flex flex-col items-center justify-center p-4">
                <div className="text-center">
                  <span className="text-[18px] md:text-[24px] font-sans font-black text-[#E62B1E] tracking-tighter block leading-none">ICF PCC Coach</span>
                  <div className="h-[1px] w-10 bg-gold/30 mx-auto my-2" />
                  <span className="text-[7px] md:text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-primary block">NLP Trainer</span>
                </div>
              </div>
            </motion.div>

            {/* Certified Mentor Card - Dark Minimalist */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 1 }}
              className="absolute bottom-12 -right-4 lg:-right-8 z-30"
            >
              <div className="bg-[#0F172A] px-10 py-6 rounded-2xl shadow-3xl border border-white/10 flex flex-col items-center text-center">
                {/* Lotus Logo (Simplified SVG) */}
                <div className="mb-3 text-gold opacity-80">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M12 21C12 21 7 17 7 12C7 7 12 3 12 3C12 3 17 7 17 12C17 17 12 21 12 21Z" />
                    <path d="M12 21C12 21 3 18 3 12C3 6 12 3 12 3" />
                    <path d="M12 21C12 21 21 18 21 12C21 6 12 3 12 3" />
                  </svg>
                </div>
                <span className="text-[8px] font-mono uppercase tracking-[0.4em] text-white mb-1 font-black">Certified Mentor</span>
                <div className="flex flex-col items-center">
                  <span className="font-signature text-4xl text-gold">Pratibha Tiwari</span>

                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Subtle Stats Row */}
      <div className="w-full mt-auto py-12 border-t border-gold/10">
        <div className="max-w-[1440px] mx-auto px-8">
          <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-primary max-w-5xl mx-auto text-center leading-relaxed font-bold">
            With over 23+ years of global leadership experience, ICF-PCC Executive Coach, TEDx Speaker, AI Leadership Strategist, and Corporate Trainer, Pratibha Tiwari has empowered more than 4,000+ professionals and collaborated with leaders from 150+ nationalities to unlock their full leadership potential, 2700+ Coaching Hours and substantial training hours spent for professionals and for organizational growth.
          </p>
        </div>
      </div>
    </section>

  );
}
