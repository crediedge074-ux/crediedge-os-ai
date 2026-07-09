import { createFileRoute } from "@tanstack/react-router";
import { Brain } from "lucide-react";
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
        action={{ label: "Generate Discoveries", icon: Brain }}
        secondaryAction={{ label: "View History" }}
      />
      <InsightEngine />
    </AppLayout>
  );
}
