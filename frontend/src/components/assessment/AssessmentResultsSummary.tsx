import React from 'react';
import { motion } from 'motion/react';
import {
  Target,
  Zap,
  TrendingUp,
  Award,
  CheckCircle2,
  Users,
  Eye,
  Rocket,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
} from 'lucide-react';

// ==========================================
// 1. ASSESSMENT CONFIGURATION & DATA MODEL
// ==========================================

export type QuestionType = 'rating' | 'open-text' | 'single-choice' | 'short-answer' | 'multi-checkbox';

export interface AssessmentQuestion {
  text: string;
  reverseScore?: boolean;
}

export interface AssessmentSection {
  sectionNumber: number;
  sectionTitle: string;
  category: string;
  description?: string;
  type: QuestionType;
  options?: string[];
  questions: AssessmentQuestion[];
}

export const assessmentConfig: AssessmentSection[] = [
  // SECTION 1 — BASIC INFORMATION
  {
    sectionNumber: 1,
    sectionTitle: 'SECTION 1 — BASIC INFORMATION',
    category: 'Basic Information',
    description: 'Tell us about yourself',
    type: 'short-answer',
    questions: [
      { text: 'Full Name' },
      { text: 'Email Address' },
      { text: 'Mobile Number' },
      { text: 'Current Profession / Industry' },
    ],
  },
  {
    sectionNumber: 1,
    sectionTitle: 'SECTION 1 — BASIC INFORMATION',
    category: 'Basic Information',
    description: 'Select your experience range',
    type: 'single-choice',
    options: ['0–2 years', '3–5 years', '6–10 years', '11–15 years', '16+ years'],
    questions: [{ text: 'Years of Professional Experience' }],
  },
  {
    sectionNumber: 1,
    sectionTitle: 'SECTION 1 — BASIC INFORMATION',
    category: 'Basic Information',
    description: 'Select your current level',
    type: 'single-choice',
    options: [
      'Student',
      'Entry-Level Professional',
      'Mid-Level Professional',
      'Manager / Team Lead',
      'Senior Leader / Executive',
      'Entrepreneur / Consultant',
    ],
    questions: [{ text: 'Current Career Level' }],
  },

  // SECTION 2 — CAREER STABILITY & FUTURE READINESS
  {
    sectionNumber: 2,
    sectionTitle: 'SECTION 2 — CAREER STABILITY & FUTURE READINESS',
    category: 'Career Stability & Future Readiness',
    description: 'Rate 1–5: Strongly Disagree → Strongly Agree',
    type: 'rating',
    questions: [
      { text: 'I believe my current profession will remain relevant in the next 5 years.' },
      { text: 'I clearly understand how AI is impacting my industry.' },
      { text: 'I regularly upgrade my professional skills.' },
      { text: 'I feel confident adapting to workplace changes and uncertainty.' },
      { text: 'I have a clear direction for my career growth.' },
      { text: 'My current skills are aligned with future market demands.' },
      { text: 'I understand which skills may become obsolete in my profession.' },
      { text: 'I actively learn new technologies or tools relevant to my work.' },
    ],
  },

  // SECTION 3 — AI READINESS
  {
    sectionNumber: 3,
    sectionTitle: 'SECTION 3 — AI READINESS',
    category: 'AI Readiness',
    description: 'Rate 1–5: Strongly Disagree → Strongly Agree',
    type: 'rating',
    questions: [
      { text: 'I use AI tools (such as ChatGPT or automation tools) in my work or learning.' },
      { text: 'I understand how AI can improve my productivity and efficiency.' },
      { text: 'I feel comfortable learning and using new digital tools.' },
      { text: 'I understand the difference between human skills and AI-driven tasks.' },
      { text: 'I believe AI can enhance my professional growth if used correctly.' },
      { text: 'I know which AI-related skills are valuable for my profession.' },
    ],
  },

  // SECTION 4 — PROFESSIONAL VISIBILITY & POSITIONING
  {
    sectionNumber: 4,
    sectionTitle: 'SECTION 4 — PROFESSIONAL VISIBILITY & POSITIONING',
    category: 'Professional Visibility & Positioning',
    description: 'Rate 1–5: Strongly Disagree → Strongly Agree',
    type: 'rating',
    questions: [
      { text: 'My LinkedIn profile professionally represents my expertise and strengths.' },
      { text: 'I actively build and maintain my professional network.' },
      { text: 'I know how to position myself professionally in a competitive market.' },
      { text: 'I communicate my strengths and achievements confidently.' },
      { text: 'I am professionally visible enough to attract opportunities.' },
      { text: 'My resume/CV reflects my real value, strengths, and achievements.' },
    ],
  },

  // SECTION 5 — HUMAN SKILLS & LEADERSHIP
  {
    sectionNumber: 5,
    sectionTitle: 'SECTION 5 — HUMAN SKILLS & LEADERSHIP',
    category: 'Human Skills & Leadership',
    description: 'Rate 1–5: Strongly Disagree → Strongly Agree',
    type: 'rating',
    questions: [
      { text: 'My communication skills are one of my professional strengths.' },
      { text: 'I can confidently present ideas and express myself professionally.' },
      { text: 'I handle workplace pressure and uncertainty effectively.' },
      { text: 'I have strong problem-solving and critical-thinking abilities.' },
      { text: 'I build trust and relationships effectively with others.' },
      { text: 'I believe human skills will become more valuable in the AI era.' },
    ],
  },

  // SECTION 6 — CAREER CONFIDENCE & GROWTH
  {
    sectionNumber: 6,
    sectionTitle: 'SECTION 6 — CAREER CONFIDENCE & GROWTH',
    category: 'Career Confidence & Growth',
    description: 'Rate 1–5: Strongly Disagree → Strongly Agree',
    type: 'rating',
    questions: [
      { text: 'I feel professionally confident about my future.' },
      { text: 'I often feel stuck or uncertain about my next career step.', reverseScore: true },
      { text: 'I know what actions I should take to stay future-ready professionally.' },
      { text: 'I am willing to continuously reinvent and evolve professionally.' },
    ],
  },

  // SECTION 7 — SELF-REFLECTION
  {
    sectionNumber: 7,
    sectionTitle: 'SECTION 7 — SELF-REFLECTION',
    category: 'Self-Reflection',
    description: 'Share your thoughts openly',
    type: 'open-text',
    questions: [
      { text: 'What is your biggest professional concern in the AI era?' },
      { text: 'What is your biggest professional goal for the next 2 years?' },
    ],
  },
  {
    sectionNumber: 7,
    sectionTitle: 'SECTION 7 — SELF-REFLECTION',
    category: 'Self-Reflection',
    description: 'Select all that apply',
    type: 'multi-checkbox',
    options: [
      'Career Clarity',
      'Future-Ready Skills',
      'AI Tools',
      'LinkedIn Optimization',
      'Resume/CV Improvement',
      'Interview Preparation',
      'Confidence Building',
      'Personal Branding',
      'Leadership Growth',
      'Networking',
      'Career Transition',
      'Salary Growth',
    ],
    questions: [{ text: 'Which area would you most like support with right now?' }],
  },

  // SECTION 8 — NEXT STEPS
  {
    sectionNumber: 8,
    sectionTitle: 'SECTION 8 — NEXT STEPS',
    category: 'Next Steps',
    description: 'Your preferences for ongoing support',
    type: 'single-choice',
    options: ['Yes', 'Maybe', 'Not Right Now'],
    questions: [
      { text: 'Would you like a personalized roadmap to become more future-ready professionally?' },
    ],
  },
  {
    sectionNumber: 8,
    sectionTitle: 'SECTION 8 — NEXT STEPS',
    category: 'Next Steps',
    description: 'Your preferences for ongoing support',
    type: 'single-choice',
    options: ['Yes', 'Maybe', 'No'],
    questions: [
      { text: 'Would you be interested in joining a professional growth community focused on career sustainability in the AI era?' },
    ],
  },
  {
    sectionNumber: 8,
    sectionTitle: 'SECTION 8 — NEXT STEPS',
    category: 'Next Steps',
    description: 'Your preferences for ongoing support',
    type: 'single-choice',
    options: ['Yes', 'No'],
    questions: [
      { text: 'Would you like to receive invitations to future workshops, networking events, and AI career growth programs?' },
    ],
  },
];

