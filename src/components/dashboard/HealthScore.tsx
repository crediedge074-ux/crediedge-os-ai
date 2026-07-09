import { ArrowUp, ArrowRight } from "lucide-react";

export function HealthScore() {
  const score = 84;
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="rounded-2xl bg-[#0D0D0D] p-5 text-white">
      <div className="mb-4 text-center text-[12px] font-semibold text-white">
        Business Health Score
      </div>

      <div className="mx-auto grid h-[104px] w-[104px] place-items-center">
        <div className="relative h-full w-full">
          <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="rgba(255,255,255,0.10)"
              strokeWidth="5"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#E31B23"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="text-[28px] font-bold leading-none">{score}</div>
              <div className="mt-1 text-[10.5px] text-white/70">Good</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-1 text-[11px] text-brand">
        <ArrowUp className="h-3 w-3" strokeWidth={2.5} />
        <span className="font-semibold">6 pts</span>
        <span className="text-white/60">vs yesterday</span>
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-brand/40 bg-transparent py-2 text-[12px] font-semibold text-brand transition hover:bg-brand hover:text-white">
        View Full Report <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
