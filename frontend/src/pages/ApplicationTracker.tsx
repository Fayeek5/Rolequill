import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import MetricCard from "../components/MetricCard";
import { applications as seedApplications } from "../data/demoData";
import { readLocal, storageKeys, writeLocal } from "../services/localStore";
import type { Application } from "../types";

const columns: Application["status"][] = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
];

function ApplicationTracker() {
  const [applications, setApplications] = useState<Application[]>(() =>
    readLocal(storageKeys.applications, seedApplications)
  );
  const grouped = useMemo(
    () =>
      columns.map((status) => ({
        status,
        items: applications.filter((application) => application.status === status),
      })),
    [applications]
  );

  const moveApplication = (id: string, status: Application["status"]) => {
    setApplications((current) =>
      current.map((application) =>
        application.id === id ? { ...application, status } : application
      )
    );
  };

  const resetDemoBoard = () => {
    setApplications(seedApplications);
  };

  useEffect(() => {
    writeLocal(storageKeys.applications, applications);
  }, [applications]);

  return (
    <AppShell>
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-200">
          Application Tracker
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-normal">
          Pipeline board for every application
        </h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Track applications from applied to offer, with next steps and match
          scores attached to each opportunity.
        </p>
        <button
          onClick={resetDemoBoard}
          className="mt-5 rounded-md border border-white/10 px-4 py-2 text-sm font-black text-slate-200 hover:bg-white/10"
        >
          Reset Demo Board
        </button>
      </section>

      <section className="grid gap-4 sm:grid-cols-4">
        {grouped.map((group) => (
          <MetricCard
            key={group.status}
            label={group.status}
            value={String(group.items.length)}
            tone={group.status === "Offer" ? "emerald" : "violet"}
          />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {grouped.map((group) => (
          <div
            key={group.status}
            className="min-h-80 rounded-lg border border-white/10 bg-white/[0.04] p-4"
          >
            <h2 className="font-black">{group.status}</h2>
            <div className="mt-4 grid gap-3">
              {group.items.map((application) => (
                <article
                  key={application.id}
                  className="rounded-lg border border-white/10 bg-slate-950/80 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black">{application.role}</h3>
                      <p className="mt-1 text-sm text-slate-400">
                        {application.company}
                      </p>
                    </div>
                    <span className="rounded-full bg-violet-300 px-2 py-1 text-xs font-black text-slate-950">
                      {application.matchScore}%
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-300">
                    {application.nextStep}
                  </p>
                  <select
                    value={application.status}
                    onChange={(event) =>
                      moveApplication(
                        application.id,
                        event.target.value as Application["status"]
                      )
                    }
                    className="mt-4 w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-violet-300"
                  >
                    {columns.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
    </AppShell>
  );
}

export default ApplicationTracker;
