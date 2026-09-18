/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  ArrowLeft,
  CheckSquare,
  Square,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { safeLocalStorage } from '../lib/storage-helper';
import AssessmentResultsSummary, {
  assessmentConfig,
  getResultZone,
  MAX_RAW_SCORE,
  CATEGORY_MAX,
  RATING_CATEGORIES,
} from '../components/assessment/AssessmentResultsSummary';
import PremiumAssessmentWizard from '../components/assessment/PremiumAssessmentWizard';
import PremiumConfirmationModal from '../components/assessment/PremiumConfirmationModal';
import assessmentBg from '../assets/images/pratibha-tiwari-career-assessment.jpg';

// ─── Flatten ALL questions from all sections ───────────────────────────────
interface FlatQuestion {
  category: string;
  sectionTitle: string;
  sectionNumber: number;
  text: string;
  type: 'rating' | 'open-text' | 'single-choice' | 'short-answer' | 'multi-checkbox';
  options?: string[];
  sectionDescription?: string;
  reverseScore?: boolean;
  /** Global question index (1-based) for display */
  displayIndex: number;
}

const ALL_QUESTIONS: FlatQuestion[] = (() => {
  let idx = 0;
  return assessmentConfig.flatMap(section =>
    section.questions.map(q => {
      idx++;
      return {
        category: section.category,
        sectionTitle: section.sectionTitle,
        sectionNumber: section.sectionNumber,
        text: q.text,
        type: section.type,
        options: section.options,
        sectionDescription: section.description,
        reverseScore: q.reverseScore,
        displayIndex: idx,
      };
    })
  );
})();

const TOTAL_QUESTIONS = ALL_QUESTIONS.length; // 42

// ─── Answer shape ──────────────────────────────────────────────────────────
interface Answer {
  category: string;
  text: string;
  type: 'rating' | 'open-text' | 'single-choice' | 'short-answer' | 'multi-checkbox';
  /** Raw 1–5 points for rating (after reverse), 0 for others */
  points: number;
  value: string | number | string[];
}

