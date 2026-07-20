/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { calculateReadTime } from '../lib/blog-utils';
import { staticBlogPosts } from '../data/blogPosts';
import { Calendar, ArrowLeft, Loader2, Share2, Linkedin, Twitter, MessageCircle, Clock, ArrowUpRight } from 'lucide-react';
import pratibhaPortrait from '../assets/images/coach-pratibha-hero-new.png';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = post ? encodeURIComponent(`Check out this insight from Pratibha Tiwari: ${post.title}`) : '';

  const socialSharing = [
    { 
      name: 'LinkedIn', 
      icon: <Linkedin size={18} />, 
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      color: 'hover:bg-[#0077b5]'
    },
    { 
      name: 'Twitter', 
      icon: <Twitter size={18} />, 
      url: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
      color: 'hover:bg-black'
    },
    { 
      name: 'WhatsApp', 
      icon: <MessageCircle size={18} />, 
      url: `https://wa.me/?text=${shareText}%20${shareUrl}`,
      color: 'hover:bg-[#25D366]'
    }
  ];

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const fetchPostAndRelated = async () => {
      try {
        // 1. Check static posts first for instant render
        const staticPost = staticBlogPosts.find(p => p.slug === slug);
        if (staticPost) {
          setPost(staticPost);
          const related = staticBlogPosts
            .filter(p => p.slug !== slug && p.category === staticPost.category)
            .slice(0, 3);
          setRelatedPosts(related);
          setLoading(false);
          clearTimeout(timeoutId);
          return;
        }

        // 2. Fetch from backend
        const response = await fetch(`/api/posts/slug/${slug}`, { signal: controller.signal });
        if (response.ok) {
          const data = await response.json();
          const currentPost = data.data;
          setPost(currentPost);

          // Fetch related posts from same category via general posts endpoint for now
          const relatedResponse = await fetch('/api/posts', { signal: controller.signal });
          if (relatedResponse.ok) {
            const allPostsData = await relatedResponse.json();
            const related = allPostsData.data
              .filter((p: any) => p._id !== currentPost._id && p.category === currentPost.category)
              .slice(0, 3);
            setRelatedPosts(related);
          }
        } else {
          // If backend returns non-ok status, search static posts again as fallback
          const fallback = staticBlogPosts.find(p => p.slug?.toLowerCase() === slug?.toLowerCase());
          if (fallback) {
            setPost(fallback);
          }
        }
      } catch (_error) {
        // Silently fall through to static fallback if available
        const fallback = staticBlogPosts.find(p => p.slug?.toLowerCase() === slug?.toLowerCase());
        if (fallback) {
          setPost(fallback);
        }
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };
    fetchPostAndRelated();
    window.scrollTo(0, 0);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-transparent pt-40">
        <Loader2 className="animate-spin text-secondary" size={40} />
        <p className="text-mist font-serif italic">Opening the Archives...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-8 bg-transparent pt-40 px-6 text-center">
        <h1 className="text-4xl font-serif text-primary">Insight Not Found</h1>
        <p className="text-mist max-w-md">The wisdom you seek may have been archived or moved. Let's find another path.</p>
        <Link to="/insights" className="bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-secondary transition-all">
          Back to Insights
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-transparent pt-40 pb-32"
    >
      <Helmet>
        <title>{post.title} | Insights | Pratibha Tiwari</title>
        <meta name="description" content={post.excerpt || post.body.replace(/<[^>]*>/g, '').slice(0, 160)} />
        
        {/* OpenGraph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.body.replace(/<[^>]*>/g, '').slice(0, 160)} />
        <meta property="og:image" content={post.featuredImage || post.imageUrl} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:site_name" content="Pratibha Tiwari - Executive Coaching" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt || post.body.replace(/<[^>]*>/g, '').slice(0, 160)} />
        <meta name="twitter:image" content={post.featuredImage || post.imageUrl} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-6">
        <Link to="/insights" className="inline-flex items-center space-x-2 text-mist hover:text-secondary transition-colors mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-mono uppercase tracking-widest">Back to Library</span>
        </Link>

        <article className="space-y-8 md:space-y-12">
          <div className="space-y-6">
            <span className="bg-secondary/10 text-secondary text-[10px] font-mono px-4 py-1.5 rounded-full uppercase tracking-widest w-fit block font-bold">
              {post.category}
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-primary leading-tight tracking-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs font-mono text-mist uppercase tracking-widest">
              <span className="flex items-center">
                <Calendar size={14} className="mr-2 text-gold" />
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent'}
              </span>
              <span className="hidden sm:inline h-4 w-px bg-gold/20" />
              <span className="flex items-center">
                <Clock size={14} className="mr-2 text-gold" />
                {calculateReadTime(post.body)}
              </span>
              <span className="hidden sm:inline h-4 w-px bg-gold/20" />
              <span>By Pratibha Tiwari</span>
            </div>
          </div>

          {(post.featuredImage || post.imageUrl) && (
            <div className="aspect-video rounded-3xl md:rounded-[48px] overflow-hidden border border-gold/10 shadow-2xl">
              <img src={post.featuredImage || post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="pt-4 md:pt-8">
            {/* Article Content */}
            <div className="prose prose-lg prose-primary max-w-none prose-headings:font-serif prose-headings:font-normal prose-headings:italic prose-a:text-secondary">
               <div 
                 className="text-primary leading-relaxed font-sans mt-4 article-body"
                 dangerouslySetInnerHTML={{ __html: post.body }} 
               />
               
               {/* Tags & Footer */}
               <div className="mt-16 md:mt-20 pt-8 md:pt-12 border-t border-gold/10">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 mb-8 md:mb-12">
                   <div className="flex flex-wrap gap-2.5 sm:gap-3">
                     {post.tags?.map((tag: string) => (
                       <span key={tag} className="text-[10px] font-mono text-mist uppercase tracking-widest bg-white border border-gold/10 px-3 py-1 rounded-full">
                         #{tag}
                       </span>
                     ))}
                   </div>
                   
                   <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-mist">Share Reflection:</span>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        {socialSharing.map((social) => (
                          <a 
                            key={social.name}
                            href={social.url}
                            target="_blank"
                            rel="noreferrer"
                            className={`p-2.5 sm:p-3 bg-white rounded-xl border border-gold/10 hover:border-secondary transition-all text-mist hover:text-white shadow-sm flex items-center space-x-2 ${social.color}`}
                            title={`Share on ${social.name}`}
                          >
                            {social.icon}
                            <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">{social.name}</span>
                          </a>
                        ))}
                      </div>
                   </div>
                 </div>

                 <div className="bg-primary p-6 sm:p-10 md:p-12 rounded-3xl md:rounded-[40px] text-white flex flex-col md:flex-row items-center gap-6 md:gap-12">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 shrink-0 p-1">
                      <img src={pratibhaPortrait} alt="Pratibha" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <div className="space-y-3 sm:space-y-4 text-center md:text-left">
                       <h4 className="text-xl font-serif italic">About Pratibha Tiwari</h4>
                       <p className="text-sm text-white/90 leading-relaxed">
                         Pratibha is an executive coach and human potential architect helping leaders build career sustainability through emotional intelligence.
                       </p>
                       <Link to="/contact" className="text-secondary font-bold text-sm uppercase tracking-widest hover:underline flex items-center justify-center md:justify-start">
                         Inquire for Coaching <Share2 size={14} className="ml-2" />
                       </Link>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-32 pt-20 border-t border-gold/10">
            <div className="flex items-center justify-between mb-12">
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-secondary uppercase tracking-[0.3em] font-bold">Recommendations</span>
                <h3 className="text-4xl font-serif text-primary italic">Related Insights</h3>
              </div>
              <Link to="/insights" className="hidden sm:flex items-center space-x-2 text-mist hover:text-secondary transition-colors group">
                <span className="text-[10px] font-mono uppercase tracking-widest">Library</span>
                <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost._id || relatedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link to={`/insights/${relatedPost.slug}`} className="block space-y-6">
                    <div className="aspect-[4/5] rounded-[32px] overflow-hidden border border-gold/5 transition-all duration-700 shadow-sm group-hover:shadow-xl relative">
                      <img 
                        src={relatedPost.featuredImage || relatedPost.imageUrl} 
                        alt={relatedPost.title} 
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-primary/80 to-transparent">
                        <span className="text-[9px] font-mono text-white uppercase tracking-widest">
                          {relatedPost.category}
                        </span>
                      </div>
                    </div>
                    <h4 className="text-xl font-serif text-primary group-hover:text-secondary transition-colors leading-tight">
                      {relatedPost.title}
                    </h4>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .article-body p { margin-bottom: 2rem; font-size: 1.125rem; line-height: 1.8; }
        .article-body h2 { font-size: 2rem; margin-top: 3rem; margin-bottom: 1.5rem; color: #1a3a5c; }
        .article-body h3 { font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; color: #1a3a5c; }
        .article-body ul { list-style: disc; margin-left: 1.5rem; margin-bottom: 2rem; }
        .article-body li { margin-bottom: 0.75rem; }
        .article-body blockquote { border-left: 4px solid #c5a059; padding-left: 2rem; font-style: italic; font-size: 1.5rem; margin: 3rem 0; color: #1a3a5c/80; }
      `}</style>
    </motion.div>
  );
}
