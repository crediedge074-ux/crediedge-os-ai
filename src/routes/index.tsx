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
import { TodaysBriefing } from "@/components/dashboard/TodaysBriefing";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Priorities } from "@/components/dashboard/Priorities";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Integrations } from "@/components/dashboard/Integrations";
import { Notifications } from "@/components/dashboard/Notifications";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const spark = (seed: number) =>
  Array.from({ length: 10 }, (_, i) => ({
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

        <main className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-7 xl:px-8">
          {/* Header */}
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-[26px]">
                Good morning, Dom! <span className="inline-block">👋</span>
              </h1>
              <p className="mt-1 text-[12.5px] text-muted-foreground">
                Here's what's happening with your business today.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.75} />
              {today}
            </div>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5">
            <KpiCard
              title="Revenue (MTD)"
              value="£18,250"
              trend={12.5}
              insight="Best performing month this year"
              icon={PoundSterling}
              data={spark(1)}
            />
            <KpiCard
              title="New Enquiries"
              value="27"
              trend={8}
              unit=""
              trendLabel="vs yesterday"
              insight="Response time improved 18%"
              icon={MessageSquare}
            />
            <KpiCard
              title="Booked Jobs"
              value="15"
              trend={4}
              unit=""
              trendLabel="vs yesterday"
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
              insight="3 reviews until 4.9 stars"
              icon={Star}
              iconTone="brand"
            />
          </div>

          {/* Second Row */}
          <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-4">
              <TodaysBriefing />
            </div>
            <div className="xl:col-span-5">
              <RevenueChart />
            </div>
            <div className="flex flex-col gap-4 xl:col-span-3">
              <Priorities />
              <Notifications />
            </div>
          </div>

          {/* Third Row */}
          <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-5">
              <RecentActivity />
            </div>
            <div className="xl:col-span-7">
              <Integrations />
            </div>
          </div>

          <div className="h-6" />
        </main>
      </div>
    </div>
  );
}
