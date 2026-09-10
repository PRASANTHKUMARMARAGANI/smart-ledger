import { LedgerDocument } from './types';

/**
 * SmartLedger Gemini AI Real Document Extraction Engine
 * Zero hardcoded fallback values. Strictly parses actual uploaded document.
 */

export interface GeminiExtractionResult {
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
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  amountInWords: string | null;
  currency: string;
  notes: string | null;
  signatory: string | null;
  category: string;
  items: Array<{
    description: string;
    hsnSac: string | null;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
}

export interface ExtractionResponse {
  success: boolean;
  data?: GeminiExtractionResult;
  error?: string;
  code?: string;
}

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

/**
 * Validates whether a key looks like a valid Google Gemini API Key
 */
function isValidGeminiApiKey(key?: string): boolean {
  if (!key) return false;
  const trimmed = key.trim();
  if (trimmed.length < 15) return false;
  if (trimmed.includes('demo_key') || trimmed.includes('your_gemini_api_key')) return false;
  return true;
}

/**
 * Extract document details using Gemini AI API with strict schema enforcement
 */
export async function extractDocumentWithGemini(
  fileData?: { base64: string; mimeType: string; fileName: string },
  apiKey?: string
): Promise<ExtractionResponse> {
  const activeKey = (apiKey || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '').trim();

  if (!isValidGeminiApiKey(activeKey)) {
    return {
      success: false,
      error: 'Invalid or missing GEMINI_API_KEY in server environment. Please configure a valid Google Gemini API Key in .env.local to enable AI invoice extraction.',
      code: 'GEMINI_API_KEY_INVALID',
    };
  }

  if (!fileData || !fileData.base64) {
    return {
      success: false,
      error: 'No document file payload received. Please select a valid PDF or image invoice file.',
      code: 'MISSING_FILE_PAYLOAD',
    };
  }

  try {
    const prompt = `You are SmartLedger's expert document extraction AI. Analyze the actual text, visual layout, header, line items, and totals in this uploaded invoice or receipt.
Extract structured accounting data adhering strictly to this JSON schema:

{
  "vendorName": "Vendor or Business Name (or null if not found)",
  "vendorAddress": "Vendor Address (or null if not found)",
  "vendorGstin": "GSTIN (e.g. 29ABCDE1234F1Z5 or null)",
  "vendorPhone": "Phone number (or null)",
  "vendorEmail": "Email address (or null)",
  "invoiceNumber": "Invoice Number / Bill No (or null if not found)",
  "invoiceDate": "Document Date (e.g. 20 Nov 2025 or null)",
  "dueDate": "Payment Due Date (or null)",
  "poNumber": "PO Number (or null)",
  "paymentTerms": "Payment Terms (e.g. Net 15 Days or null)",
  "billToCustomer": "Billed Customer Name (or null)",
  "billToAddress": "Billed Customer Address (or null)",
  "billToGstin": "Billed Customer GSTIN (or null)",
  "shipToCustomer": "Ship To Name (or null)",
  "shipToAddress": "Ship To Address (or null)",
  "shipToGstin": "Ship To GSTIN (or null)",
  "subtotal": 0.00,
  "taxLabel": "Tax type string e.g. IGST (18%) or null",
  "taxRate": 18,
  "taxAmount": 0.00,
  "totalAmount": 0.00,
  "amountInWords": "Amount in words (or null)",
  "currency": "INR",
  "notes": "Invoice notes/terms (or null)",
  "signatory": "Authorized Signatory Name (or null)",
  "items": [
    {
      "description": "Item or service description",
      "hsnSac": "HSN/SAC code (or null)",
      "quantity": 1,
      "unitPrice": 0.00,
      "amount": 0.00
    }
  ]
}

CRITICAL INSTRUCTIONS:
1. Extract ONLY information that is explicitly visible in the uploaded document.
2. If a field is not present or cannot be read, set it to null or empty string. NEVER invent or guess data.
3. Ensure numbers (subtotal, taxAmount, totalAmount, quantity, unitPrice, amount) are parsed as numbers, not strings.
4. Respond ONLY with valid, raw JSON. Do NOT include markdown code fences or conversational text.`;

    const isBearerToken = activeKey.startsWith('AQ.') || activeKey.startsWith('ya29.');
    const url = `${GEMINI_API_ENDPOINT}?key=${activeKey}`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: fileData.mimeType,
                  data: fileData.base64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          response_mime_type: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      let errorMsg = `Gemini API call failed with HTTP status ${response.status}.`;
      try {
        const parsedErr = JSON.parse(errText);
        if (parsedErr.error?.message) {
          errorMsg = `Gemini API Error (${response.status}): ${parsedErr.error.message}`;
        }
      } catch {}

      if (response.status === 401) {
        errorMsg += ' Please obtain a free Google AI Studio API key starting with "AIzaSy..." from https://aistudio.google.com/app/apikey and add it to .env.local.';
      }

      return {
        success: false,
        error: errorMsg,
        code: `GEMINI_HTTP_${response.status}`,
      };
    }

    const json = await response.json();
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return {
        success: false,
        error: 'Gemini Vision AI completed processing but returned an empty response candidate.',
        code: 'EMPTY_AI_RESPONSE',
      };
    }

