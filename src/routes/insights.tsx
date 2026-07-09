import { createFileRoute } from "@tanstack/react-router";
import { FileText, Plus, Download } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export const Route = createFileRoute("/insights")({
  component: InsightsPage,
});

const reports = [
  { id: 1, title: "Monthly Performance — June 2025", type: "Performance", created: "1 Jul 2025", size: "PDF, 2.4 MB" },
  { id: 2, title: "Customer Acquisition Report — Q2 2025", type: "Customers", created: "30 Jun 2025", size: "PDF, 1.8 MB" },
  { id: 3, title: "Revenue Analysis — May 2025", type: "Revenue", created: "1 Jun 2025", size: "PDF, 3.1 MB" },
  { id: 4, title: "Review Summary — Q2 2025", type: "Reviews", created: "30 Jun 2025", size: "PDF, 0.9 MB" },
];

const typeColor: Record<string, string> = {
  Performance: "bg-brand/10 text-brand",
  Customers: "bg-success/10 text-success",
  Revenue: "bg-warning/10 text-warning",
  Reviews: "bg-secondary text-foreground/70",
};

function InsightsPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Insights"
        description="Generate, view and download business performance reports."
        crumbs={[{ label: "Insights" }]}
        action={{ label: "Generate Report", icon: Plus }}
        secondaryAction={{ label: "Schedule Reports" }}
      />

      {reports.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No reports yet"
          description="Generate your first report to get a detailed performance overview."
          action={{ label: "Generate Report" }}
        />
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Report</th>
                  <th className="hidden px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">Type</th>
                  <th className="hidden px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Created</th>
                  <th className="hidden px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">Size</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reports.map((r) => (
                  <tr key={r.id} className="group transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary text-muted-foreground">
                          <FileText className="h-4 w-4" strokeWidth={1.75} />
                        </div>
                        <span className="font-medium text-foreground">{r.title}</span>
                      </div>
                    </td>
                    <td className="hidden px-5 py-3.5 sm:table-cell">
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${typeColor[r.type]}`}>{r.type}</span>
                    </td>
                    <td className="hidden px-5 py-3.5 text-muted-foreground md:table-cell">{r.created}</td>
                    <td className="hidden px-5 py-3.5 text-muted-foreground lg:table-cell">{r.size}</td>
                    <td className="px-5 py-3.5">
                      <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11.5px] font-medium text-foreground opacity-0 transition-all duration-150 group-hover:opacity-100 hover:bg-secondary">
                        <Download className="h-3 w-3" strokeWidth={1.75} />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
