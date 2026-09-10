'use client';

import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, Zap, Building, ChevronRight, Layers, ArrowUpRight } from 'lucide-react';

export default function BillingPage() {
  const [selectedOrg, setSelectedOrg] = useState('Apex Accounting Firm (CA Partner)');
  const [currentPlan, setCurrentPlan] = useState('Pro');
  const [docsProcessedThisMonth, setDocsProcessedThisMonth] = useState(420);
  const [monthlyLimit] = useState(1000);
  const [showUpgradeModal, setShowUpgradeModal] = useState<string | null>(null);

  const usagePercent = Math.round((docsProcessedThisMonth / monthlyLimit) * 100);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Business Expansion & SaaS Billing Engine (Challenge 10)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              SaaS Billing, Subscription & Client Organization Console
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Multi-tenant organization data isolation, tiered SaaS subscriptions, usage-based document quotas, and automated client billing exports.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 shrink-0">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-300 block">Current Active Client Org</span>
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer mt-0.5"
            >
              <option value="Apex Accounting Firm (CA Partner)" className="text-slate-900">Apex Accounting Firm</option>
              <option value="FinOps Solutions Ltd" className="text-slate-900">FinOps Solutions Ltd</option>
              <option value="Swarnandhra Enterprise SMB" className="text-slate-900">Swarnandhra Enterprise SMB</option>
            </select>
          </div>
        </div>
      </div>

      {/* Monthly Usage Quota Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-600" />
              <span>Monthly Document Processing Quota ({selectedOrg})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Plan reset date: 1st of every month</p>
          </div>
          <div className="text-right">
            <span className="text-lg font-extrabold text-slate-900">{docsProcessedThisMonth}</span>
            <span className="text-xs text-slate-500 font-medium"> / {monthlyLimit} docs processed</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-500"
            style={{ width: `${usagePercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{usagePercent}% used of monthly plan</span>
          <span>{monthlyLimit - docsProcessedThisMonth} documents remaining</span>
        </div>
      </div>

      {/* SaaS Pricing Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Starter Plan */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Starter Tier</div>
            <h3 className="text-xl font-bold text-slate-900">SMB Bookkeeper</h3>
            <p className="text-xs text-slate-500 mt-1">Ideal for small business owners and single CAs.</p>
            <div className="my-6">
              <span className="text-3xl font-extrabold text-slate-900">$49</span>
              <span className="text-xs text-slate-500 font-medium"> / month</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Up to 250 docs/month</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Core Gemini Vision OCR</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Basic Duplicate Check</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-slate-300 shrink-0" />
                <span>No Multi-Agent Operations</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => setShowUpgradeModal('Starter')}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs transition-colors"
          >
            Select Starter Plan
          </button>
        </div>

        {/* Pro Plan (Recommended) */}
        <div className="bg-white rounded-2xl border-2 border-indigo-600 p-6 shadow-lg relative flex flex-col justify-between">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-widest rounded-full shadow-sm">
            Most Popular CA Choice
          </div>
          <div>
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Pro Tier</div>
            <h3 className="text-xl font-bold text-slate-900">CA Firm & Finance Team</h3>
            <p className="text-xs text-slate-500 mt-1">Full multi-agent automation and workflow approval.</p>
            <div className="my-6">
              <span className="text-3xl font-extrabold text-slate-900">$149</span>
              <span className="text-xs text-slate-500 font-medium"> / month</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Up to 1,000 docs/month</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Full 4-Agent Orchestrator Engine</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Prompt Injection Security Shield</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Audit Trail & CSV/PDF Exports</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => setShowUpgradeModal('Pro')}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors shadow-md"
          >
            Current Active Plan (Pro)
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Enterprise Tier</div>
            <h3 className="text-xl font-bold text-slate-900">Enterprise & Audit Firm</h3>
            <p className="text-xs text-slate-500 mt-1">Custom volume limits, dedicated DB isolation, and SLA.</p>
            <div className="my-6">
              <span className="text-3xl font-extrabold text-slate-900">$499</span>
              <span className="text-xs text-slate-500 font-medium"> / month</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Unlimited Document Volume</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Multi-Cloud & On-Prem Support</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dedicated Account Manager & SLA</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Custom API Webhooks & ERP Sync</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => setShowUpgradeModal('Enterprise')}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs transition-colors"
          >
            Contact Sales for Enterprise
          </button>
        </div>
      </div>

      {/* Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">Subscription Updated</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Selected <strong>{showUpgradeModal} Plan</strong> for <em>{selectedOrg}</em>. Demo SaaS payment flow verified successfully.
            </p>
            <button
              onClick={() => setShowUpgradeModal(null)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
