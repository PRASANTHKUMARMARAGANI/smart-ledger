'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock, Copy, ShieldCheck } from 'lucide-react';

export const StatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className = '' }) => {
  const normStatus = status?.trim() || '';

  if (normStatus === 'Approved' || normStatus === 'Processed') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm ${className}`}>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>Approved</span>
      </span>
    );
  }

  if (normStatus === 'VERIFIED' || normStatus === 'Verified') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-sm ${className}`}>
        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
        <span>Verified</span>
      </span>
    );
  }

  if (normStatus === 'DUPLICATE' || normStatus === 'Duplicate') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm ${className}`}>
        <Copy className="w-3.5 h-3.5 text-purple-400" />
        <span>Duplicate</span>
      </span>
    );
  }

  if (normStatus === 'Extraction Failed' || normStatus === 'Failed' || normStatus === 'Rejected') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-sm ${className}`}>
        <XCircle className="w-3.5 h-3.5 text-rose-400" />
        <span>{normStatus === 'Extraction Failed' ? 'Failed' : 'Rejected'}</span>
      </span>
    );
  }

  if (normStatus === 'Ready for Review' || normStatus === 'Ready') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-sm ${className}`}>
        <Clock className="w-3.5 h-3.5 text-sky-400" />
        <span>Ready</span>
      </span>
    );
  }

  // Needs Review / Fallback
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm ${className}`}>
      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
      <span>Needs Review</span>
    </span>
  );
};
