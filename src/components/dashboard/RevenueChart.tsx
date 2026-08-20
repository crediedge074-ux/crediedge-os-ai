import { useState, useEffect } from "react";
import { ChevronDown, ArrowUp, ArrowDown, Sparkles, Calendar } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  fetchRevenueChartData,
  type TimeframeOption,
  type RevenueChartData,
  type FinancialMetricValue,
} from "@/services/revenueChart";

const TIMEFRAME_LABELS: Record<TimeframeOption, string> = {
  day: "Day",
  week: "Week",
  month: "Month",
  quarter: "Quarter",
  "6months": "6 Months",
  year: "Year",
  custom: "Custom Range",
};

function Metric({ label, metric }: { label: string; metric: FinancialMetricValue }) {
  const up = (metric.trend ?? 0) >= 0;

  return (
    <div>
      <div className="text-[11px] font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 text-[17px] font-bold tracking-tight text-foreground">{metric.value}</div>
      {metric.hasData && metric.trend !== null ? (
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
          {Math.abs(metric.trend)}%
        </div>
      ) : (
        <div className="mt-0.5 text-[10.5px] text-muted-foreground">
          {metric.hasData ? "Stable" : "Unavailable"}
        </div>
      )}
    </div>
  );
}

export function RevenueChart() {
  const { membership } = useAuthContext();
  const businessId = membership?.business_id;

  const [timeframe, setTimeframe] = useState<TimeframeOption>("month");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [customError, setCustomError] = useState<string | null>(null);

  const [chartData, setChartData] = useState<RevenueChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchRevenueChartData(businessId, timeframe, customStart, customEnd)
      .then((data) => {
        if (mounted) {
          setChartData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load revenue chart data:", err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [businessId, timeframe, customStart, customEnd]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStart || !customEnd) {
      setCustomError("Please select both start and end dates.");
      return;
    }
    if (new Date(customStart) > new Date(customEnd)) {
      setCustomError("Start date cannot be after end date.");
      return;
    }
    setCustomError(null);
    setTimeframe("custom");
    setDropdownOpen(false);
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[13.5px] font-semibold tracking-tight text-foreground">Revenue Snapshot</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">{chartData?.timeframeLabel ?? "Month to date"}</div>
        </div>

        {/* Timeframe Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium text-foreground transition-colors duration-150 hover:bg-secondary"
          >
            {TIMEFRAME_LABELS[timeframe]} <ChevronDown className="h-3 w-3" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-9 z-30 w-64 rounded-xl border border-border bg-card p-2 shadow-xl">
              <div className="space-y-1">
                {(["day", "week", "month", "quarter", "6months", "year"] as TimeframeOption[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => {
                      setTimeframe(tf);
                      setDropdownOpen(false);
                    }}
                    className={`w-full rounded-lg px-3 py-1.5 text-left text-[11.5px] font-medium transition-colors ${
                      timeframe === tf ? "bg-brand/10 text-brand font-semibold" : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {TIMEFRAME_LABELS[tf]}
                  </button>
                ))}
              </div>

              {/* Custom Date Range Picker */}
              <div className="mt-2 border-t border-border pt-2">
                <div className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Custom Range
                </div>
                <form onSubmit={handleCustomSubmit} className="space-y-2">
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full rounded-lg border border-border bg-secondary/50 px-2 py-1 text-[11px] text-foreground focus:outline-none"
                  />
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full rounded-lg border border-border bg-secondary/50 px-2 py-1 text-[11px] text-foreground focus:outline-none"
                  />
                  {customError && <div className="text-[10px] text-destructive">{customError}</div>}
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-brand py-1 text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Apply Range
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="min-h-[180px] flex-1">
        {loading ? (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            Loading revenue data...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData?.chartData ?? [{ d: "Now", r: 0 }]} margin={{ top: 8, right: 6, left: -20, bottom: 0 }}>
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
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `£${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
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
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4">
        <Metric label="Total Revenue" metric={chartData?.totalRevenue ?? { value: "£0", trend: null, hasData: false }} />
        <Metric label="Total Expenses" metric={chartData?.totalExpenses ?? { value: "N/A", trend: null, hasData: false }} />
        <Metric label="Net Profit" metric={chartData?.netProfit ?? { value: "N/A", trend: null, hasData: false }} />
      </div>

      {/* AI Commentary */}
      <div className="mt-4 rounded-xl bg-secondary/60 p-3.5">
        <div className="mb-2 flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-brand" strokeWidth={2} />
          <span className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">AI Observation</span>
        </div>
        <ul className="space-y-1">
          {chartData?.aiObservations.map((insight, idx) => (
            <li key={idx} className="flex items-start gap-1.5 text-[11.5px] text-muted-foreground">
              <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-brand/60" />
              {insight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
