import express from "express";
import { Octokit } from "@octokit/rest";
import { analyzeCodeChanges } from "../services/reviewService.js";
import prisma from "../prisma/client.js"; // Ensure prisma is imported

const router = express.Router();
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

router.post("/github-push", async (req, res) => {
  const payload = req.body;
  const io = req.app.get("io"); // 🔌 Grab the socket instance from server.js

  // 1. Verify this is a push event with actual commits
  if (!payload.commits || payload.commits.length === 0) {
    return res.status(200).send("No commits to review.");
  }

  try {
    const owner =
      payload.repository.owner.login || payload.repository.owner.name;
    const repo = payload.repository.name;
    const fullName = payload.repository.full_name; // e.g., "SkelluAKR/Aether-OS"
    const before = payload.before;
    const after = payload.after;

    // 2. Identify the Project in your Database
    // This allows the webhook to work for ANY repo linked in your DB
    const project = await prisma.project.findFirst({
      where: {
        githubUrl: {
          contains: fullName,
        },
      },
    });

    if (!project) {
      console.warn(`⚠️ Webhook received for unlinked repo: ${fullName}`);
      return res.status(404).send("Project not found in Aether-OS database.");
    }

    // 3. Fetch the Diff from GitHub
    const { data: comparison } = await octokit.repos.compareCommits({
      owner,
      repo,
      base: before,
      head: after,
      headers: { accept: "application/vnd.github.v3.diff" },
    });

    // 4. AI Analysis
    const review = await analyzeCodeChanges(comparison, repo);

    // 5. Emit to the specific Frontend Room
    // Using project.id ensures only users on the specific project page see it
    if (io) {
      io.to(project.id).emit("new-ai-review", {
        projectId: project.id,
        repo: repo,
        review: review,
        commitHash: after.substring(0, 7),
        author: payload.pusher.name,
        timestamp: new Date(),
      });
      console.log(`📡 Live review pushed to room: ${project.id}`);
    }

    // 6. Optional: Still post back to GitHub as a comment
    await octokit.repos.createCommitComment({
      owner,
      repo,
      commit_sha: after,
      body: `🛡️ **Sentinel AI Code Review:**\n\n${review}`,
    });

    res.status(200).json({ message: "Review completed and broadcasted." });
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).send("Review failed.");
  }
});

export default router;
