import { ArrowUp, ArrowDown, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { fetchCrediEdgeScore, type CrediEdgeScoreData } from "@/services/score";

export function HealthScore() {
  const { membership } = useAuthContext();
  const businessId = membership?.business_id;

  const [scoreData, setScoreData] = useState<CrediEdgeScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchCrediEdgeScore(businessId)
      .then((data) => {
        if (mounted) {
          setScoreData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load sidebar score:", err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [businessId]);

  useEffect(() => {
    if (!scoreData || !scoreData.hasSufficientData) return;
    const target = scoreData.overallScore;
    let current = 0;
    const timer = setTimeout(() => {
      const step = () => {
        current = Math.min(current + 2, target);
        setDisplayScore(current);
        if (current < target) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 200);

    return () => clearTimeout(timer);
  }, [scoreData]);

  // Refined SVG gauge dimensions to eliminate text/ring collision completely
  const radius = 26;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const targetScore = scoreData?.hasSufficientData ? displayScore : 0;
  const offset = circumference - (targetScore / 100) * circumference;

  return (
    <Link
      to="/health"
      className="group block rounded-xl bg-[#0D0D0D] p-3.5 text-white transition-all duration-200 hover:border hover:border-brand/30 hover:bg-[#121212]"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
          CrediEdge Score™
        </span>
        <ArrowRight className="h-3 w-3 text-brand opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5" />
      </div>

      {loading ? (
        <div className="py-3 text-center text-[10.5px] text-white/40">Calculating score...</div>
      ) : !scoreData?.hasSufficientData ? (
        <div className="py-2 text-center">
          <div className="text-[11px] font-semibold text-white/80">Pending Workspace Data</div>
          <div className="mt-0.5 text-[10px] text-white/40">Add data to calculate score</div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {/* Circular score gauge */}
          <div className="relative h-[62px] w-[64px] shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke="#E31B23"
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 0.05s linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[18px] font-extrabold leading-none text-white tracking-tight">
                {displayScore}
              </span>
              <span className="mt-0.5 text-[7.5px] font-bold uppercase tracking-wider text-brand truncate max-w-[52px]">
                {scoreData.ratingLabel}
              </span>
            </div>
          </div>

          {/* Score trend stats */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-brand">
              {scoreData.weeklyChange !== null && scoreData.weeklyChange < 0 ? (
                <ArrowDown className="h-3 w-3 text-destructive" strokeWidth={2.5} />
              ) : (
                <ArrowUp className="h-3 w-3 text-brand" strokeWidth={2.5} />
              )}
              <span>
                {scoreData.weeklyChange !== null
                  ? `${scoreData.weeklyChange >= 0 ? "+" : ""}${scoreData.weeklyChange} this week`
                  : "Stable"}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10.5px] text-white/50 truncate">
              <TrendingUp className="h-3 w-3 shrink-0" strokeWidth={1.75} />
              <span className="truncate">
                {scoreData.percentileRank ? `Top ${scoreData.percentileRank}% of businesses` : "Health index active"}
              </span>
            </div>
          </div>
        </div>
      )}
    </Link>
  );
}
