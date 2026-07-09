import { useState } from "react";
import { CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, Clock, Circle as XCircle, RefreshCw, Settings, Plus, Search, ChevronDown, Shield, Zap, Database, Activity, ExternalLink, CircleDollarSign } from "lucide-react";
import { integrations, syncHistory, healthKPIs, INTEGRATION_CATEGORIES } from "./mockData";
import type { Integration, IntegrationStatus } from "./types";

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: IntegrationStatus }) {
  const config = {
    connected: { label: "Connected", color: "text-emerald-700 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
    disconnected: { label: "Not Connected", color: "text-muted-foreground bg-secondary border-border", dot: "bg-muted-foreground/40" },
    warning: { label: "Needs Attention", color: "text-amber-700 bg-amber-50 border-amber-200", dot: "bg-amber-500" },
    pending: { label: "Pending", color: "text-blue-700 bg-blue-50 border-blue-200", dot: "bg-blue-500 animate-pulse" },
    error: { label: "Error", color: "text-red-700 bg-red-50 border-red-200", dot: "bg-red-500" },
  }[status];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold ${config.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

// ─── Integration Card ─────────────────────────────────────────────────────────

function IntegrationCard({ integration: it }: { integration: Integration }) {
  const [expanded, setExpanded] = useState(false);
  const isConnected = it.status === "connected";

  return (
    <div className={`rounded-2xl border bg-card transition-all duration-200 ${isConnected ? "border-border shadow-card" : "border-border/60 shadow-soft"} hover:border-foreground/10`}>
      <div className="p-5">
        <div className="flex items-start gap-3.5">
          <div
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[11px] font-bold text-white"
            style={{ backgroundColor: it.logoColor }}
          >
            {it.logoInitials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-1.5">
              <div>
                <div className="text-[13.5px] font-semibold text-foreground">{it.name}</div>
                {it.connectedAccount && (
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{it.connectedAccount}</div>
                )}
              </div>
              <StatusBadge status={it.status} />
            </div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{it.description}</p>
          </div>
        </div>

        {isConnected && (
          <div className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border">
            <div className="bg-card px-3 py-2.5">
              <div className="text-[10px] font-medium text-muted-foreground">Last Sync</div>
              <div className="mt-0.5 text-[12px] font-semibold text-foreground">{it.lastSync ?? "—"}</div>
            </div>
            <div className="bg-card px-3 py-2.5">
              <div className="text-[10px] font-medium text-muted-foreground">Frequency</div>
              <div className="mt-0.5 text-[12px] font-semibold text-foreground">{it.syncFrequency ?? "—"}</div>
            </div>
            <div className="bg-card px-3 py-2.5">
              <div className="text-[10px] font-medium text-muted-foreground">Version</div>
              <div className="mt-0.5 text-[12px] font-semibold text-foreground">{it.version ?? "—"}</div>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
          {isConnected ? (
            <>
              <button className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-[12px] font-medium text-foreground transition-colors hover:bg-secondary/70">
                <Settings className="h-3.5 w-3.5" strokeWidth={1.75} />
                Configure
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-[12px] font-medium text-foreground transition-colors hover:bg-secondary/70">
                <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.75} />
                Sync
              </button>
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 rounded-lg border border-border bg-secondary px-3 py-1.5 text-[12px] font-medium text-foreground transition-colors hover:bg-secondary/70"
              >
                Permissions
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
              </button>
              <button className="ml-auto text-[12px] text-muted-foreground transition-colors hover:text-red-600">
                Disconnect
              </button>
            </>
          ) : (
            <button className="rounded-lg bg-brand px-4 py-1.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-80">
              Connect
            </button>
          )}
        </div>

        {expanded && isConnected && (
          <div className="mt-3 rounded-xl border border-border bg-secondary/30 p-3">
            <div className="mb-2 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.75} />
              <span className="text-[11.5px] font-semibold text-foreground">Permissions Granted</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {it.permissions.map((p) => (
                <span key={p} className="rounded-full border border-border bg-card px-2 py-0.5 text-[10.5px] text-muted-foreground">{p}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Health KPI Cards ─────────────────────────────────────────────────────────

function HealthKPIs() {
  const statusIcon = (s: string) => {
    if (s === "ok") return <CheckCircle2 className="h-4 w-4 text-emerald-500" strokeWidth={1.75} />;
    if (s === "warning") return <AlertTriangle className="h-4 w-4 text-amber-500" strokeWidth={1.75} />;
    return <XCircle className="h-4 w-4 text-red-500" strokeWidth={1.75} />;
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      {healthKPIs.map((kpi) => (
        <div key={kpi.label} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[11px] font-medium text-muted-foreground">{kpi.label}</span>
            {statusIcon(kpi.status)}
          </div>
          <div className="mt-2 text-[22px] font-bold tracking-tight text-foreground">{kpi.value}</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">{kpi.sublabel}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Sync History Table ───────────────────────────────────────────────────────

function SyncHistoryTable() {
  const statusConfig = {
    success: { label: "Success", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    warning: { label: "Warning", color: "text-amber-700 bg-amber-50 border-amber-200" },
    error: { label: "Error", color: "text-red-700 bg-red-50 border-red-200" },
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <Activity className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.75} />
          <span className="text-[14px] font-semibold text-foreground">Sync History</span>
        </div>
        <button className="text-[12px] text-muted-foreground transition-colors hover:text-foreground">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Platform</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Time</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Duration</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Records</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Issues</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {syncHistory.map((entry) => {
              const cfg = statusConfig[entry.status];
              return (
                <tr key={entry.id} className="transition-colors hover:bg-secondary/20">
                  <td className="px-5 py-3 text-[13px] font-medium text-foreground">{entry.platform}</td>
                  <td className="px-4 py-3 text-[12.5px] text-muted-foreground">{entry.time}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2 py-0.5 text-[10.5px] font-semibold ${cfg.color}`}>{cfg.label}</span>
                  </td>
                  <td className="px-4 py-3 text-[12.5px] text-muted-foreground">{entry.duration}</td>
                  <td className="px-4 py-3 text-[12.5px] font-medium text-foreground">{entry.recordsUpdated}</td>
                  <td className="px-4 py-3">
                    {entry.errors + entry.warnings === 0 ? (
                      <span className="text-[11.5px] text-emerald-600">None</span>
                    ) : (
                      <span className="text-[11.5px] text-amber-600">{entry.warnings}w {entry.errors}e</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Root Export ──────────────────────────────────────────────────────────────

export function IntegrationsHub() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [showConnectedOnly, setShowConnectedOnly] = useState(false);

  const filtered = integrations.filter((it) => {
    const matchCat = activeCategory === "All" || it.category === activeCategory;
    const matchSearch = it.name.toLowerCase().includes(search.toLowerCase()) ||
      it.description.toLowerCase().includes(search.toLowerCase());
    const matchConnected = !showConnectedOnly || it.status === "connected";
    return matchCat && matchSearch && matchConnected;
  });

  const connectedCount = integrations.filter((i) => i.status === "connected").length;

  return (
    <div className="space-y-6">
      {/* Health KPIs */}
      <HealthKPIs />

      {/* Filter + Search bar */}
      <div className="rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search integrations…"
              className="w-full rounded-xl border border-border bg-secondary/30 py-2 pl-9 pr-3.5 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/20 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowConnectedOnly(!showConnectedOnly)}
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-[12.5px] font-medium transition-colors ${showConnectedOnly ? "border-brand bg-brand/10 text-brand" : "border-border bg-secondary text-muted-foreground hover:text-foreground"}`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            Connected ({connectedCount})
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-3.5 py-2 text-[12.5px] font-medium text-muted-foreground transition-colors hover:text-foreground">
            <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.75} />
            Sync All
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 overflow-x-auto px-4 py-3 scrollbar-hide">
          {INTEGRATION_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${activeCategory === cat ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Integration grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((it) => (
            <IntegrationCard key={it.id} integration={it} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-16 text-center">
          <Database className="h-8 w-8 text-muted-foreground/30" strokeWidth={1.25} />
          <div className="text-[14px] font-semibold text-foreground">No integrations found</div>
          <p className="text-[13px] text-muted-foreground">Try adjusting your search or category filter.</p>
        </div>
      )}

      {/* Sync history */}
      <SyncHistoryTable />

      {/* Future API notice */}
      <div className="rounded-2xl border border-dashed border-border bg-secondary/20 px-6 py-6">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card">
            <Zap className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-semibold text-foreground">Custom Integration</div>
            <p className="mt-1 max-w-lg text-[13px] text-muted-foreground">
              Don't see your platform? Build a custom integration using the CrediEdgeOS REST API, webhooks, or OAuth 2.0 connection. Full developer documentation available.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-secondary">
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
            View API Docs
          </button>
        </div>
      </div>
    </div>
  );
}
