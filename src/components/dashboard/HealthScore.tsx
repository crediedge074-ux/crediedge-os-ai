import { ArrowUp, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function HealthScore() {
  const target = 84;
  const [score, setScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const step = () => {
        current = Math.min(current + 2, target);
        setScore(current);
        if (current < target) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="rounded-xl bg-[#0D0D0D] p-4 text-white">
      <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/50">
        CrediEdge Score™
      </div>

      <div className="flex items-center gap-3">
        <div className="relative h-[64px] w-[64px] shrink-0">
          <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="4.5"
              fill="none"
            />
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke="#E31B23"
              strokeWidth="4.5"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.05s linear" }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="text-[19px] font-bold leading-none">{score}</div>
              <div className="mt-0.5 text-[8px] font-semibold text-white/60 uppercase tracking-wide">
                Excellent
              </div>
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-brand">
            <ArrowUp className="h-3 w-3" strokeWidth={2.5} />
            <span>+6 this week</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[10.5px] text-white/50">
            <TrendingUp className="h-3 w-3" strokeWidth={1.75} />
            Top 12% of businesses
          </div>
        </div>
      </div>

      <Link
        to="/health"
        className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-brand/30 py-1.5 text-[11px] font-semibold text-brand transition-all duration-200 hover:bg-brand hover:text-white hover:border-brand"
      >
        View Full Report <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
