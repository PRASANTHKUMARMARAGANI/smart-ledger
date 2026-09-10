# SmartLedger (LedgerAgent) — Complete System Architecture & Security Documentation

**24-Hour Swarnandhra College Hackathon 2026 — Problem Statement 2**

---

## 1. Executive Summary

SmartLedger is an AI-powered accounting operations and workflow automation platform designed specifically for Chartered Accountants (CAs), finance departments, bookkeeping firms, and small-to-medium businesses (SMBs). 

It automates financial document collection, OCR/vision field extraction, arithmetic reconciliation, duplicate detection, and review routing while maintaining **strict Human-in-the-Loop oversight**. SmartLedger does not position itself as an unrestricted tax/legal advisor, ensuring compliance with professional financial standards.

---

## 2. High-Level Architecture Overview

```
[ Client / Users ] (CA / Manager / Client / Auditor)
       │
       ▼
[ Web Gateway & Next.js App ] ──► [ Security & Prompt Shield ]
       │                                     │
       ▼                                     ▼
[ Multi-Agent Engine ] ──────────────► [ Gemini 1.5 Flash Vision ]
  ├─ Extraction Agent
  ├─ Audit & Validation Agent
  ├─ Reconciliation Agent
  └─ Workflow Manager Agent
       │
       ▼
[ Event-Driven Queue (Redis/BullMQ) ] ──► [ Async Background Worker ]
       │
       ▼
[ Immutable Audit Trail & Metrics Engine ]
```

---

## 3. Multi-Agent Operations Architecture

SmartLedger uses a specialized 4-agent collaborative pipeline:

1. **Document Extraction Agent**: Analyzes structured and unstructured invoices, receipts, and POs using Gemini Vision AI.
2. **Audit & Compliance Agent**: Enforces mathematical integrity checks (`Subtotal + GST = Total Amount`) and flags line-item price anomalies.
3. **Reconciliation Agent**: Cross-references prior transaction history to prevent duplicate invoice processing and matches vendor profiles.
4. **Workflow & Approval Manager**: Evaluates confidence scores and risk flags to determine auto-approval or route for manual CA review.

---

## 4. Security Model & STRIDE Threat Analysis

### Security Defense-in-Depth
- **Prompt Injection Defense**: Intercepts adversarial instructions disguised inside invoice text or metadata.
- **Payload Validation**: Strict MIME-type checking, 10MB file ceiling, and executable header detection.
- **API Rate Limiting**: In-memory token bucket limiting requests per IP address.
- **RBAC Enforcement**: Role-based permissions matrix isolating Chartered Accountants, Managers, Clients, and Auditors.

### STRIDE Threat Matrix
| Threat Category | Potential Risk | Mitigation in SmartLedger |
| :--- | :--- | :--- |
| **Spoofing** | Unauthorized role impersonation | JWT session verification & role claim checks |
| **Tampering** | Altering invoice totals during extraction | Dual arithmetic validation by Audit Agent |
| **Repudiation** | Denying approval actions | Immutable cryptographically timestamped audit log |
| **Information Disclosure** | Data leak across clients | Multi-tenant organization isolation boundaries |
| **Denial of Service** | Upload flooding | Token-bucket rate limiter & max file size limits |
| **Elevation of Privilege** | Client attempting CA signoff | Strict server-side RBAC permission guardrails |

---

## 5. AI Safety & Hallucination Mitigation

1. **Deterministic Double-Check**: LLM numeric outputs are subjected to deterministic math verification. If `Subtotal + Tax != Total`, the item is automatically flagged.
2. **Confidence Indexing**: Every extraction yields a confidence score. Documents with scores < 90% require mandatory CA verification.
3. **Strict Schema Constraints**: JSON mode output guarantees structured schema parsing without loose unstructured text generation.

---

## 6. Observability & System Monitoring

- **Health Check Endpoint (`/api/health`)**: Reports memory RSS/heap, API status, and Redis connection state.
- **AI Evaluation Dashboard (`/eval`)**: Live metrics tracking accuracy rate (%), latency (ms), hallucination risk index, and token expenditure ($).
- **Audit Logs Stream (`/security`)**: Real-time event tracking of all approvals, security blocks, and user actions.

---

## 7. Scalability & Disaster Recovery

- **Decoupled Job Queue**: Asynchronous processing prevents UI blocking during large document ingestion batches.
- **Horizontal Scaling**: Containerized Next.js frontend and stateless background worker nodes scale independently.
- **Recovery Strategy**: Redis persistence snapshots (`RDB` + `AOF`) allow full queue recovery within seconds of node failure.
