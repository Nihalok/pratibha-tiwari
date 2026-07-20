import React from 'react';
import { motion } from 'motion/react';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#F0F9FF]">
      {/* Soft Ambient Gradients - Saturated for maximum visibility */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#BAE6FD_0%,transparent_80%)] opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#FCE7F3_0%,transparent_70%)] opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,#7DD3FC_0%,transparent_80%)] " />

      {/* Main Fluid Blooms (Simplified) */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[15%] -left-[10%] w-[90vw] h-[90vw] rounded-full bg-[#7DD3FC]/20 blur-[80px] will-change-transform"
      />
      
      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          x: [0, -40, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] -right-[20%] w-[85vw] h-[85vw] rounded-full bg-[#FBCFE8]/20 blur-[90px] will-change-transform"
      />

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 left-1/4 w-[60vw] h-[60vw] rounded-full bg-[#0EA5E9]/10 blur-[70px] will-change-transform"
      />

      {/* Organic Wave Overlays - Simplified */}
      <div className="absolute inset-0 opacity-[0.3]">
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path
            d="M-100,200 C200,100 450,500 750,200 C1050,-100 1250,300 1350,200 L1350,1100 L-100,1100 Z"
            fill="#F1F5F9"
          />
        </svg>
      </div>

      {/* Floating Contours - Hidden for Performance */}
      <div className="hidden absolute inset-0 opacity-[0.1]">
        <svg viewBox="0 0 1000 1000" className="w-full h-full">
          <motion.path
            d="M-50,100 Q350,0 650,300 T1150,100"
            stroke="#1E293B"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.08]" 
        style={{ 
          backgroundImage: `radial-gradient(#1E293B 1.5px, transparent 1.5px)`,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Noise and Texture Overlays - Optimized with inline SVG noise */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/10 pointer-events-none" />
    </div>
  );
}
