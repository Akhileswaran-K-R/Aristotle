const FASTAPI_BASE = process.env.FASTAPI_BASE_URL;
console.log(FASTAPI_BASE);
const POLL_INTERVAL_MS = 4000;
const MAX_ATTEMPTS = 60; // 4 minutes max (audit pipeline is slow)

export const runAudit = async (payload) => {
  // 1. Start the job
  const startRes = await fetch(`${FASTAPI_BASE}/audit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!startRes.ok) {
    throw new Error(`Audit failed to start: ${await startRes.text()}`);
  }

  const { job_id, poll_url } = await startRes.json();
  console.log(`Audit job started: ${job_id}`);

  // 2. Poll until done
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

    const pollRes = await fetch(`${FASTAPI_BASE}${poll_url}`);
    if (!pollRes.ok) throw new Error(`Polling failed: ${await pollRes.text()}`);

    const job = await pollRes.json();
    console.log(
      `[${attempt}/${MAX_ATTEMPTS}] Job ${job_id} status: ${job.status}`,
    );

    if (job.status === "done") return job.result;
    if (job.status === "error") throw new Error(`Audit failed: ${job.error}`);
    // "queued" | "running" → keep polling
  }

  throw new Error(
    `Audit job timed out after ${(MAX_ATTEMPTS * POLL_INTERVAL_MS) / 1000}s`,
  );
};
