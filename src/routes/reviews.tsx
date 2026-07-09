import { createFileRoute } from "@tanstack/react-router";
import { Star, Plus, ExternalLink } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export const Route = createFileRoute("/reviews")({
  component: ReviewsPage,
});

const reviews = [
  { id: 1, name: "John Smith", rating: 5, text: "Absolutely brilliant service. Had my car serviced and it was back on the road the same day.", date: "2 days ago", source: "Google", replied: true },
  { id: 2, name: "Sarah Johnson", rating: 5, text: "Really professional team. The communication throughout was excellent.", date: "1 week ago", source: "Google", replied: false },
  { id: 3, name: "Marcus Williams", rating: 4, text: "Great work overall. Would have given 5 stars if the wait time was a little shorter.", date: "2 weeks ago", source: "Trustpilot", replied: true },
  { id: 4, name: "Emily Clarke", rating: 5, text: "Best garage I've ever used. Honest pricing and quality workmanship.", date: "3 weeks ago", source: "Google", replied: false },
];

function ReviewsPage() {
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <AppLayout>
      <PageHeader
        title="Reviews"
        description="Monitor and respond to customer reviews across all platforms."
        crumbs={[{ label: "Reviews" }]}
        action={{ label: "Request Reviews", icon: Star }}
        secondaryAction={{ label: "Connect Platform" }}
      />

      {/* Summary bar */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Avg. Rating", value: avg, sub: "out of 5" },
          { label: "Total Reviews", value: reviews.length.toString(), sub: "all time" },
          { label: "This Month", value: "4", sub: "new reviews" },
          { label: "Response Rate", value: "75%", sub: "of reviews replied" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-soft">
            <div className="text-[11.5px] font-medium text-muted-foreground">{s.label}</div>
            <div className="mt-2 text-[22px] font-bold tracking-tight text-foreground">{s.value}</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">{s.sub}</div>
          </div>
        ))}
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews yet"
          description="Connect your Google Business Profile to start collecting and managing reviews."
          action={{ label: "Connect Google Business" }}
        />
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-card p-5 shadow-soft transition-all duration-200 hover:border-foreground/10 hover:shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/10 text-[13px] font-bold text-brand">
                    {r.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13.5px] font-semibold text-foreground">{r.name}</span>
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10.5px] font-medium text-muted-foreground">{r.source}</span>
                    </div>
                    <div className="mt-1 flex gap-0.5 text-brand">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-current" : "text-border"}`} strokeWidth={0} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11.5px] text-muted-foreground">{r.date}</span>
                  <a href="#" className="grid h-7 w-7 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                    <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </a>
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-foreground/80">{r.text}</p>
              <div className="mt-3 flex items-center justify-between">
                {r.replied ? (
                  <span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    Reply sent
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-warning">
                    <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                    Awaiting reply
                  </span>
                )}
                <button className="rounded-lg border border-border bg-card px-3 py-1.5 text-[12px] font-medium text-foreground transition-colors hover:bg-secondary">
                  {r.replied ? "View Reply" : "Reply Now"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
