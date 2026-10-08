import { useState, useEffect, useCallback } from "react";
import { Shield, KeyRound, Smartphone, LogOut } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { getActivityLogs } from "@/services/activity";
import type { ActivityLog } from "@/lib/database.types";
import { SectionHeader, SettingsRow, ActionButton } from "../primitives";
import { InsufficientData } from "@/components/ui/InsufficientData";
import { EmptyState } from "@/components/ui/EmptyState";
import { supabase } from "@/lib/supabase";

export function SecurityPanel() {
  const { user, membership } = useAuthContext();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  const loadLogs = useCallback(async () => {
    if (!membership?.business_id) { setLoading(false); return; }
    setLoading(true);
    try {
      const data = await getActivityLogs(membership.business_id, 15);
      const securityLogs = data.filter((l) => l.entity_type === "security" || l.action.includes("password") || l.action.includes("login") || l.action.includes("session"));
      setLogs(securityLogs);
    } catch (err) {
      console.error("[SecurityPanel] load error:", err);
    } finally {
      setLoading(false);
    }
  }, [membership?.business_id]);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  const handleSignOutAll = async () => {
    setSigningOut(true);
    try {
      await supabase.auth.signOut({ scope: "global" });
    } catch (err) {
      console.error("[SecurityPanel] sign out error:", err);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Security" description="Protect your account with advanced security controls." />

      {/* Security Status */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="text-[13px] font-semibold text-foreground">Security Status</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-secondary/20 p-3">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-emerald-500" strokeWidth={1.75} />
              <span className="text-[12.5px] font-medium text-foreground">Password</span>
            </div>
            <div className="mt-1 text-[11.5px] text-muted-foreground">Set — change via Account tab</div>
          </div>
          <div className="rounded-xl border border-border bg-secondary/20 p-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-muted-foreground/50" strokeWidth={1.75} />
              <span className="text-[12.5px] font-medium text-foreground">2FA</span>
            </div>
            <div className="mt-1 text-[11.5px] text-muted-foreground">Not enabled — Coming Soon</div>
          </div>
        </div>
      </div>

      {/* Authentication */}
      <div className="space-y-2">
        <div className="text-[13px] font-semibold text-foreground">Authentication</div>
        <SettingsRow label="Password" description="Change your account password — see Account tab" action={<ActionButton label="Account Tab" onClick={() => {}} />} />
        <SettingsRow label="Two-Factor Authentication" description="Not enabled — adds an extra layer of security" action={<ActionButton label="Enable" variant="brand" />} />
      </div>

      {/* Sessions */}
      <div>
        <div className="mb-3 text-[13px] font-semibold text-foreground">Sessions</div>
        <SettingsRow
          label="Sign Out All Sessions"
          description="Sign out of CrediEdgeOS on all devices including this one"
          action={<ActionButton label="Sign Out All" variant="danger" onClick={handleSignOutAll} loading={signingOut} />}
        />
        <p className="mt-2 text-[11.5px] text-muted-foreground">
          Detailed session and device management (viewing individual devices, selectively signing out) is Coming Soon. Supabase does not currently expose enough session detail for per-device management.
        </p>
      </div>

      {/* Security Activity */}
      <div>
        <div className="mb-3 text-[13px] font-semibold text-foreground">Security Activity</div>
        {loading ? (
          <InsufficientData description="Loading security events…" />
        ) : logs.length === 0 ? (
          <EmptyState
            icon={Shield}
            title="No security events recorded"
            description="Security-related activity — such as password changes — will appear here as it occurs. No events have been logged yet."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            {logs.map((log, i) => (
              <div key={log.id} className={`flex items-center gap-3 px-4 py-3 ${i < logs.length - 1 ? "border-b border-border" : ""}`}>
                <Shield className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] font-medium text-foreground">{log.description}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {new Date(log.created_at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{log.action}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
