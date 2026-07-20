/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, ArrowUpRight, Play, Clock, Calendar, Loader2, Mic2, Volume2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculateReadTime } from '../lib/blog-utils';
import { staticBlogPosts } from '../data/blogPosts';
import SEO from '../components/layout/SEO';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import BookShowcase from '../components/insights/BookShowcase';

export default function Insights() {
  const swiperRef = useRef<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (response.ok) {
          const data = await response.json();
          const dbPosts = (data.data || []) as any[];
          
          // Combine with static posts, avoid duplicates by slug
          const combined = [...dbPosts];
          staticBlogPosts.forEach(staticPost => {
            if (!combined.find(p => p.slug === staticPost.slug)) {
              combined.push(staticPost);
            }
          });
          setPosts(combined);
        } else {
          setPosts(staticBlogPosts);
        }
      } catch (_err) {
        // Silently fall back to static posts when backend is unavailable
        setPosts(staticBlogPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const categories = ['All', ...Array.from(new Set((posts || []).map(p => p.category).filter(Boolean)))];

  const filteredPosts = (posts || []).filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-transparent pt-24 md:pt-40"
    >
      <SEO 
        title="Knowledge Insights" 
        description="Deep dives into leadership, emotional intelligence, and executive performance by Pratibha Tiwari."
      />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-4xl mb-16 md:mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.6em] text-gold mb-6 block">The Knowledge Archives</span>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif text-primary leading-[0.9] tracking-tight italic">Perspectives <br /><span className="not-italic">That Redefine Leadership</span></h1>
          </motion.div>
        </div>

        <BookShowcase />

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24 md:mb-48"
        >
          <div className="relative">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-20 gap-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-[1px] bg-gold/30" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold font-bold">Strategic Toolkit</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-serif text-primary leading-tight italic">Resource <span className="not-italic">Hub</span></h2>
                <p className="text-primary font-normal text-lg md:text-xl leading-relaxed max-w-2xl">
                  Curated digital frameworks and diagnostic workbooks designed for structural professional audits and high-precision emotional intelligence.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {[
                { 
                  title: "Career Sustainability", 
                  desc: "Audit your long-term professional trajectory.", 
                  tag: "Strategic Audit",
                  image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070",
                  icon: <Filter size={20} />
                },
                { 
                  title: "EI Communication", 
                  desc: "Master the voice of high-impact leadership.", 
                  tag: "Mastery Guide",
                  image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2070",
                  icon: <Volume2 size={20} />
                },
                { 
                  title: "Executive Presence", 
                  desc: "Building authority through intentionality.", 
                  tag: "Identity Blueprint",
                  image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071",
                  icon: <ArrowUpRight size={20} />
                },
              ].map((item, i) => (
                <motion.a 
                  key={i} 
                  href={`mailto:admin@pratibhatiwari.com?subject=Request: ${item.title} Workbook`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative h-[420px] rounded-[40px] overflow-hidden border border-gold/10 flex flex-col shadow-sm hover:shadow-2xl transition-all duration-700 bg-white"
                >
                  <div className="absolute inset-0 z-0">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-white/40 group-hover:via-white/90 transition-colors duration-500" />
                  </div>
                  
                  <div className="relative z-10 p-10 flex flex-col h-full justify-between">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-gold group-hover:text-primary transition-all duration-500 border border-gold/10">
                          {item.icon}
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold font-bold bg-gold/5 px-3 py-1.5 rounded-full">{item.tag}</span>
                      </div>
                      
                      <div className="space-y-3 pt-6">
                        <h4 className="text-2xl md:text-3xl font-serif text-primary italic leading-tight group-hover:text-secondary transition-colors">
                          {item.title} <span className="not-italic">Workbook</span>
                        </h4>
                        <p className="text-primary text-sm md:text-base leading-relaxed font-normal">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-8 border-t border-gold/10">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary group-hover:text-secondary transition-colors">Request Access</span>
                      <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center group-hover:translate-x-2 transition-transform">
                        <ArrowUpRight size={14} className="text-gold" />
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Podcast Hub */}
        <div className="mb-24 md:mb-48 relative">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-8 relative z-10">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-[1px] bg-gold/30" />
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-secondary font-bold">Audio Intelligence</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif text-primary">The Podcast <span className="italic">Hub</span></h2>
              <p className="text-charcoal font-normal leading-relaxed max-w-xl">
                Weekly deep-dives into the architecture of presence, executive psychology, and the science of elite performance.
              </p>
            </div>
            <a 
              href="https://podcasters.spotify.com/pod/show/pratibha-tiwari8" 
              target="_blank" 
              rel="noreferrer" 
              className="group relative inline-flex items-center space-x-4 bg-primary text-white px-10 py-5 rounded-full font-bold overflow-hidden transition-all hover:bg-secondary shadow-2xl shadow-primary/20"
            >
              <span className="relative z-10">Stream on Spotify</span>
              <div className="relative z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <Volume2 size={16} />
              </div>
            </a>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 md:gap-12 relative z-10">
            {[
              { 
                id: 1, 
                title: "Importance of Perception", 
                duration: "12m", 
                tag: "Mindset",
                color: "bg-white",
                yOffset: "translate-y-0",
                embedUrl: "https://podcasters.spotify.com/pod/show/pratibha-tiwari8/embed/episodes/Importance-of-Perception---Lets-Go-To-Burj-Khalifa-e19cmhg" 
              },
              { 
                id: 2, 
                title: "What is Emotional Intelligence?", 
                duration: "15m", 
                tag: "Psychology",
                color: "bg-[#FBF7F0]",
                yOffset: "lg:translate-y-12",
                embedUrl: "https://podcasters.spotify.com/pod/show/pratibha-tiwari8/embed/episodes/What-is-Emotional-Intelligence-e1b25kq" 
              },
              { 
                id: 3, 
                title: "Importance of Motivation for Success", 
                duration: "14m", 
                tag: "Strategy",
                color: "bg-white",
                yOffset: "translate-y-0",
                embedUrl: "https://podcasters.spotify.com/pod/show/pratibha-tiwari8/embed/episodes/Importance-of-Motivation-for-Success-e1c692j" 
              },
            ].map((ep, i) => (
              <motion.div 
                key={ep.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className={`relative group transition-all duration-700 ${ep.yOffset}`}
              >
                <div className={`h-full ${ep.color} border border-gold/10 rounded-[40px] md:rounded-[60px] p-8 md:p-12 shadow-xl group-hover:shadow-2xl group-hover:-translate-y-4 transition-all duration-500 relative overflow-hidden z-10`}>
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                    <Mic2 size={120} className="text-primary rotate-12" />
                  </div>

                  <div className="relative z-10 flex flex-col h-full space-y-10">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-secondary font-bold">{ep.tag}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-primary font-mono text-[10px]">
                          <Clock size={12} />
                          <span>{ep.duration} Session</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all duration-500">
                        <Play size={20} fill="currentColor" />
                      </div>
                    </div>

                    <h4 className="text-2xl md:text-3xl font-serif text-primary italic leading-tight group-hover:text-secondary transition-colors">
                      "{ep.title}"
                    </h4>

                    <div className="rounded-3xl overflow-hidden bg-white/50 backdrop-blur-sm border border-gold/5 shadow-inner p-4">
                      <iframe 
                        src={ep.embedUrl} 
                        height="102px" 
                        width="100%" 
                        frameBorder="0" 
                        scrolling="no"
                        className="w-full opacity-90 group-hover:opacity-100 transition-opacity"
                      />
                    </div>

                    <div className="pt-6 mt-auto">
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {[1,2,3].map(n => (
                            <div key={n} className="w-8 h-8 rounded-full border-2 border-white bg-pearl flex items-center justify-center">
                              <div className="w-full h-full rounded-full bg-primary/10" />
                            </div>
                          ))}
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-gold flex items-center justify-center text-[8px] font-bold text-charcoal">
                            +4k
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-primary group-hover:text-secondary transition-all">
                          <span>Full Session</span>
                          <ArrowUpRight size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="mb-24 md:mb-48 space-y-16 md:space-y-24">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12 border-b border-gold/20 pb-12 md:pb-16">
            <div className="space-y-4 text-center lg:text-left">
               <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">The Archive</span>
               <h2 className="text-4xl md:text-6xl font-serif text-primary">The Reading Room</h2>
            </div>
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-6">
              <div className="relative group w-full sm:w-auto">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-mist group-focus-within:text-secondary transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  className="pl-16 pr-8 py-5 bg-white border border-gold/10 rounded-full focus:outline-none focus:border-secondary w-full sm:min-w-[320px] shadow-sm focus:shadow-xl transition-all" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <select 
                  className="bg-white border border-gold/10 rounded-full px-8 py-5 focus:outline-none focus:border-secondary text-[10px] font-bold uppercase tracking-widest text-primary appearance-none cursor-pointer pr-12 shadow-sm"
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0\' height=\'24\' width=\'24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 1.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em' }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <div className="relative">
                <Loader2 className="animate-spin text-secondary" size={48} />
                <div className="absolute inset-0 blur-xl bg-secondary/20 rounded-full animate-pulse" />
              </div>
              <p className="text-mist font-serif italic text-xl">Curating wisdom for the visionary...</p>
            </div>
          ) : (
            <div className="relative group/swiper">
              <Swiper
                modules={[Navigation, Pagination]}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                spaceBetween={40}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 1.5, spaceBetween: 24 },
                  768: { slidesPerView: 2, spaceBetween: 32 },
                  1024: { slidesPerView: 3, spaceBetween: 40 }
                }}
                className="insights-swiper !pb-10"
              >
                {filteredPosts.map((post, i) => (
                  <SwiperSlide key={post._id || post.id} className="h-auto">
                    <motion.article 
                       initial={{ opacity: 0, y: 30 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ delay: i * 0.1, duration: 0.8 }}
                       className="group h-full"
                    >
                      <Link to={`/insights/${post.slug}`} className="block h-full">
                        <div className="editorial-card rounded-[40px] md:rounded-[60px] overflow-hidden flex flex-col h-full hover:-translate-y-3 transition-all duration-700 bg-white border border-gold/5 shadow-sm">
                          <div className="aspect-[4/3] overflow-hidden relative">
                             {(post.featuredImage || post.imageUrl) ? (
                               <img src={post.featuredImage || post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                             ) : (
                               <div className="w-full h-full bg-pearl flex items-center justify-center text-primary">
                                  <div className="text-7xl md:text-[120px] font-serif italic select-none">{(post.category || 'A')[0]}</div>
                               </div>
                             )}
                             <div className="absolute top-6 md:top-8 left-6 md:left-8">
                               <span className="bg-white/95 backdrop-blur-md text-primary text-[10px] font-bold px-5 py-2 rounded-full uppercase tracking-[0.2em] border border-gold/10 shadow-lg">{post.category}</span>
                             </div>
                          </div>
                          <div className="p-8 md:p-12 flex flex-col flex-grow">
                            <div className="flex items-center space-x-4 text-[10px] font-mono uppercase tracking-[0.2em] text-mist mb-6 md:mb-8">
                              <span className="flex items-center"><Calendar size={14} className="mr-2 text-gold" /> {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}</span>
                              <div className="w-1 h-1 rounded-full bg-gold/20" />
                              <span className="flex items-center"><Clock size={14} className="mr-2 text-gold" /> {calculateReadTime(post.body)}</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-serif text-primary group-hover:text-secondary transition-colors line-clamp-3 leading-snug mb-6 md:mb-8 italic">
                              "{post.title}"
                            </h3>
                            <p className="text-charcoal font-normal text-base md:text-[17px] leading-relaxed line-clamp-3 h-[4.875em] mb-8 md:mb-10 transition-opacity">{post.excerpt}</p>
                            <div className="pt-8 mt-auto flex items-center space-x-3 text-[10px] font-bold uppercase tracking-[0.4em] text-secondary group-hover:translate-x-3 transition-transform">
                              <span>Open Insight</span>
                              <ArrowUpRight size={16} />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Navigation Arrows */}
              {filteredPosts.length > 0 && (
                <div className="absolute top-1/2 -translate-y-1/2 -left-8 -right-8 hidden md:flex justify-between pointer-events-none z-30">
                  <button 
                    onClick={() => swiperRef.current?.slidePrev()} 
                    className="w-14 h-14 rounded-full bg-white shadow-xl border border-gold/10 flex items-center justify-center text-primary hover:text-secondary hover:scale-110 active:scale-95 transition-all pointer-events-auto cursor-pointer"
                    aria-label="Previous insight"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => swiperRef.current?.slideNext()} 
                    className="w-14 h-14 rounded-full bg-white shadow-xl border border-gold/10 flex items-center justify-center text-primary hover:text-secondary hover:scale-110 active:scale-95 transition-all pointer-events-auto cursor-pointer"
                    aria-label="Next insight"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          )}

          {!loading && (filteredPosts || []).length === 0 && (
            <div className="py-24 text-center">
               <p className="text-xl text-mist font-serif italic">No matching insights found. Try a different lens.</p>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
