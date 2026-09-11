import { LedgerDocument, InvoiceItem } from './types';

// The 13 Production Companies for Demo Data Generation
export const DEMO_COMPANIES = [
  {
    name: 'SkyTech Solutions Pvt. Ltd.',
    address: '123 Innovation Drive, Koramangala, Bengaluru, Karnataka 560034',
    gstin: '29ABCDE1234F1Z5',
    phone: '+91 80 4567 8900',
    email: 'billing@skytechsolutions.com',
    category: 'Software & Cloud',
    prefix: 'STS-2025-',
  },
  {
    name: 'CloudCom Systems Pvt. Ltd.',
    address: '78 Tech Park Rd, Whitefield, Bengaluru, Karnataka 560066',
    gstin: '29AADFC5678R1Z9',
    phone: '+91 80 9876 5432',
    email: 'accounts@cloudcomsystems.com',
    category: 'Cloud Infrastructure',
    prefix: 'CCS-2025-',
  },
  {
    name: 'Apex Logistics & Freight Solutions',
    address: '45 Cargo Hub Complex, Nh8 Highway, Gurgaon, Haryana 122001',
    gstin: '07AAACA9988B1Z2',
    phone: '+91 124 5566 7788',
    email: 'billing@apexlogistics.in',
    category: 'Freight & Logistics',
    prefix: 'APX-LOG-',
  },
  {
    name: 'Global Tech Services India',
    address: 'Phase II Cyber City, Madhapur, Hyderabad, Telangana 500081',
    gstin: '36AAACG4455H1Z3',
    phone: '+91 40 3344 5566',
    email: 'invoicing@globaltechservices.com',
    category: 'IT Support & Consulting',
    prefix: 'GTS-2026-',
  },
  {
    name: 'Acme Retail Enterprises',
    address: '89 Commercial Plaza, Connaught Place, New Delhi 110001',
    gstin: '07BBBCC1122D1Z4',
    phone: '+91 11 2345 6789',
    email: 'finance@acmeretail.com',
    category: 'Office & Supplies',
    prefix: 'ARE-INV-',
  },
  {
    name: 'Horizon Media & Marketing Solutions',
    address: '12 Media House, Bandra West, Mumbai, Maharashtra 400050',
    gstin: '27CCCDD3344E1Z6',
    phone: '+91 22 6677 8899',
    email: 'billing@horizonmedia.agency',
    category: 'Marketing & Advertising',
    prefix: 'HMM-2025-',
  },
  {
    name: 'Nexa Software Solutions India',
    address: '56 Software Park, Electronic City, Bengaluru, Karnataka 560100',
    gstin: '29DDDEE5566F1Z7',
    phone: '+91 80 1122 3344',
    email: 'ar@nexasoftware.com',
    category: 'SaaS Software',
    prefix: 'NSS-2026-',
  },
  {
    name: 'Zenith Electronics Pvt Ltd',
    address: '123 Tech Park, Off MG Road, Mumbai, Maharashtra 400001',
    gstin: '27AAACA1234A1Z1',
    phone: '+91 22 4455 6677',
    email: 'sales@zenithelectronics.com',
    category: 'Hardware & Accessories',
    prefix: 'ZEL-900',
  },
  {
    name: 'Apex Accounting & Audit Firm',
    address: '101 CA Towers, Nariman Point, Mumbai, Maharashtra 400021',
    gstin: '27EEEFF7788G1Z8',
    phone: '+91 22 2233 4455',
    email: 'billing@apexaccounting.com',
    category: 'Professional Services',
    prefix: 'AAA-AUD-',
  },
  {
    name: 'Omni Healthcare Supplies Pvt Ltd',
    address: '34 Pharma Hub, Peenya Industrial Area, Bengaluru, Karnataka 560058',
    gstin: '29FFFGG9900H1Z9',
    phone: '+91 80 6677 1122',
    email: 'orders@omnihealthcare.in',
    category: 'Healthcare & Supplies',
    prefix: 'OHS-2025-',
  },
  {
    name: 'CyberNet India Telecommunications',
    address: '90 Telecom Tower, Salt Lake Sector V, Kolkata, West Bengal 700091',
    gstin: '19GGGHH1122I1Z0',
    phone: '+91 33 4455 9900',
    email: 'corporate@cybernetindia.net',
    category: 'Telecommunications',
    prefix: 'CNI-TEL-',
  },
  {
    name: 'Stellar Infra Infrastructure',
    address: '45 Construction Plaza, SG Highway, Ahmedabad, Gujarat 380015',
    gstin: '24HHHII3344J1Z1',
    phone: '+91 79 3322 1100',
    email: 'billing@stellarinfra.com',
    category: 'Facilities & Maintenance',
    prefix: 'SII-2026-',
  },
  {
    name: 'Fresh Foods Traders Pvt Ltd',
    address: '45 Market Street, Majestic, Bengaluru, Karnataka 560001',
    gstin: '29BBBFF9876F1Z2',
    phone: '+91 80 5566 7788',
    email: 'accounts@freshfoodstraders.com',
    category: 'Catering & Hospitality',
    prefix: 'FFT-2026-',
  },
];

