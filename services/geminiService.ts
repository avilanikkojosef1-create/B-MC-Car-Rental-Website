import { GoogleGenAI } from "@google/genai";
import { Car } from "../types";

const SYSTEM_INSTRUCTION = `
You are "B&MC AI", the expert concierge for B&MC CAR RENTAL Tacloban located in Tacloban City.
Your goal is to help customers choose the perfect vehicle from our fleet.

Business Details:
- Service Area: Tacloban, Leyte, and Samar ONLY.
- Address: Brgy 74 Nula tula Tacloban City, Tacloban City, Philippines, 6500
- Phone: 0926 841 6776
- Starting Price: 1488 PHP.
- USP: No hidden fees, 24/7 support.

Rules:
1. Recommend cars based on customer needs (Hatchbacks, Sedans, SUVs, Vans, Pickups).
2. If asking about locations, confirm we serve Leyte and Samar (including crossing San Juanico Bridge).
3. Be professional and enthusiastic.
4. Keep responses under 100 words.
`;

export const getCarRecommendation = async (userQuery: string, fleet: Car[] = []): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Construct fleet context
    const fleetContext = fleet.length > 0 
      ? `Current Available Fleet:\n${fleet.map(c => `- ${c.name} (${c.category}): ₱${c.pricePerDay}/day, ${c.seats} seats, ${c.transmission}`).join('\n')}`
      : "Fleet information is currently being updated in the garage.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${fleetContext}\n\nCustomer Query: ${userQuery}`,
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
