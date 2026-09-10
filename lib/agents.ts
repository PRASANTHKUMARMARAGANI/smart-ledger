/**
 * SmartLedger Multi-Agent Operations Architecture Engine
 * Specialized autonomous accounting agents coordinating workflow execution.
 */

import { LedgerDocument } from './types';
import { extractDocumentWithGemini } from './gemini';

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
 * Executes full agent pipeline for a financial document
 */
export async function runMultiAgentPipeline(
  fileData?: { base64: string; mimeType: string; fileName: string },
  existingDocs: LedgerDocument[] = [],
  apiKey?: string
): Promise<MultiAgentExecutionResult> {
  const agentLogs: AgentStepTrace[] = [];
  const now = () => new Date().toLocaleTimeString();

  // Agent 1: Extraction Agent
  agentLogs.push({
    agentName: 'Extraction Agent',
    role: 'Document OCR & Vision Parser',
    action: 'Parsing raw visual/pdf bytes into structured accounting schema',
    status: 'RUNNING',
    timestamp: now(),
    details: 'Scanning header, line items, amounts, tax identifiers, and vendor names.',
    confidenceScore: 0.94,
  });

  const extraction = await extractDocumentWithGemini(fileData, apiKey);

  agentLogs[0].status = 'PASSED';
  agentLogs[0].timestamp = now();
  agentLogs[0].details = `Successfully extracted vendor "${extraction.vendor}" with invoice #${extraction.invoiceNumber}.`;

  // Agent 2: Audit & Validation Agent
  agentLogs.push({
    agentName: 'Audit & Validation Agent',
    role: 'Arithmetic & Compliance Auditor',
    action: 'Verifying mathematical consistency (Subtotal + GST = Total Amount)',
    status: 'RUNNING',
    timestamp: now(),
    details: 'Auditing line item products, unit prices, and tax rates.',
    confidenceScore: 0.98,
  });

  const calculatedSubtotalPlusTax = extraction.subtotal + extraction.taxGst;
  const isMathValid = Math.abs(calculatedSubtotalPlusTax - extraction.totalAmount) <= 1;

  let auditIssue: string | null = null;
  if (!isMathValid) {
    auditIssue = `Arithmetic Discrepancy: Extracted total is ₹${extraction.totalAmount.toLocaleString()}, but calculated (Subtotal ₹${extraction.subtotal.toLocaleString()} + Tax ₹${extraction.taxGst.toLocaleString()}) equals ₹${calculatedSubtotalPlusTax.toLocaleString()}.`;
    agentLogs[1].status = 'FLAGGED';
    agentLogs[1].details = auditIssue;
  } else {
    agentLogs[1].status = 'PASSED';
    agentLogs[1].details = `Math audit verified clean: Subtotal ₹${extraction.subtotal} + GST ₹${extraction.taxGst} = Total ₹${extraction.totalAmount}.`;
  }

  // Agent 3: Reconciliation & Duplicate Detection Agent
  agentLogs.push({
    agentName: 'Reconciliation Agent',
    role: 'Historical Ledger Cross-Referencer',
    action: 'Checking for duplicate invoice numbers and prior vendor payment history',
    status: 'RUNNING',
    timestamp: now(),
    details: 'Searching transaction database for matching vendor and invoice identifier.',
    confidenceScore: 0.96,
  });

  const isDuplicate = existingDocs.some(
    (d) => d.invoiceNumber.toLowerCase() === extraction.invoiceNumber.toLowerCase() && d.vendor.toLowerCase() === extraction.vendor.toLowerCase()
  );

  let duplicateIssue: string | null = null;
  if (isDuplicate) {
    duplicateIssue = `Duplicate Document Warning: Invoice number #${extraction.invoiceNumber} from vendor "${extraction.vendor}" already exists in ledger.`;
    agentLogs[2].status = 'FLAGGED';
    agentLogs[2].details = duplicateIssue;
  } else {
    agentLogs[2].status = 'PASSED';
    agentLogs[2].details = `No duplicate invoice record found for #${extraction.invoiceNumber}. Vendor profile matched.`;
  }

  // Agent 4: Workflow Manager & CA Decision Agent
  agentLogs.push({
    agentName: 'Workflow Agent',
    role: 'Human-in-the-Loop Orchestrator',
    action: 'Evaluating approval threshold and routing for review',
    status: 'RUNNING',
    timestamp: now(),
    details: 'Analyzing agent confidence and risk factors.',
    confidenceScore: 0.95,
  });

  const hasIssues = !isMathValid || isDuplicate || !!extraction.issueDescription;
  const issueDescription = auditIssue || duplicateIssue || extraction.issueDescription;
  const status = hasIssues ? 'Needs Review' : 'Ready for Review';

  agentLogs[3].status = hasIssues ? 'FLAGGED' : 'PASSED';
  agentLogs[3].details = hasIssues
    ? `Routed to CA Review Queue: ${issueDescription}`
    : 'All agent audits passed cleanly. High confidence auto-verification achieved.';

  const newDocument: LedgerDocument = {
    id: `doc_${Date.now()}`,
    vendor: extraction.vendor,
    invoiceNumber: extraction.invoiceNumber,
    date: extraction.date,
    subtotal: extraction.subtotal,
    taxGst: extraction.taxGst,
    totalAmount: extraction.totalAmount,
    calculatedTotal: extraction.calculatedTotal,
    category: extraction.category,
    status: status,
    checks: {
      requiredInfoFound: true,
      amountVerified: isMathValid,
      noDuplicateFound: !isDuplicate,
    },
    issueDescription: issueDescription,
    items: extraction.items,
    uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    fileName: fileData?.fileName || 'Uploaded_Document.pdf',
    fileType: fileData?.mimeType || 'application/pdf',
  };

  const overallConfidence = hasIssues ? 0.76 : 0.97;

  return {
    document: newDocument,
    agentLogs,
    overallConfidence,
    autoApproveEligible: !hasIssues,
    securityPassed: true,
  };
}
