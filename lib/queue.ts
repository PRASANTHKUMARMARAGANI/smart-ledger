/**
 * SmartLedger Event-Driven Messaging & Job Queue Engine
 * Simulates a production Redis/BullMQ task queue for asynchronous background document ingestion & AI processing.
 */

export interface QueueJob {
  id: string;
  fileName: string;
  fileSize: string;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  retryCount: number;
  maxRetries: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
  resultDocId?: string;
}

const DEMO_QUEUE: QueueJob[] = [
  {
    id: 'job_batch_001',
    fileName: 'Vendor_Invoice_Sept_2026.pdf',
    fileSize: '1.4 MB',
    status: 'COMPLETED',
    retryCount: 0,
    maxRetries: 3,
    createdAt: '2026-09-10 21:00:12',
    startedAt: '2026-09-10 21:00:13',
    completedAt: '2026-09-10 21:00:15',
    resultDocId: 'doc_1',
  },
  {
    id: 'job_batch_002',
    fileName: 'Stationery_Receipt_1026.png',
    fileSize: '840 KB',
    status: 'COMPLETED',
    retryCount: 0,
    maxRetries: 3,
    createdAt: '2026-09-10 21:02:40',
    startedAt: '2026-09-10 21:02:41',
    completedAt: '2026-09-10 21:02:44',
    resultDocId: 'doc_2',
  },
  {
    id: 'job_batch_003',
    fileName: 'Hardware_Store_Bill.pdf',
    fileSize: '2.1 MB',
    status: 'COMPLETED',
    retryCount: 1,
    maxRetries: 3,
    createdAt: '2026-09-10 21:05:01',
    startedAt: '2026-09-10 21:05:02',
    completedAt: '2026-09-10 21:05:06',
    resultDocId: 'doc_3',
  },
];

export function getJobQueue(): QueueJob[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('smart_ledger_job_queue');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
  }
  return DEMO_QUEUE;
}

export function pushJobToQueue(job: Omit<QueueJob, 'id' | 'createdAt' | 'status' | 'retryCount' | 'maxRetries'>): QueueJob {
  const newJob: QueueJob = {
    ...job,
    id: `job_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    status: 'QUEUED',
    retryCount: 0,
    maxRetries: 3,
    createdAt: new Date().toLocaleString(),
  };

  const queue = getJobQueue();
  const updated = [newJob, ...queue];

  if (typeof window !== 'undefined') {
    localStorage.setItem('smart_ledger_job_queue', JSON.stringify(updated));
  }

  return newJob;
}
