
import React from 'react';
import { ToolId } from '../types';

interface SidebarProps {
  activeTool: ToolId;
  onSelectTool: (id: ToolId) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTool, onSelectTool }) => {
  const navItems = [
    { id: 'dashboard', icon: 'fa-house', label: 'Dashboard' },
    { id: 'compressor', icon: 'fa-compress', label: 'Compression' },
    { id: 'upscaler', icon: 'fa-wand-magic-sparkles', label: 'AI Upscale' },
    { id: 'converter', icon: 'fa-repeat', label: 'Convert' },
    { id: 'resizer', icon: 'fa-expand', label: 'Resize' },
  ] as const;

  return (
    <aside className="w-20 md:w-64 bg-white border-r border-slate-200 flex flex-col transition-all duration-300">
      <div className="p-4 md:p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <i className="fas fa-brain"></i>
        </div>
        <span className="hidden md:block font-bold text-xl tracking-tight text-slate-800">AI Studio</span>
      </div>

      <nav className="flex-1 mt-6 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTool(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
              activeTool === item.id
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <div className="w-8 flex justify-center text-lg">
              <i className={`fas ${item.icon}`}></i>
            </div>
            <span className="hidden md:block text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="hidden md:block bg-slate-50 p-4 rounded-xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Workspace</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-slate-700">All Systems Go</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
