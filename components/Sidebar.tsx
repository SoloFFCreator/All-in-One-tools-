
import React from 'react';
import { ToolId } from '../types';

interface SidebarProps {
  activeTool: ToolId;
  onSelectTool: (id: ToolId) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTool, onSelectTool }) => {
  const categories = [
    {
      title: 'Navigation',
      items: [
        { id: 'dashboard', icon: 'fa-house', label: 'Dashboard' },
      ]
    },
    {
      title: 'Neural Engine',
      items: [
        { id: 'upscaler', icon: 'fa-wand-magic-sparkles', label: 'AI Super-Res' },
        { id: 'video', icon: 'fa-clapperboard', label: 'Veo Video', badge: 'New' },
        { id: 'speech', icon: 'fa-waveform-lines', label: 'Studio TTS' },
      ]
    },
    {
      title: 'Toolbox',
      items: [
        { id: 'compressor', icon: 'fa-compress', label: 'Optimize' },
        { id: 'converter', icon: 'fa-shuffle', label: 'Convert' },
        { id: 'resizer', icon: 'fa-expand', label: 'Resize & Crop' },
      ]
    }
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 relative z-40">
      <div className="p-10 flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-200 group cursor-pointer transition-transform hover:rotate-6">
          <i className="fas fa-bolt-lightning text-lg transition-all group-hover:scale-110"></i>
        </div>
        <div>
          <h1 className="font-extrabold text-lg tracking-tight text-slate-900 leading-none">Studio</h1>
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Version 2.5 Pro</p>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-10 overflow-y-auto custom-scrollbar pb-10">
        {categories.map((cat, idx) => (
          <div key={idx}>
            <p className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">{cat.title}</p>
            <div className="space-y-1.5">
              {cat.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectTool(item.id as ToolId)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group relative ${
                    activeTool === item.id
                      ? 'bg-slate-900 text-white shadow-xl shadow-slate-200'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                       activeTool === item.id ? 'bg-white/10' : 'bg-transparent'
                    }`}>
                      <i className={`fas ${item.icon} text-sm`}></i>
                    </div>
                    <span className="text-sm font-bold tracking-tight">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-black bg-indigo-500 text-white px-2 py-0.5 rounded-full uppercase">
                      {item.badge}
                    </span>
                  )}
                  {activeTool === item.id && (
                    <div className="absolute left-0 w-1 h-4 bg-indigo-500 rounded-r-full -ml-1"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-8 border-t border-slate-50">
        <div className="p-5 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden group cursor-help transition-all hover:scale-[1.02]">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">System Core</span>
            </div>
            <p className="text-sm font-bold leading-tight mb-2">Browser Computing</p>
            <p className="text-[10px] opacity-40 leading-relaxed">Processing assets locally for maximum privacy and performance.</p>
          </div>
          <i className="fas fa-microchip absolute -right-4 -bottom-4 text-6xl opacity-5 transition-transform group-hover:rotate-12"></i>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
