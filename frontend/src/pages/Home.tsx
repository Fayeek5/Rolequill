import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import JobCard from "../components/JobCard";
import { defaultProfile } from "../data/defaultProfile";
import { fetchJobs } from "../services/jobService";
import { readLocal, storageKeys, writeLocal } from "../services/localStore";
import { createJobMatchNotifications, pushNotification } from "../services/notificationService";
import type { Application, Job, UserProfile } from "../types";
import { jobMatchesProfileFilters, scoreJobForProfile } from "../utils/profileMatch";
import { calculateMatchScore, tokenize } from "../utils/textAnalysis";

function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [savedJobs, setSavedJobs] = useState<Job[]>(readSavedJobs);
  const [applications, setApplications] = useState<Application[]>(() =>
    readLocal(storageKeys.applications, [])
  );
  const [profile] = useState<UserProfile>(() =>
    readLocal(storageKeys.profile, defaultProfile)
  );
  const [showProfileMatchesOnly, setShowProfileMatchesOnly] = useState(false);
  const [resume, setResume] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchJobs()
      .then((data) => {
        if (isMounted) setJobs(data);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    writeLocal(storageKeys.savedJobs, savedJobs);
  }, [savedJobs]);

  useEffect(() => {
    writeLocal(storageKeys.applications, applications);
  }, [applications]);

  const resumeKeywords = useMemo(() => tokenize(resume), [resume]);

  const jobsWithScores = useMemo(() => {
    return jobs
      .map((job) => {
        const resumeScore = calculateMatchScore(job, resumeKeywords);
        const profileScore = scoreJobForProfile(job, profile);

        return {
          job,
          matchScore: resume.trim()
            ? Math.round(resumeScore * 0.65 + profileScore * 0.35)
            : profileScore,
          profileScore,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [jobs, profile, resume, resumeKeywords]);

  useEffect(() => {
    const strongMatches = jobsWithScores
      .filter(({ profileScore }) => profileScore >= 62)
      .map(({ job }) => job);
    createJobMatchNotifications(strongMatches);
  }, [jobsWithScores]);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    const profileFiltered = showProfileMatchesOnly
      ? jobsWithScores.filter(({ job }) => jobMatchesProfileFilters(job, profile))
      : jobsWithScores;

    if (!query) return profileFiltered;

    return profileFiltered.filter(({ job }) =>
      [
        job.title,
        job.company,
        job.location,
        job.type,
        job.salaryRange,
        job.description,
        ...(job.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [jobsWithScores, profile, search, showProfileMatchesOnly]);

  const displayedJobs = filteredJobs.length > 0 ? filteredJobs : jobsWithScores;

  const toggleSave = (job: Job) => {
    const exists = savedJobs.some((savedJob) => savedJob.id === job.id);

    if (exists) {
      setSavedJobs((current) =>
        current.filter((savedJob) => savedJob.id !== job.id)
      );
    } else {
      setSavedJobs((current) => [...current, job]);
      pushNotification({
        title: "Job saved",
        message: `${job.title} at ${job.company}`,
        type: "Saved Job",
      });
    }
  };

  const trackApplication = (job: Job, matchScore: number) => {
    const exists = applications.some((application) => application.id === job.id);
    if (exists) return;

    setApplications((current) => [
      ...current,
      {
        id: job.id,
        role: job.title,
        company: job.company,
        status: "Applied",
        nextStep: "Run ATS analysis and tailor resume bullets",
        matchScore,
      },
    ]);
    pushNotification({
      title: "Application tracked",
      message: `${job.title} at ${job.company} added to tracker`,
      type: "Application",
    });
  };

  const handleFileUpload = async (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    setUploadStatus(`Reading ${file.name}...`);

    try {
      if (file.type === "text/plain" || extension === "txt") {
        setResume(await file.text());
        setUploadStatus("Resume text loaded.");
        return;
      }

      if (file.type === "application/pdf" || extension === "pdf") {
        const text = await extractPdfText(file);
        setResume(text);
        setUploadStatus("PDF resume text loaded.");
        return;
      }

      if (extension === "docx") {
        const text = await extractDocxText(file);
        setResume(text);
        setUploadStatus("DOCX resume text loaded.");
        return;
      }

      setUploadStatus("Upload a .txt, .pdf, or .docx resume.");
    } catch (error) {
      console.error(error);
      setUploadStatus("Could not read that file. Paste the resume text instead.");
    }
  };

  return (
    <AppShell>
        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(340px,0.7fr)] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-200/80">
              Try in 60 seconds
            </p>
            <h1 className="mt-3 text-5xl font-bold tracking-normal text-purple-300 sm:text-6xl">
              Rolequill
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              Paste or upload your resume, search a target role, and see a quick
              skill match against live or demo jobs before creating an account.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <label className="block text-sm font-semibold text-slate-200">
              Resume
            </label>
            <input
              type="file"
              accept=".txt,.pdf,.docx,application/pdf,text/plain"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleFileUpload(file);
              }}
              className="mt-3 w-full rounded-md border border-slate-700 bg-slate-900 p-2 text-sm text-slate-200 file:mr-3 file:rounded-md file:border-0 file:bg-purple-500 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-purple-400"
            />
            {uploadStatus && (
              <p className="mt-2 text-sm text-slate-400">{uploadStatus}</p>
            )}
            <textarea
              value={resume}
              onChange={(event) => setResume(event.target.value)}
              placeholder="Resume text will appear here..."
              className="mt-4 h-36 w-full resize-y rounded-md border border-slate-700 bg-slate-900 p-3 text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/25"
            />
          </div>
        </section>

        <section>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Search by role, company, skill, location..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="min-h-12 flex-1 rounded-md border border-slate-700 bg-slate-900 px-4 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/25"
            />
            <div className="rounded-md border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300">
              {displayedJobs.length} roles
            </div>
          </div>
          <label className="mt-3 flex w-fit items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={showProfileMatchesOnly}
              onChange={(event) => setShowProfileMatchesOnly(event.target.checked)}
            />
            Match my profile preferences
          </label>

          {filteredJobs.length === 0 && search.trim() !== "" && (
            <p className="mt-4 text-center text-sm text-slate-400">
              No exact match found, showing all available jobs.
            </p>
          )}
        </section>

        <section className="grid gap-4">
          {isLoading ? (
            <p className="rounded-lg border border-white/10 bg-white/[0.03] p-6 text-center text-slate-400">
              Loading jobs...
            </p>
          ) : (
            displayedJobs.map(({ job, matchScore }) => {
              const isSaved = savedJobs.some(
                (savedJob) => savedJob.id === job.id
              );

              return (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={isSaved}
                  isTracked={applications.some(
                    (application) => application.id === job.id
                  )}
                  matchScore={resume.trim() ? matchScore : undefined}
                  onToggleSave={() => toggleSave(job)}
                  onApply={() => trackApplication(job, matchScore)}
                />
              );
            })
          )}
        </section>
    </AppShell>
  );
}

async function extractPdfText(file: File) {
  const pdfjs = await import("pdfjs-dist");
  const worker = await import("pdfjs-dist/build/pdf.worker.mjs?url");

  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;

  const bytes = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: bytes }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");

    pages.push(text);
  }

  return pages.join("\n\n").trim();
}

