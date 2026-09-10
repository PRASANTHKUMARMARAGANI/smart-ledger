/**
 * SmartLedger Security & Safety Module
 * Handles prompt injection protection, input sanitization, rate limiting, payload validation, and RBAC control.
 */

// Known prompt injection patterns commonly found in malicious document uploads or adversarial user prompts
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /system\s+prompt/i,
  /you\s+are\s+now\s+a/i,
  /override\s+system/i,
  /do\s+not\s+follow/i,
  /forget\s+all\s+rules/i,
  /print\s+system\s+instructions/i,
  /delete\s+all\s+data/i,
  /sql\s+injection/i,
  /<script>/i,
  /javascript:/i,
];

// In-memory rate limiting cache (IP / User based)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS_PER_MINUTE = 30;

export interface SecurityCheckResult {
  passed: boolean;
  threatType?: string;
  reason?: string;
  sanitizedInput?: string;
}

/**
 * Scans text content for potential prompt injection or malicious code injection attacks
 */
export function checkPromptInjection(text: string): SecurityCheckResult {
  if (!text) return { passed: true };

  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      return {
        passed: false,
        threatType: 'PROMPT_INJECTION',
        reason: `Potentially malicious instruction pattern detected: "${pattern.source}"`,
      };
    }
  }

  return { passed: true };
}

/**
 * Sanitizes input text to prevent XSS and code injection
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Enforces rate limiting on requests
 */
export function checkRateLimit(clientId: string): { allowed: boolean; remaining: number; resetInSec: number } {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const clientData = rateLimitMap.get(clientId);

  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: MAX_REQUESTS_PER_MINUTE - 1, resetInSec: 60 };
  }

  if (clientData.count >= MAX_REQUESTS_PER_MINUTE) {
    const resetInSec = Math.ceil((clientData.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, resetInSec };
  }

  clientData.count += 1;
  const remaining = MAX_REQUESTS_PER_MINUTE - clientData.count;
  const resetInSec = Math.ceil((clientData.resetTime - now) / 1000);
  return { allowed: true, remaining, resetInSec };
}

/**
 * Validates uploaded document payload size and format
 */
export function validateDocumentPayload(fileName: string, mimeType: string, base64Data: string): SecurityCheckResult {
  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

  // Size check
  const approximateSize = (base64Data.length * 3) / 4;
  if (approximateSize > MAX_FILE_SIZE_BYTES) {
    return {
      passed: false,
      threatType: 'PAYLOAD_TOO_LARGE',
      reason: `File size (${(approximateSize / (1024 * 1024)).toFixed(2)} MB) exceeds 10 MB limit.`,
    };
  }

  // File extension check
  const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];
  const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return {
      passed: false,
      threatType: 'INVALID_FILE_TYPE',
      reason: `File extension "${ext}" is not permitted. Only PDF and standard images are allowed.`,
    };
  }

  // Malicious executable pattern in header base64 check
  if (base64Data.startsWith('TVqQAAMAAAAEAAAA')) { // Executable PE header 'MZ'
    return {
      passed: false,
      threatType: 'MALICIOUS_FILE_HEADER',
      reason: 'File contains executable code pattern in header.',
    };
  }

  return { passed: true };
}

export type UserRole = 'Chartered Accountant' | 'Finance Manager' | 'SMB Client' | 'Auditor';

export interface RBACPermission {
  canApprove: boolean;
  canReject: boolean;
  canUpload: boolean;
  canExport: boolean;
  canAccessSecurityLogs: boolean;
  canAccessBilling: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RBACPermission> = {
  'Chartered Accountant': {
    canApprove: true,
    canReject: true,
    canUpload: true,
    canExport: true,
    canAccessSecurityLogs: true,
    canAccessBilling: true,
  },
  'Finance Manager': {
    canApprove: true,
    canReject: true,
    canUpload: true,
    canExport: true,
    canAccessSecurityLogs: false,
    canAccessBilling: true,
  },
  'SMB Client': {
    canApprove: false,
    canReject: false,
    canUpload: true,
    canExport: true,
    canAccessSecurityLogs: false,
    canAccessBilling: false,
  },
  'Auditor': {
    canApprove: false,
    canReject: false,
    canUpload: false,
    canExport: true,
    canAccessSecurityLogs: true,
    canAccessBilling: false,
  },
};
