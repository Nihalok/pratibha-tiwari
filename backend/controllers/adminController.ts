import jwt, { Secret } from 'jsonwebtoken';
import crypto from 'crypto';
import Admin, { IAdmin, AdminHelper } from '../models/Admin.js';
import { Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';
import asyncHandler from '../middleware/asyncHandler.js';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const sendTokenResponse = (admin: IAdmin, statusCode: number, res: Response) => {
  const secret = (process.env.JWT_SECRET || 'secret') as Secret;
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as any;

  const token = jwt.sign({ id: admin._id }, secret, {
    expiresIn
  });

  const isProduction = process.env.NODE_ENV === 'production';
  const options = {
    httpOnly: true,
    secure: isProduction,          // HTTPS only in production
    sameSite: 'lax' as const,      // 'lax' works on same-site HTTPS; 'strict' can block redirects
    path: '/'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });
};

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide an email and password' });
  }

  // Find admin and explicitly include password field (select: false in schema)
  const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

  if (!admin) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  if (!admin.password) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const isMatch = await AdminHelper.matchPassword(password, admin.password);

  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  sendTokenResponse(admin, 200, res);
});

export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    expires: new Date(0),
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/'
  };

  res.cookie('token', '', cookieOptions);
  res.clearCookie('token', cookieOptions);

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

export const getProfile = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    admin: req.admin
  });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const admin = await Admin.findOne({ email: email.toLowerCase() });

  if (!admin) {
    return res.status(404).json({ success: false, message: 'There is no admin with that email' });
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);

  admin.resetPasswordToken = resetPasswordToken;
  admin.resetPasswordExpire = resetPasswordExpire;
  await admin.save();

  const resetUrl = `${process.env.CLIENT_URL || req.protocol + '://' + req.get('host')}/reset-password?token=${resetToken}`;
  const plainTextMessage = `You are receiving this email because you (or someone else) has requested the reset of a password. Please use the following link to reset your password: \n\n ${resetUrl}`;

  const htmlMessage = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F1F5F9; margin: 0; padding: 0; }
        .email-container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid rgba(184, 151, 74, 0.2); }
        .header { background-color: #0A1929; color: #ffffff; padding: 40px 20px; text-align: center; border-bottom: 4px solid #B8974A; }
        .header h1 { margin: 0; font-size: 26px; font-weight: 300; letter-spacing: 0.5px; }
        .header p { margin: 8px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.7); }
        .content { padding: 40px; color: #1C1C2E; line-height: 1.6; }
        .content p { margin: 0 0 24px 0; font-size: 15px; color: #525D71; }
        .button-container { text-align: center; margin: 35px 0; }
        .reset-button { display: inline-block; padding: 15px 35px; background-color: #0A1929; color: #ffffff !important; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 8px 16px rgba(10, 25, 41, 0.15); }
        .footer { padding: 25px; background-color: #F8FAFC; text-align: center; border-top: 1px solid #E2E8F0; }
        .footer p { margin: 0; font-size: 11px; color: #94A3B8; line-height: 1.5; }
        .warning { font-size: 12px; color: #ef4444 !important; background-color: #fef2f2; border: 1px solid #fee2e2; padding: 15px; border-radius: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Pratibha Tiwari</h1>
          <p>Secure Admin Portal</p>
        </div>
        <div class="content">
          <p>Hello Admin,</p>
          <p>We received a request to reset your password for the Pratibha Tiwari platform. Click the secure button below to proceed with setting a new password:</p>
          <div class="button-container">
            <a href="${resetUrl}" class="reset-button" target="_blank">Reset Password</a>
          </div>
          <p>This password reset link is valid for <strong>15 minutes</strong>.</p>
          <div class="warning">
            <strong>Security Notice:</strong> If you did not request this password reset, please ignore this email. Your credentials remain secure.
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Pratibha Tiwari. All rights reserved.</p>
          <p>This is an automated system notification. Please do not reply directly to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"${process.env.FROM_NAME || 'Pratibha Tiwari Admin'}" <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: 'Password reset request',
      text: plainTextMessage,
      html: htmlMessage
    });

    res.status(200).json({ success: true, message: 'Email sent' });
  } catch (err) {
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    await admin.save();
    return res.status(500).json({ success: false, message: 'Email could not be sent' });
  }
});

export const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const resetToken = req.params.resettoken;
  const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  const admin = await Admin.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  }).select('+password');

  if (!admin) {
    return res.status(400).json({ success: false, message: 'Invalid token' });
  }

  admin.password = await AdminHelper.hashPassword(req.body.password);
  admin.resetPasswordToken = undefined;
  admin.resetPasswordExpire = undefined;
  await admin.save();

  sendTokenResponse(admin, 200, res);
});

export const googleLogin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ success: false, message: 'Please provide a Google ID Token' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(401).json({ success: false, message: 'Invalid Google Token' });
    }

    const email = payload.email.toLowerCase();

    // Check if user is in our whitelisted admins collection
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'You are not authorized to access the admin portal. This email is not registered as an admin.' });
    }

    // Login successful
    sendTokenResponse(admin, 200, res);
  } catch (error: any) {
    console.error('Google ID token verification failed:', error.message);
    return res.status(401).json({ success: false, message: 'Google Authentication failed' });
  }
});

export const googleLoginRedirect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const credential = req.body.credential;
  const adminPath = process.env.VITE_ADMIN_PATH || 'admin';

  if (!credential) {
    return res.redirect(303, `/${adminPath}/login?error=no_token`);
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.redirect(303, `/${adminPath}/login?error=invalid_token`);
    }

    const email = payload.email.toLowerCase();

    // Check if user is in our whitelisted admins collection
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.redirect(303, `/${adminPath}/login?error=unauthorized`);
    }

    // Set cookie
    const secret = (process.env.JWT_SECRET || 'secret') as Secret;
    const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as any;

    const token = jwt.sign({ id: admin._id }, secret, {
      expiresIn
    });

    const isProduction = process.env.NODE_ENV === 'production';
    const options = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,   // 'lax' required for redirect-based OAuth flows
      path: '/'
    };

    res.cookie('token', token, options);
    // 303 See Other forces GET method on redirect to avoid 405 Method Not Allowed on Vercel SPA routes
    res.redirect(303, `/${adminPath}/dashboard`);
  } catch (error: any) {
    console.error('Google verification redirect failed:', error.message);
    res.redirect(303, `/${adminPath}/login?error=auth_failed`);
  }
});
