import { Plus } from "lucide-react";

const items = [
  { name: "GoHighLevel", initials: "GH", color: "#0F4C81" },
  { name: "Google Calendar", initials: "GC", color: "#4285F4" },
  { name: "Google Business", initials: "GB", color: "#34A853" },
  { name: "Xero", initials: "X", color: "#13B5EA" },
  { name: "Stripe", initials: "S", color: "#635BFF" },
  { name: "Slack", initials: "SL", color: "#611F69" },
  { name: "Microsoft 365", initials: "M", color: "#D83B01" },
];

export function Integrations() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="text-[15px] font-semibold tracking-tight text-foreground">
            Connected Integrations
          </div>
          <div className="mt-0.5 text-[12px] text-muted-foreground">
            {items.length} services connected
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.name}
            className="group flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3 transition hover:-translate-y-0.5 hover:bg-card hover:shadow-soft"
          >
            <div
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[11px] font-bold text-white"
              style={{ backgroundColor: it.color }}
            >
              {it.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12.5px] font-semibold text-foreground">
                {it.name}
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-[10.5px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--success)]" />
                Connected
              </div>
            </div>
          </div>
        ))}

        <button className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-transparent p-3 text-[12.5px] font-medium text-muted-foreground transition hover:border-foreground/30 hover:bg-secondary hover:text-foreground">
          <Plus className="h-4 w-4" strokeWidth={1.75} />
          Add Integration
        </button>
      </div>
    </div>
  );
}
