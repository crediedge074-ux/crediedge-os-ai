import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { ReputationDNA } from "@/components/reviews/ReputationDNA";
import { Star } from "lucide-react";

export const Route = createFileRoute("/reviews")({
  component: ReviewsPage,
});

function ReviewsPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Reviews"
        description="Build a reputation your customers trust."
        crumbs={[{ label: "Reviews" }]}
        action={{ label: "Request Reviews", icon: Star }}
        secondaryAction={{ label: "Connect Platform" }}
      />
      <ReputationDNA />
    </AppLayout>
  );
}
