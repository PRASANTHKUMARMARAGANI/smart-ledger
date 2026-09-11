'use client';

import React, { useState } from 'react';
import { Bot, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, RefreshCw, Cpu, Layers, UserCheck, Sparkles, Database } from 'lucide-react';
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
      details: 'Parsed vendor "SkyTech Solutions Pvt. Ltd." and invoice number "#STS-2025-1042".',
      confidenceScore: 0.98,
    },
    {
      agentName: 'Audit Agent',
      role: 'Arithmetic Auditor',
      action: 'Verified math equality: Subtotal (₹14,000) + GST (₹2,520) == Total (₹16,520).',
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
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Multi-Agent Mesh Architecture
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 font-display">
            Autonomous Multi-Agent Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Coordinated autonomous AI agent workforce handling OCR extraction, arithmetic audits, duplicate reconciliation, and workflow routing.
          </p>
        </div>

        <button
          onClick={handleTriggerSimulation}
          disabled={isExecuting}
          className="self-start sm:self-auto py-2.5 px-5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isExecuting ? 'animate-spin' : ''}`} />
          <span>{isExecuting ? 'Agent Pipeline Active...' : 'Run Live Agent Simulation'}</span>
        </button>
      </div>

      {/* Agents Visual Pipeline Diagram */}
      <div className="glass-panel rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2 font-display">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Multi-Agent Coordination Nodes</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Agent 1 */}
          <div
            onClick={() => setSelectedAgent('Extraction Agent')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              selectedAgent === 'Extraction Agent'
                ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold text-slate-400">NODE 01</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-2.5 mb-1">
              <Cpu className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white font-display">Extraction Agent</h3>
            </div>
            <p className="text-xs text-slate-400">OCR & Document Layout Parser</p>
          </div>

          {/* Agent 2 */}
          <div
            onClick={() => setSelectedAgent('Audit Agent')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              selectedAgent === 'Audit Agent'
                ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold text-slate-400">NODE 02</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-2.5 mb-1">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white font-display">Audit & Compliance</h3>
            </div>
            <p className="text-xs text-slate-400">Arithmetic Math Auditor</p>
          </div>

          {/* Agent 3 */}
          <div
            onClick={() => setSelectedAgent('Reconciliation Agent')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              selectedAgent === 'Reconciliation Agent'
                ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold text-slate-400">NODE 03</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-2.5 mb-1">
              <RefreshCw className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white font-display">Reconciliation</h3>
            </div>
            <p className="text-xs text-slate-400">Duplicate Ledger Checker</p>
          </div>

          {/* Agent 4 */}
          <div
            onClick={() => setSelectedAgent('Workflow Agent')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              selectedAgent === 'Workflow Agent'
                ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold text-slate-400">NODE 04</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                ORCHESTRATOR
              </span>
            </div>
            <div className="flex items-center gap-2.5 mb-1">
              <UserCheck className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white font-display">Workflow Manager</h3>
            </div>
            <p className="text-xs text-slate-400">CA Review & Signoff Router</p>
          </div>
        </div>
      </div>

      {/* Real-time Agent Execution Trace Stream */}
      <div className="glass-panel rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center justify-between font-display">
          <span className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>Live Agent Decision & Verification Trace</span>
          </span>
          <span className="text-xs font-mono text-slate-400 font-normal">
            Real-time pipeline logs
          </span>
        </h2>

        <div className="space-y-3">
          {agentTrace.map((trace, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border ${
                trace.status === 'FLAGGED'
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-slate-900/70 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  {trace.status === 'FLAGGED' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  <span className="text-xs font-bold text-white font-display">{trace.agentName}</span>
                  <span className="text-[10px] font-mono text-slate-400">({trace.role})</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-mono text-slate-500">{trace.timestamp}</span>
                  <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-slate-800 border border-slate-700 text-indigo-300">
                    Confidence: {(trace.confidenceScore * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <p className="text-xs font-bold text-slate-200 mb-1">{trace.action}</p>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">{trace.details}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
