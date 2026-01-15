
import React, { useState } from 'react';
import { ImageFile } from '../types';
import ImageUploader from '../components/ImageUploader';
import { enhanceImageWithGemini } from '../services/geminiService';

const Upscaler: React.FC = () => {
  const [image, setImage] = useState<ImageFile | null>(null);
  const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promptSuffix, setPromptSuffix] = useState('');
  const [scale, setScale] = useState('2x');

  const handleImagesSelected = (selected: ImageFile[]) => {
    if (selected.length > 0) {
      setImage(selected[0]);
      setEnhancedUrl(null);
      setError(null);
    }
  };

  const handleEnhance = async () => {
    if (!image) return;
    setIsProcessing(true);
    setError(null);
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(image.file);
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const result = await enhanceImageWithGemini(base64, promptSuffix, scale);
          setEnhancedUrl(result);
        } catch (err: any) {
          setError(err.message || 'AI processing failed. Ensure your Gemini API Key is valid.');
        } finally {
          setIsProcessing(false);
        }
      };
    } catch (err) {
      setError('System could not read the image file.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">AI High-Res Upscale</h2>
        <p className="text-slate-500">Transform low-fidelity graphics into crisp, high-resolution assets using Gemini 2.5 Flash.</p>
      </header>

      {!image ? (
        <ImageUploader onImagesSelected={handleImagesSelected} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Input Asset</h3>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 uppercase">Original</span>
              </div>
              <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center relative group">
                <img src={image.previewUrl} className="max-w-full max-h-full object-contain" alt="original" />
                <button 
                   onClick={() => setImage(null)}
                   className="absolute top-4 right-4 bg-white shadow-xl p-3 rounded-2xl text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                   title="Remove image"
                >
                  <i className="fas fa-trash-can"></i>
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Enhancement Config</h3>
              
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Upscale Factor</label>
                <div className="grid grid-cols-3 gap-2">
                  {['2x', '4x', '8x'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setScale(s)}
                      className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                        scale === s
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">AI Guidance (Optional)</label>
                <textarea 
                  value={promptSuffix}
                  onChange={(e) => setPromptSuffix(e.target.value)}
                  placeholder="Tell the AI what to prioritize (e.g. sharp eyes, soft skin, cinematic lighting)..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all h-28 resize-none"
                />
              </div>
              
              <button 
                onClick={handleEnhance}
                disabled={isProcessing}
                className="w-full py-4 bg-slate-900 hover:bg-black disabled:bg-slate-200 text-white rounded-2xl font-bold transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
              >
                {isProcessing ? (
                  <>
                    <i className="fas fa-atom animate-spin"></i>
                    Neural Reconstruction...
                  </>
                ) : (
                  <>
                    <i className="fas fa-bolt-lightning text-amber-400"></i>
                    Upscale with AI
                  </>
                )}
              </button>
              
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs flex items-start gap-3">
                  <i className="fas fa-circle-exclamation mt-0.5"></i>
                  <p>{error}</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 h-full">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-full flex flex-col min-h-[500px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Studio-Grade Output</h3>
                {enhancedUrl && (
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase">Enhanced {scale}</span>
                )}
              </div>
              <div className="flex-1 bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative group">
                {enhancedUrl ? (
                  <>
                    <img src={enhancedUrl} className="max-w-full max-h-full object-contain animate-in zoom-in-95 duration-700" alt="enhanced" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 backdrop-blur-[2px]">
                        <a 
                        href={enhancedUrl} 
                        download={`upscaled-${scale}-${image.file.name}`}
                        className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform"
                        >
                        <i className="fas fa-download text-indigo-600"></i> Save High-Res
                        </a>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-12">
                    <div className="w-24 h-24 bg-white rounded-full shadow-inner border border-slate-100 flex items-center justify-center mx-auto mb-6 text-slate-200 text-4xl">
                      <i className="fas fa-sparkles"></i>
                    </div>
                    <p className="text-slate-400 font-semibold mb-1">Waiting for Processing</p>
                    <p className="text-xs text-slate-300 max-w-[200px] mx-auto">AI enhancement generates new pixels to restore detail lost in low-resolution files.</p>
                  </div>
                )}
                {isProcessing && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-md flex flex-col items-center justify-center">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <i className="fas fa-brain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600 text-xl"></i>
                    </div>
                    <p className="text-indigo-950 font-black mt-6 tracking-tight">AI RECONSTRUCTING ASSET</p>
                    <div className="mt-4 flex gap-1">
                        <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce delay-75"></div>
                        <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce delay-150"></div>
                        <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce delay-300"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upscaler;
