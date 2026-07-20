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
  Rocket
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
      "I clearly understand how AI is impacting my industry*",
      "I regularly upgrade my professional skills*",
      "I feel confident adapting to workplace changes and uncertainty*",
      "I have a clear direction for my career growth*",
      "My current skills are aligned with future market demands*",
      "I understand which skills may become obsolete in my profession*"
    ]
  },
  {
    category: "AI Readiness",
    description: "(All rated 1–5, Strongly Disagree → Strongly Agree)",
    type: "rating",
    questions: [
      "I actively learn new technologies or tools relevant to my work*",
      "I use AI tools such as ChatGPT or automation tools in my work or learning*",
      "I understand how AI can improve my productivity and efficiency*",
      "I feel comfortable learning and using new digital tools*",
      "I understand the difference between human skills and AI-driven tasks*",
      "I believe AI can enhance my professional growth if used correctly*",
      "I know which AI-related skills are valuable for my profession*"
    ]
  },
  {
    category: "Professional Visibility & Positioning",
    description: "(All rated 1–5, Strongly Disagree → Strongly Agree)",
    type: "rating",
    questions: [
      "My LinkedIn profile professionally represents my expertise and strengths*",
      "I actively build and maintain my professional network*",
      "I know how to position myself professionally in a competitive market*",
      "I communicate my strengths and achievements confidently*",
      "I am professionally visible enough to attract opportunities*",
      "My resume/CV reflects my real value, strengths, and achievements*"
    ]
  },
  {
    category: "Human Skills & Leadership",
    description: "(All rated on 5-point labeled scale: Strongly Disagree / Disagree / Neutral / Agree / Strongly Agree)",
    type: "rating",
    questions: [
      "My communication skills are one of my professional strengths*",
      "I can confidently present ideas and express myself professionally*",
      "I handle workplace pressure and uncertainty effectively*",
      "I have strong problem-solving and critical-thinking abilities*",
      "I build trust and relationships effectively with others*",
      "I believe human skills will become more valuable in the AI era*"
    ]
  },
  {
    category: "Career Confidence & Growth",
    description: "(All rated 1–5, Strongly Disagree → Strongly Agree)",
    type: "rating",
    questions: [
      "I feel professionally confident about my future*",
      "I often feel stuck or uncertain about my next career step*",
      "I know what actions I should take to stay future-ready professionally*",
      "I am willing to continuously reinvent and evolve professionally*"
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
      "Would you be interested in joining a professional growth community focused on career sustainability in the AI era?*",
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
  isGeneratingPdf: boolean;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Career Stability & Future Readiness": <Rocket className="w-5 h-5" />,
  "AI Readiness": <Zap className="w-5 h-5" />,
  "Professional Visibility & Positioning": <Eye className="w-5 h-5" />,
  "Human Skills & Leadership": <Users className="w-5 h-5" />,
  "Career Confidence & Growth": <TrendingUp className="w-5 h-5" />,
};

function HeartPulse({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
    </svg>
  );
}

export default function AssessmentResultsSummary({
  answers,
  percentage,
  level,
  onDownload,
  onRetake,
  onHome,
  isGeneratingPdf
}: ResultsProps) {

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
            {isGeneratingPdf ? 'Forging Report...' : 'Download Premium PDF Report'}
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
          <div className="text-[10px] sm:text-xs font-mono text-mist uppercase tracking-widest font-black">10 Performance Pillars</div>
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