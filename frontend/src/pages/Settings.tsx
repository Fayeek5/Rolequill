import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import { defaultSettings } from "../data/defaultSettings";
import { readLocal, storageKeys, writeLocal } from "../services/localStore";
import type { AppSettings } from "../types";

function Settings() {
  const [settings, setSettings] = useState<AppSettings>(() =>
    readLocal(storageKeys.settings, defaultSettings)
  );

  useEffect(() => {
    writeLocal(storageKeys.settings, settings);
  }, [settings]);

  const updateSettings = <Key extends keyof AppSettings>(
    key: Key,
    value: AppSettings[Key]
  ) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  return (
    <AppShell>
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
          Settings
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-normal">
          Provider and platform controls
        </h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Keep API provider choice, deterministic cache behavior, free-tier
          limits, and matching notifications visible from day one.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-xl font-black">AI Provider</h2>
          <div className="mt-4 grid gap-3">
            {["GPT-4o", "Claude Sonnet", "Gemini"].map((option) => (
              <label
                key={option}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-950/70 p-4"
              >
                <span className="font-semibold">{option}</span>
                <input
                  type="radio"
                  name="provider"
                  checked={settings.provider === option}
                  onChange={() =>
                    updateSettings("provider", option as AppSettings["provider"])
                  }
                  className="h-5 w-5"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-xl font-black">Cost Controls</h2>
          <label className="mt-4 flex items-center justify-between rounded-lg border border-white/10 bg-slate-950/70 p-4">
            <span>
              <span className="block font-semibold">SHA-256 result cache</span>
              <span className="text-sm text-slate-400">
                Reuse identical ATS results to prevent score drift and extra cost.
              </span>
            </span>
            <input
              type="checkbox"
              checked={settings.cacheEnabled}
              onChange={(event) =>
                updateSettings("cacheEnabled", event.target.checked)
              }
              className="h-5 w-5"
            />
          </label>

          <label className="mt-4 block rounded-lg border border-white/10 bg-slate-950/70 p-4">
            <span className="font-semibold">Free tier ATS analyses per day</span>
            <input
              type="range"
              min="1"
              max="10"
              value={settings.freeLimit}
              onChange={(event) =>
                updateSettings("freeLimit", Number(event.target.value))
              }
              className="mt-4 w-full"
            />
            <span className="mt-2 block text-sm text-slate-400">
              {settings.freeLimit} analyses
            </span>
          </label>

          <label className="mt-4 flex items-center justify-between rounded-lg border border-white/10 bg-slate-950/70 p-4">
            <span className="font-semibold">Matching job notifications</span>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(event) =>
                updateSettings("notifications", event.target.checked)
              }
              className="h-5 w-5"
            />
          </label>
        </div>
      </section>
    </AppShell>
  );
}

export default Settings;
