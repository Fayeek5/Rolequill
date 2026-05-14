import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import MetricCard from "../components/MetricCard";
import { defaultProfile } from "../data/defaultProfile";
import { readLocal, storageKeys, writeLocal } from "../services/localStore";
import type { UserProfile } from "../types";

const experienceLevels: UserProfile["experienceLevel"][] = [
  "Entry",
  "Mid",
  "Senior",
  "Lead",
];
const jobTypes = ["Remote", "Full-time", "Contract", "Hybrid"];

function Profile() {
  const [profile, setProfile] = useState<UserProfile>(() =>
    readLocal(storageKeys.profile, defaultProfile)
  );
  const [skillText, setSkillText] = useState(profile.skills.join(", "));
  const [roleText, setRoleText] = useState(profile.preferredRoles.join(", "));

  useEffect(() => {
    writeLocal(storageKeys.profile, profile);
  }, [profile]);

  const updateProfile = <Key extends keyof UserProfile>(
    key: Key,
    value: UserProfile[Key]
  ) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const syncLists = () => {
    updateProfile("skills", splitList(skillText));
    updateProfile("preferredRoles", splitList(roleText));
    updateProfile("onboardingComplete", true);
  };

  const toggleType = (type: string) => {
    setProfile((current) => ({
      ...current,
      jobTypes: current.jobTypes.includes(type)
        ? current.jobTypes.filter((item) => item !== type)
        : [...current.jobTypes, type],
    }));
  };

  return (
    <AppShell>
      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">
            User Management
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-normal">
            Onboarding profile
          </h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Captures the SRS profile fields used by matching, filters, saved
            jobs, application tracking, and later Supabase Auth.
          </p>
        </div>

        <div className="grid gap-3">
          <MetricCard label="Skills" value={String(profile.skills.length)} tone="emerald" />
          <MetricCard label="Roles" value={String(profile.preferredRoles.length)} tone="cyan" />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-xl font-black">Identity</h2>
          <div className="mt-4 grid gap-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-300">Name</span>
              <input
                value={profile.name}
                onChange={(event) => updateProfile("name", event.target.value)}
                className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-950 px-3 text-white outline-none focus:border-emerald-300"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-300">Email</span>
              <input
                value={profile.email}
                onChange={(event) => updateProfile("email", event.target.value)}
                className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-950 px-3 text-white outline-none focus:border-emerald-300"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-300">
                Location preference
              </span>
              <input
                value={profile.location}
                onChange={(event) => updateProfile("location", event.target.value)}
                className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-950 px-3 text-white outline-none focus:border-emerald-300"
              />
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-xl font-black">Targeting</h2>
          <div className="mt-4 grid gap-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-300">
                Skills
              </span>
              <textarea
                value={skillText}
                onChange={(event) => setSkillText(event.target.value)}
                className="mt-2 h-24 w-full rounded-md border border-white/10 bg-slate-950 p-3 text-white outline-none focus:border-emerald-300"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-300">
                Preferred roles
              </span>
              <textarea
                value={roleText}
                onChange={(event) => setRoleText(event.target.value)}
                className="mt-2 h-24 w-full rounded-md border border-white/10 bg-slate-950 p-3 text-white outline-none focus:border-emerald-300"
              />
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
        <div className="grid gap-5 lg:grid-cols-3">
          <label className="block">
            <span className="text-sm font-semibold text-slate-300">
              Experience level
            </span>
            <select
              value={profile.experienceLevel}
              onChange={(event) =>
                updateProfile(
                  "experienceLevel",
                  event.target.value as UserProfile["experienceLevel"]
                )
              }
              className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-950 px-3 text-white outline-none focus:border-emerald-300"
            >
              {experienceLevels.map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-300">
              Minimum salary
            </span>
            <input
              type="number"
              value={profile.salaryMin}
              onChange={(event) =>
                updateProfile("salaryMin", Number(event.target.value))
              }
              className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-950 px-3 text-white outline-none focus:border-emerald-300"
            />
          </label>

          <div>
            <p className="text-sm font-semibold text-slate-300">Job types</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {jobTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`rounded-md border px-3 py-2 text-sm font-bold ${
                    profile.jobTypes.includes(type)
                      ? "border-emerald-300 bg-emerald-300 text-slate-950"
                      : "border-white/10 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={syncLists}
          className="mt-6 rounded-md bg-emerald-300 px-4 py-2 font-black text-slate-950"
        >
          Save Profile
        </button>
      </section>
    </AppShell>
  );
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default Profile;
