'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDocuments } from '@/lib/store';
import { Home, FileText, AlertCircle, Receipt, LogOut, Sparkles, Check, Bot, Activity, CreditCard, ShieldCheck } from 'lucide-react';

export const NavigationShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { stats, resetDemoData } = useDocuments();
  const [showResetToast, setShowResetToast] = useState(false);

  // If on login page, don't show main navigation layout shell
  if (pathname === '/' || pathname === '/login') {
    return <>{children}</>;
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ledger_agent_auth');
    }
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Review Queue', href: '/review', icon: AlertCircle, badge: stats.needsReview },
    { name: 'Transactions', href: '/transactions', icon: Receipt },
  ];

  const advancedItems = [
    { name: 'Agent Operations', href: '/agents', icon: Bot },
    { name: 'AI Evaluation', href: '/eval', icon: Activity },
    { name: 'SaaS Billing', href: '/billing', icon: CreditCard },
    { name: 'Security & Audit', href: '/security', icon: ShieldCheck },
  ];

  const handleResetData = () => {
    resetDemoData();
    setShowResetToast(true);
    setTimeout(() => setShowResetToast(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row antialiased font-sans">
      {/* Sidebar Navigation for Desktop */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 shadow-sm z-20">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform">
                S
              </div>
              <div>
                <span className="font-bold text-slate-900 tracking-tight text-lg leading-tight block">
                  SmartLedger
                </span>
                <span className="text-[11px] text-slate-500 font-medium block">
                  AI Accounting Assistant
                </span>
              </div>
            </Link>
          </div>

          {/* Main Navigation Links */}
          <nav className="p-4 space-y-1">
            <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Core Platform
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isActive ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-4 px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Enterprise & AI Ops
            </div>
            {advancedItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/60'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          {/* Quick Hackathon Reset Data option */}
          <button
            onClick={handleResetData}
            className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Reset Demo Data</span>
          </button>

          {/* User Profile Card */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                AM
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">Alex Morgan, CA</p>
                <p className="text-[11px] text-slate-500 truncate">alex@apexaccounting.com</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Minimal Header for Mobile / Breadcrumb */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              S
            </div>
            <span className="font-bold text-slate-900 tracking-tight">SmartLedger</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleLogout} className="p-1.5 text-slate-500 hover:text-slate-900">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Toast feedback */}
      {showResetToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2 border border-slate-800 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Demo document state reset successfully!</span>
        </div>
      )}
    </div>
  );
};
