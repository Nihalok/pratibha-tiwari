/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Send, Instagram, Linkedin, Youtube, CheckCircle2, Calendar, Compass, ChevronDown } from 'lucide-react';
import SEO from '../components/layout/SEO';

const countryCodes = [
  { code: '+971', name: 'UAE', iso: 'ae' },
  { code: '+91', name: 'India', iso: 'in' },
  { code: '+1', name: 'USA/Canada', iso: 'us' },
  { code: '+44', name: 'UK', iso: 'gb' },
  { code: '+966', name: 'Saudi Arabia', iso: 'sa' },
  { code: '+974', name: 'Qatar', iso: 'qa' },
  { code: '+968', name: 'Oman', iso: 'om' },
  { code: '+965', name: 'Kuwait', iso: 'kw' },
  { code: '+973', name: 'Bahrain', iso: 'bh' },
  { code: '+61', name: 'Australia', iso: 'au' },
  { code: '+65', name: 'Singapore', iso: 'sg' },
  { code: '+49', name: 'Germany', iso: 'de' },
  { code: '+33', name: 'France', iso: 'fr' },
];

export default function Contact() {
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [localPhone, setLocalPhone] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    inquiryType: 'Individual Coaching',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        ...formData,
        country: selectedCountry.name
      };

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', phone: '', country: '', inquiryType: 'Individual Coaching', message: '' });
        setSelectedCountry(countryCodes[0]);
        setLocalPhone('');
      } else {
        const data = await response.json();
        setError(data.message || 'Something went wrong. Please try again or contact us directly.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-transparent pt-24 md:pt-40 pb-24"
    >
      <SEO 
        title="Contact & Booking" 
        description="Get in touch with Pratibha Tiwari for executive coaching, corporate training, or keynote speaking engagements."
      />
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 lg:gap-32">
        
        {/* Left: Info */}
        <div className="space-y-16">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-3 px-4 py-2 bg-gold/5 rounded-full border border-gold/10">
              <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-gold font-black">Global Reach · Local Presence</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-serif text-primary leading-[1.1] italic font-light">
              Let's Start the <span className="text-gold font-normal">Conversation</span>
            </h1>
            <p className="text-xl md:text-2xl text-mist leading-relaxed max-w-xl font-normal">
              Whether you're seeking Executive Coaching, Corporate Training, or AI Leadership Consulting or Career Growth Guidance, let's create a path to your next level of growth.
            </p>
          </div>

          <div className="grid gap-8">
            <a 
              href="https://mail.google.com/mail/?view=cm&fs=1&to=designsuperdestiny@gmail.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-start space-x-6 group p-6 bg-white rounded-3xl border border-gold/5 hover:border-gold/20 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 cursor-pointer"
            >
              <div className="p-4 bg-pearl rounded-2xl text-secondary shadow-sm ring-1 ring-gold/10 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">
                <Mail size={24} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-widest text-gold font-black mb-2 flex items-center gap-1.5">
                  Email Advisory
                  <span className="inline-block transform translate-x-0 group-hover:translate-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs">→</span>
                </div>
                <span className="text-xl md:text-2xl text-primary group-hover:text-gold transition-colors duration-300 font-serif italic block truncate">
                  designsuperdestiny@gmail.com
                </span>
              </div>
            </a>

            <a 
              href="https://wa.me/971508426354" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-start space-x-6 group p-6 bg-white rounded-3xl border border-gold/5 hover:border-gold/20 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 cursor-pointer"
            >
              <div className="p-4 bg-pearl rounded-2xl text-secondary shadow-sm ring-1 ring-gold/10 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">
                <Phone size={24} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-widest text-gold font-black mb-2 flex items-center gap-1.5">
                  Private WhatsApp
                  <span className="inline-block transform translate-x-0 group-hover:translate-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs">→</span>
                </div>
                <span className="text-xl md:text-2xl text-primary group-hover:text-gold transition-colors duration-300 font-serif italic block">
                  +971 50 842 6354
                </span>
              </div>
            </a>

            <a 
              href="https://calendly.com/dsdtrainings/30min" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-start space-x-6 group p-6 bg-white rounded-3xl border border-gold/5 hover:border-gold/20 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 cursor-pointer"
            >
              <div className="p-4 bg-pearl rounded-2xl text-secondary shadow-sm ring-1 ring-gold/10 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">
                <Calendar size={24} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-widest text-gold font-black mb-2 flex items-center gap-1.5">
                  Direct Booking
                  <span className="inline-block transform translate-x-0 group-hover:translate-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs">→</span>
                </div>
                <span className="text-xl md:text-2xl text-primary group-hover:text-gold transition-colors duration-300 font-serif italic block">
                  Schedule a 30-min Strategy Call
                </span>
              </div>
            </a>

            <div className="flex items-start space-x-6 p-6 bg-white/70 rounded-3xl border border-gold/5 transition-all duration-500">
              <div className="p-4 bg-pearl/70 rounded-2xl text-secondary shadow-sm ring-1 ring-gold/10 shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-gold font-black mb-2">Operations</div>
                <div className="text-xl md:text-2xl text-primary/80 font-serif italic">
                  Serving Dubai, Abu Dhabi, Sharjah & across the UAE & Mena Regions
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 pt-10 border-t border-gold/10">
            <div className="text-[10px] font-mono uppercase tracking-widest text-mist font-black">Digital Presence</div>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: <Linkedin size={20} />, href: "www.linkedin.com/in/coachpratibhatiwari/" },
                { icon: <Instagram size={20} />, href: "www.instagram.com/coachpratibha/" },
                { icon: <Youtube size={20} />, href: "www.youtube.com/channel/UC6FaarE5WYbyY6S5P7OPJxQ" },
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={`https://${social.href}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-5 bg-white rounded-2xl border border-gold/10 text-primary hover:bg-gold hover:text-primary transition-all duration-500 shadow-sm"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="relative">
          <div className="absolute -inset-10 bg-gold/5 blur-[100px] rounded-full -z-10" />
          
          <div className="relative bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-[4rem] shadow-2xl border border-gold/10 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl rounded-full" />
            
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 space-y-8"
              >
                <div className="inline-flex items-center justify-center w-28 h-28 bg-gold/10 rounded-full mb-6">
                  <CheckCircle2 className="text-gold w-14 h-14" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-serif text-primary italic">Message Received</h2>
                  <p className="text-mist text-lg font-normal leading-relaxed">
                    Thank you for reaching out. Pratibha's team will contact you within 24-48 hours to discuss your transformation.
                  </p>
                </div>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="bg-primary text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-gold hover:text-primary transition-all shadow-xl"
                >
                  Send Another Inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-gold font-black">Full Name</label>
                      <input 
                        required 
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter name"
                        className="w-full bg-pearl/50 border border-gold/10 p-5 focus:outline-none focus:border-gold focus:bg-white transition-all rounded-2xl placeholder:text-mist" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-gold font-black">Email Address</label>
                      <input 
                        required 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter email"
                        className="w-full bg-pearl/50 border border-gold/10 p-5 focus:outline-none focus:border-gold focus:bg-white transition-all rounded-2xl placeholder:text-mist" 
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-gold font-black">WhatsApp / Phone</label>
                      <div className="flex bg-pearl/50 border border-gold/10 focus-within:border-gold focus-within:bg-white transition-all rounded-2xl min-h-[64px] items-stretch relative">
                        <div ref={dropdownRef} className="relative flex items-center bg-transparent shrink-0">
                          <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center space-x-0.5 pl-2 pr-1 h-full hover:bg-gold/5 border-r border-gold/10 transition-colors cursor-pointer select-none text-primary rounded-l-2xl shrink-0"
                          >
                            <img 
                              src={`https://flagcdn.com/16x12/${selectedCountry.iso}.png`} 
                              alt={selectedCountry.name}
                              className="w-4 h-3 object-cover rounded-sm shadow-sm"
                            />
                            <span className="font-mono font-medium text-xs text-primary">{selectedCountry.code}</span>
                            <ChevronDown size={12} className={`text-mist transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {isOpen && (
                            <div className="absolute top-[calc(100%+4px)] left-0 z-50 w-48 bg-white border border-gold/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto py-1.5">
                              {countryCodes.map((c) => (
                                <button
                                  key={`${c.code}-${c.iso}`}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCountry(c);
                                    setIsOpen(false);
                                    setFormData(prev => ({
                                      ...prev,
                                      phone: localPhone ? `${c.code} ${localPhone}` : ''
                                    }));
                                  }}
                                  className={`w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gold/5 transition-colors ${selectedCountry.iso === c.iso ? 'bg-gold/10 font-bold' : ''}`}
                                >
                                  <img 
                                    src={`https://flagcdn.com/16x12/${c.iso}.png`} 
                                    alt={c.name}
                                    className="w-4 h-3 object-cover rounded-sm shadow-sm shrink-0"
                                  />
                                  <span className="font-mono text-xs text-primary shrink-0">{c.code}</span>
                                  <span className="text-[10px] text-mist truncate">{c.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <input 
                          type="tel"
                          value={localPhone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9\s\-()]/g, '');
                            setLocalPhone(val);
                            setFormData(prev => ({
                              ...prev,
                              phone: val ? `${selectedCountry.code} ${val}` : ''
                            }));
                          }}
                          placeholder="Enter phone"
                          className="flex-grow min-w-0 bg-transparent py-5 pr-2 pl-2 focus:outline-none placeholder:text-mist text-primary self-stretch rounded-r-2xl" 
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-gold font-black">Inquiry Type</label>
                      <div className="relative">
                        <select 
                          value={formData.inquiryType}
                          onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                          className="w-full bg-pearl/50 border border-gold/10 p-5 focus:outline-none focus:border-gold focus:bg-white transition-all rounded-2xl appearance-none cursor-pointer text-primary"
                        >
                          {['Executive Coaching', 'Corporate Training', 'AI Leadership Consulting', 'Career Growth Guidance', 'Speaking / Keynote', 'Other'].map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none ">
                          <Compass size={18} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-gold font-black">Your Vision & Goals</label>
                    <textarea 
                      required 
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about the path you'd like to create..."
                      className="w-full bg-pearl/50 border border-gold/10 p-6 focus:outline-none focus:border-gold focus:bg-white transition-all rounded-3xl resize-none placeholder:text-mist" 
                    />
                  </div>
                </div>

                {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

                <button 
                  disabled={isSubmitting}
                  className="w-full py-6 bg-primary text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center hover:bg-gold hover:text-primary transition-all duration-500 shadow-2xl shadow-primary/20 disabled: group"
                >
                  {isSubmitting ? 'Processing...' : (
                    <>
                      Initiate Transformation 
                      <Send size={16} className="ml-3 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="mt-12 text-center text-xs text-mist font-mono uppercase tracking-widest ">
            Confidentiality Guaranteed · Professional Integrity First
          </div>
        </div>
      </div>
    </motion.div>
  );
}
