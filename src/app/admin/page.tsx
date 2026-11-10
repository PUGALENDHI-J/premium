'use client';

import React from 'react';
import Link from 'next/link';

export default function AdminGovernanceConsolePage() {
  const auditLogs = [
    {
      id: 'log-1',
      event: 'AI Action Executed: Fast-Track Candidate Shortlist',
      agent: 'NEXA_RECRUIT',
      user: 'Director of Talent (Recruiter ATS)',
      timestamp: '2 mins ago',
      status: 'VERIFIED',
      dpdpCompliant: true,
    },
    {
      id: 'log-2',
      event: '7-Factor Match Calculated (Score: 94%)',
      agent: 'NEXA_TALENT',
      user: 'Devin Thorne (Candidate)',
      timestamp: '14 mins ago',
      status: 'VERIFIED',
      dpdpCompliant: true,
    },
    {
      id: 'log-3',
      event: 'DRM Video Token Issued with Cryptographic Watermark',
      agent: 'LMS Security Plane',
      user: 'Devin Thorne (Student)',
      timestamp: '32 mins ago',
      status: 'VERIFIED',
      dpdpCompliant: true,
    },
  ];

  const systemHealth = [
    { component: 'PostgreSQL 16 + pgvector', status: 'Healthy', latency: '4ms' },
    { component: 'Redis & BullMQ Pipeline', status: 'Healthy', latency: '1.2ms' },
    { component: 'Meilisearch Semantic Index', status: 'Healthy', latency: '8ms' },
    { component: 'NEXA Quantum Orchestrator', status: 'Optimal', latency: '350ms' },
  ];

  return (
    <div className="w-full pt-16 flex flex-col bg-surface min-h-screen">
      {/* Header */}
      <section className="bg-surface-container-lowest border-b border-outline-variant/30 py-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-secondary font-bold">
                Platform Governance
              </span>
              <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                DPDP Tier-1 Certified
              </span>
            </div>
            <h1 className="font-headline text-2xl font-bold text-on-surface">
              Super Admin Platform Governance Console
            </h1>
            <p className="text-xs text-on-surface-variant">
              System Health, Tenant Security, AI Audit Logs &amp; DPDP Regulatory Records
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/app/nexa"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:bg-slate-800 text-xs font-mono font-bold transition-all shadow-quantum-subtle"
            >
              <span className="material-symbols-outlined text-sm">smart_toy</span>
              <span>Launch NEXA Admin</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Audit Logs & AI Action Telemetry (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-headline text-base font-bold text-on-surface">
                Real-Time AI Action &amp; DPDP Audit Trail
              </h2>
              <span className="text-xs font-mono text-secondary font-bold">
                Immutable Ledger
              </span>
            </div>

            <div className="divide-y divide-outline-variant/20">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-secondary">
                        security
                      </span>
                      <h4 className="font-title text-sm font-semibold text-on-surface">
                        {log.event}
                      </h4>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Triggered by: <strong>{log.user}</strong> via <span className="font-mono text-secondary">{log.agent}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                      ✓ {log.status}
                    </span>
                    <span className="text-[10px] text-on-surface-variant block mt-1 font-mono">
                      {log.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Platform Health & Token Consumption (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-5 shadow-sm space-y-4">
            <h3 className="font-title text-sm font-bold text-on-surface">
              Core Subsystem Health
            </h3>

            <div className="space-y-3">
              {systemHealth.map((sys, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low text-xs border border-outline-variant/20"
                >
                  <div>
                    <span className="font-semibold text-on-surface block">{sys.component}</span>
                    <span className="text-[10px] text-on-surface-variant font-mono">
                      Latency: {sys.latency}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                    {sys.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Usage Record Card */}
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-5 shadow-sm space-y-3">
            <h3 className="font-title text-sm font-bold text-on-surface">
              AI Token &amp; Budget Telemetry
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Tokens Processed Today:</span>
                <span className="font-mono font-bold text-on-surface">248,120</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Active Conversations:</span>
                <span className="font-mono font-bold text-secondary">38</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Daily Budget Cap:</span>
                <span className="font-mono font-bold text-emerald-600">3.4% Consumed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

