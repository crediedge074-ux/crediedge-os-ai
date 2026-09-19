import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Brain,
  Star,
  MessageSquare,
  Zap,
  Target,
  Shield,
  Lightbulb,
  CircleCheck as CheckCircle2,
  TriangleAlert as AlertTriangle,
  ChartBar as BarChart3,
  Sparkles,
  Award,
  Eye,
  Send,
  Plus,
  Clock,
  Megaphone,
  X,
  ExternalLink,
} from "lucide-react";

import { useAuthContext } from "@/contexts/AuthContext";
import {
  getReviews,
  updateReviewReply,
  requestReviewForCustomer,
  ExtendedReview,
} from "@/services/reviews";
import {
  calculateReviewAnalytics,
  ReviewAnalyticsResult,
} from "@/services/reviewAnalytics";
import { getCustomers } from "@/services/customers";
import { Customer } from "@/lib/database.types";
import { AIDisclosure } from "@/components/ui/AIDisclosure";

// ─── Animated Number ──────────────────────────────────────────────────────────

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1200,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(eased * value);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Star Row ─────────────────────────────────────────────────────────────────

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? "fill-brand text-brand" : "text-border"}`}
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function ReputationDNAHero({ analytics }: { analytics: ReviewAnalyticsResult }) {
  const stats = [
    {
      label: "Overall Rating",
      value: analytics.avgRating !== null ? `${analytics.avgRating}` : "N/A",
      sub: "out of 5",
      icon: Star,
    },
    {
      label: "Total Reviews",
      value: `${analytics.totalReviews}`,
      sub: "verified records",
      icon: MessageSquare,
    },
    {
      label: "Response Rate",
      value: analytics.responseRate !== null ? `${analytics.responseRate}%` : "N/A",
      sub: "verified replies",
      icon: CheckCircle2,
    },
    {
      label: "5-Star Rate",
      value: analytics.fiveStarRate !== null ? `${analytics.fiveStarRate}%` : "N/A",
      sub: "top satisfaction",
      icon: Brain,
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-foreground p-6 text-background shadow-card">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-background/10 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-wider">
            <Sparkles className="h-3 w-3 text-brand" />
            AI-Powered Intelligence
          </div>
          <h1 className="text-[22px] font-bold leading-tight tracking-tight text-background">
            Reputation DNA™
          </h1>
          <p className="mt-1.5 max-w-lg text-[13px] leading-relaxed text-background/65">
            Build a reputation your customers trust. Verified customer reviews and evidence-backed insights.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex min-w-[110px] flex-col gap-0.5 rounded-xl bg-background/10 p-3">
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3 w-3 text-background/55" strokeWidth={1.75} />
                  <span className="text-[9.5px] font-medium text-background/55">{stat.label}</span>
                </div>
                <span className="text-[18px] font-bold tracking-tight text-background">{stat.value}</span>
                <span className="text-[9px] text-background/50">{stat.sub}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────

export interface ReputationDNAProps {
  onRequestReview?: () => void;
  showRequestModalExternal?: boolean;
  setShowRequestModalExternal?: (show: boolean) => void;
}

export function ReputationDNA({
  showRequestModalExternal,
  setShowRequestModalExternal,
}: ReputationDNAProps = {}) {
  const navigate = useNavigate();
  const { business, user, session, loading: authLoading } = useAuthContext();
  const businessId = business?.id;

  const [reviews, setReviews] = useState<ExtendedReview[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [showRequestModalInternal, setShowRequestModalInternal] = useState(false);

  const showRequestModal = showRequestModalExternal ?? showRequestModalInternal;
  const setShowRequestModal = setShowRequestModalExternal ?? setShowRequestModalInternal;

  const [selectedCustomerForRequest, setSelectedCustomerForRequest] = useState("");
  const [requestSending, setRequestSending] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaignName, setCampaignName] = useState("");

  const loadData = async () => {
    if (!businessId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [revs, custs] = await Promise.all([
        getReviews(businessId),
        getCustomers(businessId),
      ]);
      setReviews(revs);
      setCustomers(custs);
      if (revs.length > 0 && !selectedId) {
        setSelectedId(revs[0].id);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (businessId) {
        loadData();
      } else {
        setLoading(false);
      }
    }
  }, [businessId, authLoading]);

  const analytics = calculateReviewAnalytics(reviews);
  const selectedReview = reviews.find((r) => r.id === selectedId) || reviews[0];

  const handlePublishReply = async () => {
    if (!replyText.trim() || !selectedReview || !businessId) return;
    try {
      await updateReviewReply(selectedReview.id, businessId, replyText);
      setReplyText("");
      await loadData();
    } catch (err) {
      console.error("Failed to publish reply:", err);
    }
  };

  const handleSendReviewRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerForRequest || !businessId) return;
    setRequestSending(true);
    try {
      await requestReviewForCustomer(businessId, selectedCustomerForRequest, "Google");
      setShowRequestModal(false);
      setSelectedCustomerForRequest("");
      await loadData();
    } catch (err) {
      console.error("Failed to send review request:", err);
    } finally {
      setRequestSending(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center text-xs text-muted-foreground">
        Loading verified workspace review data...
      </div>
    );
  }

  if (!user || !session) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
        <Brain className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
        <h3 className="text-sm font-semibold text-foreground">Authentication Required</h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
          Please log in to access your business workspace review management.
        </p>
      </div>
    );
  }

  if (!businessId) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
        <Brain className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
        <h3 className="text-sm font-semibold text-foreground">Workspace Scope Unavailable</h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
          No business workspace membership found for your authenticated account.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <ReputationDNAHero analytics={analytics} />

      {/* Main Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-brand" />
          <span className="text-xs font-semibold text-foreground">Review Workspace Actions</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowRequestModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-brand px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand/90"
          >
            <Star className="h-3.5 w-3.5" />
            Request Reviews
          </button>
          <button
            onClick={() => navigate({ to: "/integrations" })}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
          >
            <Plus className="h-3.5 w-3.5" />
            Connect Platform
          </button>
        </div>
      </div>

      {/* Reviews Content / Empty State */}
      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <Star className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
          <h3 className="text-sm font-semibold text-foreground">INSUFFICIENT DATA — No Workspace Reviews</h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
            {analytics.insufficientDataReason}
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => setShowRequestModal(true)}
              className="rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand/90"
            >
              Request First Review
            </button>
            <button
              onClick={() => navigate({ to: "/integrations" })}
              className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
            >
              Connect Review Provider
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
          {/* List */}
          <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
            <div className="border-b border-border px-4 py-3 text-xs font-semibold text-foreground">
              Reviews ({reviews.length})
            </div>
            <ul className="divide-y divide-border max-h-[500px] overflow-y-auto">
              {reviews.map((r) => {
                const custName = r.customer
                  ? `${r.customer.first_name || ""} ${r.customer.last_name || ""}`.trim()
                  : "Customer";
                const isSelected = selectedReview?.id === r.id;

                return (
                  <li
                    key={r.id}
                    onClick={() => setSelectedId(r.id)}
                    className={`cursor-pointer px-4 py-3 transition-colors ${
                      isSelected ? "bg-brand/5 border-l-2 border-l-brand" : "hover:bg-secondary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">{custName}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {r.rating && <StarRow rating={r.rating} />}
                    <p className="mt-1 text-[11px] text-muted-foreground truncate">
                      {r.feedback || "Review requested..."}
                    </p>
                    <div className="mt-1 flex items-center justify-between text-[9.5px]">
                      <span className="font-bold text-brand uppercase">{r.source || "Direct"}</span>
                      <span className="text-muted-foreground uppercase">{r.status}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Detail */}
          {selectedReview && (
            <div className="rounded-2xl border border-border bg-card shadow-card p-5 space-y-4">
              <div className="border-b border-border pb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {selectedReview.customer
                      ? `${selectedReview.customer.first_name || ""} ${selectedReview.customer.last_name || ""}`.trim()
                      : "Customer"}
                  </h4>
                  <div className="text-xs text-muted-foreground">
                    Source: {selectedReview.source || "Direct"} · Status: {selectedReview.status}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (selectedReview.source === "Google") {
                      window.open("https://business.google.com/", "_blank");
                    } else {
                      alert("No connected Google profile destination for this review.");
                    }
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open in Provider
                </button>
              </div>

              {selectedReview.rating && <StarRow rating={selectedReview.rating} />}

              <div className="rounded-xl bg-secondary/30 p-4 text-xs text-foreground leading-relaxed">
                {selectedReview.feedback || "No feedback text submitted."}
              </div>

              {/* Reply Section */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-foreground block">
                  Publish Reply to Customer
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                  placeholder="Type your official response..."
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handlePublishReply}
                    disabled={!replyText.trim()}
                    className="flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white disabled:opacity-50 hover:bg-brand/90"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Publish Reply
                  </button>
                </div>
              </div>

              <AIDisclosure
                businessId={businessId}
                featureName="Review Record"
                provenance={{
                  type: "CONNECTED",
                  methodology: "Retrieved directly from verified workspace review table in Supabase.",
                  evidenceCount: 1,
                  dataSources: ["reviews table"],
                }}
                evidenceSummary={`Record ID: ${selectedReview.id}, Rating: ${selectedReview.rating || "N/A"}`}
              />
            </div>
          )}
        </div>
      )}

      {/* Campaign Section */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-brand" />
            <h3 className="text-xs font-semibold text-foreground">Review Campaigns</h3>
          </div>
          <button
            onClick={() => setShowCampaignModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand/90"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Campaign
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Review campaigns allow automated review request sequences for active customer segments.
        </p>
      </div>

      {/* Request Review Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSendReviewRequest}
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-xs font-semibold text-foreground">Request Review from Customer</h3>
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="text-[10.5px] font-medium text-muted-foreground block mb-1">
                Select Customer
              </label>
              <select
                value={selectedCustomerForRequest}
                onChange={(e) => setSelectedCustomerForRequest(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs"
              >
                <option value="">-- Choose Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.first_name} {c.last_name} ({c.email || c.phone || "No contact"})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={requestSending}
                className="rounded-lg bg-brand px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
              >
                {requestSending ? "Sending..." : "Send Request"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-xs font-semibold text-foreground">Create Review Campaign</h3>
              <button
                onClick={() => setShowCampaignModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="text-[10.5px] font-medium text-muted-foreground block mb-1">
                Campaign Name
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g., Spring Customer Review Drive"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCampaignModal(false)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Campaign "${campaignName || 'New Campaign'}" registered in workspace.`);
                  setShowCampaignModal(false);
                  setCampaignName("");
                }}
                className="rounded-lg bg-brand px-4 py-1.5 text-xs font-semibold text-white"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
