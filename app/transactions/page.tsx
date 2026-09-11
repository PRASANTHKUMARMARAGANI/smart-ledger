'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDocuments } from '@/lib/store';
import { Download, Search, CheckCircle, AlertTriangle, XCircle, FileText } from 'lucide-react';
import { StatusBadge } from '@/components/document/StatusBadge';

export default function TransactionsPage() {
  const router = useRouter();
  const { documents, exportCSV } = useDocuments();
  const [filter, setFilter] = useState<'All' | 'Approved' | 'Needs Review' | 'Rejected' | 'VERIFIED' | 'DUPLICATE' | 'Extraction Failed'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const approvedCount = documents.filter((d) => d.status === 'Approved' || d.status === 'Processed').length;
  const needsReviewCount = documents.filter((d) => d.status === 'Needs Review').length;
  const rejectedCount = documents.filter((d) => d.status === 'Rejected').length;

  // Filter transactions by status & search term
  const transactions = documents.filter((doc) => {
    const matchesFilter = filter === 'All' || doc.status === filter;
    const matchesSearch =
      doc.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transactions ({documents.length})</h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete audit trail of financial transactions across 13 enterprise companies.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Approved CSV</span>
        </button>
      </div>

      {/* Quick Status Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase">Total Records</p>
            <p className="text-lg font-bold text-slate-900">{documents.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase">Approved</p>
            <p className="text-lg font-bold text-emerald-700">{approvedCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase">Waiting Approval</p>
            <p className="text-lg font-bold text-amber-700">{needsReviewCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <XCircle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase">Rejected</p>
            <p className="text-lg font-bold text-rose-700">{rejectedCount}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl overflow-x-auto">
          {(['All', 'Approved', 'Needs Review', 'Rejected', 'VERIFIED', 'DUPLICATE', 'Extraction Failed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filter === tab
                  ? 'bg-slate-900 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab === 'Needs Review' ? 'Waiting Approval' : tab}
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

      {/* Clean Table: Date | Vendor | Category | Amount | Status */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-3.5 px-4 font-semibold">Date</th>
                <th className="py-3.5 px-4 font-semibold">Invoice #</th>
                <th className="py-3.5 px-4 font-semibold">Vendor</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold text-right">Amount</th>
                <th className="py-3.5 px-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {transactions.length > 0 ? (
                transactions.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => router.push(`/documents/${doc.id}`)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">{doc.date}</td>
                    <td className="py-3.5 px-4 text-indigo-600 font-mono font-semibold">{doc.invoiceNumber}</td>
                    <td className="py-3.5 px-4 text-slate-900 font-bold">{doc.vendor}</td>
                    <td className="py-3.5 px-4 text-slate-600">{doc.category}</td>
                    <td className="py-3.5 px-4 text-slate-900 font-bold text-right">
                      ₹{doc.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={doc.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    No transaction records match your search or status filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

