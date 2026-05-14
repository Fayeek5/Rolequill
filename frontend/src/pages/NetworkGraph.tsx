import { useState } from "react";
import AppShell from "../components/AppShell";
import { networkContacts } from "../data/demoData";
import type { NetworkContact } from "../types";

const statuses: NetworkContact["status"][] = [
  "New",
  "Reached Out",
  "Replied",
  "Declined",
];

function NetworkGraph() {
  const [contacts, setContacts] = useState(networkContacts);
  const [company, setCompany] = useState("Vercel");
  const visibleContacts = contacts.filter((contact) =>
    contact.company.toLowerCase().includes(company.toLowerCase())
  );
  const displayedContacts =
    visibleContacts.length > 0 ? visibleContacts : contacts;

  const updateStatus = (id: string, status: NetworkContact["status"]) => {
    setContacts((current) =>
      current.map((contact) =>
        contact.id === id ? { ...contact, status } : contact
      )
    );
  };

  return (
    <AppShell>
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">
          Professional Network
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-normal">
          Contacts at target companies
        </h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Apollo-style contact cards show connection paths, suggested outreach,
          and pipeline status after a role is marked applied.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <label className="text-sm font-semibold text-slate-300">
            Target company
          </label>
          <input
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className="mt-2 min-h-11 w-full rounded-md border border-white/10 bg-slate-950 px-3 text-white outline-none focus:border-amber-300"
          />

          <div className="mt-8 rounded-lg border border-amber-300/20 bg-amber-300/10 p-4">
            <p className="text-sm font-bold text-amber-100">
              Connection path model
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              User to mutual connection to target contact, with status tracking
              for outreach follow-up.
            </p>
          </div>
        </aside>

        <div className="grid gap-4">
          {displayedContacts.map((contact) => (
            <article
              key={contact.id}
              className="rounded-lg border border-white/10 bg-white/[0.04] p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-xl font-black">{contact.name}</h2>
                  <p className="mt-1 text-slate-300">
                    {contact.title} · {contact.company}
                  </p>
                </div>
                <select
                  value={contact.status}
                  onChange={(event) =>
                    updateStatus(
                      contact.id,
                      event.target.value as NetworkContact["status"]
                    )
                  }
                  className="rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-amber-300"
                >
                  {statuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {contact.connectionPath.map((path, index) => (
                  <span
                    key={`${contact.id}-${path}`}
                    className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300"
                  >
                    {index > 0 ? "→ " : ""}
                    {path}
                  </span>
                ))}
              </div>

              <div className="mt-5 rounded-lg border border-white/10 bg-slate-950/70 p-4">
                <p className="text-sm font-semibold text-amber-200">
                  Suggested outreach
                </p>
                <p className="mt-2 leading-7 text-slate-200">{contact.message}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

export default NetworkGraph;
