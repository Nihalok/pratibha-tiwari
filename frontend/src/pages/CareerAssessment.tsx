/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  TrendingUp,
  Award,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { safeLocalStorage } from '../lib/storage-helper';
import AssessmentResultsSummary, { assessmentConfig } from '../components/assessment/AssessmentResultsSummary';
import PremiumAssessmentWizard from '../components/assessment/PremiumAssessmentWizard';
import DemoPaymentModal from '../components/assessment/DemoPaymentModal';
import PremiumConfirmationModal from '../components/assessment/PremiumConfirmationModal';
import assessmentBg from '../assets/images/pratibha-tiwari-career-assessment.jpg';

// ─── Flatten ALL questions from all sections ───────────────────────────────
interface FlatQuestion {
  category: string;
  text: string;
  type: 'rating' | 'open-text' | 'single-choice';
  options?: string[];
  sectionDescription?: string;
}

const ALL_QUESTIONS: FlatQuestion[] = assessmentConfig.flatMap(section =>
  section.questions.map(q => ({
    category: section.category,
    text: q,
    type: section.type,
    options: section.options,
    sectionDescription: section.description,
  }))
);

// Only rating questions count toward the numeric score
const RATING_QUESTIONS = ALL_QUESTIONS.filter(q => q.type === 'rating');

// ─── Answer shape ──────────────────────────────────────────────────────────
interface Answer {
  category: string;
  text: string;
  type: 'rating' | 'open-text' | 'single-choice';
  points: number;       // 0 for non-rating
  value: string | number; // raw value
}

