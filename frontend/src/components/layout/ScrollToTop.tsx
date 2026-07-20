/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
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

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      
      const tryScroll = () => {
        const element = document.getElementById(targetId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const targetY = rect.top + scrollTop - 112; // 112px offset for sticky navbar
          window.scrollTo({ top: targetY, behavior: 'smooth' });
          return true;
        }
        return false;
      };

      // Try immediately
      if (!tryScroll()) {
        // If the element isn't in the DOM yet (due to page lazy-loading), poll for it
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
    }
  }, [pathname, hash]);

  return null;
}
