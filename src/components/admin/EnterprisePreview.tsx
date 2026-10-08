import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { ArrowLeft, Building2, Users, CreditCard, Package, Sparkles, ShieldAlert, Palette, Globe, ArrowRight, Loader2, CircleCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { submitEnterpriseLead } from "@/services/adminLeads";

const features = [
  { icon: Building2, title: "Manage Every Business", description: "View and manage all businesses, subscriptions, and users from one control plane." },
  { icon: CreditCard, title: "Control Subscriptions", description: "Change plans, manage pricing, and monitor billing status across your organisation." },
  { icon: Package, title: "Manage Feature Access", description: "Enable or disable features per plan or per business with granular overrides." },
  { icon: Sparkles, title: "Monitor AI Usage", description: "Central view of AI credit allocation, consumption, and usage by feature and business." },
  { icon: Users, title: "User Management", description: "Manage users, roles, and access across your entire organisation." },
  { icon: ShieldAlert, title: "Enterprise Security", description: "Audit logging, role-based access control, and platform-level security configuration." },
  { icon: Palette, title: "White-Label Branding", description: "Custom brand name, logo, colours, and domain for your enterprise deployment." },
  { icon: Globe, title: "Reseller Capabilities", description: "Resell CrediEdgeOS with your own branding, customers, and pricing structure." },
];

export function EnterprisePreview() {
  const { user, profile, business } = useAuthContext();
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);

  const handleSubmit = async () => {
    if (!user?.id) return;
    setSubmitting(true); setResult(null);
    const res = await submitEnterpriseLead({
      userId: user.id,
      businessId: business?.id || undefined,
      userEmail: user.email,
      userName: profile?.full_name || undefined,
      businessName: business?.name || undefined,
      message: message.trim() || undefined,
    });
    setResult(res);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 px-4 backdrop-blur-sm sm:px-6">
        <div className="flex h-[60px] items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/CE_OS_LOGO.png" alt="CrediEdgeOS" className="h-8 w-auto max-w-[140px] object-contain" />
            <div className="text-[10px] font-bold uppercase tracking-widest text-brand">Enterprise</div>
          </div>
          <Link to="/" className="inline-flex items-center gap-2 text-[12.5px] font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to CrediEdgeOS
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6">
        {/* Hero */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand">
            <Sparkles className="h-3 w-3" /> Enterprise
          </div>
          <h1 className="mt-4 text-[32px] font-bold tracking-tight text-foreground lg:text-[40px]">
            Unlock the CrediEdgeOS Admin Console
          </h1>
          <p className="mt-3 max-w-xl mx-auto text-[15px] leading-relaxed text-muted-foreground">
            Enterprise customers get a platform-level control plane to manage businesses, users, subscriptions, features, AI credits, and security — all from one place.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-foreground/15">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                <feature.icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-3 text-[14px] font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl border border-border bg-foreground p-8 text-center text-background shadow-card">
          <h2 className="text-[22px] font-bold tracking-tight">Talk to CrediEdgeOS</h2>
          <p className="mt-2 text-[13px] text-background/65">Request Enterprise access and our team will get in touch to set up your admin control plane.</p>

          {result?.success ? (
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500/15 px-5 py-3 text-[14px] font-semibold text-emerald-400">
              <CircleCheck className="h-5 w-5" />
              Your Enterprise access request has been submitted. We'll be in touch.
            </div>
          ) : (
            <>
              {result?.error && <div className="mt-4 rounded-lg bg-brand/15 px-4 py-2 text-[12px] font-medium text-brand">{result.error}</div>}
              <div className="mt-6 mx-auto max-w-md">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your organisation and what you need..."
                  rows={3}
                  className="w-full rounded-xl border border-background/15 bg-background/5 px-4 py-3 text-[13px] text-background placeholder:text-background/40 focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
                <button
                  onClick={() => void handleSubmit()}
                  disabled={submitting}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-[14px] font-bold text-white transition-all hover:bg-brand/90 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  Request Enterprise Access
                </button>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 text-center text-[11px] text-muted-foreground">
          Your request is associated with your CrediEdgeOS account and business workspace. We do not share your information.
        </div>
      </main>
    </div>
  );
}
