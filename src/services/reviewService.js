import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeCodeChanges = async (diffText, repoName) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: `You are the Aether-OS Sentinel Code Auditor. 
    Analyze the following Git diff for the repository: ${repoName}.
    Focus on:
    1. Security vulnerabilities (hardcoded keys, injection).
    2. Logic errors or performance bottlenecks.
    3. Maintainability and adherence to clean code.
    Provide your review in a concise, bulleted format.`,
  });

  const prompt = `Review this code change:\n\n${diffText}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};
