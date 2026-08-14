/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Heart, Compass, Mic2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import pillar1 from '../../assets/images/pratibha-tiwari-ai-leadership-coaching.jpg';
import pillar2 from '../../assets/images/pratibha-tiwari-executive-coaching-uae.jpg';
import pillar3 from '../../assets/images/pratibha-tiwari-future-ready-leadership.jpg';
import pillar4 from '../../assets/images/pratibha-tiwari-keynote-speaker-tedx.jpg';

const pillars = [
  {
    id: '01',
    title: 'AI Leadership & Digital Strategy',
    subtitle: 'Pillar 1',
    desc: 'Empowering leaders to navigate the AI era with human-centric technological vision.',
    icon: <Cpu className="w-12 h-12" />,
    color: '#1A3A5C', // Primary
    image: pillar1,
    specs: [
      { label: 'Sustainability', val: '100%' },
      { label: 'Innovation', val: 'Global' },
      { label: 'Vision', val: 'Human-AI' }
    ]
  },
  {
    id: '02',
    title: 'Executive Coaching & Emotional Intelligence',
    subtitle: 'Pillar 2',
    desc: 'Precision mentorship leveraging NLP + EI to build authentic leadership presence.',
    icon: <Heart className="w-12 h-12" />,
    color: '#0F172A', // Secondary
    image: pillar2,
    specs: [
      { label: 'Accuracy', val: '98%' },
      { label: 'Expertise', val: 'NLP Master' },
      { label: 'Outcome', val: 'Elite' }
    ]
  },
  {
    id: '03',
    title: 'Future-Ready Career Shaping',
    subtitle: 'Pillar 3',
    desc: 'Audit your professional sustainability and build a blueprint for high-value growth.',
    icon: <Compass className="w-12 h-12" />,
    color: '#B8974A', // Gold
    image: pillar3,
    specs: [
      { label: 'Structure', val: 'High-Val' },
      { label: 'Reach', val: 'UAE Gateway' },
      { label: 'Strategy', val: 'Proven' }
    ]
  },
  {
    id: '04',
    title: 'Corporate Training & Keynotes',
    subtitle: 'Pillar 4',
    desc: 'Transformative TEDx-quality keynotes and corporate masterclasses that inspire action, shift mindsets, and build high-performance organizational cultures.',
    icon: <Mic2 className="w-12 h-12" />,
    color: '#3B82F6', // Accent
    image: pillar4,
    specs: [
      { label: 'Impact', val: 'TEDx' },
      { label: 'Years', val: '23+' },
      { label: 'Platform', val: 'Stage' }
    ]
  }
];

