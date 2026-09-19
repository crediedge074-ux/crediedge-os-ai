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

  return (
    <AppLayout>
      <PageHeader
        title="Reviews"
        description="Build a reputation your customers trust."
        crumbs={[{ label: "Reviews" }]}
        action={{
          label: "Request Reviews",
          icon: Star,
          onClick: () => {
            const btns = Array.from(document.querySelectorAll<HTMLButtonElement>("button"));
            const target = btns.find((b) => b.textContent?.includes("Request Reviews") && b.closest("main"));
            if (target) target.click();
          },
        }}
        secondaryAction={{
          label: "Connect Platform",
          onClick: () => navigate({ to: "/integrations" }),
        }}
      />
      <ReputationDNA />
    </AppLayout>
  );
}
