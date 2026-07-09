import type { LucideIcon } from "lucide-react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface KpiCardProps {
  title: string;
  value: string;
  trend: number;
  trendLabel?: string;
  icon: LucideIcon;
  iconTone?: "muted" | "brand";
  data?: { v: number }[];
}

export function KpiCard({
  title,
  value,
  trend,
  trendLabel = "vs last month",
  icon: Icon,
  iconTone = "muted",
  data,
}: KpiCardProps) {
  const up = trend >= 0;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div className="text-[12.5px] font-medium text-muted-foreground">{title}</div>
        <div
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
            iconTone === "brand"
              ? "bg-brand/10 text-brand"
              : "bg-secondary text-foreground/70"
          }`}
        >
          <Icon className="h-[16px] w-[16px]" strokeWidth={1.75} />
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[28px] font-bold leading-none tracking-tight text-foreground">
            {value}
          </div>
        </div>
        {data && (
          <div className="h-10 w-20 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={`spark-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E31B23" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#E31B23" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="#E31B23"
                  strokeWidth={1.75}
                  fill={`url(#spark-${title})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[11.5px]">
        <span className="inline-flex items-center gap-0.5 font-semibold text-brand">
          {up ? <ArrowUp className="h-3 w-3" strokeWidth={2.5} /> : <ArrowDown className="h-3 w-3" strokeWidth={2.5} />}
          {trend}
          {typeof trend === "number" && Number.isFinite(trend) && !Number.isInteger(trend) ? "" : ""}
          {title.toLowerCase().includes("rating") || title.toLowerCase().includes("enquiries") || title.toLowerCase().includes("jobs") ? "" : "%"}
        </span>
        <span className="text-muted-foreground">{trendLabel}</span>
      </div>
    </div>
  );
}
