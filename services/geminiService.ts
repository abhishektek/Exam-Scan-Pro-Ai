
import { GoogleGenAI, Type } from "@google/genai";
import { OCRResult } from "../types";

// Only initialize the client inside the function call to ensure process.env.API_KEY is available when needed
export const extractQuestionsFromImage = async (base64Image: string): Promise<OCRResult> => {
  const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) || '';
  
  if (!apiKey) {
    console.warn("Gemini API Key is missing. Check your environment settings.");
  }

  const ai = new GoogleGenAI({ apiKey });
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
          text: `Extract all academic questions from this exam paper image. 
          Handle complex structures with high precision:
          1. Identify different numbering schemes: Arabic (1, 2), Roman (I, II, III, IV), and Alphabetical (A, B, C or a, b, c).
          2. Detect nested questions/sub-questions (e.g., if Question 1 has parts a, b, and c).
          3. Capture bullet points or lists within a question's main text.
          4. For multiple-choice questions, map options (A, B, C, D) clearly.
          5. Identify marks/points associated with each question.
          6. Return ONLY a valid JSON object. Do not include markdown headers.`,
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
                questionNumber: { type: Type.STRING, description: "The label, e.g., '1', 'Q1', 'Part I'" },
                text: { type: Type.STRING, description: "The main body of the question" },
                points: { type: Type.STRING },
                correctAnswer: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING, description: "e.g., 'A', 'B'" },
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
                      label: { type: Type.STRING, description: "e.g., '(a)', '(i)'" },
                      text: { type: Type.STRING }
                    },