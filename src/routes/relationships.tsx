import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { RelationshipDNA } from "@/components/relationships/RelationshipDNA";
import { Users, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/relationships")({
  component: RelationshipsPage,
});

function RelationshipsPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Relationships"
        description="AI-powered customer intelligence — understand who deserves attention, who's ready to spend, and who's going quiet."
        crumbs={[{ label: "Relationships" }]}
        action={{ label: "Add Customer", icon: Users }}
        secondaryAction={{ label: "Sync Data" }}
      />
      <RelationshipDNA />
    </AppLayout>
  );
}
