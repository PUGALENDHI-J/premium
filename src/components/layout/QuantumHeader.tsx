'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const QuantumHeader: React.FC = () => {
  const pathname = usePathname();

  const isQuantumPage = pathname.startsWith('/app/nexa');

  const navItems = [
    { label: 'Public Marketplace', href: '/' },
    { label: 'Find Jobs', href: '/jobs' },
    { label: 'Student Portal', href: '/student' },
    { label: 'DRM Course Player', href: '/lms/player' },
    { label: 'Recruiter ATS', href: '/employer' },
    { label: 'Curriculum Studio', href: '/instructor' },
    { label: 'Admin Console', href: '/admin' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        isQuantumPage
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/20 text-slate-100 shadow-quantum-subtle'
          : 'bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 text-on-surface shadow-[0_1px_8px_rgba(0,0,0,0.04)]'
      }`}
    >
      {/* Top Bar */}
      <div className="h-16 w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 flex items-center justify-center text-white shadow-quantum font-bold text-lg">
              QX
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm tracking-tight uppercase leading-none">
                NEXATALENT <span className="text-cyan-400">QX</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider">
                Quantum Intelligence
              </span>
            </div>
          </Link>

          {/* AI Command Center Highlight Link */}
          <Link
            href="/app/nexa"
            className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold transition-all ${
              isQuantumPage
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-quantum'
                : 'bg-slate-900 text-cyan-300 hover:bg-slate-800 border border-cyan-500/30'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>NEXA AI COMMAND CENTER</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* AI Skill Match Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-cyan-950/60 dark:text-cyan-300 border border-blue-200 dark:border-cyan-500/30 text-xs font-semibold">
            <span className="material-symbols-outlined text-sm text-blue-600 dark:text-cyan-400">
              psychology
            </span>
            <span>AI Skill Match 98%</span>
          </div>

          {/* Search Trigger */}
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs border border-slate-200 dark:border-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-base">search</span>
            <span className="hidden sm:inline">Search requisitions, skills...</span>
            <kbd className="hidden md:inline px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono">
              ⌘K
            </kbd>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold leading-tight">Devin Thorne</span>
              <span className="text-[10px] text-slate-400 font-mono">Staff Architect</span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&q=80"
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover border border-cyan-400/40"
            />
          </div>
        </div>
      </div>

      {/* Sub-bar Ecosystem Workspace Tabs */}
      <div
        className={`w-full px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between overflow-x-auto text-xs ${
          isQuantumPage
            ? 'bg-slate-950 border-t border-slate-900 text-slate-400'
            : 'bg-surface-container-low border-t border-outline-variant/20 text-on-surface-variant'
        }`}
      >
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mr-2">
            Workspaces:
          </span>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2.5 py-1 rounded font-body text-xs transition-colors shrink-0 ${
                    active
                      ? isQuantumPage
                        ? 'bg-cyan-500/20 text-cyan-200 font-semibold'
                        : 'bg-surface-container-highest text-on-surface font-semibold'
                      : 'hover:text-cyan-400 hover:bg-slate-800/40'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-slate-400 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>DPDP Tier-1 Verified</span>
        </div>
      </div>
    </header>
  );
};

