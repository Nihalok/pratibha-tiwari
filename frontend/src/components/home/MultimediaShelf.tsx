import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowRight, ArrowLeft, ExternalLink, ShoppingCart, BookOpen } from 'lucide-react';

import { books } from '../../data/books';

export default function MultimediaShelf() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for smooth movement - symmetric tilt
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 20 });
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Targeted Preloading for smoother transitions
  useEffect(() => {
    books.forEach((book) => {
      const img = new Image();
      img.src = book.image;
    });
  }, []);

  const nextBook = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % books.length);
  };

  const prevBook = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + books.length) % books.length);
  };

  const currentBook = books[currentIndex];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 60 : -60,
      filter: 'blur(10px)',
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 60 : -60,
      filter: 'blur(10px)',
      transition: {
        duration: 0.6
      }
    })
  };

  return (
    <section className="pt-12 md:pt-16 pb-12 md:pb-16 bg-transparent relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <motion.div 
          animate={{ 
            backgroundColor: [currentBook.color + '05', currentBook.color + '10', currentBook.color + '05']
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 transition-colors duration-1000" 
        />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(197,163,101,0.05)_0%,transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="flex items-center justify-center space-x-4 mb-3">
            <div className="h-px w-8 bg-gold/30" />
            <span className="font-mono text-[9px] uppercase tracking-[0.6em] text-gold font-bold">The Literary Collection</span>
            <div className="h-px w-8 bg-gold/30" />
          </div>
          <h2 className="text-3xl md:text-6xl font-serif text-primary leading-none mb-3 tracking-tighter">
            Mindset <span className="italic text-gold">Architecture</span>
          </h2>
        </motion.div>

        <div className="relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-0">
            {/* Interactive 3D Book Display */}
            <div 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full lg:w-1/2 flex justify-center [perspective:3000px] py-10"
            >
              <div className="relative h-[360px] md:h-[460px] w-full flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute flex items-center justify-center w-full"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Realistic 3D Book Model */}
                    <motion.div 
                      style={{ 
                        rotateY, 
                        rotateX,
                        transformStyle: "preserve-3d" 
                      }}
                      animate={{ 
                        y: [0, -12, 0],
                      }}
                      transition={{ 
                        duration: 6, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className="relative w-[200px] h-[290px] sm:w-[230px] sm:h-[320px] md:w-[260px] md:h-[370px] transform-gpu cursor-pointer group"
                    >
                      {/* ── BOOK THICKNESS = 40px, so half = 20px ── */}
                      {/* Half-thickness used for translateZ offsets      */}

                      {/* Front Cover */}
                      <div 
                        className="absolute inset-0 bg-white overflow-hidden rounded-[1px] border border-gold/10"
                        style={{ 
                          transform: "translateZ(20px)",
                          boxShadow: "6px 6px 30px rgba(0,0,0,0.35)",
                        }}
                      >
                        <img 
                          src={currentBook.image} 
                          alt={currentBook.title} 
                          className="w-full h-full object-cover transition-opacity duration-500"
                          loading="eager"
                          decoding="async"
                        />
                        {/* Sheen sweep on hover */}
                        <div className="absolute inset-x-0 top-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-25 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-[2.5s] ease-in-out" />
                        {/* Hardcover bevel */}
                        <div className="absolute inset-0 border-[0.5px] border-white/20 pointer-events-none" />
                        <div className="absolute left-3 top-0 bottom-0 w-[1.5px] bg-black/10" />
                      </div>

                      {/* Back Cover */}
                      <div 
                        className="absolute inset-0 bg-[#1a1a1a] rounded-[1px]"
                        style={{ transform: "translateZ(-20px)" }}
                      />

                      {/* Spine (Left face) — width = thickness = 40px */}
                      <div 
                        className="absolute top-0 left-0 h-full border-r border-white/5"
                        style={{ 
                          width: "40px",
                          /* Move to left edge of front face, rotate -90deg around left edge */
                          transform: "translateX(-40px) rotateY(-90deg)",
                          transformOrigin: "right center",
                          backgroundColor: currentBook.color,
                          backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 25%, rgba(0,0,0,0.05) 75%, rgba(0,0,0,0.55) 100%)",
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-mono text-[8px] text-white/80 uppercase tracking-[0.15em] font-bold whitespace-nowrap"
                            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                            {currentBook.subtitle}
                          </span>
                        </div>
                        <div className="absolute inset-y-0 left-1 w-px bg-white/10" />
                        <div className="absolute inset-y-0 right-1 w-px bg-black/20" />
                      </div>

                      {/* Pages / Right face — width = thickness = 40px */}
                      <div 
                        className="absolute top-0 right-0 h-full"
                        style={{ 
                          width: "40px",
                          transform: "translateX(40px) rotateY(90deg)",
                          transformOrigin: "left center",
                          backgroundColor: "#f8f8f8",
                          backgroundImage: "repeating-linear-gradient(to right, #f8f8f8, #f8f8f8 1px, #e0e0e0 1px, #e0e0e0 2px)",
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-black/8 via-transparent to-black/8" />
                      </div>

                      {/* Top Pages Edge — height = thickness = 40px */}
                      <div 
                        className="absolute top-0 left-0 w-full"
                        style={{ 
                          height: "40px",
                          transform: "translateY(-40px) rotateX(90deg)",
                          transformOrigin: "center bottom",
                          backgroundColor: "#f5f5f5",
                          backgroundImage: "repeating-linear-gradient(to bottom, #f5f5f5, #f5f5f5 1px, #e2e2e2 1px, #e2e2e2 2px)",
                        }}
                      />

                      {/* Bottom Pages Edge — height = thickness = 40px */}
                      <div 
                        className="absolute bottom-0 left-0 w-full"
                        style={{ 
                          height: "40px",
                          transform: "translateY(40px) rotateX(-90deg)",
                          transformOrigin: "center top",
                          backgroundColor: "#efefef",
                          backgroundImage: "repeating-linear-gradient(to top, #efefef, #efefef 1px, #d8d8d8 1px, #d8d8d8 2px)",
                        }}
                      />

                      {/* Floor Shadow */}
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.05, 1],
                          opacity: [0.25, 0.35, 0.25]
                        }}
                        transition={{ 
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[90%] h-10 bg-black/40 blur-2xl rounded-full pointer-events-none" 
                        style={{ transform: "translateZ(-20px) translateX(-50%) translateY(60px)" }}
                      />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>

                {/* Refined Navigation Controls */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center space-x-8 z-20">
                  <button 
                    onClick={prevBook}
                    className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="flex items-center space-x-2">
                    {books.map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => {
                          setDirection(i > currentIndex ? 1 : -1);
                          setCurrentIndex(i);
                        }}
                        className={`transition-all duration-500 ${
                          i === currentIndex ? 'w-6 h-1 bg-gold' : 'w-1.5 h-1 bg-primary/10'
                        } rounded-full`}
                      />
                    ))}
                  </div>
                  <button 
                    onClick={nextBook}
                    className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Book Details Container */}
            <div className="w-full lg:w-[50%] lg:pl-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="text-left space-y-8"
                >
                  <div className="space-y-4">
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/5 border border-primary/10 rounded-full origin-left"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                      <span className="text-secondary font-mono text-[9px] uppercase tracking-[0.3em] font-bold">{currentBook.tag}</span>
                    </motion.div>
                    
                    <h3 className="text-4xl md:text-6xl lg:text-7xl font-serif text-primary italic leading-[1.1] tracking-tighter">
                      "{currentBook.title}"
                    </h3>
                    
                    <div className="flex flex-wrap gap-3 pt-2">
                      {currentBook.highlights.map((h, i) => (
                        <span key={i} className="text-[9px] font-mono uppercase tracking-widest text-gold border border-gold/20 px-3 py-1.5 rounded-sm bg-gold/5">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6 text-primary text-base md:text-xl font-normal leading-relaxed max-w-2xl">
                    <p className="relative italic pl-10 before:content-['“'] before:absolute before:left-0 before:top-0 before:text-5xl before:text-gold before:font-serif">
                      {currentBook.desc}
                    </p>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-8">
                    <a 
                      href={currentBook.link}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group relative inline-flex items-center gap-5 bg-primary text-white px-8 py-4 rounded-full hover:bg-secondary transition-all duration-700 shadow-xl shadow-primary/20 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] relative z-10">Secure Your Copy</span>
                      <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform relative z-10" />
                    </a>
                    
                    <div className="flex items-center gap-5">
                      <div className="flex -space-x-3">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gold/10 shadow-lg relative group/avatar">
                            <img src={`https://ui-avatars.com/api/?name=User+${i}&background=1A3A5C&color=B8974A&bold=true`} alt="Reader avatar" className="w-full h-full object-cover group-hover/avatar:scale-110 transition-all" loading="lazy" decoding="async" />
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-secondary font-bold text-base leading-none">4,000+</span>
                        <span className="text-[9px] font-mono uppercase tracking-widest text-mist">Global Readers</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
