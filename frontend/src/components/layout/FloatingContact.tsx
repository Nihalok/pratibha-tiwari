/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Mail } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const WHATSAPP_NUMBER = "971508426354";
const EMAIL = "designsuperdestiny@gmail.com";

export default function FloatingContact() {
  const location = useLocation();
  
  // Only show on Contact page as requested
  if (location.pathname !== '/contact') return null;

  return (
    <div className="fixed bottom-5 right-4 sm:bottom-8 sm:right-8 z-[100] flex flex-col items-end space-y-3 sm:space-y-4">
      <motion.a
        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.1 }}
        className="bg-white text-primary p-3 sm:p-4 rounded-full shadow-[0_10px_30px_rgba(26,58,92,0.15)] border border-gold/10 flex items-center justify-center hover:bg-sky transition-all"
        title="Email Pratibha"
      >
        <Mail size={20} className="sm:w-6 sm:h-6" />
      </motion.a>

      <motion.a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.1 }}
        className="bg-[#25D366] text-white p-3 sm:p-4 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.3)] flex items-center justify-center relative"
        title="WhatsApp Pratibha"
      >
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-[#25D366] rounded-full opacity-20"
        />
        <MessageCircle size={20} className="sm:w-6 sm:h-6" fill="white" />
      </motion.a>
    </div>
  );
}
