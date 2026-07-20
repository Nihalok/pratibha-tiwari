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
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { safeLocalStorage } from '../lib/storage-helper';
import AssessmentResultsSummary, { assessmentConfig } from '../components/assessment/AssessmentResultsSummary';
import assessmentBg from '../assets/images/assessment.jpg';

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
  const reportRef = useRef<HTMLDivElement>(null);

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

  // ── PDF download ───────────────────────────────────────────────────────
  const downloadReport = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#F8FAFC',
        windowWidth: 1200,
        onclone: (clonedDoc) => {
          const wrapper = clonedDoc.querySelector('[data-pdf-wrapper]') as HTMLElement;
          if (wrapper) {
            wrapper.style.position = 'relative';
            wrapper.style.top = '0';
            wrapper.style.left = '0';
            wrapper.style.opacity = '1';
            wrapper.style.visibility = 'visible';
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      while (heightLeft > 5) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      const dateStr = new Date().toISOString().split('T')[0];
      pdf.save(`Career_Performance_Report_${dateStr}.pdf`);
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

          {/* ── Results screen ── */}
          {isFinished && (
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
                onHome={() => {
                  safeLocalStorage.removeItem('career_assessment_step');
                  safeLocalStorage.removeItem('career_assessment_answers');
                  safeLocalStorage.removeItem('career_assessment_finished');
                  navigate('/');
                }}
                isGeneratingPdf={isGeneratingPdf}
              />

              {/* Hidden Report for PDF Capture */}
              <div data-pdf-wrapper="true" className="fixed top-[-9999px] left-[-9999px] pointer-events-none opacity-100 z-0">
                <div ref={reportRef} className="p-16 bg-[#F8FAFC] w-[1000px] font-sans text-primary">
                  <div className="flex justify-between items-start border-b-2 border-gold/20 pb-10 mb-16">
                    <div>
                      <h1 className="text-4xl font-serif mb-2">Pratibha Tiwari</h1>
                      <p className="text-secondary font-mono tracking-[0.3em] uppercase text-xs">Strategic Performance Report</p>
                    </div>
                    <div className="text-right">
                      <div className="text-6xl font-serif text-secondary">{percentage}%</div>
                      <div className="text-[10px] font-mono text-mist uppercase tracking-widest">Global Index</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-16 mb-20">
                    <div className="space-y-8">
                      <h2 className="text-2xl font-serif border-l-4 border-secondary pl-6">Profile Snapshot</h2>
                      <div className="space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100">
                          <div className="text-xs font-mono text-mist uppercase mb-2">Classification</div>
                          <div className="text-2xl font-serif font-bold text-primary">{level.name}</div>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-gray-100">
                          <div className="text-xs font-mono text-mist uppercase mb-2">Top Strength</div>
                          <div className="text-2xl font-serif font-bold text-secondary">{topStrength.category}</div>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-gray-100">
                          <div className="text-xs font-mono text-mist uppercase mb-2">Growth Opportunity</div>
                          <div className="text-2xl font-serif font-bold text-rose-500">{mainGrowthArea.category}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <h2 className="text-2xl font-serif border-l-4 border-secondary pl-6">Domain Scores</h2>
                      <div className="space-y-4">
                        {aggregatedAnswers.map((ans, i) => (
                          <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-sm font-medium">{ans.category}</span>
                            <div className="flex items-center space-x-4">
                              <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${(ans.points / 50) * 100}%` }} />
                              </div>
                              <span className="text-xs font-mono text-mist">{ans.points}/50</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary p-12 rounded-[40px] text-white mb-20">
                    <h2 className="text-3xl font-serif mb-8 italic">Pratibha's Strategic Observation</h2>
                    <p className="text-xl leading-relaxed text-white italic mb-10">
                      {`"To transition from ${level.name} to the next tier of executive influence, you must optimize your ${mainGrowthArea.category.toLowerCase()} architecture. High-impact leaders differ from high-performing managers not by effort, but by the precision of their influence."`}
                    </p>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
                        <h4 className="font-bold text-secondary mb-2 flex items-center"><Target size={16} className="mr-2" /> Priority 1</h4>
                        <p className="text-sm">Automate at least 20% of your cognitive load using AI-driven agents or frameworks to free space for high-value strategic execution.</p>
                      </div>
                      <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
                        <h4 className="font-bold text-secondary mb-2 flex items-center"><Zap size={16} className="mr-2" /> Priority 2</h4>
                        <p className="text-sm">Establish a continuous feedback mechanism to refine and measure your leadership brand footprint.</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center border-t border-gray-100 pt-16">
                    <p className="text-mist text-xs font-mono tracking-widest mb-10 uppercase">Private & Confidential Performance Data</p>
                    <div className="flex justify-center space-x-20 grayscale">
                      <div className="flex items-center text-xs font-bold uppercase"><Award size={14} className="mr-2" /> Executive Certified</div>
                      <div className="flex items-center text-xs font-bold uppercase"><CheckCircle2 size={14} className="mr-2" /> AI Integrated</div>
                      <div className="flex items-center text-xs font-bold uppercase"><TrendingUp size={14} className="mr-2" /> Performance Audited</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
}
