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
  const calendlyLink = 'https://calendly.com/dsdtrainings/30min';

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
        .btn-wrapper { text-align: center; margin: 24px 0; }
        .btn { background: linear-gradient(135deg, #D4AF37 0%, #B8974A 100%); color: #0A1929 !important; font-weight: 800; font-size: 14px; text-decoration: none; padding: 16px 36px; border-radius: 50px; display: inline-block; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 4px 15px rgba(212,175,55,0.3); }
        .btn-secondary { background: #0A1929; color: #ffffff !important; font-weight: 700; font-size: 13px; text-decoration: none; padding: 14px 30px; border-radius: 50px; display: inline-block; letter-spacing: 1px; }
        .note { background: #FEF3C7; border: 1px solid #FCD34D; border-radius: 12px; padding: 16px; font-size: 13px; color: #92400E; line-height: 1.5; margin-bottom: 24px; }
        .calendar-card { background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 18px; margin-bottom: 24px; text-align: center; }
        .footer { text-align: center; padding: 24px; font-size: 11px; color: #94A3B8; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Pratibha Tiwari</h2>
          <p>Payment Confirmation & Enrollment Details</p>
        </div>
        <div class="content">
          <div class="greeting">Thank You, ${customerName}!</div>
          <p class="lead">
            Thank you for enrolling in the <strong>${packageTitle}</strong> with ICF-PCC Coach Pratibha Tiwari. Your payment has been successfully confirmed and verified.
          </p>

          <div class="receipt-card">
            <div class="receipt-row"><span class="receipt-label">Program / Package:</span><span class="receipt-value">${packageTitle}</span></div>
            <div class="receipt-row"><span class="receipt-label">Amount Paid:</span><span class="receipt-value">${amountFormatted}</span></div>
            <div class="receipt-row"><span class="receipt-label">Payment Date:</span><span class="receipt-value">${paymentDate}</span></div>
            <div class="receipt-row"><span class="receipt-label">Reference ID:</span><span class="receipt-value">${referenceId}</span></div>
          </div>

          <div class="note">
            📅 <strong>Delivery Timeline:</strong> Your bespoke Executive Career Intelligence Report will be individually audited, calibrated, and sent to your registered email and WhatsApp within <strong>10 working days</strong>.
          </div>

          <div class="calendar-card">
            <h4 style="margin: 0 0 8px 0; color: #1E3A8A; font-size: 15px;">Schedule Your Strategy Coaching Session</h4>
            <p style="margin: 0 0 16px 0; font-size: 13px; color: #3B82F6;">
              Use the official calendar link below to book your 1-on-1 strategic session with Pratibha Tiwari:
            </p>
            <a href="${calendlyLink}" class="btn-secondary" target="_blank">Book Your Calendar Slot →</a>
          </div>

          <div class="btn-wrapper">
            <p style="font-size: 13px; color: #64748B; margin-bottom: 12px;">If you haven't filled your strategic questionnaire yet, complete it here:</p>
            <a href="${assessmentLink}" class="btn">Complete Discovery Questionnaire</a>
          </div>

          <p class="lead" style="font-size: 13px; text-align: center; margin-top: 30px;">
            For any queries or WhatsApp coordination, reach out to us at support@pratibhatiwari.com or WhatsApp: +91 9119214456.
          </p>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} Pratibha Tiwari • Executive Career Strategy & Leadership Practice
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
      subject: 'Payment Confirmation & Strategy Scheduling — Coach Pratibha Tiwari',
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
  const calendlyLink = 'https://calendly.com/dsdtrainings/30min';

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
        .calendar-card { background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 18px; margin-bottom: 24px; text-align: center; }
        .btn-secondary { background: #0A1929; color: #ffffff !important; font-weight: 700; font-size: 13px; text-decoration: none; padding: 14px 30px; border-radius: 50px; display: inline-block; letter-spacing: 1px; }
        .footer { text-align: center; padding: 24px; font-size: 11px; color: #94A3B8; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Pratibha Tiwari</h2>
          <p>Assessment Submission Confirmed</p>
        </div>
        <div class="content">
          <div class="greeting">Thank You, ${customerName}!</div>
          <p class="lead">
            Your strategic discovery questionnaire has been successfully received and submitted.
          </p>
          
          <div class="info-card">
            <div class="info-row"><strong>Assessment Reference:</strong> ${referenceId}</div>
            <div class="info-row"><strong>Status:</strong> Under Executive Review</div>
          </div>

          <p class="lead">
            Your responses have been logged securely. Your bespoke Executive Career Intelligence Report will be individually reviewed, calibrated, and sent to your registered email (<strong>${customerEmail}</strong>) and WhatsApp within <strong>10 working days</strong>.
          </p>

          <div class="calendar-card">
            <h4 style="margin: 0 0 8px 0; color: #1E3A8A; font-size: 15px;">Book Your 1-on-1 Coaching Session</h4>
            <p style="margin: 0 0 16px 0; font-size: 13px; color: #3B82F6;">
              Please select your preferred time slot on the calendar link below:
            </p>
            <a href="${calendlyLink}" class="btn-secondary" target="_blank">Access Calendly Booking →</a>
          </div>

          <p class="lead" style="margin-top: 30px;">
            Warm regards,<br>
            <strong>Pratibha Tiwari</strong><br>
            <span style="font-size: 12px; color: #64748B;">Executive Career Strategist &amp; ICF-PCC Coach</span>
          </p>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} Pratibha Tiwari • Executive Career Strategy & Leadership Practice
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
      subject: 'Questionnaire Received — Report Delivery Within 10 Working Days',
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
  customerWhatsapp?: string;
  packageTitle: string;
  amountFormatted: string;
  referenceId: string;
  details?: string;
  formData?: Record<string, any>;
}) => {
  const { event, customerName, customerEmail, customerWhatsapp, packageTitle, amountFormatted, referenceId, details, formData } = params;
  const adminEmail = getAdminEmail();
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  const isSubmission = event === 'assessment_submitted';
  const subject = isSubmission 
    ? `[ACTION REQUIRED] Executive Assessment Dossier: ${customerName} (${packageTitle})` 
    : `[NEW PAYMENT] Executive Assessment Paid: ${customerName} (${amountFormatted})`;

  const data = formData || {};
  const phone = customerWhatsapp || data.whatsapp || '';
  const cleanPhone = phone.replace(/\D/g, '');
  const waUrl = cleanPhone 
    ? `https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(customerName)},%20this%20is%20Coach%20Pratibha%20Tiwari%20regarding%20your%20Executive%20Career%20Assessment.` 
    : '';
  const cityCountry = data.cityCountry || 'Not specified';
  const linkedIn = data.linkedInUrl || '';
  const resumeName = data.resumeFileName || data.screenshotName || (data.hasScreenshot ? 'Payment Screenshot Uploaded' : 'None provided');
  const coverLetter = data.coverLetterFileName || '';

  // 7 Discovery Questionnaire Sections
  const currentRole = data.currentRoleDescription || '';
  const energyGiving = data.workEnergyGiving || '';
  const energyDraining = data.workEnergyDraining || '';

  const vision = data.threeYearVision || '';
  const obstacle = data.singleBiggestObstacle || '';
  const whyNow = data.whySolvingImportantNow || '';

  const usingAi = data.howUsingAi || '';
  const aiWorries = data.aiWorries || '';
  const aiEnhancement = data.aiEnhancementAreas || '';

  const perception = data.colleaguePerception || '';
  const desiredReputation = data.desiredReputation || '';

  const focusAreas: string[] = Array.isArray(data.focusAreas) ? data.focusAreas : [];
  const weeklyTime = data.weeklyTime || '';

  const careerQuestion = data.oneCareerQuestion || '';
  const feedbackPref = data.feedbackPreference || '';
  const coachingNotes = data.coachingNotes || '';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif; background-color: #0A1929; margin: 0; padding: 25px 10px; color: #1E293B; }
        .wrapper { max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 45px rgba(0,0,0,0.35); border: 1px solid rgba(212,175,55,0.3); }
        .header { background: linear-gradient(135deg, #0A1929 0%, #1A3A5C 100%); padding: 32px 30px; text-align: center; color: #ffffff; }
        .header-tag { display: inline-block; background: rgba(212,175,55,0.2); color: #D4AF37; font-size: 10px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; padding: 5px 14px; border-radius: 50px; border: 1px solid rgba(212,175,55,0.35); margin-bottom: 12px; }
        .header h2 { margin: 0; font-family: Georgia, serif; font-size: 24px; color: #ffffff; letter-spacing: 0.5px; }
        .header p { margin: 8px 0 0; font-size: 13px; color: #94A3B8; }
        .body-content { padding: 32px 28px; }
        
        .action-bar { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid #E2E8F0; }
        .btn-act { text-decoration: none; font-size: 12px; font-weight: 700; padding: 10px 20px; border-radius: 30px; display: inline-block; }
        .btn-wa { background: #25D366; color: #ffffff !important; }
        .btn-portal { background: #0A1929; color: #ffffff !important; }
        .btn-email { background: #3B82F6; color: #ffffff !important; }

        .section-card { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 20px; margin-bottom: 20px; }
        .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #B8974A; margin-bottom: 14px; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px; display: flex; justify-content: space-between; }
        .info-grid { width: 100%; border-collapse: collapse; }
        .info-grid td { padding: 6px 0; font-size: 13px; vertical-align: top; }
        .info-grid .label { width: 38%; color: #64748B; font-weight: 600; }
        .info-grid .value { width: 62%; color: #0F172A; font-weight: 600; }
        
        .q-block { margin-bottom: 14px; }
        .q-block:last-child { margin-bottom: 0; }
        .q-title { font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 4px; }
        .q-answer { font-size: 13px; color: #0F172A; line-height: 1.55; background: #ffffff; border: 1px solid #E2E8F0; padding: 10px 14px; border-radius: 8px; }
        
        .badge { display: inline-block; background: #FEF3C7; color: #92400E; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; margin: 3px 4px 3px 0; border: 1px solid #FCD34D; }
        .highlight-quote { background: #FFFBEB; border-left: 4px solid #D4AF37; padding: 14px 16px; border-radius: 0 10px 10px 0; margin-top: 10px; }
        .timeline-alert { background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 12px; padding: 14px 18px; margin-bottom: 24px; font-size: 13px; color: #065F46; line-height: 1.5; text-align: center; }

        .footer { text-align: center; padding: 22px; font-size: 11px; color: #94A3B8; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <span class="header-tag">${isSubmission ? 'Executive Candidate Dossier' : 'New Enrollment Payment'}</span>
          <h2>${isSubmission ? 'Strategic Discovery Completed' : 'Payment Verified & Confirmed'}</h2>
          <p>${customerName} &bull; ${packageTitle} &bull; ${amountFormatted}</p>
        </div>

        <div class="body-content">
          ${isSubmission ? `
            <div class="timeline-alert">
              ⏳ <strong>Delivery Commitment:</strong> Candidate has been notified that their bespoke report will be delivered within <strong>10 working days</strong> via Email and WhatsApp.
            </div>
          ` : ''}

          <!-- Direct Actions -->
          <div class="action-bar">
            ${cleanPhone ? `<a href="${waUrl}" class="btn-act btn-wa" target="_blank">💬 WhatsApp Candidate (${phone})</a>` : ''}
            <a href="mailto:${customerEmail}" class="btn-act btn-email">📧 Email Candidate</a>
            <a href="${frontendUrl}/admin/leads-and-enroll" class="btn-act btn-portal" target="_blank">📊 Open Admin Portal</a>
          </div>

          <!-- Section 1: Candidate Overview & Credentials -->
          <div class="section-card">
            <div class="section-title">
              <span>Section 1 &bull; Candidate Profile</span>
              <span style="color:#64748B; font-weight:normal;">Ref: ${referenceId}</span>
            </div>
            <table class="info-grid">
              <tr>
                <td class="label">Full Name:</td>
                <td class="value"><strong>${customerName}</strong></td>
              </tr>
              <tr>
                <td class="label">Email Address:</td>
                <td class="value"><a href="mailto:${customerEmail}" style="color:#2563EB;">${customerEmail}</a></td>
              </tr>
              <tr>
                <td class="label">WhatsApp Number:</td>
                <td class="value"><strong>${phone || 'N/A'}</strong></td>
              </tr>
              <tr>
                <td class="label">City &amp; Country:</td>
                <td class="value">${cityCountry}</td>
              </tr>
              ${linkedIn ? `
              <tr>
                <td class="label">LinkedIn Profile:</td>
                <td class="value"><a href="${linkedIn}" target="_blank" style="color:#0284C7; text-decoration:underline;">View LinkedIn Profile &rarr;</a></td>
              </tr>` : ''}
              <tr>
                <td class="label">Resume / Documents:</td>
                <td class="value" style="font-family:monospace; color:#0369A1;">📄 ${resumeName}</td>
              </tr>
              ${coverLetter ? `
              <tr>
                <td class="label">Cover Letter / Context:</td>
                <td class="value" style="font-family:monospace;">📄 ${coverLetter}</td>
              </tr>` : ''}
              <tr>
                <td class="label">Package &amp; Fee:</td>
                <td class="value" style="color:#B8974A;"><strong>${packageTitle}</strong> (${amountFormatted})</td>
              </tr>
            </table>
          </div>

          <!-- Section 6: Focus Areas Highlight -->
          ${focusAreas.length > 0 ? `
          <div class="section-card" style="border-left: 4px solid #D4AF37;">
            <div class="section-title">Top 3 Primary Focus Areas &amp; Commitment</div>
            <div style="margin-bottom: 12px;">
              ${focusAreas.map(fa => `<span class="badge">✦ ${fa}</span>`).join(' ')}
            </div>
            ${weeklyTime ? `<p style="margin: 6px 0 0; font-size: 13px; color: #475569;"><strong>Weekly Time Commitment:</strong> ${weeklyTime}</p>` : ''}
          </div>` : ''}

          <!-- Section 7: The Core Career Question for Coach Pratibha -->
          ${careerQuestion ? `
          <div class="section-card" style="background:#FFFDF5; border-color:#FDE68A;">
            <div class="section-title" style="color:#92400E;">The Single Most Critical Question for Coach Pratibha</div>
            <div class="highlight-quote">
              <p style="margin:0; font-size:14px; font-style:italic; color:#78350F; font-weight:600;">
                "${careerQuestion}"
              </p>
            </div>
            ${feedbackPref ? `<p style="margin:10px 0 0; font-size:12px; color:#92400E;"><strong>Feedback / Delivery Preference:</strong> ${feedbackPref}</p>` : ''}
            ${coachingNotes ? `<p style="margin:6px 0 0; font-size:12px; color:#92400E;"><strong>Coaching Slot Notes:</strong> ${coachingNotes}</p>` : ''}
          </div>` : ''}

          <!-- Section 2: Current Professional State & Energy Profile -->
          ${(currentRole || energyGiving || energyDraining) ? `
          <div class="section-card">
            <div class="section-title">Section 2 &bull; Current State &amp; Energy Dynamics</div>
            ${currentRole ? `
              <div class="q-block">
                <div class="q-title">Current Role &amp; Day-to-Day Responsibilities:</div>
                <div class="q-answer">${currentRole}</div>
              </div>` : ''}
            ${energyGiving ? `
              <div class="q-block">
                <div class="q-title">Activities that Energize Them (Peak Flow):</div>
                <div class="q-answer" style="border-left: 3px solid #10B981;">${energyGiving}</div>
              </div>` : ''}
            ${energyDraining ? `
              <div class="q-block">
                <div class="q-title">Activities that Drain Them (Energy Leaks):</div>
                <div class="q-answer" style="border-left: 3px solid #EF4444;">${energyDraining}</div>
              </div>` : ''}
          </div>` : ''}

          <!-- Section 3: Vision & Core Obstacles -->
          ${(vision || obstacle || whyNow) ? `
          <div class="section-card">
            <div class="section-title">Section 3 &bull; Strategic Vision &amp; Obstacles</div>
            ${vision ? `
              <div class="q-block">
                <div class="q-title">3-Year Professional Vision:</div>
                <div class="q-answer">${vision}</div>
              </div>` : ''}
            ${obstacle ? `
              <div class="q-block">
                <div class="q-title">Single Biggest Roadblock / Obstacle:</div>
                <div class="q-answer" style="border-left: 3px solid #F59E0B;">${obstacle}</div>
              </div>` : ''}
            ${whyNow ? `
              <div class="q-block">
                <div class="q-title">Why Solving This Now Is Critical:</div>
                <div class="q-answer">${whyNow}</div>
              </div>` : ''}
          </div>` : ''}

          <!-- Section 4: Technology & AI Integration -->
          ${(usingAi || aiWorries || aiEnhancement) ? `
          <div class="section-card">
            <div class="section-title">Section 4 &bull; Technology &amp; AI Outlook</div>
            ${usingAi ? `
              <div class="q-block">
                <div class="q-title">How They Currently Use AI / Tech Tools:</div>
                <div class="q-answer">${usingAi}</div>
              </div>` : ''}
            ${aiWorries ? `
              <div class="q-block">
                <div class="q-title">Anxieties / Concerns About AI Disruptions:</div>
                <div class="q-answer">${aiWorries}</div>
              </div>` : ''}
            ${aiEnhancement ? `
              <div class="q-block">
                <div class="q-title">Areas Seeking AI &amp; Strategic Leverage:</div>
                <div class="q-answer">${aiEnhancement}</div>
              </div>` : ''}
          </div>` : ''}

          <!-- Section 5: Brand & Leadership Presence -->
          ${(perception || desiredReputation) ? `
          <div class="section-card">
            <div class="section-title">Section 5 &bull; Professional Brand &amp; Perception</div>
            ${perception ? `
              <div class="q-block">
                <div class="q-title">How Peers &amp; Leadership Currently Perceive Them:</div>
                <div class="q-answer">${perception}</div>
              </div>` : ''}
            ${desiredReputation ? `
              <div class="q-block">
                <div class="q-title">Desired Executive Brand &amp; Reputation to Build:</div>
                <div class="q-answer">${desiredReputation}</div>
              </div>` : ''}
          </div>` : ''}

          ${details ? `
            <div class="section-card">
              <div class="section-title">Additional Submission Notes</div>
              <div style="font-family: monospace; font-size: 12px; color: #475569; white-space: pre-wrap;">${details}</div>
            </div>
          ` : ''}
        </div>

        <div class="footer">
          Pratibha Tiwari Platform &bull; Automated Executive Notification &bull; ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
        </div>
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
    console.log(`[Admin Alert] Comprehensive dossier email delivered to ${adminEmail} for ${event}`);
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
