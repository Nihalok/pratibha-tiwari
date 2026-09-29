import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Stripe from 'stripe';
import AssessmentPayment from '../models/AssessmentPayment.js';
import {
  sendPaymentConfirmationEmail,
  sendAssessmentCompletedEmail,
  sendAdminNotificationEmail,
  sendReportReadyEmail
} from '../utils/emailTemplates.js';
import { jsPDF } from 'jspdf';

// Helper to initialize Stripe securely
const getStripe = (): Stripe | null => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.warn('[Stripe Warning] STRIPE_SECRET_KEY is not defined in environment variables.');
    return null;
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-02-24.acacia' as any
  });
};

/**
 * POST /api/assessment/create-checkout-session
 * Creates a Stripe Checkout Session for Premium Assessment
 */
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { packageId = 'report', customerEmail, customerName, customerWhatsapp } = req.body;

    const isPlatinum = packageId === 'platinum';
    const defaultPrice = isPlatinum ? 98 : 68;
    const envPrice = process.env.PREMIUM_ASSESSMENT_PRICE ? Number(process.env.PREMIUM_ASSESSMENT_PRICE) : defaultPrice;
    const finalAmount = isPlatinum && defaultPrice === 98 ? 98 : envPrice;

    const packageTitle = isPlatinum 
      ? 'Platinum Package: Report + 45-Min Live Coaching' 
      : 'Premium AI Career Intelligence Report';

    const stripe = getStripe();

    const originHeader = req.get('origin') || req.get('referer');
    let dynamicOrigin = '';
    if (originHeader) {
      try {
        const parsed = new URL(originHeader);
        dynamicOrigin = `${parsed.protocol}//${parsed.host}`;
      } catch (_e) {}
    }
    const frontendUrl = dynamicOrigin || process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;

    const paymentId = `PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (!stripe) {
      return res.status(400).json({
        success: false,
        message: 'Stripe API Key is not configured. Please add STRIPE_SECRET_KEY to your .env file.'
      });
    }

    // Standard Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: packageTitle,
              description: `Executive AI Career Intelligence Blueprint for ${customerName || 'Candidate'}. Includes bespoke audit and direct delivery.`,
            },
            unit_amount: Math.round(finalAmount * 100), // convert to cents
          },
          quantity: 1,
        },
      ],
      success_url: `${frontendUrl}/assessment/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/assessment/premium?canceled=true`,
      metadata: {
        paymentId,
        packageId,
        packageTitle,
        customerName: customerName || '',
        customerWhatsapp: customerWhatsapp || ''
      }
    });

    // Create pending database record
    await AssessmentPayment.create({
      paymentId,
      stripeSessionId: session.id,
      customerName: customerName || 'Valued Candidate',
      customerEmail: customerEmail || session.customer_email || 'candidate@example.com',
      customerWhatsapp: customerWhatsapp || '',
      packageId,
      packageTitle,
      amount: finalAmount,
      currency: 'usd',
      paymentStatus: 'pending',
      assessmentStatus: 'not_started',
      reportStatus: 'pending'
    });

    return res.json({
      success: true,
      url: session.url,
      sessionId: session.id
    });
  } catch (err: any) {
    console.error('[Create Checkout Error]', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to initialize payment checkout session.',
      error: err.message
    });
  }
};

/**
 * POST /api/stripe/webhook
 * Stripe Webhook Handler for verifying payments server-side
 */
export const handleStripeWebhook = async (req: Request, res: Response) => {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    console.warn('[Webhook Warning] Stripe or STRIPE_WEBHOOK_SECRET missing.');
    return res.status(400).json({ success: false, message: 'Webhook secret not configured' });
  }

  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`[Webhook Signature Failure] ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle checkout completion
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log(`[Webhook Event] checkout.session.completed for ${session.id}`);

    try {
      let paymentRecord = await AssessmentPayment.findOne({ stripeSessionId: session.id });

      const customerEmail = session.customer_details?.email || session.customer_email || paymentRecord?.customerEmail || 'candidate@example.com';
      const customerName = session.customer_details?.name || session.metadata?.customerName || paymentRecord?.customerName || 'Valued Candidate';
      const packageTitle = session.metadata?.packageTitle || paymentRecord?.packageTitle || 'Premium AI Career Intelligence Report';
      const amountPaid = session.amount_total ? session.amount_total / 100 : (paymentRecord?.amount || 68);

      if (paymentRecord) {
        // Idempotency: skip if already paid
        if (paymentRecord.paymentStatus === 'paid') {
          console.log(`[Webhook] Session ${session.id} is already marked as paid.`);
          return res.json({ received: true });
        }
        paymentRecord.paymentStatus = 'paid';
        paymentRecord.stripePaymentIntentId = session.payment_intent as string || '';
        paymentRecord.paymentDate = new Date();
        paymentRecord.customerEmail = customerEmail;
        paymentRecord.customerName = customerName;
        await paymentRecord.save();
      } else {
        const paymentId = session.metadata?.paymentId || `PAY-${Date.now()}`;
        paymentRecord = await AssessmentPayment.create({
          paymentId,
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent as string || '',
          customerName,
          customerEmail,
          customerWhatsapp: session.metadata?.customerWhatsapp || '',
          packageId: (session.metadata?.packageId as any) || 'report',
          packageTitle,
          amount: amountPaid,
          currency: session.currency || 'usd',
          paymentStatus: 'paid',
          paymentDate: new Date(),
          assessmentStatus: 'not_started',
          reportStatus: 'pending'
        });
      }

      // Dispatch confirmation email to customer & alert admin
      const dateFormatted = new Date().toLocaleDateString('en-US', { dateStyle: 'medium' });
      const amountFormatted = `$${amountPaid.toFixed(2)}`;

      await sendPaymentConfirmationEmail({
        customerName,
        customerEmail,
        packageTitle,
        amountFormatted,
        paymentDate: dateFormatted,
        referenceId: paymentRecord.paymentId,
        sessionId: session.id
      });

      await sendAdminNotificationEmail({
        event: 'payment_received',
        customerName,
        customerEmail,
        packageTitle,
        amountFormatted,
        referenceId: paymentRecord.paymentId
      });

    } catch (dbErr) {
      console.error('[Webhook DB Error]', dbErr);
    }
  }

  return res.json({ received: true });
};

