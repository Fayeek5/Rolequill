import type { AppSettings, AtsAnalysis } from "../types";
import { apiBaseUrl } from "../config/api";
import { analyzeAts } from "../utils/textAnalysis";

type AtsRequest = {
  resumeText: string;
  jobDescription: string;
  provider: AppSettings["provider"];
  bypassCache?: boolean;
};

export async function analyzeResumeForJob({
  resumeText,
  jobDescription,
  provider,
  bypassCache = false,
}: AtsRequest): Promise<AtsAnalysis> {
  try {
    const response = await fetch(`${apiBaseUrl}/api/ats/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resumeText,
        jobDescription,
        provider,
        bypassCache,
      }),
    });

    if (!response.ok) {
      throw new Error(`ATS API returned ${response.status}`);
    }

    return (await response.json()) as AtsAnalysis;
  } catch (error) {
    console.error("ATS API unavailable, using local fallback:", error);

    return {
      ...analyzeAts(resumeText, jobDescription),
      provider,
      cached: false,
      generatedAt: new Date().toISOString(),
      modelConfig: {
        temperature: 0,
        mode: "local-browser-fallback",
      },
    };
  }
}

export async function fetchBackendHealth() {
  try {
    const response = await fetch(`${apiBaseUrl}/api/health`);
    if (!response.ok) throw new Error(`Health returned ${response.status}`);
    return response.json() as Promise<{
      status: string;
      services: Record<string, string>;
    }>;
  } catch (error) {
    console.error("Backend health unavailable:", error);
    return null;
  }
}
