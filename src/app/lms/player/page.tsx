'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { MOCK_LESSONS, MOCK_COURSES } from '@/lib/mockData';
import { QuantumRobot3D } from '@/components/quantum/QuantumRobot3D';
import { RobotState } from '@/types';

export default function SecureLmsPlayerPage() {
  const [currentLesson, setCurrentLesson] = useState(MOCK_LESSONS[0]);
  const [activeTab, setActiveTab] = useState<'ai-mentor' | 'notes' | 'transcript'>('ai-mentor');
  const [assistantMessages, setAssistantMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: `Hello Devin! I am **NEXA Pedagogical Mentor** for *${currentLesson.title}*. Ask me to explain the FLP theorem, dissect the Raft heartbeat implementation, or generate a 3-question mastery quiz!`,
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [robotState, setRobotState] = useState<RobotState>('IDLE');
  const [quizActive, setQuizActive] = useState(false);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number>>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleSendMessage = (queryText?: string) => {
    const text = queryText || userInput;
    if (!text.trim()) return;

    setAssistantMessages((prev) => [...prev, { role: 'user', text }]);
    setUserInput('');
    setRobotState('THINKING');

    setTimeout(() => {
      setRobotState('RESPONDING');
      let reply = '';

      if (text.toLowerCase().includes('quiz') || text.toLowerCase().includes('practice')) {
        setQuizActive(true);
        reply = `### 📝 Interactive Mastery Quiz Generated\n\nI have synthesized 2 verification questions based on the lesson's coverage of the FLP theorem and Raft election timers:`;
      } else if (text.toLowerCase().includes('summar') || text.toLowerCase().includes('concept')) {
        reply = `### 📌 Lesson Concept Summary\n\n- **Core Principle:** ${currentLesson.summary}\n- **Key Equation/Law:** FLP Impossibility Theorem states deterministic asynchronous consensus cannot guarantee termination with crash faults.\n- **Practical Mitigation:** Raft uses partial synchrony and randomized heartbeats (150ms-300ms) to ensure safety and eventual liveness.`;
      } else {
        reply = `### 💡 In-Depth Explanation\n\nUnder **${currentLesson.title}**, Raft leaders prevent stale followers from declaring split-brain terms by continuously streaming empty \`AppendEntries\` RPCs within the heartbeat threshold. If a follower misses 2 consecutive windows, it increments the term and transitions to Candidate state.`;
      }

      setAssistantMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
      setTimeout(() => setRobotState('IDLE'), 2500);
    }, 600);
  };

  return (
    <div className="w-full pt-16 flex flex-col bg-slate-950 text-slate-100 min-h-screen">
      {/* Player Header Bar */}
      <div className="bg-slate-900/80 border-b border-cyan-500/20 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/student"
            className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Portal
          </Link>
          <span className="text-slate-600">|</span>
          <div>
            <h1 className="text-sm font-bold text-white truncate max-w-md sm:max-w-xl">
              {MOCK_COURSES[0].title}
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Lesson: {currentLesson.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
            <span className="material-symbols-outlined text-xs">lock</span>
            DRM Encrypted Stream
          </span>
          <Link
            href="/app/nexa"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">smart_toy</span>
            <span>Launch Full NEXA</span>
          </Link>
        </div>
      </div>

      {/* Main Workspace Split: Video on Left, Syllabus/NEXA on Right */}
      <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* Left Column: DRM Video Stage & Transcript (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col p-4 sm:p-6 gap-4 overflow-y-auto">
          {/* DRM Player Viewport with Dynamic Watermarking */}
          <div className="relative rounded-2xl bg-black border border-cyan-500/30 overflow-hidden shadow-2xl aspect-video flex items-center justify-center group">
            <video
              ref={videoRef}
              src={currentLesson.videoUrl}
              controls
              className="w-full h-full object-cover"
              poster={MOCK_COURSES[0].thumbnailUrl}
            />

            {/* Dynamic Moving DRM Watermark (Prevents Screen Recording / Piracy) */}
            <div className="pointer-events-none absolute top-4 left-4 z-20 px-3 py-1 rounded bg-black/60 border border-cyan-500/20 text-[10px] font-mono text-cyan-400/80 backdrop-blur-sm">
              <span>NX-DRM • DEVIN THORNE (USR-9482) • COMPLIANT</span>
            </div>
          </div>

          {/* Lesson Metadata & Quick Action Bar */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400">
                Active Module
              </span>
              <h2 className="text-base font-bold text-white">{currentLesson.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Duration: {currentLesson.durationMinutes} Minutes • Raft State Concurrency
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSendMessage('Summarize key concepts')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono transition-colors"
              >
                Summarize Key Concepts
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage('Generate practice quiz questions')}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-colors"
              >
                Generate Practice Quiz
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Embedded Compact NEXA Mentor Assistant (4 Cols) */}
        <aside className="lg:col-span-4 flex flex-col bg-slate-950 border-l border-slate-900 h-[calc(100vh-6rem)]">
          {/* Top Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-900/60 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('ai-mentor')}
              className={`flex-1 py-3 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                activeTab === 'ai-mentor'
                  ? 'border-cyan-400 text-cyan-300 font-bold bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-sm">psychology</span>
              <span>NEXA Mentor</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-3 text-center transition-colors border-b-2 ${
                activeTab === 'notes'
                  ? 'border-cyan-400 text-cyan-300 font-bold bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Notes
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('transcript')}
              className={`flex-1 py-3 text-center transition-colors border-b-2 ${
                activeTab === 'transcript'
                  ? 'border-cyan-400 text-cyan-300 font-bold bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Transcript
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeTab === 'ai-mentor' && (
              <>
                {/* Mini 3D Robot Head representation */}
                <div className="h-36 w-full rounded-xl bg-slate-900/80 border border-cyan-500/20 overflow-hidden relative mb-2">
                  <QuantumRobot3D state={robotState} className="w-full h-full" />
                </div>

                {/* Conversation Stream */}
                <div className="space-y-3">
                  {assistantMessages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl text-xs leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-blue-600/30 border border-blue-500/40 text-white ml-6'
                          : 'bg-slate-900/90 border border-cyan-500/20 text-slate-200'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{m.text}</div>
                    </div>
                  ))}

                  {/* Interactive Practice Quiz widget */}
                  {quizActive && currentLesson.quizQuestions && (
                    <div className="p-4 rounded-xl bg-slate-900 border border-violet-500/30 text-xs space-y-3 shadow-quantum-violet">
                      <div className="flex items-center justify-between text-violet-300 font-mono font-bold">
                        <span>Lesson Mastery Check</span>
                        <span>2 Questions</span>
                      </div>

                      {currentLesson.quizQuestions.map((q, qIdx) => (
                        <div key={qIdx} className="space-y-1.5 pt-2 border-t border-slate-800">
                          <p className="font-semibold text-white">{qIdx + 1}. {q.question}</p>
                          <div className="space-y-1">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = selectedQuizAnswers[qIdx] === optIdx;
                              const isCorrect = optIdx === q.correctIndex;
                              const showFeedback = selectedQuizAnswers[qIdx] !== undefined;

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() =>
                                    setSelectedQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))
                                  }
                                  className={`w-full text-left p-2 rounded text-[11px] transition-colors border ${
                                    isSelected
                                      ? isCorrect
                                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                                        : 'bg-rose-950/60 border-rose-500 text-rose-200'
                                      : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                          {selectedQuizAnswers[qIdx] !== undefined && (
                            <p className="text-[10px] text-cyan-300 pt-1 font-mono">
                              {q.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'transcript' && (
              <div className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                {currentLesson.transcript}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-2">
                <textarea
                  rows={8}
                  placeholder="Type personal timestamped notes here (persisted in DPDP vault)..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  className="w-full py-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold hover:bg-cyan-500/30"
                >
                  Save Timestamped Note
                </button>
              </div>
            )}
          </div>

          {/* Quick Input Bar */}
          {activeTab === 'ai-mentor' && (
            <div className="p-3 border-t border-slate-800 bg-slate-900/80">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ask NEXA about this video..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-mono font-bold"
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

