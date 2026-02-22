import prisma from "../src/prisma/client.js";
import { Priority, Status } from "../src/generated/prisma/enums.ts";

async function main() {
  // 1. Clean up existing data (Order matters for Foreign Keys)
  await prisma.subtask.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();

  console.log(
    "🌱 Sentinel is seeding the database with Governance & Audit data...",
  );

  const userId = "cmlxs2ett00001eev8ripcidp";
  const now = new Date();

  // 2. PROJECT A: AI PROJECT (Detailed Audit Data)
  await prisma.project.create({
    data: {
      name: "Ecommerce",
      description: "AI-augmented IV management. Building the Sentinel engine.",
      githubUrl: "https://github.com/SkelluAKR/E-commerce1",
      healthScore: 78,
      // --- New Schema Fields ---
      auditDecision: "APPROVE",
      auditScore: 88.5,
      governanceRisk: 12.0,
      architecturalIntegrity: 95.0,
      scalabilityReadiness: 82.0,
      driftPercentage: 5.4,
      refactorCostSprints: 1.5,
      blockingIssues: ["Incomplete JSON Schema for Agent handoffs"],
      chiefReasoning:
        "The multi-agent consensus protocol is robust, but the lack of strict schema validation between the Architect and Security agents could lead to drift.",
      agentSummaries: {
        architect:
          "Solid monorepo structure, but needs better dependency management.",
        security:
          "Auth flow is secure; recommended adding rate limiting to prevent API abuse.",
        sentinel:
          "High performance potential. Milestone 1 is critical for stability.",
      },
      // --------------------------
      tasks: {
        create: [
          {
            title: "Phase 1: Multi-Agent Consensus",
            description:
              "Finalize the debate logic between Architect and Security agents.",
            status: Status.IN_PROGRESS,
            difficulty: "Hard",
            dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
            assigneeId: userId,
            subtasks: {
              create: [
                {
                  title: "Refine System Prompts",
                  bounty: 50,
                  priority: Priority.HIGH,
                  status: Status.COMPLETED,
                  assigneeId: userId,
                },
                {
                  title: "Implement JSON Schema Validation",
                  bounty: 100,
                  priority: Priority.HIGH,
                  status: Status.OPEN,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 3. PROJECT B: FINTECH PROJECT (Needs Revision / High Risk)
  await prisma.project.create({
    data: {
      name: "Lumina Pay",
      description: "DeFi payment gateway for micro-bounties.",
      githubUrl: "https://github.com/SkelluAKR/Lumina",
      healthScore: 65,
      // --- New Schema Fields ---
      auditDecision: "REVISE",
      auditScore: 62.0,
      governanceRisk: 45.0,
      requiresRevision: true,
      blockingIssues: [
        "Critical Re-entrancy risk in Smart Contract",
        "Insufficient logging",
      ],
      chiefReasoning:
        "Financial transactions require higher audit coverage. Security agent detected potential overflow in bounty distribution.",
      // --------------------------
      tasks: {
        create: [
          {
            title: "Smart Contract Audit",
            description: "Internal audit of the bounty distribution contract.",
            status: Status.OPEN,
            difficulty: "Hard",
            assigneeId: userId,
            dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
            subtasks: {
              create: [
                {
                  title: "Re-entrancy Check",
                  bounty: 300,
                  priority: Priority.HIGH,
                  status: Status.OPEN,
                },
                {
                  title: "Gas Optimization",
                  bounty: 150,
                  priority: Priority.MEDIUM,
                  status: Status.OPEN,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 4. PROJECT C: COMPLETED PROJECT
  await prisma.project.create({
    data: {
      name: "Nexus Docs",
      description: "Markdown documentation generator for startups.",
      healthScore: 100,
      auditDecision: "APPROVE",
      auditScore: 98.0,
      governanceRisk: 2.0,
      tasks: {
        create: [
          {
            title: "MVP Launch",
            status: Status.COMPLETED,
            assigneeId: userId,
            dueDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
            subtasks: {
              create: [
                {
                  title: "CLI Tooling",
                  bounty: 50,
                  priority: Priority.MEDIUM,
                  status: Status.COMPLETED,
                  assigneeId: userId,
                },
              ],
            },
          },
        ],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
