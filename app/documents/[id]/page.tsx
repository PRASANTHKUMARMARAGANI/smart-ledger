'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDocuments } from '@/lib/store';
import { DocumentPreview } from '@/components/document/DocumentPreview';
import { StatusBadge } from '@/components/document/StatusBadge';
import { Check, AlertTriangle, Edit3, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

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
        <h2 className="text-xl font-bold text-slate-900">Document not found</h2>
        <p className="text-xs text-slate-500">The document you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          Back to Dashboard
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
      // If amount was fixed, clear mismatch
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
        onClick={() => router.push('/dashboard')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Dashboard</span>
      </button>

      {/* SECTION 9: PROBLEM DETECTION BANNER (IF ISSUE PRESENT) */}
      {doc.status === 'Needs Review' && !isApprovedSuccess && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-amber-900">
                ⚠ Something needs your attention
              </h3>
              <p className="text-xs font-semibold text-amber-800">
                Amount mismatch
              </p>
              <div className="text-xs text-amber-800 space-x-4 pt-1 font-mono">
                <span>Invoice total: <strong>₹{doc.totalAmount.toLocaleString('en-IN')}</strong></span>
                <span>Calculated total: <strong>₹{doc.calculatedTotal.toLocaleString('en-IN')}</strong></span>
              </div>
              <p className="text-xs text-amber-700 pt-1">
                Please review this document before approving it.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-amber-200/60">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Edit Details
            </button>
          </div>
        </div>
      )}

      {/* SECTION 8: APPROVED SUCCESS CARD */}
      {isApprovedSuccess || doc.status === 'Approved' ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-emerald-900">✓ Approved</h2>
            <p className="text-xs font-semibold text-emerald-800 mt-1">
              This transaction has been added to your records.
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      ) : null}

      {/* SECTION 6: TWO-COLUMN RESULTS LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: DOCUMENT PREVIEW */}
        <div className="lg:col-span-6">
          <DocumentPreview doc={doc} />
        </div>

        {/* RIGHT COLUMN: DOCUMENT DETAILS & CHECKS */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">Document Details</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Cancel Edit' : 'Edit'}</span>
              </button>
            </div>

            {isEditing ? (
              /* INLINE EDIT FORM */
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vendor</label>
                  <input
                    type="text"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Invoice Number</label>
                    <input
                      type="text"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                    <input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              /* READONLY DISPLAY FIELDS */
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Vendor</span>
                  <span className="font-bold text-slate-900">{doc.vendor}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Invoice Number</span>
                    <span className="font-semibold text-slate-800">{doc.invoiceNumber}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Date</span>
                    <span className="font-semibold text-slate-800">{doc.date}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Amount</span>
                    <span className="font-bold text-slate-900 text-base">
                      ₹{doc.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Category</span>
                    <span className="font-semibold text-slate-800">{doc.category}</span>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 7: CHECK RESULTS */}
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Checks
              </h3>

              <div className="space-y-2 text-xs font-medium">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Required information found</span>
                </div>

                <div
                  className={`flex items-center gap-2 ${
                    doc.checks.amountVerified ? 'text-emerald-700' : 'text-amber-800 font-bold'
                  }`}
                >
                  {doc.checks.amountVerified ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                  <span>
                    {doc.checks.amountVerified ? 'Amount verified' : 'Amount mismatch detected'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-emerald-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No duplicate found</span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs text-slate-400 font-semibold uppercase">Status</span>
                <StatusBadge status={doc.status} />
              </div>
            </div>

            {/* SECTION 8: ACCOUNTANT ACTIONS (APPROVE / EDIT / REJECT) */}
            {!isApprovedSuccess && doc.status !== 'Approved' && (
              <div className="border-t border-slate-100 pt-6 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={handleApprove}
                    className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={handleReject}
                    className="py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl border border-rose-200 transition-colors flex items-center justify-center gap-1.5"
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
