import { createFileRoute } from "@tanstack/react-router";
import { Inbox, Search, MessageSquare, Mail, Phone } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { useState } from "react";

export const Route = createFileRoute("/communications")({
  component: CommunicationsPage,
});

const messages = [
  { id: 1, from: "John Smith", source: "WhatsApp", preview: "Hi, I'd like to book my car in for a service next week...", time: "2m ago", unread: true, type: "sms" },
  { id: 2, from: "Sarah Johnson", source: "Email", preview: "Following up on my invoice from last month...", time: "45m ago", unread: true, type: "email" },
  { id: 3, from: "Marcus Williams", source: "Phone", preview: "Missed call — called back at 10:15", time: "1h ago", unread: false, type: "phone" },
  { id: 4, from: "Emily Clarke", source: "Email", preview: "Thank you for the excellent service!", time: "3h ago", unread: false, type: "email" },
  { id: 5, from: "James Thompson", source: "WhatsApp", preview: "Can I get a quote for a full service on my BMW?", time: "5h ago", unread: true, type: "sms" },
];

const sourceIcon: Record<string, React.ElementType> = {
  email: Mail,
  sms: MessageSquare,
  phone: Phone,
};

function CommunicationsPage() {
  const [selected, setSelected] = useState<number | null>(1);
  const selectedMsg = messages.find((m) => m.id === selected);

  return (
    <AppLayout>
      <PageHeader
        title="Communications"
        description="Manage all inbound messages, calls and enquiries in one unified inbox."
        crumbs={[{ label: "Communications" }]}
        badge={`${messages.filter((m) => m.unread).length} Unread`}
        action={{ label: "Compose" }}
      >
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Search messages..."
            className="h-9 w-52 rounded-lg border border-border bg-secondary/50 pl-9 pr-3 text-[12.5px] placeholder:text-muted-foreground focus:border-foreground/20 focus:bg-card focus:outline-none"
          />
        </div>
      </PageHeader>

      {messages.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="You're all caught up"
          description="No new messages right now. New enquiries will appear here."
        />
      ) : (
        <div className="flex overflow-hidden rounded-xl border border-border bg-card shadow-soft" style={{ minHeight: 480 }}>
          {/* Message list */}
          <div className="w-full border-r border-border md:w-80 lg:w-96">
            <div className="border-b border-border px-4 py-3">
              <p className="text-[11.5px] font-semibold uppercase tracking-wider text-muted-foreground">
                {messages.length} Conversations
              </p>
            </div>
            <ul className="divide-y divide-border overflow-y-auto">
              {messages.map((m) => {
                const Icon = sourceIcon[m.type] ?? MessageSquare;
                return (
                  <li
                    key={m.id}
                    onClick={() => setSelected(m.id)}
                    className={`flex cursor-pointer items-start gap-3 px-4 py-3.5 transition-colors hover:bg-secondary/50 ${selected === m.id ? "bg-secondary/60" : ""}`}
                  >
                    <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/10 text-[12px] font-bold text-brand">
                      {m.from.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[13px] font-medium ${m.unread ? "text-foreground font-semibold" : "text-foreground/80"}`}>{m.from}</span>
                        <span className="shrink-0 text-[11px] text-muted-foreground">{m.time}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <Icon className="h-3 w-3 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                        <span className="truncate text-[12px] text-muted-foreground">{m.preview}</span>
                      </div>
                    </div>
                    {m.unread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Detail pane */}
          <div className="hidden flex-1 flex-col md:flex">
            {selectedMsg ? (
              <div className="flex flex-col p-6">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-[16px] font-semibold text-foreground">{selectedMsg.from}</h2>
                    <p className="mt-0.5 text-[12.5px] text-muted-foreground">via {selectedMsg.source} · {selectedMsg.time}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-lg border border-border bg-card px-3 py-2 text-[12.5px] font-medium text-foreground transition-colors hover:bg-secondary">Reply</button>
                    <button className="rounded-lg bg-brand px-3 py-2 text-[12.5px] font-semibold text-white shadow-sm transition-colors hover:bg-brand/90">Book In</button>
                  </div>
                </div>
                <div className="rounded-xl bg-secondary/50 p-4 text-[13.5px] leading-relaxed text-foreground">
                  {selectedMsg.preview}
                </div>
                <div className="mt-auto pt-6">
                  <textarea
                    placeholder="Type your reply..."
                    rows={3}
                    className="w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-[13px] placeholder:text-muted-foreground focus:border-foreground/20 focus:bg-card focus:outline-none resize-none"
                  />
                  <div className="mt-2 flex justify-end">
                    <button className="rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-brand/90">Send Reply</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center text-[13px] text-muted-foreground">
                Select a conversation to view
              </div>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
