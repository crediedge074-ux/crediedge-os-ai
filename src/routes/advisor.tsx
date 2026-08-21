import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Brain, RefreshCw, Loader2, Info } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { AIRecommendations } from "@/components/advisor/AIRecommendations";
import { AIImpactTracker } from "@/components/advisor/AIImpactTracker";
import { useAuthContext } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { generateAIExecutiveBriefing, type AIExecutiveBriefingData } from "@/services/advisor";

export const Route = createFileRoute("/advisor")({
  component: AdvisorPage,
});

function DailyBriefingBanner({
  data,
  loading,
  onRefreshData,
}: {
  data: AIExecutiveBriefingData | null;
  loading: boolean;
  onRefreshData: () => void;
}) {
  const [showRefreshTooltip, setShowRefreshTooltip] = useState(false);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl bg-foreground p-6 text-background shadow-card">
      <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-8 h-32 w-32 rounded-full bg-brand/25 blur-2xl" />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
              <Brain className="h-3.5 w-3.5 text-background/80" strokeWidth={2} />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-background/50">
              AI Executive Briefing
            </span>
            {data?.lastAnalyzedTime && (
              <span className="text-[11px] text-background/40">
                · Last analysed: {data.lastAnalyzedTime}
              </span>
            )}
          </div>

          <h2 className="text-[17px] font-bold leading-snug text-background">
            {greeting}, {data?.greetingName || "there"}.
            {data?.hasSufficientData
              ? ` Your AI identified ${data.actionCount} priority action${data.actionCount !== 1 ? "s" : ""} today.`
              : " Welcome to your Business Advisor."}
          </h2>

          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-background/70">
            {loading ? (
              "Analyzing workspace data and generating executive briefing..."
            ) : data?.hasSufficientData ? (
              <>
                {data.summaryParagraph}{" "}
                {data.totalOpportunityAmount > 0 && (
                  <>
                    Completing recommendations targets an estimated{" "}
                    <span className="font-semibold text-background">+£{data.totalOpportunityAmount.toLocaleString()}</span> in recoverable revenue
                  </>
                )}
                {data.timeRequiredMinutes > 0 && (
                  <>
                    {" "}requiring approximately <span className="font-semibold text-background">{data.timeRequiredMinutes} min</span>
                  </>
                )}
                .
              </>
            ) : (
              data?.summaryParagraph
            )}
          </p>
        </div>

        {/* Refresh Data Action */}
        <div className="relative" onMouseEnter={() => setShowRefreshTooltip(true)} onMouseLeave={() => setShowRefreshTooltip(false)}>
          <button
            onClick={onRefreshData}
            disabled={loading}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-[12.5px] font-semibold text-background transition-all duration-200 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
            )}
            {loading ? "Checking..." : "Refresh Data"}
            <Info className="h-3 w-3 text-background/50 hover:text-background" />
          </button>

          {showRefreshTooltip && (
            <div className="pointer-events-none absolute right-0 top-11 z-30 w-64 rounded-xl border border-border bg-card p-3 shadow-xl text-left">
              <div className="text-[11px] font-bold text-foreground mb-1">Refresh Data</div>
              <div className="text-[10.5px] leading-relaxed text-muted-foreground">
                Checks your latest business activity for meaningful changes since your briefing was generated.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confidence bar if supported */}
      {data?.confidenceScore !== null && data?.confidenceScore !== undefined && (
        <div className="relative mt-5 flex items-center gap-3">
          <span className="text-[11px] font-medium text-background/50">AI Confidence</span>
          <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-brand transition-all duration-700"
              style={{ width: `${data.confidenceScore}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-background">{data.confidenceScore}%</span>
        </div>
      )}
    </div>
  );
}

function AdvisorPage() {
  const { membership, profile } = useAuthContext();
  const businessId = membership?.business_id;
  const firstName = profile?.first_name || profile?.full_name?.split(" ")[0];

  const [briefingData, setBriefingData] = useState<AIExecutiveBriefingData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadBriefing = () => {
    setLoading(true);
    generateAIExecutiveBriefing(businessId, firstName)
      .then((res) => {
        setBriefingData(res);
      })
      .catch((err) => {
        console.error("Failed to generate AI briefing:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadBriefing();
  }, [businessId, firstName]);

  return (
    <AppLayout>
      <PageHeader
        title="Business Advisor"
        description="AI-powered recommendations, impact tracking, and strategic guidance — personalised to your business."
        crumbs={[{ label: "Business Advisor" }]}
        badge="AI"
        action={{ label: "Generate Briefing", icon: Sparkles, onClick: loadBriefing }}
      />

      <DailyBriefingBanner data={briefingData} loading={loading} onRefreshData={loadBriefing} />

      <AIRecommendations />

      <AIImpactTracker />

      <div className="h-8" />
    </AppLayout>
  );
}
