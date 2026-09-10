'use client';

import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';

export const StatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className = '' }) => {
  const normStatus = status?.trim() || '';

  if (normStatus === 'Rejected') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 ${className}`}>
        <XCircle className="w-3.5 h-3.5 text-rose-600" />
        <span>Rejected</span>
      </span>
    );
  }

  if (normStatus === 'Approved' || normStatus === 'Processed') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}>
        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
        <span>Approved</span>
      </span>
    );
  }

  if (normStatus === 'Ready for Review' || normStatus === 'Ready') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 ${className}`}>
        <Clock className="w-3.5 h-3.5 text-blue-600" />
        <span>Ready for Review</span>
      </span>
    );
  }

  // Needs Review / Need Review or fallback
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 ${className}`}>
      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
      <span>Needs Review</span>
    </span>
  );
};
