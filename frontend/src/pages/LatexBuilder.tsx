import { useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import { resumeTemplates } from "../data/demoData";

function LatexBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState(resumeTemplates[0]);
  const [role, setRole] = useState("Frontend Engineer");
  const [texCode, setTexCode] = useState(() =>
    buildTex(resumeTemplates[0].name, "Frontend Engineer")
  );
  const rankedTemplates = useMemo(
    () =>
      resumeTemplates.map((template, index) => ({
        ...template,
        rank: template.id === selectedTemplate.id ? 1 : index + 2,
      })),
    [selectedTemplate.id]
  );

  const regenerate = () => {
    setTexCode(buildTex(selectedTemplate.name, role));
  };

  const downloadTex = () => {
    const url = URL.createObjectURL(
      new Blob([texCode], { type: "application/x-tex" })
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "rolequill-resume.tex";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">
          LaTeX Resume Builder
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-normal">
          Template-ranked resume generation
        </h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Pick an SRS-required template, generate ATS-aware LaTeX, edit it in
          browser, and keep downloads as the primary reliable export path.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="grid gap-3">
          {rankedTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => {
                setSelectedTemplate(template);
                setTexCode(buildTex(template.name, role));
              }}
              className={`rounded-lg border p-4 text-left transition ${
                selectedTemplate.id === template.id
                  ? "border-emerald-300 bg-emerald-300/10"
                  : "border-white/10 bg-white/[0.04] hover:border-white/30"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-bold">{template.name}</h2>
                <span className="text-xs font-black text-slate-400">
                  #{template.rank}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400">{template.category}</p>
              <p className="mt-3 text-sm text-slate-300">{template.rationale}</p>
            </button>
          ))}
        </div>

        <div className="grid gap-5">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <label className="text-sm font-semibold text-slate-300">
              Target role
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="min-h-11 flex-1 rounded-md border border-white/10 bg-slate-950 px-3 text-white outline-none focus:border-emerald-300"
              />
              <button
                onClick={regenerate}
                className="rounded-md bg-emerald-300 px-4 py-2 font-black text-slate-950"
              >
                Generate
              </button>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <label className="block rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <span className="text-sm font-semibold text-slate-300">
                LaTeX source
              </span>
              <textarea
                value={texCode}
                onChange={(event) => setTexCode(event.target.value)}
                spellCheck={false}
                className="mt-3 h-[520px] w-full resize-y rounded-md border border-white/10 bg-slate-950 p-4 font-mono text-sm leading-6 text-emerald-50 outline-none focus:border-emerald-300"
              />
            </label>

            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={downloadTex}
                  className="rounded-md bg-white px-3 py-2 text-sm font-black text-slate-950"
                >
                  Download .tex
                </button>
                <button
                  onClick={() => void navigator.clipboard.writeText(texCode)}
                  className="rounded-md border border-white/10 px-3 py-2 text-sm font-black text-slate-200 hover:bg-white/10"
                >
                  Copy Code
                </button>
                <button
                  disabled
                  className="rounded-md border border-white/10 px-3 py-2 text-sm font-black text-slate-500"
                >
                  Open in Overleaf
                </button>
              </div>

              <div className="mt-5 min-h-[520px] rounded-md border border-white/10 bg-slate-100 p-8 text-slate-950">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Preview
                </p>
                <h2 className="mt-4 text-3xl font-black">Ummar Faeeque</h2>
                <p className="mt-1 text-slate-600">{role}</p>
                <div className="mt-6 h-px bg-slate-300" />
                <h3 className="mt-6 font-black uppercase tracking-[0.16em]">
                  Experience
                </h3>
                <p className="mt-3 leading-7">
                  Built React, TypeScript, and Node product workflows with
                  measurable delivery, strong ownership, and ATS-aligned impact.
                </p>
                <h3 className="mt-6 font-black uppercase tracking-[0.16em]">
                  Skills
                </h3>
                <p className="mt-3">React, TypeScript, Node, PostgreSQL, APIs</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function buildTex(templateName: string, role: string) {
  return `\\documentclass[11pt]{article}
\\usepackage[margin=0.7in]{geometry}
\\usepackage{enumitem}
\\begin{document}
\\begin{center}
  {\\LARGE \\textbf{Ummar Faeeque}}\\\\
  ${role} \\\\
  rolequill@example.com \\textbar{} linkedin.com/in/ummar
\\end{center}

\\section*{Template}
${templateName}

\\section*{Summary}
Product-minded engineer building React, TypeScript, Node, and PostgreSQL workflows with measurable business impact.

\\section*{Experience}
\\begin{itemize}[leftmargin=*]
  \\item Shipped ATS-aligned product surfaces with performance, accessibility, and API integration ownership.
  \\item Built backend services with deterministic analysis, caching-ready architecture, and clean observability.
  \\item Partnered with design and product teams to reduce time-to-value and improve application conversion.
\\end{itemize}

\\section*{Skills}
React, TypeScript, Node.js, PostgreSQL, TailwindCSS, API Design, AI Workflows

\\end{document}`;
}

export default LatexBuilder;