/**
 * GET /api/assessment/payment-status/:sessionId
 * Verified Payment Status Check for Frontend Gatekeeper
 */
export const getPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID is required' });
    }

    let record = await AssessmentPayment.findOne({ stripeSessionId: sessionId });

    // Fallback: If DB status is not paid yet, check directly with Stripe API
    const stripe = getStripe();
    if (stripe && record && record.paymentStatus !== 'paid') {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session && session.payment_status === 'paid') {
          record.paymentStatus = 'paid';
          record.stripePaymentIntentId = session.payment_intent as string || '';
          record.paymentDate = new Date();
          record.customerEmail = session.customer_details?.email || session.customer_email || record.customerEmail;
          record.customerName = session.customer_details?.name || record.customerName;
          await record.save();

          // Dispatch confirmation email & admin alert
          const amountPaid = record.amount;
          await sendPaymentConfirmationEmail({
            customerName: record.customerName,
            customerEmail: record.customerEmail,
            packageTitle: record.packageTitle,
            amountFormatted: `$${amountPaid.toFixed(2)}`,
            paymentDate: new Date().toLocaleDateString('en-US', { dateStyle: 'medium' }),
            referenceId: record.paymentId,
            sessionId: session.id
          });
          await sendAdminNotificationEmail({
            event: 'payment_received',
            customerName: record.customerName,
            customerEmail: record.customerEmail,
            packageTitle: record.packageTitle,
            amountFormatted: `$${amountPaid.toFixed(2)}`,
            referenceId: record.paymentId
          });
        }
      } catch (stripeErr) {
        console.warn('[Stripe Status Retrieve Warning]', stripeErr);
      }
    }

    if (!record) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: 'No payment record found for this session ID.'
      });
    }

    return res.json({
      success: true,
      verified: record.paymentStatus === 'paid',
      paymentId: record.paymentId,
      customerName: record.customerName,
      customerEmail: record.customerEmail,
      packageTitle: record.packageTitle,
      packageId: record.packageId,
      amount: record.amount,
      amountFormatted: `$${record.amount.toFixed(2)}`,
      paymentStatus: record.paymentStatus,
      assessmentStatus: record.assessmentStatus,
      reportStatus: record.reportStatus,
      paymentDate: record.paymentDate || record.createdAt
    });
  } catch (err: any) {
    console.error('[Get Payment Status Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to verify payment status.' });
  }
};

