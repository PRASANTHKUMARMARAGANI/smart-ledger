'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2, KeyRound, User, Briefcase, RefreshCw, AlertTriangle } from 'lucide-react';
import { authenticateUser, sendOtpToEmail, verifyOtp, registerUser, UserRole } from '@/lib/auth';

type AuthMode = 'SIGN_IN' | 'SIGN_UP_EMAIL' | 'SIGN_UP_PASSWORD';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('SIGN_IN');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('Chartered Accountant');

  // UI State
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle Sign In with Email & Password
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both your email address and password.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const result = await authenticateUser(email, password);
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Authentication failed.');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Send Real-Time OTP to Email Inbox
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address to receive your 6-digit OTP verification code.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const result = await sendOtpToEmail(email);
      if (result.success) {
        setOtpSent(true);
        setSuccessMessage(result.message);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify Entered 6-Digit OTP Code from Email Inbox
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setError('Please enter the 6-digit OTP verification code received in your email inbox.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const result = await verifyOtp(email, otpCode);
      if (result.valid) {
        setSuccessMessage('✅ Email Address Verified! Please complete your name, role, and password setup below.');
        setMode('SIGN_UP_PASSWORD');
      } else {
        setError(result.reason || 'Invalid OTP verification code.');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Complete Account Registration & Set Password
  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !password) {
      setError('Please provide your Full Name and set a secure Password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const result = await registerUser({
        email,
        password,
        fullName,
        role,
      });

      if (result.success) {
        // Log in newly created user
        await authenticateUser(email, password);
        router.push('/dashboard');
      } else {
        setError(result.error || 'Failed to register account.');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-8 antialiased">
      {/* Top Bar Logo / Status */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between text-xs text-slate-500 font-medium">
        <span className="tracking-wide uppercase font-semibold text-slate-400">SmartLedger Platform</span>
        <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          System Operational
        </span>
      </div>

      {/* Main Auth Container */}
      <div className="my-auto max-w-md w-full mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 sm:p-10">
          {/* Logo & Tagline */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-bold text-2xl flex items-center justify-center mx-auto shadow-md mb-4">
              S
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">SmartLedger</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              {mode === 'SIGN_IN'
                ? 'Sign in to access your accounting ledger'
                : mode === 'SIGN_UP_EMAIL'
                ? 'Create Account'
                : 'Set Password & Complete Profile'}
            </p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* MODE 1: SIGN IN WITH EMAIL & PASSWORD */}
          {mode === 'SIGN_IN' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@apexaccounting.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Password</label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setSuccessMessage('');
                    setOtpSent(false);
                    setMode('SIGN_UP_EMAIL');
                  }}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline underline-offset-4"
                >
                  Need an account? Create Account
                </button>
              </div>
            </form>
          )}

          {/* MODE 2: SIGN UP STEP 1 (ENTER EMAIL -> ENTER 6-DIGIT OTP FROM INBOX) */}
          {mode === 'SIGN_UP_EMAIL' && (
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    disabled={otpSent}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@firm.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all disabled:opacity-60"
                  />
                </div>
              </div>

              {otpSent && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">6-Digit OTP Verification Code</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter 6-digit OTP from email inbox"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-mono tracking-widest placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Check your email inbox and spam folder for your 6-digit OTP code.</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
              >
                {isLoading ? (
                  <span>Processing...</span>
                ) : otpSent ? (
                  <>
                    <span>Verify Email OTP Code</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setSuccessMessage('');
                    setOtpSent(false);
                    setMode('SIGN_IN');
                  }}
                  className="text-slate-500 hover:text-slate-900 font-medium"
                >
                  ← Back to Sign In
                </button>
                {otpSent && (
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await sendOtpToEmail(email);
                      setSuccessMessage(res.message);
                    }}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend OTP to Email</span>
                  </button>
                )}
              </div>
            </form>
          )}

          {/* MODE 3: SIGN UP STEP 2 (SET PASSWORD & FULL NAME) */}
          {mode === 'SIGN_UP_PASSWORD' && (
            <form onSubmit={handleCompleteRegistration} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Prasanth Kumar, CA"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Account Role</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                  >
                    <option value="Chartered Accountant">Chartered Accountant (CA)</option>
                    <option value="Finance Manager">Finance Manager</option>
                    <option value="SMB Client">SMB Client User</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Set Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
              >
                {isLoading ? (
                  <span>Saving Account...</span>
                ) : (
                  <>
                    <span>Save Account & Access SmartLedger</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Security Footer */}
      <div className="max-w-md w-full mx-auto text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-slate-400" />
        <span>Real Email OTP Verification • Supabase Cloud User Encryption</span>
      </div>
    </div>
  );
}
