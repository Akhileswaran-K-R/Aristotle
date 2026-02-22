// routes/webhook.js
app.post("/webhook", async (req, res) => {
  const { repository, commits } = req.body;

  // 1. Fetch changed files
  const code = await fetchRepoContent(repository.full_name);

  // 2. Ask Gemini for a "Health Check"
  const debt = await model.generateContent(
    `Analyze this code for technical debt: ${code}`,
  );

  // 3. Auto-create a bounty task if complexity is high
  if (debt.score > 7) {
    await prisma.task.create({
      data: {
        title: "Refactor: High Complexity",
        bounty: 50,
        projectId: repository.id,
      },
    });
  }

  res.sendStatus(200);
});