/**
 * GET /api/assessment/access-check?session_id=...
 * Server-side verification for accessing the Premium Assessment Questionnaire
 */
export const checkAssessmentAccess = async (req: Request, res: Response) => {
  try {
    const sessionId = (req.query.session_id as string) || (req.headers['x-session-id'] as string);

    if (!sessionId) {
      return res.status(403).json({
        success: false,
        accessGranted: false,
        message: 'Payment verification required to access Premium Assessment.'
      });
    }

    const record = await AssessmentPayment.findOne({ stripeSessionId: sessionId });

    if (!record || record.paymentStatus !== 'paid') {
      return res.status(403).json({
        success: false,
        accessGranted: false,
        message: 'Payment not completed or verified.'
      });
    }

    return res.json({
      success: true,
      accessGranted: true,
      paymentId: record.paymentId,
      customerName: record.customerName,
      customerEmail: record.customerEmail,
      packageId: record.packageId,
      packageTitle: record.packageTitle,
      assessmentStatus: record.assessmentStatus
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, accessGranted: false, message: 'Server error checking access.' });
  }
};

/**
 * POST /api/assessment/submit
 * Saves user questionnaire responses and marks assessment as completed
 */
export const submitAssessment = async (req: Request, res: Response) => {
  try {
    const { sessionId, paymentId, formData, answers } = req.body;

    let record = null;
    if (sessionId) {
      record = await AssessmentPayment.findOne({ stripeSessionId: sessionId });
    }
    if (!record && paymentId) {
      record = await AssessmentPayment.findOne({ paymentId });
    }

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found. Unable to link submission.'
      });
    }

    if (record.paymentStatus !== 'paid') {
      return res.status(403).json({
        success: false,
        message: 'Payment has not been completed.'
      });
    }

    // Prevent duplicate submission overwrites if desired, or update record
    record.customerName = formData?.fullName || record.customerName;
    record.customerEmail = formData?.email || record.customerEmail;
    record.customerWhatsapp = formData?.whatsapp || record.customerWhatsapp;
    record.assessmentData = {
      ...formData,
      answers: answers || formData?.answers || {}
    };
    record.assessmentStatus = 'completed';
    record.reportStatus = 'pending';
    record.submittedAt = new Date();

    await record.save();

    // Dispatch completion emails
    const submissionDateFormatted = new Date().toLocaleDateString('en-US', { dateStyle: 'medium' });
    await sendAssessmentCompletedEmail({
      customerName: record.customerName,
      customerEmail: record.customerEmail,
      referenceId: record.paymentId,
      submissionDate: submissionDateFormatted
    });

    await sendAdminNotificationEmail({
      event: 'assessment_submitted',
      customerName: record.customerName,
      customerEmail: record.customerEmail,
      customerWhatsapp: record.customerWhatsapp,
      packageTitle: record.packageTitle,
      amountFormatted: `$${record.amount.toFixed(2)}`,
      referenceId: record.paymentId,
      formData: record.assessmentData,
      details: `WhatsApp: ${record.customerWhatsapp}\nFocus Areas: ${JSON.stringify(formData?.focusAreas || [])}`
    });

    return res.json({
      success: true,
      message: 'Assessment submitted successfully.',
      paymentId: record.paymentId,
      submittedAt: record.submittedAt,
      reportStatus: record.reportStatus
    });
  } catch (err: any) {
    console.error('[Submit Assessment Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to submit assessment.' });
  }
};

