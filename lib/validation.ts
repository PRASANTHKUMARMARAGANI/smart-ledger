import { ExtractedFields } from './extractor';
import { LedgerDocument, DocumentStatus } from './types';
import { supabase, isSupabaseConfigured } from './supabase';

export interface ValidationResults {
  isMathValid: boolean;
  isItemsSumValid: boolean;
  isLineMathValid: boolean;
  hasRequiredFields: boolean;
  isDueDateValid: boolean;
  isDuplicate: boolean;
  confidenceScore: number; // 0 to 100
  status: DocumentStatus;
  issues: string[];
}

/**
 * Deterministic Mathematical & Logical Validator (Pure TypeScript/JavaScript Engine)
 */
export async function validateExtractedFields(
  ext: ExtractedFields,
  existingDocs: LedgerDocument[] = [],
  tolerance: number = 2.0
): Promise<ValidationResults> {
  const issues: string[] = [];

  // 1. Mandatory Fields Check
  const hasVendor = Boolean(ext.vendorName && ext.vendorName.trim().length >= 2);
  const hasInvoiceNumber = Boolean(ext.invoiceNumber && ext.invoiceNumber.trim().length >= 2);
  const hasInvoiceDate = Boolean(ext.invoiceDate && ext.invoiceDate.trim().length >= 4);

  const hasRequiredFields = hasVendor && hasInvoiceNumber && hasInvoiceDate;

  if (!hasRequiredFields) {
    const missing: string[] = [];
    if (!hasVendor) missing.push('Vendor Name');
    if (!hasInvoiceNumber) missing.push('Invoice Number');
    if (!hasInvoiceDate) missing.push('Invoice Date');
    issues.push(`Missing mandatory accounting fields: ${missing.join(', ')}.`);
  }

  // 2. Mathematical Validation Rules
  const calculatedTotal = ext.subtotal + ext.taxAmount;
  const isMathValid = ext.totalAmount > 0 && ext.subtotal > 0
    ? Math.abs(calculatedTotal - ext.totalAmount) <= tolerance
    : false;

  if (!isMathValid && ext.totalAmount > 0) {
    issues.push(
      `Arithmetic Discrepancy: Extracted Total is ${ext.currency} ${ext.totalAmount.toLocaleString()}, but calculated (Subtotal ${ext.subtotal.toLocaleString()} + Tax ${ext.taxAmount.toLocaleString()}) equals ${calculatedTotal.toLocaleString()}.`
    );
  }

  // Check Line Item Amounts Sum vs Subtotal
  const itemsSum = ext.items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const isItemsSumValid = ext.items.length === 0 || ext.subtotal === 0
    ? true
    : Math.abs(itemsSum - ext.subtotal) <= tolerance;

  if (!isItemsSumValid) {
    issues.push(
      `Line Items Discrepancy: Sum of line items (${ext.currency} ${itemsSum.toLocaleString()}) does not match Subtotal (${ext.currency} ${ext.subtotal.toLocaleString()}).`
    );
  }

  // Check Qty × UnitPrice ≈ Amount for each line
  let isLineMathValid = true;
  for (let i = 0; i < ext.items.length; i++) {
    const item = ext.items[i];
    if (item.quantity > 0 && item.unitPrice > 0 && item.amount > 0) {
      const calcLine = item.quantity * item.unitPrice;
      if (Math.abs(calcLine - item.amount) > tolerance) {
        isLineMathValid = false;
        issues.push(`Line item #${i + 1} ("${item.description}") calculation mismatch: Qty ${item.quantity} × Rate ${item.unitPrice} = ${calcLine}, but extracted amount is ${item.amount}.`);
      }
    }
  }

  // 3. Due Date Logical Validation
  let isDueDateValid = true;
  if (ext.invoiceDate && ext.dueDate) {
    const invTime = new Date(ext.invoiceDate).getTime();
    const dueTime = new Date(ext.dueDate).getTime();
    if (!isNaN(invTime) && !isNaN(dueTime) && dueTime < invTime) {
      isDueDateValid = false;
      issues.push(`Logical Error: Due Date (${ext.dueDate}) cannot be earlier than Invoice Date (${ext.invoiceDate}).`);
    }
  }

  // 4. Duplicate Document Detection
  let isDuplicate = false;

  // Search local in-memory store
  if (ext.invoiceNumber && ext.invoiceNumber.length >= 2) {
    const normInv = ext.invoiceNumber.trim().toLowerCase();
    isDuplicate = existingDocs.some(
      (d) => (d.invoiceNumber || '').trim().toLowerCase() === normInv
    );
  }

  // Search Supabase PostgreSQL if configured
  if (!isDuplicate && ext.invoiceNumber && isSupabaseConfigured()) {
    try {
      const { data } = await supabase
        .from('documents')
        .select('id')
        .eq('invoice_number', ext.invoiceNumber);

      if (data && data.length > 0) {
        isDuplicate = true;
      }
    } catch (e) {
      console.warn('Supabase duplicate check notice:', e);
    }
  }

  if (isDuplicate) {
    issues.push(`Duplicate Invoice Warning: Invoice number #${ext.invoiceNumber} already exists in transaction database.`);
  }

  // 5. Evidence-based Confidence Scoring Engine (0 to 100)
  let confidence = 0;
  if (hasVendor) confidence += 20;
  if (hasInvoiceNumber) confidence += 20;
  if (hasInvoiceDate) confidence += 15;
  if (ext.subtotal > 0 && ext.totalAmount > 0) confidence += 20;
  if (ext.items.length > 0) confidence += 15;
  if (isMathValid) confidence += 10;

  if (isDuplicate) confidence = Math.min(confidence, 50);

  // 6. Status Determination (Per User Specification)
  let status: DocumentStatus = 'VERIFIED';

  if (isDuplicate) {
    status = 'DUPLICATE';
  } else if (!hasRequiredFields || !isMathValid || !isItemsSumValid || !isLineMathValid || !isDueDateValid || confidence < 75) {
    status = 'Needs Review';
  }

  return {
    isMathValid,
    isItemsSumValid,
    isLineMathValid,
    hasRequiredFields,
    isDueDateValid,
    isDuplicate,
    confidenceScore: Math.round(confidence),
    status,
    issues,
  };
}
