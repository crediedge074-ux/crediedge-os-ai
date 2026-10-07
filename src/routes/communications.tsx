import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { CommunicationIntelligence } from "@/components/communications/CommunicationIntelligence";
import { ComposeModal } from "@/components/communications/ComposeModal";
import { CommunicationsSettingsModal } from "@/components/communications/CommunicationsSettingsModal";
import { MessageSquare } from "lucide-react";

export const Route = createFileRoute("/communications")({
  component: CommunicationsPage,
});

function CommunicationsPage() {
  const [composeOpen, setComposeOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <AppLayout>
      <PageHeader
        title="Communications"
        description="Every conversation. One intelligent workspace."
        crumbs={[{ label: "Communications" }]}
        action={{ label: "Compose", icon: MessageSquare, onClick: () => setComposeOpen(true) }}
        secondaryAction={{ label: "Settings", onClick: () => setSettingsOpen(true) }}
      />
      <CommunicationIntelligence />
      <ComposeModal open={composeOpen} onClose={() => setComposeOpen(false)} />
      <CommunicationsSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </AppLayout>
  );
}