/**
 * GET /api/assessment/receipt/:paymentId
 * Generates and downloads official PDF payment receipt
 */
export const getPaymentReceipt = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const record = await AssessmentPayment.findOne({ paymentId });

    if (!record || record.paymentStatus !== 'paid') {
      return res.status(404).json({ success: false, message: 'Valid payment record not found.' });
    }

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    doc.setFillColor(10, 25, 41); // #0A1929
    doc.rect(0, 0, 210, 45, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('PRATIBHA TIWARI', 15, 22);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(212, 175, 55); // Gold
    doc.text('EXECUTIVE AI CAREER STRATEGY & LEADERSHIP PRACTICE', 15, 30);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('OFFICIAL PAYMENT RECEIPT', 15, 58);

    doc.setDrawColor(226, 232, 240);
    doc.line(15, 62, 195, 62);

    let y = 74;
    const addLine = (label: string, val: string) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(label, 15, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(val, 70, y);
      y += 9;
    };

    addLine('Receipt Reference:', record.paymentId);
    addLine('Stripe Transaction:', record.stripePaymentIntentId || record.stripeSessionId);
    addLine('Payment Date:', (record.paymentDate || record.createdAt).toLocaleDateString());
    addLine('Candidate Name:', record.customerName);
    addLine('Email Address:', record.customerEmail);
    addLine('Assessment Package:', record.packageTitle);
    addLine('Amount Paid:', `$${record.amount.toFixed(2)} USD`);
    addLine('Payment Status:', 'PAID (VERIFIED)');

    y += 10;
    doc.line(15, y, 195, y);
    y += 15;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Thank you for investing in your career future with Coach Pratibha Tiwari.', 15, y);
    y += 6;
    doc.text('For queries regarding your report status, email support@pratibhatiwari.com.', 15, y);

    const pdfBuffer = doc.output('arraybuffer');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Receipt_${record.paymentId}.pdf`);
    return res.send(Buffer.from(pdfBuffer));
  } catch (err: any) {
    console.error('[Receipt Gen Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to generate receipt PDF.' });
  }
};

/**
 * GET /api/assessment/document/:id/:type
 * Stream / download candidate's uploaded CV or Cover Letter
 */
export const downloadCandidateDocument = async (req: Request, res: Response) => {
  try {
    const { id, type } = req.params; // type = 'resume' | 'cover-letter'
    
    let record = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      record = await AssessmentPayment.findById(id);
    }
    if (!record) {
      record = await AssessmentPayment.findOne({
        $or: [
          { paymentId: id },
          { stripeSessionId: id }
        ]
      });
    }

    if (!record) {
      return res.status(404).send('Candidate assessment record not found.');
    }

    const isResume = type === 'resume';
    const assessmentData = record.assessmentData || {};
    const dataUrl = isResume 
      ? (assessmentData.resumeDataUrl || assessmentData.resumeUrl)
      : (assessmentData.coverLetterDataUrl || assessmentData.coverLetterUrl);
    const rawFileName = isResume
      ? (assessmentData.resumeFileName || `${record.customerName || 'Candidate'}_Resume.pdf`)
      : (assessmentData.coverLetterFileName || `${record.customerName || 'Candidate'}_Cover_Letter.pdf`);
    const cleanFileName = rawFileName.replace(/[^a-zA-Z0-9._-]/g, '_');

    // 1. If candidate uploaded a base64 Data URL
    if (dataUrl && typeof dataUrl === 'string' && dataUrl.startsWith('data:')) {
      const commaIdx = dataUrl.indexOf(',');
      if (commaIdx !== -1) {
        const meta = dataUrl.substring(5, commaIdx);
        const mimeType = meta.split(';')[0] || (cleanFileName.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream');
        const base64Data = dataUrl.substring(commaIdx + 1).replace(/[\r\n\s]/g, '');
        const buffer = Buffer.from(base64Data, 'base64');
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${cleanFileName}"`);
        res.setHeader('Content-Length', buffer.length.toString());
        return res.send(buffer);
      }
    }

    // 2. If candidate document is an external URL (Cloudinary / S3)
    if (dataUrl && typeof dataUrl === 'string' && (dataUrl.startsWith('http://') || dataUrl.startsWith('https://'))) {
      return res.redirect(dataUrl);
    }

    // 3. Synthesize candidate profile brief PDF fallback
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

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${cleanFileName.endsWith('.pdf') ? cleanFileName : `${cleanFileName}.pdf`}"`);
    return res.send(pdfBuffer);
  } catch (err: any) {
    console.error('[Download Document Error]', err);
    return res.status(500).send('Failed to retrieve candidate document.');
  }
};

