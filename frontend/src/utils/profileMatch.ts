import type { Job, UserProfile } from "../types";
import { tokenize } from "./textAnalysis";

export function scoreJobForProfile(job: Job, profile: UserProfile) {
  const profileTerms = tokenize(
    [
      ...profile.skills,
      ...profile.preferredRoles,
      profile.experienceLevel,
      profile.location,
      ...profile.jobTypes,
    ].join(" ")
  );
  const jobTerms = tokenize(
    [
      job.title,
      job.company,
      job.location,
      job.type,
      job.experienceLevel,
      job.description,
      ...(job.tags || []),
    ]
      .filter(Boolean)
      .join(" ")
  );

  if (profileTerms.size === 0 || jobTerms.size === 0) return 0;

  const matches = [...profileTerms].filter((term) => jobTerms.has(term));
  const salaryBonus =
    job.salaryMax && job.salaryMax >= profile.salaryMin ? 8 : job.salaryMax ? -8 : 0;
  const locationBonus = job.location
    .toLowerCase()
    .includes(profile.location.toLowerCase())
    ? 10
    : 0;

  return Math.max(
    0,
    Math.min(100, Math.round((matches.length / profileTerms.size) * 82 + salaryBonus + locationBonus))
  );
}

export function jobMatchesProfileFilters(job: Job, profile: UserProfile) {
  const locationMatch =
    profile.location.trim() === "" ||
    job.location.toLowerCase().includes(profile.location.toLowerCase()) ||
    job.location.toLowerCase().includes("remote");
  const typeMatch =
    profile.jobTypes.length === 0 ||
    profile.jobTypes.some((type) =>
      [job.type, job.description, ...(job.tags || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(type.toLowerCase())
    );
  const salaryMatch = !job.salaryMax || job.salaryMax >= profile.salaryMin;

  return locationMatch && typeMatch && salaryMatch;
}
