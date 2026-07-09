import { ChevronDown, ArrowUp, ArrowDown, Sparkles } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { d: "1 Jul", r: 2200 },
  { d: "3 Jul", r: 3100 },
  { d: "5 Jul", r: 4800 },
  { d: "7 Jul", r: 6200 },
  { d: "9 Jul", r: 7100 },
  { d: "11 Jul", r: 8900 },
  { d: "13 Jul", r: 9400 },
  { d: "15 Jul", r: 11200 },
  { d: "17 Jul", r: 12250 },
  { d: "19 Jul", r: 13600 },
  { d: "21 Jul", r: 14900 },
  { d: "25 Jul", r: 15100 },
  { d: "31 Jul", r: 18250 },
];

const aiInsights = [
  "Revenue has grown steadily for the last three weeks.",
  "Average order value has increased by 11% this month.",
  "Weekend bookings continue to outperform weekdays.",
];

function Metric({ label, value, trend }: { label: string; value: string; trend: number }) {
  const up = trend >= 0;
  return (
    <div>
      <div className="text-[11px] font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 text-[17px] font-bold tracking-tight text-foreground">{value}</div>
      <div
        className={`mt-0.5 inline-flex items-center gap-0.5 text-[10.5px] font-semibold ${
          up ? "text-brand" : "text-destructive"
        }`}
      >
        {up ? (
          <ArrowUp className="h-2.5 w-2.5" strokeWidth={2.5} />
        ) : (
          <ArrowDown className="h-2.5 w-2.5" strokeWidth={2.5} />
        )}
        {Math.abs(trend)}%
      </div>
    </div>
  );
}

export function RevenueChart() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="text-[13.5px] font-semibold tracking-tight text-foreground">Revenue Snapshot</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">Month to date</div>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium text-foreground transition-colors duration-150 hover:bg-secondary">
          This Month <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      <div className="min-h-[180px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 6, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="rev-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E31B23" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#E31B23" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="oklch(0.94 0 0)" strokeDasharray="4 4" />
            <XAxis
              dataKey="d"
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
              interval={3}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                border: "1px solid oklch(0.928 0 0)",
                fontSize: 11,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                padding: "8px 12px",
              }}
              formatter={(v: number) => [`£${v.toLocaleString()}`, "Revenue"]}
            />
            <Area
              type="monotone"
              dataKey="r"
              stroke="#E31B23"
              strokeWidth={2}
              fill="url(#rev-gradient)"
              activeDot={{ r: 4, fill: "#E31B23", stroke: "#fff", strokeWidth: 2 }}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4">
        <Metric label="Total Revenue" value="£18,250" trend={12.5} />
        <Metric label="Total Expenses" value="£7,650" trend={-3.2} />
        <Metric label="Net Profit" value="£10,600" trend={18.7} />
      </div>

      {/* AI Commentary */}
      <div className="mt-4 rounded-xl bg-secondary/60 p-3.5">
        <div className="mb-2 flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-brand" strokeWidth={2} />
          <span className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">AI Observation</span>
        </div>
        <ul className="space-y-1">
          {aiInsights.map((insight) => (
            <li key={insight} className="flex items-start gap-1.5 text-[11.5px] text-muted-foreground">
              <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-brand/60" />
              {insight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
