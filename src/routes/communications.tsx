import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { CommunicationIntelligence } from "@/components/communications/CommunicationIntelligence";
import { CommunicationComposerModal } from "@/components/communications/CommunicationComposerModal";
import { CommunicationSettingsModal } from "@/components/communications/CommunicationSettingsModal";
import { MessageSquare, Settings } from "lucide-react";

export const Route = createFileRoute("/communications")({
  component: CommunicationsPage,
});

function CommunicationsPage() {
  const [composerOpen, setComposerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <AppLayout>
      <PageHeader
        title="Communications"
        description="Every conversation. One intelligent workspace."
        crumbs={[{ label: "Communications" }]}
        action={{
          label: "Compose",
          icon: MessageSquare,
          onClick: () => setComposerOpen(true),
        }}
        secondaryAction={{
          label: "Settings",
          icon: Settings,
          onClick: () => setSettingsOpen(true),
        }}
      />

      <CommunicationIntelligence key={refreshKey} />

      <CommunicationComposerModal
        open={composerOpen}
        onOpenChange={setComposerOpen}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
      />

      <CommunicationSettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
    </AppLayout>
  );
}
