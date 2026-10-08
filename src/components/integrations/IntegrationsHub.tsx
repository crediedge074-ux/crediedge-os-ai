import { useState, useEffect, useCallback } from "react";
import {
  CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle,
  RefreshCw, Settings, Search, ChevronDown, Shield, Zap, Database,
  Activity, ExternalLink, Plus, Clock, Plug,
} from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  fetchIntegrations, fetchSyncLogs, mergeIntegrations,
  disconnectIntegration, computeHealthKPIs,
  type MergedIntegration, type SyncLogRow, type IntegrationStatus,
} from "@/services/integrations";
import { INTEGRATION_CATALOGUE, INTEGRATION_CATEGORIES, type IntegrationCategory } from "./catalogue";
import { EmptyState } from "@/components/ui/EmptyState";
import { InsufficientData } from "@/components/ui/InsufficientData";

// ─── Status Badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: IntegrationStatus }) {
  const config: Record<IntegrationStatus, { label: string; color: string; dot: string }> = {
    connected: { label: "Connected", color: "text-emerald-700 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
    disconnected: { label: "Not Connected", color: "text-muted-foreground bg-secondary border-border", dot: "bg-muted-foreground/40" },
    needs_attention: { label: "Needs Attention", color: "text-amber-700 bg-amber-50 border-amber-200", dot: "bg-amber-500" },
    syncing: { label: "Syncing", color: "text-blue-700 bg-blue-50 border-blue-200", dot: "bg-blue-500 animate-pulse" },
    sync_failed: { label: "Sync Failed", color: "text-red-700 bg-red-50 border-red-200", dot: "bg-red-500" },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold ${c.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

// ─── Coming Soon Badge ───────────────────────────────────────────────────────

function ComingSoonBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2 py-0.5 text-[10.5px] font-semibold text-muted-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
      Coming Soon
    </span>
  );
}

// ─── Time formatting ─────────────────────────────────────────────────────────

function formatTimeAgo(iso: string | null): string {
  if (!iso) return "Never";
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hr ago`;
  return `${Math.floor(diff / 86400000)} day${Math.floor(diff / 86400000) === 1 ? "" : "s"} ago`;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function formatDuration(ms: number | null): string {
  if (ms === null) return "—";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

// ─── Integration Card ────────────────────────────────────────────────────────

function IntegrationCard({ integration: it, onDisconnect }: {
  integration: MergedIntegration;
  onDisconnect: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const isConnected = it.liveStatus === "connected";
  const isAvailable = it.available;

  return (
    <div className={`rounded-2xl border bg-card transition-all duration-200 ${isConnected ? "border-border shadow-card" : "border-border/60 shadow-soft"} hover:border-foreground/10`}>
      <div className="p-5">
        <div className="flex items-start gap-3.5">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[11px] font-bold text-white" style={{ backgroundColor: it.logoColor }}>
            {it.logoInitials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-1.5">
              <div>
                <div className="text-[13.5px] font-semibold text-foreground">{it.name}</div>
                {it.dbRow?.settings && typeof it.dbRow.settings === "object" && "account" in it.dbRow.settings && (
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{String((it.dbRow.settings as Record<string, unknown>).account)}</div>
                )}
              </div>
              {isAvailable ? <StatusBadge status={it.liveStatus} /> : <ComingSoonBadge />}
            </div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{it.description}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {it.modules.map((m) => (
                <span key={m} className="rounded-full border border-border bg-secondary/50 px-2 py-0.5 text-[10px] text-muted-foreground">{m}</span>
              ))}
            </div>
          </div>
        </div>

        {isConnected && (
          <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
            <div className="bg-card px-3 py-2.5">
              <div className="text-[10px] font-medium text-muted-foreground">Last Sync</div>
              <div className="mt-0.5 text-[12px] font-semibold text-foreground">{formatTimeAgo(it.lastSyncedAt)}</div>
            </div>
            <div className="bg-card px-3 py-2.5">
              <div className="text-[10px] font-medium text-muted-foreground">Data Provided</div>
              <div className="mt-0.5 text-[12px] font-semibold text-foreground truncate" title={it.dataProvided}>{it.dataProvided}</div>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
          {isConnected ? (
            <>
              <button
                onClick={() => setShowConfig(!showConfig)}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-[12px] font-medium text-foreground transition-colors hover:bg-secondary/70"
              >
                <Settings className="h-3.5 w-3.5" strokeWidth={1.75} />
                Configure
              </button>
              <button
                className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-secondary/70"
                title="Sync — Coming Soon"
              >
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
              <button
                onClick={() => onDisconnect(it.dbRow!.id)}
                className="ml-auto text-[12px] text-muted-foreground transition-colors hover:text-red-600"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              className="rounded-lg bg-brand px-4 py-1.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-80"
              title={isAvailable ? "Connect" : "Coming Soon"}
            >
              {isAvailable ? "Connect" : "Connect"}
            </button>
          )}
        </div>

        {expanded && isConnected && (
          <div className="mt-3 rounded-xl border border-border bg-secondary/30 p-3">
            <div className="mb-2 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.75} />
              <span className="text-[11.5px] font-semibold text-foreground">Permissions Required</span>
            </div>
            <p className="mb-2 text-[11px] text-muted-foreground">This integration will request the following permissions upon connection:</p>
            <div className="flex flex-wrap gap-1.5">
              {it.permissions.map((p) => (
                <span key={p} className="rounded-full border border-border bg-card px-2 py-0.5 text-[10.5px] text-muted-foreground">{p}</span>
              ))}
            </div>
          </div>
        )}

        {showConfig && isConnected && (
          <div className="mt-3 rounded-xl border border-border bg-secondary/30 p-3">
            <div className="mb-2 flex items-center gap-1.5">
              <Settings className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.75} />
              <span className="text-[11.5px] font-semibold text-foreground">Configuration</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Configuration options for {it.name} will be available once the integration connection workflow is implemented.
              Currently, you can disconnect the integration.
            </p>
          </div>
        )}

        {!isAvailable && !isConnected && (
          <div className="mt-3 rounded-xl border border-dashed border-border bg-secondary/20 px-3 py-2.5">
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              This integration is in the catalogue but not yet available for connection. The connection workflow is Coming Soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Health KPI Cards ────────────────────────────────────────────────────────

function HealthKPIs({ kpis }: { kpis: ReturnType<typeof computeHealthKPIs> }) {
  const items = [
    { label: "Connected Services", value: String(kpis.connected), sublabel: kpis.connected === 0 ? "No active connections" : "Active integrations", status: kpis.connected > 0 ? "ok" : "neutral" },
    { label: "Needs Attention", value: String(kpis.needsAttention), sublabel: kpis.needsAttention === 0 ? "No issues detected" : "Requires attention", status: kpis.needsAttention === 0 ? "ok" : "warning" },
    { label: "Syncing Now", value: String(kpis.syncing), sublabel: kpis.syncing === 0 ? "None in progress" : "In progress", status: "neutral" },
    { label: "Last Sync", value: kpis.lastSync ? formatTimeAgo(kpis.lastSync) : "Never", sublabel: kpis.totalLogs === 0 ? "No syncs recorded" : `${kpis.totalLogs} sync log${kpis.totalLogs === 1 ? "" : "s"}`, status: kpis.lastSync ? "ok" : "neutral" },
    { label: "Failed Syncs", value: String(kpis.failedSyncs), sublabel: kpis.failedSyncs === 0 ? "No failures recorded" : "Failures in history", status: kpis.failedSyncs === 0 ? "ok" : "warning" },
    { label: "API Calls Today", value: "Not available", sublabel: "Usage tracking Coming Soon", status: "neutral" },
  ];

  const statusIcon = (s: string) => {
    if (s === "ok") return <CheckCircle2 className="h-4 w-4 text-emerald-500" strokeWidth={1.75} />;
    if (s === "warning") return <AlertTriangle className="h-4 w-4 text-amber-500" strokeWidth={1.75} />;
    return <Clock className="h-4 w-4 text-muted-foreground/50" strokeWidth={1.75} />;
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      {items.map((kpi) => (
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

// ─── Sync History Table ──────────────────────────────────────────────────────

function SyncHistoryTable({ logs }: { logs: SyncLogRow[] }) {
  const statusConfig: Record<string, { label: string; color: string }> = {
    success: { label: "Success", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    failed: { label: "Failed", color: "text-red-700 bg-red-50 border-red-200" },
    partial: { label: "Partial", color: "text-amber-700 bg-amber-50 border-amber-200" },
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <Activity className="h-4.5 w-4.5 text-muted-foreground" strokeWidth={1.75} />
          <span className="text-[14px] font-semibold text-foreground">Sync History</span>
          {logs.length > 0 && (
            <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[10.5px] font-medium text-muted-foreground">{logs.length}</span>
          )}
        </div>
      </div>
      {logs.length === 0 ? (
        <div className="px-6 py-12">
          <EmptyState
            icon={Activity}
            title="No sync history yet"
            description="Sync history will appear here once integrations are connected and synced. No syncs have been recorded."
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Provider</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Time</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Duration</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Records</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Issues</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((entry) => {
                const cfg = statusConfig[entry.status] ?? statusConfig.failed;
                const issues = entry.records_failed + (entry.error_message ? 1 : 0);
                return (
                  <tr key={entry.id} className="transition-colors hover:bg-secondary/20">
                    <td className="px-5 py-3 text-[13px] font-medium text-foreground">{entry.provider}</td>
                    <td className="px-4 py-3 text-[12.5px] text-muted-foreground">{formatDateTime(entry.started_at)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2 py-0.5 text-[10.5px] font-semibold ${cfg.color}`}>{cfg.label}</span>
                    </td>
                    <td className="px-4 py-3 text-[12.5px] text-muted-foreground">{formatDuration(entry.duration_ms)}</td>
                    <td className="px-4 py-3 text-[12.5px] font-medium text-foreground">
                      {entry.records_processed > 0 ? `${entry.records_processed} processed` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {issues === 0 ? (
                        <span className="text-[11.5px] text-emerald-600">None</span>
                      ) : (
                        <span className="text-[11.5px] text-amber-600">{issues} issue{issues === 1 ? "" : "s"}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Root Export ──────────────────────────────────────────────────────────────

export function IntegrationsHub() {
  const { business } = useAuthContext();
  const businessId = business?.id ?? null;

  const [merged, setMerged] = useState<MergedIntegration[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [showConnectedOnly, setShowConnectedOnly] = useState(false);
  const [showCatalogue, setShowCatalogue] = useState(false);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const [rows, logs] = await Promise.all([
        fetchIntegrations(businessId),
        fetchSyncLogs(businessId),
      ]);
      setMerged(mergeIntegrations(rows));
      setSyncLogs(logs);
    } catch (err) {
      console.error("[IntegrationsHub] load error:", err);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDisconnect = async (integrationId: string) => {
    if (!businessId || disconnecting) return;
    setDisconnecting(integrationId);
    try {
      await disconnectIntegration(businessId, integrationId);
      await loadData();
    } catch (err) {
      console.error("[IntegrationsHub] disconnect error:", err);
    } finally {
      setDisconnecting(null);
    }
  };

  const kpis = computeHealthKPIs(merged, syncLogs);

  const filtered = merged.filter((it) => {
    const matchCat = activeCategory === "All" || it.category === activeCategory;
    const matchSearch = it.name.toLowerCase().includes(search.toLowerCase()) ||
      it.description.toLowerCase().includes(search.toLowerCase()) ||
      it.category.toLowerCase().includes(search.toLowerCase());
    const matchConnected = !showConnectedOnly || it.liveStatus === "connected";
    return matchCat && matchSearch && matchConnected;
  });

  const connectedCount = merged.filter((m) => m.liveStatus === "connected").length;

  if (!businessId) {
    return (
      <div className="space-y-6">
        <InsufficientData description="No active business workspace found. Sign in to manage integrations." icon={Plug} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" strokeWidth={1.75} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Health KPIs */}
      <HealthKPIs kpis={kpis} />

      {/* Connection notice */}
      {connectedCount === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-secondary/20 px-6 py-5">
          <div className="flex items-start gap-3">
            <Plug className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
            <div>
              <div className="text-[14px] font-semibold text-foreground">No integrations connected yet</div>
              <p className="mt-1 max-w-lg text-[13px] text-muted-foreground">
                Browse the catalogue below to discover integrations. Connection workflows for each provider are Coming Soon — the catalogue shows what will be available and what data each integration provides to CrediEdgeOS.
              </p>
            </div>
          </div>
        </div>
      )}

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
          <button
            onClick={() => setShowCatalogue(!showCatalogue)}
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-[12.5px] font-medium transition-colors ${showCatalogue ? "border-brand bg-brand/10 text-brand" : "border-border bg-secondary text-muted-foreground hover:text-foreground"}`}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
            Add Integration
          </button>
          <button
            className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-3.5 py-2 text-[12.5px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            title="Sync All — Coming Soon"
          >
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
            <IntegrationCard key={it.id} integration={it} onDisconnect={handleDisconnect} />
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
      <SyncHistoryTable logs={syncLogs} />

      {/* Developer / API notice */}
      <div className="rounded-2xl border border-dashed border-border bg-secondary/20 px-6 py-6">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card">
            <Zap className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-semibold text-foreground">Custom Integration</div>
            <p className="mt-1 max-w-lg text-[13px] text-muted-foreground">
              Build a custom integration using the CrediEdgeOS REST API, webhooks, or OAuth 2.0 connection. Developer documentation is Coming Soon.
            </p>
          </div>
          <button
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-secondary"
            title="API Docs — Coming Soon"
          >
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
            API Docs — Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
}
