/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { useLocation } from 'react-router-dom';

export default function ReadingProgressBar() {
  const { pathname } = useLocation();
  const { scrollYProgress } = useScroll();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Pages where we want to show the progress bar
  const eligiblePages = ['/about', '/insights', '/services'];
  const isBlogPost = pathname.startsWith('/insights/');
  
  if (!eligiblePages.includes(pathname) && !isBlogPost) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-secondary z-[110] origin-left"
      style={{ scaleX }}
    />
  );
}
