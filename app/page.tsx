'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageModal, setMessageModal] = useState<string | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ledger_agent_auth', JSON.stringify({ email, authenticated: true }));
      }
      router.push('/dashboard');
    }, 600);
  };

  const handleQuickDemoFill = (type: 'ca' | 'finance') => {
    if (type === 'ca') {
      setEmail('alex.morgan@apexaccounting.com');
      setPassword('Ledger2026!');
    } else {
      setEmail('sarah.jenkins@finops.co');
      setPassword('Pass2026!');
    }
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-8 antialiased">
      {/* Top Bar Logo / Status */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between text-xs text-slate-500 font-medium">
        <span className="tracking-wide uppercase font-semibold text-slate-400">SmartLedger Demo</span>
        <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          System Operational
        </span>
      </div>

      {/* Main Login Card */}
      <div className="my-auto max-w-md w-full mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 sm:p-10">
          {/* Logo & Tagline */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-bold text-2xl flex items-center justify-center mx-auto shadow-md mb-4">
              S
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">SmartLedger</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Your AI assistant for accounting work.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@accountingfirm.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setMessageModal('Forgot password link: For security, contact IT admin or use quick demo login below.')}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
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
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Autofill section for hackathon review */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Hackathon Quick Demo Fill:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('ca')}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition-colors text-left flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Alex (CA)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('finance')}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition-colors text-left flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="truncate">Sarah (Manager)</span>
              </button>
            </div>
          </div>

          {/* Create Account Link */}
          <div className="mt-6 text-center text-xs text-slate-500">
            <button
              onClick={() => setMessageModal('Create Account: SmartLedger accounts are managed by your firm admin during private beta.')}
              className="hover:text-indigo-600 font-medium text-slate-600 underline underline-offset-4"
            >
              New to SmartLedger? Create account
            </button>
          </div>
        </div>
      </div>

      {/* Security note footer */}
      <div className="max-w-md w-full mx-auto text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-slate-400" />
        <span>Human-in-the-Loop Safe • Modern Accounting AI</span>
      </div>

      {/* Helper Modal */}
      {messageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-2">SmartLedger Demo Note</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">{messageModal}</p>
            <button
              onClick={() => setMessageModal(null)}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
