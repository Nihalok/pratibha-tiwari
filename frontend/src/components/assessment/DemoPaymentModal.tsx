import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, ShieldCheck, Lock, CheckCircle2, Sparkles, ArrowRight, Building2 } from 'lucide-react';

interface DemoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  amount?: string;
  userName?: string;
  userEmail?: string;
}

export default function DemoPaymentModal({
  isOpen,
  onClose,
  onPaymentSuccess,
  amount = "$99.00",
  userName = "",
  userEmail = ""
}: DemoPaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState(userName || 'Pratibha Tiwari');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('888');
  const [upiId, setUpiId] = useState('user@okaxis');
  
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 1800);
  };

  const handleFillDemoData = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardHolder(userName || 'Global Executive');
    setExpiry('12/28');
    setCvc('888');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-white rounded-3xl sm:rounded-[36px] shadow-2xl border border-white/20 overflow-hidden my-auto"
        >
          {/* Header Banner */}
          <div className="bg-primary p-5 sm:p-7 text-white relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/20 text-gold rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <Sparkles size={12} /> Demo Gateway Mode
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-serif">Checkout & Unlock Blueprint</h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              AI Career Intelligence Blueprint — Paid Strategic Report
            </p>

            <div className="mt-6 flex justify-between items-end border-t border-white/10 pt-4">
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Total Payable</div>
                <div className="text-3xl sm:text-4xl font-serif text-gold font-bold">{amount}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-300 font-medium">Deliverable</div>
                <div className="text-xs font-mono text-gold">Custom PDF Strategy Blueprint</div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
            {/* Developer Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 text-xs flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Payment Gateway Integration Note:</span> This is a functional demo simulator. In production, seamlessly hook this modal up to Stripe, Razorpay, or PayPal SDK.
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 font-medium text-xs sm:text-sm transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-primary bg-primary/5 text-primary font-bold shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <CreditCard size={18} /> Credit / Debit Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 font-medium text-xs sm:text-sm transition-all cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'border-primary bg-primary/5 text-primary font-bold shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Building2 size={18} /> UPI / Instant NetBanking
              </button>
            </div>

            <form onSubmit={handlePay} className="space-y-4">
              {paymentMethod === 'card' ? (
                <>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-700">Card Number</label>
                      <button
                        type="button"
                        onClick={handleFillDemoData}
                        className="text-[11px] font-mono text-gold hover:underline font-bold"
                      >
                        Auto-fill Demo Card
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:outline-none text-sm font-mono text-slate-800"
                        placeholder="4242 4242 4242 4242"
                      />
                      <CreditCard size={18} className="absolute left-3 top-3.5 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:outline-none text-sm text-slate-800"
                      placeholder="Name on card"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-1 block">Expiry Date</label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:outline-none text-sm font-mono text-slate-800"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-1 block">CVC / CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:outline-none text-sm font-mono text-slate-800"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">VPA / UPI Handle</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:outline-none text-sm font-mono text-slate-800"
                    placeholder="username@bank"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Instant approval demo link enabled.</p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-4 bg-primary text-white py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-secondary transition-all shadow-xl disabled:opacity-50 cursor-pointer active:scale-[0.99]"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Demo Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} /> Pay {amount} & Complete Assessment <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Footer Trust Badges */}
            <div className="flex items-center justify-center gap-6 pt-2 text-slate-400 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <Lock size={12} /> 256-Bit SSL Secured
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-emerald-500" /> Demo Authorized
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
