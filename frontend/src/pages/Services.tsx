/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useLayoutEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Cpu, Heart, Compass, Mic2, ArrowRight, Check } from 'lucide-react';
import SEO from '../components/layout/SEO';
import FAQSection from '../components/services/FAQSection';

import careerStrategy from '../assets/images/future ready.jpg';
import executiveCoaching from '../assets/images/executive coaching.jpg';
import corporateTraining from '../assets/images/keynotes.jpg';
import leadershipVision from '../assets/images/ai.jpg';

const ServiceImage = ({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="absolute inset-0 bg-pearl/50 overflow-hidden">
      {/* Shimmer Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%] animate-shimmer" />
      )}
      <motion.img
        src={src}
        alt={alt}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        onLoad={() => setIsLoaded(true)}
        loading={priority ? "eager" : "lazy"}
        className="absolute inset-0 w-full h-full object-cover object-top"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};


const programs = [
  {
    icon: <Compass size={40} />,
    id: "01",
    label: "Strategic Thinking",
    title: "Future-Ready Career Strategy",
    problem: "The workplace is evolving faster than ever. I want to stay relevant, advance with confidence, and build a career that grows with the future—not one that's left behind.",
    solution: "Career success today requires more than experience—it demands clarity, adaptability, and strategic direction. Through personalized Career Coaching, leadership assessments, and future-focused development, Pratibha Tiwari helps professionals identify their strengths, overcome career roadblocks, and create a clear roadmap for sustainable growth in an AI-driven workplace.",
    outcomes: [
      "Gain clarity on your career direction and long-term goals",
      "Identify strengths, opportunities, and development areas",
      "Build a future-ready career strategy with confidence",
      "Strengthen your executive presence and personal brand",
      "Improve interview, promotion, and leadership readiness",
      "Make career decisions with clarity and confidence"
    ],
    format: "1-on-1 Strategy Sessions | Career Sustainability Audit",
    cta: "Start Your Career Transformation",
    image: careerStrategy,
    cardBg: "https://images.unsplash.com/photo-1454165833767-027ffea9e778?q=80&w=2070",
    outcomeBg: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071"
  },
  {
    icon: <Heart size={40} />,
    id: "02",
    label: "Emotional Intelligence",
    title: "Executive Coaching & Emotional Intelligence",
    problem: "Leading at the highest level can feel isolating. The greater the responsibility, the greater the pressure to make confident decisions, inspire people, and perform with consistency.",
    solution: "Through personalized Executive Coaching and Emotional Intelligence Coaching, Pratibha Tiwari helps leaders strengthen self-awareness, enhance executive presence, build resilient mindsets, and communicate with greater influence. Using evidence-based coaching methodologies and practical leadership frameworks, she empowers professionals to lead with clarity, confidence, and authenticity.",
    outcomes: [
      "Lead with greater confidence and emotional resilience",
      "Make clear, confident decisions under pressure",
      "Strengthen executive presence and influential communication",
      "Build high-performing, trust-driven teams",
      "Navigate complex leadership challenges with clarity",
      "Inspire meaningful growth—for yourself and your organization"
    ],
    format: "Personalized Coaching Packages | Virtual & In-Person Sessions",
    cta: "Book Your Executive Coaching Session",
    image: executiveCoaching,
    cardBg: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974",
    outcomeBg: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070"
  },
  {
    icon: <Mic2 size={40} />,
    id: "03",
    label: "Mastery Communication",
    title: "Corporate Training & Executive Keynotes",
    problem: "Our people have the potential—but they need the right leadership, communication, and future-ready skills to perform at their best in a rapidly evolving workplace.",
    solution: "Every organization is unique, and so is every learning journey. Pratibha Tiwari designs and delivers customized Corporate Training Programs, Executive Workshops, and Leadership Keynote Sessions that inspire lasting behavioral change. Blending executive coaching, emotional intelligence, AI leadership, and practical business strategies, she equips teams with the mindset and skills to thrive in today's dynamic business environment.",
    outcomes: [
      "Strengthen leadership and executive communication across teams",
      "Build emotionally intelligent and high-performing leaders",
      "Develop AI-ready teams with future-focused capabilities",
      "Foster collaboration, resilience, and workplace engagement",
      "Create a culture of continuous learning and innovation",
      "Drive sustainable performance and organizational growth"
    ],
    format: "Workshops | Retreats | Leadership Keynotes | UAE & Virtual",
    cta: "Enquire About Corporate Training",
    image: corporateTraining,
    cardBg: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070",
    outcomeBg: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070"
  },
  {
    icon: <Cpu size={40} />,
    id: "04",
    label: "Purposeful Leadership",
    title: "Purposeful Leadership & Performance Culture",
    problem: "We have the talent, but we lack a unified sense of purpose. How do we align our values with our goals to drive long-term impact?",
    solution: "Transforming leadership from a title into a purposeful practice. Pratibha Tiwari works with boards and senior executives to define leadership values, build organizational resilience, and foster a culture where high performance is fueled by meaning and accountability.",
    outcomes: [
      "Define and align core leadership values across the organization",
      "Foster a culture of accountability and high performance",
      "Build organizational resilience to navigate market volatility",
      "Strengthen strategic alignment between purpose and profits",
      "Develop mission-driven leaders who inspire legacy",
      "Enhance employee retention through purposeful leadership"
    ],
    format: "Executive Advisory | Strategic Workshops | Culture Audits",
    cta: "Connect for Strategic Advisory",
    image: leadershipVision,
    cardBg: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1974",
    outcomeBg: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015"
  }
];

export default function Services() {
  const { hash } = useLocation();

  // Scroll to top synchronously before paint on mount/refresh
  // This fixes the lazy-loaded page appearing scrolled to the footer
  useLayoutEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-pearl/20 pb-20">
      <SEO
        title="Services & Programs"
        description="Explore Pratibha Tiwari's four pillars of impact: AI Leadership, Executive Coaching, Career Shaping, and Corporate Training."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24 md:mb-32 pt-28 sm:pt-32 md:pt-48 relative text-center md:text-left">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[120px] rounded-full -z-10" />
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/5 blur-[100px] rounded-full -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 sm:space-y-8"
        >
          <div className="flex items-center justify-center md:justify-start space-x-4">
            <div className="w-8 sm:w-12 h-px bg-gold/40" />
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.6em] text-gold font-bold">Expertise & Strategic Impact</span>
            <div className="w-8 sm:w-12 h-px bg-gold/40 md:hidden" />
          </div>
          <h1 className="text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-serif text-primary leading-[1.0] sm:leading-[0.9] max-w-5xl mx-auto md:mx-0 italic font-light tracking-tighter">
            Four Pillars of <span className="text-gold font-normal not-italic drop-shadow-sm">Excellence</span>
          </h1>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-12 pt-2 sm:pt-8 items-center">
            <p className="text-sm sm:text-xl md:text-2xl text-mist leading-relaxed font-normal max-w-xl mx-auto md:mx-0">
              Exceptional leadership is a composition of distinct dimensions. My programs are designed to bridge the gap between current potential and future-ready mastery.
            </p>
            <div className="flex items-center justify-center md:justify-end pt-2 sm:pt-0">
              <div className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-gold/20 bg-white/50 backdrop-blur-md shadow-sm">
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-secondary font-bold">Scroll to Explore Pillars</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="space-y-16 sm:space-y-32 md:space-y-48 mb-24 sm:mb-40">
        {programs.map((p, i) => (
          <section
            key={p.id}
            id={p.id === '01' ? 'career-shaping' : p.id === '02' ? 'executive-coaching' : p.id === '03' ? 'corporate-training' : 'purposeful-leadership'}
            className="max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-28"
          >
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
              {/* Left Side: Content & Problem/Solution Card */}
              <div className={`space-y-6 sm:space-y-8 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="space-y-4 sm:space-y-6 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start space-x-4 sm:space-x-6">
                    <div className="p-3 sm:p-4 bg-white rounded-2xl text-secondary shadow-lg shadow-gold/5 ring-1 ring-gold/10">
                      {p.icon}
                    </div>
                    <div className="h-px bg-gold/20 flex-grow hidden md:block" />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.6em] text-gold font-bold">{p.label}</span>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif text-primary leading-tight italic font-light">{p.title}</h2>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-6 p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-[2.5rem] border border-slate-700/50 shadow-2xl relative overflow-hidden group"
                >
                  {/* High-Clarity Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${p.cardBg})` }}
                  />
                  {/* Premium Dark Gradient Overlay (No Blur) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/30" />

                  <div className="relative z-10 space-y-6 sm:space-y-8">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 blur-3xl rounded-full pointer-events-none" />

                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-px bg-gold" />
                        <div className="text-[9px] font-mono uppercase tracking-[0.4em] text-gold font-black drop-shadow-sm">The Strategic Friction</div>
                      </div>
                      <p className="text-base sm:text-xl md:text-2xl text-white italic leading-relaxed font-serif font-normal drop-shadow-md">"{p.problem}"</p>
                    </div>

                    <div className="h-px w-full bg-slate-700/50" />

                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-px bg-gold" />
                        <div className="text-[9px] font-mono uppercase tracking-[0.4em] text-gold font-black drop-shadow-sm">The Implementation Path</div>
                      </div>
                      <p className="text-slate-200 text-sm sm:text-base md:text-lg leading-relaxed font-normal drop-shadow-md">{p.solution}</p>
                    </div>
                  </div>
                </motion.div>

                <div className="pt-2 sm:pt-4 space-y-3 sm:space-y-4 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start space-x-4">
                    <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.3em] sm:tracking-[0.4em] text-secondary font-black bg-white/80 px-4 py-2 rounded-full border border-gold/10 shadow-sm">Format & Access</div>
                    <div className="h-px bg-gold/20 flex-grow hidden md:block" />
                  </div>
                  <div className="text-primary font-medium text-sm sm:text-lg italic font-serif leading-relaxed px-2">{p.format}</div>
                </div>
              </div>

              {/* Right Side: Image & Floating Outcomes Card */}
              <div className={`relative ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                {/* Image Section */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="relative rounded-2xl sm:rounded-3xl lg:rounded-[4rem] overflow-hidden shadow-2xl group border border-gold/5 lg:aspect-[4/5]"
                >
                  {/* Image wrapper — needs explicit height and position:relative so ServiceImage (absolute inset-0) fills it */}
                  <div className="relative h-64 sm:h-80 md:h-96 lg:h-full w-full">
                    <ServiceImage
                      src={p.image}
                      alt={p.title}
                      priority={i === 0}
                    />
                    <div className="absolute inset-0 bg-slate-900/20 lg:bg-slate-900/10 group-hover:bg-transparent transition-colors duration-700 pointer-events-none" />
                  </div>

                  {/* Outcomes Card - floating overlay on desktop only */}
                  <div className="hidden lg:flex absolute inset-0 p-6 lg:p-10 flex-col justify-end z-10">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      className="rounded-2xl lg:rounded-[2.5rem] p-6 lg:p-10 shadow-2xl border border-slate-700/50 relative overflow-hidden group/card"
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/card:scale-105"
                        style={{ backgroundImage: `url(${p.outcomeBg})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-slate-900/40" />
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 blur-3xl rounded-full pointer-events-none" />

                      <div className="space-y-8 relative z-10">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-px bg-gold" />
                            <h3 className="text-xl lg:text-2xl font-serif italic text-white font-light drop-shadow-md">Expected Outcomes</h3>
                          </div>
                        </div>

                        <ul className="grid gap-4">
                          {p.outcomes.map((item, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.2 + (idx * 0.05) }}
                              className="flex items-start group/item"
                            >
                              <div className="mt-1 p-1 bg-gold/20 rounded-full mr-3 shrink-0 transition-transform group-hover/item:scale-110 border border-gold/30">
                                <Check size={10} className="text-gold" />
                              </div>
                              <span className="text-slate-200 leading-relaxed font-sans text-sm font-medium drop-shadow-md">{item}</span>
                            </motion.li>
                          ))}
                        </ul>

                        <div className="pt-6">
                          <Link
                            to="/contact"
                            className="w-full bg-gold text-slate-900 py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-slate-900 transition-all duration-500 flex items-center justify-center group/btn shadow-xl cursor-pointer"
                          >
                            {p.cta || "Inquire About This Pillar"}
                            <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Outcomes Card - standalone card on mobile/tablet */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="lg:hidden mt-4 sm:mt-6 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl border border-slate-700/50 relative overflow-hidden group/card"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/card:scale-105"
                    style={{ backgroundImage: `url(${p.outcomeBg})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-slate-900/40" />
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 blur-3xl rounded-full pointer-events-none" />

                  <div className="space-y-6 relative z-10">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-px bg-gold" />
                        <h3 className="text-lg sm:text-xl font-serif italic text-white font-light drop-shadow-md">Expected Outcomes</h3>
                      </div>
                    </div>

                    <ul className="grid gap-3">
                      {p.outcomes.map((item, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + (idx * 0.05) }}
                          className="flex items-start group/item"
                        >
                          <div className="mt-1 p-1 bg-gold/20 rounded-full mr-3 shrink-0 transition-transform group-hover/item:scale-110 border border-gold/30">
                            <Check size={10} className="text-gold" />
                          </div>
                          <span className="text-slate-200 leading-relaxed font-sans text-xs sm:text-sm font-medium drop-shadow-md">{item}</span>
                        </motion.li>
                      ))}
                    </ul>

                    <div className="pt-2">
                      <Link
                        to="/contact"
                        className="w-full bg-gold text-slate-900 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-slate-900 transition-all duration-500 flex items-center justify-center group/btn shadow-xl cursor-pointer"
                      >
                        {p.cta || "Inquire About This Pillar"}
                        <ArrowRight className="ml-3 w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
                      </Link>
                    </div>
                  </div>
                </motion.div>

                {/* Decorative background elements */}
                <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-gold/10 blur-[120px] rounded-full -z-10" />
                <div className="absolute -top-16 -left-16 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -z-10" />
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Enterprise CTA */}
      <section className="bg-white py-16 sm:py-24 md:py-32 border-y border-gold/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-12">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif text-primary">Purchasing for an Enterprise?</h2>
          <p className="text-base sm:text-xl text-mist leading-relaxed font-normal max-w-2xl mx-auto">
            We offer custom corporate licensing, bulk program access, and volume bookings for training cohorts across the UAE and globally.
          </p>
          <Link to="/contact" className="inline-block bg-primary text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full font-bold uppercase tracking-widest text-[10px] sm:text-xs hover:bg-gold hover:text-primary transition-all shadow-2xl">
            Contact Enterprise Team
          </Link>
        </div>
      </section>

      <FAQSection />
    </div>
  );
}