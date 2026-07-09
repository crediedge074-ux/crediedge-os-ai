import { createFileRoute } from "@tanstack/react-router";
import { Target, Plus } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export const Route = createFileRoute("/goals")({
  component: GoalsPage,
});

const goals = [
  { id: 1, title: "Reach £25,000 monthly revenue", category: "Revenue", progress: 73, target: "£25,000", current: "£18,250", deadline: "31 Jul 2025" },
  { id: 2, title: "Achieve 100 5-star reviews", category: "Reviews", progress: 84, target: "100", current: "84", deadline: "31 Aug 2025" },
  { id: 3, title: "Reduce response time to under 1 hour", category: "Enquiries", progress: 60, target: "< 1 hr", current: "1.4 hrs", deadline: "31 Jul 2025" },
  { id: 4, title: "Onboard 3 new VIP customers", category: "Customers", progress: 33, target: "3", current: "1", deadline: "30 Sep 2025" },
];

const categoryColor: Record<string, string> = {
  Revenue: "bg-brand/10 text-brand",
  Reviews: "bg-warning/10 text-warning",
  Enquiries: "bg-success/10 text-success",
  Customers: "bg-secondary text-foreground/70",
};

function GoalsPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Goals"
        description="Set, track and achieve your business growth targets."
        crumbs={[{ label: "Goals" }]}
        action={{ label: "Create Goal", icon: Plus }}
      />

      {goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No goals yet"
          description="Create your first business goal to start tracking your progress."
          action={{ label: "Create Goal" }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {goals.map((g) => (
            <div key={g.id} className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-soft transition-all duration-200 hover:border-foreground/10 hover:shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold ${categoryColor[g.category]}`}>{g.category}</span>
                  <h3 className="text-[14px] font-semibold leading-tight text-foreground">{g.title}</h3>
                </div>
                <button className="shrink-0 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11.5px] font-medium text-foreground transition-colors hover:bg-secondary">Edit</button>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-[12px] text-muted-foreground">
                  <span>Progress</span>
                  <span className="font-semibold text-foreground">{g.progress}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-brand transition-all duration-700"
                    style={{ width: `${g.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
                <div>
                  <div className="text-[10.5px] font-medium text-muted-foreground">Current</div>
                  <div className="mt-0.5 text-[13px] font-semibold text-foreground">{g.current}</div>
                </div>
                <div>
                  <div className="text-[10.5px] font-medium text-muted-foreground">Target</div>
                  <div className="mt-0.5 text-[13px] font-semibold text-foreground">{g.target}</div>
                </div>
                <div>
                  <div className="text-[10.5px] font-medium text-muted-foreground">Deadline</div>
                  <div className="mt-0.5 text-[13px] font-semibold text-foreground">{g.deadline}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
