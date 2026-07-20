/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { AuthProvider } from './lib/auth';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingContact from './components/layout/FloatingContact';
import ScrollToTop from './components/layout/ScrollToTop';
import ReadingProgressBar from './components/layout/ReadingProgressBar';
import AnimatedBackground from './components/layout/AnimatedBackground';
import SmoothScroll from './components/layout/SmoothScroll';
import SEO from './components/layout/SEO';

import Home from './pages/Home';
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Insights = lazy(() => import('./pages/Insights'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const CareerAssessment = lazy(() => import('./pages/CareerAssessment'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));

import { ADMIN_PREFIX } from './config/admin';

const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const ResetPassword = lazy(() => import('./pages/admin/ResetPassword'));

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith(`/${ADMIN_PREFIX}`) || location.pathname.startsWith('/reset-password');

  return (
    <div className="relative min-h-screen flex flex-col bg-transparent selection:bg-accent/20 selection:text-primary">
      <SEO />
      <AnimatedBackground />
      {!isAdminPath && <ReadingProgressBar />}
      <ScrollToTop />
      {!isAdminPath && <FloatingContact />}
      {!isAdminPath && <Navbar />}
      <main className="flex-grow min-h-[75vh] w-full">
        {children}
      </main>
      {!isAdminPath && <Footer />}
    </div>
  );
}

const PageLoader = () => (
  <div className="min-h-[75vh] w-full flex flex-col items-center justify-center py-20 bg-transparent">
    <div className="w-10 h-10 border-2 border-gold/20 border-t-gold rounded-full animate-spin"></div>
  </div>
);

const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-20">
    <span className="font-mono text-xs uppercase tracking-[0.5em] text-secondary mb-6 block">Error 404</span>
    <h1 className="text-5xl md:text-7xl font-serif text-primary italic mb-8">
      Pathways <br className="md:hidden" />
      <span className="not-italic text-secondary">Uncharted.</span>
    </h1>
    <p className="text-mist max-w-md mx-auto mb-12 text-lg font-serif italic">
      The coordinates you requested do not exist in this presence.
    </p>
    <a 
      href="/" 
      className="bg-primary hover:bg-secondary text-white font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-full transition-all hover:scale-105 shadow-xl shadow-primary/10 hover:shadow-secondary/15"
    >
      Return to Home
    </a>
  </div>
);

function AnimatedRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/insights/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/career-assessment" element={<CareerAssessment />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path={`/${ADMIN_PREFIX}/login`} element={<AdminLogin />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path={`/${ADMIN_PREFIX}/*`} element={<AdminLayout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <SmoothScroll>
            <LayoutWrapper>
              <AnimatedRoutes />
            </LayoutWrapper>
          </SmoothScroll>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}
