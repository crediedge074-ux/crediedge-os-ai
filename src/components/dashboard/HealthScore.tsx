import { ArrowUp, ArrowRight } from "lucide-react";

export function HealthScore() {
  const score = 84;
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="rounded-xl bg-[#0D0D0D] p-3.5 text-white">
      <div className="mb-2 text-center text-[10.5px] font-semibold text-white">
        Business Health Score
      </div>

      <div className="mx-auto grid h-[68px] w-[68px] place-items-center">
        <div className="relative h-full w-full">
          <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke="rgba(255,255,255,0.10)"
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
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="text-[18px] font-bold leading-none">{score}</div>
              <div className="mt-0.5 text-[9px] text-white/70">Good</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-brand">
        <ArrowUp className="h-2.5 w-2.5" strokeWidth={2.5} />
        <span className="font-semibold">6 pts</span>
        <span className="text-white/60">vs yesterday</span>
      </div>

      <button className="mt-3 flex w-full items-center justify-center gap-1 rounded-md border border-brand/40 bg-transparent py-1.5 text-[11px] font-semibold text-brand transition hover:bg-brand hover:text-white">
        View Full Report <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}
