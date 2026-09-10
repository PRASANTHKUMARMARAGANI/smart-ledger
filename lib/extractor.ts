import { InvoiceItem } from './types';

export interface ExtractedFields {
  vendorName: string | null;
  vendorAddress: string | null;
  vendorGstin: string | null;
  vendorPhone: string | null;
  vendorEmail: string | null;
  invoiceNumber: string | null;
  invoiceDate: string | null;
  dueDate: string | null;
  poNumber: string | null;
  paymentTerms: string | null;
  billToCustomer: string | null;
  billToAddress: string | null;
  billToGstin: string | null;
  shipToCustomer: string | null;
  shipToAddress: string | null;
  shipToGstin: string | null;
  subtotal: number;
  taxLabel: string | null;
  taxAmount: number;
  totalAmount: number;
  amountInWords: string | null;
  currency: string;
  signatory: string | null;
  notes: string | null;
  items: InvoiceItem[];
}

/**
 * Normalizes date string into ISO format (YYYY-MM-DD)
 * Handles OCR typos in month names (e.g. "15 0ct 2025" => "2025-10-15")
 * Returns null if date cannot be parsed reliably. Never returns current system date fallback.
 */
export function normalizeDateToIso(dateStr: string): string | null {
  if (!dateStr) return null;
  let clean = dateStr.trim();

  // Fix common OCR typos in month names before matching
  clean = clean
    .replace(/\b0ct\b/gi, 'Oct')
    .replace(/\bN0v\b/gi, 'Nov')
    .replace(/\bD3c\b/gi, 'Dec')
    .replace(/\bJ4n\b/gi, 'Jan')
    .replace(/\bF3b\b/gi, 'Feb')
    .replace(/\bM4r\b/gi, 'Mar')
    .replace(/\b4pr\b/gi, 'Apr')
    .replace(/\bM4y\b/gi, 'May')
    .replace(/\bJ1n\b/gi, 'Jun')
    .replace(/\bJ1l\b/gi, 'Jul')
    .replace(/\b4ug\b/gi, 'Aug')
    .replace(/\bS3p\b/gi, 'Sep');

  // Match e.g. 15 Oct 2025 or 15-Oct-2025 or 15 0ct 2025
  const textMonthMatch = clean.match(/(\d{1,2})[\s/-]+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s/-]+(\d{4})/i);
  if (textMonthMatch) {
    const day = textMonthMatch[1].padStart(2, '0');
    const monthStr = textMonthMatch[2].toLowerCase();
    const year = textMonthMatch[3];
    const months: Record<string, string> = {
      jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
      jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
    };
    const month = months[monthStr.substring(0, 3)] || '01';
    return `${year}-${month}-${day}`;
  }

  // Match e.g. 2025-11-20
  const isoMatch = clean.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2].padStart(2, '0')}-${isoMatch[3].padStart(2, '0')}`;
  }

  // Match e.g. 20/11/2025 or 20-11-2025
  const dmyMatch = clean.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (dmyMatch) {
    return `${dmyMatch[3]}-${dmyMatch[2].padStart(2, '0')}-${dmyMatch[1].padStart(2, '0')}`;
  }

  return null;
}

/**
 * Extracts 15-character GSTIN identifier with uppercase normalization
 */
export function extractGstin(text: string): string | null {
  const gstinRegex = /\b\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/gi;
  const matches = text.match(gstinRegex);
  if (matches && matches.length > 0) {
    return matches[0].toUpperCase();
  }
  return null;
}

/**
 * Currency Detector
 */
export function detectCurrency(text: string): string {
  if (/₹|rs\.?|inr/i.test(text)) return 'INR';
  if (/\$|usd/i.test(text)) return 'USD';
  if (/€|eur/i.test(text)) return 'EUR';
  if (/£|gbp/i.test(text)) return 'GBP';
  return 'INR';
}

/**
 * Parses numeric monetary values from string representations
 */
function parseNumericAmount(str?: string): number {
  if (!str) return 0;
  const clean = str.replace(/[^0-9.]/g, '');
  const val = parseFloat(clean);
  return isNaN(val) ? 0 : val;
}

/**
 * Dynamic Multi-Field & Line Item Table Extractor
 */
export function extractFieldsFromText(text: string): ExtractedFields {
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  const fullText = text;

  // 1. GSTIN Extraction
  const allGstins = Array.from(fullText.matchAll(/\b\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/gi)).map((m) => m[0].toUpperCase());
  const vendorGstin = allGstins[0] || null;
  const billToGstin = allGstins[1] || null;

  // 2. Vendor Name Extraction (Top header vendor prioritization before Bill To)
  let vendorName: string | null = null;
  const headerLines = lines.slice(0, 8);

  // Pass A: Check header lines before "Bill To" for corporate suffixes or company names
  for (const line of headerLines) {
    const cleanLine = line.replace(/\b(?:TAX\s*)?INVOICE\b/gi, '').replace(/^[#:\-\s§]+/, '').trim();
    if (/tax|gstin|date|total|subtotal|bill to|ship to|phone|email|po number|customer|smarter business|data analytics/i.test(cleanLine)) continue;
    if (cleanLine.length >= 3 && cleanLine.length <= 60 && /[a-zA-Z]/.test(cleanLine)) {
      if (/\b(?:pvt\.?\s*ltd|ltd|inc|corp|llp|systems|solutions|services|traders|enterprises|technologies|supplies|electronics)\b/i.test(cleanLine)) {
        vendorName = cleanLine;
        break;
      }
    }
  }

  // Pass B: First clean header line if Pass A found nothing
  if (!vendorName) {
    for (const line of headerLines) {
      if (/invoice|tax|gstin|date|total|subtotal|bill to|ship to|phone|email|po number|customer|smarter business|data analytics/i.test(line)) continue;
      if (line.length >= 3 && line.length <= 50 && /[a-zA-Z]/.test(line)) {
        vendorName = line.replace(/^[#:\-\s§]+/, '').trim();
        break;
      }
    }
  }

  // 3. Invoice Number Extraction (with OCR section symbol and prefix noise handling)
  let invoiceNumber: string | null = null;
  const invMatch = fullText.match(/(?:Invoice\s*No\.?|Invoice\s*Number|Invoice\s*#|Inv\s*No\.?|Inv\.?\s*No\.?|Bill\s*No\.?|Bill\s*Number|Bill\s*#|Ref\s*No\.?|Reference\s*No\.?)\s*[:#.-]?\s*([^\n\r,]+)/i);

  if (invMatch && invMatch[1]) {
    let rawInv = invMatch[1].trim();

    // OCR Noise Corrections:
    // e.g. "§TS-2025-1042" => "STS-2025-1042"
    if (/^[§S5]TS/i.test(rawInv)) {
      rawInv = rawInv.replace(/^[§S5]TS/i, 'STS');
    }

    // Extract cleanest alphanumeric/dash token e.g. STS-2025-1042, CCS-2025-2134, ABC-INV-9001
    const codeMatch = rawInv.match(/\b([A-Z0-9/-]{3,30})\b/i);
    if (codeMatch) {
      invoiceNumber = codeMatch[1].toUpperCase();
    }
  }

  if (!invoiceNumber) {
    // Check for standalone invoice code pattern (excluding 6-digit postal pincodes)
    const standaloneMatch = fullText.match(/\b([A-Z]{2,4}-[A-Z0-9/-]{3,20}|INV-[A-Z0-9-]+|PO-\d{4,6})\b/i);
    if (standaloneMatch && !/^\d{6}$/.test(standaloneMatch[1])) {
      invoiceNumber = standaloneMatch[1].toUpperCase();
    }
  }

  // 4. Invoice Date Extraction (with OCR Month typos e.g. "15 0ct 2025" => "2025-10-15")
  let invoiceDate: string | null = null;
  const dateMatch = fullText.match(/(?:Invoice\s*Date|Issue\s*Date|Bill\s*Date|sole\s*Date|\bDate\b)\s*[:#.-]?\s*(\d{1,2}[\s/-]+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|0ct|Nov|N0v|Dec|D3c)[a-z0-9]*[\s/-]+\d{4}|\d{4}[/-]\d{1,2}[/-]\d{1,2}|\d{1,2}[/-]\d{1,2}[/-]\d{4})/i);

  if (dateMatch && dateMatch[1]) {
    invoiceDate = normalizeDateToIso(dateMatch[1]);
  } else {
    // Try matching any date format in full text
    const anyDateMatch = fullText.match(/\b(\d{1,2}[\s/-]+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|0ct|Nov|N0v|Dec|D3c)[a-z0-9]*[\s/-]+\d{4}|\d{4}[/-]\d{1,2}[/-]\d{1,2}|\d{1,2}[/-]\d{1,2}[/-]\d{4})\b/i);
    if (anyDateMatch) {
      invoiceDate = normalizeDateToIso(anyDateMatch[1]);
    }
  }

  // 5. Due Date Extraction
  let dueDate: string | null = null;
  const dueMatch = fullText.match(/(?:Due\s*Date|Payment\s*Due|Pay\s*By)\s*[:#.-]?\s*(\d{1,2}[\s/-]+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|0ct|Nov|N0v|Dec|D3c)[a-z0-9]*[\s/-]+\d{4}|\d{4}[/-]\d{1,2}[/-]\d{1,2}|\d{1,2}[/-]\d{1,2}[/-]\d{4})/i);
  if (dueMatch && dueMatch[1]) {
    dueDate = normalizeDateToIso(dueMatch[1]);
  }

  // 6. PO Number Extraction (with OCR "P0" -> "PO" correction)
  let poNumber: string | null = null;
  const poMatch = fullText.match(/(?:PO\s*Number|PO\s*No\.?|Purchase\s*Order)\s*[:#.-]?\s*([A-Za-z0-9/-]{3,20})/i);
  if (poMatch && poMatch[1]) {
    let rawPo = poMatch[1].trim().toUpperCase();
    if (rawPo.startsWith('P0-')) {
      rawPo = rawPo.replace(/^P0-/, 'PO-');
    }
    poNumber = rawPo;
  }

  let paymentTerms: string | null = null;
  const termsMatch = fullText.match(/(?:Payment\s*Terms|Terms)\s*[:#.-]?\s*([A-Za-z0-9\s]{3,20})/i);
  if (termsMatch && termsMatch[1]) {
    paymentTerms = termsMatch[1].trim();
  }

  // 7. Customer / Bill To Extraction
  let billToCustomer: string | null = null;
  const billToMatch = fullText.match(/(?:Bill\s*To|Billed\s*Customer|Customer\s*Name)\s*[:#.-]?\s*([^\n\r]{3,50})/i);
  if (billToMatch && billToMatch[1]) {
    billToCustomer = billToMatch[1].trim();
  }

  // 8. Financial Totals Extraction
  let subtotal = 0;
  const subtotalMatch = fullText.match(/(?:Subtotal|Sub\s*Total|Taxable\s*Amount)\s*[:=]?\s*(?:₹|Rs\.?|INR|\$|€)?\s*([0-9,]+(?:\.[0-9]{2})?)/i);
  if (subtotalMatch && subtotalMatch[1]) {
    subtotal = parseNumericAmount(subtotalMatch[1]);
  }

  let taxAmount = 0;
  let taxLabel: string | null = null;
  const taxMatch = fullText.match(/(?:IGST|CGST|SGST|GST|VAT|Tax)\s*(?:\([^)]+\))?\s*[:=]?\s*(?:₹|Rs\.?|INR|\$|€)?\s*([0-9,]+(?:\.[0-9]{2})?)/i);
  if (taxMatch) {
    taxLabel = taxMatch[0].split(/[:=]/)[0].trim();
    if (taxMatch[1]) taxAmount = parseNumericAmount(taxMatch[1]);
  }

  let totalAmount = 0;
  // Match explicit "Total Amount (INR)", "Grand Total", "Total Amount", "Amount Payable"
  const totalMatch = fullText.match(/(?:Total\s*Amount\s*(?:\(INR\))?|Grand\s*Total|Net\s*Amount|Amount\s*Payable)\s*[:=]?\s*(?:₹|Rs\.?|INR|\$|€)?\s*([0-9,]+(?:\.[0-9]{2})?)/i);
  if (totalMatch && totalMatch[1]) {
    totalAmount = parseNumericAmount(totalMatch[1]);
  } else {
    // Standalone Total line that isn't subtotal
    const fallbackTotalMatch = fullText.match(/(?<!Sub)\bTotal\b\s*[:=]?\s*(?:₹|Rs\.?|INR|\$|€)?\s*([0-9,]+(?:\.[0-9]{2})?)/i);
    if (fallbackTotalMatch && fallbackTotalMatch[1]) {
      totalAmount = parseNumericAmount(fallbackTotalMatch[1]);
    }
  }

  // If subtotal + tax = calculated, and totalAmount was 0 or incorrect, reconcile
  if (subtotal > 0 && taxAmount > 0 && (totalAmount === 0 || totalAmount === subtotal)) {
    totalAmount = subtotal + taxAmount;
  }

  // 9. Line Item Table Parser
  const items: InvoiceItem[] = [];
  let inTableSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/description|item|product|service|hsn|qty|quantity|rate|unit price|amount/i.test(line)) {
      inTableSection = true;
      continue;
    }

    if (inTableSection) {
      if (/subtotal|total|tax|gstin|notes|terms|signatory/i.test(line)) {
        inTableSection = false;
        break;
      }

      // Filter out 6-8 digit HSN/SAC codes from numbers extraction
      const rawNumbers = line.match(/\b\d+(?:,\d{3})*(?:\.\d{2})?\b/g) || [];
      const lineNums = rawNumbers
        .map((n) => parseNumericAmount(n))
        .filter((n) => n < 990000 || n > 999999); // Filter 6-digit HSN codes like 998313

      if (lineNums.length >= 2 && line.length > 5) {
        const amount = lineNums[lineNums.length - 1];
        const unitPrice = lineNums.length >= 2 ? lineNums[lineNums.length - 2] : amount;
        const qty = lineNums.length >= 3 ? lineNums[0] : 1;

        const description = line.replace(/\b\d+(?:,\d{3})*(?:\.\d{2})?\b/g, '').replace(/[|#]/g, '').trim();

        if (description.length > 2 && amount > 0) {
          items.push({
            description: description || 'Extracted Item',
            quantity: qty || 1,
            unitPrice: unitPrice || amount,
            amount: amount,
          });
        }
      }
    }
  }

  return {
    vendorName,
    vendorAddress: null,
    vendorGstin,
    vendorPhone: null,
    vendorEmail: null,
    invoiceNumber,
    invoiceDate,
    dueDate,
    poNumber,
    paymentTerms,
    billToCustomer,
    billToAddress: null,
    billToGstin,
    shipToCustomer: null,
    shipToAddress: null,
    shipToGstin: null,
    subtotal,
    taxLabel,
    taxAmount,
    totalAmount,
    amountInWords: null,
    currency: detectCurrency(fullText),
    signatory: null,
    notes: null,
    items,
  };
}
