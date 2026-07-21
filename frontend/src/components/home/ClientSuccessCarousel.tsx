/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';

const staticTestimonials: any[] = [
  {
    _id: 'st-1',
    quote: "Pratibha's communication coaching completely transformed my confidence and presentation skills. I got the promotion I'd been chasing for 3 years.",
    name: "Senior Manager",
    title: "Global Enterprise, UAE",
    rating: 5,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400"
  },
  {
    _id: 'st-2',
    quote: "Her emotional intelligence workshops changed the way I communicate with my executive team and key stakeholders. Genuinely life-changing leadership growth.",
    name: "Operations Director",
    title: "Tech Sector, Abu Dhabi",
    rating: 5,
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400"
  },
  {
    _id: 'st-3',
    quote: "The executive coaching sessions are practical, powerful, and deeply personal. She sees through your challenges in the best possible way to unlock real potential.",
    name: "Founder & CEO",
    title: "Venture Circle, Dubai",
    rating: 5,
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400"
  },
  {
    _id: 'st-4',
    quote: "An extraordinary mentor who blends corporate acumen with emotional intelligence. Her AI leadership roadmap gave our leadership team absolute strategic clarity.",
    name: "Vice President",
    title: "Financial Services, UAE",
    rating: 5,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400"
  }
];

const TestimonialCard = ({ testimonial }: any) => (
  <motion.div
    whileHover={{
      y: -10,
      scale: 1.02,
      transition: { duration: 0.4, ease: "circOut" }
    }}
    whileTap={{ scale: 0.98 }}
    style={{ perspective: 1200 }}
    className="w-[280px] sm:w-[340px] md:w-[450px] bg-white border border-gold/10 p-6 sm:p-8 md:p-12 rounded-[30px] md:rounded-[40px] shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-20px_rgba(197,163,101,0.2),0_10px_30px_rgba(197,163,101,0.1)] transition-all duration-500 group flex flex-col justify-between shrink-0 h-[340px] md:h-[420px] whitespace-normal relative overflow-hidden transform-gpu will-change-transform"
  >
    {/* Colorful hover glow layer */}
    <div className="absolute inset-0 bg-gradient-to-tr from-secondary/10 via-transparent to-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

    <div className="absolute -top-6 -right-6 p-8 opacity-[0.02] group-hover:opacity-[0.08] transition-all duration-1000 text-primary pointer-events-none group-hover:rotate-12">
      <Quote size={160} fill="currentColor" />
    </div>

    <div className="relative z-10">
      <div className="mb-4 md:mb-6 flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= (testimonial.rating || 5) ? 'text-gold fill-gold' : 'text-primary/10 fill-transparent'}
          />
        ))}
      </div>
      <p className="text-primary text-base sm:text-lg md:text-xl font-serif italic leading-relaxed tracking-tight line-clamp-[6] md:line-clamp-[8]">
        "{testimonial.quote}"
      </p>
    </div>

    <div className="flex items-center space-x-4 sm:space-x-5 relative z-10">
      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-gold/10 group-hover:border-secondary transition-all duration-1000 ring-4 ring-gold/5 group-hover:ring-secondary/5 shrink-0">
        <img
          src={testimonial.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name || 'Leader')}&background=1A3A5C&color=B8974A&bold=true`}
          alt={testimonial.name}
          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="space-y-1 overflow-hidden">
        <h4 className="text-base md:text-lg font-serif text-primary tracking-wide leading-tight group-hover:text-secondary transition-colors duration-500 truncate">{testimonial.name}</h4>
        <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] text-mist font-bold leading-tight flex items-center truncate">
          <span className="w-3 sm:w-4 h-px bg-gold/30 mr-2 group-hover:w-6 transition-all duration-500 shrink-0" />
          <span className="truncate">{testimonial.title}</span>
        </p>
      </div>
    </div>
  </motion.div>
);

const MarqueeRow = ({
  items,
  direction = 1,
  speed = 60,
  mobileSpeed,
}: {
  items: any[];
  direction?: 1 | -1;
  speed?: number;
  mobileSpeed?: number;
}) => {
  const [paused, setPaused] = useState(false);
  const touchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (items.length === 0) return null;

  // Detect mobile for speed: use window.innerWidth at render time
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const activeDuration = isMobile && mobileSpeed !== undefined ? mobileSpeed : speed;

  const handleTouchStart = () => {
    if (touchRef.current) clearTimeout(touchRef.current);
    setPaused(true);
  };

  const handleTouchEnd = () => {
    // Resume after a short delay so single-tap feels responsive
    touchRef.current = setTimeout(() => setPaused(false), 1200);
  };

  const playState = paused ? 'paused' : 'running';

  return (
    <div
      className="relative flex overflow-hidden py-10 w-full group"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div
        className="flex space-x-6 md:space-x-12 items-stretch whitespace-nowrap will-change-transform animate-marquee group-hover:[animation-play-state:paused]"
        style={{
          animationDirection: direction === 1 ? 'normal' : 'reverse',
          animationDuration: `${activeDuration}s`,
          animationPlayState: playState,
        }}
      >
        {/* Double items for seamless percentage-based loop */}
        {[...items, ...items].map((item, i) => (
          <TestimonialCard key={`${item.id || item._id}-${i}`} testimonial={item} />
        ))}
      </div>
    </div>
  );
};

export default function ClientSuccessCarousel() {
  const [items, setItems] = useState<any[]>(staticTestimonials);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials/home', { signal: controller.signal });
        clearTimeout(timeoutId);
        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.length > 0) {
            setItems(data.data);
          } else {
            setItems(staticTestimonials);
          }
        }
      } catch (_error) {
        // Fast fallback to static testimonials
      }
    };

    fetchTestimonials();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  // Use all items for a single marquee row
  const marqueeItems = items.length > 0
    ? [...items, ...staticTestimonials.filter(st => !items.some(it => it.name === st.name))]
    : staticTestimonials;

  return (
    <section className="pt-12 md:pt-20 pb-40 bg-[#f8f9fa] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,163,101,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-[10px] uppercase tracking-[0.6em] text-secondary mb-8 block font-bold"
          >
            Voices of Transformation.
          </motion.span>
          <h2 className="text-5xl md:text-7xl font-serif text-primary italic leading-tight tracking-tighter">
            Real Stories. <br />
            <span className="not-italic text-secondary">Real Results</span>
          </h2>
        </div>

        <div className="space-y-4">
          <MarqueeRow items={marqueeItems} direction={1} speed={100} mobileSpeed={45} />
        </div>

        <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 text-center">
        <p className="text-mist font-mono text-[9px] uppercase tracking-[0.4em]">Trusted by executives at Top Fortune 500 companies </p>
      </div>
    </section>
  );
}
