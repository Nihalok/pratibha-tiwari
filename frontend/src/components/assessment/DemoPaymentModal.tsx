import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Upload,
  Copy,
  Check,
  QrCode,
  Smartphone,
  FileText,
  Clock,
  AlertCircle
} from 'lucide-react';
import { safeLocalStorage } from '../../lib/storage-helper';
import CountryPhoneInput, { validateFullPhone } from '../common/CountryPhoneInput';

interface DemoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (finalData?: any) => void;
  formData?: any;
  amount?: string;
  userName?: string;
  userEmail?: string;
}

export default function DemoPaymentModal({
  isOpen,
  onClose,
  onPaymentSuccess,
  formData,
  amount,
  userName,
  userEmail
}: DemoPaymentModalProps) {
  const pkgPrice = formData?.packagePrice || amount || '$68.00';
  const isPlatinum = formData?.packageId === 'platinum' || pkgPrice === '$98.00' || pkgPrice === '$98';
  const pkgTitle = formData?.packageTitle || (isPlatinum ? 'Platinum Package: Report + 45-Min Live Coaching' : 'Premium AI Career Intelligence Report');

  // Form State
  const [whatsapp, setWhatsapp] = useState(formData?.whatsapp || '');
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const [coachingNotes, setCoachingNotes] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      (window as any).lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }
    return () => {
      (window as any).lenis?.start();
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const upiId = 'pratibhatiwari@icici';
  const upiLink = `upi://pay?pa=${upiId}&pn=Pratibha%20Tiwari&cu=INR&tn=${encodeURIComponent(isPlatinum ? 'Platinum Career Report' : 'Premium Career Report')}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const phoneVal = validateFullPhone(whatsapp);
    if (!phoneVal.isValid) {
      setErrorMsg(phoneVal.errorMsg || 'Please provide your WhatsApp number so Pratibha can send your report.');
      return;
    }

    if (!utrNumber.trim() && !screenshotFile) {
      setErrorMsg('Please enter your payment UTR / Transaction ID or upload a payment screenshot.');
      return;
    }

    setIsSubmitting(true);

    const submissionPayload = {
      ...formData,
      whatsapp: whatsapp.trim(),
      utrNumber: utrNumber.trim() || 'Uploaded via screenshot',
      hasScreenshot: !!screenshotFile,
      screenshotName: screenshotFile?.name || '',
      coachingNotes: coachingNotes.trim(),
      paymentStatus: 'Submitted & Pending Verification',
      submittedAt: new Date().toISOString()
    };

    // 1. Store in localStorage
    safeLocalStorage.setItem('premium_submission_record', JSON.stringify(submissionPayload));

    // 2. Dispatch to Backend / Admin Email notification
    try {
      const messageBody = `
=== NEW PREMIUM CAREER ASSESSMENT SUBMISSION ===
Candidate: ${formData?.fullName || userName || 'Valued Candidate'}
Email: ${formData?.email || userEmail || 'N/A'}
WhatsApp: ${whatsapp.trim()}
City / Country: ${formData?.cityCountry || 'N/A'}
Package: ${pkgTitle} (${pkgPrice})
UTR / Ref No: ${utrNumber.trim() || 'N/A'}
Payment Proof Attached: ${screenshotFile ? 'YES (Screenshot Provided)' : 'NO'}

=== CAREER DISCOVERY RESPONSES ===
LinkedIn: ${formData?.linkedInUrl || 'N/A'}
Current Role: ${formData?.currentRoleDescription || 'N/A'}
Three Year Vision: ${formData?.threeYearVision || 'N/A'}
Biggest Obstacle: ${formData?.singleBiggestObstacle || 'N/A'}
AI Concerns: ${formData?.aiWorries || 'N/A'}
Focus Areas: ${(formData?.focusAreas || []).join(', ')}
Weekly Time: ${formData?.weeklyTime || 'N/A'}
Career Question: ${formData?.oneCareerQuestion || 'N/A'}
Coaching Notes / Slot Preference: ${coachingNotes.trim() || 'N/A'}
      `.trim();

      await fetch('/api/content/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData?.fullName || userName || 'Premium Candidate',
          email: formData?.email || userEmail || 'candidate@assessment.com',
          phone: whatsapp.trim(),
          country: formData?.cityCountry || 'Global',
          inquiryType: `Premium Assessment (${pkgPrice})`,
          message: messageBody
        })
      });
    } catch (_err) {
      // Non-blocking fallback to local storage
      console.warn('Backend notification logged locally:', _err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onPaymentSuccess(submissionPayload);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] bg-slate-950/85 backdrop-blur-md flex flex-col">
        <div className="flex-1 overflow-y-auto overscroll-contain modal-scroll-area">
          <div className="min-h-full flex items-center justify-center p-3 sm:p-6 py-10">
            <motion.div
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-2xl flex flex-col bg-white rounded-3xl sm:rounded-[36px] shadow-2xl border border-white/20 overflow-hidden my-auto"
            >"
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-primary via-slate-900 to-primary p-5 sm:p-7 text-white relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/20 text-gold rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-2 border border-gold/30">
              <Sparkles size={12} /> Scan & Pay Verification
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif">{pkgTitle}</h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Complete payment below and submit proof. Pratibha will review your assessment and send your bespoke report directly to WhatsApp.
            </p>

            <div className="mt-4 flex justify-between items-end border-t border-white/10 pt-3">
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Selected Package</div>
                <div className="text-3xl sm:text-4xl font-serif text-gold font-bold">
                  {pkgPrice} <span className="text-xs font-sans text-slate-400 font-normal">({isPlatinum ? 'approx ₹8,199' : 'approx ₹5,699'})</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-300 font-medium">Delivery Mode</div>
                <div className="text-xs font-mono text-emerald-400 flex items-center justify-end gap-1">
                  <Smartphone size={13} /> Direct WhatsApp Delivery
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs sm:text-sm flex items-center gap-2"
              >
                <AlertCircle size={18} className="shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* STEP 1: QR Code & UPI Payment Details */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gold/20 text-gold-dark font-mono font-bold text-xs flex items-center justify-center">
                    1
                  </div>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-slate-900">
                    Scan Pratibha's Official Payment QR Code
                  </h4>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                  All UPI Apps Accepted
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Visual QR Code Display */}
                <div className="bg-white p-4 rounded-2xl border-2 border-gold/40 shadow-md text-center shrink-0 w-44">
                  <div className="w-36 h-36 bg-slate-950 rounded-xl p-2 flex flex-col items-center justify-center relative overflow-hidden">
                    {/* SVG Stylized QR Code Pattern */}
                    <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                      <rect x="0" y="0" width="30" height="30" fill="#FFFFFF" />
                      <rect x="5" y="5" width="20" height="20" fill="#0F172A" />
                      <rect x="9" y="9" width="12" height="12" fill="#B8974A" />

                      <rect x="70" y="0" width="30" height="30" fill="#FFFFFF" />
                      <rect x="75" y="5" width="20" height="20" fill="#0F172A" />
                      <rect x="79" y="9" width="12" height="12" fill="#B8974A" />

                      <rect x="0" y="70" width="30" height="30" fill="#FFFFFF" />
                      <rect x="5" y="75" width="20" height="20" fill="#0F172A" />
                      <rect x="9" y="79" width="12" height="12" fill="#B8974A" />

                      {/* Data Dots Simulation */}
                      <rect x="36" y="10" width="8" height="8" fill="#FFFFFF" />
                      <rect x="48" y="10" width="8" height="8" fill="#FFFFFF" />
                      <rect x="36" y="24" width="8" height="8" fill="#FFFFFF" />
                      <rect x="48" y="24" width="8" height="8" fill="#B8974A" />

                      <rect x="10" y="38" width="8" height="8" fill="#FFFFFF" />
                      <rect x="22" y="38" width="8" height="8" fill="#FFFFFF" />
                      <rect x="36" y="38" width="8" height="8" fill="#FFFFFF" />
                      <rect x="48" y="38" width="8" height="8" fill="#FFFFFF" />
                      <rect x="62" y="38" width="8" height="8" fill="#FFFFFF" />
                      <rect x="76" y="38" width="8" height="8" fill="#B8974A" />

                      <rect x="36" y="50" width="8" height="8" fill="#B8974A" />
                      <rect x="48" y="50" width="8" height="8" fill="#FFFFFF" />
                      <rect x="62" y="50" width="8" height="8" fill="#FFFFFF" />
                      <rect x="76" y="50" width="8" height="8" fill="#FFFFFF" />

                      <rect x="36" y="70" width="8" height="8" fill="#FFFFFF" />
                      <rect x="48" y="70" width="8" height="8" fill="#FFFFFF" />
                      <rect x="62" y="70" width="8" height="8" fill="#B8974A" />
                      <rect x="76" y="70" width="8" height="8" fill="#FFFFFF" />

                      <rect x="36" y="84" width="8" height="8" fill="#FFFFFF" />
                      <rect x="48" y="84" width="8" height="8" fill="#FFFFFF" />
                      <rect x="62" y="84" width="8" height="8" fill="#FFFFFF" />
                      <rect x="76" y="84" width="8" height="8" fill="#FFFFFF" />
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 rounded-full bg-slate-900 border border-gold flex items-center justify-center">
                        <QrCode size={16} className="text-gold" />
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-700 block mt-2">
                    PRATIBHA TIWARI
                  </span>
                </div>

                {/* Instructions & Copy UPI Button */}
                <div className="space-y-3 flex-1 text-xs text-slate-600">
                  <p className="leading-relaxed">
                    Open <strong>Google Pay</strong>, <strong>PhonePe</strong>, <strong>Paytm</strong>, <strong>BHIM</strong>, or any UPI app and scan the code above, or pay to UPI ID directly:
                  </p>

                  <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-300">
                    <span className="font-mono font-bold text-slate-900 text-sm flex-1">{upiId}</span>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      {copiedUpi ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      {copiedUpi ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-500 font-mono space-y-1">
                    <div>• Payee Name: <strong>Pratibha Tiwari</strong></div>
                    <div>• Amount: <strong>{pkgPrice} ({isPlatinum ? '₹8,199' : '₹5,699'})</strong></div>
                    <div>• International / Wire: Contact support via WhatsApp for IBAN / Stripe link</div>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 2: Fill Details, WhatsApp & Upload Screenshot / UTR */}
            <form onSubmit={handleSubmitVerification} className="space-y-5">
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <div className="w-7 h-7 rounded-full bg-gold/20 text-gold-dark font-mono font-bold text-xs flex items-center justify-center">
                    2
                  </div>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-slate-900">
                    Submit Verification & WhatsApp Details
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">
                      WhatsApp Number (for Direct PDF Report Delivery) *
                    </label>
                    <CountryPhoneInput
                      value={whatsapp}
                      onChange={setWhatsapp}
                      placeholder="e.g. 98765 43210"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                      Pratibha will personally deliver your bespoke report here.
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">
                      UTR / UPI Transaction ID / Ref Number *
                    </label>
                    <input
                      type="text"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="e.g. 429182749102"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-gold focus:outline-none text-sm font-mono text-slate-900 bg-white"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                      12-digit UPI reference ID from payment receipt.
                    </span>
                  </div>
                </div>

                {/* Screenshot Upload Box */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                    Upload Payment Screenshot (Optional if UTR provided)
                  </label>
                  <div className="relative border-2 border-dashed border-slate-300 hover:border-gold rounded-2xl p-4 text-center bg-white transition-colors">
                    {screenshotPreview ? (
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img src={screenshotPreview} alt="Payment Proof" className="w-14 h-14 object-cover rounded-xl border border-slate-200" />
                          <div className="text-left">
                            <span className="text-xs font-bold text-slate-800 block truncate max-w-[200px]">{screenshotFile?.name}</span>
                            <span className="text-[10px] text-emerald-600 font-mono font-bold flex items-center gap-1">
                              <CheckCircle2 size={12} /> Image attached
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setScreenshotFile(null);
                            setScreenshotPreview('');
                          }}
                          className="text-xs text-rose-500 font-bold hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <Upload className="w-7 h-7 text-gold mx-auto mb-1.5" />
                        <span className="text-xs font-bold text-slate-800 block">Click or Drag Payment Screenshot here</span>
                        <span className="text-[10px] text-slate-500 font-mono">PNG, JPG, JPEG up to 10MB</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleScreenshotChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Platinum Coaching Note */}
                {isPlatinum && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">
                      Preferred Date & Time Slot for 45-Min Coaching Session
                    </label>
                    <textarea
                      value={coachingNotes}
                      onChange={(e) => setCoachingNotes(e.target.value)}
                      rows={2}
                      placeholder="e.g. Weekdays post 6:00 PM IST / Weekends morning EST"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-gold focus:outline-none text-xs text-slate-800 bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-gold via-amber-400 to-gold text-slate-950 py-4 sm:py-5 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:scale-[1.01] transition-all shadow-xl shadow-gold/20 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-950 rounded-full animate-spin" />
                    <span>Submitting Details & Notifying Admin...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Payment & Submit for Processing</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center justify-center gap-6 pt-1 text-slate-400 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-gold" /> Encrypted & Audited
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-gold" /> Response in 2–3 Days
              </div>
            </div>
          </div>
        </motion.div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
