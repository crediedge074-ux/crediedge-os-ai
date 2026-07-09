import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Lightbulb, TrendingUp, MessageSquare, Shield } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const Route = createFileRoute("/advisor")({
  component: AdvisorPage,
});

function AdvisorPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Business Advisor"
        description="Your AI-powered executive assistant — personalised recommendations, growth insights, and strategic guidance."
        crumbs={[{ label: "Business Advisor" }]}
        badge="AI"
        action={{ label: "Generate Briefing", icon: Sparkles }}
      />
      <PlaceholderPage
        icon={Sparkles}
        title="AI Business Advisor"
        description="Get personalised daily briefings, strategic recommendations and real-time business guidance powered by AI."
        status="in-development"
        features={[
          "Daily executive briefing",
          "Revenue growth recommendations",
          "Risk identification and alerts",
          "Competitor benchmarking",
          "Personalised action plans",
          "Business health predictions",
        ]}
      />
    </AppLayout>
  );
}
