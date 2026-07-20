import React from 'react';
import SEO from '../components/layout/SEO';

export default function Privacy() {
  return (
    <div className="bg-[#f8f9fa] min-h-screen pt-32 pb-24">
      <SEO 
        title="Privacy Policy" 
        description="Privacy Policy and data protection terms for Pratibha Tiwari's coaching and leadership consultancy."
      />
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white border border-gold/10 rounded-[40px] p-8 md:p-16 shadow-[0_10px_50px_rgba(0,0,0,0.02)] space-y-12">
          
          <div className="space-y-4 border-b border-gold/10 pb-8 text-center md:text-left">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-secondary">Legal Framework</span>
            <h1 id="privacy-heading" className="text-4xl md:text-5xl font-serif text-primary tracking-tight italic">
              Privacy Policy
            </h1>
            <p className="text-mist text-sm font-normal">Last Updated: July 12, 2026</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-mist leading-relaxed font-normal">
            <section className="space-y-4">
              <h2 className="text-xl font-serif text-primary font-bold italic">1. Introduction</h2>
              <p>
                Welcome to the personal brand and consultancy platform of Pratibha Tiwari ("we," "our," or "us"). 
                Your privacy is of the utmost importance to us. This Privacy Policy details how we collect, protect, use, and process your personal data when you visit our website, apply for career assessments, request consultations, or interact with our coaching services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-serif text-primary font-bold italic">2. Information We Collect</h2>
              <p>
                We may collect several types of information from and about users of our website, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Personal Identification Information:</strong> Name, email address, phone number, and professional details (such as current career status and goals) when you fill out forms.
                </li>
                <li>
                  <strong>Assessment Data:</strong> Information submitted via the Career Assessment tool, including work style, challenges, and goals, which is handled with strict confidentiality.
                </li>
                <li>
                  <strong>Technical Data:</strong> IP addresses, browser types, operating systems, and page interaction details collected automatically through cookies and diagnostic scripts.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-serif text-primary font-bold italic">3. How We Use Your Information</h2>
              <p>
                The information we gather is used to deliver exceptional leadership coaching and guidance:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To customize and deliver consultation sessions and career assessment results.</li>
                <li>To communicate responding to your queries, feedback, or appointment schedules.</li>
                <li>To send periodic updates, curated resources, and insights (which you may opt out of at any time).</li>
                <li>To improve website performance, interface layout, and overall user experience.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-serif text-primary font-bold italic">4. Data Security</h2>
              <p>
                We implement industry-standard administrative, technical, and physical security measures designed to safeguard your personal data from unauthorized access, modification, disclosure, or destruction. However, no transmission method over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-serif text-primary font-bold italic">5. Cookie Policy</h2>
              <p>
                Our platform uses cookies and tracking technologies to analyze site traffic, remember user choices, and optimize interface responsiveness. You can choose to set your browser to refuse cookies, though doing so may limit your access to some features of the platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-serif text-primary font-bold italic">6. Third-Party Links</h2>
              <p>
                Our website may link to third-party websites or services. We are not responsible for the privacy practices or contents of these external sites, and we recommend reviewing their respective privacy policies before providing any personal details.
              </p>
            </section>

            <section className="space-y-4 border-t border-gold/10 pt-8">
              <h2 className="text-xl font-serif text-primary font-bold italic">7. Contact Information</h2>
              <p>
                If you have questions about this Privacy Policy, your data preferences, or wish to delete any personal records submitted, please contact us at:
              </p>
              <div className="bg-pearl p-6 rounded-2xl border border-gold/5 space-y-1 not-italic font-medium text-primary text-sm mt-4">
                <p>Pratibha Tiwari - Executive Leadership Coach</p>
                <p>Email: contact@coachtiwari.com</p>
                <p>Location: Dubai, United Arab Emirates</p>
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
