
import React, { useState, useRef } from 'react';
import { synthesizeSpeech } from '../services/aiService';

const SpeechGen: React.FC = () => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('Kore');
  const [isProcessing, setIsProcessing] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const personas = [
    { id: 'Kore', label: 'Executive', desc: 'Professional, assertive tone.', icon: 'fa-user-tie' },
    { id: 'Puck', label: 'Creator', desc: 'High energy, vibrant pace.', icon: 'fa-sparkles' },
    { id: 'Charon', label: 'Narrator', desc: 'Deep, resonant, storyteller.', icon: 'fa-book-open' },
    { id: 'Zephyr', label: 'Assistant', desc: 'Calm, empathetic, balanced.', icon: 'fa-headset' },
    { id: 'Fenrir', label: 'Ghost', desc: 'Soft, intimate, whispered.', icon: 'fa-ghost' }
  ];

  const handleGenerate = async () => {
    if (!text) return;
    setIsProcessing(true);
    try {
      const bytes = await synthesizeSpeech(text, voice);
      
      // Setup AudioContext if not exists
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const ctx = audioContextRef.current;
      const int16 = new Int16Array(bytes.buffer);
      const buffer = ctx.createBuffer(1, int16.length, 24000);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < int16.length; i++) data[i] = int16[i] / 32768.0;
      
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
    } catch (err) {
      console.error("Studio TTS Error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
          <i className="fas fa-waveform"></i> Audio Lab
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Neural Speech Studio</h2>
        <p className="text-slate-500 mt-2 font-medium">Transform scripts into high-fidelity voice performances.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
            <div className="space-y-6">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Voice Persona</label>
              <div className="grid grid-cols-1 gap-3">
                {personas.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setVoice(p.id)}
                    className={`group w-full px-6 py-5 rounded-[2rem] border text-left transition-all flex items-center justify-between ${
                      voice === p.id
                        ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.02] z-10'
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-indigo-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        voice === p.id ? 'bg-white/10 text-white' : 'bg-white text-slate-400 shadow-sm'
                      }`}>
                        <i className={`fas ${p.icon} text-lg`}></i>
                      </div>
                      <div>
                        <p className="font-bold text-sm tracking-tight">{p.label} — {p.id}</p>
                        <p className={`text-[10px] font-medium opacity-60`}>{p.desc}</p>
                      </div>
                    </div>
                    {voice === p.id && <i className="fas fa-circle-check text-indigo-400"></i>}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isProcessing || !text}
              className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-bold flex items-center justify-center gap-4 shadow-2xl shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-30 group"
            >
              <i className={`fas ${isProcessing ? 'fa-spinner animate-spin' : 'fa-microphone-lines'} text-xl group-hover:rotate-12 transition-transform`}></i>
              <span className="uppercase tracking-widest text-sm">{isProcessing ? 'Synthesizing Audio' : 'Generate Voiceover'}</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex-1 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Performance Script</label>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={`w-1 h-3 rounded-full bg-indigo-500/20 ${isProcessing ? 'animate-pulse' : ''}`}></div>
                    ))}
                </div>
            </div>
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the text to be spoken. Add punctuation for natural pauses..."
              className="w-full p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] text-xl font-medium text-slate-700 focus:ring-4 focus:ring-indigo-50/50 focus:outline-none transition-all flex-1 min-h-[350px] resize-none leading-relaxed"
            />
            
            <div className="mt-8 p-8 bg-slate-900 rounded-[2rem] flex items-center justify-between gap-10">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-white/20 border border-white/5 shadow-inner">
                        <i className={`fas ${isProcessing ? 'fa-signal-stream animate-pulse text-indigo-400' : 'fa-play text-xs'}`}></i>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white tracking-tight">Real-time Playback</p>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Neural Buffer Ready</p>
                    </div>
                </div>
                
                <div className="flex-1 flex gap-1 items-center h-12">
                   {Array.from({length: 20}).map((_, i) => (
                       <div key={i} className={`flex-1 bg-white/10 rounded-full transition-all duration-300`} style={{
                           height: isProcessing ? `${Math.random() * 100}%` : '4px',
                           opacity: isProcessing ? 1 : 0.2
                       }}></div>
                   ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechGen;
