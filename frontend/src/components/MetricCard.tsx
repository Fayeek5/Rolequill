type Props = {
  label: string;
  value: string;
  tone?: "cyan" | "rose" | "emerald" | "amber" | "violet";
};

const toneClasses = {
  cyan: "border-cyan-300/30 text-cyan-100",
  rose: "border-rose-300/30 text-rose-100",
  emerald: "border-emerald-300/30 text-emerald-100",
  amber: "border-amber-300/30 text-amber-100",
  violet: "border-violet-300/30 text-violet-100",
};

function MetricCard({ label, value, tone = "cyan" }: Props) {
  return (
    <div className={`rounded-lg border bg-white/[0.04] p-4 ${toneClasses[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black tracking-normal">{value}</p>
    </div>
  );
}

export default MetricCard;
