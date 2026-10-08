import { useState, useEffect } from "react";
import { Brain, Zap, TrendingUp, Shield } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { updateBusinessSettings } from "@/services/settings";
import { getAIAllowance, type AIAllowanceStatus } from "@/services/aiUsage";
import { SectionHeader, FormField, SaveBar, SettingsRow, PanelSkeleton, type Feedback } from "../primitives";
import { Switch } from "@/components/ui/switch";
import { InsufficientData } from "@/components/ui/InsufficientData";

export function AIPanel() {
  const { settings, membership, refreshSettings } = useAuthContext();
  const [form, setForm] = useState({
    ai_provider: "openai", ai_model: "gpt-4o", ai_creativity: 65, ai_enabled: true,
    daily_briefing: true, weekly_report: true, business_context: "",
    ai_response_style: "balanced", ai_proactivity: "proactive", ai_prioritise: "growth",
    ai_challenge_decisions: false, ai_require_confirmation: true,
    ai_allow_external_research: false, ai_allow_recommendations: true,
    ai_business_priorities: "", ai_strategic_objectives: "", ai_constraints: "", ai_terminology: "",
  });
  const [allowance, setAllowance] = useState<AIAllowanceStatus | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useEffect(() => {
    if (settings) {
      setForm({
        ai_provider: settings.ai_provider ?? "openai",
        ai_model: settings.ai_model ?? "gpt-4o",
        ai_creativity: settings.ai_creativity ?? 65,
        ai_enabled: settings.ai_enabled,
        daily_briefing: settings.daily_briefing,
        weekly_report: settings.weekly_report,
        business_context: settings.business_context ?? "",
        ai_response_style: (settings as any).ai_response_style ?? "balanced",
        ai_proactivity: (settings as any).ai_proactivity ?? "proactive",
        ai_prioritise: (settings as any).ai_prioritise ?? "growth",
        ai_challenge_decisions: (settings as any).ai_challenge_decisions ?? false,
        ai_require_confirmation: (settings as any).ai_require_confirmation ?? true,
        ai_allow_external_research: (settings as any).ai_allow_external_research ?? false,
        ai_allow_recommendations: (settings as any).ai_allow_recommendations ?? true,
        ai_business_priorities: (settings as any).ai_business_priorities ?? "",
        ai_strategic_objectives: (settings as any).ai_strategic_objectives ?? "",
        ai_constraints: (settings as any).ai_constraints ?? "",
        ai_terminology: (settings as any).ai_terminology ?? "",
      });
    }
    if (membership?.business_id) {
      getAIAllowance(membership.business_id).then(setAllowance).catch(() => {});
    }
  }, [settings?.id, membership?.business_id]);

  const handleSave = async () => {
    if (!membership?.business_id) return;
    setSaving(true);
    try {
      await updateBusinessSettings(membership.business_id, {
        ai_provider: form.ai_provider,
        ai_model: form.ai_model,
        ai_creativity: form.ai_creativity,
        ai_enabled: form.ai_enabled,
        daily_briefing: form.daily_briefing,
        weekly_report: form.weekly_report,
        business_context: form.business_context || null,
      });
      await (supabaseFromSettings as any)(membership.business_id, {
        ai_response_style: form.ai_response_style,
        ai_proactivity: form.ai_proactivity,
        ai_prioritise: form.ai_prioritise,
        ai_challenge_decisions: form.ai_challenge_decisions,
        ai_require_confirmation: form.ai_require_confirmation,
        ai_allow_external_research: form.ai_allow_external_research,
        ai_allow_recommendations: form.ai_allow_recommendations,
        ai_business_priorities: form.ai_business_priorities || null,
        ai_strategic_objectives: form.ai_strategic_objectives || null,
        ai_constraints: form.ai_constraints || null,
        ai_terminology: form.ai_terminology || null,
      });
      await refreshSettings();
      setFeedback("saved");
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback("error");
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <PanelSkeleton />;

  return (
    <div className="space-y-6">
      <SectionHeader title="AI Settings" description="Configure how the AI analyses and communicates with your business." />

      {/* AI Usage */}
      {allowance && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-brand" strokeWidth={1.75} />
            <span className="text-[13px] font-semibold text-foreground">AI Usage</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-[11px] font-medium text-muted-foreground">Plan Tier</div>
              <div className="mt-0.5 text-[15px] font-bold text-foreground capitalize">{allowance.planTier}</div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-muted-foreground">Used / Allowance</div>
              <div className="mt-0.5 text-[15px] font-bold text-foreground">{allowance.usedCredits} / {allowance.monthlyAllowance}</div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-muted-foreground">Remaining</div>
              <div className={`mt-0.5 text-[15px] font-bold ${allowance.canGenerate ? "text-emerald-600" : "text-red-600"}`}>
                {allowance.remainingCredits}
              </div>
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-brand transition-all"
              style={{ width: `${Math.min(100, (allowance.usedCredits / allowance.monthlyAllowance) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Resets {new Date(allowance.resetPeriodEnd).toLocaleDateString("en-GB")}. Credits are consumed by real AI operations through the central AI governance system.
          </p>
        </div>
      )}

      {/* AI Behaviour */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Brain className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="text-[13px] font-semibold text-foreground">AI Behaviour</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">Response Style</label>
            <select value={form.ai_response_style} onChange={(e) => setForm((f) => ({ ...f, ai_response_style: e.target.value }))} className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:outline-none">
              <option value="concise">Concise — Short, direct answers</option>
              <option value="balanced">Balanced — Moderate detail</option>
              <option value="detailed">Detailed — Comprehensive analysis</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">Proactivity Level</label>
            <select value={form.ai_proactivity} onChange={(e) => setForm((f) => ({ ...f, ai_proactivity: e.target.value }))} className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:outline-none">
              <option value="reactive">Reactive — Respond only when asked</option>
              <option value="proactive">Proactive — Surface relevant insights</option>
              <option value="very_proactive">Very Proactive — Actively flag opportunities and risks</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">Prioritise</label>
            <select value={form.ai_prioritise} onChange={(e) => setForm((f) => ({ ...f, ai_prioritise: e.target.value }))} className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:outline-none">
              <option value="growth">Growth — Focus on expansion</option>
              <option value="profitability">Profitability — Focus on margins</option>
              <option value="efficiency">Efficiency — Focus on operations</option>
              <option value="customer_retention">Customer Retention — Focus on loyalty</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">Preferred Terminology</label>
            <input value={form.ai_terminology} onChange={(e) => setForm((f) => ({ ...f, ai_terminology: e.target.value }))} placeholder="e.g. 'clients' not 'customers'" className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none" />
          </div>
        </div>
        <div className="mt-3 space-y-2">
          <SettingsRow label="Challenge Decisions" description="AI should question and challenge your assumptions" action={<Switch checked={form.ai_challenge_decisions} onCheckedChange={(v) => setForm((f) => ({ ...f, ai_challenge_decisions: v }))} />} />
        </div>
      </div>

      {/* Business Context */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="text-[13px] font-semibold text-foreground">Business Context</span>
        </div>
        <div className="space-y-3">
          <FormField label="Business Priorities" value={form.ai_business_priorities} onChange={(v) => setForm((f) => ({ ...f, ai_business_priorities: v }))} hint="What matters most to your business right now" />
          <FormField label="Strategic Objectives" value={form.ai_strategic_objectives} onChange={(v) => setForm((f) => ({ ...f, ai_strategic_objectives: v }))} hint="Long-term goals the AI should consider" />
          <FormField label="Important Constraints" value={form.ai_constraints} onChange={(v) => setForm((f) => ({ ...f, ai_constraints: v }))} hint="Limitations or rules the AI should respect" />
          <div>
            <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">Additional Instructions for the AI</label>
            <textarea
              value={form.business_context}
              onChange={(e) => setForm((f) => ({ ...f, business_context: e.target.value }))}
              placeholder="Describe your business, goals and challenges to help the AI provide more relevant insights..."
              rows={3}
              className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* AI Safety */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="text-[13px] font-semibold text-foreground">AI Safety</span>
        </div>
        <div className="space-y-2">
          <SettingsRow label="Require Confirmation" description="Ask before taking consequential actions" action={<Switch checked={form.ai_require_confirmation} onCheckedChange={(v) => setForm((f) => ({ ...f, ai_require_confirmation: v }))} />} />
          <SettingsRow label="Allow External Research" description="AI may research external data sources" action={<Switch checked={form.ai_allow_external_research} onCheckedChange={(v) => setForm((f) => ({ ...f, ai_allow_external_research: v }))} />} />
          <SettingsRow label="Allow Recommendations" description="AI can suggest actions for your approval" action={<Switch checked={form.ai_allow_recommendations} onCheckedChange={(v) => setForm((f) => ({ ...f, ai_allow_recommendations: v }))} />} />
        </div>
      </div>

      {/* Existing settings */}
      <div>
        <div className="mb-3 text-[13px] font-semibold text-foreground">General</div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">AI Provider</label>
            <select value={form.ai_provider} onChange={(e) => setForm((f) => ({ ...f, ai_provider: e.target.value }))} className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:outline-none">
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="google">Google</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">Preferred Model</label>
            <select value={form.ai_model} onChange={(e) => setForm((f) => ({ ...f, ai_model: e.target.value }))} className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-[13px] text-foreground focus:outline-none">
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-4o-mini">GPT-4o Mini</option>
              <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
            </select>
          </div>
        </div>
        <div className="mt-3 space-y-2">
          <SettingsRow label="AI Enabled" description="Enable AI analysis and insights across the platform" action={<Switch checked={form.ai_enabled} onCheckedChange={(v) => setForm((f) => ({ ...f, ai_enabled: v }))} />} />
          <SettingsRow label="Daily AI Briefing" description="Re-analyse all data each morning" action={<Switch checked={form.daily_briefing} onCheckedChange={(v) => setForm((f) => ({ ...f, daily_briefing: v }))} />} />
          <SettingsRow label="Weekly AI Reports" description="Generate weekly executive reports automatically" action={<Switch checked={form.weekly_report} onCheckedChange={(v) => setForm((f) => ({ ...f, weekly_report: v }))} />} />
        </div>
      </div>

      <p className="text-[11.5px] text-muted-foreground">
        AI preferences are persisted and will be consumed by the Business Intelligence Chat, Website AI, and other AI features as they are connected. AI provider/model selection reflects preference only — actual model availability depends on the central AI governance configuration.
      </p>

      <SaveBar onSave={handleSave} saving={saving} feedback={feedback} />
    </div>
  );
}

// Helper to update the extended AI settings columns that aren't in the typed BusinessSettingsUpdate
async function supabaseFromSettings(businessId: string, updates: Record<string, unknown>) {
  const { supabase } = await import("@/lib/supabase");
  const { error } = await (supabase.from as any)("settings")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("business_id", businessId);
  if (error) throw new Error(error.message);
}
