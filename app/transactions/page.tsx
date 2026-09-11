'use client';

import React, { useState } from 'react';
import { useDocuments } from '@/lib/store';
import { Download, Search, Receipt, TrendingUp, Building2 } from 'lucide-react';
import { StatusBadge } from '@/components/document/StatusBadge';

export default function TransactionsPage() {
  const { documents, exportCSV } = useDocuments();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter approved transactions
  const transactions = documents.filter(
    (doc) =>
      doc.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSum = transactions.reduce((acc, t) => acc + t.totalAmount, 0);
  const totalTax = transactions.reduce((acc, t) => acc + (t.taxGst || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              General Ledger Archive
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 font-display">
            Financial Transactions ({transactions.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete audit ledger of approved vendor invoices, GST taxes, and line-item totals.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
          <button
            onClick={exportCSV}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Export General Ledger (CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Filtered Volume</span>
            <p className="text-xl font-extrabold text-white font-mono mt-1">₹{totalSum.toLocaleString('en-IN')}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Total GST Tax Audit</span>
            <p className="text-xl font-extrabold text-emerald-300 font-mono mt-1">₹{totalTax.toLocaleString('en-IN')}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Total Transactions</span>
            <p className="text-xl font-extrabold text-sky-300 font-mono mt-1">{transactions.length} Invoices</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by company, category, or invoice #..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium"
        />
      </div>

      {/* Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 font-mono text-[10px] uppercase tracking-wider border-b border-slate-800">
                <th className="py-4 px-5 font-bold">Invoice Date</th>
                <th className="py-4 px-5 font-bold">Company / Vendor</th>
                <th className="py-4 px-5 font-bold">Invoice #</th>
                <th className="py-4 px-5 font-bold">Category</th>
                <th className="py-4 px-5 font-bold text-right">Subtotal</th>
                <th className="py-4 px-5 font-bold text-right">GST (18%)</th>
                <th className="py-4 px-5 font-bold text-right">Total Amount</th>
                <th className="py-4 px-5 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {transactions.length > 0 ? (
                transactions.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-5 text-slate-400 font-mono whitespace-nowrap">{doc.date}</td>
                    <td className="py-4 px-5 text-white font-bold">{doc.vendor}</td>
                    <td className="py-4 px-5 text-indigo-400 font-mono">{doc.invoiceNumber}</td>
                    <td className="py-4 px-5 text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                        {doc.category}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-slate-300 font-mono text-right">₹{doc.subtotal.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-5 text-emerald-400 font-mono text-right">₹{(doc.taxGst || 0).toLocaleString('en-IN')}</td>
                    <td className="py-4 px-5 text-white font-extrabold font-mono text-right text-sm">
                      ₹{doc.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <StatusBadge status={doc.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs font-medium">
                    No transaction records match search filter "{searchTerm}".
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
