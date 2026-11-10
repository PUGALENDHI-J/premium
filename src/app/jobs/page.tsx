'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_JOBS, MOCK_CANDIDATE } from '@/lib/mockData';
import { JobItem, MatchScoreBreakdown } from '@/types';
import { TalentMatchingService } from '@/services/TalentMatchingService';

export default function JobSearchExplorerPage() {
  const [selectedJob, setSelectedJob] = useState<JobItem>(MOCK_JOBS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [minMatch, setMinMatch] = useState(80);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);

  const filteredJobs = MOCK_JOBS.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRemote = remoteOnly ? job.isRemote : true;
    const matchesScore = (job.matchScore || 0) >= minMatch;

    return matchesSearch && matchesRemote && matchesScore;
  });

  const activeMatch = TalentMatchingService.calculateMatch(MOCK_CANDIDATE, selectedJob);

  const handleApply = () => {
    setAppliedJobs((prev) => [...prev, selectedJob.id]);
    setApplicationModalOpen(false);
  };

  return (
    <div className="w-full pt-16 flex flex-col bg-surface min-h-screen">
      {/* Header bar */}
      <div className="bg-surface-container-lowest border-b border-outline-variant/30 py-4 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">explore</span>
              <h1 className="font-headline text-xl sm:text-2xl font-bold text-on-surface">
                Verified Enterprise Job Explorer
              </h1>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              42,400+ requisitions continuously synchronized with enterprise ATS networks
            </p>
          </div>

          <Link
            href="/app/nexa"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:bg-slate-800 text-xs font-mono font-bold transition-all shadow-quantum-subtle"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>NEXA Smart Search</span>
          </Link>
        </div>
      </div>

      {/* Main 2-Column Split: Filtered List & Detailed Evaluation Pane */}
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Filter Bar & Job Cards */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Search & Quick Filter Controls */}
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm space-y-3">
            <div className="flex items-center rounded-lg bg-surface-container-low px-3 py-2 border border-outline-variant/30">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, skill, or enterprise name..."
                className="w-full bg-transparent px-2 text-xs sm:text-sm text-on-surface focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-on-surface">
                <input
                  type="checkbox"
                  checked={remoteOnly}
                  onChange={(e) => setRemoteOnly(e.target.checked)}
                  className="rounded text-secondary focus:ring-secondary"
                />
                <span>Remote Positions Only</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-on-surface-variant text-[11px] font-mono">
                  Min Match Score:
                </span>
                <select
                  value={minMatch}
                  onChange={(e) => setMinMatch(Number(e.target.value))}
                  className="rounded border border-outline-variant/30 bg-surface-container px-2 py-1 text-xs font-mono"
                >
                  <option value={70}>70% +</option>
                  <option value={80}>80% + (Tier-1)</option>
                  <option value={90}>90% + (Priority)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Job List */}
          <div className="space-y-3">
            {filteredJobs.map((job) => {
              const isSelected = selectedJob.id === job.id;
              const hasApplied = appliedJobs.includes(job.id);

              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-4 rounded-xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-blue-50/50 border-secondary shadow-md ring-1 ring-secondary'
                      : 'bg-surface-container-lowest border-outline-variant/30 hover:border-outline-variant hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={job.companyLogo}
                        alt={job.companyName}
                        className="w-10 h-10 rounded-lg object-cover border border-outline-variant/20"
                      />
                      <div>
                        <h3 className="font-title text-base font-bold text-on-surface">
                          {job.title}
                        </h3>
                        <p className="text-xs text-on-surface-variant flex items-center gap-1">
                          <span>{job.companyName}</span>
                          {job.isVerifiedEnterprise && (
                            <span className="material-symbols-outlined text-xs text-emerald-600">
                              verified
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {job.matchScore && (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-mono font-bold">
                          {job.matchScore}% Match
                        </span>
                      )}
                      {hasApplied && (
                        <span className="text-[10px] font-mono text-emerald-600 font-bold">
                          ✓ Applied
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {job.requiredSkills.slice(0, 5).map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-surface-container text-on-surface text-[11px]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant font-mono">
                    <span>{job.salaryRange.split('/')[0]}</span>
                    <span>{job.location} • {job.experienceYears}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep-Dive Evaluation & 7-Factor Match Card */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="sticky top-20 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6 shadow-lg flex flex-col gap-4">
            {/* Header */}
            <div className="border-b border-outline-variant/20 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-secondary font-bold">
                  Requisition Overview
                </span>
                <span className="text-xs text-on-surface-variant">
                  Posted {selectedJob.postedDaysAgo}d ago
                </span>
              </div>
              <h2 className="font-display text-xl font-bold text-on-surface mt-1">
                {selectedJob.title}
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {selectedJob.companyName} • {selectedJob.department}
              </p>
            </div>

            {/* AI 7-Factor Explainable Match Scorecard */}
            <div className="p-4 rounded-xl bg-slate-950 text-white border border-cyan-500/30 shadow-quantum">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
                <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-mono font-bold">
                  <span className="material-symbols-outlined text-sm">psychology</span>
                  <span>7-Factor Match Breakdown</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold text-sm">
                  {activeMatch.totalScore}%
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Technical Competencies (35%):</span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {activeMatch.formulaWeights.technicalSkill.score} / 35
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Experience Alignment (20%):</span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {activeMatch.formulaWeights.experienceRelevance.score} / 20
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Assessment & Credentials (10%):</span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {activeMatch.formulaWeights.assessmentPerformance.score} / 10
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800 leading-relaxed">
                {activeMatch.explainableSummary}
              </p>
            </div>

            {/* Required Skills Checklist */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-2 font-bold">
                Required Competencies:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedJob.requiredSkills.map((skill, i) => {
                  const hasSkill = activeMatch.matchedSkills.includes(skill);
                  return (
                    <span
                      key={i}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-medium ${
                        hasSkill
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {hasSkill ? '✓ ' : '! '}
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Responsibilities */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-2 font-bold">
                Core Deliverables:
              </h4>
              <ul className="list-disc pl-4 space-y-1 text-xs text-on-surface-variant">
                {selectedJob.responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Action CTA */}
            <div className="pt-4 border-t border-outline-variant/20 flex flex-col sm:flex-row gap-3">
              {appliedJobs.includes(selectedJob.id) ? (
                <div className="w-full py-3 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 text-center font-bold text-xs font-mono">
                  ✓ Application Submitted &amp; Verified in ATS
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setApplicationModalOpen(true)}
                    className="flex-1 py-3 rounded-xl bg-secondary hover:bg-blue-700 text-white font-title text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95"
                  >
                    Direct ATS Fast-Track Apply
                  </button>
                  <Link
                    href={`/app/nexa`}
                    className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">smart_toy</span>
                    <span>Audit Fit with NEXA</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {applicationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-surface-container-lowest p-6 border border-outline-variant/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">verified_user</span>
                <h3 className="font-headline text-lg font-bold text-on-surface">
                  Confirm Application Submission
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setApplicationModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              You are about to submit your verified profile credentials, test assessment records, and <strong>{activeMatch.totalScore}% match scorecard</strong> to <strong>{selectedJob.companyName}</strong> for the position of <strong>{selectedJob.title}</strong>.
            </p>

            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs space-y-1">
              <div><strong>Applicant:</strong> {MOCK_CANDIDATE.name}</div>
              <div><strong>Compensation Range:</strong> {selectedJob.salaryRange}</div>
              <div><strong>DPDP Compliance:</strong> Tier-1 Enterprise Consent Verified</div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setApplicationModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-5 py-2 rounded-lg bg-secondary text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-md"
              >
                Confirm &amp; Authorize Submission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

