import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

const getAdminEmail = (): string => {
  return process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'admin@pratibhatiwari.com';
};

/**
 * 1. Email after successful Stripe payment
 */
export const sendPaymentConfirmationEmail = async (params: {
  customerName: string;
  customerEmail: string;
  packageTitle: string;
  amountFormatted: string;
  paymentDate: string;
  referenceId: string;
  sessionId: string;
}) => {
  const { customerName, customerEmail, packageTitle, amountFormatted, paymentDate, referenceId, sessionId } = params;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const assessmentLink = `${frontendUrl}/assessment/premium?session_id=${sessionId}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0A1929; margin: 0; padding: 30px 10px; color: #333333; }
        .container { max-width: 600px; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.3); border: 1px solid rgba(212,175,55,0.2); margin: 0 auto; }
        .header { background: linear-gradient(135deg, #0A1929 0%, #1A3A5C 100%); padding: 35px 30px; text-align: center; color: #ffffff; }
        .header h2 { margin: 0; font-family: Georgia, serif; font-size: 26px; letter-spacing: 1px; color: #ffffff; }
        .header p { margin: 8px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #D4AF37; font-weight: bold; }
        .content { padding: 40px 32px; }
        .greeting { font-size: 18px; font-weight: 600; color: #0A1929; margin-bottom: 16px; }
        .lead { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
        .receipt-card { background: #F8FAFC; border: 1px solid #E2E8F0; border-left: 4px solid #D4AF37; border-radius: 12px; padding: 20px; margin-bottom: 28px; }
        .receipt-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; border-bottom: 1px dashed #E2E8F0; }
        .receipt-row:last-child { border-bottom: none; }
        .receipt-label { color: #64748B; font-weight: 500; }
        .receipt-value { font-weight: 700; color: #0A1929; }
        .btn-wrapper { text-align: center; margin: 32px 0; }
        .btn { background: linear-gradient(135deg, #D4AF37 0%, #B8974A 100%); color: #0A1929 !important; font-weight: 800; font-size: 14px; text-decoration: none; padding: 16px 36px; border-radius: 50px; display: inline-block; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 4px 15px rgba(212,175,55,0.3); }
        .note { background: #FEF3C7; border: 1px solid #FCD34D; border-radius: 12px; padding: 16px; font-size: 13px; color: #92400E; line-height: 1.5; margin-bottom: 24px; }
        .footer { text-align: center; padding: 24px; font-size: 11px; color: #94A3B8; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Pratibha Tiwari</h2>
          <p>Premium Assessment Payment Confirmation</p>
        </div>
        <div class="content">
          <div class="greeting">Hello ${customerName},</div>
          <p class="lead">
            Your payment for the <strong>${packageTitle}</strong> has been successfully completed. Your enrollment is now verified and active.
          </p>

          <div class="receipt-card">
            <div class="receipt-row"><span class="receipt-label">Assessment:</span><span class="receipt-value">${packageTitle}</span></div>
            <div class="receipt-row"><span class="receipt-label">Amount Paid:</span><span class="receipt-value">${amountFormatted}</span></div>
            <div class="receipt-row"><span class="receipt-label">Payment Date:</span><span class="receipt-value">${paymentDate}</span></div>
            <div class="receipt-row"><span class="receipt-label">Reference ID:</span><span class="receipt-value">${referenceId}</span></div>
          </div>

          <p class="lead">
            Your payment has been confirmed successfully. You can now complete your Premium Assessment questionnaire using the secure link below.
          </p>

          <div class="btn-wrapper">
            <a href="${assessmentLink}" class="btn">Complete Premium Assessment</a>
          </div>

          <div class="note">
            ⌛ <strong>Important:</strong> After completing the questionnaire, your bespoke executive report will be prepared by Coach Pratibha Tiwari and sent to you within 10 business days.
          </div>

          <p class="lead" style="font-size: 13px; text-align: center;">
            Need assistance? Reply directly to this email or contact support.
          </p>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} Pratibha Tiwari • Executive AI Career Strategy & Leadership Practice
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Coach Pratibha Tiwari" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: 'Premium Assessment Payment Confirmation',
      html
    });
    console.log(`[Email] Payment confirmation sent to ${customerEmail}`);
  } catch (err) {
    console.error('[Email Error] Failed to send payment confirmation email:', err);
  }
};

/**
 * 2. Email after user submits the premium assessment questionnaire
 */
export const sendAssessmentCompletedEmail = async (params: {
  customerName: string;
  customerEmail: string;
  referenceId: string;
  submissionDate: string;
}) => {
  const { customerName, customerEmail, referenceId } = params;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0A1929; margin: 0; padding: 30px 10px; color: #333333; }
        .container { max-width: 600px; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.3); border: 1px solid rgba(212,175,55,0.2); margin: 0 auto; }
        .header { background: linear-gradient(135deg, #0A1929 0%, #1A3A5C 100%); padding: 35px 30px; text-align: center; color: #ffffff; }
        .header h2 { margin: 0; font-family: Georgia, serif; font-size: 26px; letter-spacing: 1px; color: #ffffff; }
        .header p { margin: 8px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #D4AF37; font-weight: bold; }
        .content { padding: 40px 32px; }
        .greeting { font-size: 18px; font-weight: 600; color: #0A1929; margin-bottom: 16px; }
        .lead { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
        .info-card { background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 12px; padding: 20px; margin-bottom: 28px; }
        .info-row { font-size: 13px; margin-bottom: 8px; color: #065F46; }
        .footer { text-align: center; padding: 24px; font-size: 11px; color: #94A3B8; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Pratibha Tiwari</h2>
          <p>Premium Assessment Completed</p>
        </div>
        <div class="content">
          <div class="greeting">Hello ${customerName},</div>
          <p class="lead">
            Your Premium Assessment questionnaire has been successfully completed and submitted!
          </p>
          
          <div class="info-card">
            <div class="info-row"><strong>Assessment Reference:</strong> ${referenceId}</div>
            <div class="info-row"><strong>Status:</strong> Under Executive Audit</div>
          </div>

          <p class="lead">
            Your responses have been logged securely and are now being reviewed by Coach Pratibha Tiwari and the strategy team.
          </p>
          <p class="lead">
            Your comprehensive, personalized AI Career Intelligence Report will be prepared and sent to your registered email address (<strong>${customerEmail}</strong>) within <strong>10 days</strong>.
          </p>

          <p class="lead" style="margin-top: 30px;">
            Thank you,<br>
            <strong>Pratibha Tiwari</strong><br>
            <span style="font-size: 12px; color: #64748B;">Executive AI Career Strategist & ICF-PCC Coach</span>
          </p>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} Pratibha Tiwari • Executive AI Career Strategy & Leadership Practice
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Coach Pratibha Tiwari" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: 'Premium Assessment Completed',
      html
    });
    console.log(`[Email] Assessment completion email sent to ${customerEmail}`);
  } catch (err) {
    console.error('[Email Error] Failed to send assessment completion email:', err);
  }
};

/**
 * 3. Admin Notification Email on Payment / Submission
 */
export const sendAdminNotificationEmail = async (params: {
  event: 'payment_received' | 'assessment_submitted';
  customerName: string;
  customerEmail: string;
  packageTitle: string;
  amountFormatted: string;
  referenceId: string;
  details?: string;
}) => {
  const { event, customerName, customerEmail, packageTitle, amountFormatted, referenceId, details } = params;
  const adminEmail = getAdminEmail();

  const isSubmission = event === 'assessment_submitted';
  const subject = isSubmission 
    ? `[ACTION REQUIRED] Premium Assessment Submitted: ${customerName}` 
    : `[NEW PAYMENT] Premium Assessment Paid: ${customerName} (${amountFormatted})`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #1e293b; }
        .card { max-width: 600px; background: #ffffff; border-radius: 16px; padding: 30px; margin: 0 auto; border: 1px solid #cbd5e1; }
        .header { background: #0A1929; color: #ffffff; padding: 20px; border-radius: 12px; margin-bottom: 20px; text-align: center; }
        .header h3 { margin: 0; color: #D4AF37; }
        .row { margin-bottom: 12px; font-size: 14px; }
        .row strong { width: 140px; display: inline-block; color: #0A1929; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h3>${isSubmission ? '📝 New Assessment Submitted' : '💳 New Payment Received'}</h3>
        </div>
        <div class="row"><strong>Event:</strong> ${isSubmission ? 'Questionnaire Submitted' : 'Stripe Payment Verified'}</div>
        <div class="row"><strong>Candidate Name:</strong> ${customerName}</div>
        <div class="row"><strong>Candidate Email:</strong> ${customerEmail}</div>
        <div class="row"><strong>Package:</strong> ${packageTitle}</div>
        <div class="row"><strong>Amount:</strong> ${amountFormatted}</div>
        <div class="row"><strong>Reference ID:</strong> ${referenceId}</div>
        <div class="row"><strong>Date:</strong> ${new Date().toLocaleString()}</div>
        ${details ? `<div style="margin-top:20px; padding:15px; background:#f8fafc; border-radius:8px; font-size:13px; font-family:monospace;">${details}</div>` : ''}
      </div>
    </body>
    </html>
  `;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Pratibha Tiwari Platform" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject,
      html
    });
    console.log(`[Admin Alert] Admin notified for ${event}`);
  } catch (err) {
    console.error('[Admin Email Error] Failed to send admin notification:', err);
  }
};