export default function CareerAssessment() {
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(() => {
    const saved = safeLocalStorage.getItem('career_assessment_step');
    return saved ? parseInt(saved, 10) : -1;
  });

  const [answers, setAnswers] = useState<Answer[]>(() => {
    const saved = safeLocalStorage.getItem('career_assessment_answers');
    return saved ? JSON.parse(saved) : [];
  });

  const [isFinished, setIsFinished] = useState<boolean>(() => {
    return safeLocalStorage.getItem('career_assessment_finished') === 'true';
  });

  // Premium Assessment States
  const [selectedPackage, setSelectedPackage] = useState<{
    id: 'report' | 'platinum';
    title: string;
    price: string;
    priceNum: number;
  }>({
    id: 'report',
    title: 'Premium AI Career Intelligence Report',
    price: '$68.00',
    priceNum: 68
  });
  const [isPremiumWizardOpen, setIsPremiumWizardOpen] = useState<boolean>(false);
  const [isDemoPaymentOpen, setIsDemoPaymentOpen] = useState<boolean>(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);
  const [premiumFormData, setPremiumFormData] = useState<any>(null);

  // For open-text: hold the draft value while the user types
  const [openTextDraft, setOpenTextDraft] = useState('');
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    safeLocalStorage.setItem('career_assessment_step', step.toString());
    safeLocalStorage.setItem('career_assessment_answers', JSON.stringify(answers));
    safeLocalStorage.setItem('career_assessment_finished', isFinished.toString());
  }, [step, answers, isFinished]);

  // Reset draft whenever step changes
  useEffect(() => {
    if (step >= 0 && step < ALL_QUESTIONS.length) {
      const existing = answers[step];
      setOpenTextDraft(existing && ALL_QUESTIONS[step].type === 'open-text'
        ? String(existing.value)
        : '');
    }
  }, [step]);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // ── Score calculation (only rating questions) ──────────────────────────
  const ratingAnswers = answers.filter(a => a.type === 'rating');
  const totalPossiblePoints = RATING_QUESTIONS.length * 50; // max 5 * 10 = 50 per question
  const currentTotalPoints = ratingAnswers.reduce((sum, ans) => sum + ans.points, 0);
  const percentage = totalPossiblePoints > 0
    ? Math.round((currentTotalPoints / totalPossiblePoints) * 100)
    : 0;

  const getLevel = () => {
    if (percentage < 40) return { name: 'Emerging Professional', color: 'text-rose-500', bg: 'bg-rose-50' };
    if (percentage < 70) return { name: 'Strategic Manager', color: 'text-amber-500', bg: 'bg-amber-50' };
    if (percentage < 90) return { name: 'Influential Leader', color: 'text-blue-500', bg: 'bg-blue-50' };
    return { name: 'Visionary Executive', color: 'text-gold', bg: 'bg-gold/10' };
  };

  // ── Navigation helpers ─────────────────────────────────────────────────
  const handleStart = () => {
    setStep(0);
    setAnswers([]);
    setIsFinished(false);
    setOpenTextDraft('');
  };

  const pushAnswer = (ans: Answer) => {
    const newAnswers = [...answers.slice(0, step), ans];
    setAnswers(newAnswers);
    if (step < ALL_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setIsFinished(true);
    }
  };

  // Rating: immediate selection advances
  const handleRating = (rating: number) => {
    const q = ALL_QUESTIONS[step];
    pushAnswer({ category: q.category, text: q.text, type: 'rating', points: rating * 10, value: rating });
  };

  // Single-choice: immediate selection advances
  const handleSingleChoice = (option: string) => {
    const q = ALL_QUESTIONS[step];
    pushAnswer({ category: q.category, text: q.text, type: 'single-choice', points: 0, value: option });
  };

  // Open-text: user types, then clicks Next
  const handleOpenTextNext = () => {
    if (!openTextDraft.trim()) return;
    const q = ALL_QUESTIONS[step];
    pushAnswer({ category: q.category, text: q.text, type: 'open-text', points: 0, value: openTextDraft.trim() });
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setAnswers(prev => prev.slice(0, step - 1 + 1));
    } else if (step === 0) {
      setStep(-1);
      setAnswers([]);
    }
  };

  // ── Aggregate rating answers per category for results ─────────────────
  const getAggregatedAnswers = () => {
    const groups: Record<string, { sum: number; count: number }> = {};
    answers.filter(a => a.type === 'rating').forEach(ans => {
      if (!groups[ans.category]) groups[ans.category] = { sum: 0, count: 0 };
      groups[ans.category].sum += ans.points;
      groups[ans.category].count += 1;
    });

    const ratingCategories = [
      'Career Stability & Future Readiness',
      'AI Readiness',
      'Professional Visibility & Positioning',
      'Human Skills & Leadership',
      'Career Confidence & Growth',
    ];

    return ratingCategories.map(cat => {
      const g = groups[cat] || { sum: 0, count: 1 };
      const points = g.count > 0 ? Math.round(g.sum / g.count) : 0;
      return { category: cat, points, text: cat };
    });
  };

  const aggregatedAnswers = getAggregatedAnswers();
  const level = getLevel();

  const sortedAggregated = [...aggregatedAnswers].sort((a, b) => b.points - a.points);
  const topStrength = sortedAggregated[0] || { category: 'AI Readiness', points: 0 };
  const mainGrowthArea = sortedAggregated[sortedAggregated.length - 1] || { category: 'Human Skills & Leadership', points: 0 };

  // ── PDF download (Pure Native Vector jsPDF Engine for Zero Text Clipping & Razor Sharp Quality) ──
  const downloadReport = async () => {
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
      const contentWidth = pageWidth - (margin * 2); // 182 mm
      const rightX = pageWidth - margin; // 196 mm

      // ── Outer Subtle Executive Border ──
      doc.setDrawColor(226, 232, 240); // #E2E8F0
      doc.setLineWidth(0.35);
      doc.roundedRect(8, 8, pageWidth - 16, pageHeight - 16, 3, 3, 'S');

      // ── Top Gold Luxury Accent Line ──
      doc.setFillColor(184, 151, 74); // #B8974A
      doc.roundedRect(margin, 14, contentWidth, 1.8, 0.9, 0.9, 'F');

      // ── Header Left: Brand & Report Title ──
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(26, 58, 92); // #1A3A5C
      doc.text('PRATIBHA TIWARI', margin, 24);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(184, 151, 74); // #B8974A
      doc.text('EXECUTIVE STRATEGIC PERFORMANCE REPORT', margin, 29);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139); // #64748B
      const dateFormatted = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      doc.text(`COHORT BENCHMARK: GLOBAL EXECUTIVE  |  DATE: ${dateFormatted}`, margin, 34);

      // ── Header Right: Global Index Score Card ──
      const badgeW = 46;
      const badgeH = 22;
      const badgeX = rightX - badgeW;
      const badgeY = 17;

      doc.setFillColor(15, 23, 42); // #0F172A
      doc.setDrawColor(184, 151, 74); // #B8974A
      doc.setLineWidth(0.4);
      doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 2.5, 2.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text(`${percentage}%`, badgeX + (badgeW / 2), badgeY + 8, { align: 'center' });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(197, 168, 128); // #C5A880
      doc.text('GLOBAL PERFORMANCE INDEX', badgeX + (badgeW / 2), badgeY + 13, { align: 'center' });

      doc.setFillColor(30, 41, 59); // #1E293B
      doc.roundedRect(badgeX + 4, badgeY + 15, badgeW - 8, 4.5, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(248, 250, 252);
      doc.text(level.name.toUpperCase(), badgeX + (badgeW / 2), badgeY + 18.2, { align: 'center' });

      // ── Divider ──
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, 42, rightX, 42);

      // ── Section 1: Executive Profile Snapshot (3 Cards) ──
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(26, 58, 92);
      doc.text('01. EXECUTIVE PROFILE SNAPSHOT', margin, 48);

      const cardW = (contentWidth - 8) / 3; // (182 - 8)/3 = 58 mm
      const cardH = 22;
      const cardY = 51;

      // Card 1: Classification Tier
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, cardY, cardW, cardH, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text('CLASSIFICATION TIER', margin + 3.5, cardY + 5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(26, 58, 92);
      doc.text(level.name, margin + 3.5, cardY + 11);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Evaluated Leadership Benchmark', margin + 3.5, cardY + 17);

      // Card 2: Dominant Strength
      const card2X = margin + cardW + 4;
      doc.setFillColor(240, 253, 244); // #F0FDF4
      doc.setDrawColor(187, 247, 208); // #BBF7D0
      doc.roundedRect(card2X, cardY, cardW, cardH, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(21, 128, 61); // #15803D
      doc.text('DOMINANT STRENGTH', card2X + 3.5, cardY + 5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(20, 83, 45); // #14532D
      const strengthLines = doc.splitTextToSize(topStrength.category, cardW - 7);
      doc.text(strengthLines, card2X + 3.5, cardY + 10);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(22, 163, 74); // #16A34A
      doc.text(`Score: ${topStrength.points}/50 Pts (Benchmark Lead)`, card2X + 3.5, cardY + 18);

      // Card 3: Growth Accelerator
      const card3X = card2X + cardW + 4;
      doc.setFillColor(255, 241, 242); // #FFF1F2
      doc.setDrawColor(254, 205, 211); // #FECDD3
      doc.roundedRect(card3X, cardY, cardW, cardH, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(190, 18, 60); // #BE123C
      doc.text('GROWTH ACCELERATOR', card3X + 3.5, cardY + 5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(159, 18, 57); // #9F1239
      const growthLines = doc.splitTextToSize(mainGrowthArea.category, cardW - 7);
      doc.text(growthLines, card3X + 3.5, cardY + 10);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(225, 29, 72); // #E11D48
      doc.text(`Score: ${mainGrowthArea.points}/50 Pts (Priority Focus)`, card3X + 3.5, cardY + 18);

      // ── Section 2: Domain Performance Audit (5 Pillars) ──
      const section2Y = 78;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(26, 58, 92);
      doc.text('02. STRATEGIC DOMAIN AUDIT (5 PILLARS)', margin, section2Y);

      let rowY = section2Y + 4;
      const rowHeight = 11.5;

      aggregatedAnswers.forEach((ans) => {
        const scorePercent = (ans.points / 50);
        const statusLabel =
          ans.points >= 45 ? 'Visionary' : ans.points >= 35 ? 'Proficient' : ans.points >= 25 ? 'Moderate' : 'Developing';

        // Row background box
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.roundedRect(margin, rowY, contentWidth, rowHeight, 1.8, 1.8, 'FD');

        // Domain Name Text
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42); // #0F172A
        doc.text(ans.category, margin + 4, rowY + 7.2);

        // Progress Bar Background
        const barX = margin + 78;
        const barW = 56;
        const barH = 3.5;
        const barY = rowY + 4;

        doc.setFillColor(226, 232, 240); // #E2E8F0
        doc.roundedRect(barX, barY, barW, barH, 1.5, 1.5, 'F');

        // Progress Bar Fill
        if (ans.points >= 40) {
          doc.setFillColor(26, 58, 92); // #1A3A5C
        } else if (ans.points >= 25) {
          doc.setFillColor(184, 151, 74); // #B8974A
        } else {
          doc.setFillColor(225, 29, 72); // #E11D48
        }
        const fillW = Math.max(2, barW * scorePercent);
        doc.roundedRect(barX, barY, fillW, barH, 1.5, 1.5, 'F');

        // Numeric Score
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text(`${ans.points}/50`, margin + 144, rowY + 7.2, { align: 'right' });

        // Status Label Pill
        if (ans.points >= 40) {
          doc.setTextColor(5, 150, 105); // #059669
        } else if (ans.points >= 25) {
          doc.setTextColor(184, 151, 74); // #B8974A
        } else {
          doc.setTextColor(225, 29, 72); // #E11D48
        }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.text(statusLabel, rightX - 4, rowY + 7.2, { align: 'right' });

        rowY += rowHeight + 2;
      });

      // ── Section 3: Pratibha's Strategic Diagnostic & Directives ──
      const section3Y = rowY + 3;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(26, 58, 92);
      doc.text("03. PRATIBHA'S STRATEGIC DIAGNOSTIC & DIRECTIVES", margin, section3Y);

      const darkBoxY = section3Y + 3.5;
      const darkBoxH = 68;

      doc.setFillColor(15, 23, 42); // #0F172A
      doc.setDrawColor(51, 65, 85); // #334155
      doc.setLineWidth(0.4);
      doc.roundedRect(margin, darkBoxY, contentWidth, darkBoxH, 2.5, 2.5, 'FD');

      // Accent vertical gold line next to quote
      doc.setFillColor(184, 151, 74);
      doc.roundedRect(margin + 4, darkBoxY + 5, 1.2, 16, 0.6, 0.6, 'F');

      // Diagnostic Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(184, 151, 74);
      doc.text("EXECUTIVE DIAGNOSTIC ADVISORY", margin + 8, darkBoxY + 8);

      // Diagnostic Quote
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.8);
      doc.setTextColor(241, 245, 249); // #F1F5F9
      const quoteText = `"To transition from ${level.name} to the apex of industry benchmark, systematically upgrade your ${mainGrowthArea.category.toLowerCase()} architecture. High-impact leaders differ not by sheer effort, but through strategic narrative precision and influence positioning."`;
      const splitQuote = doc.splitTextToSize(quoteText, contentWidth - 14);
      doc.text(splitQuote, margin + 8, darkBoxY + 13.5);

      // Two Action Directives Side-by-Side
      const directiveW = (contentWidth - 12) / 2; // (182 - 12)/2 = 85 mm
      const directiveH = 34;
      const directiveY = darkBoxY + 28;

      // Directive 1: Cognitive Leverage
      doc.setFillColor(30, 41, 59); // #1E293B
      doc.setDrawColor(51, 65, 85);
      doc.roundedRect(margin + 4, directiveY, directiveW, directiveH, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.2);
      doc.setTextColor(245, 158, 11); // #F59E0B
      doc.text("PRIORITY 01: COGNITIVE LEVERAGE & AI", margin + 7.5, directiveY + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(226, 232, 240);
      const directive1Text = "Automate 20%+ of routine cognitive workflows using custom AI agents to free strategic space for high-leverage organizational decisions.";
      const splitDir1 = doc.splitTextToSize(directive1Text, directiveW - 7);
      doc.text(splitDir1, margin + 7.5, directiveY + 12);

      // Directive 2: Narrative Authority
      const directive2X = margin + 4 + directiveW + 4;
      doc.setFillColor(30, 41, 59);
      doc.setDrawColor(51, 65, 85);
      doc.roundedRect(directive2X, directiveY, directiveW, directiveH, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.2);
      doc.setTextColor(245, 158, 11);
      doc.text("PRIORITY 02: NARRATIVE AUTHORITY", directive2X + 3.5, directiveY + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(226, 232, 240);
      const directive2Text = "Align your executive presence and market visibility to match your true capability and command senior industry positioning.";
      const splitDir2 = doc.splitTextToSize(directive2Text, directiveW - 7);
      doc.text(splitDir2, directive2X + 3.5, directiveY + 12);

      // ── Section 4: Trust Seal & Official Footer ──
      const footerY = 270;
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, footerY, rightX, footerY);

      // Trust Badges
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(26, 58, 92);
      doc.text("[✓] EXECUTIVE CERTIFIED", margin, footerY + 6);
      doc.text("[⚡] AI INTELLIGENCE AUDITED", margin + 58, footerY + 6);
      doc.text("[★] PERFORMANCE VERIFIED", margin + 122, footerY + 6);

      // Confidential Notice
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.2);
      doc.setTextColor(100, 116, 139);
      doc.text("STRICTLY CONFIDENTIAL  •  ISSUED BY PRATIBHA TIWARI STRATEGIC ADVISORY  •  ALL RIGHTS RESERVED", margin, footerY + 12);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.2);
      doc.setTextColor(184, 151, 74);
      doc.text("PRATIBHATIWARI.COM", rightX, footerY + 12, { align: 'right' });

      const dateStr = new Date().toISOString().split('T')[0];
      doc.save(`Pratibha_Tiwari_Executive_Performance_Report_${dateStr}.pdf`);
    } catch (err: any) {
      console.error('PDF Generation Error:', err);
      alert('Unable to generate PDF report: ' + (err?.message || 'Please try again.'));
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // ── Current question ───────────────────────────────────────────────────
  const currentQ = step >= 0 && step < ALL_QUESTIONS.length ? ALL_QUESTIONS[step] : null;
  const progress = step >= 0 ? Math.round(((step + 1) / ALL_QUESTIONS.length) * 100) : 0;

  // ── Single-choice button styles per option ─────────────────────────────
  const getChoiceStyle = (option: string) => {
    const lower = option.toLowerCase();
    if (lower === 'yes') return 'border-emerald-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 hover:shadow-emerald-200';
    if (lower === 'no') return 'border-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 hover:shadow-rose-200';
    if (lower.startsWith('maybe')) return 'border-amber-400 hover:bg-amber-500 hover:text-white hover:border-amber-500 hover:shadow-amber-200';
    return 'border-primary/20 hover:bg-secondary hover:text-white hover:border-secondary hover:shadow-secondary/20';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-white pt-24 sm:pt-32 pb-16 sm:pb-24 px-3 sm:px-6 overflow-hidden relative"
    >
      {/* Premium Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-slate-100 via-pearl to-gold/5">
        <img
          src={assessmentBg}
          alt="Professional Assessment Background"
          loading="lazy"
          decoding="async"
          onLoad={() => setBgLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${bgLoaded ? 'opacity-80' : 'opacity-0'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/30 to-white/90" />
        <div className="absolute inset-0 bg-gold/5 mix-blend-overlay" />
      </div>

      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-gold/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-secondary/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <AnimatePresence mode="wait">

          {/* ── Splash screen ── */}
          {step === -1 && (
            <motion.div
              key="splash"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-6 sm:space-y-10 py-6 sm:py-12 px-2"
            >
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-secondary/10 text-secondary rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                <Sparkles size={14} /> <span>Premium Assessment</span>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif text-primary leading-tight">
                Benchmark Your <br />
                <span className="italic text-secondary">Influence Architecture</span>
              </h1>
              <p className="text-base sm:text-xl text-mist max-w-2xl mx-auto leading-relaxed">
                A high-precision evaluation of your leadership, AI integration, and communication clarity.
                Used by global executives to identify invisible plateaus.
              </p>
              <div className="pt-4 sm:pt-8">
                <button
                  onClick={handleStart}
                  className="bg-primary text-white px-8 py-4 sm:px-12 sm:py-6 rounded-full font-bold text-base sm:text-lg shadow-2xl hover:bg-secondary hover:scale-105 transition-all flex items-center mx-auto cursor-pointer"
                >
                  Initiate Assessment <ArrowRight className="ml-2 sm:ml-3" size={18} />
                </button>
                <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-mist font-mono">ESTIMATED TIME: 5 MINUTES</p>
              </div>
            </motion.div>
          )}

          {/* ── Question screen ── */}
          {step >= 0 && !isFinished && currentQ && (
            <motion.div
              key={`question-${step}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white/80 backdrop-blur-xl p-5 sm:p-8 md:p-16 rounded-3xl sm:rounded-[48px] shadow-[0_40px_80px_-20px_rgba(26,58,92,0.15)] border border-white/20 relative overflow-hidden"
            >
              {/* Progress bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gray-100/50 rounded-t-3xl sm:rounded-t-[48px] overflow-hidden">
                <motion.div
                  className="h-full bg-secondary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="relative z-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 sm:mb-10">
                  <div className="space-y-1 flex-1 mr-2 sm:mr-4 min-w-0">
                    <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] text-secondary font-bold truncate">
                      {currentQ.category}
                    </div>
                    {currentQ.sectionDescription && (
                      <div className="text-[9px] sm:text-[10px] font-mono text-mist truncate">
                        {currentQ.sectionDescription}
                      </div>
                    )}
                  </div>
                  <div className="text-xl sm:text-2xl font-serif text-primary italic shrink-0">
                    {step + 1}<span className="text-xs align-top pt-1">{`/${ALL_QUESTIONS.length}`}</span>
                  </div>
                </div>

                {/* Question text */}
                <h2 className="text-lg sm:text-2xl md:text-3xl font-serif text-primary mb-6 sm:mb-10 leading-snug sm:leading-tight">
                  {currentQ.text.replace('*', '')}
                </h2>

                {/* ── Rating ── */}
                {currentQ.type === 'rating' && (
                  <div className="flex justify-between items-start gap-1 sm:gap-2 md:gap-4 py-4 w-full">
                    {[
                      { val: 1, label: 'Strongly\nDisagree' },
                      { val: 2, label: 'Disagree' },
                      { val: 3, label: 'Neutral' },
                      { val: 4, label: 'Agree' },
                      { val: 5, label: 'Strongly\nAgree' },
                    ].map(({ val, label }) => (
                      <button
                        key={val}
                        onClick={() => handleRating(val)}
                        className="flex flex-col items-center group/btn flex-1 focus:outline-none cursor-pointer"
                      >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full border-2 border-primary/10 bg-white/70 flex items-center justify-center text-sm sm:text-lg md:text-xl font-bold text-primary transition-all duration-300 group-hover/btn:border-secondary group-hover/btn:bg-secondary group-hover/btn:text-white group-hover/btn:scale-110 group-hover/btn:shadow-lg group-hover/btn:shadow-secondary/20 active:scale-95 shrink-0">
                          {val}
                        </div>
                        <div className="h-8 sm:h-10 mt-2 flex items-start justify-center">
                          <span className="text-[8px] sm:text-[10px] md:text-xs font-semibold text-mist text-center leading-tight opacity-70 group-hover/btn:opacity-100 group-hover/btn:text-primary transition-all duration-300 max-w-[55px] sm:max-w-[70px] whitespace-pre-line">
                            {label}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* ── Single-choice (Yes/No/Maybe + other lists) ── */}
                {currentQ.type === 'single-choice' && currentQ.options && (
                  <div className={`grid gap-3 ${currentQ.options.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
                    {currentQ.options.map(option => (
                      <button
                        key={option}
                        onClick={() => handleSingleChoice(option)}
                        className={`px-6 py-4 rounded-2xl border-2 bg-white/60 text-primary font-semibold text-sm md:text-base transition-all duration-250 hover:scale-[1.03] hover:shadow-lg active:scale-95 ${getChoiceStyle(option)}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {/* ── Open-text ── */}
                {currentQ.type === 'open-text' && (
                  <div className="space-y-4">
                    <textarea
                      className="w-full min-h-[160px] p-5 rounded-2xl border-2 border-primary/10 bg-white/60 text-primary placeholder:text-mist/50 focus:outline-none focus:border-secondary transition-colors resize-none text-base leading-relaxed"
                      placeholder="Share your thoughts here…"
                      value={openTextDraft}
                      onChange={e => setOpenTextDraft(e.target.value)}
                    />
                    <button
                      onClick={handleOpenTextNext}
                      disabled={!openTextDraft.trim()}
                      className="bg-primary text-white px-10 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-secondary transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                    >
                      Continue <ArrowRight size={18} />
                    </button>
                  </div>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center mt-10 pt-6 border-t border-primary/5">
                  <button
                    onClick={handleBack}
                    className="text-sm font-medium text-mist hover:text-primary flex items-center gap-2 transition-colors"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <span className="text-xs font-mono text-mist">
                    Progress: {progress}%
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Premium Assessment Wizard Screen ── */}
          {isPremiumWizardOpen && (
            <motion.div
              key="premium-wizard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-4"
            >
              <PremiumAssessmentWizard
                selectedPackage={selectedPackage}
                onCancel={() => setIsPremiumWizardOpen(false)}
                onSubmit={(formData) => {
                  setPremiumFormData(formData);
                  setIsPremiumWizardOpen(false);
                  setIsDemoPaymentOpen(true);
                }}
              />
            </motion.div>
          )}

          {/* ── Results screen ── */}
          {isFinished && !isPremiumWizardOpen && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-12"
            >
              <AssessmentResultsSummary
                answers={aggregatedAnswers}
                percentage={percentage}
                level={level}
                onDownload={downloadReport}
                onRetake={handleStart}
                onStartPremium={(pkg) => {
                  if (pkg) setSelectedPackage(pkg);
                  setIsPremiumWizardOpen(true);
                }}
                onHome={() => {
                  safeLocalStorage.removeItem('career_assessment_step');
                  safeLocalStorage.removeItem('career_assessment_answers');
                  safeLocalStorage.removeItem('career_assessment_finished');
                  navigate('/');
                }}
                isGeneratingPdf={isGeneratingPdf}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Demo Payment Gateway Modal */}
      <DemoPaymentModal
        isOpen={isDemoPaymentOpen}
        onClose={() => setIsDemoPaymentOpen(false)}
        formData={premiumFormData}
        amount={selectedPackage?.price}
        userName={premiumFormData?.fullName}
        userEmail={premiumFormData?.email}
        onPaymentSuccess={(finalData) => {
          if (finalData) {
            setPremiumFormData(finalData);
          }
          setIsDemoPaymentOpen(false);
          setIsConfirmationOpen(true);
        }}
      />

      {/* Premium Confirmation Modal */}
      <PremiumConfirmationModal
        isOpen={isConfirmationOpen}
        formData={premiumFormData}
        onClose={() => setIsConfirmationOpen(false)}
        onHome={() => {
          setIsConfirmationOpen(false);
          safeLocalStorage.removeItem('career_assessment_step');
          safeLocalStorage.removeItem('career_assessment_answers');
          safeLocalStorage.removeItem('career_assessment_finished');
          safeLocalStorage.removeItem('premium_career_assessment_draft');
          navigate('/');
        }}
      />
    </motion.div>
  );
}
