
import { GoogleGenAI, Type } from "@google/genai";
import { OCRResult } from "../types";

export const extractQuestionsFromImage = async (base64Image: string): Promise<OCRResult> => {
  // Always use the latest API key from environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-pro-preview";

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/png',
            data: base64Image.split(',')[1] || base64Image,
          },
        },
        {
          text: `You are a professional academic digitizer. Extract all questions from this exam paper image.
          Guidelines:
          1. Detect numbering like: 1, Q1, Part I, Section A, (a), (i).
          2. NESTED STRUCTURES: If a question has sub-parts, extract them into the subQuestions array.
          3. MULTIPLE CHOICE: Map options (A, B, C, D) clearly.
          4. TEXT CLEANING: Fix common OCR errors in math symbols (e.g., change 'x2' to 'x²' if appropriate).
          5. RAW TEXT: Provide the full extracted text of the entire document.
          6. FORMAT: Strict JSON only. No markdown formatting.`,
        },
      ],
    },
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

  const text = response.text;
  if (!text) throw new Error("Could not extract text from image.");

  try {
    return JSON.parse(text) as OCRResult;
  } catch (e) {
    console.error("JSON Parse Error", text);
    throw new Error("The AI response was not in a valid format. Please try again.");
  }
};
