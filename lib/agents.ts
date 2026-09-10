import { LedgerDocument } from './types';
import { performLocalDocumentOcr } from './ocr';
import { extractFieldsFromText, ExtractedFields } from './extractor';
import { validateExtractedFields } from './validation';
import { classifyInvoice } from './classifier';

export interface AgentStepTrace {
  agentName: string;
  role: string;
  action: string;
  status: 'PENDING' | 'RUNNING' | 'PASSED' | 'FLAGGED';
  timestamp: string;
  details: string;
  confidenceScore: number;
}

export interface MultiAgentExecutionResult {
  document: LedgerDocument;
  agentLogs: AgentStepTrace[];
  overallConfidence: number;
  autoApproveEligible: boolean;
  securityPassed: boolean;
}

/**
 * Executes 100% Local Invoice Extraction & Audit Pipeline (Zero Gemini AI dependency)
 */
export async function runMultiAgentPipeline(
  fileData?: { base64: string; mimeType: string; fileName: string; fileSize?: number },
  existingDocs: LedgerDocument[] = []
): Promise<MultiAgentExecutionResult> {
  const agentLogs: AgentStepTrace[] = [];
  const now = () => new Date().toLocaleTimeString();

  if (!fileData || !fileData.base64) {
    throw new Error('No document file payload received. Please select a valid document file.');
  }

  // Agent 1: Local OCR & Text Extraction Agent
  agentLogs.push({
    agentName: 'Extraction Agent',
    role: 'Local OCR & PDF Text Engine',
    action: 'Executing local Tesseract OCR / PDF text extraction',
    status: 'RUNNING',
    timestamp: now(),
    details: 'Performing local optical character recognition and layout parsing.',
    confidenceScore: 0.90,
  });

  const ocrRes = await performLocalDocumentOcr(fileData.base64, fileData.mimeType, fileData.fileName);

  if (!ocrRes.text || ocrRes.text.length < 5) {
    agentLogs[0].status = 'FLAGGED';
    agentLogs[0].details = 'Unable to read this document. OCR text stream returned empty output.';
    throw new Error('Unable to read this document. Please ensure a clear image or PDF is uploaded.');
  }

  // Extract structured fields from raw OCR text
  const fields = extractFieldsFromText(ocrRes.text);

  // SERVER-SIDE DETAILED EXTRACTION LOGGING (PART 2 REQUIREMENT)
  console.log('\n====================================================');
  console.log('[SERVER EXTRACTION LOG]');
  console.log('1. Filename:', fileData.fileName);
  console.log('2. MIME Type:', fileData.mimeType);
  console.log('3. File Size:', fileData.fileSize ? `${fileData.fileSize} bytes` : 'N/A');
  console.log('4. Extraction Method:', ocrRes.isPdf ? 'pdf-parse (Vector PDF)' : 'Tesseract.js (Local OCR)');
  console.log('5. Raw OCR Text Length:', ocrRes.text.length, 'characters');
  console.log('6. First 500 Chars of OCR Text:\n', ocrRes.text.substring(0, 500));
  console.log('--- EXTRACTED FIELDS ---');
  console.log('7. Vendor:', fields.vendorName);
  console.log('8. Invoice #:', fields.invoiceNumber);
  console.log('9. Date:', fields.invoiceDate);
  console.log('10. Subtotal:', fields.subtotal);
  console.log('11. Tax:', fields.taxAmount);
  console.log('12. Total:', fields.totalAmount);
  console.log('====================================================\n');

  agentLogs[0].status = 'PASSED';
  agentLogs[0].timestamp = now();
  agentLogs[0].details = `OCR text extracted (${ocrRes.text.length} chars). Identified vendor "${fields.vendorName || 'Unspecified'}" and invoice #${fields.invoiceNumber || 'Unspecified'}.`;

  // Agent 2: Audit & Validation Agent (Deterministic JavaScript Math Engine)
  agentLogs.push({
    agentName: 'Audit & Validation Agent',
    role: 'Arithmetic & Compliance Auditor',
    action: 'Executing deterministic JavaScript mathematical equations (Qty × Rate == Amount, Subtotal + Tax == Total)',
    status: 'RUNNING',
    timestamp: now(),
    details: 'Auditing line item calculations, subtotal equality, and GSTIN format.',
    confidenceScore: 0.95,
  });

  const validation = await validateExtractedFields(fields, existingDocs);

  if (validation.issues.length > 0) {
    agentLogs[1].status = 'FLAGGED';
    agentLogs[1].details = validation.issues.join(' ');
  } else {
    agentLogs[1].status = 'PASSED';
    agentLogs[1].details = `Deterministic math verified clean: Subtotal ${fields.currency} ${fields.subtotal.toLocaleString()} + Tax ${fields.taxAmount.toLocaleString()} = Total ${fields.totalAmount.toLocaleString()}.`;
  }

  // Agent 3: Reconciliation & Duplicate Agent
  agentLogs.push({
    agentName: 'Reconciliation Agent',
    role: 'Historical Ledger Cross-Referencer',
    action: 'Checking Supabase and local ledger for duplicate invoice number',
    status: 'RUNNING',
    timestamp: now(),
    details: 'Cross-referencing vendor name, invoice identifier, and total amount.',
    confidenceScore: 0.96,
  });

  if (validation.isDuplicate) {
    agentLogs[2].status = 'FLAGGED';
    agentLogs[2].details = `This invoice already exists. Invoice #${fields.invoiceNumber} from vendor "${fields.vendorName}" is already recorded.`;
  } else {
    agentLogs[2].status = 'PASSED';
    agentLogs[2].details = fields.invoiceNumber
      ? `No duplicate record found for invoice #${fields.invoiceNumber}.`
      : 'No invoice number extracted to cross-reference.';
  }

  // Agent 4: Workflow Manager & Classifier Agent
  agentLogs.push({
    agentName: 'Workflow Agent',
    role: 'CA Approval & Classification Manager',
    action: 'Classifying category via line items and routing approval status',
    status: 'RUNNING',
    timestamp: now(),
    details: 'Evaluating overall confidence score and verification criteria.',
    confidenceScore: validation.confidenceScore / 100,
  });

  const category = classifyInvoice(fields.vendorName, fields.items);

  agentLogs[3].status = validation.status === 'VERIFIED' ? 'PASSED' : 'FLAGGED';
  agentLogs[3].details = validation.status === 'VERIFIED'
    ? 'All deterministic checks passed cleanly. Document verified.'
    : `Routed to ${validation.status} Queue: ${validation.issues.join(' ')}`;

  const newDocument: LedgerDocument = {
    id: `doc_${Date.now()}`,
    vendor: fields.vendorName || 'Unspecified Vendor',
    vendorAddress: fields.vendorAddress || undefined,
    vendorGstin: fields.vendorGstin || undefined,
    vendorPhone: fields.vendorPhone || undefined,
    vendorEmail: fields.vendorEmail || undefined,
    invoiceNumber: fields.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
    date: fields.invoiceDate || new Date().toISOString().split('T')[0],
    dueDate: fields.dueDate || undefined,
    poNumber: fields.poNumber || undefined,
    paymentTerms: fields.paymentTerms || undefined,
    billToCustomer: fields.billToCustomer || undefined,
    billToAddress: fields.billToAddress || undefined,
    billToGstin: fields.billToGstin || undefined,
    subtotal: fields.subtotal,
    taxGst: fields.taxAmount,
    taxLabel: fields.taxLabel || undefined,
    totalAmount: fields.totalAmount,
    calculatedTotal: fields.subtotal + fields.taxAmount,
    amountInWords: fields.amountInWords || undefined,
    category: category,
    status: validation.status,
    checks: {
      requiredInfoFound: validation.hasRequiredFields,
      amountVerified: validation.isMathValid && validation.isItemsSumValid,
      noDuplicateFound: !validation.isDuplicate,
    },
    issueDescription: validation.issues.length > 0 ? validation.issues.join(' ') : null,
    items: fields.items.map((i) => ({
      description: i.description,
      hsnSac: i.hsnSac || undefined,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      amount: i.amount,
    })),
    notes: fields.notes || undefined,
    signatory: fields.signatory || undefined,
    uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    fileName: fileData.fileName,
    fileType: fileData.mimeType,
  };

  return {
    document: newDocument,
    agentLogs,
    overallConfidence: validation.confidenceScore / 100,
    autoApproveEligible: validation.status === 'Ready for Review',
    securityPassed: true,
  };
}
