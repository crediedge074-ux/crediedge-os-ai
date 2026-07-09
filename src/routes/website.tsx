import { createFileRoute } from "@tanstack/react-router";
import { Globe, ExternalLink, RefreshCw, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, TrendingUp } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";

export const Route = createFileRoute("/website")({
  component: WebsitePage,
});

const issues = [
  { id: 1, severity: "high", title: "Page speed score is 62/100", detail: "Core Web Vitals are below Google's recommended threshold. This may affect your SEO ranking.", action: "Fix Now" },
  { id: 2, severity: "medium", title: "Missing meta descriptions on 3 pages", detail: "Pages without meta descriptions may rank lower in search results.", action: "Review" },
  { id: 3, severity: "low", title: "SSL certificate expires in 28 days", detail: "Renew your SSL certificate before it expires to avoid downtime.", action: "Renew" },
];

const stats = [
  { label: "Monthly Visitors", value: "1,842", trend: "+12%" },
  { label: "Bounce Rate", value: "38%", trend: "-4%" },
  { label: "Avg. Session", value: "2m 14s", trend: "+0:22" },
  { label: "Enquiries via Web", value: "47", trend: "+18%" },
];

const sevColor: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-secondary text-muted-foreground border-border",
};

const sevDot: Record<string, string> = {
  high: "bg-destructive",
  medium: "bg-warning",
  low: "bg-muted-foreground/40",
};

function WebsitePage() {
  return (
    <AppLayout>
      <PageHeader
        title="Website"
        description="Monitor your website performance, SEO health and visitor analytics."
        crumbs={[{ label: "Website" }]}
        action={{ label: "Run Audit", icon: RefreshCw }}
      >
        <a href="#" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-secondary">
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
          View Site
        </a>
      </PageHeader>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-soft">
            <div className="text-[11.5px] font-medium text-muted-foreground">{s.label}</div>
            <div className="mt-2 text-[22px] font-bold tracking-tight text-foreground">{s.value}</div>
            <div className="mt-0.5 text-[11px] font-semibold text-brand">{s.trend}</div>
          </div>
        ))}
      </div>

      {/* Issues */}
      <div className="rounded-xl border border-border bg-card shadow-soft">
        <div className="flex items-center gap-2.5 border-b border-border px-5 py-3.5">
          <AlertTriangle className="h-4 w-4 text-warning" strokeWidth={1.75} />
          <span className="text-[13.5px] font-semibold text-foreground">Active Issues</span>
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">{issues.length}</span>
        </div>
        <ul className="divide-y divide-border">
          {issues.map((i) => (
            <li key={i.id} className={`flex items-start gap-4 px-5 py-4 transition-colors hover:bg-secondary/30`}>
              <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${sevDot[i.severity]}`} />
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold text-foreground">{i.title}</div>
                <div className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{i.detail}</div>
              </div>
              <button className={`shrink-0 rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition-colors hover:opacity-80 ${sevColor[i.severity]}`}>
                {i.action}
              </button>
            </li>
          ))}
        </ul>
        <div className="border-t border-border px-5 py-3.5">
          <div className="flex items-center gap-2 text-[12.5px] text-success">
            <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />
            <span>14 checks passed · Last audit: 3 hours ago</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
