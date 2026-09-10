'use client';

import React from 'react';
import { LedgerDocument } from '@/lib/types';
import { FileText, ZoomIn } from 'lucide-react';

export const DocumentPreview: React.FC<{ doc: LedgerDocument }> = ({ doc }) => {
  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-800 space-y-6 flex flex-col justify-between min-h-[500px]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono text-slate-300">
            PREVIEW: {doc.fileName || `${doc.invoiceNumber}.pdf`}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
          <ZoomIn className="w-3.5 h-3.5" />
          <span>100% Original</span>
        </div>
      </div>

      {/* Visual Rendered Document Sheet */}
      <div className="bg-white text-slate-900 rounded-xl p-6 sm:p-8 shadow-2xl space-y-6 text-xs font-sans border border-slate-200">
        {/* Document Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{doc.vendor}</h2>
            <p className="text-slate-500 text-[11px] mt-1">Tax Invoice & Billing Summary</p>
            <p className="text-slate-400 text-[10px] mt-0.5">GSTIN: 27AAAAA0000A1Z5</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">INVOICE</span>
            <span className="text-sm font-bold text-slate-900 block">{doc.invoiceNumber}</span>
            <span className="text-[11px] text-slate-500 block mt-1">Date: {doc.date}</span>
          </div>
        </div>

        {/* Bill To */}
        <div className="text-[11px]">
          <span className="font-semibold text-slate-400 block uppercase">Billed To:</span>
          <span className="font-bold text-slate-800 block">Apex Accounting Practice</span>
          <span className="text-slate-500 block">Financial Ops Division</span>
        </div>

        {/* Line Items Table */}
        <div className="space-y-2">
          <div className="grid grid-cols-12 text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-200">
            <div className="col-span-6">Item Description</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {doc.items && doc.items.length > 0 ? (
            doc.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 text-[11px] py-1 text-slate-700">
                <div className="col-span-6 font-medium">{item.description}</div>
                <div className="col-span-2 text-center text-slate-500">{item.quantity}</div>
                <div className="col-span-2 text-right text-slate-500">₹{item.unitPrice.toLocaleString('en-IN')}</div>
                <div className="col-span-2 text-right font-semibold">₹{item.amount.toLocaleString('en-IN')}</div>
              </div>
            ))
          ) : (
            <div className="grid grid-cols-12 text-[11px] py-1 text-slate-700">
              <div className="col-span-6 font-medium">Accounting Document Item</div>
              <div className="col-span-2 text-center text-slate-500">1</div>
              <div className="col-span-2 text-right text-slate-500">₹{doc.subtotal.toLocaleString('en-IN')}</div>
              <div className="col-span-2 text-right font-semibold">₹{doc.subtotal.toLocaleString('en-IN')}</div>
            </div>
          )}
        </div>

        {/* Totals Section */}
        <div className="border-t border-slate-200 pt-4 flex flex-col items-end space-y-1 text-[11px]">
          <div className="flex justify-between w-48 text-slate-600">
            <span>Subtotal:</span>
            <span>₹{doc.subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between w-48 text-slate-600">
            <span>GST (18%):</span>
            <span>₹{doc.taxGst.toLocaleString('en-IN')}</span>
          </div>

          {/* Highlight total */}
          <div
            className={`flex justify-between w-48 text-sm font-bold pt-2 border-t border-slate-300 p-1.5 rounded-lg ${
              doc.status === 'Needs Review'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-emerald-50 text-emerald-900 border border-emerald-300'
            }`}
          >
            <span>Invoice Total:</span>
            <span>₹{doc.totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 text-center">
        <span>Verified by SmartLedger OCR & Extraction Engine</span>
      </div>
    </div>
  );
};
