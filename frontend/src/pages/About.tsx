/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import SEO from '../components/layout/SEO';
import AboutHero from '../components/about/AboutHero';
import JourneyHeroSlider from '../components/about/JourneyHeroSlider';
import VideoRevealSection from '../components/about/VideoRevealSection';
import Timeline from '../components/about/Timeline';
import Philosophy from '../components/about/Philosophy';
import ClientTicker from '../components/about/ClientTicker';
import ImageGallery from '../components/about/ImageGallery';
import Credentials from '../components/about/Credentials';

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <SEO 
        title="About Pratibha Tiwari" 
        description="Learn about Pratibha Tiwari's journey as a global AI leadership coach, her mental architecture philosophy, and her career milestones."
      />
      <AboutHero />
      <ClientTicker />
      <JourneyHeroSlider />
      <VideoRevealSection />
      <ImageGallery />
      <Timeline />
      <Philosophy />
      <Credentials />
    </motion.div>
  );
}