const ITEM_CATALOG: Record<string, InvoiceItem[]> = {
  'SkyTech Solutions Pvt. Ltd.': [
    { description: 'Cloud Managed Infrastructure Support', hsnSac: '998313', quantity: 1, unitPrice: 14000, amount: 14000 },
    { description: 'Database Backup & Automation License', hsnSac: '998314', quantity: 2, unitPrice: 4500, amount: 9000 },
  ],
  'CloudCom Systems Pvt. Ltd.': [
    { description: 'Enterprise Data Analytics Server Hosting', hsnSac: '998315', quantity: 1, unitPrice: 165000, amount: 165000 },
    { description: 'Dedicated Virtual Private Cloud Gateway', hsnSac: '998316', quantity: 3, unitPrice: 25000, amount: 75000 },
  ],
  'Apex Logistics & Freight Solutions': [
    { description: 'Interstate Freight Shipping & Haulage', hsnSac: '996511', quantity: 4, unitPrice: 12500, amount: 50000 },
    { description: 'Warehouse Storage & Handling Fee', hsnSac: '996729', quantity: 1, unitPrice: 18000, amount: 18000 },
  ],
  'Global Tech Services India': [
    { description: 'Full Stack Development Support (Man-Hours)', hsnSac: '998314', quantity: 40, unitPrice: 2500, amount: 100000 },
    { description: 'Security Vulnerability Audit Report', hsnSac: '998319', quantity: 1, unitPrice: 45000, amount: 45000 },
  ],
  'Acme Retail Enterprises': [
    { description: 'Ergonomic Mesh Office Chairs', hsnSac: '940330', quantity: 5, unitPrice: 8500, amount: 42500 },
    { description: 'Dual Display Desktop Monitors 27-inch', hsnSac: '852852', quantity: 4, unitPrice: 16000, amount: 64000 },
  ],
  'Horizon Media & Marketing Solutions': [
    { description: 'Digital Marketing & Social Media Campaign', hsnSac: '998361', quantity: 1, unitPrice: 85000, amount: 85000 },
    { description: 'Brand Identity Design & Content Creation', hsnSac: '998362', quantity: 1, unitPrice: 35000, amount: 35000 },
  ],
  'Nexa Software Solutions India': [
    { description: 'Enterprise ERP Cloud User Subscriptions', hsnSac: '998314', quantity: 25, unitPrice: 1800, amount: 45000 },
    { description: 'API Integration & Custom Webhooks Config', hsnSac: '998315', quantity: 1, unitPrice: 28000, amount: 28000 },
  ],
  'Zenith Electronics Pvt Ltd': [
    { description: 'Wireless Mechanical Keyboards', hsnSac: '847160', quantity: 10, unitPrice: 3500, amount: 35000 },
    { description: 'Noise Cancelling Wireless Headsets', hsnSac: '851830', quantity: 6, unitPrice: 4200, amount: 25200 },
  ],
  'Apex Accounting & Audit Firm': [
    { description: 'Quarterly GST Filing & Tax Audit Advisory', hsnSac: '998222', quantity: 1, unitPrice: 50000, amount: 50000 },
    { description: 'Transfer Pricing Compliance Assessment', hsnSac: '998231', quantity: 1, unitPrice: 35000, amount: 35000 },
  ],
  'Omni Healthcare Supplies Pvt Ltd': [
    { description: 'Medical Inspection Safety Equipment Kits', hsnSac: '901890', quantity: 15, unitPrice: 3200, amount: 48000 },
    { description: 'Sanitization Station Dispenser Units', hsnSac: '842489', quantity: 8, unitPrice: 4500, amount: 36000 },
  ],
  'CyberNet India Telecommunications': [
    { description: 'High-Speed Dedicated Fiber Bandwidth 1Gbps', hsnSac: '998413', quantity: 1, unitPrice: 38000, amount: 38000 },
    { description: 'Static IP Address Allocation & Firewall', hsnSac: '998414', quantity: 5, unitPrice: 1200, amount: 6000 },
  ],
  'Stellar Infra Infrastructure': [
    { description: 'HVAC Air Conditioning Maintenance & Servicing', hsnSac: '998719', quantity: 1, unitPrice: 28000, amount: 28000 },
    { description: 'Electrical Substation Safety Inspection', hsnSac: '998714', quantity: 1, unitPrice: 15000, amount: 15000 },
  ],
  'Fresh Foods Traders Pvt Ltd': [
    { description: 'Corporate Cafeteria Luncheon Catering', hsnSac: '996331', quantity: 120, unitPrice: 250, amount: 30000 },
    { description: 'Beverage & Executive Refreshments Package', hsnSac: '996332', quantity: 1, unitPrice: 8500, amount: 8500 },
  ],
};

