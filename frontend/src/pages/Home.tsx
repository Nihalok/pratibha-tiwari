/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import SEO from '../components/layout/SEO';
import Hero from '../components/home/Hero';
import LogoTicker from '../components/home/LogoTicker';
import TrustAnchors from '../components/home/TrustAnchors';
import FourPillars from '../components/home/FourPillars';
import MultimediaShelf from '../components/home/MultimediaShelf';
import ClientSuccessCarousel from '../components/home/ClientSuccessCarousel';
import LatestBlogFeed from '../components/home/LatestBlogFeed';
import FinalCTA from '../components/home/FinalCTA';
import AssessmentPopup from '../components/home/AssessmentPopup';
import { Reveal } from '../components/Reveal';


export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-transparent"
    >
      <SEO 
        title="Pratibha Tiwari | AI Leadership & Corporate Performance"
        description="Global authority on AI leadership, executive coaching, and corporate performance based in UAE. Empowering leaders for the digital age."
      />
      
      {/* Scroll Triggered Assessment Popup */}
      <AssessmentPopup />

      {/* Hero Section */}
      <section className="w-full flex items-center justify-center relative">
        <Hero />
      </section>
      
      {/* Small Utility Sections with elegant spacing & branding background */}
      <div className="bg-transparent space-y-12 md:space-y-20 pt-20 md:pt-32 pb-16 md:pb-24 relative overflow-hidden">
        {/* Large Decorative Text for Aesthetic Transition */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full pointer-events-none opacity-[0.03] select-none font-serif text-[18vw] whitespace-nowrap leading-none text-primary">
          EXCELLENCE • IMPACT • LEGACY
        </div>
        
        <LogoTicker />
        <div className="py-12 md:py-20 relative z-10">
          <TrustAnchors />
        </div>
      </div>
      
      {/* Four Pillars */}
      <FourPillars />
      
      {/* Core Content sections with optimized spacing */}
      <div className="space-y-0 pb-16 md:pb-24">
        <section className="w-full flex items-center justify-center overflow-hidden px-4">
          <Reveal><MultimediaShelf /></Reveal>
        </section>
        
        <section className="w-full flex items-center justify-center bg-transparent px-4">
          <Reveal><ClientSuccessCarousel /></Reveal>
        </section>
        
        <section className="w-full flex items-center justify-center px-4">
          <Reveal><LatestBlogFeed /></Reveal>
        </section>
      </div>
      
      <section className="w-full flex items-center justify-center bg-charcoal text-white py-16 md:py-24 px-4">
        <Reveal><FinalCTA /></Reveal>
      </section>
    </motion.div>
  );
}
