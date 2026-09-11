'use client';

import React, { useState } from 'react';
import { Bot, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, RefreshCw, Cpu, Layers, UserCheck } from 'lucide-react';
import { useDocuments } from '@/lib/store';
import { runMultiAgentPipeline, AgentStepTrace } from '@/lib/agents';

export default function AgentsPage() {
  const { documents } = useDocuments();
  const [isExecuting, setIsExecuting] = useState(false);
  const [agentTrace, setAgentTrace] = useState<AgentStepTrace[]>([
    {
      agentName: 'Extraction Agent',
      role: 'OCR & Vision Parser',
      action: 'Extracted key header metadata, vendor entity, date, and line items.',
      status: 'PASSED',
      timestamp: '21:10:04',
      details: 'Parsed vendor "Acme Office Supplies" and invoice number "#INV-1025".',
      confidenceScore: 0.98,
    },
    {
      agentName: 'Audit Agent',
      role: 'Arithmetic Auditor',
      action: 'Verified math equality: Subtotal (₹10,000) + GST (₹1,800) == Total (₹11,800).',
      status: 'PASSED',
      timestamp: '21:10:05',
      details: 'Line item calculations matched invoice summary total.',
      confidenceScore: 0.99,
    },
    {
      agentName: 'Reconciliation Agent',
      role: 'Ledger Cross-Referencer',
      action: 'Checked database index for duplicate invoice number or vendor payment.',
      status: 'PASSED',
      timestamp: '21:10:05',
      details: 'No duplicate record found. Vendor profile matches registered active supplier.',
      confidenceScore: 0.96,
    },
    {
      agentName: 'Workflow Agent',
      role: 'CA Approval Orchestrator',
      action: 'Evaluated auto-approval policy thresholds.',
      status: 'PASSED',
      timestamp: '21:10:06',
      details: 'Confidence score (98%) meets auto-approval criteria. Pre-approved for CA signoff.',
      confidenceScore: 0.97,
    },
  ]);
  const [selectedAgent, setSelectedAgent] = useState<string>('Audit Agent');

  const handleTriggerSimulation = async () => {
    setIsExecuting(true);
    try {
      const result = await runMultiAgentPipeline(undefined, documents);
      setAgentTrace(result.agentLogs);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
              <Bot className="w-3.5 h-3.5" />
              <span>Advanced Agentic Architecture (Challenge 7)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Multi-Agent Operations & Workflow Engine
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Specialized autonomous AI agents coordinate document extraction, arithmetic auditing, duplicate reconciliation, and human-in-the-loop approval routing.
            </p>
          </div>

          <button
            onClick={handleTriggerSimulation}
            disabled={isExecuting}
            className="self-start sm:self-auto py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isExecuting ? 'animate-spin' : ''}`} />
            <span>{isExecuting ? 'Agent Execution in Progress...' : 'Run Live Multi-Agent Pipeline'}</span>
          </button>
        </div>
      </div>

      {/* Agents Visual Pipeline Diagram */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>Active Agent Workflow Pipeline</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Agent 1 */}
          <div
            onClick={() => setSelectedAgent('Extraction Agent')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedAgent === 'Extraction Agent'
                ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Agent 01</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Extraction Agent</h3>
            </div>
            <p className="text-xs text-slate-500">OCR & Document Vision Parsing</p>
          </div>

          {/* Agent 2 */}
          <div
            onClick={() => setSelectedAgent('Audit Agent')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedAgent === 'Audit Agent'
                ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Agent 02</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Audit & Compliance</h3>
            </div>
            <p className="text-xs text-slate-500">Arithmetic & Rule Verification</p>
          </div>

          {/* Agent 3 */}
          <div
            onClick={() => setSelectedAgent('Reconciliation Agent')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedAgent === 'Reconciliation Agent'
                ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Agent 03</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <RefreshCw className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Reconciliation</h3>
            </div>
            <p className="text-xs text-slate-500">Duplicate & History Check</p>
          </div>

          {/* Agent 4 */}
          <div
            onClick={() => setSelectedAgent('Workflow Agent')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedAgent === 'Workflow Agent'
                ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Agent 04</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                ORCHESTRATOR
              </span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Workflow Manager</h3>
            </div>
            <p className="text-xs text-slate-500">CA Review & Routing Engine</p>
          </div>
        </div>
      </div>

      {/* Real-time Agent Execution Trace Stream */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-slate-700" />
            <span>Agent Execution Log & Decision Trace</span>
          </span>
          <span className="text-xs text-slate-500 font-normal">
            Updated live during extraction
          </span>
        </h2>

        <div className="space-y-3">
          {agentTrace.map((trace, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border ${
                trace.status === 'FLAGGED'
                  ? 'bg-amber-50/60 border-amber-200'
                  : 'bg-slate-50/70 border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {trace.status === 'FLAGGED' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  <span className="text-xs font-bold text-slate-900">{trace.agentName}</span>
                  <span className="text-[11px] text-slate-500">({trace.role})</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-mono text-slate-400">{trace.timestamp}</span>
                  <span className="px-2 py-0.5 rounded-full font-semibold text-[11px] bg-white border border-slate-200 text-slate-700">
                    Confidence: {(trace.confidenceScore * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <p className="text-xs font-medium text-slate-800 mb-1">{trace.action}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{trace.details}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
