import { createClient } from '@supabase/supabase-js';
import { LedgerDocument } from './types';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '').trim();
const SUPABASE_ANON_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = () => {
  return (
    Boolean(SUPABASE_URL) &&
    Boolean(SUPABASE_ANON_KEY) &&
    !SUPABASE_URL.includes('your-supabase-project') &&
    SUPABASE_URL.startsWith('https://')
  );
};

export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder'
);

/**
 * Uploads original document file to Supabase Storage bucket ('invoices')
 */
export async function uploadFileToSupabaseStorage(
  fileName: string,
  base64Data: string,
  mimeType: string
): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const buffer = Buffer.from(base64Data, 'base64');
    const storagePath = `invoices/${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    const { data, error } = await supabase.storage
      .from('invoices')
      .upload(storagePath, buffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      console.warn('Supabase storage upload notice:', error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage.from('invoices').getPublicUrl(data.path);
    return publicUrlData.publicUrl;
  } catch (e) {
    console.warn('Supabase storage upload exception:', e);
    return null;
  }
}

/**
 * Persists document record to Supabase PostgreSQL table 'documents'
 */
export async function saveDocumentToSupabase(doc: LedgerDocument): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase.from('documents').upsert({
      id: doc.id,
      vendor: doc.vendor,
      vendor_address: doc.vendorAddress,
      vendor_gstin: doc.vendorGstin,
      invoice_number: doc.invoiceNumber,
      date: doc.date,
      due_date: doc.dueDate,
      subtotal: doc.subtotal,
      tax_gst: doc.taxGst,
      total_amount: doc.totalAmount,
      category: doc.category,
      status: doc.status,
      checks: doc.checks,
      issue_description: doc.issueDescription,
      file_name: doc.fileName,
      file_url: doc.fileUrl,
      items: doc.items,
      uploaded_at: doc.uploadedAt,
    });

    if (error) {
      console.warn('Supabase PostgreSQL upsert notice:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Supabase PostgreSQL save exception:', e);
    return false;
  }
}
