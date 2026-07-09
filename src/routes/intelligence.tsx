import { createFileRoute } from "@tanstack/react-router";
import { Brain } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { BusinessIntelligence } from "@/components/intelligence/BusinessIntelligence";

export const Route = createFileRoute("/intelligence")({
  component: IntelligencePage,
});

function IntelligencePage() {
  return (
    <AppLayout>
      <PageHeader
        title="Intelligence"
        description="Understand what is happening inside your business."
        crumbs={[{ label: "Intelligence" }]}
        action={{ label: "Export Report", icon: Brain }}
        secondaryAction={{ label: "Refresh Analysis" }}
      />
      <BusinessIntelligence />
    </AppLayout>
  );
}
