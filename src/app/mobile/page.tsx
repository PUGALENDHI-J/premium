'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { QuantumRobot3D } from '@/components/quantum/QuantumRobot3D';
import { VoiceInteractionController } from '@/components/quantum/VoiceInteractionController';
import { AiOrchestratorService } from '@/services/ai/AiOrchestratorService';
import { RobotState, AIMessageItem } from '@/types';
import { MOCK_JOBS, MOCK_COURSES, MOCK_CANDIDATE } from '@/lib/mockData';

export default function MobileSimulatorPage() {
  const [deviceModel, setDeviceModel] = useState<'iphone' | 'pixel' | 'fullscreen'>('iphone');
  const [activeTab, setActiveTab] = useState<'chat' | 'career' | 'jobs' | 'learning'>('chat');
  const [robotState, setRobotState] = useState<RobotState>('IDLE');
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [apkModalOpen, setApkModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('09:41');
  const [messages, setMessages] = useState<AIMessageItem[]>([
    {
      id: 'm1',
      conversationId: 'mob-1',
      role: 'assistant',
      agentCode: 'NEXA_CORE',
      robotState: 'IDLE',
      content: `### ⚡ NEXA Mobile Online\nWelcome **${MOCK_CANDIDATE.name}**! I am your mobile quantum companion. Ask me to find matching jobs, audit your resume, or plan your study schedule.`,
      metadata: {
        suggestedPrompts: [
          'Find jobs matching my skills',
          'Analyse my resume',
          'What skills am I missing?',
        ],
      },
      createdAt: new Date().toISOString(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: AIMessageItem = {
      id: `usr-${Date.now()}`,
      conversationId: 'mob-1',
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);
    setRobotState('THINKING');

    try {
      const response = await AiOrchestratorService.processMessage(text, messages, 'CANDIDATE');
      setMessages((prev) => [...prev, response]);
      setRobotState('RESPONDING');
      VoiceInteractionController.speak(response.content, () => {
        setRobotState('IDLE');
      });
    } catch (e) {
      console.error(e);
      setRobotState('ERROR');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      VoiceInteractionController.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      VoiceInteractionController.startListening(
        (transcript) => {
          setIsListening(false);
          handleSendMessage(transcript);
        },
        () => setIsListening(false),
        () => setIsListening(false)
      );
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start pt-16 pb-12 px-4 sm:px-6">
      {/* Top Simulator Control Bar */}
      <div className="w-full max-w-4xl mb-6 flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl shadow-quantum">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
            <span className="material-symbols-outlined text-lg">smartphone</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              NexaTalent QX Mobile View &amp; APK Hub
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase">
                Expo Mobile Engine
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Inspect responsive native interaction, compact 3D NEXA, and APK generation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Device Model Switcher */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setDeviceModel('iphone')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                deviceModel === 'iphone'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              iPhone 15 Pro
            </button>
            <button
              type="button"
              onClick={() => setDeviceModel('pixel')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                deviceModel === 'pixel'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Google Pixel 8
            </button>
            <button
              type="button"
              onClick={() => setDeviceModel('fullscreen')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                deviceModel === 'fullscreen'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Full Screen
            </button>
          </div>

          {/* Download APK / Build Guide Trigger */}
          <button
            type="button"
            onClick={() => setApkModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-base">android</span>
            <span>Get Android APK</span>
          </button>
        </div>
      </div>

      {/* Device Frame Simulation Container */}
      <div
        className={`transition-all duration-300 flex items-center justify-center ${
          deviceModel === 'fullscreen'
            ? 'w-full max-w-2xl'
            : deviceModel === 'iphone'
            ? 'w-[390px] h-[820px] rounded-[52px] p-3.5 bg-slate-900 border-[6px] border-slate-700 shadow-[0_0_60px_rgba(0,240,255,0.25)] ring-1 ring-white/10'
            : 'w-[412px] h-[840px] rounded-[44px] p-3 bg-slate-900 border-[5px] border-slate-700 shadow-[0_0_60px_rgba(168,85,247,0.25)] ring-1 ring-white/10'
        }`}
      >
        {/* Inner Mobile Screen */}
        <div className="w-full h-full rounded-[40px] bg-slate-950 overflow-hidden flex flex-col relative border border-slate-800 select-none">
          {/* Mobile Status Bar */}
          <div className="h-11 w-full bg-slate-950 px-6 flex items-center justify-between text-xs text-slate-300 shrink-0 z-30 pt-1">
            <span className="font-semibold text-xs tracking-tight">{currentTime}</span>

            {/* Dynamic Island or Camera Punch Hole */}
            {deviceModel === 'iphone' ? (
              <div className="w-24 h-5 rounded-full bg-black border border-white/5 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/80 animate-pulse mr-1" />
                <span className="text-[9px] font-mono text-cyan-300">NEXA</span>
              </div>
            ) : (
              <div className="w-3.5 h-3.5 rounded-full bg-black border border-white/10" />
            )}

            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <span className="material-symbols-outlined text-sm">wifi</span>
              <span className="material-symbols-outlined text-sm">battery_full</span>
            </div>
          </div>

          {/* Mobile App Header */}
          <div className="px-4 py-2 border-b border-cyan-500/20 bg-slate-900/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                QX
              </div>
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider block leading-none">
                  NexaTalent QX
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                  Quantum Mobile OS
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  robotState === 'THINKING'
                    ? 'bg-purple-400 animate-pulse'
                    : robotState === 'RESPONDING'
                    ? 'bg-cyan-300 animate-ping'
                    : 'bg-emerald-400'
                }`}
              />
              <span className="uppercase">{robotState}</span>
            </div>
          </div>

          {/* Tab 1: NEXA AI Companion (Interactive Chat + 3D Robot) */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Compact 3D Robot Stage */}
              <div className="h-44 w-full shrink-0 border-b border-cyan-500/20 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 relative overflow-hidden">
                <QuantumRobot3D
                  state={robotState}
                  interactive={true}
                  className="w-full h-full"
                />
                <div className="pointer-events-none absolute bottom-1.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-cyan-500/20 text-[9px] font-mono text-cyan-300">
                  Touch &amp; Drag Robot to Interact
                </div>
              </div>

              {/* Mobile Message Stream */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${
                      m.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    {m.role === 'user' ? (
                      <div className="max-w-[85%] rounded-2xl px-3.5 py-2 bg-gradient-to-r from-blue-700 to-cyan-600 text-white text-xs shadow-md">
                        {m.content}
                      </div>
                    ) : (
                      <div className="max-w-[95%] rounded-2xl p-3 bg-slate-900/90 border border-cyan-500/30 text-xs text-slate-200 shadow-quantum space-y-2">
                        {m.agentCode && (
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-300 font-bold border-b border-white/5 pb-1">
                            <span className="material-symbols-outlined text-xs">smart_toy</span>
                            <span>{m.agentCode}</span>
                          </div>
                        )}
                        <div
                          className="leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: m.content
                              .replace('### ', '<strong class="text-cyan-300 block mb-1">')
                              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                              .replace(/`(.*?)`/g, '<code class="text-cyan-300 bg-slate-950 px-1 rounded">$1</code>'),
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}

                {isProcessing && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 text-[11px] font-mono text-cyan-300">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>NEXA computing mobile response...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Suggestion Chips */}
              <div className="px-3 py-1 flex items-center gap-1.5 overflow-x-auto scrollbar-none border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => handleSendMessage('Find jobs matching my skills')}
                  className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 shrink-0"
                >
                  💼 Match Jobs
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('Analyse my resume')}
                  className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 shrink-0"
                >
                  📄 Audit Resume
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('What skills am I missing?')}
                  className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 shrink-0"
                >
                  🔍 Skill Gaps
                </button>
              </div>

              {/* Mobile Command Input Bar */}
              <div className="p-2.5 border-t border-cyan-500/20 bg-slate-950">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 px-2 py-1.5 focus-within:border-cyan-400"
                >
                  <button
                    type="button"
                    onClick={handleVoiceToggle}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isListening
                        ? 'bg-rose-500/20 text-rose-400 animate-pulse'
                        : 'text-slate-400 hover:text-cyan-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {isListening ? 'mic' : 'mic_none'}
                    </span>
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={isListening ? 'Listening...' : 'Ask NEXA...'}
                    className="flex-1 bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className={`p-1.5 rounded-lg text-slate-950 ${
                      inputText.trim()
                        ? 'bg-cyan-400 hover:brightness-110'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">arrow_upward</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Tab 2: Career Constellation */}
          {activeTab === 'career' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/30">
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                  14-Month Career Track
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  Principal Cloud &amp; AI Architect
                </h3>
                <p className="text-xs text-emerald-400 font-mono mt-1">
                  Demand: Surging • Target: $215,000
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs">
                  <span className="font-bold text-emerald-300">✓ Milestone 1: Consensus Mastery</span>
                  <p className="text-[11px] text-slate-400 mt-1">Completed via Go Raft Credential</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <span className="font-bold text-white">2. vLLM &amp; GPU Memory Scaling</span>
                  <p className="text-[11px] text-slate-400 mt-1">Target: Lead AI Infrastructure</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <span className="font-bold text-white">3. Zero-Trust Executive Governance</span>
                  <p className="text-[11px] text-slate-400 mt-1">Target: Principal Architect</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Verified Jobs */}
          {activeTab === 'jobs' && (
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
                <span>42.4k Requisitions</span>
                <span className="text-cyan-400">Direct ATS Sync</span>
              </div>
              {MOCK_JOBS.slice(0, 4).map((j) => (
                <div
                  key={j.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{j.title}</h4>
                      <p className="text-[11px] text-slate-400">{j.companyName}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-blue-950 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30">
                      {j.matchScore}%
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{j.salaryRange.split('/')[0]}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('chat');
                        handleSendMessage(`Compare my current profile with ${j.title}`);
                      }}
                      className="text-cyan-400 font-bold"
                    >
                      Audit with NEXA ↗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Courses */}
          {activeTab === 'learning' && (
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs">
                <span className="text-secondary font-bold text-[10px] uppercase font-mono">
                  Active DRM Player Course
                </span>
                <h4 className="font-bold text-white mt-1">{MOCK_COURSES[0].title}</h4>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: '68%' }} />
                </div>
                <div className="mt-2 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-400">68% Done</span>
                  <Link href="/lms/player" className="text-cyan-300 font-bold">
                    Launch Player ↗
                  </Link>
                </div>
              </div>

              {MOCK_COURSES.slice(1, 3).map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1"
                >
                  <h4 className="font-bold text-white line-clamp-1">{c.title}</h4>
                  <p className="text-[11px] text-slate-400">{c.instructorName} • {c.durationHours}h</p>
                  <div className="flex justify-between items-center pt-1 text-[10px] font-mono text-amber-400">
                    <span>★ {c.rating}</span>
                    <span className="text-slate-300">${c.price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mobile Bottom Navigation Bar */}
          <div className="h-14 w-full bg-slate-950 border-t border-slate-900 flex items-center justify-around px-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`flex flex-col items-center gap-1 ${
                activeTab === 'chat' ? 'text-cyan-400 font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="material-symbols-outlined text-lg">smart_toy</span>
              <span className="text-[9px] font-mono uppercase">NEXA</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('career')}
              className={`flex flex-col items-center gap-1 ${
                activeTab === 'career' ? 'text-cyan-400 font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="material-symbols-outlined text-lg">rocket_launch</span>
              <span className="text-[9px] font-mono uppercase">Career</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('jobs')}
              className={`flex flex-col items-center gap-1 ${
                activeTab === 'jobs' ? 'text-cyan-400 font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="material-symbols-outlined text-lg">work</span>
              <span className="text-[9px] font-mono uppercase">Jobs</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('learning')}
              className={`flex flex-col items-center gap-1 ${
                activeTab === 'learning' ? 'text-cyan-400 font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="material-symbols-outlined text-lg">school</span>
              <span className="text-[9px] font-mono uppercase">Learn</span>
            </button>
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="h-4 w-full bg-slate-950 flex items-center justify-center shrink-0 pb-1">
            <div className="w-32 h-1 rounded-full bg-slate-700" />
          </div>
        </div>
      </div>

      {/* APK Generation & Installation Instructions Modal */}
      {apkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="w-full max-w-xl rounded-2xl bg-slate-950 border border-cyan-500/40 p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">android</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    NexaTalent QX Android APK Hub
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    3 Easy Ways to Install and Use on Your Phone
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setApkModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Option 1: Instant PWA / WebAPK (No compile needed) */}
            <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-300 font-bold uppercase">
                  ⚡ Option 1: Instant Install on Phone (PWA / WebAPK)
                </span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                  Instant • No Build Needed
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Open Chrome on your Android mobile device, navigate to this server's LAN address (e.g. <code>http://&lt;your-local-ip&gt;:3000/mobile</code>), tap the <strong>⋮</strong> menu, and select <strong>&quot;Install App&quot;</strong> or <strong>&quot;Add to Home Screen&quot;</strong>.
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                ✓ Installs standalone icon with full-screen native execution and offline cache!
              </p>
            </div>

            {/* Option 2: Build Standalone APK via EAS (Cloud Build) */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
                  📦 Option 2: Build Standalone .apk via Expo EAS
                </span>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  Cloud Build (.apk)
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                We have prepared the complete mobile project in <code>mobile/App.tsx</code>. To build a standalone <code>.apk</code> without needing local Android Studio:
              </p>
              <pre className="p-3 rounded-lg bg-black/60 text-cyan-300 text-[11px] font-mono overflow-x-auto">
{`cd mobile
npx eas-cli build -p android --profile preview`}
              </pre>
              <p className="text-[11px] text-slate-400">
                EAS will build the standalone Android <code>.apk</code> in the cloud and provide a direct download link and QR code!
              </p>
            </div>

            {/* Option 3: Run with Expo Go */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-purple-400 font-bold uppercase block">
                📱 Option 3: Test Instantly in Expo Go App
              </span>
              <p className="text-xs text-slate-300">
                Install <strong>Expo Go</strong> from Google Play Store, then in your terminal run:
              </p>
              <pre className="p-2.5 rounded-lg bg-black/60 text-purple-300 text-[11px] font-mono">
{`cd mobile
npx expo start`}
              </pre>
              <p className="text-[11px] text-slate-400">
                Scan the terminal QR code with Expo Go to immediately run the native app on your phone!
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setApkModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-mono font-bold hover:brightness-110"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

