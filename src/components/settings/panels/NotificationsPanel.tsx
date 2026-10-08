import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { getUserPreferences, updateUserPreferences, type UserPreferences } from "@/services/userPreferences";
import { SectionHeader, SaveBar, type Feedback } from "../primitives";
import { Switch } from "@/components/ui/switch";
import { PanelSkeleton } from "../primitives";

export function NotificationsPanel() {
  const { user } = useAuthContext();
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    getUserPreferences(user.id).then((p) => { setPrefs(p); setLoading(false); }).catch(() => setLoading(false));
  }, [user?.id]);

  const toggle = (key: keyof UserPreferences) => {
    if (!prefs) return;
    setPrefs({ ...prefs, [key]: !prefs[key] });
  };

  const handleSave = async () => {
    if (!user?.id || !prefs) return;
    setSaving(true);
    try {
      const updated = await updateUserPreferences(user.id, {
        notification_new_enquiry: prefs.notification_new_enquiry,
        notification_invoice_overdue: prefs.notification_invoice_overdue,
        notification_new_review: prefs.notification_new_review,
        notification_daily_briefing: prefs.notification_daily_briefing,
        notification_weekly_report: prefs.notification_weekly_report,
        notification_campaign_alerts: prefs.notification_campaign_alerts,
        notification_mission_updates: prefs.notification_mission_updates,
        notification_ai_insights: prefs.notification_ai_insights,
      });
      setPrefs(updated);
      setFeedback("saved");
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback("error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !prefs) return <PanelSkeleton />;

  const items = [
    { key: "notification_new_enquiry" as const, label: "New Enquiry Received", description: "Triggered when a new lead or enquiry arrives" },
    { key: "notification_invoice_overdue" as const, label: "Invoice Overdue", description: "Alert when an invoice passes its due date" },
    { key: "notification_new_review" as const, label: "New Review Posted", description: "Notified when a customer posts a new review" },
    { key: "notification_daily_briefing" as const, label: "Daily AI Briefing", description: "Receive your CEO morning briefing each day" },
    { key: "notification_weekly_report" as const, label: "Weekly Performance Report", description: "Receive a weekly AI business summary" },
    { key: "notification_campaign_alerts" as const, label: "Campaign Alerts", description: "Status updates on running campaigns" },
    { key: "notification_mission_updates" as const, label: "Mission Updates", description: "Task completion and mission progress alerts" },
    { key: "notification_ai_insights" as const, label: "AI Insights", description: "New AI discoveries and opportunity alerts" },
  ];

  return (
    <div className="space-y-4">
      <SectionHeader title="Notifications" description="Control which internal notifications you receive in CrediEdgeOS." />

      <div className="overflow-hidden rounded-xl border border-border">
        <div className="grid grid-cols-[1fr_80px] border-b border-border bg-secondary/30 px-4 py-2.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Notification</div>
          <div className="text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Enabled</div>
        </div>
        {items.map((item, i) => (
          <div key={item.key} className={`grid grid-cols-[1fr_80px] items-center px-4 py-3.5 ${i < items.length - 1 ? "border-b border-border" : ""}`}>
            <div>
              <div className="text-[13px] font-medium text-foreground">{item.label}</div>
              <div className="text-[11.5px] text-muted-foreground">{item.description}</div>
            </div>
            <div className="flex justify-center">
              <Switch checked={prefs[item.key] as boolean} onCheckedChange={() => toggle(item.key)} />
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11.5px] text-muted-foreground">
        These preferences control which internal CrediEdgeOS notifications appear in your notification bell. Email and SMS delivery are Coming Soon.
      </p>

      <SaveBar onSave={handleSave} saving={saving} feedback={feedback} />
    </div>
  );
}
