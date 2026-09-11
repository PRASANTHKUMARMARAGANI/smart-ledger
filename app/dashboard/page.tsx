'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDocuments } from '@/lib/store';
import { Plus, FileText, ArrowRight, TrendingUp, AlertTriangle, CheckCircle2, Building2, Download, Sparkles, Database } from 'lucide-react';
import { StatusBadge } from '@/components/document/StatusBadge';

export default function DashboardPage() {
  const router = useRouter();
  const { documents, stats, exportCSV, isCloudSynced } = useDocuments();

  // Get recent top documents
  const recentDocs = documents.slice(0, 6);

  // Compute total ledger volume
  const totalVolume = documents.reduce((sum, doc) => sum + doc.totalAmount, 0);

  // Unique company count
  const uniqueCompanies = new Set(documents.map((d) => d.vendor)).size;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Executive Welcome & Live Cloud Sync Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
              AI Ledger Core v2.4 Active
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1.5 ${
              isCloudSynced ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              <Database className="w-3 h-3" />
              {isCloudSynced ? 'Supabase DB Connected' : 'Local Persistence Storage'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            Executive Ledger Overview 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time financial document processing & audit pipeline across {uniqueCompanies || 13} enterprise entities.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <button
            onClick={exportCSV}
            className="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700/80 transition-all flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export CSV</span>
          </button>
          <Link
            href="/upload"
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Process Document</span>
          </Link>
        </div>
      </div>

      {/* 4 Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Volume */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Total Volume</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
              ₹{totalVolume.toLocaleString('en-IN')}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Across 100 enterprise invoices</p>
          </div>
        </div>

        {/* Total Documents */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Total Records</span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
              {stats.documents}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">{uniqueCompanies} Active Companies</p>
          </div>
        </div>

        {/* Needs Review */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">Flagged Queue</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 tracking-tight font-mono">
              {stats.needsReview}
            </span>
            <p className="text-[11px] text-amber-400/80 mt-1">Requires CA audit review</p>
          </div>
        </div>

        {/* Processed / Approved */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">Approved</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-300 tracking-tight font-mono">
              {stats.processed}
            </span>
            <p className="text-[11px] text-emerald-400/80 mt-1">100% Verified Ledger Items</p>
          </div>
        </div>
      </div>

      {/* Recent Ledger Documents Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight font-display">Recent Invoices & Receipts</h2>
            <p className="text-xs text-slate-400">Latest extracted documents in the processing queue</p>
          </div>
          <Link href="/documents" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 group">
            <span>View All 100 Documents</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden divide-y divide-slate-800/60 shadow-xl">
          {recentDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => router.push(`/documents/${doc.id}`)}
              className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-800/40 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 transition-colors">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-100 truncate group-hover:text-indigo-300 transition-colors">
                      {doc.vendor}
                    </p>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {doc.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5 font-mono">
                    {doc.invoiceNumber} · {doc.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-sm font-extrabold text-white font-mono">
                  ₹{doc.totalAmount.toLocaleString('en-IN')}
                </span>
                <StatusBadge status={doc.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