    const cleanedText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    let parsed: any;
    try {
      parsed = JSON.parse(cleanedText);
    } catch (parseErr) {
      return {
        success: false,
        error: 'Failed to parse JSON schema from Gemini AI extraction output.',
        code: 'EXTRACTION_PARSING_ERROR',
      };
    }

    // Dynamic Category Classification Engine based strictly on extracted vendor name & item descriptions
    const vendorStr = (parsed.vendorName || '').toLowerCase();
    const itemDescs = (parsed.items || []).map((i: any) => i.description || '').join(' ').toLowerCase();
    const fullContentText = `${vendorStr} ${itemDescs}`;

    let category = 'Other';
    if (/software|cloud|aws|hosting|server|license|domain|subscription|seo|tech|digital|platform/i.test(fullContentText)) {
      category = 'Software & Cloud Services';
    } else if (/paper|stationery|office|desk|chair|printer|supplies|furniture|toner|cartridge/i.test(fullContentText)) {
      category = 'Office Equipment & Supplies';
    } else if (/hotel|restaurant|food|dining|catering|cafe|travel|flight|uber|cab|hospitality/i.test(fullContentText)) {
      category = 'Meals & Hospitality';
    } else if (/freight|shipping|courier|logistics|post|delivery|transport|cargo/i.test(fullContentText)) {
      category = 'Freight & Shipping Services';
    } else if (/electricity|water|broadband|mobile|telecom|internet|bill|utility/i.test(fullContentText)) {
      category = 'Utilities & Communication';
    } else if (/audit|legal|consulting|fee|accounting|ca|advisory|tax|professional/i.test(fullContentText)) {
      category = 'Professional & Legal Services';
    }

    const extractionResult: GeminiExtractionResult = {
      vendorName: parsed.vendorName || null,
      vendorAddress: parsed.vendorAddress || null,
      vendorGstin: parsed.vendorGstin || null,
      vendorPhone: parsed.vendorPhone || null,
      vendorEmail: parsed.vendorEmail || null,
      invoiceNumber: parsed.invoiceNumber || null,
      invoiceDate: parsed.invoiceDate || null,
      dueDate: parsed.dueDate || null,
      poNumber: parsed.poNumber || null,
      paymentTerms: parsed.paymentTerms || null,
      billToCustomer: parsed.billToCustomer || null,
      billToAddress: parsed.billToAddress || null,
      billToGstin: parsed.billToGstin || null,
      shipToCustomer: parsed.shipToCustomer || null,
      shipToAddress: parsed.shipToAddress || null,
      shipToGstin: parsed.shipToGstin || null,
      subtotal: typeof parsed.subtotal === 'number' ? parsed.subtotal : Number(parsed.subtotal || 0),
      taxLabel: parsed.taxLabel || null,
      taxRate: typeof parsed.taxRate === 'number' ? parsed.taxRate : Number(parsed.taxRate || 0),
      taxAmount: typeof parsed.taxAmount === 'number' ? parsed.taxAmount : Number(parsed.taxAmount || 0),
      totalAmount: typeof parsed.totalAmount === 'number' ? parsed.totalAmount : Number(parsed.totalAmount || 0),
      amountInWords: parsed.amountInWords || null,
      currency: parsed.currency || 'INR',
      notes: parsed.notes || null,
      signatory: parsed.signatory || null,
      category,
      items: Array.isArray(parsed.items)
        ? parsed.items.map((item: any) => ({
            description: item.description || 'Unspecified Item',
            hsnSac: item.hsnSac || null,
            quantity: typeof item.quantity === 'number' ? item.quantity : Number(item.quantity || 1),
            unitPrice: typeof item.unitPrice === 'number' ? item.unitPrice : Number(item.unitPrice || 0),
            amount: typeof item.amount === 'number' ? item.amount : Number(item.amount || 0),
          }))
        : [],
    };

    return {
      success: true,
      data: extractionResult,
    };
  } catch (error) {
    return {
      success: false,
      error: `Invoice extraction error: ${(error as Error).message}`,
      code: 'EXTRACTION_EXCEPTION',
    };
  }
}

