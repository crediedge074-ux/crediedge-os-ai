import { createFileRoute } from "@tanstack/react-router";
import {
  PoundSterling,
  Inbox,
  CalendarCheck,
  TrendingUp,
  Star,
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

        <main className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-[32px] font-bold tracking-tight text-foreground">
                Good morning, Dom! <span className="inline-block">👋</span>
              </h1>
              <p className="mt-1.5 text-[14px] text-muted-foreground">
                Here's what's happening with your business today.
              </p>
            </div>
            <div className="text-[12.5px] font-medium text-muted-foreground">
              {today}
            </div>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <KpiCard title="Revenue (MTD)" value="£82,410" trend={12.4} icon={PoundSterling} data={spark(1)} />
            <KpiCard title="New Enquiries" value="47" trend={8.2} icon={Inbox} data={spark(2)} />
            <KpiCard title="Booked Jobs" value="23" trend={-2.1} icon={CalendarCheck} data={spark(3)} />
            <KpiCard title="Conversion Rate" value="34.8%" trend={4.7} icon={TrendingUp} data={spark(4)} />
            <KpiCard title="Avg. Review Rating" value="4.9" trend={1.2} icon={Star} data={spark(5)} />
          </div>

          {/* Second Row */}
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="xl:col-span-5">
              <AiCoach />
            </div>
            <div className="xl:col-span-4">
              <RevenueChart />
            </div>
            <div className="xl:col-span-3">
              <Priorities />
            </div>
          </div>

          {/* Third Row */}
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="xl:col-span-4">
              <RecentActivity />
            </div>
            <div className="xl:col-span-5">
              <Integrations />
            </div>
            <div className="xl:col-span-3">
              <Notifications />
            </div>
          </div>

          <div className="h-8" />
        </main>
      </div>
    </div>
  );
}
