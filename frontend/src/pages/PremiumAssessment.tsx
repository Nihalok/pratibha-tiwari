/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  FileText,
  Users,
  Star,
  Lock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import PremiumAssessmentWizard from '../components/assessment/PremiumAssessmentWizard';
import PremiumConfirmationModal from '../components/assessment/PremiumConfirmationModal';
import assessmentBg from '../assets/images/pratibha-tiwari-career-assessment.jpg';

const PACKAGES = [
  {
    id: 'report' as const,
    badge: 'Standard Blueprint',
    title: 'Premium Report Only',
    price: '$68',
    priceNum: 68,
    priceLabel: 'One-time Investment',
    tagline: 'Get an exhaustive, bespoke AI Career Intelligence Report built around your unique profile.',
    features: [
      'Exhaustive AI Career Intelligence Report (PDF)',
      'Deep Resume & Positioning Gap Audit',
      'AI Readiness & Career Sustainability Score',
      'Personalized Growth Roadmap',
      'Reviewed & Calibrated by Human Strategists',
      'Direct WhatsApp & Email PDF Delivery',
    ],
    color: 'border-primary/20 hover:border-primary',
    badge2: null,
  },
  {
    id: 'platinum' as const,
    badge: 'Platinum Advisory',
    title: 'Report + Live Coaching',
    price: '$98',
    priceNum: 98,
    priceLabel: 'Total Value $350+',
    tagline: 'Everything in the Premium Report PLUS a live 45-min 1-on-1 strategy session with ICF-PCC Coach Pratibha Tiwari.',
    features: [
      'Everything in the $68 Premium Report',
      'Live 45-Min 1-on-1 Coaching with Pratibha Tiwari (ICF-PCC)',
      'Personalized Executive Influence & Growth Roadmapping',
      'AI Tools Implementation Strategy',
      'LinkedIn & Personal Brand Optimization Guidance',
      'Direct WhatsApp Calendar Booking & VIP Delivery',
    ],
    color: 'border-gold/40 hover:border-gold',
    badge2: 'Most Popular',
  },
];

