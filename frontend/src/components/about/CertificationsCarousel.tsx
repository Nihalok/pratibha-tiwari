import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Award } from 'lucide-react';

interface Certificate {
  id: number;
  title: string;
  org: string;
  image: string;
  tag: string;
  vertical?: boolean;
}

import cert1 from '../../assets/images/certificates/icf.jpg';
import cert2 from '../../assets/images/certificates/nlp.jpg';
import cert3 from '../../assets/images/certificates/iit.jpg';
import cert4 from '../../assets/images/certificates/iapcct.jpg';
import cert5 from '../../assets/images/certificates/group coach.jpg';

const certificates: Certificate[] = [
  {
    id: 1,
    title: "Professional Certified Coach (PCC)",
    org: "ICF Credentials and Standards",
    image: cert1, // photo_3
    tag: ""
  },
  {
    id: 2,
    title: "Certified NLP Trainer",
    org: "International Association of Professional Coaches, Counsellors & Therapists (IAPCCT)",
    image: cert2, // photo_4
    tag: ""
  },
  {
    id: 3,
    title: "Advanced Programme in Technology and AI Leadership",
    org: "Indian Institute of Technology Delhi (Department of Management Studies)",
    image: cert3, // photo_2
    tag: ""
  },
  {
    id: 4,
    title: "Certified Associate Leadership & Executive Coach",
    org: "NLP Coaching Academy (CCE)",
    image: cert4, // photo_1
    tag: ""
  }
  ,
  {
    id: 5,
    title: "Certified Group Coach",
    org: "Success Mastery",
    image: cert5, // photo_1
    tag: "Group Coach"
  }
];

