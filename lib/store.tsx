'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LedgerDocument, SystemStats } from './types';
import { INITIAL_DOCUMENTS } from './demoData';
import { supabase, isSupabaseConfigured } from './supabase';

interface DocumentContextType {
  documents: LedgerDocument[];
  stats: SystemStats;
  isCloudSynced: boolean;
  getDocumentById: (id: string) => LedgerDocument | undefined;
  addDocument: (doc: LedgerDocument) => void;
  updateDocument: (id: string, updates: Partial<LedgerDocument>) => void;
  approveDocument: (id: string) => void;
  rejectDocument: (id: string) => void;
  resetDemoData: () => void;
  exportCSV: () => void;
}

const STORAGE_KEY = 'ledger_agent_documents_v1';

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<LedgerDocument[]>([]);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  // Load initial documents from Supabase PostgreSQL if configured, or localStorage
  useEffect(() => {
    async function loadDocuments() {
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
          if (!error && data && data.length > 0) {
            setDocuments(data);
            setIsCloudSynced(true);
            return;
          }
        } catch (e) {
          console.warn('Supabase fetch failed, falling back to local store', e);
        }
      }

      // Fallback to local storage or demo initial data
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setDocuments(JSON.parse(saved));
        } else {
          setDocuments(INITIAL_DOCUMENTS);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DOCUMENTS));
        }
      } catch {
        setDocuments(INITIAL_DOCUMENTS);
      }
    }

    loadDocuments();
  }, []);

  // Save changes to localStorage and Supabase if configured
  const saveDocuments = async (updatedDocs: LedgerDocument[]) => {
    setDocuments(updatedDocs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDocs));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('documents').upsert(updatedDocs);
        setIsCloudSynced(true);
      } catch (e) {
        console.error('Failed to upsert to Supabase', e);
      }
    }
  };

  const getDocumentById = (id: string) => {
    return documents.find((doc) => doc.id === id);
  };

  const addDocument = (newDoc: LedgerDocument) => {
    const updated = [newDoc, ...documents];
    saveDocuments(updated);
  };

  const updateDocument = (id: string, updates: Partial<LedgerDocument>) => {
    const updated = documents.map((doc) => {
      if (doc.id === id) {
        return { ...doc, ...updates };
      }
      return doc;
    });
    saveDocuments(updated);
  };

  const approveDocument = (id: string) => {
    updateDocument(id, {
      status: 'Approved',
      issueDescription: null,
      checks: {
        requiredInfoFound: true,
        amountVerified: true,
        noDuplicateFound: true,
      },
    });
  };

  const rejectDocument = (id: string) => {
    updateDocument(id, {
      status: 'Rejected',
    });
  };

  const resetDemoData = () => {
    saveDocuments(INITIAL_DOCUMENTS);
  };

  const exportCSV = () => {
    const approvedDocs = documents.filter((d) => d.status === 'Approved');
    const headers = ['Date', 'Vendor', 'Invoice Number', 'Category', 'Subtotal (₹)', 'Tax GST (₹)', 'Amount (₹)', 'Status'];
    const rows = approvedDocs.map((d) => [
      `"${d.date}"`,
      `"${d.vendor}"`,
      `"${d.invoiceNumber}"`,
      `"${d.category}"`,
      d.subtotal,
      d.taxGst,
      d.totalAmount,
      `"${d.status}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SmartLedger_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats: SystemStats = {
    documents: documents.length,
    needsReview: documents.filter((d) => d.status === 'Needs Review').length,
    processed: documents.filter((d) => d.status === 'Approved').length,
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        stats,
        isCloudSynced,
        getDocumentById,
        addDocument,
        updateDocument,
        approveDocument,
        rejectDocument,
        resetDemoData,
        exportCSV,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};