export default function PremiumAssessment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const sessionIdFromUrl = searchParams.get('session_id');
  const isCanceled = searchParams.get('canceled') === 'true';

  const [bgLoaded, setBgLoaded] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<typeof PACKAGES[0]>(PACKAGES[0]);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const [loadingPackageId, setLoadingPackageId] = useState<string | null>(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);
  const [verifiedSessionId, setVerifiedSessionId] = useState<string | null>(null);
  const [accessError, setAccessError] = useState<string | null>(null);

  // 1. Verify Payment Access on Mount if session_id is present
  useEffect(() => {
    if (sessionIdFromUrl) {
      setIsCheckingAccess(true);
      fetch(`/api/assessment/access-check?session_id=${sessionIdFromUrl}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.accessGranted) {
            setVerifiedSessionId(sessionIdFromUrl);
            const matchedPkg = PACKAGES.find(p => p.id === data.packageId) || PACKAGES[0];
            setSelectedPkg(matchedPkg);
            setIsWizardOpen(true);
          } else {
            setAccessError(data.message || 'Payment not verified. Please complete Stripe checkout first.');
          }
        })
        .catch(err => {
          console.error('[Access Check Error]', err);
          setAccessError('Error verifying payment session. Please try checking out again.');
        })
        .finally(() => setIsCheckingAccess(false));
    }
  }, [sessionIdFromUrl]);

  // 2. Trigger Stripe Hosted Checkout
  const handleStartPayment = async (pkg: typeof PACKAGES[0]) => {
    setSelectedPkg(pkg);
    setLoadingPackageId(pkg.id);
    setAccessError(null);

    try {
      const res = await fetch('/api/assessment/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: pkg.id,
          packageTitle: pkg.title
        })
      });

      const data = await res.json();

      if (res.ok && data.success && data.url) {
        // Redirect directly to Stripe Hosted Checkout
        window.location.href = data.url;
      } else {
        setAccessError(data.message || 'Unable to connect to Stripe Checkout. Please verify your Stripe API keys.');
      }
    } catch (err) {
      console.error('[Checkout Error]', err);
      setAccessError('Network error initializing Stripe Checkout. Please try again.');
    } finally {
      setLoadingPackageId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 sm:pt-32 pb-16 sm:pb-24 px-3 sm:px-6 overflow-hidden relative">

      {/* Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-slate-100 via-pearl to-gold/5">
        <img
          src={assessmentBg}
          alt="Premium Assessment"
          loading="lazy"
          onLoad={() => setBgLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${bgLoaded ? 'opacity-70' : 'opacity-0'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/40 to-white/95" />
      </div>
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-gold/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/career-assessment')}
          className="flex items-center gap-2 text-sm font-medium text-mist hover:text-primary transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Free Assessment
        </motion.button>

        {/* Canceled Notice Banner */}
        {isCanceled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-medium shadow-sm"
          >
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-amber-600 shrink-0" />
              <span>Payment was cancelled. No payment has been completed.</span>
            </div>
            <span className="font-bold text-amber-800">Try Again Below</span>
          </motion.div>
        )}

        {/* Access Error Banner */}
        {accessError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-50 border border-red-200 text-red-900 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-medium shadow-sm"
          >
            <AlertCircle size={18} className="text-red-600 shrink-0" />
            <span>{accessError}</span>
          </motion.div>
        )}

        {/* Loading Access State */}
        {isCheckingAccess && (
          <div className="py-20 text-center space-y-4">
            <Loader2 size={36} className="text-gold animate-spin mx-auto" />
            <p className="text-slate-600 font-serif text-lg">Verifying your payment credentials...</p>
          </div>
        )}

        {!isCheckingAccess && (
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12 space-y-5"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/15 text-amber-700 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest border border-gold/30">
                <Sparkles size={13} /> Premium Access
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-primary leading-tight">
                Unlock Your <span className="italic text-secondary">AI Career</span>
                <br />Intelligence Report
              </h1>

              <p className="text-base sm:text-lg text-mist max-w-2xl mx-auto leading-relaxed">
                Complete payment securely via Stripe. Once confirmed, unlock your strategic questionnaire and receive your executive blueprint within 10 days.
              </p>

              {/* Trust row */}
              <div className="flex flex-wrap items-center justify-center gap-5 text-[11px] font-mono text-mist pt-2">
                <span className="flex items-center gap-1.5"><Lock size={13} className="text-gold" /> 256-Bit Encrypted Stripe Payment</span>
                <span className="flex items-center gap-1.5"><Clock size={13} className="text-gold" /> Step 1: Secure Payment</span>
                <span className="flex items-center gap-1.5"><Sparkles size={13} className="text-gold" /> Step 2: Fill Questionnaire</span>
                <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-gold" /> Step 3: Report Delivery within 10 Days</span>
              </div>
            </motion.div>

            {/* Package Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {PACKAGES.map((pkg, i) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative bg-white rounded-3xl sm:rounded-[40px] p-7 sm:p-10 border-2 flex flex-col shadow-xl transition-all duration-300 ${pkg.color}`}
                >
                  {/* Most Popular ribbon */}
                  {pkg.badge2 && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold to-amber-400 text-slate-900 text-[10px] font-mono font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-lg whitespace-nowrap">
                      ★ {pkg.badge2}
                    </div>
                  )}

                  <div className="mb-6">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-secondary block mb-1">
                      {pkg.badge}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif text-primary font-bold">{pkg.title}</h2>
                    <p className="text-xs sm:text-sm text-mist mt-2 leading-relaxed">{pkg.tagline}</p>
                  </div>

                  {/* Pricing */}
                  <div className="my-4 py-4 border-y border-gray-100 flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-serif font-bold text-primary">{pkg.price}</span>
                    <span className="text-xs font-mono text-mist">{pkg.priceLabel}</span>
                  </div>

                  {/* Feature list */}
                  <ul className="space-y-3 my-4 flex-1">
                    {pkg.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 size={16} className="text-gold shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleStartPayment(pkg)}
                    disabled={loadingPackageId !== null}
                    className={`w-full mt-6 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98 ${
                      pkg.badge2
                        ? 'bg-gradient-to-r from-gold via-amber-400 to-gold text-slate-950 hover:shadow-gold/30'
                        : 'bg-primary text-white hover:bg-slate-900 shadow-primary/20'
                    } ${loadingPackageId !== null && loadingPackageId !== pkg.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loadingPackageId === pkg.id ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Connecting to Stripe...</span>
                      </>
                    ) : (
                      <>
                        <span>Pay {pkg.price} & Start Premium Assessment</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Wizard Modal — covers navbar, only form scrolls */}
      {isWizardOpen && selectedPkg && (
        <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex flex-col">
          <div className="flex-1 overflow-y-auto overscroll-contain modal-scroll-area">
            <div className="min-h-full flex items-center justify-center p-4 py-10">
              <div className="w-full max-w-3xl">
                <PremiumAssessmentWizard
                  selectedPackage={{
                    id: selectedPkg.id,
                    title: selectedPkg.title,
                    price: `$${selectedPkg.priceNum}.00`,
                    priceNum: selectedPkg.priceNum,
                  }}
                  sessionId={verifiedSessionId || undefined}
                  onCancel={() => setIsWizardOpen(false)}
                  onSubmit={(submittedData) => {
                    setFormData(submittedData);
                    setIsWizardOpen(false);
                    setIsConfirmOpen(true);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <PremiumConfirmationModal
        isOpen={isConfirmOpen}
        formData={formData}
        onClose={() => setIsConfirmOpen(false)}
        onHome={() => navigate('/')}
      />
    </div>
  );
}
