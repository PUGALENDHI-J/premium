'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MOCK_JOBS, MOCK_COURSES, MOCK_CANDIDATE } from '@/lib/mockData';

export type VisualizationMode =
  | 'neural-network'
  | 'skill-universe'
  | 'career-constellation'
  | 'recruitment-map'
  | 'learning-progress';

interface NodeItem {
  id: string;
  name: string;
  type: 'candidate' | 'skill' | 'job' | 'company' | 'course' | 'milestone';
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  radius: number;
  color: string;
  matchScore?: number;
}

interface LinkItem {
  source: string;
  target: string;
  weight: number;
}

export const QuantumVisualizations: React.FC<{
  initialMode?: VisualizationMode;
  className?: string;
}> = ({ initialMode = 'neural-network', className = '' }) => {
  const [mode, setMode] = useState<VisualizationMode>(initialMode);
  const [selectedNode, setSelectedNode] = useState<NodeItem | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.parentElement?.clientWidth || 700;
    let height = 480;

    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Build Nodes & Links based on active mode
    let nodes: NodeItem[] = [];
    let links: LinkItem[] = [];

    if (mode === 'neural-network') {
      // Candidate at center
      nodes.push({
        id: 'c-1',
        name: MOCK_CANDIDATE.name,
        type: 'candidate',
        x: width * 0.5,
        y: height * 0.5,
        radius: 20,
        color: '#00f0ff',
      });

      // Skills surrounding
      MOCK_CANDIDATE.skills.slice(0, 8).forEach((s, idx) => {
        const angle = (idx / 8) * Math.PI * 2;
        const dist = 120 + (idx % 2) * 30;
        nodes.push({
          id: `s-${idx}`,
          name: s.name,
          type: 'skill',
          x: width * 0.5 + Math.cos(angle) * dist,
          y: height * 0.5 + Math.sin(angle) * dist,
          radius: 10,
          color: s.verified ? '#38bdf8' : '#a855f7',
        });
        links.push({ source: 'c-1', target: `s-${idx}`, weight: 1 });
      });

      // Jobs outer ring
      MOCK_JOBS.slice(0, 4).forEach((j, idx) => {
        const angle = ((idx + 0.5) / 4) * Math.PI * 2;
        nodes.push({
          id: `j-${idx}`,
          name: j.title.split(' ')[0] + ' ' + (j.title.split(' ')[1] || ''),
          type: 'job',
          x: width * 0.5 + Math.cos(angle) * 190,
          y: height * 0.5 + Math.sin(angle) * 190,
          radius: 14,
          color: '#10b981',
          matchScore: j.matchScore,
        });
        // link to relevant skills
        links.push({ source: `s-${idx % 8}`, target: `j-${idx}`, weight: 0.8 });
      });
    } else if (mode === 'skill-universe') {
      // Clustered skill categories (Cloud, AI, Frontend, Concurrency)
      const categories = [
        { name: 'Distributed / Cloud', x: width * 0.25, y: height * 0.35, color: '#00f0ff' },
        { name: 'Generative AI & LLMs', x: width * 0.75, y: height * 0.35, color: '#a855f7' },
        { name: 'Spatial & WebGL', x: width * 0.5, y: height * 0.75, color: '#38bdf8' },
      ];

      categories.forEach((cat, cIdx) => {
        nodes.push({
          id: `cat-${cIdx}`,
          name: cat.name,
          type: 'skill',
          x: cat.x,
          y: cat.y,
          radius: 24,
          color: cat.color,
        });

        // Satellite skills
        for (let i = 0; i < 4; i++) {
          const a = (i / 4) * Math.PI * 2;
          nodes.push({
            id: `sub-${cIdx}-${i}`,
            name: `Skill ${cIdx + 1}.${i + 1}`,
            type: 'skill',
            x: cat.x + Math.cos(a) * 60,
            y: cat.y + Math.sin(a) * 60,
            radius: 8,
            color: cat.color,
          });
          links.push({ source: `cat-${cIdx}`, target: `sub-${cIdx}-${i}`, weight: 0.7 });
        }
      });
    } else if (mode === 'career-constellation') {
      // Linear constellation path
      const steps = [
        { name: 'Current: Senior Engineer', role: 'Senior', salary: '$160k', color: '#00f0ff' },
        { name: 'Milestone 1: Consensus Mastery', role: 'Staff Eng', salary: '$180k', color: '#38bdf8' },
        { name: 'Milestone 2: vLLM & GPU Memory', role: 'Lead Architect', salary: '$200k', color: '#a855f7' },
        { name: 'Target: Principal AI Architect', role: 'Principal', salary: '$240k', color: '#10b981' },
      ];

      steps.forEach((st, idx) => {
        const x = width * 0.15 + (idx / 3) * (width * 0.7);
        const y = height * 0.5 + Math.sin(idx * 1.5) * 50;
        nodes.push({
          id: `step-${idx}`,
          name: st.name,
          type: 'milestone',
          x,
          y,
          radius: 16,
          color: st.color,
        });
        if (idx > 0) {
          links.push({ source: `step-${idx - 1}`, target: `step-${idx}`, weight: 2 });
        }
      });
    } else {
      // Recruitment & Learning modes
      MOCK_JOBS.forEach((j, i) => {
        nodes.push({
          id: `req-${i}`,
          name: j.title.substring(0, 18) + '...',
          type: 'job',
          x: width * 0.2 + (i % 3) * (width * 0.3),
          y: height * 0.3 + Math.floor(i / 3) * 140,
          radius: 14,
          color: '#38bdf8',
          matchScore: j.matchScore,
        });
      });
    }

    // Animation & Physics Loop
    let angleOffset = 0;

    const render = () => {
      angleOffset += 0.008;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle background grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Links with glowing gradient & moving data pulses
      links.forEach((l) => {
        const src = nodes.find((n) => n.id === l.source);
        const tgt = nodes.find((n) => n.id === l.target);
        if (!src || !tgt) return;

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.lineWidth = l.weight;
        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);
        ctx.stroke();

        // Pulsing data packet
        const t = (Math.sin(angleOffset * 2 + (src.x % 10)) + 1) / 2;
        const px = src.x + (tgt.x - src.x) * t;
        const py = src.y + (tgt.y - src.y) * t;

        ctx.fillStyle = '#00f0ff';
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Nodes
      nodes.forEach((n) => {
        // Floating motion
        const floatY = n.y + Math.sin(angleOffset * 2 + n.x) * 3;

        // Outer glow
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 12;

        ctx.fillStyle = n.color;
        ctx.beginPath();
        ctx.arc(n.x, floatY, n.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0; // reset

        // Label
        ctx.fillStyle = '#f8fafc';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(n.name, n.x, floatY + n.radius + 14);

        if (n.matchScore) {
          ctx.fillStyle = '#34d399';
          ctx.font = '9px monospace';
          ctx.fillText(`${n.matchScore}%`, n.x, floatY - n.radius - 4);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Mouse click handling for node inspection
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const hit = nodes.find((n) => {
        const dx = n.x - clickX;
        const dy = n.y - clickY;
        return Math.sqrt(dx * dx + dy * dy) <= n.radius + 8;
      });

      if (hit) {
        setSelectedNode(hit);
      } else {
        setSelectedNode(null);
      }
    };

    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [mode]);

  return (
    <div className={`relative w-full rounded-xl bg-slate-950/85 border border-cyan-500/20 backdrop-blur-xl p-4 overflow-hidden flex flex-col ${className}`}>
      {/* Top Controller Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-200">
            Quantum Visualization Matrix
          </h3>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => setMode('neural-network')}
            className={`px-2.5 py-1 rounded transition-colors ${
              mode === 'neural-network' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Neural Network
          </button>
          <button
            type="button"
            onClick={() => setMode('skill-universe')}
            className={`px-2.5 py-1 rounded transition-colors ${
              mode === 'skill-universe' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Skill Universe
          </button>
          <button
            type="button"
            onClick={() => setMode('career-constellation')}
            className={`px-2.5 py-1 rounded transition-colors ${
              mode === 'career-constellation' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Career Constellation
          </button>
          <button
            type="button"
            onClick={() => setMode('recruitment-map')}
            className={`px-2.5 py-1 rounded transition-colors ${
              mode === 'recruitment-map' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            ATS Requisitions
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full h-[440px] flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full cursor-pointer" />

        {/* Selected Node Inspector Drawer */}
        {selectedNode && (
          <div className="absolute top-4 right-4 z-20 p-3.5 rounded-xl bg-slate-950/95 border border-cyan-400/40 shadow-quantum backdrop-blur-xl max-w-xs text-xs animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
              <span className="font-mono uppercase text-cyan-300 text-[10px]">
                Node Telemetry
              </span>
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            <h4 className="font-bold text-white text-sm">{selectedNode.name}</h4>
            <p className="text-slate-400 mt-0.5">
              Type: <span className="font-mono text-cyan-400">{selectedNode.type}</span>
            </p>
            {selectedNode.matchScore && (
              <p className="text-emerald-400 mt-1 font-mono">
                Match Index: <strong>{selectedNode.matchScore}%</strong>
              </p>
            )}
            <div className="mt-3 pt-2 border-t border-slate-800 flex gap-2">
              <button
                type="button"
                className="w-full py-1 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] hover:bg-cyan-500/30 transition-colors uppercase"
              >
                Inspect Connections
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

