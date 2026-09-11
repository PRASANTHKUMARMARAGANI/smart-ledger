'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDocuments } from '@/lib/store';
import { AlertTriangle, ArrowRight, CheckCircle2, ShieldAlert, Building2 } from 'lucide-react';

export default function ReviewPage() {
  const router = useRouter();
  const { documents } = useDocuments();

  // Filter ONLY documents requiring attention
  const reviewDocs = documents.filter((doc) => doc.status === 'Needs Review');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <ShieldAlert className="w-3 h-3 text-amber-400" />
              Human-in-the-Loop Audit Queue
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 font-display">
            Flagged Review Queue ({reviewDocs.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Documents flagged by the AI verification engine for arithmetic mismatches or duplicate warnings requiring CA sign-off.
          </p>
        </div>
      </div>

      {reviewDocs.length > 0 ? (
        <div className="glass-panel rounded-3xl border border-slate-800 shadow-2xl divide-y divide-slate-800/60 overflow-hidden">
          {reviewDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
            >
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white truncate font-display">
                      {doc.vendor}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      {doc.invoiceNumber} · {doc.date}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-amber-300 font-bold bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>{doc.issueDescription || 'Arithmetic Discrepancy Flagged'}</span>
                  </span>
                  <span className="font-extrabold text-white font-mono text-sm">
                    ₹{doc.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => router.push(`/documents/${doc.id}`)}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Inspect & Resolve</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-slate-800 p-12 text-center space-y-3 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white font-display">All Exceptions Cleared!</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Zero documents currently require review. All 100 enterprise ledger items are 100% verified.
          </p>
        </div>
      )}
    </div>
  );
}
