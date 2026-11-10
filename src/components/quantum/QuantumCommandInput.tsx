'use client';

import React, { useState, useRef } from 'react';
import { VoiceInteractionController } from './VoiceInteractionController';

interface QuantumCommandInputProps {
  onSend: (message: string, attachedFile?: File) => void;
  disabled?: boolean;
  suggestedPrompts?: string[];
  placeholder?: string;
}

export const QuantumCommandInput: React.FC<QuantumCommandInputProps> = ({
  onSend,
  disabled = false,
  suggestedPrompts = [
    'Find jobs matching my skills',
    'Analyse my resume',
    'What skills am I missing?',
    'Build a 90-day career improvement plan',
  ],
  placeholder = 'Ask NEXA anything or speak command...',
}) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(VoiceInteractionController.isMuted());
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!input.trim() && !attachedFile) || disabled) return;

    onSend(input.trim(), attachedFile || undefined);
    setInput('');
    setAttachedFile(null);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      VoiceInteractionController.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      VoiceInteractionController.startListening(
        (transcript) => {
          setInput(transcript);
          setIsListening(false);
          // auto-trigger send
          onSend(transcript, attachedFile || undefined);
          setInput('');
          setAttachedFile(null);
        },
        (err) => {
          console.warn('Voice error:', err);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
    }
  };

  const handleMuteToggle = () => {
    const muted = VoiceInteractionController.toggleMute();
    setIsMuted(muted);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Attached file chip */}
      {attachedFile && (
        <div className="flex items-center gap-2 self-start px-3 py-1 rounded-lg bg-cyan-950/70 border border-cyan-500/30 text-xs text-cyan-200 backdrop-blur-md">
          <span className="material-symbols-outlined text-sm text-cyan-400">description</span>
          <span className="font-mono truncate max-w-[240px]">{attachedFile.name}</span>
          <button
            type="button"
            onClick={() => setAttachedFile(null)}
            className="text-cyan-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Suggested Command Chips */}
      {suggestedPrompts && suggestedPrompts.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-500/80 mr-1 flex items-center gap-1 shrink-0">
            <span className="material-symbols-outlined text-xs">bolt</span>
            Suggested:
          </span>
          {suggestedPrompts.slice(0, 4).map((prompt, i) => (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onSend(prompt)}
              className="px-2.5 py-1 rounded-full text-xs font-body text-slate-300 bg-slate-900/80 border border-slate-700/50 hover:border-cyan-500/50 hover:text-cyan-200 hover:bg-slate-800/90 transition-all shrink-0 active:scale-95 text-left"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Main Command Bar */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center rounded-xl bg-slate-950/85 border border-cyan-500/30 shadow-quantum backdrop-blur-xl p-1.5 focus-within:border-cyan-400 transition-all"
      >
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.txt,.docx,.json"
          className="hidden"
        />

        {/* Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Upload Resume or Document (PDF / TXT)"
          className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-900 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">attach_file</span>
        </button>

        {/* Voice Recognition (Mic) Button */}
        <button
          type="button"
          onClick={handleVoiceToggle}
          title={isListening ? 'Listening... click to stop' : 'Voice command (Speech-to-text)'}
          className={`p-2 rounded-lg transition-all ${
            isListening
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
              : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {isListening ? 'mic' : 'mic_none'}
          </span>
        </button>

        {/* Voice TTS Speaker Mute Toggle */}
        <button
          type="button"
          onClick={handleMuteToggle}
          title={isMuted ? 'Voice response muted (click to unmute)' : 'Voice response active (click to mute)'}
          className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-900 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">
            {isMuted ? 'volume_off' : 'volume_up'}
          </span>
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={input}
          disabled={disabled}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? 'Listening to your voice...' : placeholder}
          className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={disabled || (!input.trim() && !attachedFile)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all ${
            input.trim() || attachedFile
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-quantum hover:brightness-110 active:scale-95'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Execute</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </form>
    </div>
  );
};

