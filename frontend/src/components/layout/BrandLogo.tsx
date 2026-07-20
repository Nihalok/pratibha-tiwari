import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  className?: string;
  showTagline?: boolean;
  isLight?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function BrandLogo({ className = "", showTagline = false, isLight = false, onClick }: BrandLogoProps) {
  const mainColor = isLight ? "fill-white" : "fill-primary";
  const strokeColor = isLight ? "stroke-white" : "stroke-primary";
  const textColor = isLight ? "text-white" : "text-primary";
  const borderColor = isLight ? "border-white/20" : "border-primary/20";
  const taglineColor = isLight ? "text-white" : "text-primary";

  return (
    <Link to="/" onClick={onClick} className={`group flex flex-col items-center text-center w-fit cursor-pointer ${className}`}>
      {/* Monogram Section */}
      <div className="relative w-20 h-20 mb-1">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm overflow-visible">
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
              <feOffset dx="1" dy="1" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.2" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Large 'C' - Navy Blue or White */}
          <text 
            x="45" 
            y="55" 
            textAnchor="middle" 
            className={`${mainColor} font-serif text-[85px] font-black opacity-100`}
            style={{ fontFamily: '"Cormorant Garamond", serif', filter: 'url(#shadow)' }}
          >
            C
          </text>
          
          {/* Script 'P' - Crimson/Red */}
          <text 
            x="55" 
            y="62" 
            textAnchor="middle" 
            className="fill-red-700 font-signature text-[85px] font-bold"
            style={{ fontFamily: '"Mrs Saint Delafield", cursive', filter: 'url(#shadow)' }}
          >
            P
          </text>

          {/* Botanical Branch with Berries */}
          <g className={mainColor} style={{ filter: 'url(#shadow)' }}>
            <path d="M65,55 C75,50 85,55 92,40" className={`fill-none ${strokeColor} stroke-[1.5]`} />
            {/* Berries - Red */}
            <circle cx="88" cy="42" r="1.8" className="fill-red-700" />
            <circle cx="92" cy="38" r="1.8" className="fill-red-700" />
            <circle cx="89" cy="35" r="1.8" className="fill-red-700" />
            
            {/* Leaves */}
            <path d="M72,52 Q76,46 80,52 Q76,58 72,52 Z" className="opacity-80" />
            <path d="M80,48 Q84,42 88,48 Q84,54 80,48 Z" className="opacity-80" />
            <path d="M84,40 Q88,34 92,40 Q88,46 84,40 Z" className="opacity-80" />
          </g>
        </svg>
      </div>

      {/* "Coach" Script - Red */}
      <div className="relative h-10 -mt-8 mb-1 z-10">
        <span 
          className="text-red-700 font-signature text-5xl whitespace-nowrap drop-shadow-md font-bold"
          style={{ fontFamily: '"Mrs Saint Delafield", cursive' }}
        >
          Coach
        </span>
      </div>

      {/* "PRATIBHA" - Navy Serif or White */}
      <div className={`border-t border-b ${borderColor} py-1 px-4 mb-2`}>
        <span 
          className={`${textColor} font-serif text-3xl font-black tracking-[0.25em] uppercase whitespace-nowrap`}
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          Pratibha
        </span>
      </div>

      {/* Tagline - Navy Sans or White */}
      {showTagline && (
        <div className={`flex items-center gap-2 text-[8px] font-sans font-bold tracking-[0.2em] ${taglineColor} uppercase`}>
          <span>Communication</span>
          <span className="text-red-500">|</span>
          <span>Leadership</span>
          <span className="text-red-500">|</span>
          <span>Impact</span>
        </div>
      )}

      {/* Bottom Decoration */}
      <div className="mt-2 flex items-center gap-4 w-full px-12">
        <div className={`h-px ${isLight ? 'bg-white/10' : 'bg-primary/20'} flex-1`} />
        <div className="w-1.5 h-1.5 bg-red-500 rotate-45" />
        <div className={`h-px ${isLight ? 'bg-white/10' : 'bg-primary/20'} flex-1`} />
      </div>
    </Link>
  );
}
