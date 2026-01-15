
import { GoogleGenAI, Modality } from "@google/genai";

/**
 * World-class AI Orchestration Layer
 * Handles Gemini and Veo models with high-precision configuration.
 */

const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const upscaleImage = async (
  base64: string, 
  scale: string = '2x', 
  guidance: string = ''
): Promise<string> => {
  const client = getClient();
  const prompt = `Task: Perform high-fidelity super-resolution upscaling to ${scale} original size.
  Instructions:
  1. Remove compression artifacts, JPEG noise, and pixelation.
  2. Sharpen edges while maintaining natural skin/texture realism.
  3. Reconstruct missing fine details (hair, fabric, eyes, landscape elements).
  4. Optimize color dynamic range.
  ${guidance ? `Additional Guidance: ${guidance}` : ""}
  Output format: Strictly return the processed image only.`;

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64.split(',')[1], mimeType: 'image/png' } },
        { text: prompt }
      ]
    }
  });

  const imgPart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (!imgPart?.inlineData) throw new Error("AI failed to reconstruct image. Try a higher quality source.");
  
  return `data:image/png;base64,${imgPart.inlineData.data}`;
};

export const synthesizeSpeech = async (text: string, voice: string = 'Kore'): Promise<Uint8Array> => {
  const client = getClient();
  const response = await client.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } },
      },
    },
  });

  const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64) throw new Error("Voice synthesis failed.");
  
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

export const createVideoFromText = async (prompt: string): Promise<string> => {
  const client = getClient();
  let operation = await client.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    config: {
      numberOfVideos: 1,
      resolution: '1080p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(r => setTimeout(r, 6000));
    operation = await client.operations.getVideosOperation({ operation });
  }

  const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!uri) throw new Error("Video production engine failed. Check project quotas.");
  return `${uri}&key=${process.env.API_KEY}`;
};
