/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Award, Globe, Users, Target, ShieldCheck, Zap } from 'lucide-react';

const impactStats = [
  {
    icon: <Globe className="w-6 h-6 text-gold" />,
    title: "Global Reach",
    value: "UAE • INDIA • GLOBAL",
    desc: "Empowering leaders across borders with culturally intelligent strategies."
  },
  {
    icon: <Award className="w-6 h-6 text-gold" />,
    title: "Expertise",
    value: "23+ YEARS",
    desc: "A legacy of transforming communication into a strategic leadership tool."
  },
  {
    icon: <Users className="w-6 h-6 text-gold" />,
    title: "Impact",
    value: "50,000+ LIVES",
    desc: "Directly influenced professionals through keynotes and corporate training."
  },
  {
    icon: <Target className="w-6 h-6 text-gold" />,
    title: "Precision",
    value: "NLP • EI • AI",
    desc: "Utilizing advanced behavioral science for peak human performance."
  }
];

export default function TrustAnchors() {
  return (
    <section className="relative w-full">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impactStats.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              whileHover={{ y: -10 }}
              className="relative group p-8 bg-white/40 backdrop-blur-xl rounded-[40px] border border-gold/10 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-gold/5"
            >
              {/* Decorative Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 space-y-6">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gold/5 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                  {stat.icon}
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-secondary font-black">
                    {stat.title}
                  </div>
                  <div className="text-2xl font-serif text-primary tracking-tight font-bold">
                    {stat.value}
                  </div>
                </div>

                <p className="text-xs text-mist leading-relaxed font-sans opacity-80">
                  {stat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quality Certification Label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-8  grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-primary" />
            <span className="text-[9px] font-mono font-bold tracking-[0.3em] uppercase">ICF ACCREDITED</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-gold/30" />
          <div className="flex items-center gap-3">
            <Zap size={18} className="text-primary" />
            <span className="text-[9px] font-mono font-bold tracking-[0.3em] uppercase">NLP TRAINER</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-gold/30" />
          <div className="flex items-center gap-3">
            <Award size={18} className="text-primary" />
            <span className="text-[9px] font-mono font-bold tracking-[0.3em] uppercase">TEDx GLOBAL VOICE</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
