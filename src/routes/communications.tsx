import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { CommunicationIntelligence } from "@/components/communications/CommunicationIntelligence";
import { MessageSquare, Send, AlertCircle, X } from "lucide-react";

export const Route = createFileRoute("/communications")({
  component: CommunicationsPage,
});

function CommunicationsPage() {
  const navigate = useNavigate();
  const [showComposeModal, setShowComposeModal] = useState(false);

  return (
    <AppLayout>
      <PageHeader
        title="Communications"
        description="Every conversation. One intelligent workspace."
        crumbs={[{ label: "Communications" }]}
        action={{
          label: "Compose",
          icon: MessageSquare,
          onClick: () => setShowComposeModal(true),
        }}
        secondaryAction={{
          label: "Settings",
          onClick: () => navigate({ to: "/settings" }),
        }}
      />

      <CommunicationIntelligence />

      {/* Compose Action Dialog */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Send className="h-4 w-4 text-brand" />
                Compose Outbound Communication
              </div>
              <button
                onClick={() => setShowComposeModal(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-amber-800 dark:text-amber-300 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                No Verified Email or SMS Provider Integration Connected
              </div>
              <p className="text-[11px] leading-relaxed">
                Direct external sending requires a verified channel integration (e.g., Twilio or SendGrid).
                You can record and log customer conversations directly inside the workspace communication stream.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => navigate({ to: "/integrations" })}
                className="rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand/90"
              >
                Connect Integration
              </button>
              <button
                onClick={() => setShowComposeModal(false)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
