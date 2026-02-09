
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { LottoResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function checkLottoTicket(base64Image: string): Promise<LottoResult> {
  const model = 'gemini-3-flash-preview';

  const prompt = `
    You are an expert analyst for the Korean Lotto 6/45.
    Please extract and analyze the following from the provided image:
    1. Draw number (e.g., 1100)
    2. The 6-number sets for each printed row (A, B, C, D, E)
    
    Then, use the 'googleSearch' tool to find the official winning numbers and the bonus number for that specific draw.
    Based on the search results, determine the prize rank for each row on the ticket.
    
    Prize Criteria:
    - 1st Rank: 6 numbers match
    - 2nd Rank: 5 numbers match + Bonus number match
    - 3rd Rank: 5 numbers match
    - 4th Rank: 4 numbers match
    - 5th Rank: 3 numbers match
    
    The response MUST be in JSON format with this structure:
    {
      "drawNumber": "Number only",
      "winningNumbers": [array of 6 numbers],
      "bonusNumber": number,
      "ticketRows": [
        {
          "label": "A/B/C...",
          "numbers": [array of 6 numbers],
          "matchCount": number of matching main numbers,
          "hasBonus": boolean,
          "rank": rank (1-5, or 0 if no prize),
          "prize": "Estimated prize amount or status"
        }
      ],
      "summary": "Overall result summary (e.g., 'Won 5th place!')"
    }
  `;

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [imagePart, { text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const resultData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Official Source',
      uri: chunk.web?.uri || '#'
    })) || [];

    return {
      ...resultData,
      sources
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
