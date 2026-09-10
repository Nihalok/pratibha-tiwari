import React from 'react';
import { motion } from 'motion/react';
import {
  Target,
  Zap,
  TrendingUp,
  Award,
  CheckCircle2,
  Brain,
  MessageSquare,
  Users,
  Eye,
  Rocket,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  Clock
} from 'lucide-react';

// ==========================================
// 1. ASSESSMENT CONFIGURATION & DATA MODEL
// ==========================================

export type QuestionType = 'rating' | 'open-text' | 'single-choice';

export interface AssessmentSection {
  category: string;
  description?: string;
  type: QuestionType;
  options?: string[];
  questions: string[];
}

export const assessmentConfig: AssessmentSection[] = [
  {
    category: "Career Stability & Future Readiness",
    description: "(All rated 1–5, Strongly Disagree → Strongly Agree)",
    type: "rating",
    questions: [
      "I believe my current profession will remain relevant in the next 5 years*",
      "My current skills are aligned with future market demands*"
    ]
  },
  {
    category: "AI Readiness",
    description: "(All rated 1–5, Strongly Disagree → Strongly Agree)",
    type: "rating",
    questions: [
      "I use AI tools such as ChatGPT or automation tools in my work or learning*",
      "I understand how AI can improve my productivity and efficiency*"
    ]
  },
  {
    category: "Professional Visibility & Positioning",
    description: "(All rated 1–5, Strongly Disagree → Strongly Agree)",
    type: "rating",
    questions: [
      "My LinkedIn profile professionally represents my expertise and strengths*",
      "I know how to position myself professionally in a competitive market*"
    ]
  },
  {
    category: "Human Skills & Leadership",
    description: "(All rated 1–5, Strongly Disagree → Strongly Agree)",
    type: "rating",
    questions: [
      "I have strong problem-solving and critical-thinking abilities*",
      "I believe human skills will become more valuable in the AI era*"
    ]
  },
  {
    category: "Career Confidence & Growth",
    description: "(All rated 1–5, Strongly Disagree → Strongly Agree)",
    type: "rating",
    questions: [
      "I feel professionally confident about my future*",
      "I know what actions I should take to stay future-ready professionally*"
    ]
  },
  {
    category: "Self-Reflection",
    type: "open-text",
    questions: [
      "What is your biggest professional concern in the AI era?*",
      "What is your biggest professional goal for the next 2 years?*"
    ]
  },
  {
    category: "Self-Reflection Support",
    type: "single-choice",
    options: [
      "Clarifying my career direction",
      "Understanding AI's impact on my profession",
      "Building future-ready skills",
      "Improving my professional visibility",
      "Strengthening my human skills",
      "Managing career transitions or uncertainty",
      "Other"
    ],
    questions: [
      "Which area would you most like support with right now?*"
    ]
  },
  {
    category: "Next Steps & Support",
    type: "single-choice",
    options: ["Yes", "Maybe-Not sure", "No"],
    questions: [
      "Would you like a personalized roadmap to become more future-ready professionally?*",
      "Would you like to receive invitations to future workshops, networking events, and AI career growth programs?*"
    ]
  }
];

// ==========================================
// 2. RESULTS SUMMARY COMPONENT
// ==========================================

interface AssessmentAnswer {
  text: string;
  points: number;
  category: string;
}

interface ResultsProps {
  answers: AssessmentAnswer[];
  percentage: number;
  level: { name: string; color: string; bg: string };
  onDownload: () => void;
  onRetake: () => void;
  onHome: () => void;
  onStartPremium?: (pkg?: { id: 'report' | 'platinum'; price: string; title: string; priceNum: number }) => void;
  isGeneratingPdf: boolean;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Career Stability & Future Readiness": <Rocket className="w-5 h-5" />,
  "AI Readiness": <Zap className="w-5 h-5" />,
  "Professional Visibility & Positioning": <Eye className="w-5 h-5" />,
  "Human Skills & Leadership": <Users className="w-5 h-5" />,
  "Career Confidence & Growth": <TrendingUp className="w-5 h-5" />,
};

