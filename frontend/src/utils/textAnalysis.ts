import type { AtsAnalysis, AtsSuggestion, Job } from "../types";

const stopWords = new Set([
  "and",
  "for",
  "the",
  "with",
  "from",
  "this",
  "that",
  "your",
  "you",
  "are",
  "our",
  "role",
  "job",
  "will",
  "shall",
  "into",
  "using",
  "about",
  "have",
  "has",
]);

export function tokenize(text: string) {
  return new Set(
    text
      .toLowerCase()
      .split(/[^a-z0-9+#.]+/)
      .map((word) => word.trim())
      .filter((word) => word.length > 2 && !stopWords.has(word))
  );
}

export function calculateMatchScore(job: Job, resumeKeywords: Set<string>) {
  const jobKeywords = tokenize(
    [job.title, job.description, ...(job.tags || [])].filter(Boolean).join(" ")
  );

  if (jobKeywords.size === 0 || resumeKeywords.size === 0) return 0;

  const matches = [...jobKeywords].filter((keyword) =>
    resumeKeywords.has(keyword)
  );

  return Math.min(100, Math.round((matches.length / jobKeywords.size) * 100));
}

export function analyzeAts(resume: string, jobDescription: string): AtsAnalysis {
  const resumeKeywords = tokenize(resume);
  const jdKeywords = [...tokenize(jobDescription)].slice(0, 28);
  const matchedKeywords = jdKeywords.filter((keyword) =>
    resumeKeywords.has(keyword)
  );
  const missingKeywords = jdKeywords
    .filter((keyword) => !resumeKeywords.has(keyword))
    .slice(0, 10);
  const score =
    jdKeywords.length === 0
      ? 0
      : Math.min(100, Math.round((matchedKeywords.length / jdKeywords.length) * 100));

  return {
    score,
    matchedKeywords,
    missingKeywords,
    suggestions: buildSuggestions(resume, missingKeywords),
    heatmap: buildHeatmap(resume, matchedKeywords),
  };
}

function buildSuggestions(resume: string, missingKeywords: string[]): AtsSuggestion[] {
  const bullets = resume
    .split(/\n+/)
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter((line) => line.length > 24)
    .slice(0, 3);
  const targets = missingKeywords.length > 0 ? missingKeywords : ["impact", "scale", "delivery"];

  return bullets.map((bullet, index) => {
    const keyword = targets[index % targets.length];

    return {
      id: `suggestion-${index}`,
      original: bullet,
      rewrite: `${bullet.replace(/\.$/, "")}; emphasized ${keyword}, measurable ownership, and production impact.`,
    };
  });
}

function buildHeatmap(resume: string, matchedKeywords: string[]) {
  const sections = ["summary", "experience", "projects", "skills"];
  const lowerResume = resume.toLowerCase();

  return sections.map((section, index) => {
    const keywords = matchedKeywords.filter((_keyword, keywordIndex) => {
      if (lowerResume.includes(section)) return keywordIndex % (index + 2) === 0;
      return keywordIndex % sections.length === index;
    });

    return {
      section,
      density: Math.min(100, 18 + keywords.length * 14),
      keywords,
    };
  });
}
