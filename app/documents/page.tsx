'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDocuments } from '@/lib/store';
import { FileText, Search, Plus, ArrowRight, RotateCcw, Building2, Filter } from 'lucide-react';
import { StatusBadge } from '@/components/document/StatusBadge';

export default function AllDocumentsPage() {
  const router = useRouter();
  const { documents, resetDemoData } = useDocuments();
  const [filter, setFilter] = useState<'All' | 'VERIFIED' | 'Needs Review' | 'Approved' | 'DUPLICATE' | 'Extraction Failed'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocs = documents.filter((doc) => {
    const matchesFilter = filter === 'All' || doc.status === filter;
    const matchesSearch =
      doc.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Database Core
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {documents.length} Records Loaded
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 font-display">
            Document Repository ({documents.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete general ledger archive across 13 enterprise companies with OCR & AI extraction checks.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            onClick={resetDemoData}
            title="Reload 100 production demo documents across 13 companies"
            className="px-3.5 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700/80 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Reset 100 Records</span>
          </button>

          <button
            onClick={() => router.push('/upload')}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Process Document</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1.5 glass-panel rounded-2xl border border-slate-800 overflow-x-auto">
          <div className="px-2.5 py-1 text-slate-500 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Status:</span>
          </div>
          {(['All', 'VERIFIED', 'Needs Review', 'Approved', 'DUPLICATE', 'Extraction Failed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filter === tab
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 border border-indigo-400/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company, invoice #, category..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 shadow-sm font-medium"
          />
        </div>
      </div>

      {/* Document List */}
      <div className="glass-panel rounded-3xl border border-slate-800/80 shadow-2xl divide-y divide-slate-800/60 overflow-hidden">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => router.push(`/documents/${doc.id}`)}
              className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-800/40 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 transition-colors">
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
                    {doc.invoiceNumber} · ₹{doc.totalAmount.toLocaleString('en-IN')} · {doc.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <StatusBadge status={doc.status} />
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-200 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs font-medium space-y-2">
            <FileText className="w-8 h-8 mx-auto text-slate-600" />
            <p>No documents found matching search criteria "{searchTerm}".</p>
          </div>
        )}
      </div>
    </div>
  );
}
