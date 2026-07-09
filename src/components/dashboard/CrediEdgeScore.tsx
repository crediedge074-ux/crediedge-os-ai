import { ArrowUp, ArrowDown, ArrowRight, TrendingUp, Info } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";

interface Category {
  name: string;
  score: number;
  color: string;
  description: string;
}

const categories: Category[] = [
  { name: "Communication", score: 92, color: "#10B981", description: "Response times, follow-up rate, and message quality." },
  { name: "Customer Experience", score: 89, color: "#3B82F6", description: "Reviews, satisfaction scores, and repeat business." },
  { name: "Operations", score: 81, color: "#8B5CF6", description: "Job completion rate, efficiency, and scheduling accuracy." },
  { name: "Finance", score: 80, color: "#F59E0B", description: "Invoice collection, cash flow health, and profit margins." },
  { name: "Marketing", score: 73, color: "#06B6D4", description: "Lead generation, ad performance, and brand presence." },
  { name: "Website", score: 68, color: "#F97316", description: "Speed, SEO ranking, and conversion performance." },
  { name: "Automation", score: 55, color: "#E31B23", description: "Workflow automation and time saved through AI tools." },
];

function CategoryBar({ cat, animate }: { cat: Category; animate: boolean }) {
  const [width, setWidth] = useState(0);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setWidth(cat.score), 100 + categories.indexOf(cat) * 60);
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
          {cat.score}
        </div>
        <Info className="h-3 w-3 shrink-0 cursor-help text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" strokeWidth={1.75} />
      </div>

      {/* Tooltip */}
      {showTip && (
        <div className="pointer-events-none absolute right-0 top-6 z-20 w-52 rounded-xl border border-border bg-card px-3 py-2.5 shadow-card">
          <div className="mb-1 text-[11px] font-semibold text-foreground">{cat.name}</div>
          <div className="text-[10.5px] leading-relaxed text-muted-foreground">{cat.description}</div>
        </div>
      )}
    </div>
  );
}

export function CrediEdgeScore() {
  const target = 84;
  const [score, setScore] = useState(0);
  const [animate, setAnimate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
          const timer = setTimeout(() => {
            let current = 0;
            const step = () => {
              current = Math.min(current + 1, target);
              setScore(current);
              if (current < target) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          }, 200);
          observer.disconnect();
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const radius = 54;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const size = 128;
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

      {/* Score + Stats row */}
      <div className="flex items-center gap-5">
        {/* Circular gauge */}
        <div className="relative shrink-0">
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
            {/* Progress */}
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
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[34px] font-extrabold leading-none tracking-tight text-foreground">
              {score}
            </div>
            <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-brand">
              Excellent
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-secondary/60 px-3 py-2.5">
              <div className="flex items-center gap-1 text-brand">
                <ArrowUp className="h-3 w-3" strokeWidth={2.5} />
                <span className="text-[13px] font-bold">+3</span>
              </div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">Today</div>
            </div>
            <div className="rounded-xl bg-secondary/60 px-3 py-2.5">
              <div className="flex items-center gap-1 text-brand">
                <ArrowUp className="h-3 w-3" strokeWidth={2.5} />
                <span className="text-[13px] font-bold">+7</span>
              </div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">This week</div>
            </div>
          </div>
          <div className="rounded-xl bg-brand/5 border border-brand/15 px-3 py-2.5">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
              <span className="text-[12px] font-semibold text-foreground">Top 12%</span>
            </div>
            <div className="mt-0.5 text-[10.5px] text-muted-foreground">of similar businesses</div>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="mt-5 space-y-2.5 border-t border-border pt-4">
        {categories.map((cat) => (
          <CategoryBar key={cat.name} cat={cat} animate={animate} />
        ))}
      </div>
    </div>
  );
}
