import express from 'express';
import {
  createCheckoutSession,
  getPaymentStatus,
  checkAssessmentAccess,
  submitAssessment,
  submitOfflineAssessment,
  getPaymentReceipt,
  downloadCandidateDocument,
  getAdminAssessments,
  updateReportStatus,
  syncStripePayment,
  deleteAssessmentRecord,
  getAssessmentStats
} from '../controllers/assessmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / Candidate Assessment Routes
router.post('/create-checkout-session', createCheckoutSession);
router.get('/payment-status/:sessionId', getPaymentStatus);
router.get('/access-check', checkAssessmentAccess);
router.post('/submit', submitAssessment);
router.post('/offline-submit', submitOfflineAssessment);
router.get('/receipt/:paymentId', getPaymentReceipt);
router.get('/document/:id/:type', downloadCandidateDocument);

// Admin Management & Real-time Sync Routes
router.get('/admin/list', protect, getAdminAssessments);
router.get('/admin/stats', protect, getAssessmentStats);
router.put('/admin/:id/report-status', protect, updateReportStatus);
router.post('/admin/:id/sync-stripe', protect, syncStripePayment);
router.delete('/admin/:id', protect, deleteAssessmentRecord);

export default router;

