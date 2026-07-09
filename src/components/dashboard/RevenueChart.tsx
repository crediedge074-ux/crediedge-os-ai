import { ChevronDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
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
  { d: "1", r: 4200 },
  { d: "4", r: 5100 },
  { d: "7", r: 4800 },
  { d: "10", r: 6200 },
  { d: "13", r: 5900 },
  { d: "16", r: 7400 },
  { d: "19", r: 8100 },
  { d: "22", r: 7600 },
  { d: "25", r: 9200 },
  { d: "28", r: 10400 },
  { d: "30", r: 11800 },
];

function Metric({ label, value, trend }: { label: string; value: string; trend: number }) {
  const up = trend >= 0;
  return (
    <div>
      <div className="text-[11.5px] font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 text-[20px] font-bold tracking-tight text-foreground">{value}</div>
      <div
        className={`mt-0.5 inline-flex items-center gap-0.5 text-[11px] font-medium ${
          up ? "text-[color:var(--success)]" : "text-destructive"
        }`}
      >
        {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {up ? "+" : ""}
        {trend}%
      </div>
    </div>
  );
}

export function RevenueChart() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <div className="text-[15px] font-semibold tracking-tight text-foreground">
            Business Overview
          </div>
          <div className="mt-0.5 text-[12px] text-muted-foreground">
            Revenue performance
          </div>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[12px] font-medium text-foreground transition hover:bg-secondary">
          This Month <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E31B23" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#E31B23" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#F0F0F0" strokeDasharray="0" />
            <XAxis
              dataKey="d"
              tick={{ fontSize: 11, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #E8E8E8",
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              }}
              formatter={(v: number) => [`£${v.toLocaleString()}`, "Revenue"]}
            />
            <Area
              type="monotone"
              dataKey="r"
              stroke="#E31B23"
              strokeWidth={2}
              fill="url(#rev)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4 border-t border-border pt-5">
        <Metric label="Revenue" value="£82,410" trend={12.4} />
        <Metric label="Expenses" value="£24,180" trend={-3.2} />
        <Metric label="Profit" value="£58,230" trend={18.9} />
      </div>
    </div>
  );
}
