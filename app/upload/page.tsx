'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDocuments } from '@/lib/store';
import { LedgerDocument } from '@/lib/types';
import { UploadCloud, Check, Loader2, ArrowLeft, FileText, AlertTriangle } from 'lucide-react';

function UploadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addDocument, documents } = useDocuments();

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const isDemo = searchParams.get('demo');
    const type = searchParams.get('type');
    if (isDemo || type) {
      startProcessingDemo(type === 'mismatch' ? 'XYZ Supplies' : 'ABC Traders');
    }
  }, [searchParams]);

  const steps = [
    'Reading document',
    'Extracting information',
    'Classifying transaction',
    'Checking for errors',
  ];

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    startProcessingNewUpload(selectedFile.name);
  };

  const startProcessingNewUpload = (fileName: string) => {
    setIsProcessing(true);
    setStepIndex(0);

    const newId = `doc-${Date.now().toString().slice(-4)}`;
    const isPdf = fileName.toLowerCase().endsWith('.pdf');
    const newDoc: LedgerDocument = {
      id: newId,
      vendor: fileName.toLowerCase().includes('supplies') ? 'Apex Paper Supplies' : 'Vanguard Tech Solutions',
      invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      subtotal: 12500,
      taxGst: 2250,
      totalAmount: 14750,
      calculatedTotal: 14750,
      category: 'Office Supplies',
      status: 'Ready for Review',
      checks: {
        requiredInfoFound: true,
        amountVerified: true,
        noDuplicateFound: true,
      },
      issueDescription: null,
      items: [
        { description: 'Corporate Supplies & Accessories', quantity: 1, unitPrice: 12500, amount: 12500 }
      ],
      uploadedAt: new Date().toISOString(),
      fileName: fileName,
      fileType: isPdf ? 'application/pdf' : 'image/png',
    };

    runStepAnimation(() => {
      addDocument(newDoc);
      router.push(`/documents/${newId}`);
    });
  };

  const startProcessingDemo = (vendorName: string) => {
    setIsProcessing(true);
    setStepIndex(0);

    const existing = documents.find((d) => d.vendor === vendorName) || documents[0];

    runStepAnimation(() => {
      router.push(`/documents/${existing.id}`);
    });
  };

  const runStepAnimation = (onComplete: () => void) => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current < 4) {
        setStepIndex(current);
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 400);
      }
    }, 550);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <button
        onClick={() => router.push('/dashboard')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Dashboard</span>
      </button>

      {!isProcessing ? (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Upload your document</h1>
            <p className="text-xs text-slate-500 mt-1">
              Upload an invoice or receipt to automatically extract and verify details.
            </p>
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileSelect(e.dataTransfer.files[0]);
              }
            }}
            className="bg-white border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-2xl p-10 text-center transition-all cursor-pointer group shadow-sm"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-100 group-hover:bg-slate-200 text-slate-600 flex items-center justify-center mx-auto mb-4 transition-colors">
              <UploadCloud className="w-7 h-7" />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Drop your invoice or receipt here
            </h3>
            <p className="text-xs text-slate-500 mb-6">or click below to choose a file</p>

            <label className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-md transition-all">
              <span>Choose File</span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </label>

            <p className="text-[11px] text-slate-400 mt-4">Supported formats: PDF, JPG, PNG</p>
          </div>

          <div className="bg-slate-100 rounded-2xl p-5 space-y-3 border border-slate-200/60">
            <p className="text-xs font-semibold text-slate-700">Quick Demo Invoices:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => startProcessingDemo('ABC Traders')}
                className="bg-white p-3 rounded-xl border border-slate-200 hover:border-slate-300 text-left transition-all shadow-sm flex items-center gap-3 group"
              >
                <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">ABC Traders (Valid)</p>
                  <p className="text-[11px] text-slate-500">₹11,800 · Ready for review</p>
                </div>
              </button>

              <button
                onClick={() => startProcessingDemo('XYZ Supplies')}
                className="bg-white p-3 rounded-xl border border-slate-200 hover:border-slate-300 text-left transition-all shadow-sm flex items-center gap-3 group"
              >
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">XYZ Supplies (Issue)</p>
                  <p className="text-[11px] text-slate-500">₹13,000 · Amount mismatch</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 sm:p-10 space-y-8 my-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto animate-pulse">
            <Loader2 className="w-7 h-7 animate-spin" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              SmartLedger is processing your document
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Extracting information, running validation checks, and classifying items...
            </p>
          </div>

          <div className="max-w-md mx-auto bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-3 text-left">
            {steps.map((label, idx) => {
              const isDone = idx < stepIndex;
              const isCurrent = idx === stepIndex;

              return (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-indigo-600 text-white animate-bounce'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      isDone
                        ? 'text-slate-900'
                        : isCurrent
                        ? 'text-indigo-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {isDone ? `✓ ${label}` : label}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400">
            Please wait a moment while SmartLedger prepares the review details.
          </p>
        </div>
      )}
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
        <span>Loading upload module...</span>
      </div>
    }>
      <UploadContent />
    </Suspense>
  );
}
