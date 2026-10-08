import { createFileRoute } from "@tanstack/react-router";
import { Globe } from "lucide-react";
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
        badge="No data source"
      />
      <WebsiteDNA />
    </AppLayout>
  );
}
