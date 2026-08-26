import { useState, useEffect } from "react";
import {
  Users,
  Heart,
  Activity,
  CircleDollarSign,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Search,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { useBusiness } from "@/hooks/useBusiness";
import {
  fetchPortfolioRelationshipAnalytics,
  searchPortfolioCustomers,
  type PortfolioRelationshipAnalytics,
  type AttentionItem,
} from "@/services/relationshipAnalytics";
import { appEvents, APP_EVENTS } from "@/lib/events";
import type { Customer } from "@/lib/database.types";
import { AIDisclosure } from "@/components/ui/AIDisclosure";

export function PortfolioRelationshipHeader({
  onSelectCustomer,
  onAddCustomer,
}: {
  onSelectCustomer?: (customer: Customer) => void;
  onAddCustomer?: () => void;
}) {
  const { business } = useBusiness();
  const businessId = business?.id;

  const [analytics, setAnalytics] = useState<PortfolioRelationshipAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Expanded methodology state
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const loadAnalytics = () => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchPortfolioRelationshipAnalytics(businessId)
      .then((res) => setAnalytics(res))
      .catch((err) => console.error("[PortfolioRelationshipHeader] fetch error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAnalytics();
    const unsubscribe = appEvents.on(APP_EVENTS.CUSTOMERS_MUTATED, loadAnalytics);
    return () => unsubscribe();
  }, [businessId]);

  useEffect(() => {
    if (!businessId || !searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      searchPortfolioCustomers(businessId, searchQuery)
        .then((res) => setSearchResults(res))
        .catch((err) => console.error("[searchPortfolioCustomers] error:", err))
        .finally(() => setIsSearching(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, businessId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-44 animate-pulse rounded-2xl bg-secondary" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-secondary" />
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const {
    totalCustomers,
    activeRelationships,
    portfolioHealth,
    verifiedRevenue30d,
    predictedRevenue30d,
    attentionPortfolio,
  } = analytics;

  return (
    <div className="space-y-4 mb-6">
      {/* ─── PORTFOLIO INTELLIGENCE HERO CARD ───────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-foreground p-6 text-background shadow-card">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute -bottom-8 left-1/3 h-40 w-40 rounded-full bg-brand/10 blur-2xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-background/10 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-wider">
              <Sparkles className="h-3 w-3 text-brand" />
              Portfolio Relationship Intelligence
            </div>
            <h1 className="text-[22px] font-bold leading-tight tracking-tight text-background">
              Workspace Customer Portfolio
            </h1>
            <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-background/70">
              Evaluates relationship health, verified 30-day settlement velocity, and active engagement metrics across your entire workspace.
            </p>
          </div>

          {/* Search Input in Header */}
          <div className="relative w-full max-w-sm shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-background/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search portfolio by name, email, phone, company..."
                className="w-full rounded-xl border border-background/20 bg-background/10 pl-9 pr-4 py-2 text-xs text-background placeholder:text-background/50 focus:outline-none focus:ring-1 focus:ring-brand"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-xs text-background/60 hover:text-background"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Search Dropdown Results */}
            {searchQuery.trim() && (
              <div className="absolute left-0 right-0 top-11 z-50 max-h-60 overflow-y-auto rounded-xl border border-border bg-card p-2 text-foreground shadow-2xl divide-y divide-border">
                {isSearching ? (
                  <div className="p-3 text-center text-xs text-muted-foreground italic">Searching portfolio...</div>
                ) : searchResults.length === 0 ? (
                  <div className="p-3 text-center text-xs text-muted-foreground">No matching workspace customers found.</div>
                ) : (
                  searchResults.map((c) => {
                    const name = c.full_name || `${c.first_name || ""} ${c.last_name || ""}`.trim() || "Customer";
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          if (onSelectCustomer) onSelectCustomer(c);
                          setSearchQuery("");
                        }}
                        className="w-full text-left p-2.5 hover:bg-secondary/40 rounded-lg flex items-center justify-between text-xs transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-foreground">{name}</div>
                          <div className="text-[10.5px] text-muted-foreground">
                            {c.email || c.phone || c.company_name || "No contact info"}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-brand uppercase">£{Number(c.lifetime_value || 0).toLocaleString("en-GB")} LTV</span>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Banner Status Line */}
        <div className="relative mt-5 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-background/10 px-3 py-1.5">
            <span className={`h-2 w-2 rounded-full ${attentionPortfolio.attentionCount > 0 ? "bg-brand animate-pulse" : "bg-emerald-400"}`} />
            <span className="text-[11.5px] text-background/80">
              {attentionPortfolio.attentionCount > 0
                ? `${attentionPortfolio.attentionCount} portfolio action(s) requiring operational attention`
                : "All workspace relationships up to date"}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-background/10 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[11.5px] text-background/80">
              {activeRelationships.activePct !== null
                ? `${activeRelationships.activePct}% active relationship ratio (${activeRelationships.count} active / ${totalCustomers.count} total)`
                : "No customer records"}
            </span>
          </div>
        </div>
      </div>

      <AIDisclosure />

      {/* ─── 4 CORE PORTFOLIO METRIC CARDS ───────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Customers & Active Ratio */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Total Portfolio</span>
              <span className="rounded bg-brand/10 px-1.5 py-0.2 text-[8.5px] font-extrabold text-brand uppercase">
                {totalCustomers.provenance}
              </span>
            </div>
            <div className="mt-2 text-[24px] font-bold tracking-tight text-foreground">
              {totalCustomers.count} <span className="text-[12px] font-normal text-muted-foreground">customers</span>
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              {activeRelationships.count} active relationships ({activeRelationships.activePct ?? 0}%)
            </div>
          </div>

          <button
            type="button"
            onClick={() => setExpandedSection(expandedSection === "active" ? null : "active")}
            className="mt-3 flex items-center gap-1 text-[10.5px] font-semibold text-brand hover:underline"
          >
            <span>Active rule breakdown</span>
            {expandedSection === "active" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>

        {/* Card 2: Relationship Health Index */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Portfolio Health Index</span>
              <span className={`rounded px-1.5 py-0.2 text-[8.5px] font-extrabold uppercase ${
                portfolioHealth.provenance === "INSUFFICIENT DATA"
                  ? "bg-secondary text-muted-foreground"
                  : "bg-emerald-500/10 text-emerald-500"
              }`}>
                {portfolioHealth.provenance}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[24px] font-bold tracking-tight text-foreground">
                {portfolioHealth.score !== null ? `${portfolioHealth.score} / 100` : "N/A"}
              </span>
              <span className="text-[11px] font-bold text-brand uppercase">{portfolioHealth.label}</span>
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground truncate">
              {portfolioHealth.reasoning}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setExpandedSection(expandedSection === "health" ? null : "health")}
            className="mt-3 flex items-center gap-1 text-[10.5px] font-semibold text-brand hover:underline"
          >
            <span>Health calculation rule</span>
            {expandedSection === "health" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>

        {/* Card 3: Verified Revenue (30 Days) */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Verified Settlement (30d)</span>
              <span className="rounded bg-emerald-500/10 px-1.5 py-0.2 text-[8.5px] font-extrabold text-emerald-600 uppercase">
                {verifiedRevenue30d.provenance}
              </span>
            </div>
            <div className="mt-2 text-[24px] font-bold tracking-tight text-foreground">
              {verifiedRevenue30d.formatted}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              From {verifiedRevenue30d.invoiceCount} settled payment logs in last 30 days
            </div>
          </div>

          <div className="mt-3 text-[10.5px] text-muted-foreground/80 italic">
            Settled bank records
          </div>
        </div>

        {/* Card 4: Predicted Revenue (30 Days) */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Predicted Collection (30d)</span>
              <span className={`rounded px-1.5 py-0.2 text-[8.5px] font-extrabold uppercase ${
                predictedRevenue30d.hasSufficientData ? "bg-blue-500/10 text-blue-500" : "bg-secondary text-muted-foreground"
              }`}>
                {predictedRevenue30d.provenance}
              </span>
            </div>
            <div className="mt-2 text-[24px] font-bold tracking-tight text-foreground">
              {predictedRevenue30d.formatted}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground truncate">
              {predictedRevenue30d.methodology}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setExpandedSection(expandedSection === "predicted" ? null : "predicted")}
            className="mt-3 flex items-center gap-1 text-[10.5px] font-semibold text-brand hover:underline"
          >
            <span>Prediction requirement</span>
            {expandedSection === "predicted" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {/* ─── METHODOLOGY EXPLANATION PANELS ─────────────────────────────────── */}
      {expandedSection === "active" && (
        <div className="rounded-2xl border border-border bg-card p-4 text-xs space-y-2">
          <div className="font-bold text-foreground">Active Relationship Business Rule Methodology:</div>
          <p className="text-muted-foreground leading-relaxed">
            A customer record is classified as an <strong>Active Relationship</strong> if it meets at least one of the following evidence criteria:
            <br />
            1. Explicit status of <em>active</em> created or updated within the last 90 days.
            <br />
            2. Has a job created or worked in the last 90 days.
            <br />
            3. Has an invoice issued, updated, or settled in the last 90 days.
            <br />
            4. Has a communication record in the last 90 days.
          </p>
        </div>
      )}

      {expandedSection === "health" && (
        <div className="rounded-2xl border border-border bg-card p-4 text-xs space-y-2">
          <div className="font-bold text-foreground">Portfolio Relationship Health Index Methodology:</div>
          <p className="text-muted-foreground leading-relaxed">
            Health scores range from 0 to 100 and evaluate active transactional evidence:
            <br />
            • Baseline score of 60 for customers with activity.
            <br />
            • +10 for active relationship status.
            <br />
            • -20 for active overdue invoices.
            <br />
            • +15 for settled paid invoices.
            <br />
            • +15 for 4★+ review ratings; -25 for 1-2★ ratings.
            <br />
            If no job, invoice, or review activity exists in the workspace, the index defaults to <em>INSUFFICIENT DATA</em> rather than fabricating a score.
          </p>
        </div>
      )}

      {expandedSection === "predicted" && (
        <div className="rounded-2xl border border-border bg-card p-4 text-xs space-y-2">
          <div className="font-bold text-foreground">30-Day Predicted Revenue Methodology & Protection:</div>
          <p className="text-muted-foreground leading-relaxed">
            Predicted revenue computes a trailing monthly payment run rate across active customer records.
            To avoid overclaiming precision or fabricating predictions on sparse datasets, the system enforces a strict minimum threshold:
            <strong> At least 3 settled historical invoices</strong> must be present in the workspace.
            Otherwise, the metric displays <em>INSUFFICIENT DATA</em>. Verified settled payments are strictly separated from forward-looking predictions.
          </p>
        </div>
      )}

      {/* ─── EVIDENCE-BASED ATTENTION / OPPORTUNITY / RISK PORTFOLIO ────────── */}
      {attentionPortfolio.items.length > 0 && (
        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="border-b border-border px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-brand" strokeWidth={1.75} />
              <span className="text-[13.5px] font-semibold tracking-tight text-foreground">
                Actionable Portfolio Intelligence
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-semibold">
              <span className="rounded bg-red-500/10 px-2 py-0.5 text-red-500">
                {attentionPortfolio.attentionCount} Attention
              </span>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-500">
                {attentionPortfolio.opportunityCount} Opportunity
              </span>
              <span className="rounded bg-amber-500/10 px-2 py-0.5 text-amber-500">
                {attentionPortfolio.riskCount} Risk
              </span>
            </div>
          </div>

          <div className="divide-y divide-border">
            {attentionPortfolio.items.map((item, idx) => (
              <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-secondary/20 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[9.5px] font-extrabold uppercase ${
                      item.type === "ATTENTION"
                        ? "bg-red-500/10 text-red-500"
                        : item.type === "OPPORTUNITY"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-amber-500/10 text-amber-500"
                    }`}>
                      {item.type}
                    </span>
                    <span className="text-[12.5px] font-bold text-foreground">{item.headline}</span>
                    <span className="text-[11px] text-muted-foreground">— {item.customerName}</span>
                  </div>
                  <p className="text-[11.5px] text-muted-foreground">{item.detail}</p>
                  <p className="text-[10.5px] text-muted-foreground/70 italic">Evidence: {item.evidence}</p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="rounded bg-secondary px-2 py-0.5 text-[9px] font-extrabold text-muted-foreground uppercase">
                    {item.provenance}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
