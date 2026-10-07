import React, { useState, useEffect } from "react";
import {
  fetchCommunicationIntelligenceMetrics,
  CommunicationIntelligenceMetrics,
} from "@/services/communications";
import {
  MessageSquare,
  Clock,
  Zap,
  Smile,
  AlertTriangle,
  Radio,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import { AIDisclosure } from "@/components/ui/AIDisclosure";
import { Badge } from "@/components/ui/badge";

export function CommunicationIntelligence() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<CommunicationIntelligenceMetrics | null>(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await fetchCommunicationIntelligenceMetrics();
      setMetrics(data);
    } catch (err) {
      console.error("Failed to load communication intelligence metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-900/50 rounded-xl border border-slate-800">
        Loading Communication Intelligence Overview...
      </div>
    );
  }

  const flags = metrics?.insufficientDataFlags;

  return (
    <div className="space-y-6">
      {/* Top Banner: Real-time Live Monitoring & Integration Status */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Live Workspace Monitoring</h3>
              <Badge
                variant="outline"
                className={
                  metrics?.liveMonitoringState === "Active Monitoring"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                }
              >
                {metrics?.liveMonitoringState}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {metrics?.connectedChannelsCount && metrics.connectedChannelsCount > 0
                ? `${metrics.connectedChannelsCount} active 3rd-party platform integration(s) synchronized.`
                : "Zero 3rd-party integration APIs connected. Operating in Manual Mode with explicit provenance tracking."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-300">
          <div className="text-right">
            <div className="font-semibold text-white">{metrics?.totalCommunications ?? 0} Total Records</div>
            <div className="text-slate-400">Workspace Scoped</div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Unread & Awaiting Reply */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unread & Pending</span>
            <MessageSquare className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{metrics?.unreadMessagesCount ?? 0}</span>
            <span className="text-xs text-slate-400">unread</span>
          </div>
          <p className="text-xs text-slate-400">
            {metrics?.awaitingReplyCount ?? 0} conversation(s) awaiting reply.
          </p>
        </div>

        {/* Average Response Time */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Response Time</span>
            <Clock className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            {flags?.responseTime ? (
              <span className="text-sm font-bold text-slate-400">INSUFFICIENT DATA</span>
            ) : (
              <span className="text-2xl font-bold text-white">{metrics?.avgResponseTimeFormatted}</span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {flags?.responseTime
              ? "Requires at least 1 inbound-to-outbound response pair."
              : "Measured across inbound response pairs."}
          </p>
        </div>

        {/* AI Priority Score */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Priority Score</span>
            <Zap className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            {flags?.priorityScore ? (
              <span className="text-sm font-bold text-slate-400">INSUFFICIENT DATA</span>
            ) : (
              <>
                <span className="text-2xl font-bold text-white">{metrics?.aiPriorityScore}%</span>
                <span className="text-xs text-indigo-400">{metrics?.aiPriorityLabel}</span>
              </>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {flags?.priorityScore
              ? "Requires workspace communication activity."
              : "Derived from message sentiment & urgency ratios."}
          </p>
        </div>

        {/* Customer Satisfaction / Missed Opportunities */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Satisfaction / Opportunities</span>
            <Smile className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            {flags?.satisfaction ? (
              <span className="text-sm font-bold text-slate-400">INSUFFICIENT DATA</span>
            ) : (
              <span className="text-2xl font-bold text-white">{metrics?.satisfactionScore}%</span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {flags?.satisfaction
              ? "Requires customer ratings from Reviews module."
              : metrics?.satisfactionLabel}
          </p>
        </div>
      </div>

      {/* AI Transparency & Provenance Banner */}
      <AIDisclosure
        featureName="Communication Intelligence Overview"
        dataDependencies={["communications table", "reviews table", "integrations table"]}
        limitations={[
          "KPI calculations enforce sample-size safeguards before outputting aggregate percentages.",
          "Displays INSUFFICIENT DATA when workspace communication history is inadequate.",
        ]}
      />
    </div>
  );
}
