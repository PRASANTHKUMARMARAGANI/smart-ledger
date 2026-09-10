export type DocumentStatus = 'VERIFIED' | 'Needs Review' | 'DUPLICATE' | 'Extraction Failed' | 'Approved' | 'Rejected' | 'Ready for Review' | 'Verified' | 'Duplicate';

export interface DocumentCheck {
  requiredInfoFound: boolean;
  amountVerified: boolean;
  noDuplicateFound: boolean;
}

export interface InvoiceItem {
  description: string;
  hsnSac?: string | null;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface LedgerDocument {
  id: string;
  vendor: string;
  vendorAddress?: string;
  vendorGstin?: string;
  vendorPhone?: string;
  vendorEmail?: string;
  invoiceNumber: string;
  date: string;
  dueDate?: string;
  poNumber?: string;
  paymentTerms?: string;
  billToCustomer?: string;
  billToAddress?: string;
  billToGstin?: string;
  subtotal: number;
  taxGst: number;
  taxLabel?: string;
  totalAmount: number;
  calculatedTotal: number;
  amountInWords?: string;
  category: string;
  status: DocumentStatus;
  checks: DocumentCheck;
  issueDescription?: string | null;
  items?: InvoiceItem[];
  notes?: string;
  signatory?: string;
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
