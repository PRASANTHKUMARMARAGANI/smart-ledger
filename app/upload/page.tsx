'use client';

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useDocuments } from '@/lib/store';
import { LedgerDocument } from '@/lib/types';
import { UploadCloud, Loader2, ArrowLeft, AlertCircle, RefreshCw, FileCode, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

function UploadContent() {
  const router = useRouter();
  const { addDocument, documents } = useDocuments();

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);
    setErrorMsg(null);
    setCurrentStep('Uploading document file to extraction stream...');

    const reader = new FileReader();
    reader.onerror = () => {
      setIsProcessing(false);
      setErrorMsg('Failed to read file from disk. Please select a valid document file.');
    };

    reader.onload = async () => {
      const resultStr = reader.result as string;
      const base64Content = resultStr.includes(',') ? resultStr.split(',')[1] : resultStr;

      try {
        setCurrentStep('Parsing layout & running Local Tesseract OCR / PDF Stream...');

        const response = await fetch('/api/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileData: {
              base64: base64Content,
              mimeType: selectedFile.type || 'image/png',
              fileName: selectedFile.name,
            },
            existingDocs: documents,
          }),
        });

        const resData = await response.json();

        if (!response.ok || !resData.success || !resData.data) {
          setIsProcessing(false);
          setErrorMsg(resData.error || 'Invoice extraction failed. Please verify document resolution.');
          return;
        }

        setCurrentStep('Executing audit checks & saving to Supabase PostgreSQL...');
        const extractedDoc: LedgerDocument = resData.data;

        // Save real extracted document to store & Supabase Cloud PostgreSQL
        addDocument(extractedDoc);

        // Redirect to detail review screen
        router.push(`/documents/${extractedDoc.id}`);
      } catch (err) {
        setIsProcessing(false);
        setErrorMsg((err as Error).message || 'Extraction failed. Unable to connect to backend processing pipeline.');
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleReset = () => {
    setFile(null);
    setIsProcessing(false);
    setErrorMsg(null);
    setCurrentStep('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <button
        onClick={() => router.push('/dashboard')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Dashboard</span>
      </button>

      {/* ERROR STATE CARD */}
      {errorMsg ? (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-3xl p-8 space-y-4 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
            <AlertCircle className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white font-display">Extraction Warning</h2>
            <p className="text-xs font-semibold text-rose-300 mt-1 max-w-md mx-auto leading-relaxed">
              {errorMsg}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-500/20 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Extraction Again</span>
            </button>
          </div>
        </div>
      ) : !isProcessing ? (
        /* UPLOAD CONTAINER */
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                OCR & Layout Parser
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 font-display">
              Process Financial Document
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Upload any invoice, receipt, or bill. Tesseract OCR & PDF Parser will automatically extract fields & line items into SmartLedger.
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
            className="glass-panel border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-3xl p-10 sm:p-14 text-center transition-all cursor-pointer group shadow-2xl relative overflow-hidden"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4 transition-all group-hover:scale-110">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h2 className="text-lg font-bold text-white mb-1 font-display">
              Drag & Drop your document here
            </h2>
            <p className="text-xs text-slate-400 mb-6 font-medium">or select a document from your computer</p>

            <label className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-extrabold rounded-xl cursor-pointer shadow-lg shadow-indigo-500/25 transition-all">
              <span>Choose Invoice / File</span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </label>

            <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-center gap-4 text-[11px] text-slate-400 font-mono">
              <span>Supported: PDF, PNG, JPG, JPEG, WEBP</span>
              <span>•</span>
              <span>Max size: 25MB</span>
            </div>
          </div>
        </div>
      ) : (
        /* PROCESSING STATE WITH RADAR SCAN */
        <div className="glass-panel rounded-3xl border border-slate-800 shadow-2xl p-8 sm:p-12 space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto animate-pulse">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white font-display">
              Extracting Document Information
            </h2>
            <p className="text-xs text-indigo-400 font-mono font-bold mt-2 animate-fade">
              {currentStep}
            </p>
          </div>

          <div className="space-y-2 max-w-sm mx-auto pt-2 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Document File Stream Loaded</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>OCR & Line Items Extraction Active</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Ledger Verification Check Pending</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
        <span>Loading upload module...</span>
      </div>
    }>
      <UploadContent />
    </Suspense>
  );
}

