/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { ADMIN_PREFIX } from '../../config/admin';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid or expired reset token. Please request a new link.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/resetpassword/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response.');
      }

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pearl px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full bg-white p-12 rounded-[48px] shadow-2xl border border-gold/10 text-center space-y-10"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary/5 rounded-3xl mb-4">
          <ShieldCheck className="text-secondary w-10 h-10" />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-serif text-primary">New Password</h1>
          <p className="text-mist text-sm">Please set your new secure password below.</p>
        </div>

        {success ? (
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-2xl">
              <CheckCircle className="text-green-500 w-8 h-8" />
            </div>
            <p className="text-sm text-green-700 bg-green-50 p-4 rounded-xl border border-green-100">
              Your password has been successfully updated! You can now log in with your new password.
            </p>
            <button
              onClick={() => navigate(`/${ADMIN_PREFIX}/login`)}
              className="w-full py-5 bg-primary text-white rounded-full font-bold flex items-center justify-center hover:bg-secondary transition-all shadow-xl"
            >
              Go to Login <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            {!token && (
              <div className="p-4 bg-amber-50 text-amber-700 rounded-xl text-xs border border-amber-100 text-center">
                Warning: No reset token detected in the URL. Ensure you follow the link sent to your email.
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-mist ml-4">New Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-mist w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-14 py-4 bg-pearl border border-gold/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-mist hover:text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-mist ml-4">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-mist w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-14 pr-14 py-4 bg-pearl border border-gold/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                  placeholder="Confirm new password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs border border-red-100 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !token}
              className={`w-full py-5 bg-primary text-white rounded-full font-bold flex items-center justify-center hover:bg-secondary transition-all shadow-xl ${(isSubmitting || !token) ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
              {!isSubmitting && <ArrowRight size={18} className="ml-2" />}
            </button>
          </form>
        )}

        <div className="text-[10px] uppercase font-mono tracking-widest text-mist pt-4">
          Protected by Premium Security Layer
        </div>
      </motion.div>
    </div>
  );
}
