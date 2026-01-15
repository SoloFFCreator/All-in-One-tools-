
import React from 'react';
import { ToolId, ToolMetadata } from '../types';

const tools: ToolMetadata[] = [
  { id: 'upscaler', name: 'AI Super-Res', description: 'Enhance and reconstruct micro-details in low-res images using Gemini 2.5.', icon: 'fa-wand-magic-sparkles', color: 'bg-[#646cff]' },
  { id: 'video', name: 'Cinematic Video', description: 'Pro-grade 1080p video generation from text narratives via Veo 3.1.', icon: 'fa-clapperboard', color: 'bg-slate-900', badge: 'New' },
  { id: 'speech', name: 'Studio Speech', description: 'Ultra-realistic neural text-to-speech with multi-speaker personality.', icon: 'fa-waveform-lines', color: 'bg-purple-600' },
  { id: 'compressor', name: 'Smart Optimizer', description: 'Industrial-strength image compression with up to 90% size reduction.', icon: 'fa-compress', color: 'bg-blue-600' },
  { id: 'converter', name: 'Format Factory', description: 'Universal batch conversion for PNG, JPG, WebP, and AVIF standards.', icon: 'fa-shuffle', color: 'bg-emerald-600' },
  { id: 'resizer', name: 'Studio Resizer', description: 'Precision dimension control with professional aspect ratio presets.', icon: 'fa-expand', color: 'bg-amber-600' },
];

interface DashboardProps {
  onSelectTool: (id: ToolId) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectTool }) => {
  return (
    <div className="relative space-y-16 animate-in fade-in duration-1000 slide-in-from-bottom-2">
      {/* Background Vite Glow */}
      <div className="absolute -top-40 -left-20 w-[600px] h-[600px] vite-glow animate-glow pointer-events-none"></div>

      <header className="relative max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white shadow-sm text-[#646cff] rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-slate-100">
          <i className="fas fa-bolt-lightning animate-pulse"></i> Vite Powered AI Engine
        </div>
        <h1 className="text-6xl md:text-7xl font-[900] text-slate-900 mb-8 tracking-tighter leading-[0.95]">
          Build the future, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#646cff] via-[#ff3e00] to-[#646cff] animate-shimmer bg-[length:200%_auto]">faster.</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-500 leading-relaxed font-medium max-w-2xl">
          A high-performance media toolkit combining Vite's speed with Gemini's intelligence. No servers, no tracking, just performance.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            className="group relative glass-card p-10 rounded-[2.5rem] text-left hover:border-[#646cff]/30 hover:shadow-[0_40px_80px_rgba(100,108,255,0.12)] transition-all duration-500 overflow-hidden"
          >
            <div className={`w-16 h-16 ${tool.color} rounded-3xl flex items-center justify-center text-white text-2xl mb-8 shadow-2xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-[#646cff]/20`}>
              <i className={`fas ${tool.icon}`}></i>
            </div>
            <div className="flex items-center gap-3 mb-3">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">{tool.name}</h3>
               {tool.badge && <span className="text-[9px] font-black text-white bg-[#646cff] px-2 py-1 rounded-lg uppercase">{tool.badge}</span>}
            </div>
            <p className="text-slate-500 text-base leading-relaxed font-medium mb-8">{tool.description}</p>
            
            <div className="flex items-center gap-3 text-xs font-black text-[#646cff] uppercase tracking-widest transition-all group-hover:gap-4">
              Launch Module <i className="fas fa-arrow-right-long"></i>
            </div>
          </button>
        ))}
      </div>

      <section className="relative overflow-hidden rounded-[3.5rem] bg-slate-950 p-12 md:p-20 text-white shadow-2xl shadow-indigo-100">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Privacy in the AI Era.</h2>
            <p className="text-slate-400 text-lg md:text-xl mb-10 leading-relaxed font-medium">
              By utilizing client-side computing and direct AI streaming, your source data remains ephemeral. We bridge the gap between local speed and global AI power.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-xl">
                <i className="fas fa-fingerprint text-[#646cff] text-xl"></i>
                <span className="text-xs font-bold uppercase tracking-widest">Local Sandbox</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-xl">
                <i className="fas fa-bolt text-amber-400 text-xl"></i>
                <span className="text-sm font-bold uppercase tracking-widest">Vite Core</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex justify-end relative">
            <div className="w-80 h-80 rounded-[4rem] border-2 border-dashed border-white/10 flex items-center justify-center animate-[spin_40s_linear_infinite]">
              <div className="w-64 h-64 rounded-[3.5rem] border-4 border-white/5 flex items-center justify-center group cursor-pointer">
                <i className="fas fa-microchip text-white/5 text-[10rem] group-hover:text-[#646cff]/20 transition-colors"></i>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
