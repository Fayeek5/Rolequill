import type { Job } from "../types";

type Props = {
  job: Job;
  isSaved: boolean;
  onToggleSave: () => void;
  matchScore?: number;
  onApply?: () => void;
  isTracked?: boolean;
};

function JobCard({
  job,
  isSaved,
  onToggleSave,
  matchScore,
  onApply,
  isTracked,
}: Props) {
  return (
    <article className="relative group rounded-lg border border-white/10 bg-slate-900/80 p-5 shadow-lg shadow-black/20 transition duration-200 hover:border-purple-400/50">
      <div className="flex gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-purple-300">
              {job.title}
            </h2>
            {typeof matchScore === "number" && (
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 text-xs font-semibold text-emerald-200">
                {matchScore}% match
              </span>
            )}
          </div>

          <p className="mt-1 text-gray-200">{job.company}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-400">
            <span>{job.location}</span>
            {job.type && <span>{job.type}</span>}
            {job.salaryRange && <span>{job.salaryRange}</span>}
          </div>

          {job.description && (
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-300">
              {job.description}
            </p>
          )}

          {job.tags && job.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {job.tags.slice(0, 6).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <button
            onClick={onToggleSave}
            aria-label={isSaved ? "Remove saved job" : "Save job"}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-2xl transition hover:border-purple-300 hover:bg-white/5"
          >
            {isSaved ? "⭐" : "☆"}
          </button>

          {onApply && (
            <button
              onClick={onApply}
              disabled={isTracked}
              className="rounded-md border border-cyan-300/30 px-3 py-2 text-xs font-black text-cyan-100 transition hover:bg-cyan-300/10 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-slate-500"
            >
              {isTracked ? "Tracked" : "Track"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default JobCard;
