/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  QrCode,
  Lock,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Smartphone,
  RefreshCw,
  X,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface StripeQrModalProps {
  isOpen: boolean;
  checkoutUrl: string;
  sessionId: string;
  packageTitle: string;
  packagePrice: string;
  onSuccess: (sessionId: string) => void;
  onClose: () => void;
}

export default function StripeQrModal({
  isOpen,
  checkoutUrl,
  sessionId,
  packageTitle,
  packagePrice,
  onSuccess,
  onClose,
}: StripeQrModalProps) {
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);

  // High-resolution QR code generator using standard QR API
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&format=svg&data=${encodeURIComponent(
    checkoutUrl
  )}`;

  // Real-time payment verification polling
  useEffect(() => {
    if (!isOpen || !sessionId || isPaid) return;

    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/assessment/payment-status/${sessionId}`);
        const data = await res.json();

        if (isMounted && res.ok && data.success && data.verified) {
          setIsPaid(true);
          setIsVerifying(false);
          clearInterval(interval);
          setTimeout(() => {
            onSuccess(sessionId);
          }, 1200);
        }
      } catch (err) {
        console.warn('[QR Polling Error]', err);
      }
    }, 2500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isOpen, sessionId, isPaid, onSuccess]);

  const handleCopyLink = () => {
    if (!checkoutUrl) return;
    navigator.clipboard.writeText(checkoutUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl sm:rounded-[36px] max-w-md w-full shadow-2xl border border-gold/30 overflow-hidden relative"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-6 sm:p-7 relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/20 text-amber-300 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider mb-2 border border-gold/40">
              <QrCode size={12} /> Scan &amp; Pay via Stripe
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
              {packageTitle}
            </h3>
            <div className="flex items-center justify-between mt-2 text-xs font-mono text-slate-300">
              <span>Investment: <strong className="text-amber-400 font-bold text-sm">{packagePrice}</strong></span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                <Lock size={12} /> 256-Bit SSL
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-7 space-y-5 text-center">
            {isPaid ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 space-y-4"
              >
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30 animate-bounce">
                  <CheckCircle2 size={36} />
                </div>
                <h4 className="text-2xl font-serif font-bold text-slate-900">Payment Received!</h4>
                <p className="text-xs text-slate-500 font-sans max-w-xs mx-auto">
                  Your Stripe transaction has been verified in real-time. Unlocking your questionnaire...
                </p>
              </motion.div>
            ) : (
              <>
                {/* QR Box */}
                <div className="relative inline-block mx-auto p-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-300 shadow-inner">
                  <div className="w-60 h-60 sm:w-64 sm:h-64 bg-white rounded-2xl flex items-center justify-center overflow-hidden relative shadow-sm">
                    {!qrLoaded && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50">
                        <RefreshCw size={28} className="text-gold animate-spin mb-2" />
                        <span className="text-[11px] font-mono text-slate-500">Generating Secure QR...</span>
                      </div>
                    )}
                    <img
                      src={qrCodeImageUrl}
                      alt="Stripe Checkout QR Code"
                      onLoad={() => setQrLoaded(true)}
                      className={`w-full h-full object-contain p-2 transition-opacity duration-300 ${
                        qrLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </div>

                  {/* Centered subtle icon */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md border border-slate-200 flex items-center justify-center pointer-events-none">
                    <Smartphone size={20} className="text-primary" />
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-1 text-slate-600">
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 flex items-center justify-center gap-1.5">
                    <Smartphone size={15} className="text-secondary" /> Scan with your phone camera or browser
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Supports Apple Pay, Google Pay, Cards, and Link on Stripe.
                  </p>
                </div>

                {/* Real-time Status Indicator */}
                <div className="flex items-center justify-center gap-2 py-2 px-4 bg-amber-50 rounded-full border border-amber-200 text-amber-900 text-xs font-mono font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                  <span>Waiting for mobile checkout completion...</span>
                </div>

                {/* Action buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
                  </button>

                  <a
                    href={checkoutUrl}
                    target="_self"
                    className="flex-1 py-3 px-4 bg-primary hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <span>Pay in this Tab</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