// ==========================================
// 2. SCORING HELPERS
// ==========================================

export const RATING_CATEGORIES = [
  'Career Stability & Future Readiness',
  'AI Readiness',
  'Professional Visibility & Positioning',
  'Human Skills & Leadership',
  'Career Confidence & Growth',
];

export const MAX_RAW_SCORE = 150; // 30 rating questions x 5

export const CATEGORY_MAX: Record<string, number> = {
  'Career Stability & Future Readiness': 40,
  'AI Readiness': 30,
  'Professional Visibility & Positioning': 30,
  'Human Skills & Leadership': 30,
  'Career Confidence & Growth': 20,
};

export type ResultZone = {
  name: string;
  range: string;
  color: string;
  bg: string;
  description: string;
  emoji: string;
};

export const getResultZone = (rawScore: number): ResultZone => {
  if (rawScore <= 60) return {
    name: 'Career Risk Zone',
    range: '30–60',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    description: 'Your career sustainability needs immediate attention. Now is the best time to take intentional steps toward future-readiness.',
    emoji: '🔴',
  };
  if (rawScore <= 90) return {
    name: 'Transition & Growth Zone',
    range: '61–90',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    description: 'You are in transition. You have some foundation but need focused growth in key areas to stay ahead in the AI era.',
    emoji: '🟡',
  };
  if (rawScore <= 120) return {
    name: 'Emerging Future-Ready Professional',
    range: '91–120',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    description: 'You are on the right path. Keep building your AI readiness and professional visibility to reach the top tier.',
    emoji: '🔵',
  };
  return {
    name: 'AI-Ready Sustainable Professional',
    range: '121–150',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    description: 'Excellent! You are highly future-ready and AI-sustainable. Continue leading and inspiring others around you.',
    emoji: '🟢',
  };
};

