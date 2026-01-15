
export type ToolId = 'dashboard' | 'compressor' | 'upscaler' | 'converter' | 'resizer' | 'video' | 'speech';

export interface ToolMetadata {
  id: ToolId;
  name: string;
  description: string;
  icon: string;
  color: string;
  badge?: string;
}

export interface ImageFile {
  file: File;
  previewUrl: string;
  originalSize: number;
  type: string;
}

export interface ProcessedResult {
  dataUrl: string;
  blob: Blob;
  size: number;
  format: string;
  width: number;
  height: number;
}
