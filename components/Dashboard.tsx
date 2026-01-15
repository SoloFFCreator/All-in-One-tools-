
import React from 'react';
import { ToolId, ToolMetadata } from '../types';

const tools: ToolMetadata[] = [
  {
    id: 'compressor',
    name: 'Smart Compression',
    description: 'Reduce file size by up to 90% while maintaining visual quality. Supports JPG, PNG, and WebP.',
    icon: 'fa-compress',
    color: 'bg-blue-500',
  },
  {
    id: 'upscaler',
    name: 'AI High-Res Upscale',
    description: 'Breathe life into low-resolution images with our Gemini-powered AI enhancement engine.',
    icon: 'fa-wand-magic-sparkles',
    color: 'bg-purple-500',
  },
  {
    id: 'converter',
    name: 'Format Converter',
    description: 'Instantly convert images between PNG, JPG, WebP, and AVIF for any use case.',
    icon: 'fa-repeat',
    color: 'bg-emerald-500',
  },
  {
    id: 'resizer',
    name: 'Resize & Crop',
    description: 'Perfect dimensions for social media, web banners, and print with aspect-ratio locking.',
    icon: 'fa-expand',
    color: 'bg-amber-500',
  },
];

interface DashboardProps {
  onSelectTool: (id: ToolId) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectTool }) => {
  return (
    <div className="space-y-12 py-6">
      <header className="text-center md:text-left max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Your Creative <span className="text-indigo-600">Powerhouse</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          The ultimate utility platform for modern content creators. High-performance image processing, powered by local computing and cutting-edge AI.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            className="group relative bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
          >
            <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
              <i className={`fas ${tool.icon}`}></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{tool.name}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{tool.description}</p>
            <div className="mt-6 flex items-center text-indigo-600 font-semibold text-sm">
              Launch Tool <i className="fas fa-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
            </div>
            
            <div className={`absolute top-0 right-0 w-24 h-24 ${tool.color} opacity-[0.03] rounded-bl-full -mr-8 -mt-8 transition-opacity group-hover:opacity-[0.08]`}></div>
          </button>
        ))}
      </div>

      <section className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 overflow-hidden relative">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Privacy-First Architecture</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              We process your files directly in your browser whenever possible. Your images stay in your session, protected and secure. No persistent cloud storage means zero data trail.
            </p>
            <ul className="space-y-3">
              {[
                'Zero-tracking processing',
                'Local WebWorker technology',
                'Automatic session purges',
                'Encrypted AI connections'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px]">
                    <i className="fas fa-check"></i>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-sm aspect-square bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex items-center justify-center overflow-hidden shadow-inner">
               <i className="fas fa-shield-halved text-slate-200 text-9xl"></i>
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-4 bg-white rounded-xl shadow-lg border border-slate-200 transform -rotate-6 animate-pulse">
                    <i className="fas fa-lock text-indigo-500 mr-2"></i>
                    <span className="text-xs font-bold uppercase tracking-widest">End-to-End Secure</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