// ==========================================
// 3. RESULTS SUMMARY COMPONENT
// ==========================================

interface AssessmentAnswer {
  text: string;
  points: number;
  category: string;
}

interface ResultsProps {
  answers: AssessmentAnswer[];
  rawScore: number;
  percentage: number;
  level: { name: string; color: string; bg: string };
  onDownload: () => void;
  onRetake: () => void;
  onHome: () => void;
  onStartPremium?: (pkg?: { id: 'report' | 'platinum'; price: string; title: string; priceNum: number }) => void;
  isGeneratingPdf: boolean;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Career Stability & Future Readiness': <Rocket className="w-5 h-5" />,
  'AI Readiness': <Zap className="w-5 h-5" />,
  'Professional Visibility & Positioning': <Eye className="w-5 h-5" />,
  'Human Skills & Leadership': <Users className="w-5 h-5" />,
  'Career Confidence & Growth': <TrendingUp className="w-5 h-5" />,
};

const getRecommendation = (category: string) => {
  switch (category) {
    case 'Career Stability & Future Readiness':
      return 'Audit your current skill set against emerging market trends. Focus on continuous learning to ensure your expertise remains indispensable in the next 5 years.';
    case 'AI Readiness':
      return 'Start using AI tools like ChatGPT daily in your work. Build intuition by experimenting — AI adoption is the single biggest career differentiator right now.';
    case 'Professional Visibility & Positioning':
      return 'Update your LinkedIn profile and start sharing your expertise online. Visibility is currency in the AI era. Be seen, be heard, be found.';
    case 'Human Skills & Leadership':
      return 'Double down on communication, empathy, and problem-solving. These uniquely human traits are your greatest differentiator in an AI-driven era.';
    case 'Career Confidence & Growth':
      return 'Define a clear, future-ready roadmap. Break down your career direction into actionable steps and embrace continuous reinvention to overcome uncertainty.';
    default:
      return 'Focus on intentional growth and surround yourself with mentors who can fast-track your professional evolution.';
  }
};

