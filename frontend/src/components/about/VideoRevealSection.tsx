import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import video1 from '../../assets/videos/about-reveal-1.mp4';
import video2 from '../../assets/videos/about-reveal-2.mp4';

const tabs = [
  {
    id: 1,
    video: video2,
    title: 'Strategy & Leadership',
    byline: 'GUIDING ORGANIZATIONS',
    desc: 'Helping teams find clarity and direction through proven leadership frameworks and strategic insights.'
  },
  {
    id: 2,
    video: video1,
    videoSpeed: 1,
    title: 'Global Presence',
    byline: 'BUILDING CONNECTIONS',
    desc: 'Sharing expertise across borders to foster growth and innovation in international business environments.'
  }
];

export default function VideoRevealSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const nextTab = () => setActiveIndex((prev) => (prev + 1) % tabs.length);
  const prevTab = () => setActiveIndex((prev) => (prev - 1 + tabs.length) % tabs.length);

  const togglePlay = () => {
    const currentVideo = videoRefs.current[activeIndex];
    if (currentVideo) {
      if (isPlaying) {
        currentVideo.pause();
        setIsPlaying(false);
      } else {
        currentVideo.play()
          .then(() => setIsPlaying(true))
          .catch(err => {
            // Play blocked
            setIsPlaying(false);
          });
      }
    }
  };

  // Play active video and explicitly pause inactive background videos to eliminate lag & avoid resource limits
  useEffect(() => {
    tabs.forEach((_, idx) => {
      const el = videoRefs.current[idx];
      if (el) {
        el.playbackRate = 1.0;
        if (idx === activeIndex) {
          if (isPlaying) {
            el.play().catch(err => {
              // Video play/autoplay blocked
              setIsPlaying(false);
            });
          } else {
            el.pause();
          }
        } else {
          el.pause();
        }
      }
    });
  }, [activeIndex, isPlaying]);

  return (
    <section className="w-full bg-slate-50/50 py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Title/Header Area */}
        <div className="text-center mb-16 space-y-4">
          <span className="font-mono text-[10px] tracking-[0.3em] text-gold uppercase font-bold">
            Moments in Focus
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary tracking-tight">
            Real Stories, Real Results
          </h2>
        </div>

        {/* Video Player Area with Side Arrows */}
        <div className="relative w-full mb-12 flex items-center gap-4 md:gap-8 lg:gap-12">
          
          {/* Left Arrow (Desktop) */}
          <button 
            onClick={prevTab}
            className="hidden md:flex shrink-0 w-14 h-14 rounded-full border border-primary/10 items-center justify-center text-primary hover:text-gold hover:border-gold hover:bg-gold/5 transition-all duration-300 z-30 bg-white shadow-sm"
            aria-label="Previous story"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Central Video Frame */}
          <div className="relative flex-grow aspect-video rounded-3xl md:rounded-[2.5rem] overflow-hidden bg-black shadow-[0_32px_64px_-16px_rgba(26,58,92,0.12)] border border-primary/5 group">
            <div className="absolute inset-0">
              {tabs.map((tab, index) => (
                <motion.div
                  key={tab.id}
                  initial={false}
                  animate={{ 
                    opacity: activeIndex === index ? 1 : 0,
                    scale: activeIndex === index ? 1 : 1.05,
                    pointerEvents: activeIndex === index ? 'auto' : 'none'
                  }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <video
                    ref={el => { videoRefs.current[index] = el; }}
                    src={tab.video}
                    loop
                    muted={isMuted}
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover object-center"
                  />
                </motion.div>
              ))}
            </div>

            {/* Custom Minimalist Controls Overlay */}
            <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center bg-primary/5 backdrop-blur-[2px]">
              <div className="flex items-center gap-8">
                <button 
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  {isPlaying ? (
                    <div className="w-5 h-5 flex gap-1.5">
                      <div className="w-1.5 h-full bg-white rounded-full" />
                      <div className="w-1.5 h-full bg-white rounded-full" />
                    </div>
                  ) : (
                    <ChevronRight size={32} className="ml-1 fill-white" />
                  )}
                </button>
              </div>

              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-primary/10 flex items-center justify-center text-primary hover:bg-gold hover:text-white transition-all duration-300 shadow-lg"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>
          </div>

          {/* Right Arrow (Desktop) */}
          <button 
            onClick={nextTab}
            className="hidden md:flex shrink-0 w-14 h-14 rounded-full border border-primary/10 items-center justify-center text-primary hover:text-gold hover:border-gold hover:bg-gold/5 transition-all duration-300 z-30 bg-white shadow-sm"
            aria-label="Next story"
          >
            <ChevronRight size={28} />
          </button>
        </div>

        {/* Tab Information & Switchers (Below Video) */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveIndex(index)}
              className={`group relative text-left p-8 rounded-[2rem] transition-all duration-500 border overflow-hidden ${
                activeIndex === index 
                ? 'bg-white border-gold/30 shadow-xl shadow-gold/5' 
                : 'bg-white/40 border-primary/5 hover:border-primary/10'
              }`}
            >
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-[10px] tracking-[0.2em] uppercase font-bold transition-colors duration-300 ${
                    activeIndex === index ? 'text-gold' : 'text-primary'
                  }`}>
                    {tab.byline}
                  </span>
                  {activeIndex === index && (
                    <motion.div 
                      layoutId="tabDot"
                      className="w-1.5 h-1.5 rounded-full bg-gold"
                    />
                  )}
                </div>
                
                <h3 className={`text-2xl md:text-3xl font-serif font-bold transition-colors duration-300 ${
                  activeIndex === index ? 'text-primary' : 'text-primary group-hover:text-primary'
                }`}>
                  {tab.title}
                </h3>
                
                <p className={`text-sm md:text-base leading-relaxed transition-colors duration-300 ${
                  activeIndex === index ? 'text-primary' : 'text-primary'
                }`}>
                  {tab.desc}
                </p>
              </div>

              {/* Active Background Glow */}
              {activeIndex === index && (
                <motion.div 
                  layoutId="activeGlow"
                  className="absolute inset-0 bg-gold/5 blur-3xl -z-10"
                />
              )}
            </button>
          ))}
        </div>

        {/* Mobile Navigation Controls */}
        <div className="flex md:hidden items-center gap-8 mt-12">
          <button 
            onClick={prevTab}
            className="w-14 h-14 rounded-full border border-primary/10 flex items-center justify-center text-primary active:scale-90 transition-transform"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex gap-2">
            {tabs.map((_, index) => (
              <div 
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === index ? 'w-8 bg-gold' : 'w-2 bg-primary/10'
                }`}
              />
            ))}
          </div>

          <button 
            onClick={nextTab}
            className="w-14 h-14 rounded-full border border-primary/10 flex items-center justify-center text-primary active:scale-90 transition-transform"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
