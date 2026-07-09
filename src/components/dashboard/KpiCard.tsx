import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface KpiCardProps {
  title: string;
  value: string;
  trend: number;
  icon: LucideIcon;
  data?: { v: number }[];
}

export function KpiCard({ title, value, trend, icon: Icon, data }: KpiCardProps) {
  const up = trend >= 0;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card">
      <div className="flex items-start justify-between">
        <div className="text-[12px] font-medium text-muted-foreground">{title}</div>
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-brand">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <div className="text-[26px] font-bold leading-none tracking-tight text-foreground">
            {value}
          </div>
          <div
            className={`mt-2 inline-flex items-center gap-1 text-[11.5px] font-medium ${
              up ? "text-[color:var(--success)]" : "text-destructive"
            }`}
          >
            {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {up ? "+" : ""}
            {trend}%
            <span className="ml-1 text-muted-foreground">vs last month</span>
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
