'use client';

import React from 'react';

interface HolographicPanelProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'violet' | 'emerald' | 'amber';
  title?: string;
  subtitle?: string;
  badge?: string;
  icon?: string;
  compact?: boolean;
}

export const HolographicPanel: React.FC<HolographicPanelProps> = ({
  children,
  className = '',
  glowColor = 'cyan',
  title,
  subtitle,
  badge,
  icon,
  compact = false,
}) => {
  const borderStyles = {
    cyan: 'border-cyan-500/20 hover:border-cyan-500/40 shadow-quantum',
    violet: 'border-purple-500/20 hover:border-purple-500/40 shadow-quantum-violet',
    emerald: 'border-emerald-500/20 hover:border-emerald-500/40',
    amber: 'border-amber-500/20 hover:border-amber-500/40',
  }[glowColor];

  const headerColors = {
    cyan: 'text-cyan-300',
    violet: 'text-purple-300',
    emerald: 'text-emerald-300',
    amber: 'text-amber-300',
  }[glowColor];

  return (
    <div
      className={`relative rounded-xl bg-slate-950/75 backdrop-blur-xl border ${borderStyles} transition-all duration-300 overflow-hidden ${
        compact ? 'p-3' : 'p-5'
      } ${className}`}
    >
      {/* Subtle corner light accents */}
      <div className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full bg-cyan-500/10 blur-xl"></div>
      <div className="pointer-events-none absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-violet-500/10 blur-xl"></div>

      {/* Header */}
      {(title || badge || icon) && (
        <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2.5">
          <div className="flex items-center gap-2">
            {icon && (
              <span className={`material-symbols-outlined text-lg ${headerColors}`}>
                {icon}
              </span>
            )}
            <div>
              {title && (
                <h3 className="font-display text-sm font-semibold text-slate-100 tracking-tight">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="font-body text-xs text-slate-400">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

