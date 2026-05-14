export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type?: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  dedupHash?: string;
  salaryRange?: string;
  description?: string;
  sourceUrl?: string;
  tags?: string[];
};

export type AtsSuggestion = {
  id: string;
  original: string;
  rewrite: string;
};

export type AtsAnalysis = {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: AtsSuggestion[];
  heatmap: Array<{
    section: string;
    density: number;
    keywords: string[];
  }>;
  provider?: string;
  cacheKey?: string;
  cached?: boolean;
  generatedAt?: string;
  modelConfig?: {
    temperature: number;
    mode: string;
  };
};

export type ResumeTemplate = {
  id: string;
  name: string;
  category: string;
  tone: string;
  accent: string;
  rationale: string;
};

export type PortfolioProject = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  role: string;
  outcome: string;
  projectUrl: string;
};

export type FreelanceGig = {
  id: string;
  title: string;
  platform: string;
  budget: string;
  skills: string[];
  fit: number;
};

export type NetworkContact = {
  id: string;
  name: string;
  title: string;
  company: string;
  connectionPath: string[];
  linkedinUrl: string;
  message: string;
  status: "New" | "Reached Out" | "Replied" | "Declined";
};

export type Application = {
  id: string;
  role: string;
  company: string;
  status: "Applied" | "Screening" | "Interview" | "Offer";
  nextStep: string;
  matchScore: number;
};

export type AppSettings = {
  provider: "GPT-4o" | "Claude Sonnet" | "Gemini";
  cacheEnabled: boolean;
  freeLimit: number;
  notifications: boolean;
};

export type ResumeVersion = {
  id: string;
  name: string;
  resume: string;
  jobDescription: string;
  analysis: AtsAnalysis;
  createdAt: string;
};

export type UserProfile = {
  name: string;
  email: string;
  skills: string[];
  preferredRoles: string[];
  experienceLevel: "Entry" | "Mid" | "Senior" | "Lead";
  salaryMin: number;
  location: string;
  jobTypes: string[];
  onboardingComplete: boolean;
};

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: "Job Match" | "Saved Job" | "Application" | "System";
  read: boolean;
  createdAt: string;
};

export type AuthProvider = "email" | "phone" | "google";

export type AuthUser = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  provider: AuthProvider;
  createdAt: string;
};

export type StoredAuthUser = AuthUser & {
  passwordHash?: string;
  passwordSalt?: string;
};
