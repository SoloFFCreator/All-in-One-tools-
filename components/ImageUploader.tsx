
import React, { useRef, useState } from 'react';
import { ImageFile } from '../types';

interface ImageUploaderProps {
  onImagesSelected: (images: ImageFile[]) => void;
  multiple?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesSelected, multiple = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newImages: ImageFile[] = Array.from(files).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      originalSize: file.size,
      type: file.type,
    }));

    onImagesSelected(newImages);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer ${
        isDragging
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-slate-300 bg-white hover:border-slate-400'
      }`}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFiles(e.target.files)}
        multiple={multiple}
        accept="image/*"
        className="hidden"
      />
      
      <div className="flex flex-col items-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-transform duration-300 ${
          isDragging ? 'bg-indigo-600 text-white scale-110' : 'bg-slate-100 text-slate-400'
        }`}>
          <i className="fas fa-cloud-arrow-up text-2xl"></i>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Drop your images here</h3>
        <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
          Support for PNG, JPG, WebP. {multiple ? 'Batch upload supported.' : 'Single file processing.'}
        </p>
        <button className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-full font-medium text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
          Browse Files
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;
