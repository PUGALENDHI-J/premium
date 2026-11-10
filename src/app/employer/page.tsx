'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_JOBS, MOCK_CANDIDATE } from '@/lib/mockData';

export default function EmployerTalentOSPage() {
  const [pipelineStage, setPipelineStage] = useState<'all' | 'screening' | 'interview' | 'offer'>('all');
  const [selectedCandidate, setSelectedCandidate] = useState(MOCK_CANDIDATE);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduledSuccess, setScheduledSuccess] = useState(false);

  const candidates = [
    MOCK_CANDIDATE,
    {
      ...MOCK_CANDIDATE,
      id: 'cand-002',
      name: 'Sarah Chen, MS CS',
      headline: 'Principal AI Infrastructure & PyTorch Kernel Engineer',
      yearsExperience: 8.2,
      matchScore: 91,
      currentRole: 'Lead AI Engineer at ScaleVector',
    },
    {
      ...MOCK_CANDIDATE,
      id: 'cand-003',
      name: 'Arjun Patel, B.Tech',
      headline: 'Senior Cloud Security & Zero-Trust Architect',
      yearsExperience: 6.5,
      matchScore: 84,
      currentRole: 'Security Lead at CyberMesh',
    },
  ];

  return (
    <div className="w-full pt-16 flex flex-col bg-surface min-h-screen">
      {/* Header Executive Summary & Verification Banner */}
      <section className="bg-surface-container-lowest border-b border-outline-variant/30 py-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant font-bold">
                Talent Operations Hub
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                <span className="material-symbols-outlined text-xs">verified</span>
                VERIFIED ENTERPRISE (GST/CIN Validated)
              </span>
              <span className="text-xs font-mono text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                Entity ID: NX-9482-ENT
              </span>
            </div>
            <h1 className="font-headline text-2xl font-bold text-on-surface">
              Employer Talent OS &amp; ATS Recruiter Workspace
            </h1>
            <p className="text-xs text-on-surface-variant">
              Cloud Infrastructure &amp; AI Systems Group • 14 Active Requisitions
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/app/nexa"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:bg-slate-800 text-xs font-mono font-bold transition-all shadow-quantum-subtle"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>NEXA ATS Intelligence</span>
            </Link>
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-secondary text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
            >
              + Post New Requisition
            </button>
          </div>
        </div>
      </section>

      {/* Core Metrics Ribbon */}
      <section className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-surface-container-lowest p-4 border border-outline-variant/30 shadow-sm">
            <div className="text-xs font-mono uppercase text-on-surface-variant font-bold">
              Active Openings
            </div>
            <div className="text-2xl font-bold text-on-surface mt-1">14</div>
            <span className="text-xs text-emerald-600 font-semibold">+3 this month</span>
          </div>

          <div className="rounded-xl bg-surface-container-lowest p-4 border border-outline-variant/30 shadow-sm">
            <div className="text-xs font-mono uppercase text-on-surface-variant font-bold">
              Total Submissions
            </div>
            <div className="text-2xl font-bold text-on-surface mt-1">1,482</div>
            <span className="text-xs text-on-surface-variant">Across 14 requisitions</span>
          </div>

          <div className="rounded-xl bg-surface-container-lowest p-4 border border-secondary/30 shadow-sm bg-gradient-to-br from-blue-50/40 to-white">
            <div className="text-xs font-mono uppercase text-secondary font-bold flex items-center justify-between">
              <span>AI Matches &gt;85%</span>
              <span className="material-symbols-outlined text-sm text-secondary">psychology</span>
            </div>
            <div className="text-2xl font-bold text-on-surface mt-1">184</div>
            <span className="text-xs text-secondary font-semibold">12.4% Top Tier Yield</span>
          </div>

          <div className="rounded-xl bg-surface-container-lowest p-4 border border-outline-variant/30 shadow-sm">
            <div className="text-xs font-mono uppercase text-on-surface-variant font-bold">
              Avg Time to Offer
            </div>
            <div className="text-2xl font-bold text-on-surface mt-1">11.4 Days</div>
            <span className="text-xs text-emerald-600 font-semibold">-4.2 days vs market</span>
          </div>
        </div>
      </section>

      {/* Candidate Pipeline & Comparative Evaluation */}
      <section className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Candidate List (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-base font-bold text-on-surface">
              Shortlisted Candidates ({candidates.length})
            </h2>
            <div className="flex rounded-lg bg-surface-container p-0.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setPipelineStage('all')}
                className={`px-3 py-1 rounded ${
                  pipelineStage === 'all'
                    ? 'bg-surface-container-lowest text-on-surface font-bold shadow-xs'
                    : 'text-on-surface-variant'
                }`}
              >
                All Stages
              </button>
              <button
                type="button"
                onClick={() => setPipelineStage('screening')}
                className={`px-3 py-1 rounded ${
                  pipelineStage === 'screening'
                    ? 'bg-surface-container-lowest text-on-surface font-bold shadow-xs'
                    : 'text-on-surface-variant'
                }`}
              >
                Screening
              </button>
              <button
                type="button"
                onClick={() => setPipelineStage('interview')}
                className={`px-3 py-1 rounded ${
                  pipelineStage === 'interview'
                    ? 'bg-surface-container-lowest text-on-surface font-bold shadow-xs'
                    : 'text-on-surface-variant'
                }`}
              >
                Interview
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {candidates.map((cand) => {
              const isSelected = selectedCandidate.id === cand.id;

              return (
                <div
                  key={cand.id}
                  onClick={() => setSelectedCandidate(cand)}
                  className={`p-4 rounded-xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-blue-50/50 border-secondary shadow-md ring-1 ring-secondary'
                      : 'bg-surface-container-lowest border-outline-variant/30 hover:border-outline-variant'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={cand.avatarUrl}
                        alt={cand.name}
                        className="w-12 h-12 rounded-full object-cover border border-outline-variant/30"
                      />
                      <div>
                        <h3 className="font-title text-base font-bold text-on-surface">
                          {cand.name}
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          {cand.headline}
                        </p>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">
                          {cand.yearsExperience} yrs exp • {cand.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-mono font-bold">
                        {cand.matchScore}% Match
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {cand.skills.slice(0, 5).map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-surface-container text-on-surface text-[11px] font-mono"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Evaluation Scorecard (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6 shadow-lg flex flex-col gap-4">
            <div className="border-b border-outline-variant/20 pb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-secondary font-bold">
                ATS Candidate Evaluation
              </span>
              <h3 className="font-display text-xl font-bold text-on-surface mt-1">
                {selectedCandidate.name}
              </h3>
              <p className="text-xs text-on-surface-variant">
                Applied for: <strong>Principal Distributed Systems Engineer</strong>
              </p>
            </div>

            {/* Score Pill */}
            <div className="p-4 rounded-xl bg-slate-950 text-white border border-cyan-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-cyan-300 font-bold">
                  Algorithmic Scorecard
                </span>
                <span className="font-mono text-base font-bold text-cyan-300">
                  {selectedCandidate.matchScore}% Match
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Candidate exceeds technical threshold. Verified in Go, Concurrency, and Raft consensus engines.
              </p>
            </div>

            {/* Structured Interview Rubric */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-2 font-bold">
                NEXA Suggested Technical Interview Rubric:
              </h4>
              <ul className="list-disc pl-4 space-y-2 text-xs text-on-surface-variant">
                <li>
                  <strong>Distributed Fault Tolerance:</strong> Walk through a split-brain recovery scenario using Raft terms and append entry heartbeats.
                </li>
                <li>
                  <strong>Lock-Free Data Structures:</strong> Compare compare-and-swap (CAS) ring buffers with Go channel synchronization.
                </li>
                <li>
                  <strong>GPU Acceleration:</strong> How would you optimize tensor paging in vLLM for high-throughput batching?
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-outline-variant/20 flex flex-col gap-2">
              {scheduledSuccess ? (
                <div className="p-3 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-mono font-bold text-center">
                  ✓ Interview Slot Reserved &amp; Calendar Invites Dispatched
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setScheduledSuccess(true);
                    setTimeout(() => setScheduledSuccess(false), 5000);
                  }}
                  className="w-full py-2.5 rounded-xl bg-secondary text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Schedule Interview &amp; Dispatch Invites
                </button>
              )}
              <Link
                href="/app/nexa"
                className="w-full py-2.5 rounded-xl bg-slate-900 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold text-center hover:bg-slate-800 transition-colors"
              >
                Audit Pipeline Bottlenecks with NEXA ↗
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

