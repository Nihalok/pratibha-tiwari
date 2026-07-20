/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Download, ChevronRight } from 'lucide-react';
import { jsPDF } from 'jspdf';
import portrait from '../../assets/images/about-prathibha.jpeg';

export default function AboutHero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const rotateVal = useTransform(scrollYProgress, [0, 1], [0, 5]);

  const handleDownload = () => {
    try {
      const doc = new jsPDF();
      const primaryColor = [26, 58, 92]; // #1A3A5C
      const secondaryColor = [184, 153, 91]; // #B8995B
      const textColor = [51, 51, 51];

      doc.setFillColor(250, 248, 246);
      doc.rect(0, 0, 210, 297, "F");
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 40, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(255, 255, 255);
      doc.text("PRATIBHA TIWARI", 20, 25);
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text("EXECUTIVE PRESENCE & LEADERSHIP ARCHITECT", 20, 32);

      let currentY = 55;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("EXECUTIVE PROFILE", 20, currentY);
      doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.line(20, currentY + 2, 60, currentY + 2);

      currentY += 12;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      
      const profileText = doc.splitTextToSize(
        "Pratibha Tiwari is a world-class NLP Master Practitioner and Executive Coach dedicated to the architecture of human potential. With over 23 years of global experience, she specializes in transitioning elite performers into impactful leaders.",
        170
      );
      doc.text(profileText, 20, currentY);
      doc.save('Pratibha_Tiwari_Executive_Profile.pdf');
    } catch (_e) {
      // Silent failure — PDF generation unavailable
    }
  };

  return (
    <section ref={containerRef} className="pt-40 pb-32 px-6 overflow-hidden relative bg-[#FBF7F0]/30">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-full h-[800px] bg-primary/[0.02] -skew-y-6 translate-y-[-20%] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[400px] bg-gold/[0.03] skew-y-6 translate-y-[20%] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-32 items-start relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="relative lg:order-2 lg:ml-auto w-full"
        >
          <div className="relative group max-w-xl mx-auto lg:mr-0">
            {/* Bold Architectural Frame Elements */}
            <div className="absolute -top-12 -right-12 w-64 h-64 border-t-[3px] border-r-[3px] border-gold/30 z-0" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 border-b-[3px] border-l-[3px] border-primary/20 z-0" />
            
            {/* Secondary Thin Frame */}
            <div className="absolute -inset-4 border border-primary/5 rounded-[2rem] md:rounded-[3rem] z-0" />
            
            {/* Main Image Container - Enlarged */}
            <div className="relative z-10 aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_80px_120px_-30px_rgba(26,58,92,0.3)] bg-slate-200">
              <motion.img 
                style={{ y: imageY }}
                src={portrait}
                alt="Pratibha Tiwari"
                className="w-full h-[120%] object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-white/10" />
            </div>
            
            {/* Floating Achievement Card - Refined & Compact on Mobile */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute -bottom-8 right-2 sm:-bottom-12 sm:-right-4 lg:-bottom-16 lg:-right-16 z-20 bg-white/95 backdrop-blur-xl p-4 sm:p-6 lg:p-10 rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] shadow-[0_20px_50px_-10px_rgba(26,58,92,0.2)] lg:shadow-[0_40px_80px_-15px_rgba(26,58,92,0.2)] border border-primary/10 min-w-[220px] sm:min-w-[280px] lg:min-w-[320px]"
            >
              <div className="space-y-3 sm:space-y-6">
                <div className="flex items-center space-x-3 sm:space-x-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gold/10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                    <div className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-gold rounded-full animate-pulse" />
                  </div>
                  <div>
                    <div className="font-serif text-lg sm:text-2xl lg:text-3xl text-primary font-bold italic leading-none">23+ Years</div>
                    <div className="text-[8px] sm:text-[10px] lg:text-[11px] font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gold mt-1 sm:mt-2">Global Impact</div>
                  </div>
                </div>
                
                <div className="h-px bg-primary/5 w-full" />
                
                <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-8">
                  <div className="space-y-0.5 sm:space-y-1">
                    <div className="text-base sm:text-xl lg:text-2xl font-serif text-primary font-bold">4,000+</div>
                    <div className="text-[8px] sm:text-[9px] font-mono uppercase text-primary tracking-wider">Leaders Coached</div>
                  </div>
                  <div className="space-y-0.5 sm:space-y-1">
                    <div className="text-base sm:text-xl lg:text-2xl font-serif text-primary font-bold">2,700+</div>
                    <div className="text-[8px] sm:text-[9px] font-mono uppercase text-primary tracking-wider">Coaching Hours</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Narrative Layer */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="space-y-12 lg:order-1"
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-px bg-gold/40" />
              <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-gold font-bold">
                The Architect of Potential
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-primary leading-[0.85] tracking-tight italic">
              About <br />
              <span className="not-italic bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Pratibha</span>
            </h1>
          </div>
          
          <div className="space-y-10">
            <div className="relative group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold/10 group-hover:bg-gold transition-colors duration-500" />
              <p className="text-xl md:text-2xl font-serif italic text-primary leading-relaxed font-normal pl-8">
                "Helping leaders discover their potential, embrace change, and lead with confidence in an AI-driven world."
              </p>
            </div>
            
            <div className="space-y-8 font-serif leading-relaxed text-lg md:text-xl lg:text-2xl">
              <p className="text-primary">
                With over 23 years of global experience, Pratibha Tiwari is an ICF-PCC Certified Executive Coach, AI Leadership Strategist, TEDx Speaker, NLP Trainer, and Corporate Leadership Coach dedicated to empowering professionals, entrepreneurs, executives, and organizations across the UAE.
              </p>
              
              <p className="text-primary">
                Having coached 4,000+ professionals from 150+ nationalities and 2,700+ Coaching hours and substantial training hours spent for professionals and for organizational growth, she combines executive coaching, emotional intelligence, leadership development, and AI-ready strategies to help individuals communicate with confidence, inspire teams, and create meaningful impact.
              </p>
              
              <div className="flex items-center space-x-3 text-gold italic font-medium">
                <ChevronRight className="w-5 h-5" />
                <span>Helping people become the leaders they are meant to be.</span>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-wrap gap-6 items-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownload}
              className="relative group bg-primary text-white overflow-hidden rounded-full transition-all duration-500 shadow-2xl shadow-primary/20"
            >
              <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <div className="relative flex items-center space-x-6 px-10 py-5">
                <div className="flex flex-col items-start">
                  <span className="text-[9px] font-mono uppercase tracking-[0.3em] ">Curated Dossier</span>
                  <span className="text-sm font-bold uppercase tracking-widest">Download Executive Profile</span>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center transition-colors">
                  <Download size={20} className="text-white" />
                </div>
              </div>
            </motion.button>
            
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                  <img src={`https://ui-avatars.com/api/?name=Leader+${i}&background=1A3A5C&color=B8974A&bold=true`} alt="Leader avatar" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white bg-gold/10 flex items-center justify-center text-[10px] font-bold text-gold">
                150+
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