/**
 * Auto-seed initial demonstration leads if collection is empty
 */
const seedDefaultAssessmentLeadsIfEmpty = async () => {
  try {
    const count = await AssessmentPayment.countDocuments();
    if (count > 0) return;

    console.log('[Seed] Seeding initial demonstration assessment leads for Coach Pratibha...');
    await AssessmentPayment.create([
      {
        paymentId: 'PAY-108492-7491',
        stripeSessionId: 'cs_live_seed_david_sterling',
        customerName: 'David Sterling',
        customerEmail: 'david.sterling@acme-corp.com',
        customerWhatsapp: '+971 50 123 4567',
        packageId: 'platinum',
        packageTitle: 'Platinum Package: Report + 45-Min Live Coaching (ICF-PCC)',
        amount: 98,
        currency: 'usd',
        paymentStatus: 'paid',
        assessmentStatus: 'completed',
        reportStatus: 'processing',
        paymentDate: new Date(Date.now() - 36 * 3600 * 1000),
        submittedAt: new Date(Date.now() - 34 * 3600 * 1000),
        assessmentData: {
          fullName: 'David Sterling',
          email: 'david.sterling@acme-corp.com',
          whatsapp: '+971 50 123 4567',
          cityCountry: 'Dubai, UAE',
          linkedInUrl: 'https://linkedin.com/in/david-sterling-exec',
          resumeFileName: 'David_Sterling_VP_Engineering_CV.pdf',
          packageId: 'platinum',
          packageTitle: 'Platinum Package: Report + 45-Min Live Coaching (ICF-PCC)',
          packagePrice: '$98.00',
          currentRoleDescription: 'VP of Product Engineering leading 45 engineers across EMEA.',
          workEnergyGiving: 'Mentoring senior leads, architectural vision, strategic client pitches.',
          workEnergyDraining: 'Repetitive bureaucratic status meetings and manual sprint reporting.',
          threeYearVision: 'Ascend to Chief Technology Officer (CTO) or Senior VP in an enterprise scale-up.',
          singleBiggestObstacle: 'Bridging the gap between hands-on engineering and executive C-suite presence.',
          whySolvingImportantNow: 'Company restructuring within next 6 months presents an open CTO seat.',
          howUsingAi: 'Using GitHub Copilot and Claude for system architecture diagrams and code reviews.',
          aiWorries: 'Team members becoming overly reliant on LLMs without deep architectural fundamentals.',
          aiEnhancementAreas: 'Executive predictive intelligence, automated delivery forecasting.',
          colleaguePerception: 'Highly reliable technical powerhouse, but sometimes reserved in town halls.',
          desiredReputation: 'Inspiring visionary leader who speaks fluent business and drives revenue.',
          focusAreas: ['Leadership Growth', 'Personal Branding', 'Executive Presence'],
          weeklyTime: '3–5 hours / week',
          oneCareerQuestion: 'How can I strategically position myself to the Board for the CTO appointment over an external hire?',
          feedbackPreference: 'Video walkthrough + detailed PDF report',
          coachingNotes: 'Weekdays after 6:30 PM GST or Sunday morning.'
        }
      },
      {
        paymentId: 'PAY-209418-8214',
        stripeSessionId: 'cs_live_seed_priya_nair',
        customerName: 'Priya Nair',
        customerEmail: 'priya.nair@globaltech.io',
        customerWhatsapp: '+91 98765 43210',
        packageId: 'report',
        packageTitle: 'Executive Career Intelligence & Strategy Report',
        amount: 68,
        currency: 'usd',
        paymentStatus: 'paid',
        assessmentStatus: 'completed',
        reportStatus: 'pending',
        paymentDate: new Date(Date.now() - 14 * 3600 * 1000),
        submittedAt: new Date(Date.now() - 12 * 3600 * 1000),
        assessmentData: {
          fullName: 'Priya Nair',
          email: 'priya.nair@globaltech.io',
          whatsapp: '+91 98765 43210',
          cityCountry: 'Bengaluru, India',
          linkedInUrl: 'https://linkedin.com/in/priya-nair-strategy',
          resumeFileName: 'Priya_Nair_Director_Transformation.pdf',
          packageId: 'report',
          packageTitle: 'Executive Career Intelligence & Strategy Report',
          packagePrice: '$68.00',
          currentRoleDescription: 'Director of Digital Transformation & Customer Experience',
          workEnergyGiving: 'Designing 0-to-1 customer operating models and cross-functional hackathons.',
          workEnergyDraining: 'Legacy tool migrations and vendor procurement red-tape.',
          threeYearVision: 'Global Head of Transformation across APAC & Europe.',
          singleBiggestObstacle: 'Imposter syndrome when presenting strategic transformation budgets to executive board.',
          whySolvingImportantNow: 'Annual appraisal and promotion cycle begins next month.',
          howUsingAi: 'Implementing conversational AI and workflow automations.',
          aiWorries: 'Rapid automation rendering middle-management transformation roles obsolete.',
          aiEnhancementAreas: 'AI strategy orchestration and ROI frameworks.',
          colleaguePerception: 'Resourceful problem solver and empathetic people manager.',
          desiredReputation: 'High-impact change agent who navigates ambiguity and delivers measurable ROI.',
          focusAreas: ['Confidence Building', 'Salary Growth', 'Career Transition'],
          weeklyTime: '5+ hours / week',
          oneCareerQuestion: 'How can I negotiate a 40%+ compensation package when stepping into an international APAC leadership role?',
          feedbackPreference: 'Detailed PDF report'
        }
      },
      {
        paymentId: 'PAY-319582-9901',
        stripeSessionId: 'cs_live_seed_michael_chen',
        customerName: 'Michael Chen',
        customerEmail: 'michael.chen@fintech.sg',
        customerWhatsapp: '+65 9123 4567',
        packageId: 'report',
        packageTitle: 'Executive Career Intelligence & Strategy Report',
        amount: 68,
        currency: 'usd',
        paymentStatus: 'pending',
        assessmentStatus: 'not_started',
        reportStatus: 'pending',
        assessmentData: {
          fullName: 'Michael Chen',
          email: 'michael.chen@fintech.sg',
          whatsapp: '+65 9123 4567',
          cityCountry: 'Singapore'
        }
      }
    ]);
    console.log('[Seed] Initial assessment leads successfully seeded.');
  } catch (seedErr) {
    console.warn('[Seed Warning] Failed to seed assessment leads:', seedErr);
  }
};

