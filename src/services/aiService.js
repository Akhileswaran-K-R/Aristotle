import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateAIResponse = async (prompt, isFinal = false) => {
  // Use Gemini 3 Flash for the fastest, most capable agentic reasoning
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash",
    generationConfig: isFinal ? { responseMimeType: "application/json" } : {},
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return isFinal ? JSON.parse(text) : text;
};
