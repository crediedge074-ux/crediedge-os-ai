import { TrendingUp, ArrowRight } from "lucide-react";

export function HealthScore() {
  const score = 84;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="rounded-xl bg-white/[0.04] p-4 ring-1 ring-white/10">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-white/50">
          Business Health
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 shrink-0">
          <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke="#E31B23"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-lg font-bold text-white">
            {score}
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white">Good</div>
          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-white/60">
            <TrendingUp className="h-3 w-3 text-brand" strokeWidth={2} />
            +6 vs yesterday
          </div>
        </div>
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-md bg-white/10 py-2 text-xs font-medium text-white transition hover:bg-white/15">
        View Full Report <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
