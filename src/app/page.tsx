'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_JOBS, MOCK_COURSES, MOCK_CANDIDATE } from '@/lib/mockData';

export default function MarketplaceHomePage() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'courses'>('jobs');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('Bangalore, IN & Global Remote');

  const filteredJobs = MOCK_JOBS.filter(
    (j) =>
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full pt-16 flex flex-col bg-surface min-h-screen">
      {/* =================================================================== */}
      {/* HERO EXECUTIVE DISCOVERY DECK */}
      {/* =================================================================== */}
      <section className="relative w-full overflow-hidden bg-surface-container-low py-12 md:py-16 border-b border-outline-variant/20">
        <div className="pointer-events-none absolute -top-40 right-10 h-96 w-96 rounded-full bg-secondary-fixed opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-12 h-80 w-80 rounded-full bg-surface-container-highest opacity-70 blur-3xl" />

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Overline + Micro Badging */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-highest px-3.5 py-1 text-xs text-secondary font-semibold border border-secondary/20">
              <span className="material-symbols-outlined text-sm text-secondary">verified</span>
              Enterprise Precision Exchange v4.8
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant font-mono">
              <span className="inline-block h-2 w-2 rounded-full bg-secondary animate-pulse" />
              Real-time algorithmic skill mapping active
            </span>
          </div>

          {/* Main Headline Assembly */}
          <div className="mb-8 max-w-3xl">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-on-surface font-extrabold tracking-tight leading-tight">
              Where Tier-1 Talent &amp; Accredited Mastery Converge.
            </h1>
            <p className="mt-3 text-base sm:text-lg text-on-surface-variant leading-relaxed">
              Cross-indexed recruitment marketplace connecting pre-vetted senior professionals with 850+ global enterprise partners, powered by deterministic AI skill verification.
            </p>
          </div>

          {/* Dual Command Console */}
          <div className="rounded-xl bg-surface-container-lowest p-4 sm:p-6 shadow-xl border border-outline-variant/30">
            {/* Tabs */}
            <div className="mb-4 flex items-center justify-between border-b border-surface-container pb-3">
              <div className="inline-flex rounded-lg bg-surface-container p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('jobs')}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                    activeTab === 'jobs'
                      ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-secondary text-lg">work</span>
                  Find Verified Jobs
                  <span className="rounded bg-secondary/10 px-1.5 py-0.5 text-xs text-secondary font-mono">
                    42.4k
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('courses')}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                    activeTab === 'courses'
                      ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">school</span>
                  Explore Certified Courses
                  <span className="rounded bg-surface-container-high px-1.5 py-0.5 text-xs text-on-surface-variant font-mono">
                    1,240
                  </span>
                </button>
              </div>

              <div className="hidden lg:flex items-center gap-4 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-secondary">bolt</span>
                  Direct ATS Sync
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-secondary">encrypted</span>
                  DPDP Protected
                </span>
              </div>
            </div>

            {/* Input Row */}
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <label className="mb-1 block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Role / Skill Matrix
                </label>
                <div className="flex items-center rounded-lg bg-surface-container-low px-3 py-2 border border-outline-variant/30">
                  <span className="material-symbols-outlined text-on-surface-variant text-lg">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Distributed Systems, PyTorch, Go"
                    className="w-full bg-transparent px-2 text-sm text-on-surface focus:outline-none"
                  />
                </div>
              </div>

              <div className="lg:col-span-4">
                <label className="mb-1 block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Location / Ecosystem
                </label>
                <div className="flex items-center rounded-lg bg-surface-container-low px-3 py-2 border border-outline-variant/30">
                  <span className="material-symbols-outlined text-on-surface-variant text-lg">location_on</span>
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="w-full bg-transparent px-2 text-sm text-on-surface focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-end lg:col-span-3">
                <Link
                  href="/jobs"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-on-primary shadow-md hover:bg-slate-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">search</span>
                  <span>Explore Requisitions</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* QUANTUM ROBOT SPOTLIGHT BANNER */}
      {/* =================================================================== */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white border border-cyan-500/30 shadow-quantum overflow-hidden">
          <div className="pointer-events-none absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                  NEXA Quantum Intelligence Entity
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                Let an AI Robot Navigate Your Career &amp; Hiring
              </h2>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                Step into the Quantum AI Command Center. Ask NEXA to audit your resume, calculate exact 7-factor job compatibility, formulate 90-day learning roadmaps, or filter candidate batches.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link
                href="/app/nexa"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-quantum hover:brightness-110 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">smart_toy</span>
                <span>Open Command Center</span>
              </Link>
              <Link
                href="/jobs"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono font-semibold transition-colors text-center"
              >
                Browse All Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* FEATURED OPPORTUNITIES SECTION */}
      {/* =================================================================== */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-headline text-2xl font-bold text-on-surface">
              Featured Enterprise Requisitions
            </h2>
            <p className="text-sm text-on-surface-variant">
              Pre-vetted positions with deterministic match percentages calculated for your profile
            </p>
          </div>
          <Link
            href="/jobs"
            className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1"
          >
            <span>View all 42.4k jobs</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.slice(0, 6).map((job) => (
            <div
              key={job.id}
              className="rounded-xl bg-surface-container-lowest p-5 border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Header: Company + AI Match Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={job.companyLogo}
                      alt={job.companyName}
                      className="w-10 h-10 rounded-lg object-cover border border-outline-variant/20"
                    />
                    <div>
                      <h3 className="font-title text-base font-bold text-on-surface leading-tight">
                        {job.title}
                      </h3>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                        <span>{job.companyName}</span>
                        {job.isVerifiedEnterprise && (
                          <span className="material-symbols-outlined text-xs text-emerald-600">
                            verified
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {job.matchScore && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold shrink-0">
                      <span className="material-symbols-outlined text-xs text-blue-600">
                        psychology
                      </span>
                      {job.matchScore}% Match
                    </span>
                  )}
                </div>

                <p className="text-xs text-on-surface-variant line-clamp-2 mb-3 leading-relaxed">
                  {job.description}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {job.requiredSkills.slice(0, 4).map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-surface-container text-on-surface text-[11px] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.requiredSkills.length > 4 && (
                    <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant text-[11px]">
                      +{job.requiredSkills.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Footer info & CTA */}
              <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-on-surface">{job.salaryRange.split('/')[0]}</span>
                  <span className="text-on-surface-variant text-[11px] block">{job.location}</span>
                </div>
                <Link
                  href={`/jobs?selected=${job.id}`}
                  className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-colors"
                >
                  Inspect Fit ↗
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* ACCREDITED ENTERPRISE COURSES SECTION */}
      {/* =================================================================== */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-headline text-2xl font-bold text-on-surface">
              Accredited Masterclasses &amp; DRM Lab Curriculum
            </h2>
            <p className="text-sm text-on-surface-variant">
              Taught by verified industry fellows with automated code assessments &amp; DPDP certificates
            </p>
          </div>
          <Link
            href="/student"
            className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1"
          >
            <span>Explore full academy</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_COURSES.slice(0, 3).map((course) => (
            <div
              key={course.id}
              className="rounded-xl bg-surface-container-lowest overflow-hidden border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-cyan-300 font-mono text-xs font-semibold border border-cyan-500/30">
                    ★ {course.rating} ({course.reviewsCount})
                  </div>
                  <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-black/70 text-white text-[11px] font-mono">
                    {course.durationHours} Hours • {course.lessonsCount} Modules
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-secondary font-semibold">
                    {course.level} Specialization
                  </span>
                  <h3 className="font-title text-base font-bold text-on-surface mt-1 line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    By <strong>{course.instructorName}</strong>
                  </p>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mt-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-outline-variant/20 pt-3">
                <span className="font-bold text-on-surface text-base">
                  ${course.price}
                </span>
                <Link
                  href="/lms/player"
                  className="px-3.5 py-1.5 rounded-lg bg-secondary text-on-secondary text-xs font-semibold hover:bg-blue-700 transition-colors"
                >
                  Launch Player ↗
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

