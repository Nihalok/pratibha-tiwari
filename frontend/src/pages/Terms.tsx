import React from 'react';
import SEO from '../components/layout/SEO';

export default function Terms() {
  return (
    <div className="bg-[#f8f9fa] min-h-screen pt-32 pb-24">
      <SEO 
        title="Terms of Service" 
        description="Terms of Service and legal usage terms for Pratibha Tiwari's coaching and leadership consultancy."
      />
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white border border-gold/10 rounded-[40px] p-8 md:p-16 shadow-[0_10px_50px_rgba(0,0,0,0.02)] space-y-12">
          
          <div className="space-y-4 border-b border-gold/10 pb-8 text-center md:text-left">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-secondary">Legal Agreement</span>
            <h1 id="terms-heading" className="text-4xl md:text-5xl font-serif text-primary tracking-tight italic">
              Terms of Service
            </h1>
            <p className="text-mist text-sm font-normal">Last Updated: July 12, 2026</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-mist leading-relaxed font-normal">
            <section className="space-y-4">
              <h2 className="text-xl font-serif text-primary font-bold italic">1. Acceptance of Terms</h2>
              <p>
                By accessing, browsing, or using this platform (including consultation bookings, assessments, and reading articles), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service and all applicable laws and regulations.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-serif text-primary font-bold italic">2. Intellectual Property Rights</h2>
              <p>
                All materials, writings, graphics, tools, assessments, books (including "The Motivational Diet," "Own Your Career Strategy Blueprint," and others), and logos displayed on this website are the intellectual property of Pratibha Tiwari. 
                You are granted a limited, personal, non-transferable license to view and download content for educational and professional self-development only. Any commercial reproduction, resale, or distribution of these materials is strictly prohibited without explicit written consent.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-serif text-primary font-bold italic">3. Coaching Disclaimer</h2>
              <p>
                Executive leadership coaching, personality development, and career advice services offered are strictly advisory. 
                They do not constitute medical, psychological, legal, or financial advice. Success depends on individual implementation, circumstances, and actions. We make no guaranteed claims of specific promotions, earnings, or operational outcomes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-serif text-primary font-bold italic">4. User Commitments</h2>
              <p>
                When submitting details through our Career Assessment, Contact forms, or Newsletter, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate, current, and honest information.</li>
                <li>Refrain from using the platform for any unlawful activities or network abuse.</li>
                <li>Maintain the confidentiality of any private links or communication resources shared during consultation.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-serif text-primary font-bold italic">5. Limitation of Liability</h2>
              <p>
                Under no circumstances shall Pratibha Tiwari or the brand's associates be held liable for any direct, indirect, incidental, consequential, or punitive damages resulting from your use of, or inability to use, this platform, its materials, or the advice provided during coaching programs.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-serif text-primary font-bold italic">6. Modification of Services</h2>
              <p>
                We reserve the right to modify, suspend, or discontinue any section of this website, the career assessment tool, or booking options at any time without notice. We may also revise these Terms of Service periodically, and your continued usage signifies acceptance of any updates.
              </p>
            </section>

            <section className="space-y-4 border-t border-gold/10 pt-8">
              <h2 className="text-xl font-serif text-primary font-bold italic">7. Governing Law</h2>
              <p>
                These Terms of Service shall be governed by, and construed in accordance with, the laws of the United Arab Emirates. Any disputes arising from these terms or your usage of the platform shall fall under the exclusive jurisdiction of the courts of Dubai.
              </p>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
