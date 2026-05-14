import { sampleJobs } from "../data/sampleJobs";
import type { Job } from "../types";

export async function fetchJobs() {
  try {
    const response = await fetch("http://localhost:5000/api/jobs/fetch");
    if (!response.ok) {
      throw new Error(`Job API returned ${response.status}`);
    }

    const data = await response.json();
    return normalizeJobs(data);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return sampleJobs;
  }
}

function normalizeJobs(data: unknown): Job[] {
  if (!Array.isArray(data)) return sampleJobs;

  const jobs = data
    .filter((job) => job && typeof job === "object")
    .map((job, index) => {
      const record = job as Record<string, unknown>;
      const title = String(record.title || record.position || "Untitled role");
      const company = String(record.company || "Unknown company");
      const location = String(record.location || "Remote");

      return {
        id: String(record.id || `${company}-${title}-${location}-${index}`),
        title,
        company,
        location,
        type: typeof record.type === "string" ? record.type : undefined,
        experienceLevel:
          typeof record.experienceLevel === "string"
            ? record.experienceLevel
            : undefined,
        salaryMin:
          typeof record.salaryMin === "number" ? record.salaryMin : undefined,
        salaryMax:
          typeof record.salaryMax === "number" ? record.salaryMax : undefined,
        dedupHash:
          typeof record.dedupHash === "string" ? record.dedupHash : undefined,
        salaryRange:
          typeof record.salaryRange === "string"
            ? record.salaryRange
            : typeof record.salary_range === "string"
              ? record.salary_range
              : undefined,
        description:
          typeof record.description === "string" ? record.description : undefined,
        sourceUrl:
          typeof record.sourceUrl === "string"
            ? record.sourceUrl
            : typeof record.source_url === "string"
              ? record.source_url
              : undefined,
        tags: Array.isArray(record.tags)
          ? record.tags.filter((tag): tag is string => typeof tag === "string")
          : undefined,
      };
    });

  return jobs.length > 0 ? jobs : sampleJobs;
}
