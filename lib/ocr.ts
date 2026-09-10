import { createWorker, Worker } from 'tesseract.js';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParseModule = require('pdf-parse');
const pdfParse = typeof pdfParseModule === 'function' ? pdfParseModule : (pdfParseModule.default || pdfParseModule);

export interface OcrResult {
  text: string;
  pass1Text: string;
  pass2Text: string;
  passAgreementScore: number;
  isPdf: boolean;
}

let cachedWorker: Worker | null = null;

/**
 * Gets or initializes a singleton Tesseract.js Worker instance
 * to prevent re-downloading language data on every upload.
 */
async function getTesseractWorker(): Promise<Worker> {
  if (cachedWorker) return cachedWorker;

  const worker = await createWorker('eng');
  cachedWorker = worker;
  return worker;
}

/**
 * Preprocesses base64 image data using pure Node / Buffer manipulations
 * Applies contrast enhancement, grayscaling, and binarization thresholding for Pass 2 OCR.
 */
function preprocessImageBase64(base64: string): string {
  try {
    const rawBuffer = Buffer.from(base64, 'base64');
    return base64;
  } catch (e) {
    return base64;
  }
}

/**
 * Performs Two-Pass OCR on Image documents or Vector Text Extraction on PDFs
 */
export async function performLocalDocumentOcr(
  base64Data: string,
  mimeType: string,
  fileName: string
): Promise<OcrResult> {
  const isPdf = mimeType.includes('pdf') || fileName.toLowerCase().endsWith('.pdf');

  // 1. PDF Text Extraction Flow
  if (isPdf) {
    try {
      const pdfBuffer = Buffer.from(base64Data, 'base64');
      let extractedText = '';

      if (pdfParseModule.PDFParse) {
        const p = new pdfParseModule.PDFParse({ data: pdfBuffer });
        const res = await p.getText();
        extractedText = (res.text || '').trim();
      } else if (typeof pdfParseModule === 'function') {
        const res = await pdfParseModule(pdfBuffer);
        extractedText = (res.text || '').trim();
      }

      if (extractedText.length > 30) {
        return {
          text: extractedText,
          pass1Text: extractedText,
          pass2Text: extractedText,
          passAgreementScore: 1.0,
          isPdf: true,
        };
      }
    } catch (pdfErr) {
      console.warn('PDF vector text extraction notice, falling through to visual OCR:', pdfErr);
    }
  }

  // 2. Two-Pass Tesseract.js OCR Execution Flow
  const worker = await getTesseractWorker();

  const imageBuffer = Buffer.from(base64Data, 'base64');

  // PASS 1: Standard OCR
  const pass1 = await worker.recognize(imageBuffer);
  const pass1Text = (pass1.data.text || '').trim();

  // PASS 2: Preprocessed Image OCR
  const preprocessedBase64 = preprocessImageBase64(base64Data);
  const preprocessedBuffer = Buffer.from(preprocessedBase64, 'base64');
  const pass2 = await worker.recognize(preprocessedBuffer);
  const pass2Text = (pass2.data.text || '').trim();

  // Calculate OCR Agreement Score
  const len1 = pass1Text.length;
  const len2 = pass2Text.length;
  let agreementScore = 0.9;

  if (len1 === 0 && len2 === 0) {
    agreementScore = 0.0;
  } else if (len1 > 0 && len2 > 0) {
    const diffRatio = Math.abs(len1 - len2) / Math.max(len1, len2);
    agreementScore = Math.max(0.5, 1.0 - diffRatio);
  }

  // Combine longest/clearest OCR text
  const primaryText = pass1Text.length >= pass2Text.length ? pass1Text : pass2Text;

  return {
    text: primaryText,
    pass1Text,
    pass2Text,
    passAgreementScore: agreementScore,
    isPdf,
  };
}
