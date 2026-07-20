/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { ShieldCheck, ArrowRight, User, Lock, Eye, EyeOff, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ADMIN_PREFIX } from '../../config/admin';

export default function AdminLogin() {
  const { loginAdmin, isAdmin, loading, checkAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAdmin) {
      navigate(`/${ADMIN_PREFIX}`);
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get('error');
    if (errorParam) {
      if (errorParam === 'unauthorized') {
        setError('You are not authorized to access the admin portal. This email is not registered as an admin.');
      } else if (errorParam === 'auth_failed') {
        setError('Google Authentication failed.');
      } else if (errorParam === 'no_token' || errorParam === 'invalid_token') {
        setError('Google login failed: Invalid credential token.');
      }
      // Clean up search params
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/admin/config');
        if (response.ok) {
          const data = await response.json();
          setGoogleClientId(data.googleClientId);
        }
      } catch (_err) {
        // failed to load configuration
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (!googleClientId || showForgotPassword) return;

    const interval = setInterval(() => {
      // @ts-ignore
      if (window.google) {
        clearInterval(interval);
        // @ts-ignore
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          ux_mode: "redirect",
          login_uri: window.location.origin + "/api/admin/google-login-redirect",
        });

        // @ts-ignore
        window.google.accounts.id.renderButton(
          document.getElementById("googleBtn"),
          { 
            theme: "outline", 
            size: "large", 
            width: 320, 
            type: "standard",
            shape: "pill",
            text: "signin_with" 
          }
        );
      }
    }, 100);

    return () => clearInterval(interval);
  }, [googleClientId, showForgotPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const success = await loginAdmin(email, password);
      if (success) {
        navigate(`/${ADMIN_PREFIX}`);
      } else {
        setError('Invalid credentials. Please check your email and password.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSubmitting(true);

    try {
      const response = await fetch('/api/admin/forgotpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response.');
      }

      const data = await response.json();

      if (response.ok) {
        setForgotSuccess(true);
      } else {
        setForgotError(data.message || 'Failed to send reset email.');
      }
    } catch (err: any) {
      setForgotError(err.message || 'An error occurred. Please try again.');
    } finally {
      setForgotSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen flex items-center justify-center bg-pearl px-6 py-12"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white py-8 px-10 rounded-[32px] shadow-2xl border border-gold/10 text-center space-y-5"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 bg-secondary/5 rounded-2xl">
          <ShieldCheck className="text-secondary w-7 h-7" />
        </div>
        
        <AnimatePresence mode="wait">
          {!showForgotPassword ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-serif text-primary">Admin Portal</h1>
                <p className="text-mist text-sm">Secure access for managing the Pratibha Tiwari platform.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-mist ml-4">Email</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-mist w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-14 pr-6 py-3 bg-pearl border border-gold/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm"
                      placeholder="Enter email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-mist ml-4">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-mist w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-14 pr-14 py-3 bg-pearl border border-gold/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm"
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-mist hover:text-secondary transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-xs border border-red-100 text-center">
                    {error}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 bg-primary text-white rounded-full font-bold flex items-center justify-center hover:bg-secondary transition-all shadow-xl ${isSubmitting ? ' cursor-not-allowed' : ''} text-sm`}
                >
                  {isSubmitting ? 'Authenticating...' : 'Access Dashboard'} 
                  {!isSubmitting && <ArrowRight size={16} className="ml-2" />}
                </button>
              </form>

              {googleClientId && (
                <>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gold/10"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase font-mono tracking-widest text-mist">
                      <span className="bg-white px-4">Or</span>
                    </div>
                  </div>

                  <div className="flex justify-center w-full">
                    <div id="googleBtn" className="w-full max-w-[320px] flex justify-center"></div>
                  </div>
                </>
              )}

              <button
                onClick={() => { setShowForgotPassword(true); setForgotEmail(''); setForgotSuccess(false); setForgotError(''); }}
                className="text-xs text-secondary hover:text-primary transition-colors font-medium tracking-wide uppercase mt-2 block mx-auto"
              >
                Forgot Password?
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-serif text-primary">Reset Password</h1>
                <p className="text-mist text-sm">Enter your admin email and we'll send a password reset link.</p>
              </div>

              {forgotSuccess ? (
                <div className="space-y-5">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-green-50 rounded-2xl">
                    <CheckCircle className="text-green-500 w-7 h-7" />
                  </div>
                  <p className="text-sm text-green-700 bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                    Password reset link has been sent to your email. Please check your inbox (and spam folder).
                  </p>
                  <button
                    onClick={() => { setShowForgotPassword(false); setForgotSuccess(false); }}
                    className="text-xs text-secondary hover:text-primary transition-colors font-medium tracking-wide uppercase flex items-center justify-center mx-auto"
                  >
                    <ArrowLeft size={14} className="mr-2" /> Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4 text-left">
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-mist ml-4">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-mist w-5 h-5" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full pl-14 pr-6 py-3 bg-pearl border border-gold/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all text-sm"
                        placeholder="Enter your admin email"
                        required
                      />
                    </div>
                  </div>

                  {forgotError && (
                    <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-xs border border-red-100 text-center">
                      {forgotError}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={forgotSubmitting}
                    className={`w-full py-3.5 bg-primary text-white rounded-full font-bold flex items-center justify-center hover:bg-secondary transition-all shadow-xl ${forgotSubmitting ? 'cursor-not-allowed' : ''} text-sm`}
                  >
                    {forgotSubmitting ? 'Sending...' : 'Send Reset Link'}
                    {!forgotSubmitting && <Mail size={16} className="ml-2" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setShowForgotPassword(false); setForgotError(''); }}
                    className="w-full text-xs text-secondary hover:text-primary transition-colors font-medium tracking-wide uppercase flex items-center justify-center"
                  >
                    <ArrowLeft size={14} className="mr-2" /> Back to Login
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-[10px] uppercase font-mono tracking-widest text-mist pt-2">
          Protected by Premium Security Layer
        </div>
      </motion.div>
    </motion.div>
  );
}
