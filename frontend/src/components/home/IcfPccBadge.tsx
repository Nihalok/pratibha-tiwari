/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export default function IcfPccBadge({ className = "w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44" }: { className?: string }) {
  return (
    <div className={`relative rounded-full shadow-2xl overflow-hidden bg-white select-none ${className}`}>
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block"
      >
        {/* Outer Pure White Base Circle */}
        <circle cx="250" cy="250" r="245" fill="#FFFFFF" />

        {/* Dual Gold Border Rings */}
        <circle cx="250" cy="250" r="238" stroke="#B8974A" strokeWidth="5" fill="none" />
        <circle cx="250" cy="250" r="228" stroke="#B8974A" strokeWidth="2" fill="none" />

        {/* Top Gold Star & Accent Divider */}
        <polygon
          points="250,55 254,67 267,67 256,75 260,87 250,79 240,87 244,75 233,67 246,67"
          fill="#B8974A"
        />
        <line x1="225" y1="96" x2="275" y2="96" stroke="#B8974A" strokeWidth="1.5" />
        <circle cx="250" cy="96" r="3" fill="#B8974A" />

        {/* Left Laurel Branch */}
        <g fill="#B8974A" opacity="0.9">
          <path d="M125 150 C112 175 102 205 102 235 C102 265 110 295 125 320" stroke="#B8974A" strokeWidth="3.5" fill="none" />
          <ellipse cx="116" cy="138" rx="7" ry="16" transform="rotate(-35 116 138)" />
          <ellipse cx="106" cy="166" rx="7" ry="16" transform="rotate(-25 106 166)" />
          <ellipse cx="98" cy="196" rx="7" ry="16" transform="rotate(-15 98 196)" />
          <ellipse cx="96" cy="228" rx="7" ry="16" transform="rotate(-5 96 228)" />
          <ellipse cx="98" cy="260" rx="7" ry="16" transform="rotate(10 98 260)" />
          <ellipse cx="106" cy="290" rx="7" ry="16" transform="rotate(25 106 290)" />
          <ellipse cx="118" cy="318" rx="7" ry="16" transform="rotate(40 118 318)" />

          <ellipse cx="132" cy="158" rx="6" ry="14" transform="rotate(15 132 158)" />
          <ellipse cx="122" cy="188" rx="6" ry="14" transform="rotate(25 122 188)" />
          <ellipse cx="116" cy="218" rx="6" ry="14" transform="rotate(35 116 218)" />
          <ellipse cx="116" cy="250" rx="6" ry="14" transform="rotate(45 116 250)" />
          <ellipse cx="124" cy="280" rx="6" ry="14" transform="rotate(55 124 280)" />
        </g>

        {/* Right Laurel Branch */}
        <g fill="#B8974A" opacity="0.9">
          <path d="M375 150 C388 175 398 205 398 235 C398 265 390 295 375 320" stroke="#B8974A" strokeWidth="3.5" fill="none" />
          <ellipse cx="384" cy="138" rx="7" ry="16" transform="rotate(35 384 138)" />
          <ellipse cx="394" cy="166" rx="7" ry="16" transform="rotate(25 394 166)" />
          <ellipse cx="402" cy="196" rx="7" ry="16" transform="rotate(15 402 196)" />
          <ellipse cx="404" cy="228" rx="7" ry="16" transform="rotate(5 404 228)" />
          <ellipse cx="402" cy="260" rx="7" ry="16" transform="rotate(-10 402 260)" />
          <ellipse cx="394" cy="290" rx="7" ry="16" transform="rotate(-25 394 290)" />
          <ellipse cx="382" cy="318" rx="7" ry="16" transform="rotate(-40 382 318)" />

          <ellipse cx="368" cy="158" rx="6" ry="14" transform="rotate(-15 368 158)" />
          <ellipse cx="378" cy="188" rx="6" ry="14" transform="rotate(-25 378 188)" />
          <ellipse cx="384" cy="218" rx="6" ry="14" transform="rotate(-35 384 218)" />
          <ellipse cx="384" cy="250" rx="6" ry="14" transform="rotate(-45 384 250)" />
          <ellipse cx="376" cy="280" rx="6" ry="14" transform="rotate(-55 376 280)" />
        </g>

        {/* Text Line 1: ICF-PCC, */}
        <text
          x="250"
          y="145"
          textAnchor="middle"
          fill="#0B2239"
          fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
          fontWeight="900"
          fontSize="48"
          letterSpacing="-0.5"
        >
          ICF-PCC,
        </text>

        {/* Mid Line Divider 1 */}
        <line x1="180" y1="166" x2="320" y2="166" stroke="#B8974A" strokeWidth="1.5" />
        <circle cx="250" cy="166" r="3.5" fill="#B8974A" />

        {/* Text Line 2: Corporate & */}
        <text
          x="250"
          y="208"
          textAnchor="middle"
          fill="#0B2239"
          fontFamily="Georgia, serif"
          fontWeight="700"
          fontSize="36"
        >
          Corporate &amp;
        </text>

        {/* Text Line 3: NLP Trainer */}
        <text
          x="250"
          y="252"
          textAnchor="middle"
          fill="#0B2239"
          fontFamily="Georgia, serif"
          fontWeight="700"
          fontSize="36"
        >
          NLP Trainer
        </text>

        {/* Mid Line Divider 2 */}
        <line x1="180" y1="274" x2="320" y2="274" stroke="#B8974A" strokeWidth="1.5" />
        <circle cx="250" cy="274" r="3.5" fill="#B8974A" />

        {/* TEDX Logo - Centered */}
        <text
          x="240"
          y="336"
          textAnchor="middle"
          fill="#E62B1E"
          fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
          fontWeight="900"
          fontSize="54"
          letterSpacing="-1"
        >
          TED
          <tspan fontSize="36" dy="-16" dx="2">X</tspan>
        </text>

        {/* Bottom Dark Navy Ribbon Banner Shape */}
        <path
          d="M 98 340 Q 250 375 402 340 C 420 375 400 450 250 480 C 100 450 80 375 98 340 Z"
          fill="#0B2239"
        />

        {/* Fleur-de-lis Gold Icon */}
        <g fill="#B8974A" transform="translate(250, 395) scale(0.6)">
          <path d="M0 -15 C-4 -6 -10 -2 -14 6 C-17 13 -13 20 -5 18 C0 17 0 10 0 10 C0 10 0 17 5 18 C13 20 17 13 14 6 C10 -2 4 -6 0 -15 Z" />
          <path d="M0 -22 C4 -14 10 -4 10 5 C6 5 2 2 0 -2 C-2 2 -6 5 -10 5 C-10 -4 -4 -14 0 -22 Z" />
          <rect x="-12" y="7" width="24" height="3" rx="1.5" fill="#B8974A" />
        </g>

        {/* Banner Text: LEAD • INSPIRE • IMPACT */}
        <text
          x="180"
          y="432"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="system-ui, sans-serif"
          fontWeight="700"
          fontSize="15"
          letterSpacing="1.5"
          transform="rotate(-12 180 432)"
        >
          LEAD
        </text>
        <circle cx="218" cy="438" r="2" fill="#B8974A" />
        <text
          x="250"
          y="442"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="system-ui, sans-serif"
          fontWeight="700"
          fontSize="15"
          letterSpacing="1.5"
        >
          INSPIRE
        </text>
        <circle cx="282" cy="438" r="2" fill="#B8974A" />
        <text
          x="320"
          y="432"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="system-ui, sans-serif"
          fontWeight="700"
          fontSize="15"
          letterSpacing="1.5"
          transform="rotate(12 320 432)"
        >
          IMPACT
        </text>
      </svg>
    </div>
  );
}
