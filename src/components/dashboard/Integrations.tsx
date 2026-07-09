import { Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface Integration {
  name: string;
  initials: string;
  color: string;
  lastSync: string;
  health: "healthy" | "warning";
}

const items: Integration[] = [
  { name: "GoHighLevel", initials: "GH", color: "#E31B23", lastSync: "2m ago", health: "healthy" },
  { name: "Google Calendar", initials: "31", color: "#1A1A1A", lastSync: "5m ago", health: "healthy" },
  { name: "Google Business", initials: "GB", color: "#1A1A1A", lastSync: "12m ago", health: "healthy" },
  { name: "Xero", initials: "X", color: "#13B5EA", lastSync: "1h ago", health: "healthy" },
  { name: "Stripe", initials: "S", color: "#635BFF", lastSync: "3m ago", health: "healthy" },
  { name: "Slack", initials: "#", color: "#E31B23", lastSync: "8m ago", health: "healthy" },
  { name: "Microsoft 365", initials: "M", color: "#D83B01", lastSync: "30m ago", health: "warning" },
];

export function Integrations() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[13.5px] font-semibold tracking-tight text-foreground">
          Connected Integrations
        </div>
        <Link
          to="/integrations"
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-[11px] font-medium text-foreground transition-colors duration-150 hover:bg-secondary"
        >
          Manage
        </Link>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {items.map((it) => (
          <Link
            key={it.name}
            to="/integrations"
            className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/10 hover:shadow-soft"
          >
            <div
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[11px] font-bold text-white"
              style={{ backgroundColor: it.color }}
            >
              {it.initials}
            </div>
            <div className="w-full text-center">
              <div className="truncate text-[11.5px] font-semibold text-foreground">{it.name}</div>
              <div className="mt-0.5 flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
                <span className={`h-1.5 w-1.5 rounded-full ${it.health === "healthy" ? "bg-success" : "bg-warning"}`} />
                {it.lastSync}
              </div>
            </div>
          </Link>
        ))}

        <Link
          to="/integrations"
          className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-3.5 text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-secondary hover:text-foreground"
        >
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-secondary">
            <Plus className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <div className="text-[11.5px] font-semibold">Add New</div>
        </Link>
      </div>
    </div>
  );
}
