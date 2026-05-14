import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import MetricCard from "../components/MetricCard";
import { defaultSettings } from "../data/defaultSettings";
import { analyzeResumeForJob, fetchBackendHealth } from "../services/atsService";
import { readLocal, storageKeys, writeLocal } from "../services/localStore";
import type { AppSettings, AtsAnalysis, ResumeVersion } from "../types";
import { analyzeAts } from "../utils/textAnalysis";

const sampleResume = `Summary
Product-minded full-stack engineer with React, TypeScript, Node, PostgreSQL, and API integration experience.

Experience
- Built React dashboards with Tailwind and performance budgets for high-traffic SaaS teams.
- Designed backend services in Node with PostgreSQL schemas, auth flows, and observability.
- Partnered with design to ship accessible workflows and measurable conversion improvements.`;

const sampleJobDescription = `We are hiring a frontend engineer to build React and TypeScript product surfaces, improve performance, collaborate with design, own API integrations, and instrument user-facing workflows with observability.`;

function AtsEngine() {
  const [resume, setResume] = useState(sampleResume);
  const [jobDescription, setJobDescription] = useState(sampleJobDescription);
  const [settings, setSettings] = useState<AppSettings>(() =>
    readLocal(storageKeys.settings, defaultSettings)
  );
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<AtsAnalysis>(() =>
    analyzeAts(sampleResume, sampleJobDescription)
  );
  const [cacheState, setCacheState] = useState("Ready");
  const [backendState, setBackendState] = useState("Checking backend");
  const [resumeVersions, setResumeVersions] = useState<ResumeVersion[]>(() =>
    readLocal(storageKeys.resumeVersions, [])
  );
  const visibleSuggestions = analysis.suggestions.filter(
    (suggestion) => !dismissed.includes(suggestion.id)
  );
  const color =
    analysis.score >= 70
      ? "text-emerald-200"
      : analysis.score >= 50
        ? "text-amber-200"
        : "text-rose-200";

  useEffect(() => {
    let isMounted = true;

    fetchBackendHealth().then((health) => {
      if (!isMounted) return;
      setBackendState(
        health
          ? `Backend online · ${health.services.ats} · ${health.services.cache}`
          : "Backend offline · local fallback ready"
      );
    });

    return () => {
      isMounted = false;
    };
  }, [analysis.generatedAt]);

  useEffect(() => {
    let isCurrent = true;

    async function runAnalysis() {
      setDismissed([]);
      setCacheState("Analyzing");
      const nextAnalysis = await analyzeResumeForJob({
        resumeText: resume,
        jobDescription,
        provider: settings.provider,
        bypassCache: !settings.cacheEnabled,
      });

      if (isCurrent) {
        setAnalysis(nextAnalysis);
        setCacheState(
          nextAnalysis.cached
            ? "Backend cache hit"
            : settings.cacheEnabled
              ? "Backend generated and cached"
              : "Backend generated without cache"
        );
      }
    }

    void runAnalysis();

    return () => {
      isCurrent = false;
    };
  }, [jobDescription, resume, settings.cacheEnabled, settings.provider]);

  useEffect(() => {
    writeLocal(storageKeys.resumeVersions, resumeVersions.slice(0, 10));
  }, [resumeVersions]);

  const updateProvider = (provider: AppSettings["provider"]) => {
    const nextSettings = { ...settings, provider };
    setSettings(nextSettings);
    writeLocal(storageKeys.settings, nextSettings);
  };

  const saveResumeVersion = () => {
    const version: ResumeVersion = {
      id: crypto.randomUUID(),
      name: `${settings.provider} analysis ${resumeVersions.length + 1}`,
      resume,
      jobDescription,
      analysis,
      createdAt: new Date().toISOString(),
    };

    setResumeVersions((current) => [version, ...current].slice(0, 10));
  };

  return (
    <AppShell>
      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
            AI ATS Engine
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-normal">
            Deterministic resume analysis
          </h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Paste a resume and JD to compute a stable ATS score, matched terms,
            missing keywords, rewrite suggestions, and a section heatmap.
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <label className="text-sm font-semibold text-slate-300">
            AI provider
          </label>
          <select
            value={settings.provider}
            onChange={(event) =>
              updateProvider(event.target.value as AppSettings["provider"])
            }
            className="mt-2 w-full rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-300"
          >
            <option>GPT-4o</option>
            <option>Claude Sonnet</option>
            <option>Gemini</option>
          </select>
          <p className="mt-3 text-sm text-slate-400">
            {cacheState}. {backendState}. Free limit:{" "}
            {settings.freeLimit}/day.
          </p>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-300">Resume</span>
          <textarea
            value={resume}
            onChange={(event) => setResume(event.target.value)}
            className="mt-2 h-72 w-full resize-y rounded-lg border border-white/10 bg-slate-950/80 p-4 text-sm leading-6 text-slate-100 outline-none focus:border-cyan-300"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-300">
            Job description
          </span>
          <textarea
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            className="mt-2 h-72 w-full resize-y rounded-lg border border-white/10 bg-slate-950/80 p-4 text-sm leading-6 text-slate-100 outline-none focus:border-cyan-300"
          />
        </label>
      </section>

      <section className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 text-center">
          <div className="mx-auto grid h-44 w-44 place-items-center rounded-full border-[12px] border-slate-800 bg-slate-950">
            <span className={`text-5xl font-black ${color}`}>
              {analysis.score}
            </span>
          </div>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            ATS Score
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard
            label="Matched"
            value={String(analysis.matchedKeywords.length)}
            tone="emerald"
          />
          <MetricCard
            label="Missing"
            value={String(analysis.missingKeywords.length)}
            tone="rose"
          />
          <MetricCard label="Provider" value={settings.provider} tone="cyan" />
          <MetricCard
            label="Temperature"
            value={String(analysis.modelConfig?.temperature ?? 0)}
            tone="amber"
          />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">Resume Versions</h2>
              <p className="mt-1 text-sm text-slate-400">
                Stores up to 10 local versions linked to the JD and analysis.
              </p>
            </div>
            <button
              onClick={saveResumeVersion}
              className="rounded-md bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950"
            >
              Save Version
            </button>
          </div>
          <div className="mt-4 grid gap-2">
            {resumeVersions.length === 0 ? (
              <p className="text-sm text-slate-400">No versions saved yet.</p>
            ) : (
              resumeVersions.map((version) => (
                <button
                  key={version.id}
                  onClick={() => {
                    setResume(version.resume);
                    setJobDescription(version.jobDescription);
                  }}
                  className="rounded-md border border-white/10 bg-slate-950/70 p-3 text-left hover:border-cyan-300/60"
                >
                  <span className="block font-semibold text-slate-100">
                    {version.name}
                  </span>
                  <span className="mt-1 block text-sm text-slate-400">
                    Score {version.analysis.score} ·{" "}
                    {new Date(version.createdAt).toLocaleString()}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-cyan-300/10 p-5">
          <h2 className="text-xl font-bold text-cyan-100">
            Determinism Guard
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            The same resume and JD pair resolves to the same SHA-256 cache key,
            so repeated analyses return the same backend result unless cache is
            disabled in settings. Current mode:{" "}
            {analysis.modelConfig?.mode || "local-browser-fallback"}.
          </p>
          {analysis.cacheKey && (
            <p className="mt-4 break-all rounded-md bg-slate-950/70 p-3 font-mono text-xs text-cyan-100">
              {analysis.cacheKey}
            </p>
          )}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <KeywordPanel title="Matched Keywords" keywords={analysis.matchedKeywords} />
        <KeywordPanel title="Missing Keywords" keywords={analysis.missingKeywords} />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-xl font-bold">Rewrite Suggestions</h2>
          <div className="mt-4 grid gap-4">
            {visibleSuggestions.length === 0 ? (
              <p className="text-slate-400">All suggestions handled.</p>
            ) : (
              visibleSuggestions.map((suggestion) => (
                <article
                  key={suggestion.id}
                  className="rounded-lg border border-white/10 bg-slate-950/70 p-4"
                >
                  <p className="text-sm text-slate-400">Original</p>
                  <p className="mt-1 text-slate-200">{suggestion.original}</p>
                  <p className="mt-4 text-sm text-cyan-200">Rewrite</p>
                  <p className="mt-1 text-slate-100">{suggestion.rewrite}</p>
                  <div className="mt-4 flex gap-2">
                    <button className="rounded-md bg-emerald-400 px-3 py-2 text-sm font-bold text-slate-950">
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        setDismissed((current) => [...current, suggestion.id])
                      }
                      className="rounded-md border border-white/10 px-3 py-2 text-sm font-bold text-slate-200 hover:bg-white/10"
                    >
                      Dismiss
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-xl font-bold">Keyword Heatmap</h2>
          <div className="mt-5 grid gap-4">
            {analysis.heatmap.map((row) => (
              <div key={row.section}>
                <div className="flex justify-between text-sm">
                  <span className="capitalize text-slate-300">{row.section}</span>
                  <span className="text-slate-400">{row.density}%</span>
                </div>
                <div className="mt-2 h-3 rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300"
                    style={{ width: `${row.density}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function KeywordPanel({ title, keywords }: { title: string; keywords: string[] }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {keywords.length === 0 ? (
          <span className="text-slate-400">No keywords yet.</span>
        ) : (
          keywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-full border border-white/10 bg-slate-950 px-3 py-1 text-sm text-slate-200"
            >
              {keyword}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

export default AtsEngine;
