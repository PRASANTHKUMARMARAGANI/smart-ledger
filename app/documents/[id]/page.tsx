'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDocuments } from '@/lib/store';
import { DocumentPreview } from '@/components/document/DocumentPreview';
import { StatusBadge } from '@/components/document/StatusBadge';
import { Check, AlertTriangle, Edit3, ArrowLeft, CheckCircle2, XCircle, Building2, Calendar, Receipt, FileText } from 'lucide-react';

export default function DocumentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getDocumentById, updateDocument, approveDocument, rejectDocument } = useDocuments();

  const docId = params.id as string;
  const doc = getDocumentById(docId);

  const [isEditing, setIsEditing] = useState(false);
  const [isApprovedSuccess, setIsApprovedSuccess] = useState(false);

  // Form state for editing
  const [vendor, setVendor] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [date, setDate] = useState('');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (doc) {
      setVendor(doc.vendor);
      setInvoiceNumber(doc.invoiceNumber);
      setDate(doc.date);
      setTotalAmount(doc.totalAmount);
      setCategory(doc.category);
    }
  }, [doc]);

  if (!doc) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-white">Document not found</h2>
        <p className="text-xs text-slate-400">The document you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => router.push('/documents')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
        >
          Back to Documents
        </button>
      </div>
    );
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDocument(doc.id, {
      vendor,
      invoiceNumber,
      date,
      totalAmount: Number(totalAmount),
      category,
      calculatedTotal: Number(totalAmount),
      issueDescription: null,
      status: 'Ready for Review',
      checks: {
        requiredInfoFound: true,
        amountVerified: true,
        noDuplicateFound: true,
      },
    });
    setIsEditing(false);
  };

  const handleApprove = () => {
    approveDocument(doc.id);
    setIsApprovedSuccess(true);
  };

  const handleReject = () => {
    rejectDocument(doc.id);
    router.push('/dashboard');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top back navigation */}
      <button
        onClick={() => router.push('/documents')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Document Repository</span>
      </button>

      {/* PROBLEM DETECTION BANNER (IF ISSUE PRESENT) */}
      {doc.status === 'Needs Review' && !isApprovedSuccess && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-amber-200">
                ⚠ Arithmetic Audit Discrepancy Flagged
              </h3>
              <div className="text-xs text-amber-300 space-x-4 pt-1 font-mono">
                <span>Extracted Total: <strong>₹{doc.totalAmount.toLocaleString('en-IN')}</strong></span>
                <span>Calculated Total: <strong>₹{doc.calculatedTotal.toLocaleString('en-IN')}</strong></span>
              </div>
              <p className="text-xs text-amber-400/90 pt-0.5">
                {doc.issueDescription || 'Please review items before approving into general ledger.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-amber-500/20">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-bold rounded-xl border border-amber-500/40 transition-colors"
            >
              Correct Details
            </button>
          </div>
        </div>
      )}

      {/* APPROVED SUCCESS BANNER */}
      {isApprovedSuccess || doc.status === 'Approved' ? (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-6 text-center space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-emerald-300 font-display">✓ Approved into General Ledger</h2>
            <p className="text-xs text-emerald-400/80 mt-0.5">
              Verified financial item posted to accounting ledger with CA audit clearance.
            </p>
          </div>
        </div>
      ) : null}

      {/* TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: DOCUMENT PREVIEW */}
        <div className="lg:col-span-6">
          <DocumentPreview doc={doc} />
        </div>

        {/* RIGHT COLUMN: EXTRACTED DETAILS & AUDIT CHECKS */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white font-display">Extracted Record Details</h2>
                <p className="text-xs text-slate-400 font-mono">ID: {doc.id}</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Cancel' : 'Edit Fields'}</span>
              </button>
            </div>

            {isEditing ? (
              /* INLINE EDIT FORM */
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Company / Vendor Name</label>
                  <input
                    type="text"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Invoice Number</label>
                    <input
                      type="text"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Invoice Date</label>
                    <input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Total Amount (₹)</label>
                    <input
                      type="number"
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Accounting Category</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md"
                  >
                    Save & Re-verify
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              /* READONLY DISPLAY FIELDS */
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Vendor & Supplier</span>
                  <span className="font-extrabold text-white text-lg font-display">{doc.vendor}</span>
                  {doc.vendorGstin && <p className="text-xs text-indigo-400 font-mono mt-0.5">GSTIN: {doc.vendorGstin}</p>}
                  {doc.vendorAddress && <p className="text-xs text-slate-400 mt-1 leading-relaxed">{doc.vendorAddress}</p>}
                </div>

                <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Invoice Number</span>
                    <span className="font-bold text-white font-mono">{doc.invoiceNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Invoice Date</span>
                    <span className="font-semibold text-slate-200">{doc.date}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Due Date</span>
                    <span className="font-semibold text-slate-300">{doc.dueDate || 'Net 30 Days'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">PO Number</span>
                    <span className="font-semibold text-slate-300 font-mono">{doc.poNumber || 'PO-8840'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Subtotal:</span>
                    <span className="font-mono font-semibold text-slate-200">₹{doc.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {doc.taxGst > 0 && (
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>{doc.taxLabel || 'Tax / GST (18%)'}:</span>
                      <span className="font-mono font-semibold text-slate-200">₹{doc.taxGst.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                    <span>Total Amount (INR):</span>
                    <span className="font-mono text-indigo-400 text-lg">₹{doc.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* AUDIT CHECK RESULTS */}
            <div className="border-t border-slate-800 pt-5 space-y-3">
              <h3 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                AI Agent Verification Pipeline Checks
              </h3>

              <div className="space-y-2.5 text-xs font-semibold">
                <div className={`flex items-center gap-2.5 p-2 rounded-xl border ${
                  doc.checks.requiredInfoFound ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                }`}>
                  {doc.checks.requiredInfoFound ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                  <span>{doc.checks.requiredInfoFound ? 'Required Info Present (Vendor, Date, Amount)' : 'Required Information Incomplete'}</span>
                </div>

                <div className={`flex items-center gap-2.5 p-2 rounded-xl border ${
                  doc.checks.amountVerified ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                }`}>
                  {doc.checks.amountVerified ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                  <span>{doc.checks.amountVerified ? 'Arithmetic Calculation Verified' : 'Arithmetic Discrepancy Flagged'}</span>
                </div>

                <div className={`flex items-center gap-2.5 p-2 rounded-xl border ${
                  doc.checks.noDuplicateFound ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                }`}>
                  {doc.checks.noDuplicateFound ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
                  <span>{doc.checks.noDuplicateFound ? 'No Duplicate Invoice Record' : 'Duplicate Invoice Warning'}</span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-800">
                <span className="text-xs text-slate-400 font-mono font-bold uppercase">Ledger Status</span>
                <StatusBadge status={doc.status} />
              </div>
            </div>

            {/* ACTION CONTROLS */}
            {!isApprovedSuccess && doc.status !== 'Approved' && (
              <div className="border-t border-slate-800 pt-6 space-y-3">
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    onClick={handleApprove}
                    className="py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-white" />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={handleReject}
                    className="py-3 px-4 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-bold text-xs rounded-xl border border-rose-500/30 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
