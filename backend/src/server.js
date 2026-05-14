const express = require("express");
const cors = require("cors");
const axios = require("axios");
const crypto = require("crypto");

const app = express();
const atsCache = new Map();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend running");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    services: {
      jobs: "remoteok",
      ats: "deterministic-provider-layer",
      cache: `${atsCache.size} ats entries`,
    },
  });
});

// Job API
app.get("/api/jobs/fetch", async (req, res) => {
  try {
    const response = await axios.get("https://remoteok.com/api");

    const seen = new Set();
    const jobs = response.data
      .slice(1)
      .map(normalizeRemoteOkJob)
      .filter((job) => {
        if (seen.has(job.dedupHash)) return false;
        seen.add(job.dedupHash);
        return true;
      });

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

app.post("/api/ats/analyze", async (req, res) => {
  try {
    const {
      resumeText = "",
      jobDescription = "",
      provider = "GPT-4o",
      bypassCache = false,
    } = req.body || {};

    if (!resumeText.trim() || !jobDescription.trim()) {
      return res.status(400).json({
        error: "resumeText and jobDescription are required",
      });
    }

    const cacheKey = crypto
      .createHash("sha256")
      .update(`${resumeText}\n---JD---\n${jobDescription}`)
      .digest("hex");

    if (!bypassCache && atsCache.has(cacheKey)) {
      return res.json({
        ...atsCache.get(cacheKey),
        cacheKey,
        cached: true,
        provider,
      });
    }

    const analysis = analyzeAts(resumeText, jobDescription);
    const result = {
      ...analysis,
      provider,
      cacheKey,
      cached: false,
      generatedAt: new Date().toISOString(),
      modelConfig: {
        temperature: 0,
        mode: "deterministic-local-provider",
      },
    };

    atsCache.set(cacheKey, result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to analyze ATS inputs" });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeRemoteOkJob(job) {
  const title = job.position || "Untitled role";
  const company = job.company || "Unknown company";
  const location = job.location || "Remote";
  const description = stripHtml(job.description || "");
  const salaryMin = Number(job.salary_min) || undefined;
  const salaryMax = Number(job.salary_max) || undefined;
  const type = job.job_type || inferJobType(description);
  const dedupHash = crypto
    .createHash("sha256")
    .update(`${company}:${title}:${location}`.toLowerCase())
    .digest("hex");

  return {
    id: String(job.id || dedupHash),
    title,
    company,
    location,
    type,
    experienceLevel: inferExperienceLevel(`${title} ${description}`),
    salaryMin,
    salaryMax,
    dedupHash,
    salaryRange:
      salaryMin && salaryMax
        ? `$${salaryMin.toLocaleString()}-$${salaryMax.toLocaleString()}`
        : undefined,
    description,
    sourceUrl: job.url,
    tags: Array.isArray(job.tags) ? job.tags : [],
  };
}

function inferJobType(text) {
  const lowerText = text.toLowerCase();
  if (lowerText.includes("contract")) return "Contract";
  if (lowerText.includes("hybrid")) return "Hybrid";
  if (lowerText.includes("remote")) return "Remote";
  return "Full-time";
}

function inferExperienceLevel(text) {
  const lowerText = text.toLowerCase();
  if (lowerText.includes("principal") || lowerText.includes("staff")) return "Lead";
  if (lowerText.includes("senior") || lowerText.includes("sr.")) return "Senior";
  if (lowerText.includes("junior") || lowerText.includes("entry")) return "Entry";
  return "Mid";
}

function analyzeAts(resume, jobDescription) {
  const resumeKeywords = tokenize(resume);
  const jdKeywords = [...tokenize(jobDescription)].slice(0, 32);
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

function tokenize(text) {
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

  return new Set(
    String(text)
      .toLowerCase()
      .split(/[^a-z0-9+#.]+/)
      .map((word) => word.trim())
      .filter((word) => word.length > 2 && !stopWords.has(word))
  );
}

function buildSuggestions(resume, missingKeywords) {
  const bullets = String(resume)
    .split(/\n+/)
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter((line) => line.length > 24)
    .slice(0, 3);
  const targets =
    missingKeywords.length > 0 ? missingKeywords : ["impact", "scale", "delivery"];

  return bullets.map((bullet, index) => {
    const keyword = targets[index % targets.length];

    return {
      id: `suggestion-${index}`,
      original: bullet,
      rewrite: `${bullet.replace(/\.$/, "")}; emphasized ${keyword}, measurable ownership, and production impact.`,
    };
  });
}

function buildHeatmap(resume, matchedKeywords) {
  const sections = ["summary", "experience", "projects", "skills"];
  const lowerResume = String(resume).toLowerCase();

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
