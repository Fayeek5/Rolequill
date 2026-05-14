import type { Job } from "../types";

export const sampleJobs: Job[] = [
  {
    id: "demo-frontend-engineer",
    title: "Frontend Engineer",
    company: "Vercel",
    location: "Remote",
    type: "Full-time",
    salaryRange: "$120k-$170k",
    description:
      "Build polished React and TypeScript product surfaces, improve performance, and collaborate with design on developer workflows.",
    tags: ["react", "typescript", "frontend", "tailwind", "performance"],
  },
  {
    id: "demo-ai-platform-engineer",
    title: "AI Platform Engineer",
    company: "Anthropic",
    location: "San Francisco / Remote",
    type: "Full-time",
    salaryRange: "$160k-$220k",
    description:
      "Develop backend services for model evaluation, prompt pipelines, observability, and safe deployment of AI features.",
    tags: ["python", "node", "ai", "apis", "observability"],
  },
  {
    id: "demo-full-stack-engineer",
    title: "Full Stack Engineer",
    company: "Supabase",
    location: "Remote",
    type: "Contract",
    salaryRange: "$90-$130/hr",
    description:
      "Own features across React, PostgreSQL, authentication, and API integrations for a fast-growing developer platform.",
    tags: ["react", "postgresql", "auth", "api", "node"],
  },
  {
    id: "demo-product-designer",
    title: "Product Designer",
    company: "Linear",
    location: "New York / Remote",
    type: "Full-time",
    salaryRange: "$130k-$180k",
    description:
      "Design quiet, high-density workflows for teams managing issues, roadmaps, and collaboration.",
    tags: ["figma", "systems", "ux", "product", "research"],
  },
];
