/**
 * SmartLedger Audit Trail Logging Engine
 * Records security alerts, document state changes, multi-agent operations, and user activity.
 */

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userEmail: string;
  role: string;
  action: string;
  category: 'SECURITY' | 'DOCUMENT' | 'AGENT' | 'SYSTEM' | 'RBAC';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  details: string;
  ipAddress?: string;
}

const DEMO_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log_301',
    timestamp: '2026-09-10 21:00:15',
    userEmail: 'alex.morgan@apexaccounting.com',
    role: 'Chartered Accountant',
    action: 'DOCUMENT_APPROVED',
    category: 'DOCUMENT',
    severity: 'INFO',
    details: 'Approved invoice #INV-1025 for Acme Office Supplies (₹11,800)',
    ipAddress: '192.168.1.45',
  },
  {
    id: 'log_302',
    timestamp: '2026-09-10 21:12:30',
    userEmail: 'system.agent@smartledger.ai',
    role: 'Audit Agent',
    action: 'ARITHMETIC_FLAG',
    category: 'AGENT',
    severity: 'WARNING',
    details: 'Flagged mismatch on XYZ Supplies (#INV-1026): Total ₹13,000 vs calc ₹11,800',
    ipAddress: '127.0.0.1',
  },
  {
    id: 'log_303',
    timestamp: '2026-09-10 21:20:00',
    userEmail: 'system.security@smartledger.ai',
    role: 'Security Engine',
    action: 'PROMPT_INJECTION_BLOCKED',
    category: 'SECURITY',
    severity: 'CRITICAL',
    details: 'Intercepted and blocked adversarial prompt instruction pattern in upload payload',
    ipAddress: '203.0.113.195',
  },
  {
    id: 'log_304',
    timestamp: '2026-09-10 21:25:40',
    userEmail: 'sarah.jenkins@finops.co',
    role: 'Finance Manager',
    action: 'EXPORT_CSV',
    category: 'DOCUMENT',
    severity: 'INFO',
    details: 'Exported approved transactions ledger (3 records)',
    ipAddress: '192.168.1.88',
  },
];

export function getAuditLogs(): AuditLogEntry[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('smart_ledger_audit_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
  }
  return DEMO_AUDIT_LOGS;
}

export function logAuditEvent(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
  const newEntry: AuditLogEntry = {
    ...entry,
    id: `log_${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };

  const logs = getAuditLogs();
  const updated = [newEntry, ...logs];

  if (typeof window !== 'undefined') {
    localStorage.setItem('smart_ledger_audit_logs', JSON.stringify(updated));
  }

  return newEntry;
}
