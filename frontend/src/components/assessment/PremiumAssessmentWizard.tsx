import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  CheckSquare,
  ShieldCheck,
  User,
  Mail,
  MapPin,
  Linkedin,
  X,
  RotateCcw
} from 'lucide-react';
import { safeLocalStorage } from '../../lib/storage-helper';
import CountryPhoneInput, { validateFullPhone } from '../common/CountryPhoneInput';

interface PremiumAssessmentWizardProps {
  onCancel: () => void;
  onSubmit: (formData: any) => void;
  sessionId?: string;
  selectedPackage?: {
    id: 'report' | 'platinum';
    title: string;
    price: string;
    priceNum: number;
  };
}

const FOCUS_AREA_OPTIONS = [
  'Leadership',
  'Executive Presence',
  'AI Skills',
  'Career Change',
  'Promotion',
  'Salary Growth',
  'Networking',
  'Personal Brand',
  'LinkedIn',
  'Resume',
  'Public Speaking',
  'Entrepreneurship'
];

const TIME_INVESTMENT_OPTIONS = [
  '1–2 hrs',
  '3–5 hrs',
  '5–10 hrs',
  '10+ hrs'
];

const FEEDBACK_OPTIONS = [
  'Challenge my thinking',
  'Identify blind spots',
  'Focus on opportunities',
  'Practical action plan',
  'Be completely honest'
];