/**
 * POST /api/assessment/offline-submit
 * Handles QR code / UPI verification submissions and saves directly into AssessmentPayment
 */
export const submitOfflineAssessment = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      whatsapp,
      cityCountry,
      packageId,
      packageTitle,
      packagePrice,
      utrNumber,
      hasScreenshot,
      screenshotName,
      coachingNotes,
      answers,
      ...otherData
    } = req.body;

    const paymentId = `PAY-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const isPlatinum = packageId === 'platinum' || packagePrice === '$98.00' || packagePrice === '$98';
    const amountNum = isPlatinum ? 98 : 68;

    const assessmentData = {
      fullName,
      email,
      whatsapp,
      cityCountry,
      packageId: isPlatinum ? 'platinum' : 'report',
      packageTitle: packageTitle || (isPlatinum ? 'Platinum Package: Report + 45-Min Live Coaching (ICF-PCC)' : 'Executive Career Intelligence & Strategy Report'),
      packagePrice: packagePrice || (isPlatinum ? '$98.00' : '$68.00'),
      utrNumber: utrNumber || 'N/A',
      hasScreenshot: !!hasScreenshot,
      screenshotName: screenshotName || '',
      coachingNotes: coachingNotes || '',
      answers: answers || {},
      ...otherData
    };

    const record = await AssessmentPayment.create({
      paymentId,
      stripeSessionId: `offline_qr_${Date.now()}`,
      customerName: fullName || 'Valued Candidate',
      customerEmail: email || 'candidate@example.com',
      customerWhatsapp: whatsapp || '',
      packageId: isPlatinum ? 'platinum' : 'report',
      packageTitle: assessmentData.packageTitle,
      amount: amountNum,
      currency: 'usd',
      paymentStatus: 'paid',
      assessmentStatus: 'completed',
      reportStatus: 'pending',
      submittedAt: new Date(),
      paymentDate: new Date(),
      assessmentData
    });

    try {
      await sendAssessmentCompletedEmail({
        customerName: record.customerName,
        customerEmail: record.customerEmail,
        referenceId: record.paymentId,
        submissionDate: new Date().toLocaleDateString('en-US', { dateStyle: 'medium' })
      });
    } catch (emailErr) {
      console.warn('[Offline Submit Email Warning]', emailErr);
    }

    try {
      await sendAdminNotificationEmail({
        event: 'assessment_submitted',
        customerName: record.customerName,
        customerEmail: record.customerEmail,
        customerWhatsapp: record.customerWhatsapp,
        packageTitle: record.packageTitle,
        amountFormatted: `$${amountNum.toFixed(2)} (Ref: ${utrNumber || 'Verified'})`,
        referenceId: record.paymentId,
        formData: assessmentData,
        details: `Offline QR / UPI Verification\nUTR / Ref: ${utrNumber || 'Screenshot Attached'}\nWhatsApp: ${whatsapp}`
      });
    } catch (adminEmailErr) {
      console.warn('[Offline Submit Admin Email Warning]', adminEmailErr);
    }

    return res.json({
      success: true,
      message: 'Assessment and payment proof submitted successfully.',
      paymentId: record.paymentId,
      record
    });
  } catch (err: any) {
    console.error('[Offline Submit Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to process offline assessment submission.' });
  }
};

/**
 * ADMIN: GET /api/admin/assessments
 * List all assessment payments and submissions
 */
export const getAdminAssessments = async (req: Request, res: Response) => {
  try {
    await seedDefaultAssessmentLeadsIfEmpty();
    const list = await AssessmentPayment.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: list });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch assessments' });
  }
};

/**
 * ADMIN: PUT /api/admin/assessments/:id/report-status
 * Update report status ('pending' | 'processing' | 'sent') and notify candidate
 */
export const updateReportStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reportStatus, reportNotes, reportLink } = req.body;

    const record = await AssessmentPayment.findById(id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Assessment record not found' });
    }

    record.reportStatus = reportStatus;
    if (reportNotes !== undefined) record.reportNotes = reportNotes;
    if (reportStatus === 'sent') {
      record.reportSentAt = new Date();
    }
    await record.save();

    // Trigger report-sent email if status is marked as 'sent'
    if (reportStatus === 'sent') {
      await sendReportReadyEmail({
        customerName: record.customerName,
        customerEmail: record.customerEmail,
        packageTitle: record.packageTitle,
        reportNotes,
        reportLink
      });
    }

    return res.json({ success: true, message: `Report status updated to ${reportStatus}`, data: record });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to update report status' });
  }
};

/**
 * ADMIN: POST /api/assessment/admin/:id/sync-stripe
 * Syncs the real-time Stripe checkout session status with MongoDB
 */
export const syncStripePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const record = await AssessmentPayment.findById(id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Assessment/Lead record not found' });
    }

    const stripe = getStripe();
    if (!stripe) {
      return res.status(400).json({ success: false, message: 'Stripe API key is not configured' });
    }

    if (!record.stripeSessionId) {
      return res.status(400).json({ success: false, message: 'No Stripe Session ID found on this record' });
    }

    const session = await stripe.checkout.sessions.retrieve(record.stripeSessionId);

    if (session) {
      const isNowPaid = session.payment_status === 'paid';
      const prevStatus = record.paymentStatus;

      if (isNowPaid) {
        record.paymentStatus = 'paid';
        record.stripePaymentIntentId = (session.payment_intent as string) || record.stripePaymentIntentId || '';
        if (!record.paymentDate) record.paymentDate = new Date();
        record.customerEmail = session.customer_details?.email || session.customer_email || record.customerEmail;
        record.customerName = session.customer_details?.name || record.customerName;
      } else if (session.status === 'expired' && record.paymentStatus === 'pending') {
        record.paymentStatus = 'failed';
      }

      if (session.payment_intent && !record.stripePaymentIntentId) {
        record.stripePaymentIntentId = session.payment_intent as string;
      }

      await record.save();

      // If status just became paid, send confirmation emails
      if (isNowPaid && prevStatus !== 'paid') {
        const amountPaid = record.amount;
        await sendPaymentConfirmationEmail({
          customerName: record.customerName,
          customerEmail: record.customerEmail,
          packageTitle: record.packageTitle,
          amountFormatted: `$${amountPaid.toFixed(2)}`,
          paymentDate: new Date().toLocaleDateString('en-US', { dateStyle: 'medium' }),
          referenceId: record.paymentId,
          sessionId: session.id
        });
      }
    }

    return res.json({
      success: true,
      message: `Stripe sync complete. Status: ${record.paymentStatus.toUpperCase()}`,
      stripeStatus: session?.payment_status,
      data: record
    });
  } catch (err: any) {
    console.error('[Sync Stripe Error]', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to sync with Stripe gateway'
    });
  }
};

/**
 * ADMIN: DELETE /api/assessment/admin/:id
 * Remove an assessment/lead record
 */
export const deleteAssessmentRecord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const record = await AssessmentPayment.findByIdAndDelete(id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    return res.json({ success: true, message: 'Record deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to delete record' });
  }
};

/**
 * ADMIN: GET /api/assessment/admin/stats
 * Real-time stats for leads and enrollments
 */
export const getAssessmentStats = async (req: Request, res: Response) => {
  try {
    await seedDefaultAssessmentLeadsIfEmpty();
    const [
      totalRecords,
      paidRecords,
      pendingRecords,
      completedAssessments,
      sentReports
    ] = await Promise.all([
      AssessmentPayment.countDocuments(),
      AssessmentPayment.find({ paymentStatus: 'paid' }),
      AssessmentPayment.countDocuments({ paymentStatus: 'pending' }),
      AssessmentPayment.countDocuments({ assessmentStatus: 'completed' }),
      AssessmentPayment.countDocuments({ reportStatus: 'sent' })
    ]);

    const totalRevenue = paidRecords.reduce((sum, item) => sum + (item.amount || 0), 0);

    return res.json({
      success: true,
      data: {
        totalLeads: totalRecords,
        totalEnrolled: paidRecords.length,
        totalRevenue,
        pendingPayments: pendingRecords,
        completedAssessments,
        sentReports
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch assessment stats' });
  }
};

