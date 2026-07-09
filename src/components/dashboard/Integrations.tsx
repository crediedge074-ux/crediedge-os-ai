import { Plus } from "lucide-react";

const items = [
  { name: "GoHighLevel", initials: "GH", color: "#E31B23" },
  { name: "Google Calendar", initials: "31", color: "#0D0D0D" },
  { name: "Google Business", initials: "GB", color: "#0D0D0D" },
  { name: "Xero", initials: "xero", color: "#13B5EA" },
  { name: "Stripe", initials: "S", color: "#635BFF" },
  { name: "Slack", initials: "#", color: "#E31B23" },
  { name: "Microsoft 365", initials: "M", color: "#D83B01" },
];

export function Integrations() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="mb-5 flex items-center justify-between">
        <div className="text-[15px] font-semibold tracking-tight text-foreground">
          Connected Integrations
        </div>
        <button className="rounded-lg border border-border bg-card px-3 py-1.5 text-[11.5px] font-medium text-foreground transition hover:bg-secondary">
          Manage
        </button>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((it) => (
          <div
            key={it.name}
            className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            <div
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-[12px] font-bold text-white"
              style={{ backgroundColor: it.color }}
            >
              {it.initials}
            </div>
            <div className="text-center">
              <div className="text-[12px] font-semibold text-foreground">{it.name}</div>
              <div className="mt-0.5 flex items-center justify-center gap-1 text-[10.5px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--success)]" />
                Connected
              </div>
            </div>
          </div>
        ))}

        <button className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-4 text-muted-foreground transition hover:border-foreground/30 hover:bg-secondary hover:text-foreground">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary">
            <Plus className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div className="text-[12px] font-semibold">Add Integration</div>
        </button>
      </div>
    </div>
  );
}
