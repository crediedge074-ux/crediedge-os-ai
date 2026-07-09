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
import { AiCoach } from "@/components/dashboard/AiCoach";
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
      <div className="lg:pl-64">
        <TopNav />

        <main className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8">
          {/* Header */}
          <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-[30px] font-bold tracking-tight text-foreground">
                Good morning, Dom! <span className="inline-block">👋</span>
              </h1>
              <p className="mt-1.5 text-[13.5px] text-muted-foreground">
                Here's what's happening with your business today.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-[12.5px] font-medium text-muted-foreground">
              <CalendarDays className="h-4 w-4" strokeWidth={1.75} />
              {today}
            </div>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <KpiCard
              title="Revenue (MTD)"
              value="£18,250"
              trend={12.5}
              icon={PoundSterling}
              data={spark(1)}
            />
            <KpiCard
              title="New Enquiries"
              value="27"
              trend={8}
              trendLabel="vs yesterday"
              icon={MessageSquare}
            />
            <KpiCard
              title="Booked Jobs"
              value="15"
              trend={4}
              trendLabel="vs yesterday"
              icon={Calendar}
              iconTone="brand"
            />
            <KpiCard
              title="Conversion Rate"
              value="36%"
              trend={5}
              icon={Percent}
              data={spark(4)}
            />
            <KpiCard
              title="Avg. Review Rating"
              value="4.8"
              trend={0.2}
              icon={Star}
              iconTone="brand"
            />
          </div>

          {/* Second Row */}
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="xl:col-span-4">
              <AiCoach />
            </div>
            <div className="xl:col-span-5">
              <RevenueChart />
            </div>
            <div className="flex flex-col gap-6 xl:col-span-3">
              <Priorities />
              <Notifications />
            </div>
          </div>

          {/* Third Row */}
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="xl:col-span-5">
              <RecentActivity />
            </div>
            <div className="xl:col-span-7">
              <Integrations />
            </div>
          </div>

          <div className="h-8" />
        </main>
      </div>
    </div>
  );
}
