/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
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
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  assessmentStatus: 'not_started' | 'in_progress' | 'completed';
  reportStatus: 'pending' | 'processing' | 'sent';
  paymentDate?: string;
  submittedAt?: string;
  assessmentData?: any;
  reportNotes?: string;
  createdAt: string;
}

export default function AssessmentsManagement() {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'sent'>('all');

  const [selectedRecord, setSelectedRecord] = useState<AssessmentRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const [newReportStatus, setNewReportStatus] = useState<'pending' | 'processing' | 'sent'>('processing');
  const [reportNotes, setReportNotes] = useState('');
  const [reportLink, setReportLink] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/assessment/admin/list', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAssessments(data.data || []);
      }
    } catch (err) {
      console.error('[Fetch Admin Assessments Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleUpdateStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/assessment/admin/${selectedRecord._id}/report-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          reportStatus: newReportStatus,
          reportNotes: reportNotes.trim(),
          reportLink: reportLink.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsStatusModalOpen(false);
        fetchAssessments();
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

  const filtered = assessments.filter(item => {
    const matchesSearch = 
      item.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.paymentId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === 'all' || item.reportStatus === statusFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/15 text-amber-800 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Sparkles size={14} /> Candidate Audit Portal
          </div>
          <h1 className="text-3xl font-serif text-slate-900 font-bold">Assessment & Payment Management</h1>
          <p className="text-slate-500 text-sm mt-1">
            Audit candidate answers, track Stripe payments, and dispatch executive reports.
          </p>
        </div>

        <button
          onClick={fetchAssessments}
          disabled={loading}
          className="bg-white border border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl font-medium text-xs flex items-center gap-2 hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate, email, or payment ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={14} className="text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">Filter Status:</span>
          {(['all', 'pending', 'processing', 'sent'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 size={32} className="animate-spin text-gold mx-auto" />
          <p className="text-slate-500 text-sm">Loading candidates and payments...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
          <FileText size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="font-semibold text-slate-700">No Assessment Records Found</p>
          <p className="text-xs text-slate-400 mt-1">Stripe payments and submitted questionnaires will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono tracking-wider">
                  <th className="p-4">Candidate & Contact</th>
                  <th className="p-4">Package</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Assessment Status</th>
                  <th className="p-4">Report Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filtered.map(record => (
                  <tr key={record._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 text-sm">{record.customerName}</div>
                      <div className="text-slate-500">{record.customerEmail}</div>
                      {record.customerWhatsapp && (
                        <div className="text-[11px] text-emerald-700 font-mono mt-0.5">
                          WA: {record.customerWhatsapp}
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-slate-800">{record.packageTitle}</span>
                      <div className="text-slate-400 text-[10px] font-mono mt-0.5">
                        Ref: {record.paymentId}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-slate-900">${record.amount.toFixed(2)}</div>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono mt-0.5 ${
                        record.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {record.paymentStatus}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        record.assessmentStatus === 'completed' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {record.assessmentStatus === 'completed' ? (
                          <><CheckCircle2 size={12} /> Completed</>
                        ) : (
                          <><Clock size={12} /> Not Started</>
                        )}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider font-mono ${
                        record.reportStatus === 'sent' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : record.reportStatus === 'processing' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {record.reportStatus}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setIsDetailsOpen(true);
                        }}
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-xs inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye size={13} /> View Answers
                      </button>

                      <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setNewReportStatus(record.reportStatus);
                          setReportNotes(record.reportNotes || '');
                          setIsStatusModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-gold text-slate-950 font-bold rounded-lg hover:bg-amber-400 transition-colors text-xs inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Send size={13} /> Update Status
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-serif">{selectedRecord.customerName} — Answers</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedRecord.customerEmail} • {selectedRecord.paymentId}</p>
              </div>
              <button onClick={() => setIsDetailsOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-4 text-xs text-slate-800">
              {selectedRecord.assessmentData ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div><strong>WhatsApp:</strong> {selectedRecord.assessmentData.whatsapp || 'N/A'}</div>
                    <div><strong>City & Country:</strong> {selectedRecord.assessmentData.cityCountry || 'N/A'}</div>
                    <div><strong>LinkedIn URL:</strong> {selectedRecord.assessmentData.linkedInUrl || 'N/A'}</div>
                    <div><strong>Resume File:</strong> {selectedRecord.assessmentData.resumeFileName || 'N/A'}</div>
                    <div><strong>Focus Areas:</strong> {(selectedRecord.assessmentData.focusAreas || []).join(', ') || 'N/A'}</div>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2 text-slate-800">
                    <div><strong>Current Role:</strong> {selectedRecord.assessmentData.currentRoleDescription || 'N/A'}</div>
                    <div><strong>3-Year Vision:</strong> {selectedRecord.assessmentData.threeYearVision || 'N/A'}</div>
                    <div><strong>Single Biggest Obstacle:</strong> {selectedRecord.assessmentData.singleBiggestObstacle || 'N/A'}</div>
                    <div><strong>AI Worries / Concerns:</strong> {selectedRecord.assessmentData.aiWorries || 'N/A'}</div>
                    <div><strong>One Career Question:</strong> {selectedRecord.assessmentData.oneCareerQuestion || 'N/A'}</div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 italic">Candidate has not submitted questionnaire answers yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Update Report Status Modal */}
      {isStatusModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleUpdateStatusSubmit} className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-lg font-serif font-bold text-slate-900">Update Report Status</h3>
              <button type="button" onClick={() => setIsStatusModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Report Status</label>
              <select
                value={newReportStatus}
                onChange={(e) => setNewReportStatus(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
              >
                <option value="pending">Pending Audit</option>
                <option value="processing">In Progress / Processing</option>
                <option value="sent">Report Completed & Sent to Customer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Strategist Notes / Message</label>
              <textarea
                value={reportNotes}
                onChange={(e) => setReportNotes(e.target.value)}
                placeholder="Include custom feedback or notes to candidate..."
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Report Download Link (Optional)</label>
              <input
                type="url"
                value={reportLink}
                onChange={(e) => setReportLink(e.target.value)}
                placeholder="https://drive.google.com/... or report PDF link"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800"
              />
            </div>

            {newReportStatus === 'sent' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-medium">
                <AlertCircle size={16} className="text-emerald-600 shrink-0" />
                <span>Marking as <strong>Sent</strong> will automatically dispatch the "Report Ready" email to {selectedRecord.customerEmail}.</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 py-3 bg-gold text-slate-950 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-amber-400"
              >
                {isUpdating ? <Loader2 size={16} className="animate-spin" /> : 'Save & Update'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