/**
 * Generates 100 realistic, complete document records across the 13 companies
 */
export function generate100DemoDocuments(): LedgerDocument[] {
  const documents: LedgerDocument[] = [];
  const totalCount = 100;

  for (let i = 1; i <= totalCount; i++) {
    const comp = DEMO_COMPANIES[(i - 1) % DEMO_COMPANIES.length];
    const catalog = ITEM_CATALOG[comp.name] || ITEM_CATALOG['SkyTech Solutions Pvt. Ltd.'];
    const item = catalog[(i - 1) % catalog.length];

    const qty = Math.max(1, ((i * 3) % 15) + 1);
    const unitPrice = item.unitPrice;
    const subtotal = qty * unitPrice;
    const taxRate = 0.18;
    const taxGst = Math.round(subtotal * taxRate);
    const totalAmount = subtotal + taxGst;

    // Determine status distribution across 100 records
    let status: LedgerDocument['status'] = 'VERIFIED';
    let issueDescription: string | null = null;
    let requiredInfoFound = true;
    let amountVerified = true;
    let noDuplicateFound = true;

    if (i % 7 === 0) {
      status = 'Needs Review';
      amountVerified = false;
      issueDescription = `Arithmetic Discrepancy: Extracted Total is INR ${totalAmount.toLocaleString()}, but subtotal + tax check requires review.`;
    } else if (i % 13 === 0) {
      status = 'DUPLICATE';
      noDuplicateFound = false;
      issueDescription = `Duplicate Invoice Warning: Invoice #${comp.prefix}${1000 + i} already exists in database.`;
    } else if (i % 11 === 0) {
      status = 'Approved';
      issueDescription = null;
    } else if (i % 17 === 0) {
      status = 'Extraction Failed';
      requiredInfoFound = false;
      amountVerified = false;
      issueDescription = 'OCR Text Stream unreadable or low resolution image file.';
    }

    // Generate dates ranging from Jan 2025 to Sep 2026
    const month = ((i % 12) + 1).toString().padStart(2, '0');
    const day = (((i * 5) % 28) + 1).toString().padStart(2, '0');
    const year = i % 2 === 0 ? '2026' : '2025';
    const dateStr = `${year}-${month}-${day}`;

    // Upload timestamp
    const uploadHour = (8 + (i % 10)).toString().padStart(2, '0');
    const uploadMin = ((i * 7) % 60).toString().padStart(2, '0');
    const uploadedAt = `${dateStr} ${uploadHour}:${uploadMin}`;

    const doc: LedgerDocument = {
      id: `doc_100_${String(i).padStart(3, '0')}`,
      vendor: comp.name,
      vendorAddress: comp.address,
      vendorGstin: comp.gstin,
      vendorPhone: comp.phone,
      vendorEmail: comp.email,
      invoiceNumber: `${comp.prefix}${1000 + i}`,
      date: dateStr,
      dueDate: `${year}-${month}-28`,
      poNumber: `PO-${8800 + i}`,
      paymentTerms: 'Net 30 Days',
      billToCustomer: 'SmartLedger Enterprise Ltd.',
      billToAddress: '100 Business Bay, MG Road, Bengaluru 560001',
      billToGstin: '29AAACS1000A1Z9',
      subtotal,
      taxGst,
      taxLabel: 'GST (18%)',
      totalAmount,
      calculatedTotal: totalAmount,
      amountInWords: `INR ${totalAmount.toLocaleString()} Only`,
      category: comp.category,
      status,
      checks: {
        requiredInfoFound,
        amountVerified,
        noDuplicateFound,
      },
      issueDescription,
      items: [
        {
          description: item.description,
          hsnSac: item.hsnSac,
          quantity: qty,
          unitPrice,
          amount: subtotal,
        },
      ],
      notes: 'Standard B2B Accounting Transaction recorded in SmartLedger.',
      signatory: 'Finance Manager / CA Audit Approved',
      uploadedAt,
      fileName: `${comp.name.split(' ')[0].toLowerCase()}_inv_${1000 + i}.pdf`,
      fileType: 'application/pdf',
      fileUrl: `https://evosmfwpzanmccljfvzh.supabase.co/storage/v1/object/public/invoices/demo_${i}.pdf`,
    };

    documents.push(doc);
  }

  return documents;
}

export const INITIAL_DOCUMENTS: LedgerDocument[] = generate100DemoDocuments();