export default function AssessmentResultsSummary({
  answers,
  percentage,
  level,
  onDownload,
  onRetake,
  onHome,
  onStartPremium,
  isGeneratingPdf
}: ResultsProps) {
  const [selectedPkg, setSelectedPkg] = React.useState<'report' | 'platinum'>('report');

  // Sort categories by score to find strengths and growth areas
  const sortedAnswers = [...answers].sort((a, b) => b.points - a.points);
  const topStrength = sortedAnswers[0];
  const mainGrowthArea = sortedAnswers[sortedAnswers.length - 1];

  const getRecommendation = (category: string) => {
    switch (category) {
      case "Career Stability & Future Readiness":
        return "Audit your current skill set against emerging market trends. Focus on continuous learning to ensure your expertise remains indispensable in the next 5 years.";
      case "AI Readiness":
        return "Implement a 'Prompt-First' approach to every complex task. Stop drafting manually and start co-creating with LLMs to build high-speed intuition.";
      case "Professional Visibility & Positioning":
        return "Audit your digital footprint and network actively. Position yourself as a forward-thinking professional to attract new opportunities in a competitive market.";
      case "Human Skills & Leadership":
        return "Double down on communication, problem-solving, and trust-building. These uniquely human traits are your greatest differentiator in an AI-driven era.";
      case "Career Confidence & Growth":
        return "Define a clear, future-ready roadmap. Break down your career direction into actionable steps and embrace continuous reinvention to overcome uncertainty.";
      default:
        return "Refine your narrative leadership to bridge the gap between current output and perceived strategic value.";
    }
  };

  const handleStartSelectedPkg = (pkgId: 'report' | 'platinum') => {
    if (!onStartPremium) return;
    if (pkgId === 'report') {
      onStartPremium({
        id: 'report',
        title: 'Premium AI Career Intelligence Report',
        price: '$68.00',
        priceNum: 68
      });
    } else {
      onStartPremium({
        id: 'platinum',
        title: 'Platinum Package: Premium Report + 45-Min Live Coaching (ICF-PCC)',
        price: '$98.00',
        priceNum: 98
      });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-12">
      {/* Hero Score Card */}
      <div className="bg-primary rounded-3xl sm:rounded-[56px] p-6 sm:p-12 md:p-20 text-white text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/20 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/10 blur-[100px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <h2 className="text-base sm:text-xl font-serif italic text-secondary mb-4 sm:mb-6">Strategic Performance Index</h2>
        <div className="text-6xl sm:text-8xl md:text-9xl font-serif mb-4 sm:mb-6 leading-none">
          {percentage}<span className="text-xl sm:text-2xl ml-1 sm:ml-2 font-mono">%</span>
        </div>
        <div className={`inline-block px-5 py-2 sm:px-8 sm:py-3 rounded-full text-xs sm:text-lg font-bold mb-6 sm:mb-10 ${level.bg} ${level.color}`}>
          {level.name}
        </div>

        <p className="text-white max-w-xl mx-auto leading-relaxed text-sm sm:text-lg italic mb-8 sm:mb-12">
          {`"Based on your architectural reach, you are navigating the ${level.name.toLowerCase()} tier. Your mastery in ${topStrength?.category} is evident, but optimizing ${mainGrowthArea?.category} is your fastest path to parity with global visionaries."`}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center relative z-10">
          <button
            onClick={onDownload}
            disabled={isGeneratingPdf}
            className="w-full sm:w-auto bg-white text-primary px-6 py-4 sm:px-10 sm:py-5 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center hover:bg-secondary hover:text-white transition-all shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isGeneratingPdf ? 'Forging Report...' : 'Download Free PDF Summary'}
          </button>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={onRetake}
              className="w-full sm:w-auto bg-white/10 text-white border border-white/20 px-6 py-4 sm:px-8 sm:py-5 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center hover:bg-white/20 transition-all active:scale-95 cursor-pointer"
            >
              Retake
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

      {/* PREMIUM ASSESSMENT UPGRADE SECTION - 2 OPTIONS ($68 & $98) */}
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
                <Sparkles size={14} /> Executive Upgrade Options
              </div>
              <h3 className="text-2xl sm:text-4xl font-serif leading-tight">
                Accelerate Your Trajectory with <span className="italic text-gold">AI Career Intelligence</span>
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Complete our comprehensive discovery questionnaire (upload your resume and career vision). You will receive an exhaustive, world-class strategy report delivered straight to your WhatsApp and email.
              </p>
            </div>

            {/* Two Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option 1: $68 Premium Report */}
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
                      <h4 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                        Premium Report Only
                      </h4>
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
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-gold shrink-0" />
                      <span>Exhaustive AI Career Intelligence Report (PDF)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-gold shrink-0" />
                      <span>Deep Resume & Positioning Gap Audit</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-gold shrink-0" />
                      <span>Reviewed & Calibrated by Human Strategists</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-gold shrink-0" />
                      <span>Direct WhatsApp & Email PDF Delivery</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartSelectedPkg('report');
                  }}
                  className={`w-full py-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
                    selectedPkg === 'report'
                      ? 'bg-gradient-to-r from-gold via-amber-400 to-gold text-slate-950 shadow-lg shadow-gold/20'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  Start $68 Questionnaire <ArrowRight size={16} />
                </button>
              </div>

              {/* Option 2: $98 Platinum Package */}
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
                      <h4 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                        Report + Live Coaching
                      </h4>
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
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-gold shrink-0" />
                      <span><strong>Everything in the $68 Premium Report</strong></span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-gold shrink-0" />
                      <span><strong>Live 45-Min 1-on-1 Coaching with Pratibha Tiwari (ICF-PCC)</strong></span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-gold shrink-0" />
                      <span>Personalized Executive Influence & Growth Roadmapping</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-gold shrink-0" />
                      <span>Direct WhatsApp Calendar Booking & VIP Delivery</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartSelectedPkg('platinum');
                  }}
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
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-gold" /> Step 1: Take Questionnaire
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-gold" /> Step 2: Scan QR & Upload Screenshot/UTR
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-gold" /> Step 3: Direct WhatsApp Delivery
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Dynamic Breakdown Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Strength Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[40px] border border-gray-100 shadow-xs col-span-1 md:col-span-1"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 text-green-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
            <CheckCircle2 size={20} />
          </div>
          <h3 className="text-[10px] sm:text-xs font-mono text-mist uppercase mb-1 sm:mb-2 tracking-widest font-black">Primary Strength</h3>
          <div className="text-xl sm:text-2xl font-serif text-primary mb-2">{topStrength.category}</div>
          <p className="text-mist text-xs sm:text-sm leading-relaxed">
            You excel at leveraging {topStrength.category.toLowerCase()} to drive impact. Double down on this to become the 'Go-To' expert in your organization.
          </p>
        </motion.div>

        {/* Growth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[40px] border border-gray-100 shadow-xs col-span-1 md:col-span-1"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-500/10 text-rose-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
            <Target size={20} />
          </div>
          <h3 className="text-[10px] sm:text-xs font-mono text-mist uppercase mb-1 sm:mb-2 tracking-widest font-black">Priority Growth</h3>
          <div className="text-xl sm:text-2xl font-serif text-primary mb-2">{mainGrowthArea.category}</div>
          <p className="text-mist text-xs sm:text-sm leading-relaxed">
            Focusing on this area will yield the highest ROI for your leadership brand this year.
          </p>
        </motion.div>

        {/* Tailored Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-secondary text-white p-5 sm:p-8 rounded-2xl sm:rounded-[40px] shadow-xl col-span-1 md:col-span-2 lg:col-span-1 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
              <Zap size={20} />
            </div>
            <h3 className="text-[10px] sm:text-xs font-mono text-white uppercase mb-1 sm:mb-2 tracking-widest">Architect's Advice</h3>
            <p className="text-base sm:text-xl font-serif italic leading-relaxed">
              "{getRecommendation(mainGrowthArea.category)}"
            </p>
          </div>
          <div className="mt-6 sm:mt-8 text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-white">
            Precision Coaching Insight
          </div>
        </motion.div>
      </div>

      {/* Full Domain Audit */}
      <div className="bg-white rounded-2xl sm:rounded-[40px] p-5 sm:p-10 border border-gray-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 sm:mb-10">
          <h3 className="text-xl sm:text-2xl font-serif text-primary">Domain Score Audit</h3>
          <div className="text-[10px] sm:text-xs font-mono text-mist uppercase tracking-widest font-black">5 Core Strategic Pillars</div>
        </div>
        <div className="grid gap-4 sm:gap-6">
          {answers.map((ans, i) => (
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
                    animate={{ width: `${(ans.points / 50) * 100}%` }}
                    className={`h-full ${ans.points >= 40 ? 'bg-secondary' : ans.points >= 25 ? 'bg-blue-400' : 'bg-rose-400'}`}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-mist shrink-0">{ans.points}/50</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}