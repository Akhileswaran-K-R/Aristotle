import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getChatResponse = async (userMessage, projectContext = "") => {
  // Use Gemini 1.5 Flash for chat - it's fast and has a huge context window
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `
      You are the Aristotle AI Assistant. 
      Your goal is to help developers manage their startups.
      You have access to the current project context: ${projectContext}.
      Be concise, technical, and encouraging. 
      If a user asks about bounties, remind them to complete subtasks.
    `,
  });

  const chat = model.startChat({
    history: [], // You can pass previous messages here for memory
  });

  const result = await chat.sendMessage(userMessage);
  return result.response.text();
};
