import { useState } from "react";
import AppShell from "../components/AppShell";
import MetricCard from "../components/MetricCard";
import { freelanceGigs, portfolioProjects } from "../data/demoData";

function FreelanceHub() {
  const [availability, setAvailability] = useState("Available");
  const [skillFilter, setSkillFilter] = useState("React");
  const filteredGigs = freelanceGigs.filter((gig) =>
    gig.skills.join(" ").toLowerCase().includes(skillFilter.toLowerCase())
  );
  const displayedGigs = filteredGigs.length > 0 ? filteredGigs : freelanceGigs;

  return (
    <AppShell>
      <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-200">
            Freelance Hub
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-normal">
            Portfolio, gigs, and availability
          </h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Mocked Upwork, Guru, and Toptal feeds sit beside a public portfolio
            preview so the UI can ship before official API approval.
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <label className="text-sm font-semibold text-slate-300">
            Availability
          </label>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {["Available", "Busy", "Not Available"].map((option) => (
              <button
                key={option}
                onClick={() => setAvailability(option)}
                className={`rounded-md border px-3 py-2 text-sm font-bold ${
                  availability === option
                    ? "border-rose-300 bg-rose-300 text-slate-950"
                    : "border-white/10 text-slate-300 hover:bg-white/10"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Portfolio URL" value="/u/ummar" tone="rose" />
        <MetricCard label="Synced Gigs" value={String(freelanceGigs.length)} tone="cyan" />
        <MetricCard label="Status" value={availability} tone="emerald" />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold">Portfolio Projects</h2>
            <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300">
              Public preview
            </span>
          </div>
          <div className="mt-5 grid gap-4">
            {portfolioProjects.map((project) => (
              <article
                key={project.id}
                className="rounded-lg border border-white/10 bg-slate-950/70 p-4"
              >
                <h3 className="text-lg font-black">{project.title}</h3>
                <p className="mt-2 text-slate-300">{project.description}</p>
                <p className="mt-3 text-sm text-emerald-200">{project.outcome}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.techStack.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <label className="text-sm font-semibold text-slate-300">
            Filter gigs by skill
          </label>
          <input
            value={skillFilter}
            onChange={(event) => setSkillFilter(event.target.value)}
            className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-950 px-3 text-white outline-none focus:border-rose-300"
          />
          <div className="mt-5 grid gap-4">
            {displayedGigs.map((gig) => (
              <article
                key={gig.id}
                className="rounded-lg border border-white/10 bg-slate-950/70 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black">{gig.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {gig.platform} · {gig.budget}
                    </p>
                  </div>
                  <span className="rounded-full bg-rose-300 px-2 py-1 text-xs font-black text-slate-950">
                    {gig.fit}%
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {gig.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}

export default FreelanceHub;
