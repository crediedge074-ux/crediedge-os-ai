import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { InsightEngine } from "@/components/insights/InsightEngine";

export const Route = createFileRoute("/insights")({
  component: InsightsPage,
});

function InsightsPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Insights"
        description="Discover opportunities your business didn't know existed."
        crumbs={[{ label: "Insights" }]}
        action={{ label: "Refresh Insights", icon: RefreshCw, onClick: () => window.dispatchEvent(new Event("intelligence:refresh")) }}
        secondaryAction={{ label: "View Intelligence", to: "/intelligence" }}
      />
      <InsightEngine />
    </AppLayout>
  );
}
