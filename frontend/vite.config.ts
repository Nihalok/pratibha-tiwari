import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';

const imgDir = path.resolve(__dirname, './src/assets/images');
const seoRenames: Record<string, string> = {
  'pratibha-tiwari-executive-coach-hero.png': 'hero.png',
  'pratibha-tiwari-about-portrait.png': 'about hero lat.png',
  'pratibha-tiwari-profile.jpeg': 'about-prathibha.jpeg',
  'pratibha-tiwari-leadership-coach.png': 'coach-pratibha-hero-new.png',
  'pratibha-tiwari-career-assessment.jpg': 'assessment.jpg',
  'pratibha-tiwari-ai-leadership-coaching.jpg': 'ai.jpg',
  'pratibha-tiwari-executive-coaching-uae.jpg': 'executive coaching.jpg',
  'pratibha-tiwari-future-ready-leadership.jpg': 'future ready.jpg',
  'pratibha-tiwari-keynote-speaker-tedx.jpg': 'keynotes.jpg',
  'pratibha-tiwari-gallery-01.jpg': '1.jpg',
  'pratibha-tiwari-gallery-02.jpg': '2.jpg',
  'pratibha-tiwari-gallery-03.jpg': '3.jpg',
  'pratibha-tiwari-gallery-04.jpg': '4.jpg',
  'pratibha-tiwari-gallery-05.jpg': '5.jpg',
  'pratibha-tiwari-gallery-06.jpg': '6.JPG',
  'pratibha-tiwari-gallery-07.jpg': '7.JPG',
  'pratibha-tiwari-gallery-08.jpg': '8.JPG',
  'pratibha-tiwari-gallery-09.jpg': '9.JPG',
  'pratibha-tiwari-gallery-10.jpg': '10.JPG',
  'pratibha-tiwari-gallery-11.jpg': '11.JPG',
  'books/pratibha-tiwari-global-voice-book.jpg': 'books/global voice.jpg',
  'certificates/pratibha-tiwari-certified-group-coach.jpg': 'certificates/group coach.jpg',
  'certificates/pratibha-tiwari-icf-pcc-certificate.jpg': 'certificates/icf.jpg',
  'certificates/pratibha-tiwari-nlp-trainer-certificate.jpg': 'certificates/nlp.jpg',
  'certificates/pratibha-tiwari-iit-delhi-certificate.jpg': 'certificates/iit.jpg',
  'certificates/pratibha-tiwari-iapcct-certificate.jpg': 'certificates/iapcct.jpg'
};

// Perform physical copy so disk files exist with both old and SEO names
try {
  for (const [seoName, origName] of Object.entries(seoRenames)) {
    const origPath = path.join(imgDir, origName);
    const seoPath = path.join(imgDir, seoName);
    if (fs.existsSync(origPath) && !fs.existsSync(seoPath)) {
      fs.copyFileSync(origPath, seoPath);
    }
  }
} catch (e) {
  // Ignore filesystem errors silently
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'motion/react',
      'lucide-react',
      'gsap',
      'lenis',
      'swiper',
      'react-helmet-async',
    ],
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['motion/react'],
          icons: ['lucide-react'],
          swiper: ['swiper'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    hmr: process.env.DISABLE_HMR !== 'true',
    // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
});
