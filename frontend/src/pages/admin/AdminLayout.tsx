/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { LayoutDashboard, FileText, MessageSquare, LogOut, Loader2, Star, Shield, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './Dashboard';
import Posts from './Posts';
import Messages from './Messages';
import Testimonials from './Testimonials';
import { ADMIN_PREFIX, ADMIN_ROUTES } from '../../config/admin';

export default function AdminLayout() {
  const { user, isAdmin, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate(`/${ADMIN_PREFIX}/login`);
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarLinks = [
    { name: 'Dashboard', href: ADMIN_ROUTES.base, icon: <LayoutDashboard size={20} /> },
    { name: 'Blog Posts', href: ADMIN_ROUTES.posts, icon: <FileText size={20} /> },
    { name: 'Messages', href: ADMIN_ROUTES.messages, icon: <MessageSquare size={20} /> },
    { name: 'Testimonials', href: ADMIN_ROUTES.testimonials, icon: <Star size={20} /> },
  ];

  const handleLogout = async () => {
    setIsMobileMenuOpen(false);
    await logout();
    navigate(`/${ADMIN_PREFIX}/login`, { replace: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen flex flex-col md:flex-row bg-gray-50 text-gray-900"
    >
      {/* Top Mobile Bar / Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-3 md:hidden flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-xl text-primary hover:bg-gray-100 transition-colors"
            aria-label="Toggle Navigation Menu"
            aria-controls="admin-mobile-menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="flex items-center space-x-2">
            <Shield className="text-secondary" size={20} />
            <span className="font-serif font-bold text-primary text-lg">Admin Panel</span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
          title="Sign Out"
        >
          <LogOut size={20} />
        </button>
      </header>

      {/* Quick Horizontal Tab Bar for Medium+ and Mobile Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center overflow-x-auto gap-2 scrollbar-none md:hidden shadow-xs">
        {sidebarLinks.map((link) => {
          const isActive = location.pathname === link.href || (link.href !== ADMIN_ROUTES.base && location.pathname.startsWith(link.href));
          return (
            <Link
              key={link.name}
              to={link.href}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                isActive 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'text-gray-600 bg-gray-100/80 hover:bg-gray-200'
              }`}
            >
              {React.cloneElement(link.icon, { size: 15 })}
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex md:flex-col shrink-0 min-h-screen">
        <div className="p-6 lg:p-8 border-b border-gray-100 flex items-center space-x-3">
          <Shield className="text-secondary" size={26} />
          <span className="font-serif font-bold text-primary text-xl">Admin Panel</span>
        </div>
        <nav className="p-4 lg:p-6 space-y-2 flex-grow">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.href || (link.href !== ADMIN_ROUTES.base && location.pathname.startsWith(link.href));
            return (
              <Link 
                key={link.name} 
                to={link.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive ? 'bg-primary text-white shadow-lg shadow-primary/20 font-semibold' : 'text-gray-600 hover:bg-gray-100 font-medium'
                }`}
              >
                {link.icon}
                <span className="text-sm">{link.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 lg:p-6 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all w-full font-medium"
          >
            <LogOut size={20} />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="admin-mobile-menu"
            initial={{ opacity: 0, x: -250 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -250 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white/98 backdrop-blur-2xl z-50 flex flex-col p-6 overflow-y-auto md:hidden"
          >
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <Shield className="text-secondary" size={24} />
                <span className="font-serif font-bold text-primary text-xl">Admin Panel</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-2.5 rounded-xl bg-gray-100 text-primary hover:bg-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-3 flex-grow">
              {sidebarLinks.map((link) => {
                const isActive = location.pathname === link.href || (link.href !== ADMIN_ROUTES.base && location.pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all ${
                      isActive ? 'bg-primary text-white shadow-lg shadow-primary/20 font-bold' : 'text-gray-700 bg-gray-50 hover:bg-gray-100 font-medium'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {React.cloneElement(link.icon, { size: 22 })}
                    <span className="text-base">{link.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="pt-6 mt-6 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center space-x-3 px-5 py-4 rounded-2xl bg-red-50 text-red-500 font-semibold hover:bg-red-100 transition-all w-full"
              >
                <LogOut size={20} />
                <span className="text-base">Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-grow p-4 sm:p-6 lg:p-10 overflow-y-auto w-full max-w-full min-w-0">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="posts" element={<Posts />} />
          <Route path="messages" element={<Messages />} />
          <Route path="testimonials" element={<Testimonials />} />
        </Routes>
      </main>
    </motion.div>
  );
}
