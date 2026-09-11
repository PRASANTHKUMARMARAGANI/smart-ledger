'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDocuments } from '@/lib/store';
import { FileText, Search, Plus, ArrowRight, RotateCcw } from 'lucide-react';
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

  const getStatusBadge = (status: string) => {
    return <StatusBadge status={status} />;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Documents ({documents.length})</h1>
          <p className="text-xs text-slate-500 mt-1">
            All 100 uploaded invoices, receipts, and extracted financial records across 13 companies.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={resetDemoData}
            title="Reload 100 production demo documents across 13 companies"
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Records</span>
          </button>

          <button
            onClick={() => router.push('/upload')}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl overflow-x-auto">
          {(['All', 'VERIFIED', 'Needs Review', 'Approved', 'DUPLICATE', 'Extraction Failed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filter === tab
                  ? 'bg-slate-900 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vendor or invoice..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm"
          />
        </div>
      </div>

      {/* Document List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc) => (
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
                  <p className="text-sm font-semibold text-slate-900 truncate">{doc.vendor}</p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {doc.invoiceNumber} · ₹{doc.totalAmount.toLocaleString('en-IN')} · {doc.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {getStatusBadge(doc.status)}
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">
            No documents found matching criteria.
          </div>
        )}
      </div>
    </div>
  );
}
