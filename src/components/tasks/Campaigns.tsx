import { useState, useEffect, useRef } from "react";
import { Target, TrendingUp, Globe, Zap, Users, Settings2, ChevronDown, ChevronUp, ArrowRight, CircleCheck as CheckCircle2, Clock, PoundSterling, ChartBar as BarChart3, Trophy, Flame, Plus, X, Edit3, Archive } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  fetchCampaigns,
  createCampaign,
  updateCampaign,
  archiveCampaign,
  type CalculatedCampaign,
  type CampaignOverview,
  type CampaignType,
  type CampaignHealth,
} from "@/services/campaigns";

const typeConfig: Record<CampaignType, { icon: LucideIcon; color: string; bg: string; label: string }> = {
  revenue: { icon: PoundSterling, color: "text-emerald-600", bg: "bg-emerald-50", label: "Revenue Growth" },
  growth: { icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50", label: "Business Growth" },
  customer: { icon: Users, color: "text-brand", bg: "bg-brand/10", label: "Customer Experience" },
  marketing: { icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50", label: "Marketing" },
  website: { icon: Globe, color: "text-orange-600", bg: "bg-orange-50", label: "Website" },
  automation: { icon: Zap, color: "text-amber-600", bg: "bg-amber-50", label: "Automation" },
  expansion: { icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50", label: "Expansion" },
  operations: { icon: Settings2, color: "text-slate-600", bg: "bg-slate-100", label: "Operations" },
};

const healthConfig: Record<CampaignHealth, { color: string; dot: string; bg: string }> = {
  Excellent: { color: "text-emerald-700", dot: "bg-emerald-500", bg: "bg-emerald-50" },
  Good: { color: "text-blue-700", dot: "bg-blue-500", bg: "bg-blue-50" },
  "Needs Attention": { color: "text-amber-700", dot: "bg-amber-500", bg: "bg-amber-50" },
  "At Risk": { color: "text-destructive", dot: "bg-destructive", bg: "bg-destructive/10" },
};

function ProgressRing({
  progress,
  size = 72,
  strokeWidth = 5.5,
  color = "#E31B23",
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const [animated, setAnimated] = useState(0);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let frame = 0;
          const total = 40;
          const tick = () => {
            frame++;
            setAnimated(Math.round((frame / total) * progress));
            if (frame < total) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [progress]);

  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (animated / 100) * circ;
  const cx = size / 2;

  return (
    <svg ref={ref} width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={cx} cy={cx} r={r} stroke="oklch(0.928 0 0)" strokeWidth={strokeWidth} fill="none" />
      <circle
        cx={cx}
        cy={cx}
        r={r}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.04s linear" }}
      />
    </svg>
  );
}

function CampaignCard({
  campaign,
  onEdit,
  onArchive,
}: {
  campaign: CalculatedCampaign;
  onEdit: (c: CalculatedCampaign) => void;
  onArchive: (c: CalculatedCampaign) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const tc = typeConfig[campaign.type] || typeConfig.revenue;
  const hc = healthConfig[campaign.health] || healthConfig.Good;
  const TypeIcon = tc.icon;

  const progressColor =
    campaign.progressPct >= 75 ? "#10B981" :
    campaign.progressPct >= 50 ? "#E31B23" : "#F59E0B";

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-200 hover:border-foreground/10 hover:shadow-card">
      <div className="flex items-start gap-4 p-5">
        <div className="relative shrink-0">
          <ProgressRing progress={campaign.progressPct} color={progressColor} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[15px] font-extrabold leading-none text-foreground">{campaign.progressPct}%</div>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-[14px] font-bold text-foreground leading-snug">{campaign.name}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10.5px] font-semibold ${tc.bg} ${tc.color}`}>
                  <TypeIcon className="h-2.5 w-2.5" strokeWidth={2} />
                  {tc.label}
                </span>
                <span className={`flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10.5px] font-semibold ${hc.bg} ${hc.color}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${hc.dot}`} />
                  {campaign.health}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <span className="rounded-xl border border-border bg-secondary/60 px-2.5 py-1.5 text-center">
                <div className="text-[9.5px] font-medium text-muted-foreground">Business Value</div>
                <div className="text-[13px] font-extrabold text-emerald-600">
                  £{Number(campaign.business_value).toLocaleString()}
                </div>
              </span>
              <span className="rounded-xl border border-border bg-secondary/60 px-2.5 py-1.5 text-center">
                <div className="text-[9.5px] font-medium text-muted-foreground">Days Remaining</div>
                <div className="text-[13px] font-extrabold text-foreground">
                  {campaign.daysRemaining !== null ? `${campaign.daysRemaining}d` : "No limit"}
                </div>
              </span>
            </div>
          </div>

          {campaign.description && (
            <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground line-clamp-2">
              {campaign.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3" />
              {campaign.completedTasks} / {campaign.totalTasks} tasks completed
            </span>
            {campaign.target_description && (
              <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                <Target className="h-3 w-3" /> Target: {campaign.target_description}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border px-5 py-2.5 bg-secondary/20">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-[11.5px] font-semibold text-brand hover:underline"
        >
          <span>{expanded ? "Collapse Details" : "View Campaign Details"}</span>
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(campaign)}
            title="Edit Campaign"
            className="flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-secondary"
          >
            <Edit3 className="h-3 w-3" /> Edit
          </button>
          <button
            type="button"
            onClick={() => onArchive(campaign)}
            title="Complete / Archive Campaign"
            className="flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            <Archive className="h-3 w-3" /> Complete
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border bg-secondary/30 p-5 space-y-4 text-[12.5px]">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-3.5">
              <div className="text-[10.5px] text-muted-foreground">Target Description</div>
              <div className="text-[13px] font-bold text-foreground mt-0.5">
                {campaign.target_description || "Not specified"}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-3.5">
              <div className="text-[10.5px] text-muted-foreground">Target Numeric Value</div>
              <div className="text-[13px] font-bold text-foreground mt-0.5">
                £{Number(campaign.target_value).toLocaleString()}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-3.5">
              <div className="text-[10.5px] text-muted-foreground">Deadline Date</div>
              <div className="text-[13px] font-bold text-foreground mt-0.5">
                {campaign.deadline ? new Date(campaign.deadline).toLocaleDateString("en-GB") : "No deadline"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CampaignModal({
  isOpen,
  onClose,
  onSave,
  campaignToEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  campaignToEdit?: CalculatedCampaign | null;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<CampaignType>("revenue");
  const [targetDescription, setTargetDescription] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [businessValue, setBusinessValue] = useState("");
  const [deadline, setDeadline] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (campaignToEdit) {
      setName(campaignToEdit.name);
      setDescription(campaignToEdit.description || "");
      setType(campaignToEdit.type || "revenue");
      setTargetDescription(campaignToEdit.target_description || "");
      setTargetValue(campaignToEdit.target_value ? String(campaignToEdit.target_value) : "");
      setBusinessValue(campaignToEdit.business_value ? String(campaignToEdit.business_value) : "");
      setDeadline(campaignToEdit.deadline ? campaignToEdit.deadline.slice(0, 10) : "");
    } else {
      setName("");
      setDescription("");
      setType("revenue");
      setTargetDescription("");
      setTargetValue("");
      setBusinessValue("");
      setDeadline("");
    }
  }, [campaignToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim() || null,
        type,
        target_description: targetDescription.trim() || null,
        target_value: targetValue ? Number(targetValue) : 0,
        business_value: businessValue ? Number(businessValue) : 0,
        deadline: deadline || null,
      });
      onClose();
    } catch (err) {
      console.error("Failed to save campaign:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-[15px] font-bold text-foreground">
            {campaignToEdit ? "Edit Campaign" : "Create New Campaign"}
          </h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-foreground">Campaign Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Become Bromley's Highest Rated Garage"
              required
              className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3.5 text-[13px] text-foreground focus:border-foreground/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-[12px] font-semibold text-foreground">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Campaign objective and strategic summary..."
              rows={2}
              className="w-full rounded-xl border border-border bg-secondary/30 p-3 text-[13px] text-foreground focus:border-foreground/20 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-foreground">Category Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CampaignType)}
                className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3 text-[13px] text-foreground focus:outline-none"
              >
                <option value="revenue">Revenue Growth</option>
                <option value="growth">Business Growth</option>
                <option value="customer">Customer Experience</option>
                <option value="marketing">Marketing</option>
                <option value="website">Website</option>
                <option value="automation">Automation</option>
                <option value="expansion">Expansion</option>
                <option value="operations">Operations</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[12px] font-semibold text-foreground">Deadline Date</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3 text-[13px] text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-foreground">Target Description</label>
              <input
                type="text"
                value={targetDescription}
                onChange={(e) => setTargetDescription(e.target.value)}
                placeholder="e.g. Reach 250 reviews"
                className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3.5 text-[13px] text-foreground focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-[12px] font-semibold text-foreground">Business Value (£)</label>
              <input
                type="number"
                value={businessValue}
                onChange={(e) => setBusinessValue(e.target.value)}
                placeholder="48000"
                className="h-10 w-full rounded-xl border border-border bg-secondary/30 px-3.5 text-[13px] text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2 text-[12.5px] font-semibold text-foreground hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-brand px-4 py-2 text-[12.5px] font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving..." : campaignToEdit ? "Update Campaign" : "Create Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Campaigns() {
  const { membership } = useAuthContext();
  const businessId = membership?.business_id;

  const [overview, setOverview] = useState<CampaignOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<CalculatedCampaign | null>(null);

  const loadData = () => {
    if (!businessId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchCampaigns(businessId)
      .then((data) => {
        setOverview(data);
      })
      .catch((err) => {
        console.error("Failed to load campaigns:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [businessId]);

  const handleSaveCampaign = async (formData: any) => {
    if (!businessId) return;
    if (editingCampaign) {
      await updateCampaign(editingCampaign.id, businessId, formData);
    } else {
      await createCampaign(businessId, formData);
    }
    loadData();
  };

  const handleArchiveCampaign = async (c: CalculatedCampaign) => {
    if (!businessId) return;
    if (!confirm(`Mark campaign "${c.name}" as completed?`)) return;
    await archiveCampaign(c.id, businessId, "completed");
    loadData();
  };

  const active = overview?.activeCampaigns ?? [];
  const completed = overview?.completedCampaigns ?? [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold tracking-tight text-foreground">Campaigns</h2>
          <p className="mt-0.5 text-[12.5px] text-muted-foreground">
            The strategic objectives driving your business operations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="rounded-xl border border-border bg-card px-3.5 py-2 text-center shadow-soft">
            <div className="text-[9.5px] font-medium text-muted-foreground">Active</div>
            <div className="text-[15px] font-extrabold text-foreground">{active.length}</div>
          </div>
          <div className="rounded-xl border border-border bg-card px-3.5 py-2 text-center shadow-soft">
            <div className="text-[9.5px] font-medium text-muted-foreground">Avg Progress</div>
            <div className="text-[15px] font-extrabold text-brand">{overview?.avgProgressPct ?? 0}%</div>
          </div>
          <div className="rounded-xl border border-border bg-card px-3.5 py-2 text-center shadow-soft">
            <div className="text-[9.5px] font-medium text-muted-foreground">Total Value</div>
            <div className="text-[15px] font-extrabold text-emerald-600">
              £{(overview?.totalActiveValue ?? 0).toLocaleString()}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingCampaign(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-3.5 py-2.5 text-[12.5px] font-semibold text-background transition-all duration-200 hover:bg-foreground/85"
          >
            New Campaign
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-muted-foreground">Loading workspace campaigns...</div>
      ) : active.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <div className="text-[14px] font-semibold text-foreground mb-1">No Active Campaigns</div>
          <p className="text-[12px] text-muted-foreground max-w-sm mx-auto mb-4">
            No campaigns currently active for your business workspace. Click "New Campaign" to set your first strategic objective.
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingCampaign(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-[12px] font-semibold text-white"
          >
            <Plus className="h-3.5 w-3.5" /> Create First Campaign
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {active.map((c) => (
            <CampaignCard
              key={c.id}
              campaign={c}
              onEdit={(comp) => {
                setEditingCampaign(comp);
                setIsModalOpen(true);
              }}
              onArchive={handleArchiveCampaign}
            />
          ))}
        </div>
      )}

      {/* Completed Campaigns Section */}
      {completed.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" strokeWidth={2} />
            <span className="text-[14px] font-semibold text-foreground">Completed Campaigns</span>
            <span className="ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-emerald-100 px-1 text-[10px] font-bold text-emerald-700">
              {completed.length}
            </span>
          </div>

          <div className="space-y-3">
            {completed.map((c) => (
              <div key={c.id} className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" strokeWidth={2} />
                      <span className="text-[13px] font-semibold text-foreground">{c.name}</span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      Completed {c.completed_at ? new Date(c.completed_at).toLocaleDateString("en-GB") : "Recently"}
                    </div>
                  </div>
                  <span className="rounded-xl bg-emerald-100 px-3 py-1 text-[12px] font-bold text-emerald-700">
                    £{Number(c.business_value).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <CampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCampaign}
        campaignToEdit={editingCampaign}
      />
    </div>
  );
}
