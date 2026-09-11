'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDocuments } from '@/lib/store';
import { getCurrentUserSession, updateUserProfile, UserRole } from '@/lib/auth';
import { Home, FileText, AlertCircle, Receipt, LogOut, User, Settings, CheckCircle2, X, Lock, Shield } from 'lucide-react';

export const NavigationShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { stats } = useDocuments();

  // User Profile State
  const [userSession, setUserSession] = useState<{ email: string; fullName: string; role: UserRole } | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('Chartered Accountant');
  const [editPassword, setEditPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  useEffect(() => {
    const session = getCurrentUserSession();
    if (session) {
      setUserSession({
        email: session.email,
        fullName: session.fullName || 'User Account',
        role: (session.role as UserRole) || 'Chartered Accountant',
      });
      setEditFullName(session.fullName || '');
      setEditRole((session.role as UserRole) || 'Chartered Accountant');
    }
  }, [pathname]);

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

  const getInitials = (name?: string) => {
    if (!name) return 'US';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSession) return;
    setIsSaving(true);
    setProfileMessage('');

    try {
      await updateUserProfile(userSession.email, {
        fullName: editFullName,
        role: editRole,
        password: editPassword ? editPassword : undefined,
      });

      setUserSession({
        ...userSession,
        fullName: editFullName,
        role: editRole,
      });

      setProfileMessage('✅ Profile updated successfully!');
      setTimeout(() => {
        setIsProfileOpen(false);
        setProfileMessage('');
        setEditPassword('');
      }, 1000);
    } catch (err) {
      setProfileMessage((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Review Queue', href: '/review', icon: AlertCircle, badge: stats.needsReview },
    { name: 'Transactions', href: '/transactions', icon: Receipt },
  ];

  const displayName = userSession ? userSession.fullName : 'Alex Morgan, CA';
  const displayEmail = userSession ? userSession.email : 'alex@apexaccounting.com';
  const displayRole = userSession ? userSession.role : 'Chartered Accountant';
  const initials = getInitials(displayName);

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
                  AI Accounting Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Main Navigation Links */}
          <nav className="p-4 space-y-1">
            <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Navigation
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
          </nav>
        </div>

        {/* Bottom Logged-in User Profile & Actions */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          {/* User Profile Card */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors group">
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
              title="Click to View & Edit Profile"
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                  {displayName}
                </p>
                <p className="text-[11px] text-slate-500 truncate">{displayEmail}</p>
              </div>
            </button>
            <div className="flex items-center gap-1 shrink-0 ml-1">
              <button
                onClick={() => setIsProfileOpen(true)}
                title="View / Edit Profile"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Minimal Header for Mobile */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              S
            </div>
            <span className="font-bold text-slate-900 tracking-tight">SmartLedger</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsProfileOpen(true)}
              className="text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-slate-100 px-3 py-1.5 rounded-lg"
            >
              Profile
            </button>
            <button onClick={handleLogout} className="p-1.5 text-slate-500 hover:text-rose-600">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* VIEW & EDIT USER PROFILE MODAL */}
      {isProfileOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-8 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                  {initials}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">User Profile</h3>
                  <p className="text-xs text-slate-500 font-medium">View and update account information</p>
                </div>
              </div>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {profileMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profileMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    disabled
                    value={displayEmail}
                    className="w-full pl-10 pr-24 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-600 font-medium cursor-not-allowed"
                  />
                  <span className="absolute right-2.5 top-2.5 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Verified
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Account Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-medium"
                >
                  <option value="Chartered Accountant">Chartered Accountant (CA)</option>
                  <option value="Finance Manager">Finance Manager</option>
                  <option value="SMB Client">SMB Client User</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Update Password <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Leave blank to keep current password"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-70"
                >
                  {isSaving ? 'Saving Updates...' : 'Save Profile Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
