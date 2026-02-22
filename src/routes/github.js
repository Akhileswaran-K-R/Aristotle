import express from "express";
import { Octokit } from "@octokit/rest";
import prisma from "../prisma/client.js";

const router = express.Router();

router.get("/:projectId/stats", async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project?.githubUrl)
      return res.status(404).json({ error: "No GitHub URL linked." });

    // Parse owner and repo from URL: https://github.com/owner/repo
    const [owner, repo] = project.githubUrl.split("github.com/")[1].split("/");
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    // 1. Fetch Pull Requests (for Cycle Time)
    const { data: pulls } = await octokit.pulls.list({
      owner,
      repo,
      state: "closed",
      per_page: 20,
    });

    // 2. Fetch Issues (for Work Items & Bugs)
    const { data: issues } = await octokit.issues.listForRepo({
      owner,
      repo,
      state: "all",
    });

    // 3. Fetch Workflow Runs (for Deployment Frequency)
    const { data: runs } = await octokit.actions.listWorkflowRunsForRepo({
      owner,
      repo,
      per_page: 30,
    });

    // --- CALCULATION LOGIC ---

    // A. PR Cycle Time (Avg time from creation to merge in hours)
    const mergedPRs = pulls.filter((pr) => pr.merged_at);
    const avgCycleTime =
      mergedPRs.reduce((acc, pr) => {
        const duration =
          (new Date(pr.merged_at) - new Date(pr.created_at)) / (1000 * 60 * 60);
        return acc + duration;
      }, 0) / (mergedPRs.length || 1);

    // B. Deployment Frequency (Successful production runs in last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const deployCount = runs.workflow_runs.filter(
      (run) =>
        run.status === "completed" &&
        run.conclusion === "success" &&
        new Date(run.created_at) > weekAgo,
    ).length;

    // C. Vulnerabilities (Using GitHub Security Alerts)
    // Note: Requires 'security_events' scope in Token
    let vulnerabilities = 0;
    try {
      const { data: alerts } = await octokit.dependabot.listAlertsForRepo({
        owner,
        repo,
        state: "open",
      });
      vulnerabilities = alerts.length;
    } catch (e) {
      console.log("Security alerts access denied.");
    }

    res.json({
      velocity: {
        cycleTimeHours: avgCycleTime.toFixed(2),
        deploymentFrequency: deployCount,
        activePullRequests: pulls.filter((p) => p.state === "open").length,
      },
      workItems: {
        total: issues.length,
        bugs: issues.filter((i) =>
          i.labels.some((l) => l.name.toLowerCase().includes("bug")),
        ).length,
        open: issues.filter((i) => i.state === "open").length,
      },
      security: {
        openVulnerabilities: vulnerabilities,
        healthRating: vulnerabilities === 0 ? "SECURE" : "AT RISK",
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
