import prisma from "../src/prisma/client.js";

async function main() {
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  console.log("🌱 Sentinel is seeding the database...");

  // 1. Create a Dummy User (The Developer)
  const user = {
    id: "cmlx8cwfb0000psvnid65ptj9",
  };

  // 2. Create a "GenAI Project" with nested Tasks and Subtasks
  const project = await prisma.project.create({
    data: {
      name: "Aether-OS Core",
      description:
        "AI-augmented project management for high-velocity startups.",
      githubUrl: "https://github.com/SkelluAKR/Aether-OS",
      healthScore: 85,
      tasks: {
        create: [
          {
            title: "Architecture Materialization",
            description:
              "Implementing the GitHub API bridge for automated repo creation.",
            status: "IN_PROGRESS",
            difficulty: "Hard",
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            assigneeId: user.id,
            subtasks: {
              create: [
                {
                  title: "Octokit Tree API Integration",
                  description: "Handle multi-file commits without plugins.",
                  bounty: 150,
                  priority: "HIGH",
                  status: "COMPLETED",
                  assigneeId: user.id,
                },
                {
                  title: "GitHub Webhook HMAC Security",
                  description: "Verify signatures to prevent spoofing.",
                  bounty: 100,
                  priority: "MEDIUM",
                  status: "OPEN",
                },
              ],
            },
          },
          {
            title: "Sentinel Multi-Agent Consensus",
            description: "Coordinate the Architect and Security agents.",
            status: "OPEN",
            difficulty: "Medium",
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            subtasks: {
              create: [
                {
                  title: "Prompt Engineering for Consolidator",
                  description: "Refine the CTO agent's output format.",
                  bounty: 75,
                  priority: "MEDIUM",
                  status: "OPEN",
                },
                {
                  title: "Async Agent Pipeline",
                  description:
                    "Handle long-running LLM calls in the background.",
                  bounty: 125,
                  priority: "HIGH",
                  status: "OPEN",
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`✅ Seeded Project: ${project.name} with ID: ${project.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
