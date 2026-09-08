import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Sparkles, Download, Clock, ShieldCheck, Home, ArrowLeft } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface PremiumConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHome: () => void;
  formData: any;
}

export default function PremiumConfirmationModal({
  isOpen,
  onClose,
  onHome,
  formData
}: PremiumConfirmationModalProps) {
  const summaryRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);

  if (!isOpen) return null;

  const downloadSummaryPdf = async () => {
    if (!summaryRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const element = summaryRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFFFF',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`AI_Career_Intelligence_Receipt_${Date.now()}.pdf`);
    } catch (err) {
      console.error('PDF error:', err);
      alert('Unable to generate PDF receipt');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white rounded-3xl sm:rounded-[36px] shadow-2xl overflow-hidden border border-white/20 my-auto"
      >
        {/* Top Celebration Banner - Fixed Header */}
        <div className="bg-gradient-to-r from-primary via-slate-900 to-primary p-5 sm:p-8 text-white text-center relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gold/10 mix-blend-overlay pointer-events-none" />
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-400/30 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 size={32} className="sm:w-10 sm:h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/20 text-gold rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest mb-2">
            <Sparkles size={12} /> Submission Received
          </div>

          <h2 className="text-xl sm:text-3xl font-serif leading-tight">
            AI Career Intelligence Discovery
          </h2>

          <div className="mt-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-3 sm:p-4 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans max-w-lg mx-auto">
            Thank you for completing your AI Career Intelligence Discovery. Your responses have been received. Your personalized AI Career Intelligence Report will be prepared and delivered within 2–3 business days.
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4">
          <div ref={summaryRef} className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h4 className="font-serif text-base sm:text-lg font-bold text-slate-900">Order & Submission Receipt</h4>
                <p className="text-[11px] text-slate-500 font-mono">ID: AI-BLUEPRINT-{Math.floor(100000 + Math.random() * 900000)}</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold font-mono">
                PAID & VERIFIED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 uppercase font-mono tracking-wider text-[10px] block">Full Name</span>
                <span className="font-semibold text-slate-800 text-sm">{formData?.fullName || 'Valued Candidate'}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-mono tracking-wider text-[10px] block">Email Address</span>
                <span className="font-semibold text-slate-800 text-sm">{formData?.email || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-mono tracking-wider text-[10px] block">Location</span>
                <span className="font-medium text-slate-700">{formData?.cityCountry || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-mono tracking-wider text-[10px] block">Estimated Delivery</span>
                <span className="font-medium text-amber-700 flex items-center gap-1">
                  <Clock size={12} /> Within 2–3 Business Days
                </span>
              </div>
            </div>

            {formData?.focusAreas && formData.focusAreas.length > 0 && (
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-400 uppercase font-mono tracking-wider text-[10px] block mb-1">Selected Focus Areas</span>
                <div className="flex flex-wrap gap-1.5">
                  {formData.focusAreas.map((area: string, i: number) => (
                    <span key={i} className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-md text-[11px] font-medium">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <span>
                All responses have been logged securely. Pratibha Tiwari and team will review your responses and draft your personalized report.
              </span>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 shrink-0 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={downloadSummaryPdf}
            disabled={isGeneratingPdf}
            className="flex-1 bg-slate-900 text-white px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-md cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Download size={16} /> {isGeneratingPdf ? 'Generating PDF...' : 'Download Receipt PDF'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-slate-100 text-slate-800 px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-slate-200 transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft size={16} /> Retake / Back
          </button>
          <button
            onClick={onHome}
            className="flex-1 bg-gold text-slate-950 px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-amber-400 transition-all shadow-md cursor-pointer active:scale-95"
          >
            <Home size={16} /> Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
