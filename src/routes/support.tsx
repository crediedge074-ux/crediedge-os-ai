import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { HelpCircle, Mail, Send, Info } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";

export const Route = createFileRoute("/support")({
  component: SupportPage,
});

function SupportPage() {
  const { profile, user } = useAuthContext();
  const defaultName = profile?.full_name ?? "";
  const defaultEmail = user?.email ?? "";

  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  return (
    <AppLayout>
      <PageHeader
        title="Support"
        description="Need help with CrediEdgeOS? Send us a message and we'll get back to you."
        crumbs={[{ label: "Support" }]}
      />

      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
              <HelpCircle className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-foreground">Contact Support</h2>
              <p className="text-[12.5px] text-muted-foreground">Submit a ticket directly to the CrediEdgeOS engineering team.</p>
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dom Weglarz"
                  className="h-[38px] w-full rounded-xl border border-border bg-secondary/30 px-3 text-[13px] text-foreground focus:border-foreground/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dom@example.com"
                  className="h-[38px] w-full rounded-xl border border-border bg-secondary/30 px-3 text-[13px] text-foreground focus:border-foreground/20 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="How can we help?"
                className="h-[38px] w-full rounded-xl border border-border bg-secondary/30 px-3 text-[13px] text-foreground focus:border-foreground/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">Message</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your question or issue in detail..."
                className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-[13px] text-foreground focus:border-foreground/20 focus:outline-none resize-none"
              />
            </div>

            <div className="rounded-xl border border-brand/20 bg-brand/5 p-3.5 flex items-start gap-2.5">
              <Info className="h-4 w-4 shrink-0 text-brand mt-0.5" />
              <div className="text-[11.5px] leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Direct Webhook Integration Coming Soon:</span> Online ticket submission is currently in preview. To contact support immediately, please reach out via email below.
              </div>
            </div>

            <button
              type="button"
              disabled
              className="flex h-[40px] w-full items-center justify-center gap-2 rounded-xl bg-brand/50 px-5 text-[13px] font-semibold text-white/80 cursor-not-allowed"
            >
              <Send className="h-3.5 w-3.5" />
              Send Message (Coming Soon)
            </button>
          </form>
        </div>

        {/* Secondary Contact Option */}
        <div className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-foreground/70">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-foreground">Email Support</div>
              <div className="text-[11.5px] text-muted-foreground">For urgent system inquiries and account assistance.</div>
            </div>
          </div>
          <a
            href="mailto:support@crediedge.ai"
            className="rounded-xl border border-border bg-secondary/50 px-3.5 py-2 text-[12px] font-semibold text-foreground hover:bg-secondary"
          >
            support@crediedge.ai
          </a>
        </div>
      </div>
    </AppLayout>
  );
}
