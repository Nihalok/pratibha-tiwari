import React from 'react';

export default function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#F0F9FF]"
      style={{ contain: 'strict', willChange: 'auto' }}
    >
      {/* Soft Ambient Gradients — pure CSS, zero JS cost */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#BAE6FD_0%,transparent_80%)] opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#FCE7F3_0%,transparent_70%)] opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,#7DD3FC_0%,transparent_80%)]" />

      {/* Fluid Bloom 1 — CSS animation only, no JS */}
      <div className="animated-blob blob-1 absolute -top-[15%] -left-[10%] w-[90vw] h-[90vw] rounded-full bg-[#7DD3FC]/20 blur-[60px]" />

      {/* Fluid Bloom 2 — CSS animation only */}
      <div className="animated-blob blob-2 absolute top-[10%] -right-[20%] w-[85vw] h-[85vw] rounded-full bg-[#FBCFE8]/20 blur-[70px]" />

      {/* Fluid Bloom 3 — CSS animation only */}
      <div className="animated-blob blob-3 absolute bottom-1/4 left-1/4 w-[60vw] h-[60vw] rounded-full bg-[#0EA5E9]/10 blur-[50px]" />

      {/* Organic Wave Overlay */}
      <div className="absolute inset-0 opacity-[0.3]">
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path
            d="M-100,200 C200,100 450,500 750,200 C1050,-100 1250,300 1350,200 L1350,1100 L-100,1100 Z"
            fill="#F1F5F9"
          />
        </svg>
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(#1E293B 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Gradient vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/10 pointer-events-none" />
    </div>
  );
}
