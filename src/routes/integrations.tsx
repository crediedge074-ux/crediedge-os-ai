import { createFileRoute } from "@tanstack/react-router";
import { Plug } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { IntegrationsHub } from "@/components/integrations/IntegrationsHub";

export const Route = createFileRoute("/integrations")({
  component: IntegrationsPage,
});

function IntegrationsPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Integrations"
        description="Connect your favourite tools to unlock the full power of CrediEdgeOS."
        crumbs={[{ label: "Integrations" }]}
        badge="No connections"
      />
      <IntegrationsHub />
    </AppLayout>
  );
}
