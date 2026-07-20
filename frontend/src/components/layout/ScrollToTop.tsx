/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  // Disable browser automatic scroll restoration on load/reload
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  useLayoutEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      
      const tryScroll = () => {
        const element = document.getElementById(targetId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const targetY = rect.top + scrollTop - 112; // 112px offset for sticky navbar
          if ((window as any).lenis) {
            (window as any).lenis.scrollTo(targetY, { immediate: false });
          } else {
            window.scrollTo({ top: targetY, behavior: 'smooth' });
          }
          return true;
        }
        return false;
      };

      // Try immediately
      if (!tryScroll()) {
        let attempts = 0;
        const intervalId = setInterval(() => {
          attempts++;
          if (tryScroll() || attempts >= 20) {
            clearInterval(intervalId);
          }
        }, 100);
        return () => clearInterval(intervalId);
      }
    } else {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(0, { immediate: true });
      }
    }
  }, [pathname, hash]);

  return null;
}
