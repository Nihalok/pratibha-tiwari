/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "What is the primary focus of your coaching sessions?",
    answer: "My coaching focuses on the convergence of Communication, Emotional Intelligence, and Leadership. We use tools like NLP (Neuro-Linguistic Programming) to identify behavioral patterns and rewire them for elite performance and authentic presence."
  },
  {
    question: "How long does a typical coaching engagement last?",
    answer: "Individual coaching packages usually range from 6 to 12 sessions, depending on your goals. Corporate training programs can be delivered as intensive half-day workshops or long-term multi-month training cohorts."
  },
  {
    question: "Are the sessions conducted online or in person?",
    answer: "I am based in Abu Dhabi, UAE, and offer in-person training for local corporate teams. However, the majority of my 1-on-1 executive coaching is delivered via high-quality digital platforms to clients worldwide."
  },
  {
    question: "What is the 'Career Sustainability Audit'?",
    answer: "This is a signature data-driven assessment where we use psychometric mapping to identify your cognitive strengths and audit your role's vulnerability to AI and automation, helping you build a future-proof career blueprint."
  },
  {
    question: "How does NLP help in professional communication?",
    answer: "NLP (Neuro-Linguistic Programming) helps you understand the 'language of the mind.' By mastering these techniques, you learn how to process information more effectively, build rapid rapport, and communicate with much higher influence and clarity."
  },
  {
    question: "Do you offer tailored programs for specific industries?",
    answer: "Yes. While the core human skills of communication and EQ are universal, I specialize in adapting program delivery for tech-heavy industries navigating AI transitions, as well as leadership programs for parents in high-pressure roles."
  }
];

interface FAQItemProps {
  key?: React.Key;
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

function FAQItem({ question, answer, isOpen, onClick }: FAQItemProps) {
  return (
    <div className="border-b border-gold/10 last:border-0 overflow-hidden">
      <button 
        onClick={onClick}
        className="w-full py-8 flex items-center justify-between text-left group"
      >
        <span className={`text-xl md:text-2xl font-serif transition-colors ${isOpen ? 'text-secondary' : 'text-primary group-hover:text-secondary'}`}>
          {question}
        </span>
        <div className={`p-2 rounded-full transition-all ${isOpen ? 'bg-secondary text-white rotate-180' : 'bg-pearl text-gold group-hover:bg-gold/10'}`}>
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <p className="pb-8 text-mist leading-relaxed text-lg max-w-3xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-pearl">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="font-mono text-xs uppercase tracking-[0.4em] text-gold block mb-4">Common Inquiries</span>
          <h2 className="text-5xl font-serif text-primary">Frequently Asked Questions</h2>
        </div>

        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-gold/10">
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index} 
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index} 
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
