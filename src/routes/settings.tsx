import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { SettingsHub } from "@/components/settings/SettingsHub";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Settings"
        description="Configure your business, preferences and account."
        crumbs={[{ label: "Settings" }]}
      />
      <SettingsHub />
    </AppLayout>
  );
}
