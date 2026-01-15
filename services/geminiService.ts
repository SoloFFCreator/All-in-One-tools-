
import { GoogleGenAI } from "@google/genai";

export const enhanceImageWithGemini = async (
  base64Image: string, 
  promptSuffix: string = "", 
  scale: string = "2x"
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Task: Upscale and enhance this image to ${scale} its original size. 
  Instructions:
  1. Use advanced super-resolution to increase dimensions while maintaining razor-sharp edges.
  2. Remove all compression artifacts, noise, and grain.
  3. Intelligently reconstruct missing details in textures (fabric, skin, nature).
  4. Optimize dynamic range and color vibrance for a professional "studio" look.
  5. The output must be the enhanced image only.
  ${promptSuffix ? `Additional User Focus: ${promptSuffix}` : ""}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image.split(',')[1],
            mimeType: 'image/png',
          },
        },
        {
          text: prompt,
        },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("The AI did not return an image. It might have returned text instead. Try a different image or prompt.");
};
