/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Sparkles, RefreshCw, Check, Smartphone, Lock, Award } from 'lucide-react';
import assessmentBg from '../assets/images/pratibha-tiwari-career-assessment.jpg';

interface PaymentDetails {
  verified: boolean;
  paymentId: string;
  customerName: string;
  customerEmail: string;
  packageTitle: string;
  amountFormatted: string;
  paymentDate: string;
  paymentStatus: string;
  assessmentStatus: string;
  reportStatus: string;
}

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentDetails | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      setErrorMsg('No payment session found. Please complete checkout to unlock the assessment.');
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(`/api/assessment/payment-status/${sessionId}`);
        const data = await res.json();

        if (res.ok && data.success && data.verified) {
          setPaymentData(data);
        } else {
          setErrorMsg(data.message || 'Payment verification pending or incomplete. Please check your email.');
        }
      } catch (err) {
        console.error('[Verification Error]', err);
        setErrorMsg('Network error verifying payment. Please refresh or contact support.');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  const handleContinue = () => {
    if (sessionId) {
      navigate(`/assessment/premium?session_id=${sessionId}`);
    } else {
      navigate('/assessment/premium');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-50 via-amber-50/10 to-blue-50/20 text-slate-900 pt-24 sm:pt-32 pb-16 px-4 relative overflow-hidden flex items-center justify-center">
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-[600px] bg-gold/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-xl w-full relative z-10">
        {loading ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-xl border border-slate-200/80 space-y-6">
            <div className="w-16 h-16 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" />
            <h3 className="text-2xl font-serif text-slate-900 font-bold">Verifying Payment...</h3>
            <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">
              Connecting securely with Stripe Payment Gateway
            </p>
          </div>
        ) : paymentData && paymentData.verified ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-3xl sm:rounded-[40px] shadow-[0_25px_60px_-15px_rgba(26,58,92,0.12)] border border-gold/30 overflow-hidden"
          >
            {/* Google Pay / Premium Light Verified Banner */}
            <div className="bg-gradient-to-b from-emerald-50/80 via-white to-white p-6 sm:p-8 text-center border-b border-slate-100 relative overflow-hidden">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/25 ring-4 ring-emerald-100">
                <Check size={34} className="stroke-[3.5]" />
              </div>
              
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-100/90 text-emerald-800 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-2 border border-emerald-200/80">
                <Sparkles size={13} className="text-emerald-600" /> Verified Stripe Payment
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">Payment Successful!</h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1.5 font-sans">
                Thank you, <strong className="text-slate-900 font-semibold">{paymentData.customerName}</strong>. Your executive enrollment is confirmed.
              </p>
            </div>

            {/* Google Pay / Executive Receipt Details Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 space-y-3.5 font-sans text-xs sm:text-sm">
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                  <span className="text-slate-500 font-medium">Selected Package</span>
                  <span className="font-bold text-slate-900 text-sm sm:text-base">{paymentData.packageTitle}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                  <span className="text-slate-500 font-medium">Amount Paid</span>
                  <span className="font-bold text-emerald-600 text-base sm:text-lg font-mono">{paymentData.amountFormatted}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                  <span className="text-slate-500 font-medium">Reference ID</span>
                  <span className="font-mono font-bold text-slate-800 bg-white border border-slate-200 px-2.5 py-0.5 rounded-md shadow-xs">{paymentData.paymentId}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                  <span className="text-slate-500 font-medium">Payment Date</span>
                  <span className="text-slate-800 font-semibold">{new Date(paymentData.paymentDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Registered Email</span>
                  <span className="font-semibold text-slate-800">{paymentData.customerEmail}</span>
                </div>
              </div>

              {/* Callout Notice */}
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 text-xs text-emerald-950 flex items-start gap-3">
                <ShieldCheck size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Access Unlocked:</strong> Click below to begin your bespoke strategic questionnaire. You will receive your executive report within 10 business days.
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-gold via-amber-400 to-gold text-slate-950 py-4 sm:py-5 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:scale-[1.01] transition-all shadow-xl shadow-gold/20 cursor-pointer active:scale-[0.99] border border-amber-300"
              >
                <span>Continue to Premium Assessment</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white text-slate-900 rounded-3xl p-8 sm:p-10 text-center shadow-xl border border-red-200 space-y-6"
          >
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-900">Payment Verification Pending</h3>
            <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto">
              {errorMsg || 'Payment could not be verified automatically. No extra charge has been made.'}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/assessment/premium')}
                className="flex-1 bg-primary text-white py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-slate-900 transition-all cursor-pointer shadow-md"
              >
                <RefreshCw size={16} /> Try Again
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="flex-1 bg-slate-100 text-slate-700 py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm hover:bg-slate-200 transition-all cursor-pointer"
              >
                Contact Support
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
