import express from "express";
import prisma from "../prisma/client.js";
import { getConsensusArchitecture } from "../services/consensusService.js";
import { materializeGitHubRepo } from "../services/githubService.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  // 1. Auth Guard
  if (!req.isAuthenticated()) {
    return res
      .status(401)
      .json({ message: "Sentinel requires authentication." });
  }

  const { idea, repoName } = req.body;

  try {
    // 2. Multi-Agent Consensus Phase
    // Instead of one AI, this triggers the Architect -> Security -> CTO debate.
    const blueprint = await getConsensusArchitecture(idea);

    // 3. Physical Materialization Phase
    // Materializes the "surviving" architecture directly to GitHub.
    const githubUrl = await materializeGitHubRepo(
      process.env.GITHUB_TOKEN,
      repoName,
      blueprint.files,
    );

    // 4. Persistence Layer (Prisma)
    const project = await prisma.project.create({
      data: {
        name: repoName,
        description: blueprint.summary,
        githubUrl: githubUrl,
        tasks: {
          create: blueprint.tasks.map((task) => ({
            title: task.title,
            description: task.description,
            difficulty: task.difficulty,
            dueDate: new Date(task.dueDate), // Convert ISO string to Date object
            subtasks: {
              create: task.subtasks.map((sub) => ({
                title: sub.title,
                description: sub.description,
                bounty: sub.bounty,
                priority: sub.priority,
              })),
            },
          })),
        },
      },
      include: {
        tasks: {
          include: { subtasks: true }, // Return the full tree to the frontend
        },
      },
    });

    // 5. Success Response
    res.status(201).json({
      message: "Consensus reached. Repository materialized.",
      project,
    });
  } catch (error) {
    console.error("Sentinel Error:", error.message);
    res.status(500).json({
      error: "The Council failed to reach consensus.",
      details: error.message,
    });
  }
});

// GET /projects - Fetch all projects for the logged-in user
router.get("/", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res
      .status(401)
      .json({ message: "Sentinel requires authentication." });
  }
  try {
    const userId = req.user.id;

    const projects = await prisma.project.findMany({
      where: {
        tasks: {
          some: {
            assigneeId: userId,
          },
        },
      },
      include: {
        tasks: {
          orderBy: { dueDate: "asc" }, // Order tasks by urgency
          include: {
            subtasks: {
              orderBy: { priority: "desc" }, // Show High priority subtasks first
            },
            _count: {
              select: { subtasks: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(projects);
  } catch (error) {
    console.error("Fetch Projects Error:", error);
    res.status(500).json({ error: "Could not retrieve projects." });
  }
});

// GET /projects/:id - Fetch a single project with full hierarchy
router.get("/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res
      .status(401)
      .json({ message: "Sentinel requires authentication." });
  }
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        tasks: {
          include: {
            subtasks: {
              include: {
                assignee: {
                  // Optionally include who is working on what subtask
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
