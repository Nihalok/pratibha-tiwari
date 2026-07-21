import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { errorHandler } from './middleware/errorMiddleware.js';

// Routes
import adminRoutes from './routes/adminRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import dbCheck from './middleware/dbCheck.js';

const app = express();

// Trust proxy for express-rate-limit and other headers
app.set('trust proxy', 1);

// Standard middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development simplicity unless explicitly needed
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(compression());

// Security: Rate limiting on auth endpoints to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 login attempts per IP per 15 minutes
  message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security: General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per IP per 15 minutes
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general rate limit to all API routes
app.use('/api', apiLimiter);

// Apply strict rate limit to auth routes
app.use('/api/admin/login', authLimiter);
app.use('/api/admin/forgotpassword', authLimiter);

// Security: Sanitize incoming data to prevent NoSQL injection
app.use((req, res, next) => {
  // Recursively strip keys starting with '$' or containing '.' from req.body, req.query, req.params
  const sanitize = (obj: any): any => {
    if (obj === null || obj === undefined || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(sanitize);
    const clean: any = {};
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$') || key.includes('.')) continue; // Strip dangerous keys
      clean[key] = sanitize(obj[key]);
    }
    return clean;
  };
  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);
  next();
});

// Health check endpoint (Public)
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? 'mongodb-connected' : 'mongodb-disconnected'
  });
});


// API Routes
// Admin Routes
app.use('/api/admin', adminRoutes);

// Protected Data Routes (Need DB check)
app.use('/api', dbCheck);
app.use('/api/ai', aiRoutes);
app.use('/api', contentRoutes);

// Catch-all for undefined API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found in Express`
  });
});

// Final log before falling through to static/Vite
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found' });
  }
  next();
});

// Error handler
app.use(errorHandler);

export default app;
