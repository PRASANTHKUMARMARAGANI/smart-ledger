'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDocuments } from '@/lib/store';
import { AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ReviewPage() {
  const router = useRouter();
  const { documents } = useDocuments();

  // Filter ONLY documents requiring attention
  const reviewDocs = documents.filter((doc) => doc.status === 'Needs Review');

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Needs Your Review</h1>
        <p className="text-xs text-slate-500 mt-1">
          Documents flagged with exceptions or mismatches requiring human sign-off.
        </p>
      </div>

      {reviewDocs.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {reviewDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 truncate">
                    {doc.vendor}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Invoice {doc.invoiceNumber}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1 text-amber-800 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{doc.issueDescription ? doc.issueDescription.split(':')[0] : 'Needs Review'}</span>
                  </span>
                  <span className="font-bold text-slate-900">
                    ₹{doc.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => router.push(`/documents/${doc.id}`)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">All caught up!</h3>
          <p className="text-xs text-slate-500">
            There are no documents currently requiring attention.
          </p>
        </div>
      )}
    </div>
  );
}
