import type { LucideIcon } from "lucide-react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface KpiCardProps {
  title: string;
  value: string;
  trend: number;
  trendLabel?: string;
  insight?: string;
  icon: LucideIcon;
  iconTone?: "muted" | "brand";
  data?: { v: number }[];
  unit?: string;
}

export function KpiCard({
  title,
  value,
  trend,
  trendLabel = "vs last month",
  insight,
  icon: Icon,
  iconTone = "muted",
  data,
  unit = "%",
}: KpiCardProps) {
  const up = trend >= 0;
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card hover:border-foreground/10">
      <div className="flex items-start justify-between gap-2">
        <div className="text-[11.5px] font-medium leading-tight text-muted-foreground">
          {title}
        </div>
        <div
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg transition-colors ${
            iconTone === "brand"
              ? "bg-brand/10 text-brand"
              : "bg-secondary text-foreground/60 group-hover:bg-secondary/80"
          }`}
        >
          <Icon className="h-[13px] w-[13px]" strokeWidth={1.75} />
        </div>
      </div>

      <div className="mt-3 text-[22px] font-bold leading-none tracking-tight text-foreground">
        {value}
      </div>

      <div className="mt-2.5 flex items-end justify-between gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-[11px]">
            <span className={`inline-flex items-center gap-0.5 font-semibold ${up ? "text-brand" : "text-destructive"}`}>
              {up ? (
                <ArrowUp className="h-2.5 w-2.5" strokeWidth={2.5} />
              ) : (
                <ArrowDown className="h-2.5 w-2.5" strokeWidth={2.5} />
              )}
              {Math.abs(trend)}
              {unit}
            </span>
            <span className="whitespace-nowrap text-muted-foreground">{trendLabel}</span>
          </div>
          {insight && (
            <div className="text-[10.5px] text-muted-foreground leading-tight">{insight}</div>
          )}
        </div>

        {data && (
          <div className="h-8 w-14 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id={`spark-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E31B23" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#E31B23" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="#E31B23"
                  strokeWidth={1.5}
                  fill={`url(#spark-${title})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