export default function PremiumAssessmentWizard({
  onCancel,
  onSubmit,
  sessionId,
  selectedPackage
}: PremiumAssessmentWizardProps) {
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Stop Lenis smooth-scroll engine so background page doesn't scroll while modal is open.
  // Also lock body as a fallback for non-Lenis environments.
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (lenis) lenis.stop();
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      if (lenis) lenis.start();
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cityCountry, setCityCountry] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string>('');
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [coverLetterFileName, setCoverLetterFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Auto-prefill candidate details from Stripe payment session
  useEffect(() => {
    if (sessionId) {
      fetch(`/api/assessment/payment-status/${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            if (data.customerName && data.customerName !== 'Valued Candidate') {
              setFullName(data.customerName);
            }
            if (data.customerEmail && data.customerEmail !== 'candidate@example.com') {
              setEmail(data.customerEmail);
            }
            if (data.customerWhatsapp) {
              setWhatsapp(data.customerWhatsapp);
            }
          }
        })
        .catch(err => console.error('[Prefill Error]', err));
    }
  }, [sessionId]);

  const [currentRoleDescription, setCurrentRoleDescription] = useState('');
  const [workEnergyGiving, setWorkEnergyGiving] = useState('');
  const [workEnergyDraining, setWorkEnergyDraining] = useState('');

  const [threeYearVision, setThreeYearVision] = useState('');
  const [singleBiggestObstacle, setSingleBiggestObstacle] = useState('');
  const [whySolvingImportantNow, setWhySolvingImportantNow] = useState('');

  const [howUsingAi, setHowUsingAi] = useState('');
  const [aiWorries, setAiWorries] = useState('');
  const [aiEnhancementAreas, setAiEnhancementAreas] = useState('');

  const [colleaguePerception, setColleaguePerception] = useState('');
  const [desiredReputation, setDesiredReputation] = useState('');

  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [weeklyTime, setWeeklyTime] = useState<string>('');

  const [oneCareerQuestion, setOneCareerQuestion] = useState('');
  const [feedbackPreference, setFeedbackPreference] = useState<string>('');

  const [consentAccurate, setConsentAccurate] = useState<boolean>(false);
  const [consentAiHuman, setConsentAiHuman] = useState<boolean>(false);

  // Reset/Clear Form handler
  const handleResetForm = () => {
    safeLocalStorage.removeItem('premium_career_assessment_draft');
    setFullName('');
    setEmail('');
    setWhatsapp('');
    setCityCountry('');
    setLinkedInUrl('');
    setResumeFile(null);
    setResumeFileName('');
    setCoverLetterFile(null);
    setCoverLetterFileName('');
    setCurrentRoleDescription('');
    setWorkEnergyGiving('');
    setWorkEnergyDraining('');
    setThreeYearVision('');
    setSingleBiggestObstacle('');
    setWhySolvingImportantNow('');
    setHowUsingAi('');
    setAiWorries('');
    setAiEnhancementAreas('');
    setColleaguePerception('');
    setDesiredReputation('');
    setFocusAreas([]);
    setWeeklyTime('');
    setOneCareerQuestion('');
    setFeedbackPreference('');
    setConsentAccurate(false);
    setConsentAiHuman(false);
    setCurrentSection(1);
    setErrorMsg('');
  };

  // Restore saved state from localStorage if available
  useEffect(() => {
    try {
      const saved = safeLocalStorage.getItem('premium_career_assessment_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.whatsapp) setWhatsapp(parsed.whatsapp);
        if (parsed.cityCountry) setCityCountry(parsed.cityCountry);
        if (parsed.linkedInUrl) setLinkedInUrl(parsed.linkedInUrl);
        // Do NOT restore ghost PDF filenames if no File object exists in memory
        if (parsed.currentRoleDescription) setCurrentRoleDescription(parsed.currentRoleDescription);
        if (parsed.workEnergyGiving) setWorkEnergyGiving(parsed.workEnergyGiving);
        if (parsed.workEnergyDraining) setWorkEnergyDraining(parsed.workEnergyDraining);
        if (parsed.threeYearVision) setThreeYearVision(parsed.threeYearVision);
        if (parsed.singleBiggestObstacle) setSingleBiggestObstacle(parsed.singleBiggestObstacle);
        if (parsed.whySolvingImportantNow) setWhySolvingImportantNow(parsed.whySolvingImportantNow);
        if (parsed.howUsingAi) setHowUsingAi(parsed.howUsingAi);
        if (parsed.aiWorries) setAiWorries(parsed.aiWorries);
        if (parsed.aiEnhancementAreas) setAiEnhancementAreas(parsed.aiEnhancementAreas);
        if (parsed.colleaguePerception) setColleaguePerception(parsed.colleaguePerception);
        if (parsed.desiredReputation) setDesiredReputation(parsed.desiredReputation);
        if (parsed.focusAreas) setFocusAreas(parsed.focusAreas);
        if (parsed.weeklyTime) setWeeklyTime(parsed.weeklyTime);
        if (parsed.oneCareerQuestion) setOneCareerQuestion(parsed.oneCareerQuestion);
        if (parsed.feedbackPreference) setFeedbackPreference(parsed.feedbackPreference);
      }
    } catch (_e) {}
  }, []);

  // Save changes to draft (Debounced to eliminate typing lag)
  useEffect(() => {
    const timer = setTimeout(() => {
      const draft = {
        fullName,
        email,
        whatsapp,
        cityCountry,
        linkedInUrl,
        currentRoleDescription,
        workEnergyGiving,
        workEnergyDraining,
        threeYearVision,
        singleBiggestObstacle,
        whySolvingImportantNow,
        howUsingAi,
        aiWorries,
        aiEnhancementAreas,
        colleaguePerception,
        desiredReputation,
        focusAreas,
        weeklyTime,
        oneCareerQuestion,
        feedbackPreference
      };
      safeLocalStorage.setItem('premium_career_assessment_draft', JSON.stringify(draft));
    }, 600);

    return () => clearTimeout(timer);
  }, [
    fullName, email, whatsapp, cityCountry, linkedInUrl,
    currentRoleDescription, workEnergyGiving, workEnergyDraining,
    threeYearVision, singleBiggestObstacle, whySolvingImportantNow,
    howUsingAi, aiWorries, aiEnhancementAreas, colleaguePerception, desiredReputation,
    focusAreas, weeklyTime, oneCareerQuestion, feedbackPreference
  ]);

  const toggleFocusArea = (area: string) => {
    if (focusAreas.includes(area)) {
      setFocusAreas(focusAreas.filter(a => a !== area));
      setErrorMsg('');
    } else {
      if (focusAreas.length >= 3) {
        setErrorMsg('You can select a maximum of THREE focus areas.');
        return;
      }
      setFocusAreas([...focusAreas, area]);
      setErrorMsg('');
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      setResumeFileName(file.name);
      setErrorMsg('');
    }
  };

  const handleCoverLetterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverLetterFile(file);
      setCoverLetterFileName(file.name);
    }
  };

  // ── Validation helpers ────────────────────────────────────────────────────
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const linkedInRegex = /^https?:\/\/(www\.)?linkedin\.com\/(in|pub|company)\/[\w\-%.]+\/?$/i;

  const validateCurrentSection = (): boolean => {
    setErrorMsg('');

    if (currentSection === 1) {
      if (!fullName.trim() || fullName.trim().length < 2) {
        setErrorMsg('Please enter your full name (at least 2 characters).');
        return false;
      }
      if (!emailRegex.test(email.trim())) {
        setErrorMsg('Please enter a valid email address (e.g. name@domain.com).');
        return false;
      }
      const phoneValidation = validateFullPhone(whatsapp);
      if (!phoneValidation.isValid) {
        setErrorMsg(phoneValidation.errorMsg || 'Please enter a valid WhatsApp/mobile number.');
        return false;
      }
      if (!cityCountry.trim()) {
        setErrorMsg('Please enter your current city & country (e.g. Mumbai, India).');
        return false;
      }
      if (linkedInUrl.trim() && !linkedInRegex.test(linkedInUrl.trim())) {
        setErrorMsg('LinkedIn URL must be a valid profile link (e.g. https://linkedin.com/in/yourname).');
        return false;
      }
      if (!resumeFile && !resumeFileName) {
        setErrorMsg('Please upload your latest Resume (PDF) — required for the report.');
        return false;
      }
    } else if (currentSection === 2) {
      if (!currentRoleDescription.trim() || !workEnergyGiving.trim() || !workEnergyDraining.trim()) {
        setErrorMsg('Please complete all questions in Section 2.');
        return false;
      }
    } else if (currentSection === 3) {
      if (!threeYearVision.trim() || !singleBiggestObstacle.trim() || !whySolvingImportantNow.trim()) {
        setErrorMsg('Please complete all questions in Section 3.');
        return false;
      }
    } else if (currentSection === 4) {
      if (!howUsingAi.trim() || !aiWorries.trim() || !aiEnhancementAreas.trim()) {
        setErrorMsg('Please complete all questions in Section 4.');
        return false;
      }
    } else if (currentSection === 5) {
      if (!colleaguePerception.trim() || !desiredReputation.trim()) {
        setErrorMsg('Please complete all questions in Section 5.');
        return false;
      }
    } else if (currentSection === 6) {
      if (focusAreas.length !== 3) {
        setErrorMsg(`Please select exactly 3 focus areas (Currently selected: ${focusAreas.length}).`);
        return false;
      }
      if (!weeklyTime) {
        setErrorMsg('Please select how much time you can realistically invest each week.');
        return false;
      }
    } else if (currentSection === 7) {
      if (!oneCareerQuestion.trim()) {
        setErrorMsg('Please answer your single career question.');
        return false;
      }
      if (!feedbackPreference) {
        setErrorMsg('Please select your feedback style preference.');
        return false;
      }
      if (!consentAccurate || !consentAiHuman) {
        setErrorMsg('Please check both consent checkboxes to proceed.');
        return false;
      }
    }

    return true;
  };

  const handleNext = async () => {
    if (validateCurrentSection()) {
      if (currentSection < 7) {
        setCurrentSection(currentSection + 1);
        // Scroll the overlay container (parent of this card) to top
        const overlay = scrollRef.current?.closest('.modal-scroll-area') as HTMLElement | null;
        if (overlay) overlay.scrollTo({ top: 0, behavior: 'smooth' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Form finished -> submit responses to backend and show completion!
        const payload = {
          fullName,
          email,
          whatsapp,
          cityCountry,
          linkedInUrl,
          resumeFileName,
          coverLetterFileName,
          currentRoleDescription,
          workEnergyGiving,
          workEnergyDraining,
          threeYearVision,
          singleBiggestObstacle,
          whySolvingImportantNow,
          howUsingAi,
          aiWorries,
          aiEnhancementAreas,
          colleaguePerception,
          desiredReputation,
          focusAreas,
          weeklyTime,
          oneCareerQuestion,
          feedbackPreference,
          packageId: selectedPackage?.id || 'report',
          packagePrice: selectedPackage?.price || '$68.00',
          packageTitle: selectedPackage?.title || 'Premium AI Career Intelligence Report'
        };

        setIsSubmitting(true);
        if (sessionId) {
          try {
            await fetch('/api/assessment/submit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sessionId,
                formData: payload
              })
            });
          } catch (err) {
            console.error('[Submit Backend Error]', err);
          }
        }
        // Clean draft upon submission
        safeLocalStorage.removeItem('premium_career_assessment_draft');
        setIsSubmitting(false);
        onSubmit(payload);
      }
    }
  };

  const handlePrev = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
      setErrorMsg('');
      const overlay = scrollRef.current?.closest('.modal-scroll-area') as HTMLElement | null;
      if (overlay) overlay.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onCancel();
    }
  };

  return (
    <div
      ref={scrollRef}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      className="bg-white/95 backdrop-blur-xl p-5 sm:p-10 md:p-14 rounded-3xl sm:rounded-[48px] shadow-[0_40px_80px_-20px_rgba(26,58,92,0.15)] border border-gold/20 relative"
    >
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-6 mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 text-gold-dark rounded-full text-xs font-mono font-bold uppercase tracking-widest mb-2">
            <Sparkles size={14} /> AI Career Intelligence Blueprint
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif text-primary font-bold">
            Premium Strategic Discovery Questionnaire
          </h2>
          <p className="text-mist text-xs sm:text-sm mt-1 flex items-center gap-2 font-mono">
            <Clock size={14} /> Estimated completion time: 12–15 minutes
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleResetForm}
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            title="Clear all saved draft inputs and start fresh"
          >
            <RotateCcw size={14} /> Start Fresh / Reset
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-semibold text-mist hover:text-rose-500 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <X size={16} /> Exit Blueprint
          </button>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-2 text-xs font-mono font-bold text-slate-500">
          <span>SECTION {currentSection} OF 7</span>
          <span>{Math.round((currentSection / 7) * 100)}% COMPLETED</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
          {[1, 2, 3, 4, 5, 6, 7].map((sec) => (
            <div
              key={sec}
              className={`flex-1 h-full border-r border-white/50 transition-all duration-300 ${
                sec < currentSection
                  ? 'bg-emerald-500'
                  : sec === currentSection
                  ? 'bg-gold font-bold'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] font-mono text-mist mt-2 overflow-x-auto gap-2">
          <span className={currentSection === 1 ? 'text-gold font-bold' : ''}>1. Profile</span>
          <span className={currentSection === 2 ? 'text-gold font-bold' : ''}>2. Situation</span>
          <span className={currentSection === 3 ? 'text-gold font-bold' : ''}>3. Direction</span>
          <span className={currentSection === 4 ? 'text-gold font-bold' : ''}>4. AI Readiness</span>
          <span className={currentSection === 5 ? 'text-gold font-bold' : ''}>5. Positioning</span>
          <span className={currentSection === 6 ? 'text-gold font-bold' : ''}>6. Priorities</span>
          <span className={currentSection === 7 ? 'text-gold font-bold' : ''}>7. Final</span>
        </div>
      </div>

      {/* Error Display */}
      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs sm:text-sm flex items-center gap-2"
        >
          <AlertCircle size={18} className="shrink-0" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      {/* Form Body with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`section-${currentSection}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* SECTION 1: Professional Profile */}
          {currentSection === 1 && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-xl font-serif font-bold text-primary">SECTION 1 – Professional Profile</h3>
                <p className="text-xs text-mist">Basic details and background materials.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5 flex items-center gap-1.5">
                    <User size={14} className="text-gold" /> Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alexandra Vance"
                    className="w-full p-3.5 rounded-2xl border border-gray-200 focus:border-gold focus:outline-none text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5 flex items-center gap-1.5">
                    <Mail size={14} className="text-gold" /> Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alexandra@company.com"
                    className="w-full p-3.5 rounded-2xl border border-gray-200 focus:border-gold focus:outline-none text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5 flex items-center gap-1.5">
                    <span className="text-gold font-mono font-bold text-xs">WA</span> WhatsApp Number (for Report Delivery) *
                  </label>
                  <CountryPhoneInput
                    value={whatsapp}
                    onChange={setWhatsapp}
                    placeholder="e.g. 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5 flex items-center gap-1.5">
                    <MapPin size={14} className="text-gold" /> Current City & Country *
                  </label>
                  <input
                    type="text"
                    value={cityCountry}
                    onChange={(e) => setCityCountry(e.target.value)}
                    placeholder="e.g. London, UK / Mumbai, India"
                    className="w-full p-3.5 rounded-2xl border border-gray-200 focus:border-gold focus:outline-none text-sm bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-primary mb-1.5 flex items-center gap-1.5">
                    <Linkedin size={14} className="text-gold" /> LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={linkedInUrl}
                    onChange={(e) => setLinkedInUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full p-3.5 rounded-2xl border border-gray-200 focus:border-gold focus:outline-none text-sm bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                {/* Resume Upload */}
                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-dashed border-gold/30 hover:border-gold transition-colors text-center">
                  <Upload className="w-8 h-8 text-gold mx-auto mb-2" />
                  <span className="block text-xs font-bold text-primary mb-1">Upload Latest Resume (PDF) *</span>
                  <span className="block text-[11px] text-mist mb-3">Required for strategic skill extraction</span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeChange}
                    id="resume-upload"
                    className="hidden"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-secondary transition-all"
                  >
                    <FileText size={14} /> {resumeFileName ? 'Change PDF' : 'Select PDF File'}
                  </label>
                  {resumeFileName && (
                    <div className="mt-2 text-xs font-mono text-emerald-600 font-bold flex items-center justify-center gap-1">
                      <CheckCircle2 size={14} /> {resumeFileName}
                    </div>
                  )}
                </div>

                {/* Cover Letter Upload */}
                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-dashed border-gray-200 hover:border-slate-400 transition-colors text-center">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <span className="block text-xs font-bold text-primary mb-1">Upload Cover Letter (Optional)</span>
                  <span className="block text-[11px] text-mist mb-3">Provides additional context</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCoverLetterChange}
                    id="cover-letter-upload"
                    className="hidden"
                  />
                  <label
                    htmlFor="cover-letter-upload"
                    className="inline-flex items-center gap-2 bg-slate-200 text-slate-800 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-300 transition-all"
                  >
                    <FileText size={14} /> {coverLetterFileName ? 'Change File' : 'Select File'}
                  </label>
                  {coverLetterFileName && (
                    <div className="mt-2 text-xs font-mono text-emerald-600 font-bold flex items-center justify-center gap-1">
                      <CheckCircle2 size={14} /> {coverLetterFileName}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: Current Situation */}
          {currentSection === 2 && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-xl font-serif font-bold text-primary">SECTION 2 – Current Situation</h3>
                <p className="text-xs text-mist">Authentic context regarding your day-to-day work environment.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-2">
                  Describe your current role in your own words. What do you actually do (not your job description)? *
                </label>
                <textarea
                  rows={4}
                  value={currentRoleDescription}
                  onChange={(e) => setCurrentRoleDescription(e.target.value)}
                  placeholder="Share your actual daily responsibilities, decisions, and impact..."
                  className="w-full p-4 rounded-2xl border border-gray-200 focus:border-gold focus:outline-none text-sm bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-2">
                  What work gives you the most energy and satisfaction? *
                </label>
                <textarea
                  rows={3}
                  value={workEnergyGiving}
                  onChange={(e) => setWorkEnergyGiving(e.target.value)}
                  placeholder="Projects, tasks, or interactions where you feel in your flow state..."
                  className="w-full p-4 rounded-2xl border border-gray-200 focus:border-gold focus:outline-none text-sm bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-2">
                  What work drains your energy the most? *
                </label>
                <textarea
                  rows={3}
                  value={workEnergyDraining}
                  onChange={(e) => setWorkEnergyDraining(e.target.value)}
                  placeholder="Tasks, meetings, or bottlenecks that feel tedious or uninspiring..."
                  className="w-full p-4 rounded-2xl border border-gray-200 focus:border-gold focus:outline-none text-sm bg-white resize-none"
                />
              </div>
            </div>
          )}

          {/* SECTION 3: Career Direction */}
          {currentSection === 3 && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-xl font-serif font-bold text-primary">SECTION 3 – Career Direction</h3>
                <p className="text-xs text-mist">Your future vision and core drivers.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-2">
                  If we meet again three years from today and your career has exceeded your expectations, what has happened? *
                </label>
                <textarea
                  rows={4}
                  value={threeYearVision}
                  onChange={(e) => setThreeYearVision(e.target.value)}
                  placeholder="Describe your ideal title, scope, freedom, income, or impact..."
                  className="w-full p-4 rounded-2xl border border-gray-200 focus:border-gold focus:outline-none text-sm bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-2">
                  What is the single biggest obstacle preventing that future? *
                </label>
                <textarea
                  rows={3}
                  value={singleBiggestObstacle}
                  onChange={(e) => setSingleBiggestObstacle(e.target.value)}
                  placeholder="Lack of clarity, time constraints, organization limits, skill gaps..."
                  className="w-full p-4 rounded-2xl border border-gray-200 focus:border-gold focus:outline-none text-sm bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-2">
                  Why is solving this challenge important to you now? *
                </label>
                <textarea
                  rows={3}
                  value={whySolvingImportantNow}
                  onChange={(e) => setWhySolvingImportantNow(e.target.value)}
                  placeholder="What makes this pivotal for your career trajectory today..."
                  className="w-full p-4 rounded-2xl border border-gray-200 focus:border-gold focus:outline-none text-sm bg-white resize-none"
                />
              </div>
            </div>
          )}

          {/* SECTION 4: AI Readiness */}
          {currentSection === 4 && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-xl font-serif font-bold text-primary">SECTION 4 – AI Readiness</h3>
                <p className="text-xs text-mist">Assessing how AI is shaping your current and future workflow.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-2">
                  How are you currently using AI in your work? *
                </label>
                <textarea
                  rows={3}
                  value={howUsingAi}
                  onChange={(e) => setHowUsingAi(e.target.value)}
                  placeholder="ChatGPT, Copilot, custom agents, automation tools, or none yet..."
                  className="w-full p-4 rounded-2xl border border-gray-200 focus:border-gold focus:outline-none text-sm bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-2">
                  What worries you most about AI and the future of work? *
                </label>
                <textarea
                  rows={3}
                  value={aiWorries}
                  onChange={(e) => setAiWorries(e.target.value)}
                  placeholder="Job displacement, rapid skill obsolescence, staying competitive..."
                  className="w-full p-4 rounded-2xl border border-gray-200 focus:border-gold focus:outline-none text-sm bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-2">
                  Where do you believe AI could make you significantly better? *
                </label>
                <textarea
                  rows={3}
                  value={aiEnhancementAreas}
                  onChange={(e) => setAiEnhancementAreas(e.target.value)}
                  placeholder="Automating routine tasks, strategic decision-making, speed..."
                  className="w-full p-4 rounded-2xl border border-gray-200 focus:border-gold focus:outline-none text-sm bg-white resize-none"
                />
              </div>
            </div>
          )}

          {/* SECTION 5: Professional Positioning */}
          {currentSection === 5 && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-xl font-serif font-bold text-primary">SECTION 5 – Professional Positioning</h3>
                <p className="text-xs text-mist">Understanding your reputational footprint and core differentiators.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-2">
                  If I asked five colleagues, 'What is this person exceptionally good at?', what would they say? *
                </label>
                <textarea
                  rows={4}
                  value={colleaguePerception}
                  onChange={(e) => setColleaguePerception(e.target.value)}
                  placeholder="Specific superpowers, leadership style, problem solving skills..."
                  className="w-full p-4 rounded-2xl border border-gray-200 focus:border-gold focus:outline-none text-sm bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-2">
                  What kind of professional do you want to become known as? *
                </label>
                <textarea
                  rows={4}
                  value={desiredReputation}
                  onChange={(e) => setDesiredReputation(e.target.value)}
                  placeholder="e.g. Strategic visionary, AI-empowered executive, transformative leader..."
                  className="w-full p-4 rounded-2xl border border-gray-200 focus:border-gold focus:outline-none text-sm bg-white resize-none"
                />
              </div>
            </div>
          )}

          {/* SECTION 6: Growth Priorities */}
          {currentSection === 6 && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-xl font-serif font-bold text-primary">SECTION 6 – Growth Priorities</h3>
                <p className="text-xs text-mist">Select your primary focus and weekly commitment budget.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-2">
                  Choose THREE focus areas: (Selected: <span className="text-gold font-bold">{focusAreas.length}/3</span>) *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {FOCUS_AREA_OPTIONS.map((area) => {
                    const isSelected = focusAreas.includes(area);
                    return (
                      <button
                        key={area}
                        type="button"
                        onClick={() => toggleFocusArea(area)}
                        className={`p-3 rounded-2xl border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-primary text-white border-primary shadow-md scale-[1.02]'
                            : 'bg-white text-slate-700 border-gray-200 hover:border-gold'
                        }`}
                      >
                        <span>{area}</span>
                        {isSelected && <CheckSquare size={14} className="text-gold" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4">
                <label className="block text-xs font-semibold text-primary mb-2">
                  How much time can you realistically invest each week? *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {TIME_INVESTMENT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setWeeklyTime(opt);
                        setErrorMsg('');
                      }}
                      className={`p-3.5 rounded-2xl border text-xs font-bold transition-all text-center cursor-pointer ${
                        weeklyTime === opt
                          ? 'bg-gold text-slate-950 border-gold shadow-md'
                          : 'bg-white text-slate-700 border-gray-200 hover:border-gold'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: Final Reflection & Consent */}
          {currentSection === 7 && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-xl font-serif font-bold text-primary">SECTION 7 – Final Reflection & Consent</h3>
                <p className="text-xs text-mist">Final directives for your personalized strategy blueprint.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-2">
                  If this report could answer only ONE career question for you, what would it be? *
                </label>
                <textarea
                  rows={3}
                  value={oneCareerQuestion}
                  onChange={(e) => setOneCareerQuestion(e.target.value)}
                  placeholder="Ask your most pressing career dilemma..."
                  className="w-full p-4 rounded-2xl border border-gray-200 focus:border-gold focus:outline-none text-sm bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-2">
                  What kind of feedback would you like? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {FEEDBACK_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setFeedbackPreference(opt);
                        setErrorMsg('');
                      }}
                      className={`p-3.5 rounded-2xl border text-xs font-semibold transition-all text-left cursor-pointer ${
                        feedbackPreference === opt
                          ? 'bg-primary text-white border-primary shadow-md'
                          : 'bg-white text-slate-700 border-gray-200 hover:border-gold'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Consent Section */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 pt-4">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-gold" /> CONSENT & CONFIRMATION
                </div>

                <label className="flex items-start gap-3 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAccurate}
                    onChange={(e) => {
                      setConsentAccurate(e.target.checked);
                      setErrorMsg('');
                    }}
                    className="mt-0.5 rounded text-gold focus:ring-gold"
                  />
                  <span>I confirm the information provided is accurate.</span>
                </label>

                <label className="flex items-start gap-3 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAiHuman}
                    onChange={(e) => {
                      setConsentAiHuman(e.target.checked);
                      setErrorMsg('');
                    }}
                    className="mt-0.5 rounded text-gold focus:ring-gold"
                  />
                  <span>
                    I understand AI may assist in drafting the report, and all recommendations will be reviewed by a human career strategist.
                  </span>
                </label>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Wizard Footer Controls */}
      <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={handlePrev}
          className="text-xs font-bold text-mist hover:text-primary flex items-center gap-2 transition-colors cursor-pointer px-4 py-2"
        >
          <ArrowLeft size={16} /> {currentSection === 1 ? 'Cancel' : 'Previous Section'}
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting}
          className="bg-primary text-white px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 hover:bg-secondary transition-all shadow-xl active:scale-95 cursor-pointer disabled:opacity-50"
        >
          {currentSection < 7 ? (
            <>
              Next Section <ArrowRight size={16} />
            </>
          ) : isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Submitting Assessment...</span>
            </>
          ) : (
            <>
              Submit Assessment <Sparkles size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
