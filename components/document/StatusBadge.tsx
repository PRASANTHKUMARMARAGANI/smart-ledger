'use client';

import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock, Copy, FileWarning } from 'lucide-react';

export const StatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className = '' }) => {
  const normStatus = status?.trim() || '';

  if (normStatus === 'Rejected') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 ${className}`}>
        <XCircle className="w-3.5 h-3.5 text-rose-600" />
        <span>Rejected</span>
      </span>
    );
  }

  if (normStatus === 'Approved' || normStatus === 'Processed') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${className}`}>
        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
        <span>Approved</span>
      </span>
    );
  }

  if (normStatus === 'VERIFIED' || normStatus === 'Verified') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/80 ${className}`}>
        <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
        <span>Verified</span>
      </span>
    );
  }

  if (normStatus === 'DUPLICATE' || normStatus === 'Duplicate') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/80 ${className}`}>
        <Copy className="w-3.5 h-3.5 text-purple-600" />
        <span>Duplicate</span>
      </span>
    );
  }

  if (normStatus === 'Extraction Failed' || normStatus === 'Failed') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 ${className}`}>
        <FileWarning className="w-3.5 h-3.5 text-slate-500" />
        <span>Extraction Failed</span>
      </span>
    );
  }

  if (normStatus === 'Ready for Review' || normStatus === 'Ready') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 ${className}`}>
        <Clock className="w-3.5 h-3.5 text-blue-600" />
        <span>Ready for Review</span>
      </span>
    );
  }

  // Default: Needs Review
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 ${className}`}>
      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
      <span>Needs Review</span>
    </span>
  );
};

