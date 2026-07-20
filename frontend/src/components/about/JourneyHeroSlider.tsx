/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

import journeyCls from '../../assets/images/7.JPG';
import journeyDes from '../../assets/images/3.jpg';
import journeySuccess from '../../assets/images/5.jpg';
import journeyTed from '../../assets/images/6.JPG';

const slides = [
  {
    tag: "THE FOUNDATION",
    title: "Where Intelligence Meets Influence",
    description: "Every great leader is built on a strong foundation. With a background in engineering and technology, Pratibha Tiwari learned the power of analytical thinking, precision, and problem-solving. Today, she blends that technical expertise with executive coaching, emotional intelligence, and AI leadership to help professionals make better decisions, communicate with confidence, and lead people with purpose.\n\nBecause the strongest leaders combine strategic thinking with genuine human connection.",
    image: journeyCls,
    accent: "border-primary/30"
  },
  {
    tag: "THE MISSION",
    title: "Beyond Success. Towards Significance.",
    description: "Leadership isn't measured by titles—it's defined by the lives we influence and the value we create. Through executive coaching, leadership development, and AI-ready thinking, I help professionals lead with authenticity, resilience, and purpose.\n\nBecause true leadership leaves a legacy, not just results.",
    image: journeyDes,
    accent: "border-secondary/30"
  },
  {
    tag: "THE GLOBAL IMPACT",
    title: "Empowering Leaders Across Borders",
    description: "Leadership has no boundaries. With over 23 years of global experience, Pratibha Tiwari partners with executives, business leaders, and organizations across the UAE to strengthen leadership, executive communication, emotional intelligence, and AI-ready capabilities. Her work empowers individuals and teams to navigate change, inspire performance, and build a culture of sustainable growth.\n\nCreating future-ready leaders who inspire people, drive innovation, and lead with purpose.",
    image: journeySuccess,
    accent: "border-gold/30"
  },
  {
    tag: "THE GLOBAL STAGE",
    title: "Inspiring Leaders. Influencing Change.",
    description: "From TEDx stages to international leadership forums, Pratibha Tiwari empowers audiences with practical insights on executive leadership, emotional intelligence, AI-driven leadership, and transformational communication. Her engaging keynote sessions inspire professionals and organizations to embrace change, lead with confidence, and create lasting impact in today's evolving world.\n\nWhere leadership meets purpose, every conversation becomes a catalyst for transformation.",
    image: journeyTed,
    accent: "border-primary/30"
  }
];

export default function JourneyHeroSlider() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setIndex((prev) => (prev + newDirection + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const startTimer = () => {
      timerRef.current = setInterval(() => {
        paginate(1);
      }, 10000);
    };

    startTimer();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paginate]);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      paginate(1);
    }, 10000);
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col bg-[#FBF7F0] overflow-hidden py-12 lg:py-24">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Floating Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-gold/5 rounded-full blur-3xl will-change-transform"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/3 -right-20 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[80px]  translate-z-0 will-change-transform"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 80, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-40 left-1/4 w-[40rem] h-[40rem] bg-secondary/5 rounded-full blur-[100px]  translate-z-0 will-change-transform"
        />

        {/* Grain/Texture Overlay - Optimized by removing mix-blend-multiply which is heavy on scroll */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
      </div>

      <div className="container mx-auto px-4 mb-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-4 mb-4"
          >
            <div className="h-px w-12 bg-gold/50" />
            <span className="text-sm font-bold tracking-widest text-gold uppercase">The Journey</span>
            <div className="h-px w-12 bg-gold/50" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary"
          >
            Milestones of <span className="italic text-gold">Impact</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-primary leading-relaxed max-w-2xl mx-auto"
          >
            A narrative of transformation, from technical precision to human-centric leadership excellence.
          </motion.p>
        </div>
      </div>

      {/* Decorative Text */}
      <div className="absolute top-40 right-0 text-[18vw] font-serif italic text-primary/[0.02] select-none pointer-events-none translate-x-1/4 z-0">
        Narrative
      </div>

      <div className="flex-1 relative z-10 flex flex-col lg:flex-row min-h-0">
        {/* Visual Content - Left side on Desktop */}
        <div className="w-full lg:w-1/2 h-[40vh] md:h-[50vh] lg:h-screen relative overflow-hidden order-2 lg:order-1">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 p-4 md:p-12 lg:p-16 flex items-center justify-center"
            >
              <div className="relative w-full h-full max-w-lg group">
                {/* Decorative Frame */}
                <motion.div
                  initial={{ rotate: -5 }}
                  animate={{ rotate: 0 }}
                  className={`absolute -inset-4 border-2 ${slides[index].accent} rounded-[2rem] md:rounded-[4rem] transition-colors duration-1000`}
                />

                <div className="absolute inset-0 rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-black/5">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${slides[index].image})` }}
                  />
                  {/* Subtle Grain/Overlay */}
                  <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Narrative Content - Right side on Desktop */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 md:p-12 lg:p-16 order-1 lg:order-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
              className="space-y-6 md:space-y-8"
            >
              <div className="space-y-2">
                <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-gold font-bold">
                  {slides[index].tag}
                </span>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-primary leading-tight">
                  {slides[index].title}
                </h2>
              </div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="h-px bg-gold"
              />

              <p className="text-primary text-sm md:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl whitespace-pre-line">
                {slides[index].description}
              </p>

              <div className="flex items-center space-x-12 pt-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => { paginate(-1); resetTimer(); }}
                    className="p-3 md:p-4 rounded-full border border-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-500 group"
                  >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => { paginate(1); resetTimer(); }}
                    className="p-3 md:p-4 rounded-full border border-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-500 group"
                  >
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setIndex(i); resetTimer(); }}
                      className={`h-1 transition-all duration-500 rounded-full ${index === i ? 'w-12 bg-gold' : 'w-4 bg-primary/10'}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Elements for visual interest */}
      <div className="absolute bottom-12 left-12 hidden lg:block z-20">
        <div className="flex items-center space-x-6">
          <div className="w-[1px] h-20 bg-primary/10" />
          <div className="space-y-1">
            <div className="font-mono text-[9px] uppercase tracking-widest text-primary">Archive</div>
            <div className="font-serif text-primary italic text-xl">23+ Years</div>
          </div>
        </div>
      </div>
    </section>
  );
}
