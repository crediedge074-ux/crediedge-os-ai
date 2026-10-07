import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getPrimaryMembership, getBusiness } from "@/services/business";
import {
  MessageSquare,
  Clock,
  Zap,
  Star,
  Brain,
  Radio,
  Sparkles,
  AlertTriangle,
  Mail,
  Phone,
  MessageCircle,
  FileText,
  User,
  Inbox,
  Send,
} from "lucide-react";

interface CommunicationRecord {
  id: string;
  business_id: string;
  customer_id?: string | null;
  channel: string;
  direction: string;
  subject?: string | null;
  body: string;
  sentiment?: string | null;
  read_at?: string | null;
  created_at: string;
  customer?: {
    first_name: string;
    last_name: string;
    email?: string | null;
    phone?: string | null;
  } | null;
}

export function CommunicationIntelligence() {
  const [loading, setLoading] = useState(true);
  const [communications, setCommunications] = useState<CommunicationRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [awaitingReplyCount, setAwaitingReplyCount] = useState(0);
  const [avgResponseFormatted, setAvgResponseFormatted] = useState("INSUFFICIENT DATA");

  useEffect(() => {
    loadCommunicationsData();
  }, []);

  const loadCommunicationsData = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setLoading(false);
        return;
      }

      const membership = await getPrimaryMembership(userData.user.id);
      if (!membership?.business_id) {
        setLoading(false);
        return;
      }

      // Fetch real communications from Supabase
      const { data: commsData, error } = await supabase
        .from("communications")
        .select(`
          id,
          business_id,
          customer_id,
          channel,
          direction,
          subject,
          body,
          sentiment,
          read_at,
          created_at,
          customer:customers(first_name, last_name, email, phone)
        `)
        .eq("business_id", membership.business_id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching workspace communications:", error);
      } else {
        const commList = (commsData || []) as unknown as CommunicationRecord[];
        setCommunications(commList);
        setTotalCount(commList.length);

        // Calculate unread inbound communications
        const unread = commList.filter(
          (c) => c.direction === "inbound" && !c.read_at
        ).length;
        setUnreadCount(unread);

        // Calculate unique customers awaiting reply (latest communication is inbound)
        const customerLatestMsgMap = new Map<string, string>();
        // Process in chronological order
        [...commList].reverse().forEach((c) => {
          if (c.customer_id) {
            customerLatestMsgMap.set(c.customer_id, c.direction);
          }
        });

        let awaitingCount = 0;
        customerLatestMsgMap.forEach((direction) => {
          if (direction === "inbound") awaitingCount++;
        });
        setAwaitingReplyCount(awaitingCount);

        // Calculate response time if pairs exist
        const customerCommsMap = new Map<string, Array<{ direction: string; created_at: string }>>();
        [...commList].reverse().forEach((c) => {
          if (c.customer_id) {
            if (!customerCommsMap.has(c.customer_id)) customerCommsMap.set(c.customer_id, []);
            customerCommsMap.get(c.customer_id)!.push({ direction: c.direction, created_at: c.created_at });
          }
        });

        const durations: number[] = [];
        customerCommsMap.forEach((list) => {
          for (let i = 0; i < list.length - 1; i++) {
            if (list[i].direction === "inbound" && list[i + 1].direction === "outbound") {
              const diffMs = new Date(list[i + 1].created_at).getTime() - new Date(list[i].created_at).getTime();
              if (diffMs >= 0) durations.push(diffMs / (1000 * 60));
            }
          }
        });

        if (durations.length > 0) {
          const avgMins = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
          if (avgMins < 60) {
            setAvgResponseFormatted(`${avgMins} mins`);
          } else {
            setAvgResponseFormatted(`${Math.round((avgMins / 60) * 10) / 10} hrs`);
          }
        } else {
          setAvgResponseFormatted("INSUFFICIENT DATA");
        }
      }
    } catch (err) {
      console.error("Failed loading communications baseline:", err);
    } finally {
      setLoading(false);
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel.toLowerCase()) {
      case "email": return <Mail className="h-4 w-4 text-blue-500" />;
      case "whatsapp": return <MessageCircle className="h-4 w-4 text-emerald-500" />;
      case "sms": return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case "phone": return <Phone className="h-4 w-4 text-amber-500" />;
      default: return <FileText className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Premium Hero Header (Preserving Approved Visual Design) */}
      <div className="relative overflow-hidden rounded-2xl bg-foreground p-6 text-background shadow-card">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute -bottom-10 left-1/4 h-48 w-48 rounded-full bg-brand/10 blur-2xl" />

        <div className="relative">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-background/10 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-wider">
                <Sparkles className="h-3 w-3 text-brand" />
                Workspace Communications
              </div>
              <h2 className="text-[22px] font-bold leading-tight tracking-tight text-background">
                Communication Intelligence™
              </h2>
              <p className="mt-1 text-[13px] text-background/65">
                Every conversation. One intelligent workspace.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-xl bg-background/10 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="text-[11px] font-semibold text-background/80">Manual Mode</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl bg-background/10 px-3 py-2">
                <span className="text-[11px] font-semibold text-background/80">{totalCount} Records</span>
              </div>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            <div className="flex flex-col gap-1.5 rounded-xl bg-background/10 p-3">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="h-3 w-3 text-background/50" />
                <span className="text-[9.5px] font-medium text-background/55">Unread Messages</span>
              </div>
              <span className="text-[20px] font-bold tracking-tight text-background">
                {unreadCount}
              </span>
            </div>

            <div className="flex flex-col gap-1.5 rounded-xl bg-background/10 p-3">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-background/50" />
                <span className="text-[9.5px] font-medium text-background/55">Awaiting Reply</span>
              </div>
              <span className="text-[20px] font-bold tracking-tight text-background">
                {awaitingReplyCount}
              </span>
            </div>

            <div className="flex flex-col gap-1.5 rounded-xl bg-background/10 p-3">
              <div className="flex items-center gap-1.5">
                <Zap className="h-3 w-3 text-background/50" />
                <span className="text-[9.5px] font-medium text-background/55">Avg Response Time</span>
              </div>
              <span className="text-[16px] font-bold tracking-tight text-background">
                {avgResponseFormatted}
              </span>
            </div>

            <div className="flex flex-col gap-1.5 rounded-xl bg-background/10 p-3">
              <div className="flex items-center gap-1.5">
                <Brain className="h-3 w-3 text-background/50" />
                <span className="text-[9.5px] font-medium text-background/55">AI Priority Score</span>
              </div>
              <span className="text-[12px] font-bold tracking-tight text-background/80">
                INSUFFICIENT DATA
              </span>
            </div>

            <div className="flex flex-col gap-1.5 rounded-xl bg-background/10 p-3">
              <div className="flex items-center gap-1.5">
                <Star className="h-3 w-3 text-background/50" />
                <span className="text-[9.5px] font-medium text-background/55">Satisfaction</span>
              </div>
              <span className="text-[12px] font-bold tracking-tight text-background/80">
                INSUFFICIENT DATA
              </span>
            </div>

            <div className="flex flex-col gap-1.5 rounded-xl bg-background/10 p-3">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-3 w-3 text-background/50" />
                <span className="text-[9.5px] font-medium text-background/55">Missed Opps</span>
              </div>
              <span className="text-[12px] font-bold tracking-tight text-background/80">
                INSUFFICIENT DATA
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Genuine Workspace Communications Activity Section */}
      <div className="rounded-2xl border border-border bg-card shadow-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-brand" />
            <h3 className="text-sm font-semibold text-foreground">Recent Communication Activity</h3>
          </div>
          <span className="text-xs text-muted-foreground">{totalCount} total entries</span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            Loading genuine workspace communications...
          </div>
        ) : communications.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-secondary text-muted-foreground">
              <Inbox className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">No Communications Recorded</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              There are no recorded communications in this workspace yet. When messages or notes are logged, they will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {communications.map((comm) => (
              <div
                key={comm.id}
                className="p-3.5 rounded-xl border border-border bg-secondary/30 flex items-start gap-3 transition-colors hover:bg-secondary/60"
              >
                <div className="p-2 rounded-lg bg-card border border-border shrink-0">
                  {getChannelIcon(comm.channel)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-foreground truncate">
                      {comm.customer
                        ? `${comm.customer.first_name} ${comm.customer.last_name}`
                        : "General Enquiry"}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {new Date(comm.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {comm.subject && (
                    <div className="text-[11px] font-medium text-foreground/90 truncate mt-0.5">
                      {comm.subject}
                    </div>
                  )}
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">
                    {comm.body}
                  </p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span
                    className={`text-[9.5px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                      comm.direction === "inbound"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-emerald-500/10 text-emerald-500"
                    }`}
                  >
                    {comm.direction}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
