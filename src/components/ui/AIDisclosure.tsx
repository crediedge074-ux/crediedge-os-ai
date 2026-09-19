import { useState } from "react";
import { Sparkles, ShieldCheck, HelpCircle, AlertTriangle, RefreshCw, CheckCircle2, ChevronDown, ChevronUp, Flag } from "lucide-react";
import { DataProvenanceMeta, reportInaccurateAIOutput, consumeAICredits } from "@/services/aiGovernance";

interface AIDisclosureProps {
  businessId: string;
  featureName: string;
  provenance: DataProvenanceMeta;
  evidenceSummary?: string;
  customerId?: string | null;
  onRegenerate?: () => Promise<void> | void;
  className?: string;
}

const provenanceConfig = {
  CONNECTED: {
    label: "CONNECTED",
    bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    description: "Directly retrieved from verified workspace/integration data.",
  },
  DERIVED: {
    label: "DERIVED",
    bg: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    description: "Calculated from verified workspace data using a documented formula.",
  },
  "AI ANALYSIS": {
    label: "AI ANALYSIS",
    bg: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    description: "AI interpretation strictly based on verified evidence.",
  },
  "INSUFFICIENT DATA": {
    label: "INSUFFICIENT DATA",
    bg: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    description: "Insufficient evidence to make a reliable calculation or AI insight.",
  },
  ESTIMATED: {
    label: "ESTIMATED",
    bg: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    description: "Genuinely justified estimate with explicitly documented methodology.",
  },
};

export function AIDisclosure({
  businessId,
  featureName,
  provenance,
  evidenceSummary,
  customerId = null,
  onRegenerate,
  className = "",
}: AIDisclosureProps) {
  const [expanded, setExpanded] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const cfg = provenanceConfig[provenance.type] || provenanceConfig["INSUFFICIENT DATA"];

  const handleReportInaccurate = async () => {
    if (!reportReason.trim()) return;
    setReporting(true);
    try {
      await reportInaccurateAIOutput({
        businessId,
        feature: featureName,
        outputSummary: evidenceSummary || "AI Output",
        reason: reportReason,
        customerId,
        creditsToRefund: 1,
      });
      setReportSubmitted(true);
      setTimeout(() => {
        setReporting(false);
        setReportSubmitted(false);
        setReportReason("");
      }, 3000);
    } catch (err) {
      console.error("Failed to report inaccurate AI output:", err);
      setReporting(false);
    }
  };

  const handleRegenerate = async () => {
    if (!onRegenerate || isRegenerating) return;
    setIsRegenerating(true);
    try {
      const { success } = await consumeAICredits({
        businessId,
        feature: featureName,
        creditsRequired: 1,
      });
      if (success) {
        await onRegenerate();
      } else {
        alert("Insufficient AI credits remaining for this workspace.");
      }
    } catch (err) {
      console.error("Error regenerating AI output:", err);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className={`rounded-xl border border-border/60 bg-card/60 p-3 text-[11.5px] ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
            <Sparkles className="h-3 w-3" />
            AI Generated
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[9.5px] font-bold tracking-wide ${cfg.bg}`}
          >
            <ShieldCheck className="h-3 w-3" />
            {cfg.label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onRegenerate && (
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="inline-flex items-center gap-1 text-[10.5px] font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
              title="Regenerate using 1 AI Credit"
            >
              <RefreshCw className={`h-3 w-3 ${isRegenerating ? "animate-spin" : ""}`} />
              Regenerate
            </button>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1 text-[10.5px] font-medium text-muted-foreground hover:text-foreground"
          >
            {expanded ? "Hide Details" : "Provenance & Evidence"}
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 space-y-2 border-t border-border/50 pt-2.5 text-[11px] text-muted-foreground">
          <div>
            <span className="font-semibold text-foreground">Data Provenance Rule: </span>
            {cfg.description}
          </div>

          {provenance.methodology && (
            <div>
              <span className="font-semibold text-foreground">Methodology: </span>
              {provenance.methodology}
            </div>
          )}

          {evidenceSummary && (
            <div>
              <span className="font-semibold text-foreground">Evidence Basis: </span>
              {evidenceSummary}
            </div>
          )}

          {provenance.dataSources && provenance.dataSources.length > 0 && (
            <div>
              <span className="font-semibold text-foreground">Data Sources: </span>
              {provenance.dataSources.join(", ")}
            </div>
          )}

          {/* Report Inaccurate Output Workflow */}
          <div className="mt-2 rounded-lg bg-muted/40 p-2.5">
            {!reportSubmitted ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-foreground font-medium">
                  <Flag className="h-3.5 w-3.5 text-amber-500" />
                  Report Inaccurate Output or Feedback
                </div>
                <p className="text-[10px] text-muted-foreground">
                  If this AI analysis appears inaccurate or unevidenced, reporting it logs an audit event and refunds 1 AI credit to your workspace.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Why is this output inaccurate?"
                    className="flex-1 rounded-md border border-input bg-background px-2.5 py-1 text-[11px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    onClick={handleReportInaccurate}
                    disabled={!reportReason.trim() || reporting}
                    className="rounded-md bg-secondary px-2.5 py-1 text-[10.5px] font-semibold text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50"
                  >
                    Submit Report & Refund
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                <CheckCircle2 className="h-4 w-4" />
                Report logged. 1 AI Credit refunded to your workspace.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
