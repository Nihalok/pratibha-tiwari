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

import pillar1 from '../../assets/images/ai.jpg';
import pillar2 from '../../assets/images/executive coaching.jpg';
import pillar3 from '../../assets/images/future ready.jpg';
import pillar4 from '../../assets/images/keynotes.jpg';

const pillars = [
  {
    id: '01',
    title: 'AI Leadership',
    subtitle: 'Digital Mastery',
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
    title: 'Executive Coaching',
    subtitle: 'NLP Mastery',
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
    title: 'Future ready Career ',
    subtitle: 'Growth Protocol',
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
    title: 'Master Keynotes',
    subtitle: 'Global Voice',
    desc: 'High-impact masterclasses backed by 23+ years of real-world corporate success.',
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
    <section className="min-h-[100dvh] py-16 md:py-0 md:h-[100dvh] w-full bg-[#FDFBF7] relative overflow-hidden group/pillars flex items-center">
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
            className="w-full h-full object-cover "
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
            className="absolute inset-0 flex items-center justify-center z-20"
          >
            <h2 className="font-serif text-[40vw] md:text-[30vw] font-bold text-primary tracking-tighter leading-none whitespace-nowrap italic uppercase">
              {pillars[activeIndex].title.split(' ')[0]}
            </h2>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Decorative Branding Header */}
      <div className="absolute top-16 left-6 md:top-32 md:left-12 z-30 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
        </motion.div>
      </div>

      <Swiper
        direction="horizontal"
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={1}
        speed={1000}
        autoplay={{
          delay: 3000,
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
        className="w-full h-full z-10"
      >
        {pillars.map((pillar, idx) => (
          <SwiperSlide key={pillar.id} className="w-full h-full">
            <div className="relative w-full h-full flex overflow-hidden">
              {/* Content Layer */}
              <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-center px-6 md:px-20 gap-8 md:gap-20 pt-20 md:pt-0">

                {/* Visual / Image */}
                <div className="relative group shrink-0">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{
                      scale: activeIndex === idx ? 1 : 0.9,
                      opacity: activeIndex === idx ? 1 : 0
                    }}
                    transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
                    className="relative w-full max-w-[200px] sm:max-w-[300px] md:max-w-[450px] aspect-[4/5] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] ring-1 ring-primary/5"
                  >
                    <img src={pillar.image} alt={pillar.title} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
                  </motion.div>

                  {/* Decorative Elements around image */}
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 md:w-32 md:h-32 bg-gold/10 rounded-full blur-3xl -z-10" />
                  <div className="absolute -top-6 -left-6 w-24 h-24 md:w-32 md:h-32 bg-primary/5 rounded-full blur-3xl -z-10" />
                </div>

                {/* Content Box */}
                <div className="text-center md:text-left max-w-2xl px-4 md:px-0">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: activeIndex === idx ? 1 : 0,
                      x: activeIndex === idx ? 0 : -20
                    }}
                    transition={{ delay: 0.4 }}
                    className="mb-4 md:mb-6 inline-block px-4 md:px-5 py-1.5 md:py-2 rounded-full bg-gold/10 border border-gold/20"
                  >
                    <span className="font-mono text-[9px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] text-secondary font-bold">{pillar.subtitle}</span>
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 30 }}
                    animate={{
                      opacity: activeIndex === idx ? 1 : 0,
                      y: activeIndex === idx ? 0 : 30
                    }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-3xl xs:text-4xl md:text-7xl lg:text-8xl font-serif text-primary leading-[1.1] tracking-tight mb-4 md:mb-8"
                  >
                    {pillar.title.split(' ').map((word, i) => (
                      <span key={i} className={i === 1 ? "italic text-secondary block md:inline" : ""}>
                        {word}{" "}
                      </span>
                    ))}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: activeIndex === idx ? 1 : 0,
                      y: activeIndex === idx ? 0 : 20
                    }}
                    transition={{ delay: 0.6 }}
                    className="text-primary text-sm md:text-2xl mb-6 md:mb-12 leading-relaxed font-normal max-w-xl line-clamp-3 md:line-clamp-none"
                  >
                    {pillar.desc}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: activeIndex === idx ? 1 : 0,
                      y: activeIndex === idx ? 0 : 20
                    }}
                    transition={{ delay: 0.7 }}
                  >
                    <Link
                      to="/services"
                      className="inline-flex items-center space-x-4 md:space-x-8 px-8 md:px-12 py-3 md:py-5 bg-primary text-white rounded-full font-bold hover:bg-secondary hover:scale-105 transition-all shadow-[0_20px_40px_rgba(26,58,92,0.15)] group overflow-hidden relative"
                    >
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                      <span className="text-xs md:text-lg relative z-10">Discover Precision Coaching</span>
                      <ArrowRight size={18} className="group-hover:translate-x-2 md:group-hover:translate-x-3 transition-transform relative z-10 md:w-[22px] md:h-[22px]" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Controls - Refined UI */}
      <div className="absolute bottom-6 md:bottom-12 right-6 md:right-16 z-50 flex flex-row md:flex-col items-center space-x-4 md:space-x-0 md:space-y-8">
        {/* Status Line */}
        <div className="hidden md:flex flex-col items-center">
          <div className="h-20 w-px bg-primary/10 relative">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gold"
              animate={{ height: `${((activeIndex + 1) / pillars.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row md:flex-col space-x-3 md:space-x-0 md:space-y-4">
          <motion.button
            onClick={goPrev}
            whileHover={{ scale: 1.1, backgroundColor: '#ffffff' }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white shadow-xl border border-primary/5 flex items-center justify-center text-primary hover:text-secondary transition-all"
            aria-label="Previous Pillar"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
          </motion.button>

          <motion.button
            onClick={goNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl shadow-primary/20 hover:bg-secondary transition-all"
            aria-label="Next Pillar"
          >
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
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
