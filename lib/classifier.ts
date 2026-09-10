import { InvoiceItem } from './types';

export const TAXONOMY_CATEGORIES = [
  'Software & Cloud Services',
  'Office Equipment & Supplies',
  'Meals & Hospitality',
  'Freight & Shipping Services',
  'Utilities & Communication',
  'Professional & Legal Services',
  'Other',
] as const;

export type AccountingCategory = (typeof TAXONOMY_CATEGORIES)[number];

/**
 * Deterministic Keyword-Scoring Classifier
 * Uses line item descriptions as primary signal and vendor name as secondary signal.
 */
export function classifyInvoice(vendorName: string | null, items: InvoiceItem[] = []): AccountingCategory {
  const itemText = items.map((i) => i.description || '').join(' ').toLowerCase();
  const vendorText = (vendorName || '').toLowerCase();

  const primaryText = `${itemText} ${vendorText}`;

  if (/software|cloud|aws|hosting|server|license|domain|subscription|seo|website|development|platform|saas|app|digital/i.test(primaryText)) {
    return 'Software & Cloud Services';
  }

  if (/laptop|monitor|printer|keyboard|stationery|paper|desk|chair|furniture|office|toner|cartridge|supplies/i.test(primaryText)) {
    return 'Office Equipment & Supplies';
  }

  if (/hotel|restaurant|food|dining|catering|cafe|travel|flight|uber|cab|taxi|hospitality|lunch|dinner/i.test(primaryText)) {
    return 'Meals & Hospitality';
  }

  if (/freight|shipping|courier|logistics|post|delivery|transport|cargo|dhl|fedex/i.test(primaryText)) {
    return 'Freight & Shipping Services';
  }

  if (/electricity|water|broadband|mobile|telecom|internet|telephone|bill|utility|power/i.test(primaryText)) {
    return 'Utilities & Communication';
  }

  if (/audit|legal|consulting|fee|accounting|ca|advisory|tax|professional|retainer/i.test(primaryText)) {
    return 'Professional & Legal Services';
  }

  return 'Other';
}
