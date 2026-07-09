import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Brain, RefreshCw } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { AIRecommendations } from "@/components/advisor/AIRecommendations";
import { AIImpactTracker } from "@/components/advisor/AIImpactTracker";

export const Route = createFileRoute("/advisor")({
  component: AdvisorPage,
});

function DailyBriefingBanner() {
  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl bg-foreground p-6 text-background shadow-card">
      {/* Subtle glow */}
      <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-8 h-32 w-32 rounded-full bg-brand/25 blur-2xl" />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
              <Brain className="h-3.5 w-3.5 text-background/80" strokeWidth={2} />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-background/50">
              AI Executive Briefing
            </span>
          </div>
          <h2 className="text-[17px] font-bold leading-snug text-background">
            Good morning, Dom. Your AI has identified 6 actions today.
          </h2>
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-background/70">
            Completing all recommendations would generate an estimated{" "}
            <span className="font-semibold text-background">+£6,770</span> in additional revenue
            and requires approximately{" "}
            <span className="font-semibold text-background">103 minutes</span>. Your AI
            confidence score is <span className="font-semibold text-background">94%</span> — up
            from 81% last month.
          </p>
        </div>

        <button className="flex shrink-0 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-[12.5px] font-semibold text-background transition-all duration-200 hover:bg-white/15">
          <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
          Regenerate Briefing
        </button>
      </div>

      {/* Confidence bar */}
      <div className="relative mt-5 flex items-center gap-3">
        <span className="text-[11px] font-medium text-background/50">AI Confidence</span>
        <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
          <div className="absolute inset-y-0 left-0 rounded-full bg-brand" style={{ width: "94%" }} />
        </div>
        <span className="text-[11px] font-bold text-background">94%</span>
      </div>
    </div>
  );
}

function AdvisorPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Business Advisor"
        description="AI-powered recommendations, impact tracking, and strategic guidance — personalised to your business."
        crumbs={[{ label: "Business Advisor" }]}
        badge="AI"
        action={{ label: "Generate Briefing", icon: Sparkles }}
      />

      <DailyBriefingBanner />

      <AIRecommendations />

      <AIImpactTracker />

      <div className="h-8" />
    </AppLayout>
  );
}
