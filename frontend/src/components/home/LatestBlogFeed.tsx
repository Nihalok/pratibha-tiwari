/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculateReadTime } from '../../lib/blog-utils';
import { staticBlogPosts } from '../../data/blogPosts';

const BlogCard: React.FC<{ post: any; index: number }> = ({ post, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  
  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      className="relative group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/insights/${post.slug}`} className="block h-full">
        <div className="bg-white/40 backdrop-blur-md rounded-[40px] overflow-hidden flex flex-col h-full border border-gold/10 hover:border-secondary/30 hover:shadow-2xl hover:shadow-gold/5 transition-all duration-700 group">
          {/* Image Container with Modern Aspect Ratio */}
          <div className="aspect-[16/10] overflow-hidden relative bg-pearl">
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-700 z-10" />
            
            {post.imageUrl ? (
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop`; // Colorful fallback
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gold/10 via-secondary/5 to-primary/5 flex items-center justify-center">
                <span className="font-serif italic text-primary text-4xl">Insight</span>
              </div>
            )}


            
            {/* Category Badge */}
            <div className="absolute top-6 left-6 z-20">
              <span className="bg-white/90 backdrop-blur-md text-primary text-[9px] font-mono px-4 py-1.5 rounded-full uppercase tracking-widest border border-gold/10 font-bold shadow-sm">
                {post.category}
              </span>
            </div>
          </div>

          <div className="p-10 flex flex-col flex-grow relative">
            {/* Read More Floating Action */}
            <div className="absolute -top-8 right-10 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white shadow-xl opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 z-30">
                <ArrowRight size={24} />
            </div>

            <div className="flex items-center space-x-4 text-[9px] font-mono uppercase tracking-[0.2em] text-mist mb-6 ">
              <span className="flex items-center"><Calendar size={12} className="mr-2 text-gold" /> {post.date}</span>
              <div className="w-1 h-1 rounded-full bg-gold/30" />
              <span className="flex items-center"><Clock size={12} className="mr-2 text-gold" /> {post.readTime}</span>
            </div>
            
            <h3 className="text-2xl font-serif text-primary leading-tight group-hover:text-secondary transition-colors line-clamp-2 h-[2.5em] overflow-hidden mb-4 italic font-medium">
              "{post.title}"
            </h3>
            
            <p className="text-mist text-sm leading-relaxed line-clamp-3 h-[4.875em] overflow-hidden font-normal group-hover:opacity-100 transition-opacity mb-8">
              {post.excerpt}
            </p>

            <div className="mt-auto flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-secondary group-hover:gap-3 transition-all">
              <span>Read More</span>
              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function LatestBlogFeed() {
  const [posts, setPosts] = useState<any[]>(staticBlogPosts);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const fetchLatestPosts = async () => {
      try {
        const response = await fetch('/api/posts/home', { signal: controller.signal });
        clearTimeout(timeoutId);
        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.length > 0) {
            const newPosts = data.data.map((data: any) => ({
              id: data._id,
              slug: data.slug,
              title: data.title,
              excerpt: data.excerpt,
              imageUrl: data.featuredImage || staticBlogPosts[0]?.imageUrl,
              category: data.category,
              date: data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
              readTime: calculateReadTime(data.body)
            }));
            setPosts(newPosts);
          } else {
            setPosts(staticBlogPosts);
          }
        }
      } catch (_error) {
        // Silently fall back — static posts remain
      }
    };

    fetchLatestPosts();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  return (
    <section className="py-24 md:py-32 bg-transparent relative overflow-hidden">
      {/* Background Aesthetic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[400px] bg-gold/5 blur-[160px] pointer-events-none rounded-full" />
      
      <div className="absolute top-40 right-0 text-[18vw] font-serif italic text-primary select-none pointer-events-none -translate-y-1/2 translate-x-1/4">
        
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="h-px w-8 bg-gold/40" />
              <span className="font-mono text-[10px] uppercase tracking-[0.6em] text-gold font-black">Strategic Insights</span>
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-serif text-primary leading-[0.9] tracking-tighter italic">
              Knowledge <br /><span className="not-italic text-secondary">In Motion.</span>
            </h2>
          </div>
          <Link to="/insights" className="group flex items-center space-x-6 pb-4 border-b border-gold/20 hover:border-secondary transition-all">
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">The Archive</span>
            <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold group-hover:bg-secondary group-hover:text-white group-hover:border-secondary transition-all">
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {posts.slice(0, 4).map((post, i) => (
            <BlogCard key={post.id || i} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