export default function CertificationsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % certificates.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + certificates.length) % certificates.length);
  };

  const handleDragEnd = (_: any, info: any) => {
    setIsDragging(false);
    if (info.offset.x > 80) {
      handlePrev();
    } else if (info.offset.x < -80) {
      handleNext();
    }
  };

  const handleCardClick = (index: number) => {
    // Don't trigger click if it was a drag gesture
    if (!isDragging) {
      setActiveIndex(index);
    }
  };

  return (
    <div className="w-full py-12 md:py-16 overflow-hidden bg-white relative">
      {/* Decorative background elements for luxury light feel */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pearl/50 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      {/* Subtle grid pattern for texture */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #B8974A 0.5px, transparent 0)', backgroundSize: '60px 60px' }} />

      <div className="w-full px-6 relative z-10">
        <div className="flex flex-col items-center">

          {/* Main Carousel Stage */}
          <div className="relative w-full h-[320px] sm:h-[380px] md:h-[480px] flex items-center justify-center perspective-[2000px]">
            {/* Absolute Navigation Arrows (Desktop view only to avoid overlapping certificate on mobile) */}
            <div className="hidden md:flex absolute inset-x-0 top-1/2 -translate-y-1/2 justify-between px-6 lg:px-12 z-30 pointer-events-none">
              <button
                onClick={handlePrev}
                aria-label="Previous certificate"
                className="w-14 h-14 lg:w-16 lg:h-16 rounded-full border border-gold/10 bg-white/90 backdrop-blur-xl flex items-center justify-center text-primary hover:bg-gold hover:text-white transition-all duration-500 group shadow-xl pointer-events-auto cursor-pointer"
              >
                <ChevronLeft size={28} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={handleNext}
                aria-label="Next certificate"
                className="w-14 h-14 lg:w-16 lg:h-16 rounded-full border border-gold/10 bg-white/90 backdrop-blur-xl flex items-center justify-center text-primary hover:bg-gold hover:text-white transition-all duration-500 group shadow-xl pointer-events-auto cursor-pointer"
              >
                <ChevronRight size={28} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="relative w-full max-w-7xl h-full flex items-center justify-center">
              <AnimatePresence mode="sync">
                {certificates.map((cert, index) => {
                  const isActive = index === activeIndex;
                  const isPrev = index === (activeIndex - 1 + certificates.length) % certificates.length;
                  const isNext = index === (activeIndex + 1) % certificates.length;

                  if (!isActive && !isPrev && !isNext) return null;

                  let xOffset = 0;
                  if (isPrev) xOffset = isMobile ? -190 : -430;
                  if (isNext) xOffset = isMobile ? 190 : 430;

                  return (
                    <motion.div
                      key={cert.id}
                      drag={isMobile ? false : "x"}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.1}
                      onDragStart={() => setIsDragging(true)}
                      onDragEnd={handleDragEnd}
                      initial={false}
                      animate={{
                        opacity: isActive ? 1 : 0.25,
                        x: xOffset,
                        scale: isActive ? 1 : 0.75,
                        y: isActive ? -8 : 0,
                        zIndex: isActive ? 20 : 10,
                        rotateY: isPrev ? 15 : (isNext ? -15 : 0),
                        filter: isActive ? 'blur(0px)' : 'blur(3px)',
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        mass: 0.8,
                      }}
                      onClick={() => handleCardClick(index)}
                      className={`absolute ${isActive ? 'cursor-default' : 'cursor-pointer'}`}
                      style={{ touchAction: isMobile ? 'pan-y' : 'none' }}
                    >
                      <div className={`
                        relative w-[270px] sm:w-[320px] md:w-[600px] aspect-[1.4/1] bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] md:shadow-[0_30px_70px_rgba(0,0,0,0.12)] transition-shadow duration-500 flex flex-col items-center justify-center p-2.5 sm:p-4 md:p-6
                        ${isActive ? 'ring-1 ring-gold/20' : 'grayscale brightness-95'}
                      `}>
                        <div className="w-full h-full flex items-center justify-center relative">
                          {/* Inner border for the certificate feel */}
                          <div className="absolute inset-1.5 md:inset-2 border border-gold/10 rounded-lg md:rounded-2xl pointer-events-none" />
                          <img
                            src={cert.image}
                            alt={cert.title}
                            className="max-w-full max-h-full object-contain relative z-10"
                          />
                        </div>

                        {/* Tag */}
                        <div className="absolute top-3 left-3 md:top-8 md:left-8 z-20">
                          <span className="px-3 py-1.5 md:px-5 md:py-2.5 bg-primary text-[8px] md:text-[10px] font-mono font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-white rounded-md md:rounded-lg shadow-md border border-primary/20">
                            {cert.tag}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Certificate Info - Centered and elegant */}
          <div className="text-center mt-3 md:mt-6 max-w-3xl px-4 sm:px-6 min-h-[90px] md:min-h-[100px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-2 sm:space-y-4"
              >
                <div className="flex items-center justify-center space-x-2 sm:space-x-4 text-gold">
                  <div className="h-px w-8 sm:w-12 bg-gold/20" />
                  <Award size={18} className="animate-pulse shrink-0" />
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] sm:tracking-[0.6em] font-bold truncate max-w-[260px] sm:max-w-none">{certificates[activeIndex].org}</span>
                  <div className="h-px w-8 sm:w-12 bg-gold/20" />
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-5xl font-serif text-primary italic leading-tight tracking-tight">
                  {certificates[activeIndex].title}
                </h3>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls (Mobile Arrows + Indicators) */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 md:mt-8">
            <button
              onClick={handlePrev}
              aria-label="Previous certificate"
              className="md:hidden w-10 h-10 rounded-full border border-gold/20 bg-white shadow-md flex items-center justify-center text-primary active:scale-95 transition-all shrink-0"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex space-x-2 sm:space-x-3 bg-pearl/30 backdrop-blur-md px-5 py-3 sm:px-8 sm:py-4 rounded-full border border-gold/10">
              {certificates.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleCardClick(i)}
                  aria-label={`Go to certificate ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-700 ease-in-out cursor-pointer ${i === activeIndex ? 'w-8 sm:w-10 bg-gold' : 'w-2 bg-gold/20 hover:bg-gold/40'}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="Next certificate"
              className="md:hidden w-10 h-10 rounded-full border border-gold/20 bg-white shadow-md flex items-center justify-center text-primary active:scale-95 transition-all shrink-0"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
