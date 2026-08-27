import { useState, useEffect } from "react";
import {
  Users,
  Activity,
  Sparkles,
  Search,
  ChevronDown,
  ChevronUp,
  Eye,
  Brain,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  Target,
  ArrowRight,
  Plus,
  Zap,
} from "lucide-react";
import { useBusiness } from "@/hooks/useBusiness";
import {
  fetchPortfolioRelationshipAnalytics,
  fetchPortfolioActivityFeed,
  searchPortfolioCustomers,
  type PortfolioRelationshipAnalytics,
  type PortfolioRelationshipPriority,
  type RevenueOpportunity,
  type CustomerSegment,
  type CustomerPrediction,
} from "@/services/relationshipAnalytics";
import type { Customer, ActivityLog } from "@/lib/database.types";
import { appEvents, APP_EVENTS } from "@/lib/events";
import { AIDisclosure } from "@/components/ui/AIDisclosure";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export function PortfolioRelationshipHeader({
  onSelectCustomer,
  onAddCustomer,
  onOpenSegment,
}: {
  onSelectCustomer?: (customer: Customer) => void;
  onAddCustomer?: () => void;
  onOpenSegment?: (segment: CustomerSegment) => void;
}) {
  const { business } = useBusiness();
  const businessId = business?.id;
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState<PortfolioRelationshipAnalytics | null>(null);
  const [activityFeed, setActivityFeed] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Expanded methodology state
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedPriorityId, setExpandedPriorityId] = useState<string | null>(null);
  const [expandedOpportunityId, setExpandedOpportunityId] = useState<string | null>(null);
  const [expandedPredictionId, setExpandedPredictionId] = useState<string | null>(null);

  const loadData = () => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      fetchPortfolioRelationshipAnalytics(businessId),
      fetchPortfolioActivityFeed(businessId),
    ])
      .then(([analyticsRes, activityRes]) => {
        setAnalytics(analyticsRes);
        setActivityFeed(activityRes);
      })
      .catch((err) => console.error("[PortfolioRelationshipHeader] fetch error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    const unsubscribe = appEvents.on(APP_EVENTS.CUSTOMERS_MUTATED, loadData);
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
    portfolioPriorities,
    revenueOpportunities,
    connectedCampaigns,
    customerSegments,
    portfolioPredictions,
  } = analytics;

  const handleActNow = (opp: RevenueOpportunity) => {
    if (opp.actionableWorkflowTarget === "invoice_workflow") {
      navigate({ to: "/finance" });
    } else if (opp.actionableWorkflowTarget === "task_creation") {
      navigate({ to: "/tasks" });
    } else if (opp.actionableWorkflowTarget === "campaign_workspace") {
      navigate({ to: "/tasks" });
    } else {
      toast.info(`Opening profile for ${opp.customerName}`);
    }
  };

  return (
    <div className="space-y-6 mb-6">
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
            <span className={`h-2 w-2 rounded-full ${portfolioPriorities.length > 0 ? "bg-brand animate-pulse" : "bg-emerald-400"}`} />
            <span className="text-[11.5px] text-background/80">
              {portfolioPriorities.length > 0
                ? `${portfolioPriorities.length} portfolio priority action(s) requiring operational attention`
                : "No priority actions identified"}
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

      {/* ─── SECTION 9: AUTHORITATIVE CUSTOMER SEGMENTS ──────────────────────── */}
      <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        <div className="border-b border-border px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-brand" strokeWidth={1.75} />
            <span className="text-[13.5px] font-semibold tracking-tight text-foreground">
              Customer Segmentation Engine
            </span>
          </div>
          <span className="rounded bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand uppercase">
            {customerSegments.length} Segments
          </span>
        </div>

        {customerSegments.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground italic">
            No customer profiles available to evaluate workspace segment classifications.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4">
            {customerSegments.map((seg) => (
              <div
                key={seg.id}
                onClick={() => onOpenSegment && onOpenSegment(seg)}
                className="group cursor-pointer rounded-xl border border-border bg-secondary/20 p-3.5 space-y-2 hover:border-brand hover:bg-card transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[12.5px] text-foreground group-hover:text-brand transition-colors">{seg.name}</span>
                  <span className="rounded bg-secondary px-1.5 py-0.2 text-[8.5px] font-extrabold text-muted-foreground uppercase">{seg.provenance}</span>
                </div>
                <div className="text-[18px] font-extrabold text-foreground">{seg.customerCount} <span className="text-[11px] font-medium text-muted-foreground">clients</span></div>
                <div className="text-[11px] font-bold text-brand">{seg.formattedFinancialValue}</div>
                <p className="text-[10.5px] text-muted-foreground line-clamp-2">{seg.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── SECTION 9: AUTHORITATIVE PORTFOLIO PREDICTIONS ──────────────────── */}
      {portfolioPredictions.length > 0 && (
        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="border-b border-border px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-brand" strokeWidth={1.75} />
              <span className="text-[13.5px] font-semibold tracking-tight text-foreground">
                Authoritative AI Portfolio Predictions
              </span>
            </div>
            <span className="rounded bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand uppercase">
              {portfolioPredictions.length} Predictions
            </span>
          </div>

          <div className="divide-y divide-border">
            {portfolioPredictions.map((pred) => {
              const isExpanded = expandedPredictionId === pred.id;
              return (
                <div key={pred.id} className="p-4 space-y-2 hover:bg-secondary/20 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[9.5px] font-extrabold text-brand uppercase">
                          {pred.predictionType.replace("_", " ")}
                        </span>
                        <span className="text-[13px] font-bold text-foreground">{pred.prediction}</span>
                        <span className="text-[11px] text-muted-foreground">— {pred.customerName}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="font-bold text-brand">{pred.formattedProbability}</span>
                        <span>•</span>
                        <span>{pred.timeframe}</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="rounded bg-secondary px-2 py-0.5 text-[9px] font-extrabold text-muted-foreground uppercase">
                        {pred.provenance}
                      </span>
                      <button
                        type="button"
                        onClick={() => setExpandedPredictionId(isExpanded ? null : pred.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="h-3 w-3" /> Methodology
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>

                  {/* Prediction Methodology Drawer */}
                  {isExpanded && (
                    <div className="mt-2 rounded-xl border border-border bg-secondary/30 p-3.5 space-y-1.5 text-[11.5px]">
                      <div className="font-bold text-foreground text-[11px] uppercase tracking-wider">Prediction Engine Evidence:</div>
                      <p className="text-muted-foreground"><strong className="text-foreground">Evidence:</strong> {pred.evidence}</p>
                      <p className="text-muted-foreground"><strong className="text-foreground">Methodology:</strong> {pred.methodology}</p>
                      <p className="text-muted-foreground/70 italic"><strong className="text-foreground">Limitations:</strong> {pred.limitations}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── SECTION 8: REVENUE OPPORTUNITIES ─────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        <div className="border-b border-border px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" strokeWidth={1.75} />
            <span className="text-[13.5px] font-semibold tracking-tight text-foreground">
              Portfolio Revenue Opportunities
            </span>
          </div>
          <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 uppercase">
            {revenueOpportunities.length} Identified
          </span>
        </div>

        {revenueOpportunities.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground italic">
            No revenue opportunities identified across workspace portfolio.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {revenueOpportunities.map((opp) => {
              const isExpanded = expandedOpportunityId === opp.id;
              return (
                <div key={opp.id} className="p-4 space-y-2 hover:bg-secondary/20 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9.5px] font-extrabold text-emerald-600 uppercase">
                          {opp.opportunityType.replace("_", " ")}
                        </span>
                        <span className="text-[13px] font-bold text-foreground">{opp.headline}</span>
                        <span className="text-[11px] text-muted-foreground">— {opp.customerName}</span>
                      </div>
                      <p className="text-[11.5px] text-muted-foreground">{opp.detail}</p>
                      <p className="text-[10.5px] text-muted-foreground/70 italic">Evidence: {opp.evidence}</p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="rounded bg-secondary px-2 py-0.5 text-[9px] font-extrabold text-muted-foreground uppercase">
                        {opp.provenance}
                      </span>

                      <button
                        type="button"
                        onClick={() => setExpandedOpportunityId(isExpanded ? null : opp.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:border-foreground/20"
                      >
                        <Eye className="h-3 w-3" /> Why?
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleActNow(opp)}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 shadow-xs"
                      >
                        Act Now <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Why / Methodology Drawer */}
                  {isExpanded && (
                    <div className="mt-2 rounded-xl border border-border bg-secondary/30 p-3.5 space-y-1.5 text-[11.5px]">
                      <div className="font-bold text-foreground text-[11px] uppercase tracking-wider">Opportunity Methodology:</div>
                      <p className="text-muted-foreground"><strong className="text-foreground">Records Considered:</strong> {opp.explainWhy.recordsConsidered}</p>
                      <p className="text-muted-foreground"><strong className="text-foreground">Methodology:</strong> {opp.explainWhy.methodology}</p>
                      <p className="text-muted-foreground"><strong className="text-foreground">Why Actionable:</strong> {opp.explainWhy.whyActionable}</p>
                      <p className="text-muted-foreground/70 italic"><strong className="text-foreground">Limitations:</strong> {opp.explainWhy.limitations}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── SECTION 8: PORTFOLIO CAMPAIGN CONNECTION ─────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        <div className="border-b border-border px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-brand" strokeWidth={1.75} />
            <span className="text-[13.5px] font-semibold tracking-tight text-foreground">
              Connected Workspace Campaigns
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: "/tasks" })}
            className="flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline"
          >
            Manage Campaigns <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {connectedCampaigns.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground italic">
            No active campaigns connected in workspace.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4">
            {connectedCampaigns.map((camp) => (
              <div
                key={camp.id}
                onClick={() => navigate({ to: "/tasks" })}
                className="group cursor-pointer rounded-xl border border-border bg-secondary/20 p-3.5 space-y-2 hover:border-brand transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[12.5px] text-foreground group-hover:text-brand transition-colors">{camp.name}</span>
                  <span className="rounded bg-brand/10 px-1.5 py-0.2 text-[9px] font-extrabold text-brand uppercase">{camp.type}</span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2">{camp.description || "Active portfolio campaign workstream."}</p>
                <div className="flex items-center justify-between text-[10.5px] font-semibold text-foreground pt-1 border-t border-border/40">
                  <span>Target: £{camp.target_value.toLocaleString("en-GB")}</span>
                  <span>{camp.progressPct}% complete</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── SECTION 7: PORTFOLIO RELATIONSHIP PRIORITIES ───────────────────── */}
      <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        <div className="border-b border-border px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-brand" strokeWidth={1.75} />
            <span className="text-[13.5px] font-semibold tracking-tight text-foreground">
              Today's Portfolio Priorities
            </span>
          </div>
          <span className="rounded bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand uppercase">
            {portfolioPriorities.length} Priorities
          </span>
        </div>

        {portfolioPriorities.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground italic">
            No priority actions identified across your workspace customer portfolio.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {portfolioPriorities.map((item) => {
              const isExpanded = expandedPriorityId === item.id;
              return (
                <div key={item.id} className="p-4 space-y-2 hover:bg-secondary/20 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                        <span className="text-[13px] font-bold text-foreground">{item.headline}</span>
                        <span className="text-[11px] text-muted-foreground">— {item.customerName}</span>
                      </div>
                      <p className="text-[11.5px] text-muted-foreground">{item.detail}</p>
                      <p className="text-[10.5px] text-muted-foreground/70 italic">Evidence: {item.evidence}</p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="rounded bg-secondary px-2 py-0.5 text-[9px] font-extrabold text-muted-foreground uppercase">
                        {item.provenance}
                      </span>
                      <button
                        type="button"
                        onClick={() => setExpandedPriorityId(isExpanded ? null : item.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:border-foreground/20"
                      >
                        <Eye className="h-3 w-3" /> Explain Why
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>

                  {/* Explain Why Panel */}
                  {isExpanded && (
                    <div className="mt-2 rounded-xl border border-border bg-secondary/30 p-3.5 space-y-2 text-[11.5px]">
                      <div className="flex items-start gap-2">
                        <Brain className="h-3.5 w-3.5 text-brand shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <div className="font-bold text-foreground text-[11px] uppercase tracking-wider">Evidence & Methodological Explanation:</div>
                          <p className="text-muted-foreground"><strong className="text-foreground">Records Evaluated:</strong> {item.explainWhy.recordsConsidered}</p>
                          <p className="text-muted-foreground"><strong className="text-foreground">Derived Signal:</strong> {item.explainWhy.derivedSignals}</p>
                          <p className="text-muted-foreground"><strong className="text-foreground">Why Prioritised:</strong> {item.explainWhy.whyPrioritised}</p>
                          <p className="text-muted-foreground"><strong className="text-foreground">Recommended Action:</strong> {item.explainWhy.recommendedAction}</p>
                          <p className="text-muted-foreground/70 italic"><strong className="text-foreground">Limitations:</strong> {item.explainWhy.limitations}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── SECTION 7: PORTFOLIO ACTIVITY FEED ───────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        <div className="border-b border-border px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-brand" strokeWidth={1.75} />
            <span className="text-[13.5px] font-semibold tracking-tight text-foreground">
              Recent Workspace Relationship Activity
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground">Portfolio Ledger</span>
        </div>

        {activityFeed.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground italic">
            No activity logs recorded across the workspace portfolio yet.
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {activityFeed.map((act) => (
              <div key={act.id} className="p-3.5 flex items-center justify-between text-[12px] hover:bg-secondary/20 transition-colors">
                <div>
                  <div className="font-bold text-foreground">{act.description}</div>
                  <div className="text-[10.5px] text-muted-foreground">
                    Action: {act.action} • Type: {act.entity_type}
                  </div>
                </div>
                <span className="text-[10.5px] text-muted-foreground shrink-0">
                  {new Date(act.created_at).toLocaleString("en-GB", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
