
import React, { useState, useEffect } from 'react';
import { ImageFile, ProcessedResult } from '../types';
import ImageUploader from '../components/ImageUploader';

const Resizer: React.FC = () => {
  const [image, setImage] = useState<ImageFile | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [result, setResult] = useState<ProcessedResult | null>(null);

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.src = image.previewUrl;
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height });
        setAspectRatio(img.width / img.height);
      };
    }
  }, [image]);

  const handleWidthChange = (w: number) => {
    if (lockAspect) {
      setDimensions({ width: w, height: Math.round(w / aspectRatio) });
    } else {
      setDimensions(prev => ({ ...prev, width: w }));
    }
  };

  const handleHeightChange = (h: number) => {
    if (lockAspect) {
      setDimensions({ height: h, width: Math.round(h * aspectRatio) });
    } else {
      setDimensions(prev => ({ ...prev, height: h }));
    }
  };

  const presets = [
    { name: 'Instagram Square', w: 1080, h: 1080 },
    { name: 'Full HD', w: 1920, h: 1080 },
    { name: 'Twitter Header', w: 1500, h: 500 },
    { name: 'Profile Pic', w: 400, h: 400 },
  ];

  const handleResize = async () => {
    if (!image) return;
    
    const img = new Image();
    img.src = image.previewUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      const ctx = canvas.getContext('2d')!;
      
      // Smart fill/stretch for now, can be expanded to crop
      ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);
      
      const dataUrl = canvas.toDataURL(image.type);
      fetch(dataUrl)
        .then(res => res.blob())
        .then(blob => {
          setResult({
            dataUrl,
            blob,
            size: blob.size,
            format: image.type,
            width: dimensions.width,
            height: dimensions.height
          });
        });
    };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Resize & Crop</h2>
        <p className="text-slate-500">Tailor your dimensions for any platform.</p>
      </header>

      {!image ? (
        <ImageUploader onImagesSelected={(imgs) => setImage(imgs[0])} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
               <h3 className="text-lg font-bold text-slate-800">Dimensions Control</h3>
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">Width (px)</label>
                   <input 
                      type="number" 
                      value={dimensions.width} 
                      onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                   />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">Height (px)</label>
                   <input 
                      type="number" 
                      value={dimensions.height} 
                      onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                   />
                 </div>
               </div>

               <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-10 h-6 rounded-full transition-colors relative ${lockAspect ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${lockAspect ? 'left-5' : 'left-1'}`}></div>
                    <input type="checkbox" checked={lockAspect} onChange={() => setLockAspect(!lockAspect)} className="hidden" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 select-none">Maintain Aspect Ratio</span>
                  <i className={`fas ${lockAspect ? 'fa-lock' : 'fa-lock-open'} text-xs text-slate-400 transition-colors ${lockAspect ? 'text-indigo-500' : ''}`}></i>
               </label>

               <div className="pt-4 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-400 uppercase mb-4 block tracking-widest">Quick Presets</label>
                  <div className="flex flex-wrap gap-2">
                    {presets.map(p => (
                      <button 
                        key={p.name}
                        onClick={() => {
                          setDimensions({ width: p.w, height: p.h });
                          if (lockAspect) setLockAspect(false); // Disable lock for presets if they don't match
                        }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-600 transition-colors"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
               </div>

               <button 
                  onClick={handleResize}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100"
               >
                 Apply Changes
               </button>
            </div>
            
            <button 
              onClick={() => {setImage(null); setResult(null);}} 
              className="w-full py-3 border border-slate-200 text-slate-500 rounded-xl text-sm font-semibold hover:bg-slate-50"
            >
              Choose Different Image
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-full flex flex-col">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Live Preview</h3>
              <div className="flex-1 bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative p-8">
                {result ? (
                  <div className="text-center animate-in zoom-in-95 duration-500">
                    <img src={result.dataUrl} className="max-w-full max-h-[400px] object-contain shadow-2xl rounded-lg" alt="result" />
                    <div className="mt-6 flex flex-col items-center gap-4">
                      <div className="px-4 py-2 bg-white rounded-full border border-slate-200 text-xs font-bold text-slate-500">
                        {result.width} × {result.height} pixels
                      </div>
                      <a 
                        href={result.dataUrl} 
                        download="resized-image.png"
                        className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-xl hover:bg-slate-800 transition-colors flex items-center gap-2"
                      >
                        <i className="fas fa-download"></i> Download Asset
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <img src={image.previewUrl} className="max-w-full max-h-[300px] object-contain opacity-40 grayscale" alt="preview" />
                    <p className="mt-4 text-slate-400 font-medium italic">Adjust dimensions to see the new crop</p>
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

export default Resizer;
