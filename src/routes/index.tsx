import { createFileRoute } from "@tanstack/react-router";
import {
  PoundSterling,
  MessageSquare,
  Calendar,
  Percent,
  Star,
  CalendarDays,
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNav } from "@/components/dashboard/TopNav";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { MorningBriefing } from "@/components/dashboard/MorningBriefing";
import { CrediEdgeScore } from "@/components/dashboard/CrediEdgeScore";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Priorities } from "@/components/dashboard/Priorities";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Notifications } from "@/components/dashboard/Notifications";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const spark = (seed: number) =>
  Array.from({ length: 12 }, (_, i) => ({
    v: Math.round(50 + Math.sin(i * 0.7 + seed) * 20 + i * (2 + seed / 3)),
  }));

function Dashboard() {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="lg:pl-60 xl:pl-64">
        <TopNav />

        <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-7 xl:px-8">

          {/* Date header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-[22px] font-bold tracking-tight text-foreground lg:text-2xl">
                Command Centre
              </h1>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                Everything you need to run your business today.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 text-[11.5px] font-medium text-muted-foreground shadow-soft">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.75} />
              {today}
            </div>
          </div>

          {/* ── Section 1: Morning Briefing ── */}
          <MorningBriefing />

          {/* ── Section 2: CrediEdge Score + Priorities ── */}
          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
            <div className="xl:col-span-5">
              <CrediEdgeScore />
            </div>
            <div className="xl:col-span-7">
              <Priorities />
            </div>
          </div>

          {/* ── Section 3: Business Snapshot KPIs ── */}
          <div className="mt-5">
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-[13px] font-semibold tracking-tight text-foreground">
                Business Snapshot
              </h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
              <KpiCard
                title="Revenue Today"
                value="£1,240"
                trend={18}
                trendLabel="vs yesterday"
                insight="Best performing Tuesday this month"
                icon={PoundSterling}
                data={spark(1)}
              />
              <KpiCard
                title="Revenue (MTD)"
                value="£18,250"
                trend={12.5}
                insight="On track for record month"
                icon={PoundSterling}
                data={spark(2)}
              />
              <KpiCard
                title="New Enquiries"
                value="27"
                trend={8}
                unit=""
                trendLabel="vs last week"
                insight="Response time improved 18%"
                icon={MessageSquare}
              />
              <KpiCard
                title="Booked Jobs"
                value="15"
                trend={4}
                unit=""
                trendLabel="vs last week"
                insight="Workshop utilisation at 91%"
                icon={Calendar}
                iconTone="brand"
              />
              <KpiCard
                title="Conversion Rate"
                value="36%"
                trend={5}
                insight="Above industry average"
                icon={Percent}
                data={spark(4)}
              />
              <KpiCard
                title="Avg. Review Rating"
                value="4.8"
                trend={0.2}
                unit=""
                trendLabel="this month"
                insight="Only 2 reviews away from 4.9★"
                icon={Star}
                iconTone="brand"
              />
            </div>
          </div>

          {/* ── Section 4: Revenue Chart ── */}
          <div className="mt-5">
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-[13px] font-semibold tracking-tight text-foreground">
                Revenue Snapshot
              </h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <RevenueChart />
          </div>

          {/* ── Section 5: Notifications + Recent Activity ── */}
          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
            <div className="xl:col-span-5">
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-[13px] font-semibold tracking-tight text-foreground">
                  Notifications
                </h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <Notifications />
            </div>
            <div className="xl:col-span-7">
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-[13px] font-semibold tracking-tight text-foreground">
                  Recent Activity
                </h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <RecentActivity />
            </div>
          </div>

          <div className="h-8" />
        </main>
      </div>
    </div>
  );
}
