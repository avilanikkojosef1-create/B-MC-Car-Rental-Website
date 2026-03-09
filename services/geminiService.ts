import { GoogleGenAI } from "@google/genai";
import { CAR_FLEET } from "../constants";

const SYSTEM_INSTRUCTION = `
You are "B&MC AI", the expert concierge for B&MC CAR RENTAL Tacloban located in Tacloban City.
Your goal is to help customers choose the perfect vehicle from our specific fleet.

Business Details:
- Service Area: Tacloban, Leyte, and Samar ONLY.
- Address: Brgy 74 Nula tula Tacloban City, Tacloban City, Philippines, 6500
- Phone: 0926 841 6776
- Starting Price: 1488 PHP.
- USP: No hidden fees, 24/7 support.

Fleet Data:
${JSON.stringify(CAR_FLEET)}

Rules:
1. ONLY recommend cars from the provided list (Wigo, Vios, Rush, Livina, Avanza, Xpander, Innova, Montero, Terra, Urvan, Triton, Navarra, L300).
2. If asking about locations, confirm we serve Leyte and Samar (including crossing San Juanico Bridge).
3. Be professional and enthusiastic.
4. Keep responses under 100 words.
`;

export const getCarRecommendation = async (userQuery: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userQuery,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "I'm sorry, I couldn't process that request right now. Please browse our fleet manually.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the garage mainframe. Please try again later.";
  }
};
