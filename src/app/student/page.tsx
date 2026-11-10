'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_COURSES, MOCK_CANDIDATE, MOCK_CAREER_PLAN } from '@/lib/mockData';

export default function StudentDashboardPage() {
  const [activeCourseTab, setActiveCourseTab] = useState<'in-progress' | 'completed'>('in-progress');

  return (
    <div className="w-full pt-16 flex flex-col bg-surface min-h-screen">
      {/* Header Profile Ribbon */}
      <div className="bg-surface-container-lowest border-b border-outline-variant/30 py-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={MOCK_CANDIDATE.avatarUrl}
              alt={MOCK_CANDIDATE.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-secondary"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline text-xl sm:text-2xl font-bold text-on-surface">
                  {MOCK_CANDIDATE.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  Verified Learner
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Targeting: <strong className="text-secondary">{MOCK_CAREER_PLAN.targetTitle}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/app/nexa"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:bg-slate-800 text-xs font-mono font-bold transition-all shadow-quantum-subtle"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>NEXA Study Advisor</span>
            </Link>
            <Link
              href="/lms/player"
              className="px-4 py-2 rounded-xl bg-secondary text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
            >
              Resume Course Player ↗
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Enrolled Courses & Skill Mastery */}
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Learning Progress & Active Modules */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Active Enrollment Banner */}
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-secondary font-bold">
                  Active DRM Course
                </span>
                <h2 className="font-headline text-lg font-bold text-on-surface mt-0.5">
                  {MOCK_COURSES[0].title}
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Instructor: {MOCK_COURSES[0].instructorName}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-secondary bg-secondary-fixed px-3 py-1 rounded-full">
                68% Completed
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-surface-container rounded-full h-2 mb-4 overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: '68%' }} />
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-on-surface-variant font-mono">
                Current Lesson: Module 2: Raft Election Concurrency
              </span>
              <Link
                href="/lms/player"
                className="px-4 py-2 rounded-lg bg-secondary text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                Continue Watching ↗
              </Link>
            </div>
          </div>

          {/* Catalog of Courses */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline text-base font-bold text-on-surface">
                My Learning Pathways &amp; Certifications
              </h3>
              <div className="flex rounded-lg bg-surface-container p-0.5 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveCourseTab('in-progress')}
                  className={`px-3 py-1 rounded ${
                    activeCourseTab === 'in-progress'
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                      : 'text-on-surface-variant'
                  }`}
                >
                  In Progress (2)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCourseTab('completed')}
                  className={`px-3 py-1 rounded ${
                    activeCourseTab === 'completed'
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                      : 'text-on-surface-variant'
                  }`}
                >
                  Completed (4)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_COURSES.slice(1, 3).map((course) => (
                <div
                  key={course.id}
                  className="rounded-xl bg-surface-container-lowest border border-outline-variant/30 p-4 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-32 rounded-lg object-cover mb-3"
                    />
                    <h4 className="font-title text-sm font-bold text-on-surface line-clamp-1">
                      {course.title}
                    </h4>
                    <p className="text-xs text-on-surface-variant mt-1">
                      {course.instructorName} • {course.durationHours} hrs
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                    <span className="text-xs font-mono text-secondary font-bold">
                      Verified Syllabus
                    </span>
                    <Link
                      href="/lms/player"
                      className="text-xs font-semibold text-secondary hover:underline"
                    >
                      Open Lesson ↗
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Skill Radar & 14-Month Career Constellation */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Career Path Status Card */}
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-secondary font-bold">
                14-Month Career Track
              </span>
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                On Schedule
              </span>
            </div>

            <div className="space-y-3">
              {MOCK_CAREER_PLAN.milestones.map((m) => (
                <div
                  key={m.order}
                  className={`p-3 rounded-lg border text-xs ${
                    m.completed
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-surface-container-low border-outline-variant/20 text-on-surface'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>
                      {m.completed ? '✓ ' : `${m.order}. `}
                      {m.title}
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-mono">
                      {m.timeframe}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    Role: <strong>{m.roleTarget}</strong> ({m.salaryBenchmark})
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/app/nexa"
              className="mt-4 w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">psychology</span>
              <span>Ask NEXA to Update Plan</span>
            </Link>
          </div>

          {/* Verified Skill Portfolio */}
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-5 shadow-sm">
            <h4 className="text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-3 font-bold">
              Verified Credential Portfolio:
            </h4>
            <div className="space-y-2">
              {MOCK_CANDIDATE.skills.slice(0, 5).map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/10"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-secondary">
                      verified
                    </span>
                    <span className="font-semibold text-on-surface">{s.name}</span>
                  </div>
                  <span className="font-mono text-xs text-on-surface-variant font-bold">
                    {s.tier}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

