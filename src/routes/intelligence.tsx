import { createFileRoute } from "@tanstack/react-router";
import { ChartBar as BarChart3, TrendingUp, PoundSterling, Calendar, Users } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

export const Route = createFileRoute("/intelligence")({
  component: IntelligencePage,
});

const revenueData = [
  { m: "Jan", r: 9200 }, { m: "Feb", r: 11400 }, { m: "Mar", r: 13800 },
  { m: "Apr", r: 12100 }, { m: "May", r: 15600 }, { m: "Jun", r: 18250 },
];

const channelData = [
  { ch: "Google", v: 42 }, { ch: "Referral", v: 28 }, { ch: "Direct", v: 18 },
  { ch: "Social", v: 8 }, { ch: "Other", v: 4 },
];

const metrics = [
  { label: "Total Revenue YTD", value: "£80,350", trend: "+14%", icon: PoundSterling },
  { label: "Avg. Job Value", value: "£285", trend: "+8%", icon: TrendingUp },
  { label: "New Customers", value: "68", trend: "+22%", icon: Users },
  { label: "Jobs Completed", value: "212", trend: "+11%", icon: Calendar },
];

function IntelligencePage() {
  return (
    <AppLayout>
      <PageHeader
        title="Business Intelligence"
        description="Deep-dive analytics and performance insights to guide strategic decisions."
        crumbs={[{ label: "Business Intelligence" }]}
        action={{ label: "Export Report" }}
        secondaryAction={{ label: "Custom Range" }}
      />

      {/* KPI metrics */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="rounded-xl border border-border bg-card p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] font-medium text-muted-foreground">{m.label}</span>
                <Icon className="h-4 w-4 text-muted-foreground/50" strokeWidth={1.75} />
              </div>
              <div className="mt-2 text-[22px] font-bold tracking-tight text-foreground">{m.value}</div>
              <div className="mt-0.5 text-[11px] font-semibold text-brand">{m.trend} vs last period</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Revenue trend */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-soft lg:col-span-3">
          <div className="mb-4 text-[13.5px] font-semibold text-foreground">Revenue Trend — 2025</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="intGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E31B23" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#E31B23" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="oklch(0.925 0 0)" strokeDasharray="3 3" />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.925 0 0)", fontSize: 12, padding: "6px 10px" }}
                  formatter={(v: number) => [`£${v.toLocaleString()}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="r" stroke="#E31B23" strokeWidth={2} fill="url(#intGrad)" activeDot={{ r: 4, fill: "#E31B23", stroke: "#fff", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel breakdown */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-soft lg:col-span-2">
          <div className="mb-4 text-[13.5px] font-semibold text-foreground">Customer Acquisition</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData} margin={{ top: 5, right: 5, left: -28, bottom: 0 }} layout="vertical">
                <CartesianGrid horizontal={false} stroke="oklch(0.925 0 0)" strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} unit="%" />
                <YAxis type="category" dataKey="ch" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.925 0 0)", fontSize: 12, padding: "6px 10px" }}
                  formatter={(v: number) => [`${v}%`, "Share"]}
                />
                <Bar dataKey="v" fill="#E31B23" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
