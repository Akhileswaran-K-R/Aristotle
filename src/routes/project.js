import express from "express";
import prisma from "../prisma/client.js";
import { generateProjectRoadmap } from "../services/aiService.js";
import { materializeGitHubRepo } from "../services/githubService.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  if (!req.isAuthenticated())
    return res.status(401).json({ message: "Auth required" });

  const { idea, repoName } = req.body;

  try {
    // 1. Ask the Mentor for the Blueprint
    const blueprint = await generateProjectRoadmap(idea);

    // 2. Push to GitHub (Assumes you've stored user's GitHub Token or use a System Token)
    const githubUrl = await materializeGitHubRepo(
      process.env.GITHUB_TOKEN,
      repoName,
      blueprint.files,
    );

    // 3. Save Project & Tasks to DB
    const project = await prisma.project.create({
      data: {
        name: repoName,
        description: blueprint.summary,
        githubUrl: githubUrl,
        tasks: {
          create: blueprint.tasks.map((task) => ({
            title: task.title,
            description: task.description,
            bounty: task.bounty,
            difficulty: task.difficulty,
          })),
        },
      },
      include: { tasks: true },
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
