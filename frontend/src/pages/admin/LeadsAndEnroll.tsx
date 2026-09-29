/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  Loader2,
  RefreshCw,
  Sparkles,
  Download,
  AlertCircle,
  X,
  CreditCard,
  DollarSign,
  Users,
  ShieldCheck,
  Check,
  ArrowUpDown,
  ExternalLink,
  PhoneCall,
  Trash2,
  Radio,
  FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';

interface AssessmentRecord {
  _id: string;
  paymentId: string;
  stripeSessionId: string;
  stripePaymentIntentId?: string;
  customerName: string;
  customerEmail: string;
  customerWhatsapp?: string;
  packageId: 'report' | 'platinum';
  packageTitle: string;
  amount: number;
  currency?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  assessmentStatus: 'not_started' | 'in_progress' | 'completed';
  reportStatus: 'pending' | 'processing' | 'sent';
  paymentDate?: string;
  submittedAt?: string;
  assessmentData?: any;
  reportNotes?: string;
  reportSentAt?: string;
  createdAt: string;
}

interface StatsData {
  totalLeads: number;
  totalEnrolled: number;
  totalRevenue: number;
  pendingPayments: number;
  completedAssessments: number;
  sentReports: number;
}

export default function LeadsAndEnroll() {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [stats, setStats] = useState<StatsData>({
    totalLeads: 0,
    totalEnrolled: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    completedAssessments: 0,
    sentReports: 0
  });

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'paid' | 'pending' | 'completed' | 'sent'>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals
  const [selectedRecord, setSelectedRecord] = useState<AssessmentRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  // Status update form
  const [newReportStatus, setNewReportStatus] = useState<'pending' | 'processing' | 'sent'>('processing');
  const [reportNotes, setReportNotes] = useState('');
  const [reportLink, setReportLink] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const timerRef = useRef<any>(null);

  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
      headers['Authorization'] = `Bearer ${token.trim()}`;
    }
    return headers;
  };

  const fetchAssessments = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        fetch('/api/assessment/admin/list', {
          credentials: 'include',
          headers: getAuthHeaders()
        }),
        fetch('/api/assessment/admin/stats', {
          credentials: 'include',
          headers: getAuthHeaders()
        })
      ]);

      const listData = await listRes.json();
      if (listRes.ok && listData.success) {
        setAssessments(listData.data || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success && statsData.data) {
          setStats(statsData.data);
        }
      }
    } catch (err) {
      console.error('[Fetch Leads & Enrollments Error]', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  // Real-time polling
  useEffect(() => {
    if (autoRefresh) {
      timerRef.current = setInterval(() => {
        fetchAssessments(true);
      }, 10000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoRefresh]);

  // Sync with Stripe in Real-Time
  const handleSyncStripe = async (record: AssessmentRecord) => {
    setSyncingId(record._id);
    setFeedbackMessage(null);
    try {
      const res = await fetch(`/api/assessment/admin/${record._id}/sync-stripe`, {
        method: 'POST',
        credentials: 'include',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedbackMessage({
          type: 'success',
          text: `Synced ${record.customerName}: Payment status is ${data.data.paymentStatus.toUpperCase()}`
        });
        fetchAssessments(true);
      } else {
        setFeedbackMessage({
          type: 'error',
          text: data.message || 'Unable to sync with Stripe gateway.'
        });
      }
    } catch (err: any) {
      setFeedbackMessage({
        type: 'error',
        text: err.message || 'Error connecting to Stripe sync endpoint.'
      });
    } finally {
      setSyncingId(null);
      setTimeout(() => setFeedbackMessage(null), 5000);
    }
  };

  // Delete Record
  const handleDeleteRecord = async (record: AssessmentRecord) => {
    if (!window.confirm(`Are you sure you want to delete lead record for "${record.customerName}" (${record.paymentId})?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/assessment/admin/${record._id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setFeedbackMessage({ type: 'success', text: 'Record removed successfully.' });
        fetchAssessments(true);
      } else {
        alert('Failed to delete record.');
      }
    } catch (err) {
      alert('Error deleting record.');
    }
  };

  // Update Status Form Submit
  const handleUpdateStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/assessment/admin/${selectedRecord._id}/report-status`, {
        method: 'PUT',
        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          reportStatus: newReportStatus,
          reportNotes: reportNotes.trim(),
          reportLink: reportLink.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsStatusModalOpen(false);
        setFeedbackMessage({ type: 'success', text: `Report status updated to ${newReportStatus}.` });
        fetchAssessments(true);
      } else {
        alert(data.message || 'Failed to update report status.');
      }
    } catch (err) {
      console.error('[Update Status Error]', err);
      alert('Error updating report status.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Export to CSV
  const handleExportCsv = () => {
    if (assessments.length === 0) return;

    const headers = ['Payment ID', 'Customer Name', 'Customer Email', 'WhatsApp', 'Package', 'Amount ($)', 'Payment Status', 'Assessment Status', 'Report Status', 'Stripe Session ID', 'Stripe Payment Intent', 'Created At'];
    
    const rows = assessments.map(a => [
      `"${a.paymentId}"`,
      `"${a.customerName}"`,
      `"${a.customerEmail}"`,
      `"${a.customerWhatsapp || ''}"`,
      `"${a.packageTitle}"`,
      a.amount,
      `"${a.paymentStatus}"`,
      `"${a.assessmentStatus}"`,
      `"${a.reportStatus}"`,
      `"${a.stripeSessionId}"`,
      `"${a.stripePaymentIntentId || ''}"`,
      `"${new Date(a.createdAt).toISOString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_and_enrollments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Direct candidate document download (handles embedded base64 blobs or server routes safely)
  const handleDownloadCandidateDoc = (record: AssessmentRecord, docType: 'resume' | 'cover-letter') => {
    const isResume = docType === 'resume';
    const assessmentData = record.assessmentData || {};
    const dataUrl = isResume
      ? (assessmentData.resumeDataUrl || assessmentData.resumeUrl)
      : (assessmentData.coverLetterDataUrl || assessmentData.coverLetterUrl);
    const rawFileName = isResume
      ? (assessmentData.resumeFileName || `${record.customerName || 'Candidate'}_Resume.pdf`)
      : (assessmentData.coverLetterFileName || `${record.customerName || 'Candidate'}_Cover_Letter.pdf`);
    const cleanFileName = rawFileName.replace(/[^a-zA-Z0-9._-]/g, '_');

    // 1. If base64 dataUrl is present in memory, convert to Blob and download directly without network failure
    if (dataUrl && typeof dataUrl === 'string' && dataUrl.startsWith('data:')) {
      try {
        const parts = dataUrl.split(',');
        const mime = parts[0].match(/:(.*?);/)?.[1] || (cleanFileName.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream');
        const binaryStr = atob(parts[1].replace(/[\r\n\s]/g, ''));
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = cleanFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
        return;
      } catch (err) {
        console.warn('Direct blob conversion error, falling back to server route:', err);
      }
    }

    // 2. Direct external URL (e.g. Cloudinary)
    if (dataUrl && typeof dataUrl === 'string' && (dataUrl.startsWith('http://') || dataUrl.startsWith('https://'))) {
      window.open(dataUrl, '_blank');
      return;
    }

    // 3. Fallback: Synthesize candidate executive profile PDF directly in browser
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      doc.setFillColor(10, 25, 41);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(212, 175, 55);
      doc.setFontSize(16);
      doc.text('PRATIBHA TIWARI  |  EXECUTIVE PRACTICE', 14, 18);
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(`${record.customerName || 'Candidate'} — ${isResume ? 'CV / Executive Profile' : 'Cover Letter & Briefing'}`, 14, 28);

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(11);
      let y = 52;
      const addRow = (lbl: string, val: any) => {
        doc.setFont('helvetica', 'bold');
        doc.text(lbl, 14, y);
        doc.setFont('helvetica', 'normal');
        const safeText = String(val ?? 'N/A');
        doc.text(doc.splitTextToSize(safeText, 130), 65, y);
        y += 12;
      };

      addRow('Candidate Name:', record.customerName);
      addRow('Email Address:', record.customerEmail);
      addRow('WhatsApp:', record.customerWhatsapp || 'N/A');
      addRow('Location:', assessmentData.cityCountry || 'N/A');
      addRow('LinkedIn:', assessmentData.linkedInUrl || 'N/A');
      addRow('Selected Package:', record.packageTitle);
      addRow('Current Role:', assessmentData.currentRoleDescription || 'N/A');
      addRow('3-Year Vision:', assessmentData.threeYearVision || 'N/A');
      addRow('Primary Roadblock:', assessmentData.singleBiggestObstacle || 'N/A');
      addRow('Core Question:', assessmentData.oneCareerQuestion || 'N/A');

      const downloadFileName = cleanFileName.endsWith('.pdf') ? cleanFileName : `${cleanFileName}.pdf`;
      doc.save(downloadFileName);
      return;
    } catch (pdfErr) {
      console.warn('Browser jsPDF fallback error, attempting server endpoint:', pdfErr);
      const targetId = record._id || record.paymentId;
      window.open(`/api/assessment/document/${targetId}/${docType}`, '_blank');
    }
  };

  // Filtered List
  const filtered = assessments.filter(item => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      item.customerName?.toLowerCase().includes(term) ||
      item.customerEmail?.toLowerCase().includes(term) ||
      item.paymentId?.toLowerCase().includes(term) ||
      item.stripeSessionId?.toLowerCase().includes(term) ||
      item.customerWhatsapp?.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    if (activeTab === 'paid') return item.paymentStatus === 'paid';
    if (activeTab === 'pending') return item.paymentStatus === 'pending';
    if (activeTab === 'completed') return item.assessmentStatus === 'completed';
    if (activeTab === 'sent') return item.reportStatus === 'sent';

    return true;
  });

  return (
    <div className="p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-800 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-2 border border-amber-500/20">
            <Sparkles size={14} className="text-gold" /> Real-time Stripe Gateway Hub
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif text-slate-900 font-bold">
            Leads &amp; Enrollments Portal
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Real-time tracking of candidate inquiries, verified Stripe payments, questionnaire diagnostics &amp; report delivery.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Live Sync Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
              autoRefresh
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${autoRefresh ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <span>{autoRefresh ? 'Live Polling ON (10s)' : 'Live Polling Paused'}</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => fetchAssessments(false)}
            disabled={loading}
            className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-xl font-medium text-xs flex items-center gap-2 hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-gold' : ''} />
            <span>Refresh</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            disabled={assessments.length === 0}
            className="bg-primary hover:bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <FileSpreadsheet size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      <AnimatePresence>
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-medium border shadow-xs ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-red-50 text-red-900 border-red-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {feedbackMessage.type === 'success' ? (
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle size={18} className="text-red-600 shrink-0" />
              )}
              <span>{feedbackMessage.text}</span>
            </div>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Leads</span>
            <Users size={18} className="text-slate-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{stats.totalLeads}</div>
            <span className="text-[11px] text-slate-400">All registered intents</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Enrolled (Paid)</span>
            <ShieldCheck size={18} className="text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">{stats.totalEnrolled}</div>
            <span className="text-[11px] text-emerald-700 font-medium">Verified Stripe Payments</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
            <DollarSign size={18} className="text-amber-600" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">
              ${stats.totalRevenue.toFixed(2)}
            </div>
            <span className="text-[11px] text-amber-700 font-medium">Gross USD collected</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Checkouts</span>
            <Clock size={18} className="text-amber-500" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-600">{stats.pendingPayments}</div>
            <span className="text-[11px] text-slate-400">Awaiting payment</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Reports Sent</span>
            <CheckCircle2 size={18} className="text-blue-600" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.sentReports}</div>
            <span className="text-[11px] text-slate-400">Of {stats.completedAssessments} completed audits</span>
          </div>
        </div>
      </div>

      {/* Controls Bar & Filter Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          {/* Search Box */}
          <div className="relative w-full sm:w-96">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidate name, email, WhatsApp, or Payment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-gold"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {[
              { id: 'all', label: `All (${assessments.length})` },
              { id: 'paid', label: `Enrolled (${assessments.filter(a => a.paymentStatus === 'paid').length})` },
              { id: 'pending', label: `Pending (${assessments.filter(a => a.paymentStatus === 'pending').length})` },
              { id: 'completed', label: `Audits Done (${assessments.filter(a => a.assessmentStatus === 'completed').length})` },
              { id: 'sent', label: `Reports Sent (${assessments.filter(a => a.reportStatus === 'sent').length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="py-24 text-center space-y-3 bg-white rounded-3xl border border-slate-200">
          <Loader2 size={36} className="animate-spin text-gold mx-auto" />
          <p className="text-slate-600 font-medium text-sm">Synchronizing real-time leads and payments...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 text-slate-500 space-y-3">
          <FileText size={44} className="mx-auto text-slate-300" />
          <h3 className="text-lg font-serif font-bold text-slate-800">No Matching Leads or Enrollments</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Candidate checkouts, Stripe payments, and questionnaire submissions will automatically appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
          {/* Two-Finger Horizontal Scroll Affordance Banner */}
          <div className="flex items-center justify-between px-5 py-2.5 bg-slate-50 border-b border-slate-200/70 text-[11px] text-slate-500 font-mono">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span>Two-Finger Horizontal Swipe &bull; Scroll sideways on trackpad or screen to view all columns</span>
            </span>
            <span className="hidden sm:inline text-slate-400 font-bold">{filtered.length} Leads Total</span>
          </div>

          <div className="overflow-x-auto overscroll-x-contain touch-pan-x pb-2">
            <table className="min-w-[1200px] w-full text-left border-collapse text-xs table-fixed">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-500 uppercase font-mono tracking-wider">
                  <th className="p-4 w-[250px]">Candidate / Lead</th>
                  <th className="p-4 w-[210px]">Package</th>
                  <th className="p-4 w-[160px]">Stripe Payment</th>
                  <th className="p-4 w-[130px]">Questionnaire</th>
                  <th className="p-4 w-[130px]">Report Status</th>
                  <th className="p-4 text-right w-[320px]">Actions &amp; Documents</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filtered.map((record) => (
                  <tr key={record._id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Candidate */}
                    <td className="p-4">
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        {record.customerName}
                        {record.paymentStatus === 'paid' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <Check size={10} /> Enrolled
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{record.customerEmail}</div>
                      {record.customerWhatsapp && (
                        <a
                          href={`https://wa.me/${record.customerWhatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:underline font-mono mt-0.5"
                        >
                          <PhoneCall size={10} /> WA: {record.customerWhatsapp}
                        </a>
                      )}
                      <div className="text-[10px] text-slate-400 font-mono mt-1">
                        Created: {new Date(record.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Package */}
                    <td className="p-4">
                      <span className="font-semibold text-slate-800">{record.packageTitle}</span>
                      <div className="text-slate-400 text-[10px] font-mono mt-0.5">
                        Ref: <span className="font-bold text-slate-700">{record.paymentId}</span>
                      </div>
                    </td>

                    {/* Stripe Payment Status */}
                    <td className="p-4">
                      <div className="font-bold text-slate-900 text-sm font-mono">
                        ${record.amount.toFixed(2)} USD
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono ${
                            record.paymentStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : record.paymentStatus === 'pending'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {record.paymentStatus === 'paid' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                          {record.paymentStatus}
                        </span>

                        {/* Quick Stripe Sync Button */}
                        <button
                          onClick={() => handleSyncStripe(record)}
                          disabled={syncingId === record._id}
                          title="Verify live status with Stripe"
                          className="p-1 hover:bg-slate-200 rounded-md text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                          <RefreshCw
                            size={12}
                            className={syncingId === record._id ? 'animate-spin text-gold' : ''}
                          />
                        </button>
                      </div>
                      {record.stripePaymentIntentId && (
                        <div className="text-[9px] text-slate-400 font-mono mt-0.5 truncate max-w-[140px]" title={record.stripePaymentIntentId}>
                          PI: {record.stripePaymentIntentId}
                        </div>
                      )}
                    </td>

                    {/* Assessment Status */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          record.assessmentStatus === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {record.assessmentStatus === 'completed' ? (
                          <>
                            <CheckCircle2 size={12} className="text-emerald-600" />
                            <span>Completed</span>
                          </>
                        ) : (
                          <>
                            <Clock size={12} className="text-slate-400" />
                            <span>Not Started</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* Report Status */}
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider font-mono ${
                          record.reportStatus === 'sent'
                            ? 'bg-emerald-100 text-emerald-800'
                            : record.reportStatus === 'processing'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {record.reportStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                      {/* Direct CV Download */}
                      <button
                        type="button"
                        onClick={() => handleDownloadCandidateDoc(record, 'resume')}
                        className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors font-semibold text-xs inline-flex items-center gap-1 cursor-pointer border border-blue-200"
                        title={`Download ${record.customerName}'s CV / Resume`}
                      >
                        <Download size={13} /> CV
                      </button>

                      {/* Direct Cover Letter Download */}
                      <button
                        type="button"
                        onClick={() => handleDownloadCandidateDoc(record, 'cover-letter')}
                        className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg transition-colors font-semibold text-xs inline-flex items-center gap-1 cursor-pointer border border-amber-200"
                        title={`Download ${record.customerName}'s Cover Letter / Briefing`}
                      >
                        <FileText size={13} /> Letter
                      </button>

                      {/* View Diagnostic Answers */}
                      <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setIsDetailsOpen(true);
                        }}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
                        title="View Candidate Questionnaire Answers"
                      >
                        <Eye size={13} /> Answers
                      </button>

                      {/* Update Report Status */}
                      <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setNewReportStatus(record.reportStatus);
                          setReportNotes(record.reportNotes || '');
                          setIsStatusModalOpen(true);
                        }}
                        className="px-2.5 py-1.5 bg-gold hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors text-xs inline-flex items-center gap-1 cursor-pointer shadow-xs"
                        title="Update report dispatch status"
                      >
                        <Send size={13} /> Status
                      </button>

                      {/* Download Receipt */}
                      {record.paymentStatus === 'paid' && (
                        <a
                          href={`/api/assessment/receipt/${record.paymentId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-xs inline-flex items-center gap-1 cursor-pointer"
                          title="Download official PDF receipt"
                        >
                          <Download size={13} />
                        </a>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteRecord(record)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Lead Record"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Answers Audit Modal */}
      {isDetailsOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full h-[90vh] max-h-[90vh] flex flex-col min-h-0 shadow-2xl overflow-hidden border border-slate-200/80">
            {/* Sticky Header */}
            <div className="p-5 sm:p-6 bg-slate-900 text-white flex justify-between items-center shrink-0 border-b border-slate-800">
              <div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-white flex items-center gap-2">
                  <span>{selectedRecord.customerName}</span>
                  <span className="text-gold text-xs font-mono font-normal">Diagnostic Profile</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {selectedRecord.customerEmail} • {selectedRecord.paymentId}
                </p>
              </div>
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Modal Body (Supports two-finger scroll and touch-pan-y) */}
            <div className="p-5 sm:p-6 flex-1 min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y space-y-4 text-xs text-slate-800 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
              {selectedRecord.assessmentData ? (
                <div className="space-y-4">
                  {/* Section 1: Contact & Credentials */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="font-mono font-bold text-[10px] text-gold-dark uppercase tracking-wider mb-1">
                      SECTION 1 &bull; CANDIDATE PROFILE &amp; CONTACT
                    </div>
                    <div><strong>WhatsApp / Mobile:</strong> {selectedRecord.assessmentData.whatsapp || selectedRecord.customerWhatsapp || 'N/A'}</div>
                    <div><strong>Current City &amp; Country:</strong> {selectedRecord.assessmentData.cityCountry || 'N/A'}</div>
                    <div>
                      <strong>LinkedIn Profile:</strong>{' '}
                      {selectedRecord.assessmentData.linkedInUrl ? (
                        <a
                          href={selectedRecord.assessmentData.linkedInUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1 font-semibold"
                        >
                          {selectedRecord.assessmentData.linkedInUrl} <ExternalLink size={11} />
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </div>
                    <div>
                      <strong>Package Enrolled:</strong>{' '}
                      <span className="font-bold text-primary">{selectedRecord.packageTitle} ({selectedRecord.amount ? `$${selectedRecord.amount}` : '$68.00'})</span>
                    </div>

                    {/* Candidate Documents & Downloads */}
                    <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200/90 space-y-2">
                      <div className="font-semibold text-slate-800 text-[11px] flex items-center justify-between">
                        <span>Candidate Documents:</span>
                        <span className="text-[10px] text-slate-400 font-mono">Click to download</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Download CV */}
                        <button
                          type="button"
                          onClick={() => handleDownloadCandidateDoc(selectedRecord, 'resume')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors shadow-2xs cursor-pointer"
                          title="Download Candidate CV / Resume"
                        >
                          <Download size={13} />
                          <span>Download CV ({selectedRecord.assessmentData.resumeFileName || 'Resume.pdf'})</span>
                        </button>

                        {/* Download Cover Letter */}
                        <button
                          type="button"
                          onClick={() => handleDownloadCandidateDoc(selectedRecord, 'cover-letter')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-colors shadow-2xs cursor-pointer"
                          title="Download Candidate Cover Letter / Briefing"
                        >
                          <FileText size={13} />
                          <span>Download Cover Letter ({selectedRecord.assessmentData.coverLetterFileName || 'Cover_Letter.pdf'})</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Section 6: Focus Areas & Time */}
                  <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
                    <div className="font-mono font-bold text-[10px] text-amber-800 uppercase tracking-wider mb-1">
                      TOP 3 FOCUS AREAS &amp; COMMITMENT
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {(selectedRecord.assessmentData.focusAreas || []).map((fa: string) => (
                        <span key={fa} className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full font-bold text-[11px]">
                          ✦ {fa}
                        </span>
                      ))}
                    </div>
                    <div className="pt-1 text-slate-700">
                      <strong>Weekly Time Investment:</strong> {selectedRecord.assessmentData.weeklyTime || 'N/A'}
                    </div>
                  </div>

                  {/* Section 7: Primary Question & Session Notes */}
                  {selectedRecord.assessmentData.oneCareerQuestion && (
                    <div className="p-4 bg-slate-900 text-white rounded-2xl border border-gold/30 space-y-2">
                      <div className="font-mono font-bold text-[10px] text-gold uppercase tracking-wider">
                        CRITICAL QUESTION FOR COACH PRATIBHA
                      </div>
                      <p className="font-serif italic text-sm text-gold/90 bg-white/10 p-3 rounded-xl border border-white/10 leading-relaxed">
                        "{selectedRecord.assessmentData.oneCareerQuestion}"
                      </p>
                      {selectedRecord.assessmentData.feedbackPreference && (
                        <div className="text-[11px] text-slate-300">
                          <strong>Delivery / Feedback Preference:</strong> {selectedRecord.assessmentData.feedbackPreference}
                        </div>
                      )}
                      {selectedRecord.assessmentData.coachingNotes && (
                        <div className="text-[11px] text-amber-200">
                          <strong>Coaching Slot Notes:</strong> {selectedRecord.assessmentData.coachingNotes}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Section 2: Current State & Energy */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                    <div className="font-mono font-bold text-[10px] text-slate-500 uppercase tracking-wider">
                      SECTION 2 &bull; CURRENT STATE &amp; ENERGY PROFILE
                    </div>
                    <div>
                      <strong className="block text-slate-700 mb-0.5">Current Role &amp; Responsibilities:</strong>
                      <p className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                        {selectedRecord.assessmentData.currentRoleDescription || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <strong className="block text-emerald-800 mb-0.5">Energy-Giving Work (Peak Flow):</strong>
                      <p className="bg-white p-2.5 rounded-xl border border-emerald-200 text-slate-800 leading-relaxed">
                        {selectedRecord.assessmentData.workEnergyGiving || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <strong className="block text-rose-800 mb-0.5">Energy-Draining Work:</strong>
                      <p className="bg-white p-2.5 rounded-xl border border-rose-200 text-slate-800 leading-relaxed">
                        {selectedRecord.assessmentData.workEnergyDraining || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Section 3: 3-Year Vision & Obstacles */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                    <div className="font-mono font-bold text-[10px] text-slate-500 uppercase tracking-wider">
                      SECTION 3 &bull; STRATEGIC VISION &amp; ROADBLOCKS
                    </div>
                    <div>
                      <strong className="block text-slate-700 mb-0.5">3-Year Professional Vision:</strong>
                      <p className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                        {selectedRecord.assessmentData.threeYearVision || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <strong className="block text-amber-800 mb-0.5">Single Biggest Obstacle:</strong>
                      <p className="bg-white p-2.5 rounded-xl border border-amber-200 text-slate-800 leading-relaxed">
                        {selectedRecord.assessmentData.singleBiggestObstacle || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <strong className="block text-slate-700 mb-0.5">Why Solving This Now Is Critical:</strong>
                      <p className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                        {selectedRecord.assessmentData.whySolvingImportantNow || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Section 4: AI & Technology Outlook */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                    <div className="font-mono font-bold text-[10px] text-slate-500 uppercase tracking-wider">
                      SECTION 4 &bull; TECHNOLOGY &amp; AI OUTLOOK
                    </div>
                    <div>
                      <strong className="block text-slate-700 mb-0.5">How They Currently Use AI / Tech:</strong>
                      <p className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                        {selectedRecord.assessmentData.howUsingAi || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <strong className="block text-slate-700 mb-0.5">AI Concerns &amp; Worries:</strong>
                      <p className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                        {selectedRecord.assessmentData.aiWorries || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <strong className="block text-slate-700 mb-0.5">Key Areas Seeking AI Leverage:</strong>
                      <p className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                        {selectedRecord.assessmentData.aiEnhancementAreas || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Section 5: Brand & Perception */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                    <div className="font-mono font-bold text-[10px] text-slate-500 uppercase tracking-wider">
                      SECTION 5 &bull; BRAND &amp; REPUTATION
                    </div>
                    <div>
                      <strong className="block text-slate-700 mb-0.5">How Peers Currently Perceive Them:</strong>
                      <p className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                        {selectedRecord.assessmentData.colleaguePerception || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <strong className="block text-slate-700 mb-0.5">Desired Reputation to Build:</strong>
                      <p className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                        {selectedRecord.assessmentData.desiredReputation || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 italic space-y-2">
                  <Clock size={32} className="mx-auto text-slate-300" />
                  <p>Candidate has not submitted their strategic questionnaire answers yet.</p>
                </div>
              )}
            </div>

            {/* Sticky Footer for Fast Action & Close */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] text-slate-500 font-mono">
                Ref: <span className="font-bold text-slate-700">{selectedRecord.paymentId}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadCandidateDoc(selectedRecord, 'resume')}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                >
                  <Download size={13} /> Download CV
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadCandidateDoc(selectedRecord, 'cover-letter')}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                >
                  <FileText size={13} /> Download Letter
                </button>
                <button
                  type="button"
                  onClick={() => setIsDetailsOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Report Status Modal */}
      {isStatusModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleUpdateStatusSubmit}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900">Update Report Status</h3>
                <p className="text-xs text-slate-500">{selectedRecord.customerName} ({selectedRecord.paymentId})</p>
              </div>
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Executive Report Stage
              </label>
              <select
                value={newReportStatus}
                onChange={(e) => setNewReportStatus(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-gold"
              >
                <option value="pending">Pending Audit</option>
                <option value="processing">In Progress / Processing</option>
                <option value="sent">Report Ready &amp; Dispatched</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Strategist Feedback / Notes to Candidate
              </label>
              <textarea
                value={reportNotes}
                onChange={(e) => setReportNotes(e.target.value)}
                placeholder="Include custom feedback, scheduling notes, or key takeaways..."
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Report Download / Cloud Storage Link (Optional)
              </label>
              <input
                type="url"
                value={reportLink}
                onChange={(e) => setReportLink(e.target.value)}
                placeholder="https://drive.google.com/... or cloud PDF URL"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-gold"
              />
            </div>

            {newReportStatus === 'sent' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-medium">
                <AlertCircle size={16} className="text-emerald-600 shrink-0" />
                <span>
                  Marking as <strong>Sent</strong> will automatically dispatch the "Report Ready" email notification to {selectedRecord.customerEmail}.
                </span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 py-3 bg-gold text-slate-950 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-amber-400 transition-all cursor-pointer"
              >
                {isUpdating ? <Loader2 size={16} className="animate-spin" /> : 'Save & Dispatch'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
