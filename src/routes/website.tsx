import { createFileRoute } from "@tanstack/react-router";
import { Globe, RefreshCw, ExternalLink } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { WebsiteDNA } from "@/components/website/WebsiteDNA";

export const Route = createFileRoute("/website")({
  component: WebsitePage,
});

function WebsitePage() {
  return (
    <AppLayout>
      <PageHeader
        title="Website"
        description="Understand how your website performs, converts and grows your business."
        crumbs={[{ label: "Website" }]}
        action={{ label: "Run Audit", icon: RefreshCw }}
        secondaryAction={{ label: "View Site" }}
      />
      <WebsiteDNA />
    </AppLayout>
  );
}
