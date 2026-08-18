import { ArrowUp, ArrowDown, ArrowRight, TrendingUp, Info } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { fetchCrediEdgeScore, type CrediEdgeScoreData, type CategoryScore } from "@/services/score";

function CategoryBar({ cat, animate }: { cat: CategoryScore; animate: boolean }) {
  const [width, setWidth] = useState(0);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setWidth(cat.score), 100);
      return () => clearTimeout(t);
    }
  }, [animate, cat]);

  const scoreColor =
    cat.score >= 85 ? "text-emerald-600" :
    cat.score >= 70 ? "text-foreground" :
    "text-orange-500";

  return (
    <div
      className="group relative"
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      <div className="flex items-center gap-2">
        <div className="w-[118px] shrink-0 text-[11.5px] font-medium text-foreground/80 lg:w-[130px]">
          {cat.name}
        </div>
        <div className="relative h-[6px] flex-1 overflow-hidden rounded-full bg-secondary">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${width}%`, backgroundColor: cat.color }}
          />
        </div>
        <div className={`w-7 shrink-0 text-right text-[12px] font-bold ${scoreColor}`}>
          {cat.hasData ? cat.score : "—"}
        </div>
        <Info className="h-3 w-3 shrink-0 cursor-help text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" strokeWidth={1.75} />
      </div>

      {/* Tooltip */}
      {showTip && (
        <div className="pointer-events-none absolute right-0 top-6 z-20 w-52 rounded-xl border border-border bg-card px-3 py-2.5 shadow-card">
          <div className="mb-1 text-[11px] font-semibold text-foreground">{cat.name} (Weight: {cat.weight}%)</div>
          <div className="text-[10.5px] leading-relaxed text-muted-foreground">{cat.description}</div>
        </div>
      )}
    </div>
  );
}

export function CrediEdgeScore() {
  const { membership } = useAuthContext();
  const businessId = membership?.business_id;

  const [scoreData, setScoreData] = useState<CrediEdgeScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayScore, setDisplayScore] = useState(0);
  const [animate, setAnimate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        console.error("Failed to fetch CrediEdge score:", err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [businessId]);

  useEffect(() => {
    if (!scoreData || !scoreData.hasSufficientData) return;

    const target = scoreData.overallScore;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
          let current = 0;
          const step = () => {
            current = Math.min(current + 1, target);
            setDisplayScore(current);
            if (current < target) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [scoreData]);

  const targetScore = scoreData?.hasSufficientData ? displayScore : 0;

  // Geometry for circular progress ring
  const size = 136;
  const radius = 50;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (targetScore / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div ref={ref} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-[13.5px] font-semibold tracking-tight text-foreground">CrediEdge Score™</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">Your business health index</div>
        </div>
        <Link
          to="/health"
          className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-brand transition-all duration-200 hover:gap-1.5"
        >
          Full Report <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-muted-foreground">
          Calculating CrediEdge Score from real workspace metrics...
        </div>
      ) : !scoreData?.hasSufficientData ? (
        <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-4 text-center">
          <div className="text-[13px] font-semibold text-foreground mb-1">Score Pending Workspace Data</div>
          <div className="text-[11.5px] leading-relaxed text-muted-foreground">
            {scoreData?.explanation.summary}
          </div>
        </div>
      ) : (
        <>
          {/* Score + Stats row */}
          <div className="flex items-center gap-5">
            {/* Circular gauge with generous inner spacing to prevent text collision */}
            <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                {/* Track */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  stroke="oklch(0.928 0 0)"
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                {/* Progress Ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  stroke="#E31B23"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  style={{ transition: "stroke-dashoffset 0.04s linear" }}
                />
              </svg>
              {/* Inner score text - centered cleanly inside circle radius */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-[32px] font-extrabold leading-none tracking-tight text-foreground">
                  {displayScore}
                </div>
                <div className="mt-1 text-[9.5px] font-bold uppercase tracking-wider text-brand">
                  {scoreData.ratingLabel}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-1 flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-secondary/60 px-3 py-2.5">
                  <div className="flex items-center gap-1 text-brand">
                    {scoreData.todayChange !== null && scoreData.todayChange < 0 ? (
                      <ArrowDown className="h-3 w-3 text-destructive" strokeWidth={2.5} />
                    ) : (
                      <ArrowUp className="h-3 w-3" strokeWidth={2.5} />
                    )}
                    <span className="text-[13px] font-bold">
                      {scoreData.todayChange !== null
                        ? `${scoreData.todayChange >= 0 ? "+" : ""}${scoreData.todayChange}`
                        : "0"}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">Today</div>
                </div>
                <div className="rounded-xl bg-secondary/60 px-3 py-2.5">
                  <div className="flex items-center gap-1 text-brand">
                    {scoreData.weeklyChange !== null && scoreData.weeklyChange < 0 ? (
                      <ArrowDown className="h-3 w-3 text-destructive" strokeWidth={2.5} />
                    ) : (
                      <ArrowUp className="h-3 w-3" strokeWidth={2.5} />
                    )}
                    <span className="text-[13px] font-bold">
                      {scoreData.weeklyChange !== null
                        ? `${scoreData.weeklyChange >= 0 ? "+" : ""}${scoreData.weeklyChange}`
                        : "0"}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">This week</div>
                </div>
              </div>
              <div className="rounded-xl bg-brand/5 border border-brand/15 px-3 py-2.5">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
                  <span className="text-[12px] font-semibold text-foreground">
                    {scoreData.percentileRank ? `Top ${scoreData.percentileRank}%` : "Active Workspace"}
                  </span>
                </div>
                <div className="mt-0.5 text-[10.5px] text-muted-foreground">
                  {scoreData.percentileRank ? "of similar businesses" : "health index tracking"}
                </div>
              </div>
            </div>
          </div>

          {/* Category breakdown */}
          <div className="mt-5 space-y-2.5 border-t border-border pt-4">
            {scoreData.categories.map((cat) => (
              <CategoryBar key={cat.name} cat={cat} animate={animate} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
