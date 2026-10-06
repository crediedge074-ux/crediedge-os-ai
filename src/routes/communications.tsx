import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { CommunicationIntelligence } from "@/components/communications/CommunicationIntelligence";
import { CommunicationComposerModal } from "@/components/communications/CommunicationComposerModal";
import { CommunicationSettingsModal } from "@/components/communications/CommunicationSettingsModal";
import { Send } from "lucide-react";

export const Route = createFileRoute("/communications")({
  component: CommunicationsPage,
});

function CommunicationsPage() {
  const [composerOpen, setComposerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Communications"
          description="Every conversation. One intelligent workspace."
          crumbs={[{ label: "Communications" }]}
          action={{
            label: "Compose",
            icon: Send,
            onClick: () => setComposerOpen(true),
          }}
          secondaryAction={{
            label: "Settings",
            onClick: () => setSettingsOpen(true),
          }}
        />

        <CommunicationIntelligence onOpenCompose={() => setComposerOpen(true)} />

        {/* Modals */}
        <CommunicationComposerModal
          isOpen={composerOpen}
          onClose={() => setComposerOpen(false)}
        />

        <CommunicationSettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
      </div>
    </AppLayout>
  );
}
