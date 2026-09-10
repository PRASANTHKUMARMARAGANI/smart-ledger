export type DocumentStatus = 'Ready for Review' | 'Needs Review' | 'Approved' | 'Rejected';

export interface DocumentCheck {
  requiredInfoFound: boolean;
  amountVerified: boolean;
  noDuplicateFound: boolean;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface LedgerDocument {
  id: string;
  vendor: string;
  invoiceNumber: string;
  date: string;
  subtotal: number;
  taxGst: number;
  totalAmount: number;
  calculatedTotal: number;
  category: string;
  status: DocumentStatus;
  checks: DocumentCheck;
  issueDescription?: string | null;
  items?: InvoiceItem[];
  uploadedAt: string;
  fileType?: string;
  fileName?: string;
  fileUrl?: string;
}

export interface SystemStats {
  documents: number;
  needsReview: number;
  processed: number;
}
