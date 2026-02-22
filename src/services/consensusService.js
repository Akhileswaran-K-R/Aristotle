import { generateAIResponse } from "./aiService.js"; // Refactor your existing code into a generic helper

export const getConsensusArchitecture = async (userIdea) => {
  console.log("🚀 Starting Agentic Debate for:", userIdea);

  // 1. PHASE 1: The Performance Architect (Initial Draft)
  const architectPrompt = `You are a Senior Performance Architect. Propose a high-level file structure and task list for this idea: "${userIdea}". Focus on speed, clean code, and modern libraries.`;
  const draft = await generateAIResponse(architectPrompt);

  // 2. PHASE 2: The Security Sentinel (Critique)
  const securityPrompt = `You are a Cyber Security Auditor. Review the following architecture for vulnerabilities, data leaks, and bad auth patterns: ${JSON.stringify(draft)}. List only critical flaws and required fixes.`;
  const securityCritique = await generateAIResponse(securityPrompt);

  // 3. PHASE 3: The Consolidator (Final Consensus)
  // This agent resolves the conflict and outputs the FINAL JSON
  const finalPrompt = `
    User Idea: ${userIdea}
    Architect Draft: ${draft}
    Security Feedback: ${securityCritique}
    
    You are the Pragmatic CTO. Resolve all conflicts and output the FINAL JSON.
    
    STRICT JSON STRUCTURE REQUIRED:
    {
      "summary": "...",
      "files": { "path/to/file": "content" },
      "tasks": [
        {
          "title": "...",
          "description": "...",
          "difficulty": "Easy|Medium|Hard",
          "dueDate": "ISO string (3-7 days from now)",
          "subtasks": [
            {
              "title": "...",
              "description": "...",
              "bounty": integer,
              "priority": "LOW|MEDIUM|HIGH"
            }
          ]
        }
      ]
    }
  `;

  const finalConsensus = await generateAIResponse(finalPrompt, true); // True flag for structured JSON output
  return finalConsensus;
};
