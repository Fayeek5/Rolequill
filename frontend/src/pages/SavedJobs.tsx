import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import JobCard from "../components/JobCard";
import { readLocal, storageKeys, writeLocal } from "../services/localStore";
import type { Job } from "../types";

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState<Job[]>(readSavedJobs);
  const navigate = useNavigate();

  useEffect(() => {
    writeLocal(storageKeys.savedJobs, savedJobs);
  }, [savedJobs]);

  const removeSavedJob = (job: Job) => {
    setSavedJobs((current) =>
      current.filter((savedJob) => savedJob.id !== job.id)
    );
  };

  return (
    <AppShell>
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-200/80">
            Watchlist
          </p>
          <h1 className="mt-3 text-4xl font-bold text-purple-300">
            Saved Jobs
          </h1>
        </header>

        {savedJobs.length === 0 ? (
          <section className="rounded-lg border border-white/10 bg-white/[0.03] p-8 text-center">
            <p className="text-slate-300">No saved jobs yet.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-5 rounded-md bg-purple-500 px-4 py-2 font-semibold text-white transition hover:bg-purple-400"
            >
              Browse Jobs
            </button>
          </section>
        ) : (
          <section className="grid gap-4">
            {savedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSaved
                onToggleSave={() => removeSavedJob(job)}
              />
            ))}
          </section>
        )}
    </AppShell>
  );
}

function readSavedJobs() {
  return readLocal(storageKeys.savedJobs, []);
}

export default SavedJobs;
