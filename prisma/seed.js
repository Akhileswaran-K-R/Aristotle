import prisma from "../src/prisma/client.js";
import { Priority, Status } from "../src/generated/prisma/enums.ts";

async function main() {
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  console.log("🌱 Sentinel is seeding the database...");

  // 1. Create a Dummy User (The Developer)
  const user = {
    id: "cmlxaqlme00011wez81ogqr1d",
  };

  // 2. Create a "GenAI Project" with nested Tasks and Subtasks
  const now = new Date();

  // 3. PROJECT A: THE AI PROJECT (Active & High Stakes)
  await prisma.project.create({
    data: {
      name: "Aether-OS Core",
      description:
        "AI-augmented project management. Building the Sentinel engine.",
      githubUrl: "https://github.com/SkelluAKR/Aether-OS",
      healthScore: 78,
      tasks: {
        create: [
          {
            title: "Phase 1: Multi-Agent Consensus",
            description:
              "Finalize the debate logic between Architect and Security agents.",
            status: Status.IN_PROGRESS,
            difficulty: "Hard",
            dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            subtasks: {
              create: [
                {
                  title: "Refine System Prompts",
                  bounty: 50,
                  priority: Priority.HIGH,
                  status: Status.COMPLETED,
                  assigneeId: user.id,
                },
                {
                  title: "Implement JSON Schema Validation",
                  bounty: 100,
                  priority: Priority.HIGH,
                  status: Status.OPEN,
                },
                {
                  title: "Rate Limiting for Gemini API",
                  bounty: 30,
                  priority: Priority.LOW,
                  status: Status.OPEN,
                },
              ],
            },
          },
          {
            title: "Phase 2: GitHub Bridge",
            description:
              "Connect the Materialization service to GitHub Octokit.",
            status: Status.OPEN,
            difficulty: "Medium",
            dueDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // OVERDUE by 1 day
            subtasks: {
              create: [
                {
                  title: "Webhook Secret Verification",
                  bounty: 80,
                  priority: Priority.MEDIUM,
                  status: Status.OPEN,
                },
                {
                  title: "Repo Template Setup",
                  bounty: 40,
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

  // 4. PROJECT B: THE FINTECH PROJECT (Bounty Heavy)
  await prisma.project.create({
    data: {
      name: "Lumina Pay",
      description: "DeFi payment gateway for micro-bounties.",
      githubUrl: "https://github.com/SkelluAKR/Lumina",
      healthScore: 92,
      tasks: {
        create: [
          {
            title: "Smart Contract Audit",
            description: "Internal audit of the bounty distribution contract.",
            status: Status.OPEN,
            difficulty: "Hard",
            dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
            subtasks: {
              create: [
                {
                  title: "Re-entrancy Check",
                  bounty: 300,
                  priority: Priority.CRITICAL || Priority.HIGH,
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

  // 5. PROJECT C: THE COMPLETED PROJECT (Health = 100)
  await prisma.project.create({
    data: {
      name: "Nexus Docs",
      description: "Markdown documentation generator for startups.",
      githubUrl: "https://github.com/SkelluAKR/Nexus",
      healthScore: 100,
      tasks: {
        create: [
          {
            title: "MVP Launch",
            description: "Release initial documentation parser.",
            status: Status.COMPLETED,
            difficulty: "Easy",
            dueDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
            subtasks: {
              create: [
                {
                  title: "Markdown Parser",
                  bounty: 100,
                  priority: Priority.HIGH,
                  status: Status.COMPLETED,
                  assigneeId: user.id,
                },
                {
                  title: "CLI Tooling",
                  bounty: 50,
                  priority: Priority.MEDIUM,
                  status: Status.COMPLETED,
                  assigneeId: user.id,
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