async function extractDocxText(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const documentXml = await readZipText(bytes, "word/document.xml");
  const document = new DOMParser().parseFromString(documentXml, "application/xml");
  const textNodes = [...document.getElementsByTagName("w:t")];
  const text = textNodes.map((node) => node.textContent || "").join(" ");

  if (!text.trim()) {
    throw new Error("No readable document text found in DOCX.");
  }

  return text.replace(/\s+/g, " ").trim();
}

async function readZipText(bytes: Uint8Array, filename: string) {
  const view = new DataView(bytes.buffer);
  const endOfCentralDirectory = findSignature(bytes, 0x06054b50, true);

  if (endOfCentralDirectory < 0) {
    throw new Error("Invalid DOCX archive.");
  }

  const centralDirectorySize = view.getUint32(endOfCentralDirectory + 12, true);
  const centralDirectoryOffset = view.getUint32(endOfCentralDirectory + 16, true);
  let cursor = centralDirectoryOffset;

  while (cursor < centralDirectoryOffset + centralDirectorySize) {
    if (view.getUint32(cursor, true) !== 0x02014b50) break;

    const compressionMethod = view.getUint16(cursor + 10, true);
    const compressedSize = view.getUint32(cursor + 20, true);
    const fileNameLength = view.getUint16(cursor + 28, true);
    const extraLength = view.getUint16(cursor + 30, true);
    const commentLength = view.getUint16(cursor + 32, true);
    const localHeaderOffset = view.getUint32(cursor + 42, true);
    const nameBytes = bytes.slice(cursor + 46, cursor + 46 + fileNameLength);
    const name = new TextDecoder().decode(nameBytes);

    if (name === filename) {
      const localNameLength = view.getUint16(localHeaderOffset + 26, true);
      const localExtraLength = view.getUint16(localHeaderOffset + 28, true);
      const dataOffset = localHeaderOffset + 30 + localNameLength + localExtraLength;
      const compressed = bytes.slice(dataOffset, dataOffset + compressedSize);

      if (compressionMethod === 0) {
        return new TextDecoder().decode(compressed);
      }

      if (compressionMethod === 8) {
        const decompressed = await decompressRawDeflate(compressed);
        return new TextDecoder().decode(decompressed);
      }

      throw new Error("Unsupported DOCX compression method.");
    }

    cursor += 46 + fileNameLength + extraLength + commentLength;
  }

  throw new Error(`${filename} not found in DOCX archive.`);
}

async function decompressRawDeflate(bytes: Uint8Array) {
  const buffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer;
  const stream = new Blob([buffer]).stream().pipeThrough(
    new DecompressionStream("deflate-raw")
  );
  const response = new Response(stream);
  return new Uint8Array(await response.arrayBuffer());
}

function findSignature(bytes: Uint8Array, signature: number, reverse = false) {
  const view = new DataView(bytes.buffer);
  const start = reverse ? bytes.length - 4 : 0;
  const end = reverse ? -1 : bytes.length - 3;
  const step = reverse ? -1 : 1;

  for (let index = start; reverse ? index > end : index < end; index += step) {
    if (view.getUint32(index, true) === signature) return index;
  }

  return -1;
}

function readSavedJobs() {
  return readLocal(storageKeys.savedJobs, []);
}

export default Home;
