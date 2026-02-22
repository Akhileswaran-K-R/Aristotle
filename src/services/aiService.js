import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateProjectRoadmap = async (prompt) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  });

  const systemInstruction = `
    You are the Aether-OS Sentinel Mentor, a Senior Software Architect. 
    Analyze the user's startup idea and output a JSON object with:
    1. 'files': A map of file paths to initial boilerplate code.
    2. 'tasks': An array of objects with 'title', 'description', 'bounty' (integer 50-500), and 'difficulty'.
    3. 'summary': A brief architectural overview.
    
    Focus on a modern stack: Vite/React frontend, Node.js backend, and Prisma.
  `;

  const result = await model.generateContent(
    `${systemInstruction}\n\nUser Idea: ${prompt}`,
  );
  return JSON.parse(result.response.text());
};
