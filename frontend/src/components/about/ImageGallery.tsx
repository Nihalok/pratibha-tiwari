/**
 * ImageGallery.tsx
 * 
 */

import React from 'react';
import { Reveal } from '../Reveal';

// Import images from assets
import gallery1 from '../../assets/images/1.jpg';
import gallery2 from '../../assets/images/2.jpg';
import gallery3 from '../../assets/images/3.jpg';
import gallery4 from '../../assets/images/4.jpg';
import gallery5 from '../../assets/images/5.jpg';
import gallery6 from '../../assets/images/6.jpg';
import gallery7 from '../../assets/images/7.jpg';
import gallery8 from '../../assets/images/8.jpg';
import gallery9 from '../../assets/images/9.jpg';
import gallery10 from '../../assets/images/10.jpg';
import gallery11 from '../../assets/images/11.jpg';

const galleryImages = [
  { id: 1, alt: 'Empowering Moments', src: gallery1 },
  { id: 2, alt: 'Leadership Journey', src: gallery2 },
  { id: 3, alt: 'Strategic Excellence', src: gallery3 },
  { id: 4, alt: 'Impactful Conversations', src: gallery4 },
  { id: 5, alt: 'Professional Growth', src: gallery5 },
  { id: 6, alt: 'Mentorship in Action', src: gallery6 },
  { id: 7, alt: 'Global Speaking', src: gallery7 },
  { id: 8, alt: 'Knowledge Sharing', src: gallery8 },
  { id: 9, alt: 'Career Transformation', src: gallery9 },
  { id: 10, alt: 'Workshop Insights', src: gallery10 },
  { id: 11, alt: 'Visionary Leadership', src: gallery11 },
];

export default function ImageGallery() {
  return (
    <section className="py-20 md:py-32 px-4 md:px-6 bg-[#FAF7F6] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <Reveal>
          <div className="text-center mb-10 md:mb-20">
            <h2 className="text-3xl md:text-6xl font-serif italic mb-4 md:mb-6 text-primary">Gallery of Excellence</h2>
            <p className="text-secondary font-sans tracking-[0.4em] uppercase text-[9px] md:text-[10px] font-bold">Architecture of a Legacy</p>
            <p className="text-mist text-xs font-mono mt-3 md:hidden">Swipe or drag sideways to explore →</p>
          </div>
        </Reveal>

        {/* Mobile View: Drag to side one by one */}
        <div className="flex md:hidden flex-row overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 gap-4 w-full h-[440px]">
          {galleryImages.map((image) => (
            <div
              key={`mobile-${image.id}`}
              className="relative w-[82vw] max-w-[320px] sm:w-[360px] h-full shrink-0 snap-center rounded-3xl overflow-hidden bg-white/50 backdrop-blur-sm shadow-xl shadow-primary/5 cursor-grab active:cursor-grabbing"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="absolute inset-0 w-full h-full object-cover bg-gray-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex flex-col justify-end p-6">
                <p className="text-white font-serif italic text-xl drop-shadow-md">
                  {image.alt}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Exact Original Accordion Expanding Layout */}
        <div className="hidden md:flex flex-row justify-center items-stretch h-[650px] w-full gap-3 md:gap-4 transition-all duration-700 group/container">
          {galleryImages.map((image, index) => (
            <div
              key={`desktop-${image.id}`}
              className={`
                relative h-full flex-none md:flex-[1] overflow-hidden cursor-pointer rounded-3xl
                transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
                hover:flex-none md:hover:flex-[12]
                group/card
                bg-white/50 backdrop-blur-sm
                shadow-2xl shadow-primary/5
                ${index % 2 === 0 ? 'md:translate-y-8' : 'md:-translate-y-8'}
              `}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover/card:scale-110 bg-white/5 group-hover/card:grayscale-0"
              />

              {/* Subtle overlay for inactive cards */}
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/container:opacity-100 group-hover/card:opacity-0 transition-opacity duration-500 pointer-events-none" />

              {/* Content on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-8">
                <p className="text-white font-serif italic text-2xl lg:text-3xl translate-y-4 group-hover/card:translate-y-0 transition-transform duration-500 delay-100">
                  {image.alt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