export default function AssessmentResultsSummary({
  answers,
  rawScore,
  percentage,
  level,
  onDownload,
  onRetake,
  onHome,
  onStartPremium,
  isGeneratingPdf,
}: ResultsProps) {
  const [selectedPkg, setSelectedPkg] = React.useState<'report' | 'platinum'>('report');
  const zone = getResultZone(rawScore);
  const sortedAnswers = [...answers].sort((a, b) => b.points - a.points);
  const topStrength = sortedAnswers[0];
  const mainGrowthArea = sortedAnswers[sortedAnswers.length - 1];

  const handleStartSelectedPkg = (pkgId: 'report' | 'platinum') => {
    if (!onStartPremium) return;
    if (pkgId === 'report') {
      onStartPremium({ id: 'report', title: 'Premium AI Career Intelligence Report', price: '$68.00', priceNum: 68 });
    } else {
      onStartPremium({ id: 'platinum', title: 'Platinum Package: Premium Report + 45-Min Live Coaching (ICF-PCC)', price: '$98.00', priceNum: 98 });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-12">

      {/* Hero Score Card */}
      <div className="bg-primary rounded-3xl sm:rounded-[56px] p-6 sm:p-12 md:p-20 text-white text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/20 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/10 blur-[100px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold uppercase tracking-widest mb-6">
          <span>{zone.emoji}</span>
          <span>{zone.name}</span>
        </div>

        <h2 className="text-base sm:text-xl font-serif italic text-secondary mb-4 sm:mb-6">AI Career Sustainability Score</h2>

        <div className="text-6xl sm:text-8xl md:text-9xl font-serif mb-2 leading-none">
          {rawScore}<span className="text-xl sm:text-3xl ml-1 font-mono opacity-60">/{MAX_RAW_SCORE}</span>
        </div>
        <div className="text-sm font-mono text-white/50 mb-6">{percentage}% of maximum score</div>

        <div className="inline-block px-5 py-2 sm:px-8 sm:py-3 rounded-full text-xs sm:text-base font-bold mb-4 bg-white/15 text-white border border-white/30">
          {zone.range} &nbsp;·&nbsp; {zone.name}
        </div>

        <p className="text-white/80 max-w-xl mx-auto leading-relaxed text-sm sm:text-base italic mb-8 sm:mb-12">
          "{zone.description}"
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center relative z-10">
          <button
            onClick={onDownload}
            disabled={isGeneratingPdf}
            className="w-full sm:w-auto bg-white text-primary px-6 py-4 sm:px-10 sm:py-5 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center hover:bg-secondary hover:text-white transition-all shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isGeneratingPdf ? 'Generating PDF...' : 'Download Free PDF Report'}
          </button>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={onRetake}
              className="w-full sm:w-auto bg-white/10 text-white border border-white/20 px-6 py-4 sm:px-8 sm:py-5 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center hover:bg-white/20 transition-all active:scale-95 cursor-pointer"
            >
              Retake Test
            </button>
            <button
              onClick={onHome}
              className="w-full sm:w-auto bg-secondary text-white px-6 py-4 sm:px-8 sm:py-5 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center hover:bg-white hover:text-primary transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              Complete & Exit
            </button>
          </div>
        </div>
      </div>

      {/* Score Band Legend */}
      <div className="bg-white rounded-2xl sm:rounded-[32px] p-5 sm:p-8 border border-gray-100 shadow-xs">
        <h3 className="text-xs font-mono text-mist uppercase tracking-widest font-black mb-5">Result Zone Guide</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { range: '30–60', name: 'Career Risk Zone', emoji: '🔴', active: rawScore <= 60 },
            { range: '61–90', name: 'Transition & Growth Zone', emoji: '🟡', active: rawScore > 60 && rawScore <= 90 },
            { range: '91–120', name: 'Emerging Future-Ready', emoji: '🔵', active: rawScore > 90 && rawScore <= 120 },
            { range: '121–150', name: 'AI-Ready Sustainable Pro', emoji: '🟢', active: rawScore > 120 },
          ].map((band) => (
            <div
              key={band.range}
              className={`p-4 rounded-2xl border-2 transition-all ${
                band.active
                  ? 'border-secondary bg-secondary/5 shadow-md'
                  : 'border-gray-100 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{band.emoji}</span>
                <span className="text-xs font-mono font-bold text-mist">{band.range}</span>
                {band.active && (
                  <span className="ml-auto text-[9px] font-mono text-secondary font-bold uppercase bg-secondary/10 px-2 py-0.5 rounded-full">You Are Here</span>
                )}
              </div>
              <div className="text-sm font-semibold text-primary">{band.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Upgrade */}
      {onStartPremium && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-br from-slate-900 via-primary to-slate-950 rounded-3xl sm:rounded-[44px] p-6 sm:p-12 text-white border-2 border-gold/40 shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gold/20 text-gold rounded-full text-xs font-mono font-bold uppercase tracking-widest border border-gold/30">
                <Sparkles size={14} /> Unlock Your Full Career Report
              </div>
              <h3 className="text-2xl sm:text-4xl font-serif leading-tight">
                Get a Personalized <span className="italic text-gold">AI Career Roadmap</span>
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Complete our discovery questionnaire (upload your resume & career vision) to receive an exhaustive, world-class strategy report delivered to your WhatsApp and email.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* $68 Option */}
              <div
                onClick={() => setSelectedPkg('report')}
                className={`relative bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPkg === 'report'
                    ? 'border-gold shadow-xl shadow-gold/10 bg-white/10 scale-[1.01]'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-mono text-gold uppercase tracking-widest font-bold">Standard Blueprint</span>
                      <h4 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">Premium Report Only</h4>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl sm:text-4xl font-serif text-gold font-bold">$68</div>
                      <div className="text-[10px] font-mono text-slate-400">One-time Investment</div>
                    </div>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                    Bespoke AI Career Intelligence Report crafted from your discovery questionnaire, resume audit, and market position analysis.
                  </p>
                  <ul className="space-y-3 text-xs text-slate-200 mb-6">
                    {['Exhaustive AI Career Intelligence Report (PDF)', 'Deep Resume & Positioning Gap Audit', 'Reviewed & Calibrated by Human Strategists', 'Direct WhatsApp & Email PDF Delivery'].map(item => (
                      <li key={item} className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-gold shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleStartSelectedPkg('report'); }}
                  className={`w-full py-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
                    selectedPkg === 'report'
                      ? 'bg-gradient-to-r from-gold via-amber-400 to-gold text-slate-950 shadow-lg shadow-gold/20'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  Start $68 Questionnaire <ArrowRight size={16} />
                </button>
              </div>

              {/* $98 Option */}
              <div
                onClick={() => setSelectedPkg('platinum')}
                className={`relative bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPkg === 'platinum'
                    ? 'border-gold shadow-2xl shadow-gold/20 bg-white/15 scale-[1.01]'
                    : 'border-white/10 hover:border-gold/50'
                }`}
              >
                <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-gold to-amber-300 text-slate-950 px-3.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shadow-md">
                  Most Popular • Platinum
                </div>
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-mono text-gold uppercase tracking-widest font-bold">Platinum Advisory</span>
                      <h4 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">Report + Live Coaching</h4>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl sm:text-4xl font-serif text-gold font-bold">$98</div>
                      <div className="text-[10px] font-mono text-slate-400">Total Value $350+</div>
                    </div>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                    Full AI Intelligence Report PLUS a <strong>Live 45-Minute 1-on-1 Strategy & Coaching Session</strong> with ICF-PCC Coach Pratibha Tiwari.
                  </p>
                  <ul className="space-y-3 text-xs text-slate-200 mb-6">
                    {[
                      'Everything in the $68 Premium Report',
                      'Live 45-Min 1-on-1 Coaching with Pratibha Tiwari (ICF-PCC)',
                      'Personalized Executive Influence & Growth Roadmapping',
                      'Direct WhatsApp Calendar Booking & VIP Delivery',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-gold shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleStartSelectedPkg('platinum'); }}
                  className={`w-full py-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
                    selectedPkg === 'platinum'
                      ? 'bg-gradient-to-r from-gold via-amber-400 to-gold text-slate-950 shadow-xl shadow-gold/25 font-bold'
                      : 'bg-white/10 hover:bg-gold hover:text-slate-950 text-white'
                  }`}
                >
                  Start $98 Platinum Questionnaire <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-slate-400 pt-2 border-t border-white/10">
              <div className="flex items-center gap-1.5"><Clock size={14} className="text-gold" /> Step 1: Take Questionnaire</div>
              <div className="flex items-center gap-1.5"><Sparkles size={14} className="text-gold" /> Step 2: Scan QR & Upload Screenshot/UTR</div>
              <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-gold" /> Step 3: Direct WhatsApp Delivery</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Strength & Growth Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[40px] border border-gray-100 shadow-xs">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 text-green-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
            <CheckCircle2 size={20} />
          </div>
          <h3 className="text-[10px] sm:text-xs font-mono text-mist uppercase mb-1 sm:mb-2 tracking-widest font-black">Primary Strength</h3>
          <div className="text-xl sm:text-2xl font-serif text-primary mb-2">{topStrength?.category}</div>
          <p className="text-mist text-xs sm:text-sm leading-relaxed">
            You excel here. Double down on this to become the go-to expert in your field.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[40px] border border-gray-100 shadow-xs">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-500/10 text-rose-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
            <Target size={20} />
          </div>
          <h3 className="text-[10px] sm:text-xs font-mono text-mist uppercase mb-1 sm:mb-2 tracking-widest font-black">Priority Growth Area</h3>
          <div className="text-xl sm:text-2xl font-serif text-primary mb-2">{mainGrowthArea?.category}</div>
          <p className="text-mist text-xs sm:text-sm leading-relaxed">
            Focusing here will give you the highest ROI for career sustainability this year.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-secondary text-white p-5 sm:p-8 rounded-2xl sm:rounded-[40px] shadow-xl col-span-1 md:col-span-2 lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
              <Zap size={20} />
            </div>
            <h3 className="text-[10px] sm:text-xs font-mono text-white uppercase mb-1 sm:mb-2 tracking-widest">Pratibha's Advice</h3>
            <p className="text-base sm:text-xl font-serif italic leading-relaxed">
              "{getRecommendation(mainGrowthArea?.category)}"
            </p>
          </div>
          <div className="mt-6 sm:mt-8 text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-white/70">Precision Coaching Insight</div>
        </motion.div>
      </div>

      {/* Domain Score Audit */}
      <div className="bg-white rounded-2xl sm:rounded-[40px] p-5 sm:p-10 border border-gray-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 sm:mb-10">
          <h3 className="text-xl sm:text-2xl font-serif text-primary">Domain Score Audit</h3>
          <div className="text-[10px] sm:text-xs font-mono text-mist uppercase tracking-widest font-black">5 Core Pillars · Max {MAX_RAW_SCORE} pts total</div>
        </div>
        <div className="grid gap-4 sm:gap-5">
          {answers.map((ans, i) => {
            const maxPts = CATEGORY_MAX[ans.category] ?? 30;
            const pct = Math.round((ans.points / maxPts) * 100);
            return (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 hover:bg-pearl/30 rounded-2xl transition-colors group border border-gray-50 sm:border-transparent">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-50 text-mist group-hover:bg-white group-hover:text-secondary transition-all flex items-center justify-center border border-gray-100 shrink-0">
                    {CATEGORY_ICONS[ans.category] || <Award className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <span className="font-medium text-xs sm:text-base text-primary truncate">{ans.category}</span>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
                  <div className="flex-grow sm:flex-grow-0 w-full sm:w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.08 }}
                      className={`h-full ${pct >= 70 ? 'bg-secondary' : pct >= 40 ? 'bg-amber-400' : 'bg-rose-400'}`}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-mist shrink-0">{ans.points}/{maxPts}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}