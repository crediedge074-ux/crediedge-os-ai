import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { ReputationDNA } from "@/components/reviews/ReputationDNA";
import { RequestReviewsModal } from "@/components/reviews/RequestReviewsModal";
import { PlatformConnectionsModal } from "@/components/reviews/PlatformConnectionsModal";
import { Star } from "lucide-react";

export const Route = createFileRoute("/reviews")({
  component: ReviewsPage,
});

function ReviewsPage() {
  const [requestOpen, setRequestOpen] = useState(false);
  const [connectionsOpen, setConnectionsOpen] = useState(false);

  return (
    <AppLayout>
      <PageHeader
        title="Reviews"
        description="Build a reputation your customers trust with evidence-based review intelligence."
        crumbs={[{ label: "Reviews" }]}
        action={{ label: "Request Reviews", icon: Star, onClick: () => setRequestOpen(true) }}
        secondaryAction={{ label: "Connect Platform", onClick: () => setConnectionsOpen(true) }}
      />
      <ReputationDNA onRequestReviews={() => setRequestOpen(true)} onConnectPlatform={() => setConnectionsOpen(true)} />
      {requestOpen && <RequestReviewsModal onClose={() => setRequestOpen(false)} />}
      {connectionsOpen && <PlatformConnectionsModal onClose={() => setConnectionsOpen(false)} />}
    </AppLayout>
  );
}
