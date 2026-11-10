'use client';

import React, { useState } from 'react';
import { AIMessageItem, AIActionItem } from '@/types';
import { AgentRegistryService } from '@/services/ai/AgentRegistryService';

interface AIResponseRendererProps {
  message: AIMessageItem;
  onActionConfirm?: (action: AIActionItem, decision: 'APPROVED' | 'REJECTED') => void;
}

export const AIResponseRenderer: React.FC<AIResponseRendererProps> = ({
  message,
  onActionConfirm,
}) => {
  const [showThought, setShowThought] = useState(false);
  const [actionStates, setActionStates] = useState<Record<string, 'APPROVED' | 'REJECTED'>>({});

  const agent = message.agentCode ? AgentRegistryService.getAgent(message.agentCode) : null;
  const matchCard = message.metadata?.matchCard;
  const gapAnalysis = message.metadata?.gapAnalysis;
  const careerPlan = message.metadata?.careerPlan;

  const handleAction = (action: AIActionItem, decision: 'APPROVED' | 'REJECTED') => {
    setActionStates((prev) => ({ ...prev, [action.id]: decision }));
    if (onActionConfirm) {
      onActionConfirm(action, decision);
    }
  };

  return (
    <div className="w-full flex flex-col gap-3 text-slate-100">
      {/* Agent Identity Bar */}
      {agent && (
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-950"
              style={{ backgroundColor: agent.avatarColor }}
            >
              N
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              {agent.name}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
              {agent.tagline}
            </span>
          </div>

          {message.thoughtProcess && (
            <button
              type="button"
              onClick={() => setShowThought(!showThought)}
              className="flex items-center gap-1 text-[11px] font-mono text-cyan-400/80 hover:text-cyan-300 transition-colors"
            >
              <span className="material-symbols-outlined text-xs">psychology</span>
              <span>{showThought ? 'Hide Reasoning' : 'View Reasoning'}</span>
            </button>
          )}
        </div>
      )}

      {/* Thought Process Disclosure */}
      {showThought && message.thoughtProcess && (
        <div className="p-3 rounded-lg bg-slate-950/90 border border-violet-500/20 text-xs font-mono text-violet-300">
          <div className="flex items-center gap-1.5 text-violet-400 font-semibold mb-1">
            <span className="material-symbols-outlined text-sm">neurology</span>
            NEXA Reasoning & Policy Boundary
          </div>
          <p className="text-violet-200/80 leading-relaxed">{message.thoughtProcess}</p>
        </div>
      )}

      {/* Main Formatted Text */}
      <div className="prose prose-invert prose-sm max-w-none text-slate-200 space-y-2 leading-relaxed">
        {message.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h4 key={idx} className="text-base font-bold text-cyan-300 mt-2 mb-1">
                {paragraph.replace('### ', '')}
              </h4>
            );
          }
          if (paragraph.startsWith('- ')) {
            return (
              <ul key={idx} className="list-disc pl-4 space-y-1 text-xs">
                {paragraph.split('\n').map((li, liIdx) => (
                  <li key={liIdx}>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: li
                          .replace('- ', '')
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                          .replace(/`(.*?)`/g, '<code class="text-cyan-300 bg-slate-900 px-1 rounded">$1</code>'),
                      }}
                    />
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p
              key={idx}
              className="text-xs sm:text-sm text-slate-300"
              dangerouslySetInnerHTML={{
                __html: paragraph
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                  .replace(/`(.*?)`/g, '<code class="text-cyan-300 bg-slate-900 px-1 rounded">$1</code>'),
              }}
            />
          );
        })}
      </div>

      {/* 7-Factor Explainable Talent Match Card */}
      {matchCard && (
        <div className="mt-2 p-4 rounded-xl bg-slate-950/90 border border-cyan-500/30 shadow-quantum">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                Auditable Match Engine v4.8
              </span>
              <h4 className="text-sm font-bold text-white">{matchCard.jobTitle}</h4>
              <p className="text-xs text-slate-400">{matchCard.companyName}</p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-baseline gap-1 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-lg">
                {matchCard.totalScore}%
                <span className="text-[10px] text-cyan-400/80 font-normal">Score</span>
              </div>
            </div>
          </div>

          {/* 7-Factor Weights Breakdown */}
          <div className="space-y-2 mb-3">
            <span className="text-[11px] font-mono uppercase text-slate-400">
              7-Factor Formula Breakdown:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <div className="flex justify-between text-slate-300">
                  <span>1. Technical Skill Match (35%)</span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {matchCard.formulaWeights.technicalSkill.score} / 35
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full rounded-full"
                    style={{
                      width: `${(matchCard.formulaWeights.technicalSkill.score / 35) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <div className="flex justify-between text-slate-300">
                  <span>2. Experience Relevance (20%)</span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {matchCard.formulaWeights.experienceRelevance.score} / 20
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-sky-400 h-full rounded-full"
                    style={{
                      width: `${(matchCard.formulaWeights.experienceRelevance.score / 20) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <div className="flex justify-between text-slate-300">
                  <span>3. Education & Credentials (10%)</span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {matchCard.formulaWeights.educationQualifications.score} / 10
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-400 h-full rounded-full"
                    style={{
                      width: `${(matchCard.formulaWeights.educationQualifications.score / 10) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <div className="flex justify-between text-slate-300">
                  <span>4. Domain Relevance (10%)</span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {matchCard.formulaWeights.domainRelevance.score} / 10
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-purple-400 h-full rounded-full"
                    style={{
                      width: `${(matchCard.formulaWeights.domainRelevance.score / 10) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <div className="flex justify-between text-slate-300">
                  <span>5. Assessment Verification (10%)</span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {matchCard.formulaWeights.assessmentPerformance.score} / 10
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full"
                    style={{
                      width: `${(matchCard.formulaWeights.assessmentPerformance.score / 10) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <div className="flex justify-between text-slate-300">
                  <span>6. Location & Prefs (5%) + Role (10%)</span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {matchCard.formulaWeights.locationPreferences.score + matchCard.formulaWeights.roleRequirements.score} / 15
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-teal-400 h-full rounded-full"
                    style={{
                      width: `${((matchCard.formulaWeights.locationPreferences.score + matchCard.formulaWeights.roleRequirements.score) / 15) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Matched vs Missing skills */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-emerald-400 font-semibold">Matched Competencies:</span>
              {matchCard.matchedSkills.map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                >
                  ✓ {s}
                </span>
              ))}
            </div>
            {matchCard.missingSkills.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-amber-400 font-semibold">Skill Deficits:</span>
                {matchCard.missingSkills.map((s, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  >
                    ! {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Skill Gap Bridge Courses Card */}
      {gapAnalysis && (
        <div className="mt-2 p-4 rounded-xl bg-slate-950/90 border border-violet-500/30 shadow-quantum-violet">
          <div className="flex items-center justify-between border-b border-violet-500/20 pb-2 mb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400">
                Skill Bridge Intelligence
              </span>
              <h4 className="text-sm font-bold text-white">Recommended Course Pathway</h4>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-violet-300">
                Bridge Hours: ~{gapAnalysis.estimatedTotalHours} hrs
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {gapAnalysis.gaps.map((gap, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-white">{gap.skill}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.2 rounded ${
                        gap.importance === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {gap.importance}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Course: <strong className="text-cyan-300">{gap.bridgeCourseTitle}</strong> (~{gap.bridgeDurationHours}h)
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    +{gap.potentialMatchDelta}% Match
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Career Roadmap Visualization */}
      {careerPlan && (
        <div className="mt-2 p-4 rounded-xl bg-slate-950/90 border border-cyan-500/30">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
              Strategic Career Constellation
            </span>
            <span className="text-xs font-mono text-emerald-400">
              Demand: {careerPlan.marketDemandTier}
            </span>
          </div>

          <div className="space-y-3">
            {careerPlan.milestones.map((m) => (
              <div
                key={m.order}
                className={`p-3 rounded-lg border ${
                  m.completed
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-900/70 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                        m.completed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {m.completed ? '✓' : m.order}
                    </span>
                    <span className="font-semibold text-xs text-white">{m.title}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{m.timeframe}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                  <span>Target: <strong className="text-cyan-300">{m.roleTarget}</strong></span>
                  <span>•</span>
                  <span>Benchmark: <strong className="text-emerald-400">{m.salaryBenchmark}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* High-Impact Actions Pending Confirmation */}
      {message.actionItems && message.actionItems.length > 0 && (
        <div className="mt-3 flex flex-col gap-2.5">
          {message.actionItems.map((action) => {
            const currentDecision = actionStates[action.id];

            return (
              <div
                key={action.id}
                className="p-3.5 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/40 shadow-quantum flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-cyan-400">
                      verified_user
                    </span>
                    <h5 className="text-xs font-mono font-bold uppercase text-white tracking-wide">
                      {action.title}
                    </h5>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      Requires Authorization
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    {action.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {currentDecision ? (
                    <span
                      className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg ${
                        currentDecision === 'APPROVED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {currentDecision === 'APPROVED' ? '✓ EXECUTED' : '✕ CANCELLED'}
                    </span>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAction(action, 'REJECTED')}
                        className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                      >
                        Dismiss
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(action, 'APPROVED')}
                        className="px-4 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-quantum hover:brightness-110 active:scale-95 transition-all"
                      >
                        Confirm & Execute
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

