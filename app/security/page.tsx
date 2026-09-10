'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Lock, UserCheck, Key, Eye, AlertOctagon, Terminal, CheckCircle2, Shield } from 'lucide-react';
import { getAuditLogs, AuditLogEntry } from '@/lib/auditLogger';
import { ROLE_PERMISSIONS, UserRole } from '@/lib/security';

export default function SecurityPage() {
  const [logs] = useState<AuditLogEntry[]>(getAuditLogs());
  const [selectedRole, setSelectedRole] = useState<UserRole>('Chartered Accountant');

  const securityLogs = logs.filter((l) => l.category === 'SECURITY' || l.category === 'AGENT');
  const rolePermissions = ROLE_PERMISSIONS[selectedRole];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Production Security & Safety Shield (Phase 3 + Challenge 4)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Security, Prompt-Injection Protection & Audit Trail
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Defense-in-depth architecture covering prompt injection interceptors, role-based access control (RBAC), rate limiters, payload sanitization, and immutable audit logs.
            </p>
          </div>
        </div>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Prompt Injection Shield</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg font-extrabold text-emerald-600">ACTIVE & PROTECTED</p>
          <p className="text-[11px] text-slate-500 mt-1">Regex + Heuristic Interceptor</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">API Rate Limiter</span>
            <Lock className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-lg font-extrabold text-slate-900">30 req / min</p>
          <p className="text-[11px] text-slate-500 mt-1">Token bucket algorithm</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Payload Size Boundary</span>
            <AlertOctagon className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-lg font-extrabold text-slate-900">10 MB Max</p>
          <p className="text-[11px] text-slate-500 mt-1">PE Executable Header Check</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Audit Trail Integrity</span>
            <Key className="w-4 h-4 text-slate-700" />
          </div>
          <p className="text-lg font-extrabold text-slate-900">VERIFIED</p>
          <p className="text-[11px] text-slate-500 mt-1">Cryptographic session logging</p>
        </div>
      </div>

      {/* RBAC Role & Permission Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span>Role-Based Access Control (RBAC) Permission Matrix</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Enforces agent permission boundaries and access controls</p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Inspect Role:</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
            >
              <option value="Chartered Accountant">Chartered Accountant (CA)</option>
              <option value="Finance Manager">Finance Manager</option>
              <option value="SMB Client">SMB Client User</option>
              <option value="Auditor">External Auditor</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className={`p-3 rounded-xl border text-center ${rolePermissions.canApprove ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Approve Invoice</span>
            <span className={`text-xs font-extrabold ${rolePermissions.canApprove ? 'text-emerald-700' : 'text-slate-400'}`}>
              {rolePermissions.canApprove ? 'ALLOWED' : 'DENIED'}
            </span>
          </div>

          <div className={`p-3 rounded-xl border text-center ${rolePermissions.canReject ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Reject Invoice</span>
            <span className={`text-xs font-extrabold ${rolePermissions.canReject ? 'text-emerald-700' : 'text-slate-400'}`}>
              {rolePermissions.canReject ? 'ALLOWED' : 'DENIED'}
            </span>
          </div>

          <div className={`p-3 rounded-xl border text-center ${rolePermissions.canUpload ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Upload Documents</span>
            <span className={`text-xs font-extrabold ${rolePermissions.canUpload ? 'text-emerald-700' : 'text-slate-400'}`}>
              {rolePermissions.canUpload ? 'ALLOWED' : 'DENIED'}
            </span>
          </div>

          <div className={`p-3 rounded-xl border text-center ${rolePermissions.canExport ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Export Ledger</span>
            <span className={`text-xs font-extrabold ${rolePermissions.canExport ? 'text-emerald-700' : 'text-slate-400'}`}>
              {rolePermissions.canExport ? 'ALLOWED' : 'DENIED'}
            </span>
          </div>

          <div className={`p-3 rounded-xl border text-center ${rolePermissions.canAccessSecurityLogs ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Security Logs</span>
            <span className={`text-xs font-extrabold ${rolePermissions.canAccessSecurityLogs ? 'text-emerald-700' : 'text-slate-400'}`}>
              {rolePermissions.canAccessSecurityLogs ? 'ALLOWED' : 'DENIED'}
            </span>
          </div>

          <div className={`p-3 rounded-xl border text-center ${rolePermissions.canAccessBilling ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">SaaS Billing</span>
            <span className={`text-xs font-extrabold ${rolePermissions.canAccessBilling ? 'text-emerald-700' : 'text-slate-400'}`}>
              {rolePermissions.canAccessBilling ? 'ALLOWED' : 'DENIED'}
            </span>
          </div>
        </div>
      </div>

      {/* Security & Audit Trail Stream */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-800" />
            <span>Security Events & Immutable Audit Stream</span>
          </span>
          <span className="text-xs text-slate-500 font-normal">Real-time threat monitoring</span>
        </h2>

        <div className="space-y-3 font-mono text-xs">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                log.severity === 'CRITICAL'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : log.severity === 'WARNING'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold">{log.action}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-sans font-bold bg-white/70 border border-slate-200">
                    {log.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-sans">({log.userEmail})</span>
                </div>
                <p className="font-sans text-xs text-slate-700">{log.details}</p>
              </div>

              <div className="text-right shrink-0 font-sans text-[11px] text-slate-400">
                <div>{log.timestamp}</div>
                <div>IP: {log.ipAddress}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
