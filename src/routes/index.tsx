import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { BusinessSnapshot } from "@/components/dashboard/BusinessSnapshot";
import { MorningBriefing } from "@/components/dashboard/MorningBriefing";
import { CrediEdgeScore } from "@/components/dashboard/CrediEdgeScore";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Priorities } from "@/components/dashboard/Priorities";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Notifications } from "@/components/dashboard/Notifications";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <AppLayout>
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
      <BusinessSnapshot />

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
    </AppLayout>
  );
}