export default function CareerAssessment() {
  const navigate = useNavigate();

  // Always start at splash — never resume a stale in-progress session.
  // This prevents old-format localStorage data from inflating scores.
  const [step, setStep] = useState<number>(-1);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Premium states
  const [selectedPackage, setSelectedPackage] = useState<{
    id: 'report' | 'platinum';
    title: string;
    price: string;
    priceNum: number;
  }>({
    id: 'report',
    title: 'Premium AI Career Intelligence Report',
    price: '$68.00',
    priceNum: 68,
  });
  const [isPremiumWizardOpen, setIsPremiumWizardOpen] = useState<boolean>(false);
  const [isDemoPaymentOpen, setIsDemoPaymentOpen] = useState<boolean>(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);
  const [premiumFormData, setPremiumFormData] = useState<any>(null);

  // Drafts for text-based questions
  const [textDraft, setTextDraft] = useState('');
  // Draft for multi-checkbox
  const [checkboxDraft, setCheckboxDraft] = useState<string[]>([]);
  const [bgLoaded, setBgLoaded] = useState(false);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Clear any stale localStorage data on mount (old format used points up to 50).
  useEffect(() => {
    safeLocalStorage.removeItem('career_assessment_step');
    safeLocalStorage.removeItem('career_assessment_answers');
    safeLocalStorage.removeItem('career_assessment_finished');
  }, []);

  // Reset drafts when step changes
  useEffect(() => {
    if (step >= 0 && step < TOTAL_QUESTIONS) {
      const q = ALL_QUESTIONS[step];
      const existing = answers[step];
      if (q.type === 'short-answer' || q.type === 'open-text') {
        setTextDraft(existing ? String(existing.value) : '');
      } else if (q.type === 'multi-checkbox') {
        setCheckboxDraft(existing ? (existing.value as string[]) : []);
      }
    }
  }, [step]);

  // ── Score calculation ─────────────────────────────────────────────────────
  const rawScore = answers.reduce((sum, a) => sum + a.points, 0);
  const percentage = Math.round((rawScore / MAX_RAW_SCORE) * 100);

  const zone = getResultZone(rawScore);

  // Legacy "level" shape for PDF compatibility
  const level = {
    name: zone.name,
    color: zone.color,
    bg: zone.bg,
  };

  // ── Aggregate rating answers per category for results display ─────────────
  const getAggregatedAnswers = () => {
    const groups: Record<string, number> = {};
    answers.filter(a => a.type === 'rating').forEach(ans => {
      if (!groups[ans.category]) groups[ans.category] = 0;
      groups[ans.category] += ans.points;
    });

    return RATING_CATEGORIES.map(cat => ({
      category: cat,
      points: groups[cat] ?? 0,
      text: cat,
    }));
  };

  const aggregatedAnswers = getAggregatedAnswers();
  const sortedAgg = [...aggregatedAnswers].sort((a, b) => b.points - a.points);
  const topStrength = sortedAgg[0] || { category: 'AI Readiness', points: 0 };
  const mainGrowthArea = sortedAgg[sortedAgg.length - 1] || { category: 'Career Confidence & Growth', points: 0 };

  // ── Navigation helpers ─────────────────────────────────────────────────────
  const handleStart = () => {
    safeLocalStorage.removeItem('premium_career_assessment_draft');
    setStep(0);
    setAnswers([]);
    setIsFinished(false);
    setTextDraft('');
    setCheckboxDraft([]);
  };

  const pushAnswer = (ans: Answer) => {
    const newAnswers = [...answers.slice(0, step), ans];
    setAnswers(newAnswers);
    if (step < TOTAL_QUESTIONS - 1) {
      setStep(step + 1);
    } else {
      setIsFinished(true);
    }
  };

  // Rating: 1–5, reverse if flagged
  const handleRating = (rating: number) => {
    const q = ALL_QUESTIONS[step];
    const pts = q.reverseScore ? 6 - rating : rating;
    pushAnswer({ category: q.category, text: q.text, type: 'rating', points: pts, value: rating });
  };

  // Single-choice: immediate advance
  const handleSingleChoice = (option: string) => {
    const q = ALL_QUESTIONS[step];
    pushAnswer({ category: q.category, text: q.text, type: 'single-choice', points: 0, value: option });
  };

  // Short-answer: Next button
  const handleShortAnswerNext = () => {
    if (!textDraft.trim()) return;
    const q = ALL_QUESTIONS[step];
    pushAnswer({ category: q.category, text: q.text, type: 'short-answer', points: 0, value: textDraft.trim() });
    setTextDraft('');
  };

  // Open-text: Next button
  const handleOpenTextNext = () => {
    if (!textDraft.trim()) return;
    const q = ALL_QUESTIONS[step];
    pushAnswer({ category: q.category, text: q.text, type: 'open-text', points: 0, value: textDraft.trim() });
    setTextDraft('');
  };

  // Multi-checkbox: Next button
  const handleCheckboxNext = () => {
    if (checkboxDraft.length === 0) return;
    const q = ALL_QUESTIONS[step];
    pushAnswer({ category: q.category, text: q.text, type: 'multi-checkbox', points: 0, value: checkboxDraft });
    setCheckboxDraft([]);
  };

  const toggleCheckbox = (option: string) => {
    setCheckboxDraft(prev =>
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setAnswers(prev => prev.slice(0, step));
    } else if (step === 0) {
      setStep(-1);
      setAnswers([]);
    }
  };

  const currentQ = step >= 0 && step < TOTAL_QUESTIONS ? ALL_QUESTIONS[step] : null;
  const progress = step >= 0 ? Math.round(((step + 1) / TOTAL_QUESTIONS) * 100) : 0;

  // ── Single-choice button styles ────────────────────────────────────────────
  const getChoiceStyle = (option: string) => {
    const lower = option.toLowerCase();
    if (lower === 'yes') return 'border-emerald-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500';
    if (lower === 'no') return 'border-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-500';
    if (lower.startsWith('maybe') || lower === 'not right now') return 'border-amber-400 hover:bg-amber-500 hover:text-white hover:border-amber-500';
    return 'border-primary/20 hover:bg-secondary hover:text-white hover:border-secondary';
  };

  // ── SECTION HEADER detection ───────────────────────────────────────────────
  const isFirstOfSection = (stepIdx: number): boolean => {
    if (stepIdx === 0) return true;
    return ALL_QUESTIONS[stepIdx].sectionTitle !== ALL_QUESTIONS[stepIdx - 1].sectionTitle;
  };

  // ── PDF GENERATION ─────────────────────────────────────────────────────────
  const downloadReport = async () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });

      const pageW = 210;
      const pageH = 297;
      const margin = 14;
      const cw = pageW - margin * 2; // 182 mm
      const rx = pageW - margin;

      let y = 0; // dynamic Y pointer

      const addPageIfNeeded = (neededH: number) => {
        if (y + neededH > pageH - 20) {
          doc.addPage();
          y = 16;
        }
      };

      // ── PAGE 1 HEADER ──────────────────────────────────────────────────────
      // Outer border
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.35);
      doc.roundedRect(8, 8, pageW - 16, pageH - 16, 3, 3, 'S');

      // Gold top line
      doc.setFillColor(184, 151, 74);
      doc.roundedRect(margin, 14, cw, 1.8, 0.9, 0.9, 'F');

      y = 24;

      // Brand name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(26, 58, 92);
      doc.text('PRATIBHA TIWARI', margin, y);

      // Sub-title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(184, 151, 74);
      doc.text('AI CAREER SUSTAINABILITY ASSESSMENT — FREE REPORT', margin, y + 5.5);

      // Date
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      const dateFormatted = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      doc.text(`ASSESSMENT DATE: ${dateFormatted}  |  TOTAL QUESTIONS: 42`, margin, y + 11);

      // Score badge (top-right)
      const badgeW = 50;
      const badgeH = 24;
      const badgeX = rx - badgeW;
      const badgeY = 15;

      doc.setFillColor(15, 23, 42);
      doc.setDrawColor(184, 151, 74);
      doc.setLineWidth(0.4);
      doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 2.5, 2.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text(`${rawScore}/${MAX_RAW_SCORE}`, badgeX + badgeW / 2, badgeY + 9, { align: 'center' });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.setTextColor(197, 168, 128);
      doc.text('AI SUSTAINABILITY SCORE', badgeX + badgeW / 2, badgeY + 14, { align: 'center' });

      doc.setFillColor(30, 41, 59);
      doc.roundedRect(badgeX + 4, badgeY + 16, badgeW - 8, 5, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.setTextColor(248, 250, 252);
      const zoneName = zone.name.toUpperCase();
      doc.text(zoneName, badgeX + badgeW / 2, badgeY + 19.5, { align: 'center' });

      // Divider
      y = 42;
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, y, rx, y);
      y += 8;

      // ── SECTION 1: RESULT ZONE ─────────────────────────────────────────────
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(26, 58, 92);
      doc.text('01. YOUR RESULT ZONE', margin, y);
      y += 5;

      // Zone card
      const zoneCardH = 28;
      // Background color based on zone
      let zR = 239, zG = 246, zB = 255; // blue default
      if (rawScore <= 60) { zR = 255; zG = 241; zB = 242; }
      else if (rawScore <= 90) { zR = 255; zG = 247; zB = 237; }
      else if (rawScore > 120) { zR = 240; zG = 253; zB = 244; }

      doc.setFillColor(zR, zG, zB);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, cw, zoneCardH, 2.5, 2.5, 'FD');

      // Zone emoji text
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(`${zone.emoji}  ${zone.name}`, margin + 5, y + 8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`Score Range: ${zone.range}  |  Your Score: ${rawScore}/${MAX_RAW_SCORE}  (${percentage}%)`, margin + 5, y + 14);

      const zoneDesc = doc.splitTextToSize(zone.description, cw - 10);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(60, 70, 90);
      doc.text(zoneDesc, margin + 5, y + 20);

      y += zoneCardH + 8;

      // ── SECTION 2: DOMAIN SCORE AUDIT ─────────────────────────────────────
      addPageIfNeeded(70);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(26, 58, 92);
      doc.text('02. DOMAIN SCORE AUDIT (5 PILLARS)', margin, y);
      y += 5;

      aggregatedAnswers.forEach((ans) => {
        addPageIfNeeded(14);
        const maxPts = CATEGORY_MAX[ans.category] ?? 30;
        const pct = maxPts > 0 ? ans.points / maxPts : 0;
        const statusLabel =
          pct >= 0.8 ? 'Excellent' : pct >= 0.6 ? 'Good' : pct >= 0.4 ? 'Moderate' : 'Needs Work';

        const rowH = 12;
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.roundedRect(margin, y, cw, rowH, 1.8, 1.8, 'FD');

        // Category name
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(15, 23, 42);
        const catLines = doc.splitTextToSize(ans.category, 72);
        doc.text(catLines, margin + 3, y + 5);

        // Bar
        const barX = margin + 78;
        const barW = 52;
        const barH = 3;
        const barY = y + 4;

        doc.setFillColor(226, 232, 240);
        doc.roundedRect(barX, barY, barW, barH, 1, 1, 'F');

        if (pct >= 0.7) doc.setFillColor(26, 58, 92);
        else if (pct >= 0.4) doc.setFillColor(184, 151, 74);
        else doc.setFillColor(225, 29, 72);
        const fillW = Math.max(2, barW * pct);
        doc.roundedRect(barX, barY, fillW, barH, 1, 1, 'F');

        // Score
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(15, 23, 42);
        doc.text(`${ans.points}/${maxPts}`, margin + 136, y + 6, { align: 'right' });

        // Status
        if (pct >= 0.7) doc.setTextColor(5, 150, 105);
        else if (pct >= 0.4) doc.setTextColor(184, 151, 74);
        else doc.setTextColor(225, 29, 72);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.text(statusLabel, rx - 3, y + 6, { align: 'right' });

        y += rowH + 2;
      });

      y += 4;

      // ── SECTION 3: DIAGNOSTIC & DIRECTIVES ────────────────────────────────
      addPageIfNeeded(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(26, 58, 92);
      doc.text("03. PRATIBHA'S DIAGNOSTIC & PRIORITY DIRECTIVES", margin, y);
      y += 4;

      // Dark box
      const darkBoxH = 72;
      addPageIfNeeded(darkBoxH + 4);
      doc.setFillColor(15, 23, 42);
      doc.setDrawColor(51, 65, 85);
      doc.setLineWidth(0.4);
      doc.roundedRect(margin, y, cw, darkBoxH, 2.5, 2.5, 'FD');

      // Gold accent bar
      doc.setFillColor(184, 151, 74);
      doc.roundedRect(margin + 4, y + 5, 1.2, 18, 0.6, 0.6, 'F');

      // Diagnostic title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(184, 151, 74);
      doc.text('EXECUTIVE DIAGNOSTIC ADVISORY', margin + 8, y + 8);

      // Diagnostic quote
      const quoteText = `"To advance from the ${zone.name} to peak career sustainability, systematically strengthen your ${mainGrowthArea.category}. High-impact professionals differentiate not by effort alone but through strategic positioning, AI fluency, and continuous reinvention."`;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(241, 245, 249);
      const splitQuote = doc.splitTextToSize(quoteText, cw - 14);
      doc.text(splitQuote, margin + 8, y + 14);

      // Two directives
      const dirW = (cw - 12) / 2;
      const dirH = 32;
      const dirY = y + 34;

      // Directive 1
      doc.setFillColor(30, 41, 59);
      doc.setDrawColor(51, 65, 85);
      doc.roundedRect(margin + 4, dirY, dirW, dirH, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(245, 158, 11);
      doc.text('PRIORITY 01: ACCELERATE AI READINESS', margin + 7, dirY + 6);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(226, 232, 240);
      const d1 = doc.splitTextToSize(`Build daily habits around AI tools. Use ChatGPT and automation to handle 20%+ of your routine tasks. AI fluency is now a core career survival skill.`, dirW - 6);
      doc.text(d1, margin + 7, dirY + 12);

      // Directive 2
      const dir2X = margin + 4 + dirW + 4;
      doc.setFillColor(30, 41, 59);
      doc.setDrawColor(51, 65, 85);
      doc.roundedRect(dir2X, dirY, dirW, dirH, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(245, 158, 11);
      doc.text('PRIORITY 02: BUILD PROFESSIONAL VISIBILITY', dir2X + 3.5, dirY + 6);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(226, 232, 240);
      const d2 = doc.splitTextToSize(`Optimize your LinkedIn profile, share your expertise publicly, and network intentionally. Visibility + AI readiness = unstoppable career sustainability.`, dirW - 6);
      doc.text(d2, dir2X + 3.5, dirY + 12);

      y += darkBoxH + 8;

      // ── PAGE 2: SELF-REFLECTION & NEXT STEPS ───────────────────────────────
      // Collect open-text and multi-checkbox answers
      const openAnswers = answers.filter(a => a.type === 'open-text');
      const checkboxAnswer = answers.find(a => a.type === 'multi-checkbox');
      const nextStepsAnswers = answers.filter(a => a.category === 'Next Steps' && a.type === 'single-choice');

      if (openAnswers.length > 0 || checkboxAnswer || nextStepsAnswers.length > 0) {
        addPageIfNeeded(20);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(26, 58, 92);
        doc.text('04. SELF-REFLECTION RESPONSES', margin, y);
        y += 6;

        openAnswers.forEach((ans, idx) => {
          addPageIfNeeded(30);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(26, 58, 92);
          const qLines = doc.splitTextToSize(`Q${idx + 1}. ${ans.text}`, cw);
          doc.text(qLines, margin, y);
          y += qLines.length * 4 + 1;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.setTextColor(60, 70, 90);
          const aLines = doc.splitTextToSize(String(ans.value), cw - 6);
          doc.text(aLines, margin + 3, y);
          y += aLines.length * 3.5 + 5;
        });

        if (checkboxAnswer) {
          addPageIfNeeded(20);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(26, 58, 92);
          doc.text('Support Areas Selected:', margin, y);
          y += 5;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.setTextColor(60, 70, 90);
          const areas = (checkboxAnswer.value as string[]).join('  ·  ');
          const areaLines = doc.splitTextToSize(areas, cw - 6);
          doc.text(areaLines, margin + 3, y);
          y += areaLines.length * 3.5 + 6;
        }

        if (nextStepsAnswers.length > 0) {
          addPageIfNeeded(20);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(26, 58, 92);
          doc.text('05. NEXT STEPS PREFERENCES', margin, y);
          y += 5;
          nextStepsAnswers.forEach((ans) => {
            addPageIfNeeded(10);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7);
            doc.setTextColor(60, 70, 90);
            const qLines = doc.splitTextToSize(`• ${ans.text}: ${ans.value}`, cw - 6);
            doc.text(qLines, margin + 3, y);
            y += qLines.length * 3.8 + 2;
          });
          y += 4;
        }
      }

      // ── FOOTER (last page) ─────────────────────────────────────────────────
      const footerY = pageH - 22;
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, footerY, rx, footerY);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(26, 58, 92);
      doc.text('[✓] AI SUSTAINABILITY CERTIFIED', margin, footerY + 6);
      doc.text('[✦] TESTED BY LEADERS & PROFESSIONALS', margin + 68, footerY + 6);
      doc.text('[★] 100% FREE REPORT', margin + 145, footerY + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.2);
      doc.setTextColor(100, 116, 139);
      doc.text('ISSUED BY PRATIBHA TIWARI STRATEGIC ADVISORY  •  ALL RIGHTS RESERVED', margin, footerY + 12);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.2);
      doc.setTextColor(184, 151, 74);
      doc.text('PRATIBHATIWARI.COM', rx, footerY + 12, { align: 'right' });

      const dateStr = new Date().toISOString().split('T')[0];
      doc.save(`AI_Career_Sustainability_Report_${dateStr}.pdf`);
    } catch (err: any) {
      console.error('PDF Generation Error:', err);
      alert('Unable to generate PDF report: ' + (err?.message || 'Please try again.'));
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // ─── RENDER ─────────────────────────────────────────────────────────────────
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

          {/* ── Splash Screen ── */}
          {step === -1 && (
            <motion.div
              key="splash"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-6 sm:space-y-10 py-6 sm:py-12 px-2"
            >
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-secondary/10 text-secondary rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                <Sparkles size={14} /> <span>Free AI Sustainability Test</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif text-primary leading-tight">
                Is Your Career Safe
                <br />
                <span className="italic text-secondary">in the AI Era?</span>
              </h1>

              {/* Sub-headline */}
              <p className="text-base sm:text-xl text-mist max-w-2xl mx-auto leading-relaxed">
                Discover how future-proof your career truly is. Take the AI Sustainability Test — a
                precision diagnostic trusted by Leaders, Professionals &amp; Entrepreneurs worldwide.
              </p>

              {/* Trust line */}
              <p className="inline-flex items-center gap-2 text-xs sm:text-sm text-secondary font-semibold uppercase tracking-widest">
                <Sparkles size={13} />
                Tested &amp; Trusted by Leaders, Professionals &amp; Entrepreneurs
                <Sparkles size={13} />
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 sm:pt-6 space-y-4">
                {/* Free Test */}
                <button
                  onClick={handleStart}
                  className="bg-primary text-white px-8 py-4 sm:px-12 sm:py-6 rounded-full font-bold text-base sm:text-lg shadow-2xl hover:bg-secondary hover:scale-105 transition-all flex items-center mx-auto cursor-pointer"
                >
                  Take the Free Test <ArrowRight className="ml-2 sm:ml-3" size={18} />
                </button>
                <p className="text-xs sm:text-sm text-mist font-mono">ESTIMATED TIME: 5 MINUTES &nbsp;·&nbsp; 100% FREE &nbsp;·&nbsp; 42 QUESTIONS</p>

                {/* Divider */}
                <div className="flex items-center gap-4 max-w-xs mx-auto pt-2">
                  <div className="flex-1 h-px bg-primary/10" />
                  <span className="text-[10px] font-mono text-mist uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-primary/10" />
                </div>

                {/* Premium — navigates to dedicated page */}
                <div className="relative inline-block">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold to-amber-400 text-slate-900 text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md whitespace-nowrap">
                    ✦ Premium Access
                  </span>
                  <button
                    onClick={() => navigate('/assessment/premium')}
                    className="mt-2 bg-gradient-to-r from-gold via-amber-400 to-gold text-slate-900 px-8 py-4 sm:px-12 sm:py-5 rounded-full font-bold text-base sm:text-lg shadow-xl hover:shadow-gold/30 hover:scale-105 transition-all flex items-center mx-auto cursor-pointer border-2 border-amber-300"
                  >
                    <Sparkles className="mr-2 sm:mr-3" size={18} />
                    Explore Premium Options
                  </button>
                </div>
                <p className="text-[10px] sm:text-xs text-mist font-mono">PERSONALIZED AI CAREER REPORT &nbsp;·&nbsp; DELIVERED TO WHATSAPP & EMAIL</p>
              </div>
            </motion.div>
          )}

          {/* ── Question Screen ── */}
          {step >= 0 && !isFinished && currentQ && (
            <motion.div
              key={`question-${step}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
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
                {/* Section banner (first Q of each section) */}
                {isFirstOfSection(step) && (
                  <div className="mb-5 px-3 py-2 bg-primary/5 rounded-xl border border-primary/10 inline-block">
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-primary uppercase tracking-widest">
                      {currentQ.sectionTitle}
                    </span>
                  </div>
                )}

                {/* Header row */}
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
                    {currentQ.displayIndex}<span className="text-xs align-top pt-1">/{TOTAL_QUESTIONS}</span>
                  </div>
                </div>

                {/* Question text */}
                <h2 className="text-lg sm:text-2xl md:text-3xl font-serif text-primary mb-2 sm:mb-4 leading-snug sm:leading-tight">
                  {currentQ.text}
                </h2>

                {/* Reverse-score note */}
                {currentQ.reverseScore && (
                  <p className="text-xs text-rose-500 font-mono mb-6 sm:mb-8">
                    ⚠ Note: A lower score here is better (reverse-scored question)
                  </p>
                )}

                {/* ── SHORT ANSWER ── */}
                {currentQ.type === 'short-answer' && (
                  <div className="space-y-4 mt-4">
                    <input
                      type={currentQ.text.toLowerCase().includes('email') ? 'email' : currentQ.text.toLowerCase().includes('mobile') ? 'tel' : 'text'}
                      className="w-full p-4 rounded-2xl border-2 border-primary/10 bg-white/60 text-primary placeholder:text-mist/50 focus:outline-none focus:border-secondary transition-colors text-base"
                      placeholder={`Enter your ${currentQ.text.toLowerCase()}…`}
                      value={textDraft}
                      onChange={e => setTextDraft(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleShortAnswerNext(); }}
                    />
                    <button
                      onClick={handleShortAnswerNext}
                      disabled={!textDraft.trim()}
                      className="bg-primary text-white px-10 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-secondary transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
                    >
                      Continue <ArrowRight size={18} />
                    </button>
                  </div>
                )}

                {/* ── RATING ── */}
                {currentQ.type === 'rating' && (
                  <div className="space-y-4 mt-6">
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
                    <div className="flex justify-between text-[9px] sm:text-[10px] font-mono text-mist px-1">
                      <span>1 = Strongly Disagree</span>
                      <span>5 = Strongly Agree</span>
                    </div>
                  </div>
                )}

                {/* ── SINGLE CHOICE ── */}
                {currentQ.type === 'single-choice' && currentQ.options && (
                  <div className={`grid gap-3 mt-4 ${currentQ.options.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
                    {currentQ.options.map(option => (
                      <button
                        key={option}
                        onClick={() => handleSingleChoice(option)}
                        className={`px-6 py-4 rounded-2xl border-2 bg-white/60 text-primary font-semibold text-sm md:text-base transition-all duration-250 hover:scale-[1.03] hover:shadow-lg active:scale-95 cursor-pointer ${getChoiceStyle(option)}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {/* ── OPEN TEXT ── */}
                {currentQ.type === 'open-text' && (
                  <div className="space-y-4 mt-4">
                    <textarea
                      className="w-full min-h-[160px] p-5 rounded-2xl border-2 border-primary/10 bg-white/60 text-primary placeholder:text-mist/50 focus:outline-none focus:border-secondary transition-colors resize-none text-base leading-relaxed"
                      placeholder="Share your thoughts here…"
                      value={textDraft}
                      onChange={e => setTextDraft(e.target.value)}
                    />
                    <button
                      onClick={handleOpenTextNext}
                      disabled={!textDraft.trim()}
                      className="bg-primary text-white px-10 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-secondary transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
                    >
                      Continue <ArrowRight size={18} />
                    </button>
                  </div>
                )}

                {/* ── MULTI-CHECKBOX ── */}
                {currentQ.type === 'multi-checkbox' && currentQ.options && (
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {currentQ.options.map(option => {
                        const checked = checkboxDraft.includes(option);
                        return (
                          <button
                            key={option}
                            onClick={() => toggleCheckbox(option)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-sm font-semibold text-left transition-all duration-200 cursor-pointer active:scale-95 ${
                              checked
                                ? 'border-secondary bg-secondary/10 text-secondary shadow-md'
                                : 'border-primary/10 bg-white/60 text-primary hover:border-secondary/40 hover:bg-secondary/5'
                            }`}
                          >
                            {checked
                              ? <CheckSquare size={18} className="text-secondary shrink-0" />
                              : <Square size={18} className="text-mist/50 shrink-0" />
                            }
                            {option}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={handleCheckboxNext}
                      disabled={checkboxDraft.length === 0}
                      className="bg-primary text-white px-10 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-secondary transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
                    >
                      Continue ({checkboxDraft.length} selected) <ArrowRight size={18} />
                    </button>
                  </div>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center mt-10 pt-6 border-t border-primary/5">
                  <button
                    onClick={handleBack}
                    className="text-sm font-medium text-mist hover:text-primary flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <span className="text-xs font-mono text-mist">
                    Q{currentQ.displayIndex} of {TOTAL_QUESTIONS} &nbsp;·&nbsp; {progress}% complete
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Results Screen ── */}
          {isFinished && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-12"
            >
              <AssessmentResultsSummary
                answers={aggregatedAnswers}
                rawScore={rawScore}
                percentage={percentage}
                level={level}
                onDownload={downloadReport}
                onRetake={handleStart}
                onStartPremium={() => navigate('/assessment/premium')}
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
