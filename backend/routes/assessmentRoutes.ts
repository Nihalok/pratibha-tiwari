import express from 'express';
import {
  createCheckoutSession,
  getPaymentStatus,
  checkAssessmentAccess,
  submitAssessment,
  getPaymentReceipt,
  getAdminAssessments,
  updateReportStatus
} from '../controllers/assessmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / Candidate Assessment Routes
router.post('/create-checkout-session', createCheckoutSession);
router.get('/payment-status/:sessionId', getPaymentStatus);
router.get('/access-check', checkAssessmentAccess);
router.post('/submit', submitAssessment);
router.get('/receipt/:paymentId', getPaymentReceipt);

// Admin Management Routes
router.get('/admin/list', protect, getAdminAssessments);
router.put('/admin/:id/report-status', protect, updateReportStatus);

export default router;
