// src/services/consensusService.js
import { generateAIResponse } from "./aiService.js";

export const getConsensusArchitecture = async (userIdea) => {
  // 1. Initial Draft (The Performance Optimist)
  const draft = await generateAIResponse(
    userIdea,
    "You are a Performance Specialist. Focus on speed.",
  );

  // 2. The Critique (The Security Sentinel)
  const securityCritique = await generateAIResponse(
    `Critique this architecture for security flaws: ${draft}`,
    "You are a Cyber Security Expert.",
  );

  // 3. The Refinement (The Pragmatic CTO)
  const finalConsensus = await generateAIResponse(
    `Initial Idea: ${userIdea}\nDraft: ${draft}\nSecurity Feedback: ${securityCritique}\n
     Create a final, balanced JSON architecture that addresses the feedback.`,
    "You are a Pragmatic CTO. Create the final consensus.",
  );

  return JSON.parse(finalConsensus);
};
