'use client';

import React, { useState } from 'react';
import { useDocuments } from '@/lib/store';
import { Download, Search } from 'lucide-react';
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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete record of extracted and approved financial transactions.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by vendor, category, or invoice #..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm transition-all"
        />
      </div>

      {/* Clean Table: Date | Vendor | Category | Amount | Status */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-3.5 px-4 font-semibold">Date</th>
                <th className="py-3.5 px-4 font-semibold">Vendor</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold text-right">Amount</th>
                <th className="py-3.5 px-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {transactions.length > 0 ? (
                transactions.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">{doc.date}</td>
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
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                    No transaction records match your search filter.
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
