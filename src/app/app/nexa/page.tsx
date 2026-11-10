'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { QuantumRobot3D } from '@/components/quantum/QuantumRobot3D';
import { QuantumCommandInput } from '@/components/quantum/QuantumCommandInput';
import { AIResponseRenderer } from '@/components/quantum/AIResponseRenderer';
import { VoiceInteractionController } from '@/components/quantum/VoiceInteractionController';
import { QuantumVisualizations } from '@/components/visualizations/QuantumVisualizations';
import { HolographicPanel } from '@/components/quantum/HolographicPanel';
import { AiOrchestratorService } from '@/services/ai/AiOrchestratorService';
import { AgentRegistryService } from '@/services/ai/AgentRegistryService';
import { AIMessageItem, RobotState, UserRole, AgentCode, AIActionItem } from '@/types';
import { MOCK_JOBS, MOCK_COURSES, MOCK_CANDIDATE } from '@/lib/mockData';

export default function NexaCommandCenterPage() {
  const [robotState, setRobotState] = useState<RobotState>('IDLE');
  const [selectedAgent, setSelectedAgent] = useState<AgentCode>('NEXA_CORE');
  const [userRole, setUserRole] = useState<UserRole>('CANDIDATE');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'chat' | 'visualizer'>('chat');
  const [mobileRightPanelOpen, setMobileRightPanelOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initial welcome message from NEXA
  const [messages, setMessages] = useState<AIMessageItem[]>([
    {
      id: 'init-1',
      conversationId: 'main-session',
      role: 'assistant',
      agentCode: 'NEXA_CORE',
      robotState: 'IDLE',
      content: `### ⚡ NEXA Quantum Intelligence Online\n\nWelcome to the **NexaTalent QX Command Center**. I am **NEXA**, your central quantum intelligence interface.\n\nI have pre-loaded your profile credentials (**${MOCK_CANDIDATE.name}**, ${MOCK_CANDIDATE.headline}) and indexed 42,400+ active enterprise requisitions and accredited learning pathways.\n\n**Select a recommended objective below or issue a voice or text command:**`,
      metadata: {
        suggestedPrompts: [
          'Find jobs matching my skills',
          'Analyse my resume and experience',
          'What skills am I missing?',
          'Build a 90-day career improvement plan',
        ],
        jobMatches: MOCK_JOBS.slice(0, 2),
      },
      createdAt: new Date().toISOString(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string, attachedFile?: File) => {
    if (!text.trim() && !attachedFile) return;

    // 1. Add User Message
    const userMsg: AIMessageItem = {
      id: `usr-${Date.now()}`,
      conversationId: 'main-session',
      role: 'user',
      content: text + (attachedFile ? `\n\n*[Attached Document: ${attachedFile.name}]*` : ''),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);
    setRobotState('THINKING');

    // 2. Synthesize response via AI Orchestrator
    try {
      // Simulate analysis phase briefly
      setTimeout(() => {
        setRobotState('ANALYSING');
      }, 400);

      const response = await AiOrchestratorService.processMessage(
        text,
        messages,
        userRole,
        attachedFile?.name
      );

      setMessages((prev) => [...prev, response]);
      if (response.agentCode) {
        setSelectedAgent(response.agentCode);
      }

      // Transition to RESPONDING & Speak response through TTS
      setRobotState('RESPONDING');
      setAudioLevel(0.8);

      VoiceInteractionController.speak(response.content, () => {
        setRobotState('IDLE');
        setAudioLevel(0);
      });
    } catch (err) {
      console.error(err);
      setRobotState('ERROR');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleActionConfirm = (action: AIActionItem, decision: 'APPROVED' | 'REJECTED') => {
    if (decision === 'APPROVED') {
      setRobotState('SUCCESS');
      VoiceInteractionController.speak(`Action verified and authorized: ${action.title}`);
      setTimeout(() => setRobotState('IDLE'), 3500);
    } else {
      setRobotState('WARNING');
      setTimeout(() => setRobotState('IDLE'), 2000);
    }
  };

  const agents = AgentRegistryService.getAllAgents();
  const currentAgent = AgentRegistryService.getAgent(selectedAgent);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col pt-16 overflow-x-hidden">
      {/* Sub-header / Command Center Controls Ribbon */}
      <div className="w-full bg-slate-900/60 border-b border-cyan-500/20 px-4 py-2 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-200">
              NEXA QX v4.8 Active
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <span>Agent:</span>
            <span className="text-cyan-300 font-bold">{currentAgent.name}</span>
          </div>
        </div>

        {/* View Switcher: 3D Chat vs Visualizer */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === 'chat'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3D Robot Assistant
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('visualizer')}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === 'visualizer'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Quantum Visualizer
            </button>
          </div>

          {/* Role Filter Selector */}
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            className="bg-slate-900 text-xs font-mono text-slate-300 border border-slate-700 rounded-lg px-2.5 py-1 focus:outline-none focus:border-cyan-400"
          >
            <option value="CANDIDATE">Role: Candidate</option>
            <option value="STUDENT">Role: Student</option>
            <option value="RECRUITER">Role: Recruiter</option>
            <option value="EMPLOYER">Role: Employer</option>
            <option value="INSTRUCTOR">Role: Instructor</option>
            <option value="ADMIN">Role: Super Admin</option>
          </select>

          {/* Mobile Right Panel Toggle */}
          <button
            type="button"
            onClick={() => setMobileRightPanelOpen(!mobileRightPanelOpen)}
            className="lg:hidden p-1.5 rounded-lg bg-slate-800 text-cyan-300 border border-cyan-500/30"
          >
            <span className="material-symbols-outlined text-base">dashboard</span>
          </button>
        </div>
      </div>

      {/* 3-Panel Desktop Layout */}
      <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* =================================================================== */}
        {/* LEFT PANEL: Platform Navigation, Agents, Sessions, Saved Intelligence */}
        {/* =================================================================== */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col bg-slate-950/70 border-r border-slate-900 p-4 gap-4 overflow-y-auto">
          {/* Agent Selector Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Specialized Agents
              </span>
              <span className="text-[10px] font-mono text-cyan-400">7 Active</span>
            </div>

            <div className="space-y-1">
              {agents.map((agent) => {
                const isSelected = selectedAgent === agent.code;
                return (
                  <button
                    key={agent.code}
                    type="button"
                    onClick={() => {
                      setSelectedAgent(agent.code);
                      VoiceInteractionController.speak(`Switched context to ${agent.name}`);
                    }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition-all ${
                      isSelected
                        ? 'bg-slate-900 border border-cyan-500/40 shadow-quantum text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                    }`}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: agent.avatarColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono font-bold truncate">
                        {agent.name.replace('NEXA ', '')}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {agent.tagline}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Platform Jumps */}
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 block">
              Direct Workspace Jumps
            </span>
            <div className="space-y-1 text-xs">
              <Link
                href="/jobs"
                className="flex items-center justify-between p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-900 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">work</span>
                  Enterprise Job Search
                </span>
                <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-cyan-400">
                  42.4k
                </span>
              </Link>
              <Link
                href="/student"
                className="flex items-center justify-between p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-900 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">school</span>
                  Student Learning Portal
                </span>
                <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-cyan-400">
                  Active
                </span>
              </Link>
              <Link
                href="/lms/player"
                className="flex items-center justify-between p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-900 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">smart_display</span>
                  DRM Course Video Player
                </span>
                <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-emerald-400">
                  Shielded
                </span>
              </Link>
              <Link
                href="/employer"
                className="flex items-center justify-between p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-900 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">business_center</span>
                  Recruiter ATS Operations
                </span>
                <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-cyan-400">
                  14 Req
                </span>
              </Link>
              <Link
                href="/instructor"
                className="flex items-center justify-between p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-900 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">palette</span>
                  Curriculum Studio
                </span>
              </Link>
            </div>
          </div>

          {/* Privacy & Governance Shield Badge */}
          <div className="mt-auto p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-cyan-400 font-bold text-[10px] uppercase">
                DPDP Tier-1 Shield
              </span>
              <span className="material-symbols-outlined text-sm text-emerald-400">
                verified
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Audit trails encrypted. No private records exposed to public models.
            </p>
          </div>
        </aside>

        {/* =================================================================== */}
        {/* CENTER PANEL: Large 3D Robot + AI Conversation Stream + Input */}
        {/* =================================================================== */}
        <main className="col-span-1 lg:col-span-6 flex flex-col h-[calc(100vh-6rem)] relative bg-radial-gradient">
          {activeTab === 'chat' ? (
            <>
              {/* Upper Section: 3D Robot Viewport */}
              <div className="relative h-[320px] sm:h-[360px] w-full shrink-0 border-b border-cyan-500/20 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950">
                <QuantumRobot3D
                  state={robotState}
                  audioLevel={audioLevel}
                  onStateChange={(s) => setRobotState(s)}
                  className="w-full h-full"
                />

                {/* State Controls Ribbon for instant demo */}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-[10px] font-mono">
                  <span className="text-slate-400 px-1">Simulate State:</span>
                  {(['IDLE', 'LISTENING', 'THINKING', 'ANALYSING', 'SUCCESS', 'WARNING'] as RobotState[]).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setRobotState(st)}
                        className={`px-1.5 py-0.5 rounded transition-colors ${
                          robotState === st
                            ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {st[0]}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Middle Section: Scrollable Conversation Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <div className="max-w-[85%] rounded-2xl px-4 py-2.5 bg-gradient-to-r from-blue-700 to-cyan-600 text-white shadow-md text-xs sm:text-sm">
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      </div>
                    ) : (
                      <div className="w-full">
                        <AIResponseRenderer
                          message={msg}
                          onActionConfirm={handleActionConfirm}
                        />
                      </div>
                    )}
                  </div>
                ))}

                {isProcessing && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-cyan-500/20 text-xs font-mono text-cyan-300">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>NEXA evaluating telemetry and calculating score models...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Section: Quantum Command Input Bar */}
              <div className="p-3 sm:p-4 border-t border-cyan-500/20 bg-slate-950/90 backdrop-blur-xl">
                <QuantumCommandInput
                  onSend={handleSendMessage}
                  disabled={isProcessing}
                  suggestedPrompts={[
                    'Find jobs matching my skills',
                    'Analyse my resume and experience',
                    'What skills am I missing?',
                    'Build a 90-day career improvement plan',
                  ]}
                  placeholder="Ask NEXA anything or speak a command..."
                />
              </div>
            </>
          ) : (
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
              <QuantumVisualizations initialMode="neural-network" />
            </div>
          )}
        </main>

        {/* =================================================================== */}
        {/* RIGHT PANEL: Live Intelligence Activity, User Context, Opportunities */}
        {/* =================================================================== */}
        <aside
          className={`lg:col-span-3 flex-col bg-slate-950/70 border-l border-slate-900 p-4 gap-4 overflow-y-auto ${
            mobileRightPanelOpen ? 'flex fixed inset-y-16 right-0 w-80 z-40 bg-slate-950' : 'hidden lg:flex'
          }`}
        >
          {/* User Context Card */}
          <HolographicPanel
            title={MOCK_CANDIDATE.name}
            subtitle={MOCK_CANDIDATE.currentRole}
            badge="Verified Tier-1"
            icon="badge"
          >
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Experience:</span>
                <span className="font-mono text-cyan-300 font-bold">
                  {MOCK_CANDIDATE.yearsExperience} Years
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Overall Match Yield:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {MOCK_CANDIDATE.matchScore}% Top 2%
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Location:</span>
                <span className="text-slate-200">{MOCK_CANDIDATE.location}</span>
              </div>
            </div>
          </HolographicPanel>

          {/* Detected Skills Chips */}
          <HolographicPanel
            title="Detected Skills"
            subtitle="Extracted & verified from credentials"
            icon="psychology"
          >
            <div className="flex flex-wrap gap-1.5">
              {MOCK_CANDIDATE.skills.map((skill, i) => (
                <span
                  key={i}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                    skill.verified
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {skill.verified ? '✓ ' : ''}
                  {skill.name}
                </span>
              ))}
            </div>
          </HolographicPanel>

          {/* High-Yield Job Opportunities */}
          <HolographicPanel
            title="Matched Requisitions"
            subtitle="Calculated via 7-factor engine"
            icon="work"
          >
            <div className="space-y-2.5">
              {MOCK_JOBS.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate max-w-[170px]">
                      {job.title}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">
                      {job.matchScore}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">{job.companyName}</div>
                  <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>{job.salaryRange.split('/')[0]}</span>
                    <button
                      type="button"
                      onClick={() => handleSendMessage(`Compare my current profile with ${job.title}`)}
                      className="text-cyan-400 hover:underline"
                    >
                      Compare ↗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </HolographicPanel>

          {/* Recommended Bridge Courses */}
          <HolographicPanel
            title="Curriculum Recommendations"
            subtitle="Accredited mastery modules"
            icon="school"
          >
            <div className="space-y-2">
              {MOCK_COURSES.slice(0, 2).map((c) => (
                <div
                  key={c.id}
                  className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800"
                >
                  <div className="text-xs font-bold text-white line-clamp-1">{c.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {c.instructorName} • {c.durationHours}h
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-amber-400">★ {c.rating}</span>
                    <button
                      type="button"
                      onClick={() => handleSendMessage(`Tell me about the course ${c.title}`)}
                      className="text-cyan-400 hover:underline"
                    >
                      Inspect Syllabus ↗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </HolographicPanel>
        </aside>
      </div>
    </div>
  );
}

