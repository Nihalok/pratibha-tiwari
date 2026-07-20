import express from 'express';
import { login, logout, getProfile, forgotPassword, resetPassword, googleLogin, googleLoginRedirect } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/google-login-redirect', googleLoginRedirect);
router.get('/config', (req, res) => {
  res.json({ googleClientId: process.env.GOOGLE_CLIENT_ID });
});
router.get('/logout', logout);
router.get('/profile', protect, getProfile);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

export default router;
