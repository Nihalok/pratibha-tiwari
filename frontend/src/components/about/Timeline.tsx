/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValueEvent } from 'motion/react';
import { Heart, Target, Star, Award, TrendingUp, Users, Globe, Zap, Sparkles, BookOpen, Mic2, Brain } from 'lucide-react';
import { useState } from 'react';

const milestones = [
  { 
 
    text: 'Born with a medical challenge — doctors said I wouldn\'t survive. I did.', 
    icon: <Heart className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1519810755548-39cd217da494?auto=format&fit=crop&q=80&w=1000"
  },
  { 
    
    text: 'Double Masters: Computer Applications + Philosophy.', 
    icon: <BookOpen className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=1000"
  },
  { 
 
    text: 'Success as a Software Engineer — building foundations in logical architecture.', 
    icon: <Zap className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000"
  },
  { 
 
    text: 'Intentional pause for parenting — deepening human understanding & emotional intelligence.', 
    icon: <Users className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1510154221590-ff63e90a136f?auto=format&fit=crop&q=80&w=1000"
  },
  { 
  
    text: 'Founded "Design Super Destiny" Coaching & Consultancy in the UAE.', 
    icon: <Target className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000"
  },
  { 

    text: 'Certified NLP Master Practitioner (trained by Vikram Dhar).', 
    icon: <Brain className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000"
  },
  { 

    text: 'Certified Emotional Intelligence Coach & Licensed Behavioral Trainer.', 
    icon: <Sparkles className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000"
  },
  { 

    text: 'Global Career Counsellor (UCLA Extension).', 
    icon: <Globe className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1454165833767-0274b0426abd?auto=format&fit=crop&q=80&w=1000"
  },
  { 

    text: 'Published "Motivational Diet — 369 Days" (Focus, Efficiency, Productivity).', 
    icon: <Award className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1000"
  },
  { 
  
    text: 'TEDx Speaker addressing global audiences on the power of presence.', 
    icon: <Mic2 className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1000"
  },
  { 
   
    text: '23+ Years experience, 4000+ professionals trained, based in Abu Dhabi.', 
    icon: <Star className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000"
  }
];

export default function Timeline() {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  // Calculate the horizontal translation
  // Starting from 0% so the first card is visible immediately (offset by px-[10vw]).
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-82%"]);
  
  const springX = useSpring(x, {
    stiffness: 120,
    damping: 30,
    mass: 0.2,
    restDelta: 0.005
  });

  // Parallax for floating elements
  const floatY1 = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const floatY2 = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  const [activeIndex, setActiveIndex] = useState(0);
  
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const step = 1 / (milestones.length - 1);
    const index = Math.min(Math.max(Math.round(latest / step), 0), milestones.length - 1);
    setActiveIndex((prev) => (prev !== index ? index : prev));
  });

  return (
    <section ref={targetRef} className="relative h-[500vh] bg-transparent">
      {/* Snap Points - Invisible divs to guide the scroll-snap if the parent allows */}
      <div className="absolute inset-0 pointer-events-none flex flex-col">
        {milestones.map((_, i) => (
          <div key={i} className="h-screen w-full snap-start" />
        ))}
      </div>

      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {/* Fixed HUD - Floating Date/Chapter Label */}
        <div className="absolute top-4 right-6 sm:top-12 sm:right-12 md:top-20 md:right-24 z-50 pointer-events-none text-right">
          <div className="flex flex-col items-end">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={`chapter-${activeIndex}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.8em] text-secondary font-bold mb-1 sm:mb-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gold/10 shadow-xs sm:bg-transparent sm:backdrop-blur-none sm:p-0 sm:border-0"
              >
                Chapter {activeIndex + 1}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Floating Decorative Elements - Lightweight GPU layers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div style={{ y: floatY1, rotate }} className="absolute top-[10%] -left-[10%] text-secondary/5 transform-gpu">
            <Sparkles size={160} />
          </motion.div>
          <motion.div style={{ y: floatY2, rotate: -rotate }} className="absolute bottom-[20%] -right-[10%] text-gold/5 transform-gpu">
            <Star size={130} />
          </motion.div>
        </div>
        <motion.div style={{ y: floatY1, x: floatY2 }} className="absolute top-[35%] right-[5%] text-primary/[0.02] pointer-events-none transform-gpu">
          <Heart size={70} />
        </motion.div>

        <div className="relative z-10 px-4 sm:px-6 pt-12 sm:pt-0 mb-6 sm:mb-12">
          <div className="max-w-7xl mx-auto">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.6em] text-secondary mb-2 sm:mb-4 block font-bold"
            >
              The Journey
            </motion.span>
            <h2 className="text-3.5xl sm:text-6xl md:text-8xl font-serif text-primary italic leading-tight">
              Legacy in <span className="not-italic text-secondary">Motion.</span>
            </h2>
          </div>
        </div>

        <div className="relative flex items-center h-[50vh]">
          {/* Horizontal Track line */}
          <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/20 to-transparent top-1/2 -translate-y-1/2" />
          
          <motion.div 
            style={{ x: springX }} 
            className="flex gap-16 sm:gap-24 md:gap-40 px-[10vw] transform-gpu will-change-transform"
          >
            {milestones.map((m, i) => (
              <div 
                key={i} 
                className="relative flex-shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] group transform-gpu"
              >
                {/* Milestone Card - High performance styling */}
                <div 
                  className="relative p-6 sm:p-12 md:p-16 rounded-3xl sm:rounded-[60px] bg-white/70 backdrop-blur-sm border border-gold/10 hover:border-secondary/30 transition-all duration-500 hover:shadow-2xl group-hover:-translate-y-4 overflow-hidden transform-gpu"
                >
                  {/* Card Background Image */}
                  <div className="absolute inset-0 z-0">
                    <img 
                      src={(m as any).image} 
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/80 to-transparent" />
                  </div>

                  {/* Milestone Number Background */}
                  <div className="absolute -top-16 -left-8 text-[12rem] md:text-[15rem] font-serif italic text-primary/[0.02] select-none pointer-events-none group-hover:text-secondary/[0.04] transition-colors duration-700">
                    {i < 9 ? `0${i + 1}` : i + 1}
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-10">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-white shadow-xl shadow-secondary/10 flex items-center justify-center text-secondary group-hover:scale-105 transition-all duration-500">
                        {React.cloneElement(m.icon as React.ReactElement, { className: 'w-6 h-6 sm:w-8 sm:h-8' })}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[11px] uppercase tracking-[0.5em] text-gold font-bold"></span>
                        <div className="h-0.5 w-12 bg-secondary/30" />
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-3xl lg:text-4xl text-primary font-serif italic font-light leading-[1.4] tracking-tight">
                      "{m.text}"
                    </h3>
                  </div>

                  {/* Dot on the track line */}
                  <div className="absolute top-[50%] left-0 -translate-y-1/2 -translate-x-[2.5rem] sm:-translate-x-[4rem] md:-translate-x-[6.5rem] z-20">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white border-2 border-secondary rounded-full shadow-lg flex items-center justify-center">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-secondary rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
