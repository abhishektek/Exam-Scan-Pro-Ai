
import { GoogleGenAI, Type } from "@google/genai";
import { OCRResult } from "../types";

export const extractQuestionsFromImage = async (base64Image: string): Promise<OCRResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure it in your environment.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Using gemini-3-flash-preview for speed and efficiency in OCR tasks
  const model = "gemini-3-flash-preview";

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: base64Image.split(',')[1] || base64Image,
            },
          },
          {
            text: `You are a high-precision academic OCR system. 
            Extract all questions from this exam paper image.
            
            RULES:
            1. Handle nested numbering (e.g., Q1 -> a) -> i)).
            2. Identify multiple choice options and mark them in the options array.
            3. Detect point values/marks if mentioned.
            4. Clean up the text: ensure math symbols are correctly typed (e.g. use ² for squares).
            5. Provide a full raw text version for reference.
            6. OUTPUT ONLY VALID JSON.`,
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                questionNumber: { type: Type.STRING },
                text: { type: Type.STRING },
                points: { type: Type.STRING },
                correctAnswer: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING },
                      text: { type: Type.STRING }
                    },
                    required: ["label", "text"]
                  }
                },
                subQuestions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      label: { type: Type.STRING },
                      text: { type: Type.STRING }
                    },
                    required: ["id", "label", "text"]
                  }
                }
              },
              required: ["id", "questionNumber", "text"]
            }
          },
          rawText: { type: Type.STRING }
        },
        required: ["questions", "rawText"]
      }
    }
  });

  const result = response.text;
  if (!result) throw new Error("Empty response from Gemini AI.");

  try {
    return JSON.parse(result) as OCRResult;
  } catch (err) {
    console.error("JSON Parsing failed", result);
    throw new Error("Failed to parse structure from image. Try a clearer photo.");
  }
};
