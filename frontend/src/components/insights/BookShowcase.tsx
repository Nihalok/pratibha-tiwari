/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { BookOpen, ArrowUpRight } from 'lucide-react';
import { books, Book } from '../../data/books';

export default function BookShowcase() {
  return (
    <div className="relative space-y-24 md:space-y-40 mb-32 md:mb-56 py-12 overflow-hidden">
      {/* Subtle Premium Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20 md:mb-32">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-16 h-[1px] bg-gradient-to-r from-gold to-transparent" />
              <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.5em] text-gold font-bold bg-gold/5 px-4 py-1.5 rounded-full border border-gold/10">
                Featured Publications
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif text-primary leading-[1.05] tracking-tight">
              Ideas That <span className="italic font-light text-slate-600">Inspire</span> Growth.
              <span className="block mt-4 text-3xl md:text-4xl lg:text-5xl text-secondary font-light">Books That Create Lasting Impact.</span>
            </h2>
            <div className="mt-12 text-primary font-normal text-xl md:text-2xl leading-relaxed border-l-2 border-gold/40 pl-6 md:pl-8">
              Every leader has a story to tell, but the most impactful leaders leave behind ideas that continue to inspire long after the conversation ends. Through her books, Pratibha Tiwari shares practical wisdom drawn from over 23 years of experience.
            </div>
            <div className="mt-8 space-y-6 text-charcoal/80 text-lg md:text-xl font-normal leading-relaxed pl-6 md:pl-8">
              <p>
                Each publication is designed to help readers think differently, lead confidently, and create meaningful change in both their personal and professional lives.
              </p>
              <p>
                Whether you're an aspiring leader, an experienced executive, an entrepreneur, or someone on a journey of self-discovery, these books offer practical insights, powerful reflections, and actionable strategies to help you unlock your true potential.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-32 md:space-y-56">
          {books.map((book, index) => (
            <BookItem key={book.title} book={book} index={index} />
          ))}
        </div>

        {/* Final CTA for Books */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 pt-32 border-t border-slate-200/60 text-center space-y-12"
        >
          <div className="max-w-4xl mx-auto space-y-8">
            <h4 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary tracking-tight">
              Continue Your Journey of <span className="italic text-secondary font-light">Growth</span>
            </h4>
            <p className="text-mist font-normal text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              Discover the ideas, insights, and coaching philosophies that have empowered thousands of professionals, leaders, and lifelong learners to lead with greater confidence, clarity, and purpose.
            </p>
          </div>

          <div className="flex justify-center pt-4">
            <motion.a
              href="https://www.amazon.ae/s?i=stripbooks&rh=p_27%3APratibha+Tiwari"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-4 bg-white border border-gold/30 text-primary px-8 py-4 rounded-full shadow-lg shadow-gold/5 hover:shadow-gold/20 hover:border-gold transition-all duration-500"
            >
              <span className="font-mono text-xs uppercase tracking-[0.3em] font-bold group-hover:text-gold transition-colors">Explore All Publications</span>
              <BookOpen size={18} className="text-gold group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface BookItemProps {
  book: Book;
  index: number;
  key?: string;
}

function BookItem({ book, index }: BookItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for smooth movement - adjusted for a slightly heavier, premium feel
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [12, -35]), { stiffness: 120, damping: 25 });
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 120, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;
    mouseX.set(0);
    mouseY.set(0);
  };

  const bookDepth = 45; // Depth in pixels

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 lg:gap-32 relative group/section`}
    >
      {/* Book 3D-ish Representation */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full lg:w-2/5 flex justify-center [perspective:2500px] py-16 relative"
      >
        {/* Soft backlight behind the book */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-black/5 blur-[100px] rounded-full pointer-events-none" />

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
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.5
          }}
          className="relative w-64 h-96 md:w-[340px] md:h-[500px] transform-gpu will-change-transform cursor-pointer group"
        >
          {/* Back Cover - gives it volume */}
          <div
            className="absolute inset-0 bg-[#111] shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-sm"
            style={{ transform: `translateZ(-${bookDepth / 2}px)` }}
          />

          {/* Book Spine (Left Side) */}
          <div
            className="absolute left-0 top-0 h-full origin-left shadow-2xl border-r border-white/10"
            style={{
              width: `${bookDepth}px`,
              transform: `rotateY(-90deg) translateZ(0px)`,
              backgroundColor: book.color,
              backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(255,255,255,0.1) 20%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0.8) 100%)',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center rotate-90 opacity-90">
              <span className="font-mono text-[10px] text-white uppercase tracking-[0.4em] font-bold whitespace-nowrap drop-shadow-md">{book.subtitle}</span>
            </div>
            {/* Binding texture */}
            <div className="absolute inset-y-0 left-[2px] w-[1px] bg-white/20" />
            <div className="absolute inset-y-0 right-[2px] w-[1px] bg-black/40" />
          </div>

          {/* Front Cover Container */}
          <div
            className="absolute inset-0 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] rounded-sm overflow-hidden border border-white/20"
            style={{ transform: `translateZ(${bookDepth / 2}px)` }}
          >
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              loading="eager"
              referrerPolicy="no-referrer"
            />

            {/* Enhanced Premium Sheen/Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/20 pointer-events-none mix-blend-overlay opacity-60" />
            <div className="absolute inset-x-0 top-0 h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-[30deg] translate-x-[-250%] group-hover:translate-x-[250%] transition-transform duration-[3s] ease-in-out" />

            {/* Hardcover bevel effect */}
            <div className="absolute inset-0 border-[0.5px] border-white/40 pointer-events-none" />
            <div className="absolute left-[8px] top-0 bottom-0 w-[2px] bg-black/15 shadow-[1px_0_3px_rgba(255,255,255,0.2)]" />
          </div>

          {/* Pages Effect (Right Side) */}
          <div
            className="absolute right-0 top-[2px] bottom-[2px] origin-right"
            style={{
              width: `${bookDepth - 2}px`,
              transform: `rotateY(90deg) translateZ(0px)`,
              backgroundColor: '#f8f8f8',
              backgroundImage: 'repeating-linear-gradient(to right, #f8f8f8, #f8f8f8 1px, #e0e0e0 1px, #e0e0e0 2px)',
            }}
          >
            {/* Page texture shadow */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />
          </div>

          {/* Top Pages (volume depth) */}
          <div
            className="absolute top-0 left-[2px] right-[2px] origin-top"
            style={{
              height: `${bookDepth - 2}px`,
              transform: `rotateX(90deg) translateZ(0px)`,
              backgroundColor: '#f1f1f1',
              backgroundImage: 'repeating-linear-gradient(to bottom, #f1f1f1, #f1f1f1 1px, #dcdcdc 1px, #dcdcdc 2px)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent" />
          </div>

          {/* Bottom Pages (volume depth) */}
          <div
            className="absolute bottom-0 left-[2px] right-[2px] origin-bottom"
            style={{
              height: `${bookDepth - 2}px`,
              transform: `rotateX(-90deg) translateZ(0px)`,
              backgroundColor: '#eaeaea',
              backgroundImage: 'repeating-linear-gradient(to top, #eaeaea, #eaeaea 1px, #d0d0d0 1px, #d0d0d0 2px)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />
          </div>

          {/* Dynamic Floor Shadow */}
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.4, 0.5, 0.4]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.5
            }}
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[120%] h-12 bg-black/40 blur-[25px] rounded-full pointer-events-none"
          />
        </motion.div>
      </div>

      {/* Detailed Content */}
      <div className="w-full lg:w-3/5 space-y-10 relative z-10 px-4 md:px-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="inline-block font-mono text-[10px] uppercase tracking-[0.4em] text-secondary font-bold">
              {book.tag}
            </span>
          </div>
          <h3 className="text-4xl md:text-6xl lg:text-7xl font-serif text-primary italic leading-[1.05] tracking-tighter drop-shadow-sm">
            "{book.title}"
          </h3>
          <p className="text-gold font-sans text-sm md:text-base tracking-[0.2em] font-semibold uppercase">{book.subtitle}</p>
        </div>

        <div className="h-px w-24 bg-gold/30" />

        <div className="prose prose-lg text-charcoal/90 font-normal leading-relaxed max-w-2xl space-y-8">
          <p className="text-2xl md:text-3xl italic text-primary font-serif leading-snug">
            {book.desc}
          </p>
          <p className="text-lg md:text-xl font-light">
            {book.detailedDesc}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-6">
          {book.highlights.map((h: string, i: number) => (
            <span key={i} className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold bg-white border border-gold/20 shadow-sm px-5 py-2.5 rounded-full hover:bg-gold/5 transition-colors">
              {h}
            </span>
          ))}
        </div>

        <div className="pt-12">
          <a
            href={book.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-8 bg-primary text-white px-10 py-5 md:px-12 md:py-6 rounded-full hover:bg-gold hover:text-primary transition-all duration-700 shadow-2xl shadow-primary/20 hover:shadow-gold/30"
          >
            <span className="text-xs md:text-sm font-bold uppercase tracking-[0.25em]">Secure Your Copy</span>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/30 transition-all duration-500">
              <ArrowUpRight size={18} className="group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500" />
            </div>
          </a>
        </div>
      </div>
    </motion.div>
  );
}