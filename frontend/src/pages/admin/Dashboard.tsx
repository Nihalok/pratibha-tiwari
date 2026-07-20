/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { FileText, MessageSquare, Star, Clock, Activity as ActivityIcon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ADMIN_ROUTES } from '../../config/admin';
import { motion, AnimatePresence } from 'motion/react';
import { Activity } from '../../types';

export default function Dashboard() {
  const [counts, setCounts] = useState({ posts: 0, messages: 0, testimonials: 0 });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        const stats = data.data || {};
        setCounts({
          posts: stats.postCount || 0,
          messages: stats.unreadMessages || 0,
          testimonials: stats.testimonialCount || 0
        });
        setActivities(stats.recentActivities || []);
      }
    } catch (_err) {
      // Silently ignore
    } finally {
      setLoading(false);
    }
  };

  const handleClearActivities = async () => {
    if (!window.confirm('Are you sure you want to clear the entire activity pulse feed?')) return;
    try {
      const response = await fetch('/api/activities', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        setActivities([]);
      }
    } catch (_err) {
      // Silently ignore
    }
  };

  useEffect(() => {
    fetchData();
    // Poll for updates every 30 seconds since we lost real-time Firebase
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'post': return <FileText size={14} />;
      case 'testimonial': return <Star size={14} />;
      case 'message': return <MessageSquare size={14} />;
      default: return <ActivityIcon size={14} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'post': return 'bg-blue-500/10 text-blue-600';
      case 'testimonial': return 'bg-amber-500/10 text-amber-600';
      case 'message': return 'bg-rose-500/10 text-rose-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const stats = [
    { name: 'Total Posts', value: counts.posts, icon: <FileText />, color: 'bg-blue-500' },
    { name: 'Unread Messages', value: counts.messages, icon: <MessageSquare />, color: 'bg-rose-500' },
    { name: 'Testimonials', value: counts.testimonials, icon: <Star />, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6 sm:space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-serif text-primary">Overview</h1>
          <p className="text-xs sm:text-base text-gray-500 mt-1">Welcome back to your command center.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[32px] border border-gray-100 shadow-xs flex items-center space-x-4 sm:space-x-6">
            <div className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl text-white ${stat.color} shrink-0`}>{stat.icon}</div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-500">{stat.name}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
        <div className="lg:col-span-2 bg-white rounded-3xl sm:rounded-[32px] border border-gray-100 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 sm:p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <h3 className="font-bold text-primary text-sm sm:text-base">Activity Pulse</h3>
              {activities.length > 0 && (
                <button
                  onClick={handleClearActivities}
                  className="text-xs font-semibold text-red-500 hover:text-red-700 hover:underline transition-all cursor-pointer ml-2 sm:ml-3"
                >
                  Clear All
                </button>
              )}
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono text-mist uppercase tracking-widest">Recent Feed</span>
          </div>
          <div className="flex-grow">
            <div className="divide-y divide-gray-50 max-h-[400px] sm:max-h-[500px] overflow-y-auto" data-lenis-prevent>
              <AnimatePresence initial={false}>
                {(activities || []).map((act: any) => (
                  <motion.div 
                    key={act._id || act.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 sm:p-6 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className={`p-2 sm:p-2.5 rounded-xl ${getActivityColor(act.type)} shrink-0`}>
                        {getActivityIcon(act.type)}
                      </div>
                      <div className="flex-grow space-y-1 min-w-0">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                          <h4 className="text-xs sm:text-sm font-bold text-primary truncate max-w-full">{act.title}</h4>
                          <span className="text-[9px] sm:text-[10px] font-mono text-mist flex items-center shrink-0">
                            <Clock size={10} className="mr-1" />
                            {act.timestamp ? new Date(act.timestamp).toLocaleString() : 'Just now'}
                          </span>
                        </div>
                        <p className="text-xs text-mist leading-relaxed line-clamp-2">{act.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {(activities || []).length === 0 && !loading && (
                <div className="py-16 sm:py-20 text-center flex flex-col items-center justify-center space-y-3">
                  <ActivityIcon size={32} className="text-gray-200" />
                  <p className="text-mist font-serif italic text-xs sm:text-sm">Quiet in the command center...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-10">
          <div className="bg-primary rounded-3xl sm:rounded-[32px] p-6 sm:p-8 text-white space-y-6 sm:space-y-8 relative overflow-hidden shadow-xl shadow-primary/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <h3 className="text-lg sm:text-xl font-serif italic relative z-10">Strategic Shortcuts</h3>
            <div className="grid gap-3 sm:gap-4 relative z-10">
              <Link to={ADMIN_ROUTES.posts} className="bg-white/10 hover:bg-white/20 p-4 sm:p-5 rounded-2xl border border-white/10 transition-all flex items-center justify-between text-xs sm:text-sm group">
                <span>Draft New Insights Post</span>
                <FileText className="text-secondary group-hover:scale-110 transition-transform shrink-0" size={18} />
              </Link>
              <Link to={ADMIN_ROUTES.testimonials} className="bg-white/10 hover:bg-white/20 p-4 sm:p-5 rounded-2xl border border-white/10 transition-all flex items-center justify-between text-xs sm:text-sm group">
                <span>Manage Evidence Hub</span>
                <Star className="text-secondary group-hover:scale-110 transition-transform shrink-0" size={18} />
              </Link>
              <Link to={ADMIN_ROUTES.messages} className="bg-white/10 hover:bg-white/20 p-4 sm:p-5 rounded-2xl border border-white/10 transition-all flex items-center justify-between text-xs sm:text-sm group">
                <span>Review Inbox</span>
                <MessageSquare className="text-secondary group-hover:scale-110 transition-transform shrink-0" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
