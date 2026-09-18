import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Sparkles,
  Download,
  Clock,
  ShieldCheck,
  Home,
  ArrowLeft,
  Smartphone,
  Mail,
  Award,
  FileCheck
} from 'lucide-react';
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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

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

  const pkgTitle = formData?.packageTitle || (formData?.packageId === 'platinum' ? 'Platinum Package: Report + 45-Min Live Coaching (ICF-PCC)' : 'Premium AI Career Intelligence Report');
  const pkgPrice = formData?.packagePrice || (formData?.packageId === 'platinum' ? '$98.00' : '$68.00');
  const isPlatinum = formData?.packageId === 'platinum' || pkgPrice === '$98.00' || pkgPrice === '$98';
  const orderId = formData?.orderId || `AI-EXEC-${Math.floor(100000 + Math.random() * 900000)}`;
  const whatsappNum = formData?.whatsapp || 'Provided during submission';

  const downloadSummaryPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 14;
      const contentWidth = pageWidth - margin * 2; // 182mm

      doc.setFillColor(248, 250, 252);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // Outer gold & slate frame border
      doc.setDrawColor(212, 175, 55); // Gold
      doc.setLineWidth(0.6);
      doc.roundedRect(margin - 4, margin - 4, contentWidth + 8, pageHeight - (margin * 2) + 8, 3, 3, 'S');

      // Top Executive Navy Header Bar
      doc.setFillColor(15, 23, 42); // Slate 900
      doc.roundedRect(margin, margin, contentWidth, 36, 2, 2, 'F');

      // Gold Accent line under header
      doc.setFillColor(212, 175, 55);
      doc.rect(margin, margin + 35, contentWidth, 1.2, 'F');

      // Header Texts
      doc.setFont('times', 'bold');
      doc.setTextColor(212, 175, 55);
      doc.setFontSize(15);
      doc.text('PRATIBHA TIWARI  |  EXECUTIVE CAREER STRATEGY', margin + 8, margin + 11);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.text('AI CAREER INTELLIGENCE & LEADERSHIP BLUEPRINT', margin + 8, margin + 20);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(203, 213, 225);
      doc.setFontSize(8.5);
      doc.text('Official Registration & Payment Verification Receipt  •  ICF-PCC Certified Practice', margin + 8, margin + 28);

      // Order Reference Box
      doc.setFillColor(30, 41, 59);
      doc.roundedRect(pageWidth - margin - 52, margin + 6, 44, 22, 1.5, 1.5, 'F');
      doc.setFont('courier', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(212, 175, 55);
      doc.text('ENROLLMENT ID', pageWidth - margin - 50, margin + 12);
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);
      doc.text(orderId, pageWidth - margin - 50, margin + 18);
      doc.setFontSize(6.5);
      doc.setTextColor(52, 211, 153);
      doc.text('STATUS: VERIFIED', pageWidth - margin - 50, margin + 24);

      let currentY = margin + 44;

      // Notice Callout Box
      doc.setFillColor(236, 253, 245); // Emerald-50
      doc.setDrawColor(16, 185, 129); // Emerald-500
      doc.setLineWidth(0.4);
      doc.roundedRect(margin, currentY, contentWidth, 18, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(6, 95, 70);
      doc.setFontSize(9);
      doc.text('SUBMISSION & PAYMENT PROOF RECORDED SUCCESSFULLY', margin + 6, currentY + 6.5);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8);
      const noticeText = `Your assessment has been queued for human strategic review by Pratibha Tiwari. Your bespoke, world-class report will be prepared and delivered directly to your WhatsApp (${whatsappNum}) and email within 2–3 business days.`;
      const splitNotice = doc.splitTextToSize(noticeText, contentWidth - 12);
      doc.text(splitNotice, margin + 6, currentY + 11.5);

      currentY += 24;

      // Section: Candidate Profile & Enrolled Tier
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, currentY, contentWidth, 42, 2, 2, 'FD');

      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin, currentY, contentWidth, 8, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(9);
      doc.text('1. CANDIDATE PROFILE & ENROLLMENT SPECIFICATION', margin + 5, currentY + 5.5);

      // Grid data
      const col1X = margin + 6;
      const col2X = margin + 95;
      let gridY = currentY + 15;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('CANDIDATE NAME:', col1X, gridY);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8.5);
      doc.text(String(formData?.fullName || 'Valued Candidate'), col1X + 30, gridY);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('ENROLLED PACKAGE:', col2X, gridY);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(212, 175, 55);
      doc.setFontSize(8.5);
      doc.text(isPlatinum ? 'Platinum Tier ($98.00)' : 'Premium Report ($68.00)', col2X + 35, gridY);

      gridY += 7;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('DELIVERY EMAIL:', col1X, gridY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8);
      doc.text(String(formData?.email || 'N/A'), col1X + 30, gridY);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('INVESTMENT PAID:', col2X, gridY);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8.5);
      doc.text(pkgPrice, col2X + 35, gridY);

      gridY += 7;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('WHATSAPP NUMBER:', col1X, gridY);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 185, 129);
      doc.setFontSize(8.5);
      doc.text(String(whatsappNum), col1X + 30, gridY);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('UTR / TXN REF:', col2X, gridY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8);
      doc.text(String(formData?.utrNumber || 'Verified via UPI Proof'), col2X + 35, gridY);

      gridY += 7;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('LOCATION:', col1X, gridY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8);
      doc.text(String(formData?.cityCountry || 'N/A'), col1X + 30, gridY);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('SUBMITTED ON:', col2X, gridY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8);
      doc.text(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), col2X + 35, gridY);

      currentY += 48;

      // Section: Deliverables Included
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, currentY, contentWidth, 48, 2, 2, 'FD');

      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin, currentY, contentWidth, 8, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(9);
      doc.text('2. DELIVERABLES & STRATEGIC SCOPE', margin + 5, currentY + 5.5);

      let scopeY = currentY + 14;
      const deliverables = [
        'Complete 7-Pillar AI & Leadership Diagnostic Audit with Human-Validated Gap Analysis',
        '36-Month Strategic Executive Roadmap customized to your industry & compensation trajectory',
        'Direct WhatsApp PDF Delivery with pristine high-resolution executive typography and visual blueprints',
        isPlatinum
          ? 'Live 45-Minute 1-on-1 Strategic Coaching Consultation with Pratibha Tiwari (ICF-PCC)'
          : 'Priority Review by Senior ICF-PCC Accredited Strategic Coaches'
      ];

      deliverables.forEach((item, idx) => {
        doc.setFillColor(212, 175, 55);
        doc.circle(margin + 8, scopeY - 1, 1.2, 'F');
        doc.setFont('helvetica', idx === 3 && isPlatinum ? 'bold' : 'normal');
        doc.setTextColor(idx === 3 && isPlatinum ? 15 : 51, idx === 3 && isPlatinum ? 23 : 65, idx === 3 && isPlatinum ? 42 : 85);
        doc.setFontSize(8);
        doc.text(item, margin + 13, scopeY);
        scopeY += 8;
      });

      currentY += 54;

      // Section: Focus Areas & Objectives
      if (formData?.focusAreas && formData.focusAreas.length > 0) {
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(margin, currentY, contentWidth, 34, 2, 2, 'FD');

        doc.setFillColor(241, 245, 249);
        doc.roundedRect(margin, currentY, contentWidth, 8, 2, 2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(9);
        doc.text('3. CANDIDATE STRATEGIC PRIORITIES', margin + 5, currentY + 5.5);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(7.5);
        doc.text('SELECTED CORE FOCUS AREAS:', margin + 6, currentY + 15);

        let chipX = margin + 54;
        formData.focusAreas.forEach((area: string) => {
          const chipWidth = doc.getTextWidth(area) + 8;
          doc.setFillColor(238, 242, 255); // Indigo 50
          doc.setDrawColor(199, 210, 254);
          doc.roundedRect(chipX, currentY + 11.5, chipWidth, 5.5, 1, 1, 'FD');
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(67, 56, 202);
          doc.setFontSize(7);
          doc.text(area, chipX + 4, currentY + 15.5);
          chipX += chipWidth + 3;
        });

        if (formData?.oneCareerQuestion) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(100, 116, 139);
          doc.setFontSize(7.5);
          doc.text('PRIMARY INQUIRY:', margin + 6, currentY + 23);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(15, 23, 42);
          doc.setFontSize(7.5);
          const qText = `"${formData.oneCareerQuestion}"`;
          const splitQ = doc.splitTextToSize(qText, contentWidth - 45);
          doc.text(splitQ, margin + 42, currentY + 23);
        }

        currentY += 40;
      }

      // Executive Seal & Signature Pledge
      doc.setFillColor(254, 252, 232); // Amber 50
      doc.setDrawColor(251, 191, 36);
      doc.roundedRect(margin, currentY, contentWidth, 34, 2, 2, 'FD');

      doc.setFont('times', 'bold');
      doc.setTextColor(180, 83, 9);
      doc.setFontSize(10);
      doc.text('EXECUTIVE COMMITMENT & ICF-PCC ASSURANCE', margin + 6, currentY + 7);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(7.5);
      const pledge = 'Every Career Intelligence Report is synthesized using proprietary strategic rubrics and personally validated by Pratibha Tiwari. Your confidential data is strictly protected under non-disclosure standards.';
      doc.text(doc.splitTextToSize(pledge, contentWidth - 40), margin + 6, currentY + 13);

      doc.setFont('times', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text('Pratibha Tiwari', pageWidth - margin - 36, currentY + 24);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text('ICF-PCC Executive Coach', pageWidth - margin - 36, currentY + 28);

      // Bottom Footer Bar
      const footerY = pageHeight - margin - 6;
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(6.5);
      doc.text('Pratibha Tiwari • Executive Coaching & Leadership Practice • Confidential Document', margin, footerY);
      doc.text('WhatsApp: Direct Delivery • https://pratibhatiwari.com', pageWidth - margin - 70, footerY);

      doc.save(`Pratibha_Tiwari_Career_Blueprint_Receipt_${Date.now()}.pdf`);
    } catch (err) {
      console.error('PDF error:', err);
      alert('Unable to generate PDF receipt. Please check your browser permissions.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex flex-col">
      <div className="flex-1 overflow-y-auto overscroll-contain modal-scroll-area">
        <div className="min-h-full flex items-center justify-center p-3 sm:p-6 py-10">
          <motion.div
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-2xl flex flex-col bg-white rounded-3xl sm:rounded-[36px] shadow-2xl overflow-hidden border border-slate-200 my-auto"
          >
        {/* Top Google Pay Light Celebration Header */}
        <div className="bg-gradient-to-b from-emerald-50/80 via-white to-white p-5 sm:p-7 text-center border-b border-slate-100 relative overflow-hidden shrink-0">
          <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/25 ring-4 ring-emerald-100">
            <CheckCircle2 size={32} className="stroke-[2.5]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100/90 text-emerald-800 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest mb-2 border border-emerald-200/80">
            <Sparkles size={12} className="text-emerald-600" /> Enrollment Confirmed
          </div>

          <h2 className="text-xl sm:text-2xl font-serif text-slate-900 font-bold leading-tight">
            {pkgTitle}
          </h2>

          <div className="mt-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans max-w-lg mx-auto shadow-xs">
            Your responses and payment verification proof have been submitted to Pratibha Tiwari. Your personalized, world-class Career Intelligence Report will be delivered directly to your <strong className="text-emerald-700 font-bold">WhatsApp</strong> and <strong className="text-emerald-700 font-bold">Email</strong> within 2–3 business days.
          </div>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3.5">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h4 className="font-serif text-sm sm:text-base font-bold text-slate-900">Registration & Payment Receipt</h4>
                <p className="text-[11px] text-slate-500 font-mono">ID: {orderId}</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold font-mono">
                {pkgPrice} • VERIFIED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 uppercase font-mono tracking-wider text-[10px] block">Candidate Name</span>
                <span className="font-semibold text-slate-800 text-sm">{formData?.fullName || 'Valued Candidate'}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-mono tracking-wider text-[10px] block">Email Address</span>
                <span className="font-semibold text-slate-800 text-sm">{formData?.email || 'N/A'}</span>
              </div>
              <div className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200/80">
                <span className="text-emerald-700 uppercase font-mono font-bold tracking-wider text-[10px] block flex items-center gap-1">
                  <Smartphone size={12} /> WhatsApp Delivery Number
                </span>
                <span className="font-bold text-emerald-900 text-sm">{whatsappNum}</span>
              </div>
              <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/80">
                <span className="text-amber-800 uppercase font-mono font-bold tracking-wider text-[10px] block flex items-center gap-1">
                  <Clock size={12} /> Delivery Timeline
                </span>
                <span className="font-bold text-amber-900 text-xs">Within 2–3 Business Days</span>
              </div>
            </div>

            {formData?.utrNumber && (
              <div className="pt-2 border-t border-slate-200 text-xs flex justify-between items-center">
                <span className="text-slate-500">UTR / Reference:</span>
                <span className="font-mono font-bold text-slate-800">{formData.utrNumber}</span>
              </div>
            )}

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

            {isPlatinum && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
                <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Platinum Privilege:</strong> Pratibha Tiwari will reach out directly on WhatsApp ({whatsappNum}) with calendar invites to schedule your live 45-minute 1-on-1 strategic coaching session.
                </span>
              </div>
            )}

            <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <span>
                All responses have been logged and securely dispatched to the admin portal. Pratibha Tiwari and the strategy team will audit your blueprint and deliver the executive report directly.
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
            <Download size={16} /> {isGeneratingPdf ? 'Generating PDF...' : 'Download Executive Receipt PDF'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-slate-100 text-slate-800 px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-slate-200 transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft size={16} /> Review Answers
          </button>
          <button
            onClick={onHome}
            className="flex-1 bg-gold text-slate-950 px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-amber-400 transition-all shadow-md cursor-pointer active:scale-95"
          >
            <Home size={16} /> Finish & Home
          </button>
        </div>
      </motion.div>
        </div>
      </div>
    </div>
  );
}
