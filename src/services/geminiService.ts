import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeSurfVideo(videoBase64: string, trainingPlanImageBase64: string) {
  const model = "gemini-3.1-pro-preview";
  
  const prompt = `
    Act as a world-class surfing coach. 
    You are analyzing a weekly submission from your student, Noy.
    
    I have provided two pieces of context:
    1. A video of Noy surfing at a wave pool.
    2. An image of his current training roadmap/plan.
    
    The training plan highlights:
    - Equipment: 6.6 with 41L.
    - Goal: Surf like Harley (Power, Sharp turns, Speed, Flow).
    - Focus Point 1: Bottom Turn (Stay lower longer, stay lower after takeoff, generate speed).
    - Focus Point 2: Backside Carve.
    - Current issue: Knees are straight, power from ankles (inefficient).
    
    Please provide:
    1. **Session Summary**: What did he do well?
    2. **Technical Breakdown**: Analyze his bottom turn and carve based on the training plan. Is he staying low? Are his knees still too straight?
    3. **The Decision**: How should we approach this week's submission? Should we stick to the current drills or move to the next step?
    4. **Coach's Pep Talk**: A short, motivating message in a "master surfer" persona.
    
    Format the response in clean Markdown.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "video/mp4",
              data: videoBase64,
            },
          },
          {
            inlineData: {
              mimeType: "image/png",
              data: trainingPlanImageBase64,
            },
          },
        ],
      },
    ],
  });

  return response.text;
}
