/**
 * SmartLedger AI Benchmark & Evaluation Framework
 * Evaluates AI extraction accuracy, hallucination risk, processing latency, and token cost.
 */

export interface AIEvalMetric {
  id: string;
  timestamp: string;
  documentType: string;
  accuracyScore: number; // 0 to 100
  latencyMs: number;
  hallucinationRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  tokensUsed: number;
  estimatedCostUsd: number;
  confidenceScore: number; // 0 to 100
  status: 'PASS' | 'WARN' | 'FAIL';
}

export interface SummaryEvalStats {
  averageAccuracy: number;
  averageLatencyMs: number;
  hallucinationRatePercent: number;
  totalTokens: number;
  totalCostUsd: number;
  passRatePercent: number;
}

const INITIAL_EVAL_RUNS: AIEvalMetric[] = [
  {
    id: 'eval_101',
    timestamp: '2026-09-10 21:10',
    documentType: 'Tax Invoice (GST Standard)',
    accuracyScore: 98.5,
    latencyMs: 1240,
    hallucinationRisk: 'LOW',
    tokensUsed: 420,
    estimatedCostUsd: 0.00031,
    confidenceScore: 99.1,
    status: 'PASS',
  },
  {
    id: 'eval_102',
    timestamp: '2026-09-10 21:15',
    documentType: 'Handwritten Receipt (Scan)',
    accuracyScore: 91.2,
    latencyMs: 2180,
    hallucinationRisk: 'MEDIUM',
    tokensUsed: 680,
    estimatedCostUsd: 0.00051,
    confidenceScore: 88.4,
    status: 'WARN',
  },
  {
    id: 'eval_103',
    timestamp: '2026-09-10 21:20',
    documentType: 'Multi-line Purchase Order',
    accuracyScore: 99.1,
    latencyMs: 1450,
    hallucinationRisk: 'LOW',
    tokensUsed: 540,
    estimatedCostUsd: 0.00040,
    confidenceScore: 98.7,
    status: 'PASS',
  },
  {
    id: 'eval_104',
    timestamp: '2026-09-10 21:24',
    documentType: 'Utility Bill (Water/Electric)',
    accuracyScore: 97.8,
    latencyMs: 1120,
    hallucinationRisk: 'LOW',
    tokensUsed: 390,
    estimatedCostUsd: 0.00029,
    confidenceScore: 97.5,
    status: 'PASS',
  },
];

export function getEvalHistory(): AIEvalMetric[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('smart_ledger_eval_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
  }
  return INITIAL_EVAL_RUNS;
}

export function saveEvalMetric(metric: AIEvalMetric) {
  const history = getEvalHistory();
  const updated = [metric, ...history];
  if (typeof window !== 'undefined') {
    localStorage.setItem('smart_ledger_eval_history', JSON.stringify(updated));
  }
  return updated;
}

export function computeSummaryStats(runs: AIEvalMetric[]): SummaryEvalStats {
  if (runs.length === 0) {
    return {
      averageAccuracy: 0,
      averageLatencyMs: 0,
      hallucinationRatePercent: 0,
      totalTokens: 0,
      totalCostUsd: 0,
      passRatePercent: 0,
    };
  }

  const totalAcc = runs.reduce((acc, r) => acc + r.accuracyScore, 0);
  const totalLat = runs.reduce((acc, r) => acc + r.latencyMs, 0);
  const hallucinations = runs.filter((r) => r.hallucinationRisk !== 'LOW').length;
  const passes = runs.filter((r) => r.status === 'PASS').length;
  const totalTokens = runs.reduce((acc, r) => acc + r.tokensUsed, 0);
  const totalCost = runs.reduce((acc, r) => acc + r.estimatedCostUsd, 0);

  return {
    averageAccuracy: parseFloat((totalAcc / runs.length).toFixed(1)),
    averageLatencyMs: Math.round(totalLat / runs.length),
    hallucinationRatePercent: parseFloat(((hallucinations / runs.length) * 100).toFixed(1)),
    totalTokens,
    totalCostUsd: parseFloat(totalCost.toFixed(5)),
    passRatePercent: parseFloat(((passes / runs.length) * 100).toFixed(1)),
  };
}
