
import React, { useState, useMemo } from 'react';
import { ToolId } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Compressor from './tools/Compressor';
import Upscaler from './tools/Upscaler';
import Converter from './tools/Converter';
import Resizer from './tools/Resizer';
import VideoGen from './tools/VideoGen';
import SpeechGen from './tools/SpeechGen';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolId>('dashboard');

  const content = useMemo(() => {
    switch (activeTool) {
      case 'dashboard': return <Dashboard onSelectTool={setActiveTool} />;
      case 'compressor': return <Compressor />;
      case 'upscaler': return <Upscaler />;
      case 'converter': return <Converter />;
      case 'resizer': return <Resizer />;
      case 'video': return <VideoGen />;
      case 'speech': return <SpeechGen />;
      default: return <Dashboard onSelectTool={setActiveTool} />;
    }
  }, [activeTool]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] font-sans">
      <Sidebar activeTool={activeTool} onSelectTool={setActiveTool} />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col">
        {/* Vite-Inspired Header */}
        <header className="h-16 shrink-0 border-b border-slate-200 px-8 flex items-center justify-between glass-panel sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="px-2 py-0.5 bg-[#646cff] text-white text-[9px] font-black rounded uppercase">Vite</div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-0.5">/</span>
            <span className="text-sm font-bold text-slate-700 capitalize tracking-tight">{activeTool.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-black border border-slate-800 shadow-lg shadow-slate-100">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              Gemini Engine Ready
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-10 lg:p-14 max-w-7xl mx-auto w-full">
          {content}
        </div>
        
        <footer className="p-8 text-center border-t border-slate-100 mt-auto bg-white/50">
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
              AI Studio Pro &copy; 2025 • Build System: Vite v6.0
            </p>
            <div className="flex items-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
               <i className="fab fa-react text-xl"></i>
               <i className="fas fa-bolt text-xl"></i>
               <i className="fas fa-brain text-xl"></i>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
