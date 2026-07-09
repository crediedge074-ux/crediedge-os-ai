import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Plus } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
});

function CalendarPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Calendar"
        description="View and manage bookings, appointments and scheduled jobs."
        crumbs={[{ label: "Calendar" }]}
        action={{ label: "New Booking", icon: Plus }}
      />
      <PlaceholderPage
        icon={Calendar}
        title="Calendar & Bookings"
        description="View all your appointments, jobs and events in one intelligent calendar view."
        status="coming-soon"
        features={[
          "Booking and appointment management",
          "Workshop job scheduling",
          "Google Calendar sync",
          "SMS & email reminders",
          "Resource and staff scheduling",
          "Recurring bookings",
        ]}
      />
    </AppLayout>
  );
}
