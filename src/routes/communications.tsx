import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { CommunicationIntelligence } from "@/components/communications/CommunicationIntelligence";
import { MessageSquare } from "lucide-react";

export const Route = createFileRoute("/communications")({
  component: CommunicationsPage,
});

function CommunicationsPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Communications"
        description="Every conversation. One intelligent workspace."
        crumbs={[{ label: "Communications" }]}
        action={{ label: "Compose", icon: MessageSquare }}
        secondaryAction={{ label: "Settings" }}
      />
      <CommunicationIntelligence />
    </AppLayout>
  );
}
