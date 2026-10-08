import { createFileRoute } from "@tanstack/react-router";
import { EnterprisePreview } from "@/components/admin/EnterprisePreview";

export const Route = createFileRoute("/admin/enterprise-preview")({
  component: EnterprisePreviewRoute,
});

function EnterprisePreviewRoute() {
  return <EnterprisePreview />;
}
