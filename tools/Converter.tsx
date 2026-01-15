
import React, { useState } from 'react';
import { ImageFile, ProcessedResult } from '../types';
import ImageUploader from '../components/ImageUploader';

const Converter: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [targetFormat, setTargetFormat] = useState('image/png');
  const [quality, setQuality] = useState(0.9);
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const formats = [
    { label: 'PNG', value: 'image/png' },
    { label: 'JPG', value: 'image/jpeg' },
    { label: 'WebP', value: 'image/webp' },
    { label: 'AVIF', value: 'image/avif' },
  ];

  const handleConvert = async () => {
    setIsProcessing(true);
    const newResults: ProcessedResult[] = [];

    for (const imgFile of images) {
      const img = new Image();
      img.src = imgFile.previewUrl;
      await new Promise((resolve) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0);
          
          const dataUrl = canvas.toDataURL(targetFormat, quality);
          fetch(dataUrl)
            .then(res => res.blob())
            .then(blob => {
              newResults.push({
                dataUrl,
                blob,
                size: blob.size,
                format: targetFormat,
                width: img.width,
                height: img.height
              });
              resolve(true);
            });
        };
      });
    }

    setResults(newResults);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Format Converter</h2>
        <p className="text-slate-500">Seamlessly switch between web standards with batch processing.</p>
      </header>

      {images.length === 0 ? (
        <ImageUploader multiple onImagesSelected={setImages} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Target Format</label>
                <div className="grid grid-cols-2 gap-3">
                  {formats.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setTargetFormat(f.value)}
                      className={`px-4 py-4 rounded-2xl border text-sm font-bold transition-all flex flex-col items-center gap-1 ${
                        targetFormat === f.value
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 scale-105 z-10'
                          : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <span className="uppercase">{f.label}</span>
                      {targetFormat === f.value && <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Output Quality ({Math.round(quality * 100)}%)</label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1.0" 
                  step="0.05" 
                  value={quality} 
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <button
                onClick={handleConvert}
                disabled={isProcessing}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl active:scale-95"
              >
                {isProcessing ? <i className="fas fa-repeat animate-spin"></i> : <i className="fas fa-wand-sparkles"></i>}
                {isProcessing ? 'Converting Assets...' : 'Run Batch Conversion'}
              </button>
            </div>
            
            <button 
              onClick={() => {setImages([]); setResults([]);}} 
              className="w-full py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors"
            >
              <i className="fas fa-trash-can mr-2"></i> Reset Workspace
            </button>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
               <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Source Asset</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Protocol</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {images.map((img, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 p-1">
                                <img src={img.previewUrl} className="w-full h-full object-cover rounded-lg" alt="mini" />
                            </div>
                            <span className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{img.file.name}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-[10px] font-black text-slate-400 bg-white border border-slate-100 px-2 py-1 rounded uppercase">
                                    {img.file.type.split('/')[1]}
                                </span>
                                <i className="fas fa-chevron-right text-[10px] text-slate-300"></i>
                                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded uppercase">
                                    {targetFormat.split('/')[1]}
                                </span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                            {results[idx] ? (
                            <a 
                                href={results[idx].dataUrl} 
                                download={`converted-${img.file.name.split('.')[0]}.${results[idx].format.split('/')[1]}`}
                                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-xs font-black uppercase tracking-tighter"
                            >
                                <i className="fas fa-circle-down"></i>
                                Ready
                            </a>
                            ) : (
                            <span className="text-xs font-bold text-slate-300 italic">Pending...</span>
                            )}
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
               </div>
            </div>
            {results.length > 0 && (
              <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl flex items-center gap-3">
                <i className="fas fa-circle-info text-indigo-400"></i>
                <p className="text-[11px] text-indigo-700 font-medium">
                  Conversion processed locally. Click "Ready" on any file to download individual results.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Converter;