/**
 * 4. Email when admin completes and sends the final report
 */
export const sendReportReadyEmail = async (params: {
  customerName: string;
  customerEmail: string;
  packageTitle: string;
  reportNotes?: string;
  reportLink?: string;
}) => {
  const { customerName, customerEmail, packageTitle, reportNotes, reportLink } = params;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0A1929; margin: 0; padding: 30px 10px; color: #333333; }
        .container { max-width: 600px; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.3); border: 1px solid rgba(212,175,55,0.2); margin: 0 auto; }
        .header { background: linear-gradient(135deg, #0A1929 0%, #1A3A5C 100%); padding: 35px 30px; text-align: center; color: #ffffff; }
        .header h2 { margin: 0; font-family: Georgia, serif; font-size: 26px; letter-spacing: 1px; color: #ffffff; }
        .header p { margin: 8px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #D4AF37; font-weight: bold; }
        .content { padding: 40px 32px; }
        .greeting { font-size: 18px; font-weight: 600; color: #0A1929; margin-bottom: 16px; }
        .lead { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
        .notes-card { background: #F8FAFC; border-left: 4px solid #D4AF37; padding: 18px; border-radius: 8px; margin-bottom: 28px; font-size: 14px; color: #1E293B; }
        .btn-wrapper { text-align: center; margin: 32px 0; }
        .btn { background: linear-gradient(135deg, #D4AF37 0%, #B8974A 100%); color: #0A1929 !important; font-weight: 800; font-size: 14px; text-decoration: none; padding: 16px 36px; border-radius: 50px; display: inline-block; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 4px 15px rgba(212,175,55,0.3); }
        .footer { text-align: center; padding: 24px; font-size: 11px; color: #94A3B8; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Pratibha Tiwari</h2>
          <p>Your Premium Assessment Report is Ready</p>
        </div>
        <div class="content">
          <div class="greeting">Hello ${customerName},</div>
          <p class="lead">
            Great news! Your <strong>${packageTitle}</strong> report has been audited, calibrated, and finalized by Coach Pratibha Tiwari.
          </p>

          ${reportNotes ? `<div class="notes-card"><strong>Strategist Notes:</strong><br>${reportNotes}</div>` : ''}

          ${reportLink ? `
            <div class="btn-wrapper">
              <a href="${reportLink}" class="btn">View / Download Executive Report</a>
            </div>
          ` : `
            <p class="lead">
              Your bespoke report is attached or delivered directly to your WhatsApp.
            </p>
          `}

          <p class="lead" style="margin-top: 30px;">
            Thank you for trusting Coach Pratibha Tiwari with your executive career trajectory.<br><br>
            Warm regards,<br>
            <strong>Pratibha Tiwari</strong><br>
            <span style="font-size: 12px; color: #64748B;">Executive AI Career Strategist & ICF-PCC Coach</span>
          </p>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} Pratibha Tiwari • Executive AI Career Strategy & Leadership Practice
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Coach Pratibha Tiwari" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: 'Your Premium Assessment Report is Ready',
      html
    });
    console.log(`[Email] Report ready email sent to ${customerEmail}`);
  } catch (err) {
    console.error('[Email Error] Failed to send report ready email:', err);
  }
};
