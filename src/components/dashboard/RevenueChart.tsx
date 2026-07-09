import { ChevronDown, ArrowUp, ArrowDown } from "lucide-react";
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
  { d: "1 May", r: 2200 },
  { d: "5 May", r: 4800 },
  { d: "10 May", r: 7100 },
  { d: "15 May", r: 9400 },
  { d: "20 May", r: 12250 },
  { d: "25 May", r: 15100 },
  { d: "31 May", r: 18250 },
];

function Metric({ label, value, trend }: { label: string; value: string; trend: number }) {
  const up = trend >= 0;
  return (
    <div>
      <div className="text-[11.5px] font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 text-[20px] font-bold tracking-tight text-foreground">{value}</div>
      <div className="mt-0.5 inline-flex items-center gap-0.5 text-[11px] font-semibold text-brand">
        {up ? <ArrowUp className="h-3 w-3" strokeWidth={2.5} /> : <ArrowDown className="h-3 w-3" strokeWidth={2.5} />}
        {up ? "" : ""}
        {Math.abs(trend)}%
      </div>
    </div>
  );
}

export function RevenueChart() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="mb-5 flex items-start justify-between">
        <div className="text-[15px] font-semibold tracking-tight text-foreground">
          Business Overview
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[12px] font-medium text-foreground transition hover:bg-secondary">
          This Month <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="min-h-[240px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E31B23" stopOpacity={0.32} />
                <stop offset="100%" stopColor="#E31B23" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#F0F0F0" />
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
              strokeWidth={2.25}
              fill="url(#rev)"
              activeDot={{ r: 5, fill: "#E31B23", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4 border-t border-border pt-5">
        <Metric label="Total Revenue" value="£18,250" trend={12.5} />
        <Metric label="Total Expenses" value="£7,650" trend={-3.2} />
        <Metric label="Net Profit" value="£10,600" trend={18.7} />
      </div>
    </div>
  );
}
