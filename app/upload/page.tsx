'use client';

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useDocuments } from '@/lib/store';
import { LedgerDocument } from '@/lib/types';
import { UploadCloud, Check, Loader2, ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';

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
    setCurrentStep('Uploading document file...');

    const reader = new FileReader();
    reader.onerror = () => {
      setIsProcessing(false);
      setErrorMsg('Failed to read file from disk. Please select a valid document.');
    };

    reader.onload = async () => {
      const resultStr = reader.result as string;
      const base64Content = resultStr.includes(',') ? resultStr.split(',')[1] : resultStr;

      try {
        setCurrentStep('Analyzing visual text & layout via Local Tesseract OCR & PDF Parser...');

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
          setErrorMsg(resData.error || 'Invoice extraction failed. Please verify document clarity.');
          return;
        }

        setCurrentStep('Validating accounting math & saving transaction...');
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
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <button
        onClick={() => router.push('/dashboard')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Dashboard</span>
      </button>

      {/* ERROR STATE CARD */}
      {errorMsg ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 space-y-4 shadow-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6 text-rose-600" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-rose-950">Extraction Failed</h2>
            <p className="text-xs font-medium text-rose-800 mt-1 max-w-md mx-auto leading-relaxed">
              {errorMsg}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      ) : !isProcessing ? (
        /* UPLOAD CONTAINER */
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Upload your document</h1>
            <p className="text-xs text-slate-500 mt-1">
              Upload a real invoice or receipt to automatically extract accounting data via Local OCR & PDF Engine.
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
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </label>

            <p className="text-[11px] text-slate-400 mt-4">Supported formats: PDF, PNG, JPG, JPEG, WEBP</p>
          </div>
        </div>
      ) : (
        /* PROCESSING STATE */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 sm:p-10 space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto animate-pulse">
            <Loader2 className="w-7 h-7 animate-spin" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              SmartLedger is processing your document
            </h2>
            <p className="text-xs text-indigo-700 font-semibold mt-2 animate-fade">
              {currentStep}
            </p>
          </div>

          <p className="text-[11px] text-slate-400 pt-2">
            Please wait while local Tesseract OCR & PDF engine extracts text, line items, and accounting metadata.
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

