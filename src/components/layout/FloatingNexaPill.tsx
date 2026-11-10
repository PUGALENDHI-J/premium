'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AiOrchestratorService } from '@/services/ai/AiOrchestratorService';
import { AIMessageItem } from '@/types';
import { AIResponseRenderer } from '../quantum/AIResponseRenderer';
import { QuantumCommandInput } from '../quantum/QuantumCommandInput';

export const FloatingNexaPill: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Don't render floating pill on the main full-screen `/app/nexa` page
  if (pathname.startsWith('/app/nexa')) {
    return null;
  }

  const handleSend = async (text: string) => {
    const userMsg: AIMessageItem = {
      id: `usr-${Date.now()}`,
      conversationId: 'quick-conv',
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await AiOrchestratorService.processMessage(text, messages);
      setMessages((prev) => [...prev, response]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Pill Trigger */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-3 px-4 py-2.5 rounded-full bg-slate-950/90 hover:bg-slate-900 border border-cyan-400/50 shadow-quantum backdrop-blur-xl transition-all duration-300 active:scale-95"
        >
          {/* Glowing animated orb / mini robot indicator */}
          <div className="relative w-7 h-7 rounded-full bg-cyan-400/20 border border-cyan-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-base text-cyan-300 group-hover:scale-110 transition-transform">
              smart_toy
            </span>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              NEXA Copilot
              <span className="text-[10px] text-cyan-400">QX</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {isOpen ? 'Close Assistant' : 'Ask Anything'}
            </span>
          </div>
        </button>
      </div>

      {/* Slide-out / Popover Assistant Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-[92vw] sm:w-[460px] max-h-[75vh] flex flex-col rounded-2xl bg-slate-950/95 border border-cyan-500/40 shadow-quantum backdrop-blur-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/20 bg-slate-900/60">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300">
                <span className="material-symbols-outlined text-sm">smart_toy</span>
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold uppercase text-white">
                  NEXA Quick Assistant
                </h4>
                <p className="text-[10px] text-slate-400 font-mono">
                  Contextual platform copilot
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/app/nexa"
                onClick={() => setIsOpen(false)}
                className="px-2.5 py-1 rounded bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono uppercase tracking-wider transition-colors"
              >
                Expand 3D ↗
              </Link>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Conversation Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[480px]">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-6 text-slate-400">
                <span className="material-symbols-outlined text-4xl text-cyan-400 mb-2">
                  psychology
                </span>
                <p className="text-xs text-slate-300 font-medium">
                  Ask NEXA to analyze jobs, explain lessons, or review your resume.
                </p>
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {m.role === 'user' ? (
                    <div className="max-w-[85%] rounded-xl px-3.5 py-2 bg-cyan-600/30 border border-cyan-500/40 text-xs text-white">
                      {m.content}
                    </div>
                  ) : (
                    <div className="w-full">
                      <AIResponseRenderer message={m} />
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 py-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>NEXA analyzing telemetry...</span>
              </div>
            )}
          </div>

          {/* Command Input Bar */}
          <div className="p-3 border-t border-cyan-500/20 bg-slate-900/80">
            <QuantumCommandInput
              onSend={handleSend}
              disabled={isLoading}
              suggestedPrompts={[
                'Find jobs matching my skills',
                'What skills am I missing?',
                'Explain current lesson',
              ]}
              placeholder="Ask NEXA..."
            />
          </div>
        </div>
      )}
    </>
  );
};

