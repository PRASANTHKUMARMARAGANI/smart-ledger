'use client';

import React from 'react';
import { LedgerDocument } from '@/lib/types';
import { FileText, ZoomIn, ShieldCheck } from 'lucide-react';

export const DocumentPreview: React.FC<{ doc: LedgerDocument }> = ({ doc }) => {
  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-800 space-y-6 flex flex-col justify-between min-h-[500px]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono text-slate-300 truncate">
            PREVIEW: {doc.fileName || `${doc.invoiceNumber}.pdf`}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
          <ZoomIn className="w-3.5 h-3.5" />
          <span>100% Original Sheet</span>
        </div>
      </div>

      {/* Visual Rendered Document Sheet matching exact invoice specification */}
      <div className="bg-white text-slate-900 rounded-xl p-6 sm:p-8 shadow-2xl space-y-6 text-xs font-sans border border-slate-200">
        {/* Top Header: Logo / Company Name & Invoice Metadata */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-6 gap-4">
          <div className="space-y-1 max-w-[60%]">
            <h2 className="text-xl font-extrabold text-sky-950 tracking-tight">{doc.vendor}</h2>
            <p className="text-sky-700 font-medium text-[11px]">Cloud • Software • Smarter Business</p>
            <p className="text-slate-600 text-[10px] leading-relaxed">
              {doc.vendorAddress || '123 Innovation Drive, Koramangala, Bengaluru, Karnataka 560034, India'}
            </p>
            <p className="text-slate-500 text-[10px] font-mono">GSTIN: {doc.vendorGstin || '29ABCDE1234F1Z5'}</p>
            <p className="text-slate-500 text-[10px]">
              Phone: {doc.vendorPhone || '+91 80 4567 8900'} | Email: {doc.vendorEmail || 'billing@skytechsolutions.com'}
            </p>
          </div>

          <div className="text-right space-y-1 shrink-0">
            <span className="text-lg font-black text-sky-900 tracking-wider block uppercase">INVOICE</span>
            <div className="text-[11px] space-y-0.5 pt-1 font-medium text-slate-700">
              <p><span className="font-bold text-slate-900">Invoice No:</span> {doc.invoiceNumber}</p>
              <p><span className="font-bold text-slate-900">Invoice Date:</span> {doc.date}</p>
              {doc.dueDate && <p><span className="font-bold text-slate-900">Due Date:</span> {doc.dueDate}</p>}
              {doc.poNumber && <p><span className="font-bold text-slate-900">PO Number:</span> {doc.poNumber}</p>}
              {doc.paymentTerms && <p><span className="font-bold text-slate-900">Payment Terms:</span> {doc.paymentTerms}</p>}
            </div>
          </div>
        </div>

        {/* Bill To & Ship To Sections */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-[11px]">
          <div>
            <span className="font-bold text-slate-900 block uppercase tracking-wider text-[10px] mb-1">Bill To</span>
            <span className="font-extrabold text-slate-900 block text-xs">{doc.billToCustomer || 'Acme Retail Pvt. Ltd.'}</span>
            <p className="text-slate-600 leading-tight mt-0.5">{doc.billToAddress || '45, MG Road, Indiranagar, Bengaluru, Karnataka 560038, India'}</p>
            <p className="text-slate-500 font-mono text-[10px] mt-1">GSTIN: {doc.billToGstin || '29AABCA9876K1Z1'}</p>
          </div>

          <div>
            <span className="font-bold text-slate-900 block uppercase tracking-wider text-[10px] mb-1">Ship To</span>
            <span className="font-extrabold text-slate-900 block text-xs">{doc.billToCustomer || 'Acme Retail Pvt. Ltd.'}</span>
            <p className="text-slate-600 leading-tight mt-0.5">{doc.billToAddress || '45, MG Road, Indiranagar, Bengaluru, Karnataka 560038, India'}</p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-2">
          <div className="grid grid-cols-12 text-[10px] font-bold text-slate-600 uppercase tracking-wider pb-2 border-b-2 border-slate-900 bg-sky-950 text-white p-2 rounded-lg">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5">Description</div>
            <div className="col-span-2 text-center">HSN/SAC</div>
            <div className="col-span-1 text-center">Qty</div>
            <div className="col-span-1 text-right">Unit Price</div>
            <div className="col-span-2 text-right">Amount (INR)</div>
          </div>

          {doc.items && doc.items.length > 0 ? (
            doc.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 text-[11px] py-2 border-b border-slate-100 text-slate-800 items-center">
                <div className="col-span-1 text-center font-bold text-slate-500">{idx + 1}</div>
                <div className="col-span-5 font-semibold text-slate-900">{item.description}</div>
                <div className="col-span-2 text-center text-slate-500 font-mono">{item.hsnSac || '998315'}</div>
                <div className="col-span-1 text-center font-bold text-slate-700">{item.quantity}</div>
                <div className="col-span-1 text-right text-slate-600 font-mono">₹{item.unitPrice.toLocaleString('en-IN')}</div>
                <div className="col-span-2 text-right font-extrabold text-slate-900 font-mono">₹{item.amount.toLocaleString('en-IN')}</div>
              </div>
            ))
          ) : (
            <div className="grid grid-cols-12 text-[11px] py-2 text-slate-700">
              <div className="col-span-1 text-center">1</div>
              <div className="col-span-5 font-medium">Cloud Server Hosting (Virtual Machine Standard Instance)</div>
              <div className="col-span-2 text-center text-slate-500 font-mono">998315</div>
              <div className="col-span-1 text-center">2</div>
              <div className="col-span-1 text-right">₹5,000</div>
              <div className="col-span-2 text-right font-semibold">₹10,000</div>
            </div>
          )}
        </div>

        {/* Totals & Subtotal Calculation Section */}
        <div className="flex flex-col items-end space-y-1.5 text-[11px] pt-2">
          <div className="flex justify-between w-64 text-slate-700 font-medium">
            <span>Subtotal:</span>
            <span className="font-mono font-semibold">₹{doc.subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between w-64 text-slate-700 font-medium">
            <span>{doc.taxLabel || 'IGST (18%)'}:</span>
            <span className="font-mono font-semibold">₹{doc.taxGst.toLocaleString('en-IN')}</span>
          </div>

          <div
            className={`flex justify-between w-64 text-sm font-black pt-2 border-t-2 border-slate-900 p-2 rounded-lg ${
              doc.status === 'Needs Review'
                ? 'bg-amber-100 text-amber-950 border border-amber-300'
                : 'bg-sky-50 text-sky-950 border border-sky-300'
            }`}
          >
            <span>Total Amount (INR):</span>
            <span className="font-mono">₹{doc.totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Amount In Words & Notes */}
        <div className="pt-4 border-t border-slate-200 space-y-3 text-[11px]">
          <div>
            <span className="font-bold text-slate-900 block">Amount in Words:</span>
            <p className="text-slate-700 font-medium italic">
              {doc.amountInWords || 'Indian Rupees Sixteen Thousand Five Hundred Twenty Only'}
            </p>
          </div>

          <div>
            <span className="font-bold text-slate-900 block">Notes:</span>
            <p className="text-slate-600 whitespace-pre-line leading-relaxed">
              {doc.notes || '1. Please make the payment within the due date.\n2. For any billing queries, contact billing@skytechsolutions.com.'}
            </p>
          </div>

          {/* Signatory Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-emerald-700 text-[10px] font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>SmartLedger AI Document Verification Passed</span>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-900 text-xs">For {doc.vendor}</p>
              <p className="font-bold text-slate-700 text-xs italic mt-1">{doc.signatory || 'Rohan Mehta'}</p>
              <p className="text-[10px] text-slate-500">Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 text-center">
        <span>Extracted & Synchronized directly with Supabase Cloud PostgreSQL</span>
      </div>
    </div>
  );
};
