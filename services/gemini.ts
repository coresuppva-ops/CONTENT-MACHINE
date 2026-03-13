import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SocialPost, VideoScript, UserInputs } from "../types";

const modelName = "gemini-2.5-flash";

/**
 * Generates 30 days of social media posts based on inputs.
 */
export const generatePosts = async (inputs: UserInputs, apiKey: string): Promise<SocialPost[]> => {
  if (!apiKey) throw new Error("API Key is missing");
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are an expert social media manager.
    Create a 30-day content calendar for the following client:
    - Niche/Industry: ${inputs.niche}
    - Target Audience: ${inputs.audience}
    - Brand Tone: ${inputs.tone}
    - Primary Call to Action: ${inputs.cta}
    - Primary Platform: ${inputs.platform}

    For each day, provide:
    1. A creative caption optimized for ${inputs.platform}.
    2. A list of 10-15 relevant hashtags.
    3. A suggested posting time (e.g. "Tuesday 9:00 AM").

    Return strictly a JSON array of objects.
  `;

  const responseSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        day: { type: Type.INTEGER },
        caption: { type: Type.STRING },
        hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
        scheduleTime: { type: Type.STRING },
        platformSuggestion: { type: Type.STRING }
      },
      required: ["day", "caption", "hashtags", "scheduleTime"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as SocialPost[];
  } catch (error) {
    console.error("Error generating posts:", error);
    throw error;
  }
};

/**
 * Generates short-form video scripts.
 */
export const generateVideoScripts = async (inputs: UserInputs, apiKey: string): Promise<VideoScript[]> => {
  if (!apiKey) throw new Error("API Key is missing");
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Create 5 viral short-form video scripts (Reels/TikTok/Shorts) for:
    - Niche: ${inputs.niche}
    - Tone: ${inputs.tone}
    - Goal: ${inputs.cta}

    Each script must be concise, engaging, and ready for production.
    
    CRITICAL INSTRUCTIONS:
    1. TIMING: You MUST include specific timing cues (e.g., "0-3s:", "3-15s:") at the start of the 'hook' and 'body' sections.
    2. VISUALS: Describe the scene vividly. Suggest specific shot types (e.g., "Close-up", "Wide shot", "POV", "Split-screen", "Drone shot") and camera movements (e.g. "Pan left", "Zoom in").
    3. MUSIC: Suggest a specific background music track style, genre, or mood (e.g., "Upbeat Pop", "Lo-Fi Chill", "Suspenseful build-up").

    Return strictly a JSON array.
  `;

  const responseSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        title: { type: Type.STRING },
        hook: { type: Type.STRING, description: "First 3s text/audio with timing cues e.g. '0-3s: Stop doing this!'" },
        body: { type: Type.STRING, description: "Main content/story with timing cues e.g. '3-15s: Here is why...'" },
        cta: { type: Type.STRING, description: "Closing call to action" },
        visuals: { type: Type.STRING, description: "Visual description including shot types e.g. 'Close-up of hands typing'" },
        duration: { type: Type.STRING, description: "Estimated duration e.g. '15s'" },
        music: { type: Type.STRING, description: "Background music suggestion e.g. 'Upbeat Lo-Fi'" }
      },
      required: ["title", "hook", "body", "cta", "visuals", "duration", "music"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as VideoScript[];
  } catch (error) {
    console.error("Error generating scripts:", error);
    throw error;
  }
};