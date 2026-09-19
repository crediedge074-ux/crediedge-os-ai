import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { ReputationDNA } from "@/components/reviews/ReputationDNA";
import { Star } from "lucide-react";

export const Route = createFileRoute("/reviews")({
  component: ReviewsPage,
});

function ReviewsPage() {
  const navigate = useNavigate();
  const [showRequestModal, setShowRequestModal] = useState(false);

  return (
    <AppLayout>
      <PageHeader
        title="Reviews"
        description="Build a reputation your customers trust."
        crumbs={[{ label: "Reviews" }]}
        action={{
          label: "Request Reviews",
          icon: Star,
          onClick: () => setShowRequestModal(true),
        }}
        secondaryAction={{
          label: "Connect Platform",
          onClick: () => navigate({ to: "/integrations" }),
        }}
      />
      <ReputationDNA
        showRequestModalExternal={showRequestModal}
        setShowRequestModalExternal={setShowRequestModal}
      />
    </AppLayout>
  );
}
