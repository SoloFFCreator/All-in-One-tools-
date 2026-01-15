
export type ToolId = 'dashboard' | 'compressor' | 'upscaler' | 'converter' | 'resizer';

export interface ToolMetadata {
  id: ToolId;
  name: string;
  description: string;
  icon: string;
  color: string;
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
