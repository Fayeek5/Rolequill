import type {
  Application,
  FreelanceGig,
  NetworkContact,
  PortfolioProject,
  ResumeTemplate,
} from "../types";

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: "tech",
    name: "Signal Stack",
    category: "Tech/Engineering",
    tone: "Systems-minded, metrics-forward",
    accent: "cyan",
    rationale: "Best for engineering roles that value architecture, scale, and ownership.",
  },
  {
    id: "corporate",
    name: "Boardroom",
    category: "Corporate",
    tone: "Precise, executive, single-column",
    accent: "emerald",
    rationale: "Best for operations, product, and business roles with formal screening.",
  },
  {
    id: "creative",
    name: "Studio Split",
    category: "Creative",
    tone: "Portfolio-led, two-column",
    accent: "rose",
    rationale: "Best for design, content, and client-facing freelance work.",
  },
  {
    id: "academic",
    name: "Research Ledger",
    category: "Academic CV",
    tone: "Publication-ready, dense reference",
    accent: "amber",
    rationale: "Best for research, teaching, grants, and long-form credentials.",
  },
  {
    id: "minimal",
    name: "Quiet Grid",
    category: "Minimal",
    tone: "Clean, compact, ATS-safe",
    accent: "slate",
    rationale: "Best when the job description is conservative or recruiter-heavy.",
  },
  {
    id: "executive",
    name: "Operator",
    category: "Executive",
    tone: "Leadership narrative, outcomes first",
    accent: "violet",
    rationale: "Best for senior, staff, principal, and management applications.",
  },
];

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "portfolio-1",
    title: "AI Resume Review Flow",
    description: "No-auth ATS analysis surface with cached deterministic scoring.",
    techStack: ["React", "TypeScript", "Supabase"],
    role: "Full-stack builder",
    outcome: "Reduced time-to-first-value to under one minute.",
    projectUrl: "https://rolequill.local/u/demo",
  },
  {
    id: "portfolio-2",
    title: "Freelance Pipeline Dashboard",
    description: "Portfolio and gig matching workspace for independent consultants.",
    techStack: ["Node", "PostgreSQL", "Tailwind"],
    role: "Product engineer",
    outcome: "Centralized leads, availability, and proof-of-work into one profile.",
    projectUrl: "https://rolequill.local/case/freelance",
  },
];

export const freelanceGigs: FreelanceGig[] = [
  {
    id: "gig-1",
    title: "React dashboard cleanup for SaaS analytics",
    platform: "Upwork",
    budget: "$2k fixed",
    skills: ["React", "Tailwind", "Charts"],
    fit: 91,
  },
  {
    id: "gig-2",
    title: "Build portfolio site with booking workflow",
    platform: "Guru",
    budget: "$55/hr",
    skills: ["TypeScript", "UX", "Auth"],
    fit: 84,
  },
  {
    id: "gig-3",
    title: "AI prompt evaluation tool prototype",
    platform: "Toptal",
    budget: "$7k fixed",
    skills: ["LLM", "Node", "PostgreSQL"],
    fit: 88,
  },
];

export const networkContacts: NetworkContact[] = [
  {
    id: "contact-1",
    name: "Maya Rao",
    title: "Staff Product Engineer",
    company: "Vercel",
    connectionPath: ["You", "Open-source maintainer", "Maya Rao"],
    linkedinUrl: "https://linkedin.com/in/demo-maya",
    message:
      "Hi Maya, I saw Vercel is hiring for frontend systems work. I have shipped React and performance-heavy product surfaces and would value your perspective on the team.",
    status: "New",
  },
  {
    id: "contact-2",
    name: "Daniel Kim",
    title: "Engineering Manager",
    company: "Supabase",
    connectionPath: ["You", "Former cohort peer", "Daniel Kim"],
    linkedinUrl: "https://linkedin.com/in/demo-daniel",
    message:
      "Hi Daniel, I am exploring full-stack roles at Supabase and noticed the overlap with auth, Postgres, and developer tooling. Would love to ask one concise question about the role.",
    status: "Reached Out",
  },
  {
    id: "contact-3",
    name: "Priya Shah",
    title: "Design Systems Lead",
    company: "Linear",
    connectionPath: ["You", "Design community", "Priya Shah"],
    linkedinUrl: "https://linkedin.com/in/demo-priya",
    message:
      "Hi Priya, your team’s work on dense product interfaces is exactly the kind of craft I enjoy. I would appreciate any advice on positioning my portfolio for Linear.",
    status: "New",
  },
];

export const applications: Application[] = [
  {
    id: "app-1",
    role: "Frontend Engineer",
    company: "Vercel",
    status: "Applied",
    nextStep: "Tailor resume with edge-runtime keywords",
    matchScore: 82,
  },
  {
    id: "app-2",
    role: "Full Stack Engineer",
    company: "Supabase",
    status: "Screening",
    nextStep: "Send portfolio link",
    matchScore: 88,
  },
  {
    id: "app-3",
    role: "Product Designer",
    company: "Linear",
    status: "Interview",
    nextStep: "Prepare systems case study",
    matchScore: 74,
  },
  {
    id: "app-4",
    role: "AI Platform Engineer",
    company: "Anthropic",
    status: "Offer",
    nextStep: "Review compensation notes",
    matchScore: 79,
  },
];
