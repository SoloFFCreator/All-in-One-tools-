
import React, { useState } from 'react';
import { createVideoFromText } from '../services/aiService';

const VideoGen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingPhase, setLoadingPhase] = useState(0);

  const loadingMessages = [
    "Initializing Veo Rendering Hub...",
    "Dreaming in 1080p resolution...",
    "Simulating physics and lighting...",
    "Stitching neural temporal frames...",
    "Finalizing cinematic master..."
  ];

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsProcessing(true);
    setError(null);
    setLoadingPhase(0);

    const interval = setInterval(() => {
      setLoadingPhase(p => (p + 1) % loadingMessages.length);
    }, 15000);

    try {
      const url = await createVideoFromText(prompt);
      setVideoUrl(url);
    } catch (err: any) {
      setError(err.message || 'Production failed. Check API key permissions for Veo models.');
    } finally {
      setIsProcessing(false);
      clearInterval(interval);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
          <i className="fas fa-film"></i> Production Hub
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">AI Video Factory</h2>
        <p className="text-slate-500 mt-2 font-medium">Generate cinema-grade MP4 assets from textual narrative.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Scene Narrative</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A drone shot of a misty emerald forest at dawn, sunlight piercing through giant redwood trees, high cinematic realism..."
                className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all h-48 resize-none font-medium text-slate-700 leading-relaxed"
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isProcessing || !prompt}
              className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-bold flex items-center justify-center gap-4 shadow-2xl hover:bg-black transition-all active:scale-[0.98] disabled:opacity-30 group"
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-atom animate-spin"></i>
                  Rendering Engine Active
                </>
              ) : (
                <>
                  <i className="fas fa-play-circle text-indigo-400 text-xl group-hover:scale-110 transition-transform"></i>
                  Start Production
                </>
              )}
            </button>

            {error && (
              <div className="p-5 bg-red-50 border border-red-100 rounded-3xl text-red-600 text-xs font-bold flex items-start gap-4">
                <i className="fas fa-triangle-exclamation mt-0.5"></i>
                <p className="leading-relaxed">{error}</p>
              </div>
            )}
          </div>
          
          <div className="p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100">
            <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-4">Technical Specs</h4>
            <ul className="space-y-3">
              {[
                { label: 'Model', val: 'Veo 3.1 Fast' },
                { label: 'Format', val: 'MP4 / 1080p' },
                { label: 'Ratio', val: '16:9 Cinematic' }
              ].map((spec, i) => (
                <li key={i} className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-400 uppercase tracking-widest">{spec.label}</span>
                  <span className="text-indigo-600 bg-white px-3 py-1 rounded-lg border border-indigo-100">{spec.val}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-7 h-full">
          <div className="bg-white p-6 rounded-[3rem] border border-slate-200 shadow-sm h-full flex flex-col min-h-[550px]">
            <div className="flex justify-between items-center mb-6 px-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Preview</h3>
              {videoUrl && <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-200"></div>}
            </div>
            
            <div className="flex-1 bg-slate-950 rounded-[2.5rem] flex items-center justify-center overflow-hidden relative border border-slate-800 shadow-[inset_0_4px_30px_rgba(0,0,0,0.5)]">
              {videoUrl ? (
                <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover animate-in fade-in duration-1000" />
              ) : (
                <div className="text-center p-12">
                   <div className="w-32 h-32 border-4 border-dashed border-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-white/5 text-6xl">
                     <i className="fas fa-clapperboard"></i>
                   </div>
                   <p className="text-white/20 font-black uppercase tracking-[0.3em] text-[10px]">Media Engine Offline</p>
                </div>
              )}

              {isProcessing && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-3xl flex flex-col items-center justify-center p-12 text-center">
                  <div className="relative mb-10">
                    <div className="w-24 h-24 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <i className="fas fa-camera-movie absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500 text-2xl"></i>
                  </div>
                  <h3 className="text-white font-black tracking-tight text-3xl mb-4">Mastering Session</h3>
                  <p className="text-white/40 text-xs font-black uppercase tracking-[0.3em] animate-pulse h-4">{loadingMessages[loadingPhase]}</p>
                  
                  <div className="mt-12 w-full max-w-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Neural Render</span>
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">In Progress</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-1/3 animate-[shimmer_10s_ease-in-out_infinite] origin-left"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {videoUrl && (
              <div className="mt-6 flex justify-end">
                <a 
                  href={videoUrl} 
                  download="studio-pro-render.mp4"
                  className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] transition-all flex items-center gap-3"
                >
                  <i className="fas fa-download"></i> Export High-Bitrate MP4
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoGen;
