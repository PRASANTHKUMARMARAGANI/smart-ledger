'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDocuments } from '@/lib/store';
import { Plus, FileText, ArrowRight } from 'lucide-react';
import { StatusBadge } from '@/components/document/StatusBadge';

export default function DashboardPage() {
  const router = useRouter();
  const { documents, stats } = useDocuments();

  // Get recent top documents
  const recentDocs = documents.slice(0, 5);

  const getStatusBadge = (status: string) => {
    return <StatusBadge status={status} />;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 2. Main Dashboard Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Good morning 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Let SmartLedger handle the repetitive work.
        </p>
      </div>

      {/* 3 Important Numbers Only */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Documents
          </span>
          <span className="text-3xl font-bold text-slate-900 mt-2">
            {stats.documents}
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
            Needs Review
          </span>
          <span className="text-3xl font-bold text-amber-800 mt-2">
            {stats.needsReview}
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Processed
          </span>
          <span className="text-3xl font-bold text-slate-900 mt-2">
            {stats.processed}
          </span>
        </div>
      </div>

      {/* Main Action Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📄</span>
            <h2 className="text-lg font-bold text-slate-900">Process a Document</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Upload an invoice, receipt, or financial document and we'll extract and check the details for you.
          </p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 w-full sm:w-auto">
          <Link
            href="/upload"
            className="w-full sm:w-auto px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </Link>
        </div>
      </div>

      {/* 3. Recent Work List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Recent Documents</h3>
          <Link href="/documents" className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1">
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentDocs.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-700">No documents in ledger yet</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Upload your first real-time financial document or connect your Supabase Cloud database to see records here.
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {recentDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => router.push(`/documents/${doc.id}`)}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {doc.vendor}
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      Invoice · ₹{doc.totalAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {getStatusBadge(doc.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
