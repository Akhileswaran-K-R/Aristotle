-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "agentSummaries" JSONB,
ADD COLUMN     "architecturalIntegrity" DOUBLE PRECISION,
ADD COLUMN     "auditDecision" TEXT,
ADD COLUMN     "auditRunId" TEXT,
ADD COLUMN     "auditScore" DOUBLE PRECISION,
ADD COLUMN     "blockingIssues" TEXT[],
ADD COLUMN     "chiefReasoning" TEXT,
ADD COLUMN     "driftPercentage" DOUBLE PRECISION,
ADD COLUMN     "governanceRisk" DOUBLE PRECISION,
ADD COLUMN     "refactorCostSprints" DOUBLE PRECISION,
ADD COLUMN     "requiresRevision" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "scalabilityReadiness" DOUBLE PRECISION;
