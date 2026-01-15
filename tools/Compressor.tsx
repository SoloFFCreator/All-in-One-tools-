
import React, { useState, useCallback, useEffect } from 'react';
import { ImageFile, ProcessedResult } from '../types';
import ImageUploader from '../components/ImageUploader';

const Compressor: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [quality, setQuality] = useState(0.8);
  const [targetSizeKB, setTargetSizeKB] = useState<string>('');
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processImage = useCallback(async (image: ImageFile, q: number, targetKB?: number): Promise<ProcessedResult> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = image.previewUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);

        const targetType = image.type === 'image/png' ? 'image/jpeg' : image.type;
        
        // If target size is provided, we might need to iterate quality, 
        // but for a web-based tool, we'll do a simple approximation.
        let currentQuality = q;
        if (targetKB && targetKB > 0) {
            // Very rough heuristic: quality = target / original
            const currentSizeKB = image.originalSize / 1024;
            currentQuality = Math.min(1.0, Math.max(0.1, targetKB / currentSizeKB));
        }

        const dataUrl = canvas.toDataURL(targetType, currentQuality);
        
        fetch(dataUrl)
          .then(res => res.blob())
          .then(blob => {
            resolve({
              dataUrl,
              blob,
              size: blob.size,
              format: targetType,
              width: img.width,
              height: img.height
            });
          });
      };
    });
  }, []);

  const handleProcess = async () => {
    setIsProcessing(true);
    const newResults = [];
    const targetNum = targetSizeKB ? parseInt(targetSizeKB) : undefined;
    for (const img of images) {
      const result = await processImage(img, quality, targetNum);
      newResults.push(result);
    }
    setResults(newResults);
    setIsProcessing(false);
  };

  useEffect(() => {
    if (images.length > 0) {
      handleProcess();
    }
  }, [quality, images.length, targetSizeKB]);

  const downloadAll = () => {
    results.forEach((res, idx) => {
      const link = document.createElement('a');
      link.href = res.dataUrl;
      link.download = `compressed-${images[idx].file.name.split('.')[0]}.${res.format.split('/')[1]}`;
      link.click();
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Smart Compression</h2>
          <p className="text-slate-500">Optimized file sizes without the visual loss.</p>
        </div>
        {images.length > 0 && (
          <button 
            onClick={() => {setImages([]); setResults([]);}} 
            className="px-4 py-2 bg-white border border-red-100 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <i className="fas fa-trash-can mr-2"></i> Clear Workspace
          </button>
        )}
      </header>

      {images.length === 0 ? (
        <ImageUploader multiple onImagesSelected={setImages} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Compression Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'High', q: 0.3 },
                    { label: 'Medium', q: 0.6 },
                    { label: 'Low', q: 0.9 },
                  ].map((mode) => (
                    <button
                      key={mode.label}
                      onClick={() => { setQuality(mode.q); setTargetSizeKB(''); }}
                      className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                        quality === mode.q && !targetSizeKB
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Custom Quality ({Math.round(quality * 100)}%)</label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1.0" 
                  step="0.05" 
                  value={quality} 
                  onChange={(e) => { setQuality(parseFloat(e.target.value)); setTargetSizeKB(''); }}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Target Size (Optional)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="e.g. 500" 
                    value={targetSizeKB}
                    onChange={(e) => setTargetSizeKB(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm font-mono"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">KB</span>
                </div>
                <p className="mt-2 text-[10px] text-slate-400 leading-tight">We will attempt to reach this size by adjusting quality automatically.</p>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-200 relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <i className="fas fa-chart-pie text-indigo-400"></i>
                  Session Savings
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Before</span>
                    <span className="font-mono">{formatSize(images.reduce((acc, curr) => acc + curr.originalSize, 0))}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">After</span>
                    <span className="font-mono text-emerald-400">{formatSize(results.reduce((acc, curr) => acc + curr.size, 0))}</span>
                  </div>
                  <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                    <span className="font-bold">Total Saved</span>
                    <span className="text-2xl font-black text-indigo-400">
                      {results.length > 0 
                        ? Math.max(0, Math.round((1 - (results.reduce((acc, curr) => acc + curr.size, 0) / images.reduce((acc, curr) => acc + curr.originalSize, 0))) * 100))
                        : 0}%
                    </span>
                  </div>
                </div>
                <button 
                  disabled={results.length === 0 || isProcessing}
                  onClick={downloadAll}
                  className="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {isProcessing ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-download"></i>}
                  {isProcessing ? 'Optimizing...' : 'Export All Assets'}
                </button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4 overflow-y-auto max-h-[75vh] pr-2 custom-scrollbar">
            {images.map((img, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 hover:border-indigo-200 hover:shadow-md transition-all group">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100 flex items-center justify-center">
                  <img src={img.previewUrl} className="max-w-full max-h-full object-cover transition-transform group-hover:scale-105" alt="preview" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate text-sm">{img.file.name}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="px-2 py-0.5 bg-slate-100 text-[9px] font-black text-slate-500 rounded uppercase tracking-tighter">{img.file.type.split('/')[1]}</span>
                    <span className="text-xs text-slate-400 line-through">{formatSize(img.originalSize)}</span>
                    <i className="fas fa-arrow-right text-[10px] text-slate-300"></i>
                    <span className="text-xs font-black text-emerald-600">{results[idx] ? formatSize(results[idx].size) : '...'}</span>
                    {results[idx] && (
                        <span className="text-[10px] font-bold text-indigo-400 bg-indigo-50 px-1.5 py-0.5 rounded">
                            -{Math.round((1 - results[idx].size / img.originalSize) * 100)}%
                        </span>
                    )}
                  </div>
                </div>
                {results[idx] && (
                  <a 
                    href={results[idx].dataUrl} 
                    download={`compressed-${img.file.name}`}
                    className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    title="Download individual file"
                  >
                    <i className="fas fa-download"></i>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Compressor;