export default function FourPillars() {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<any>(null);

  const goNext = () => {
    if (swiperRef.current) swiperRef.current.slideNext();
  };
  const goPrev = () => {
    if (swiperRef.current) swiperRef.current.slidePrev();
  };

  return (
    <section className="min-h-screen py-10 sm:py-14 md:py-16 w-full bg-[#FDFBF7] relative overflow-hidden group/pillars flex flex-col justify-between">
      {/* Background Architectural Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Base Background Image with subtle parallax effect */}
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute inset-0 z-0 opacity-5"
        >
          <img
            src={pillar1}
            alt="Corporate Architecture"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Premium Soft Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(184,151,74,0.08)_0%,transparent_70%)] z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(184,151,74,0.03)_0%,transparent_50%)] z-10" />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.1, y: 100 }}
            animate={{ opacity: 0.05, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -100 }}
            transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
            className="absolute inset-0 flex items-center justify-center z-20 will-change-transform transform-gpu pointer-events-none"
          >
            <h2 className="font-serif text-[35vw] md:text-[25vw] font-bold text-primary tracking-tighter leading-none whitespace-nowrap italic uppercase select-none opacity-40">
              {pillars[activeIndex].title.split(' ')[0]}
            </h2>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Section Heading — The Four Pillars of Impact */}
      <div className="relative z-30 pointer-events-none px-6 sm:px-10 md:px-16 max-w-7xl mx-auto w-full pt-4 sm:pt-6 md:pt-8 shrink-0">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex flex-col items-start"
        >
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-gold font-bold mb-1">Framework</span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-primary leading-tight tracking-tight">
            The Four Pillars of{' '}
            <span className="italic text-secondary">Impact</span>
          </h2>
        </motion.div>
      </div>

      {/* Swiper Carousel */}
      <div className="w-full flex-1 flex items-center relative z-10 my-auto py-4">
        <Swiper
          direction="horizontal"
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={1}
          speed={1000}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          mousewheel={false}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: false,
          }}
          observer={true}
          observeParents={true}
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="w-full h-full"
        >
          {pillars.map((pillar, idx) => (
            <SwiperSlide key={pillar.id} className="w-full flex items-center justify-center">
              <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-16 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-16 py-2 sm:py-4">
                
                {/* Visual / Image Container */}
                <div className="relative group shrink-0">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{
                      scale: activeIndex === idx ? 1 : 0.9,
                      opacity: activeIndex === idx ? 1 : 0
                    }}
                    transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                    className="relative w-full max-w-[220px] sm:max-w-[280px] md:max-w-[330px] lg:max-w-[380px] xl:max-w-[420px] max-h-[36vh] sm:max-h-[42vh] lg:max-h-[52vh] aspect-[4/5] rounded-[1.75rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.18)] ring-1 ring-primary/5 bg-stone-100 flex items-center justify-center"
                  >
                    <img 
                      src={pillar.image} 
                      alt={pillar.title} 
                      className="w-full h-full object-cover object-top sm:object-center transition-all duration-1000 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent pointer-events-none" />
                  </motion.div>

                  {/* Decorative Elements around image */}
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 md:w-28 md:h-28 bg-gold/10 rounded-full blur-2xl -z-10 pointer-events-none" />
                  <div className="absolute -top-4 -left-4 w-20 h-20 md:w-28 md:h-28 bg-primary/5 rounded-full blur-2xl -z-10 pointer-events-none" />
                </div>

                {/* Content Box */}
                <div className="text-left max-w-xl lg:max-w-2xl px-2 sm:px-0 flex-1">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: activeIndex === idx ? 1 : 0,
                      x: activeIndex === idx ? 0 : -20
                    }}
                    transition={{ delay: 0.3 }}
                    className="mb-2 md:mb-4 inline-block px-3.5 sm:px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20"
                  >
                    <span className="font-mono text-[9px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-secondary font-bold">{pillar.subtitle}</span>
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: activeIndex === idx ? 1 : 0,
                      y: activeIndex === idx ? 0 : 20
                    }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-primary leading-[1.15] tracking-tight mb-2.5 sm:mb-4 md:mb-6 text-left"
                  >
                    {pillar.title}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{
                      opacity: activeIndex === idx ? 1 : 0,
                      y: activeIndex === idx ? 0 : 15
                    }}
                    transition={{ delay: 0.5 }}
                    className="text-primary/95 text-xs sm:text-sm md:text-base lg:text-lg mb-4 sm:mb-6 md:mb-8 leading-relaxed font-normal max-w-xl text-left"
                  >
                    {pillar.desc}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{
                      opacity: activeIndex === idx ? 1 : 0,
                      y: activeIndex === idx ? 0 : 15
                    }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link
                      to="/services"
                      className="inline-flex items-center space-x-3 sm:space-x-4 md:space-x-6 px-5 sm:px-7 md:px-9 py-2.5 sm:py-3 md:py-4 bg-primary text-white rounded-full font-bold hover:bg-secondary hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_15px_30px_rgba(26,58,92,0.15)] group overflow-hidden relative"
                    >
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                      <span className="text-xs sm:text-sm md:text-base relative z-10">Discover Precision Coaching</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform relative z-10 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Navigation Controls */}
      <div className="relative md:absolute bottom-4 sm:bottom-6 md:bottom-8 right-6 md:right-12 z-50 flex flex-row md:flex-col items-center justify-end space-x-4 md:space-x-0 md:space-y-6 px-6 md:px-0 shrink-0">
        {/* Status Line */}
        <div className="hidden md:flex flex-col items-center">
          <div className="h-16 w-px bg-primary/10 relative">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gold"
              animate={{ height: `${((activeIndex + 1) / pillars.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row md:flex-col space-x-3 md:space-x-0 md:space-y-3">
          <motion.button
            onClick={goPrev}
            whileHover={{ scale: 1.08, backgroundColor: '#ffffff' }}
            whileTap={{ scale: 0.92 }}
            className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border border-primary/10 flex items-center justify-center text-primary hover:text-secondary transition-all"
            aria-label="Previous Pillar"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>

          <motion.button
            onClick={goNext}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/20 hover:bg-secondary transition-all"
            aria-label="Next Pillar"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </div>
      </div>

      <style>{`
        .pillars-pagination {
          display: none !important;
        }
      `}</style>
    </section>
  );
}
