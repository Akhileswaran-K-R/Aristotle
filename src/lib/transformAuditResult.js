// Maps FastAPI P0-P3 → your Priority enum
const PRIORITY_MAP = {
  P0: "HIGH",
  P1: "HIGH",
  P2: "MEDIUM",
  P3: "LOW",
};

const getDifficultyFromSprints = (sprints) => {
  if (sprints <= 1) return "Easy";
  if (sprints <= 3) return "Medium";
  return "Hard";
};

const getDueDateFromPriority = (priority) => {
  const daysMap = { P0: 3, P1: 4, P2: 5, P3: 7 };
  const date = new Date();
  date.setDate(date.getDate() + (daysMap[priority] ?? 5));
  return date;
};

// healthScore: derived from auditScore (0-100 → inverse of risk)
const deriveHealthScore = (auditResult) => {
  if (auditResult.final_score) return Math.round(auditResult.final_score);
  return 100;
};

export const transformAuditToPrisma = (auditResult, repoName, githubUrl) => {
  const {
    run_id,
    final_decision,
    final_score,
    governance_risk,
    architectural_integrity,
    scalability_readiness,
    requires_revision,
    blocking_issues,
    bounties,
    drift_percentage,
    refactor_cost_sprints,
    chief_reasoning,
    agent_summaries,
    project_description,
  } = auditResult;

  return {
    // Core
    name: repoName,
    description: project_description ?? "AI-generated project",
    githubUrl,
    healthScore: deriveHealthScore(auditResult),

    // Audit metadata
    auditRunId: run_id,
    auditDecision: final_decision,
    auditScore: final_score,
    governanceRisk: governance_risk,
    architecturalIntegrity: architectural_integrity,
    scalabilityReadiness: scalability_readiness,
    requiresRevision: requires_revision ?? false,
    driftPercentage: drift_percentage,
    refactorCostSprints: refactor_cost_sprints,
    blockingIssues: blocking_issues ?? [],
    chiefReasoning: chief_reasoning,
    agentSummaries: agent_summaries ?? {},

    // Bounties → Tasks → Subtasks using your exact enums
    tasks: {
      create: (bounties ?? []).map((bounty) => ({
        title: bounty.title,
        description: bounty.justification ?? "",
        difficulty: getDifficultyFromSprints(bounty.complexity),
        dueDate: getDueDateFromPriority(bounty.priority),
        status: "OPEN", // Status enum
        dependencies: [],

        subtasks: {
          create: [
            {
              title: `Implement: ${bounty.title}`,
              description:
                bounty.suggested_scaffolding ?? bounty.justification ?? "",
              bounty: Math.round(bounty.impact_score * 10), // 0-100 → 0-1000
              priority: PRIORITY_MAP[bounty.priority] ?? "MEDIUM", // Priority enum
              status: "OPEN", // Status enum
            },
          ],
        },
      })),
    },
  };
};
