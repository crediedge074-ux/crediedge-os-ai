import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { signIn, signUp } from "@/services/auth";
import { Logo } from "@/components/dashboard/Logo";
import { Sparkles, ArrowRight, TriangleAlert as AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { session, loading } = useAuthContext();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"in" | "up">("in");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session) {
      navigate({ to: "/" });
    }
  }, [loading, session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (tab === "in") {
        await signIn(email, password);
      } else {
        if (!fullName.trim()) {
          setError("Please enter your full name.");
          setSubmitting(false);
          return;
        }
        await signUp(email, password, fullName.trim());
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-brand" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left brand panel — hidden on mobile */}
      <div className="relative hidden w-[440px] shrink-0 flex-col justify-between overflow-hidden bg-foreground p-10 lg:flex xl:w-[480px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,oklch(0.585_0.223_27.5/0.15),transparent_60%)]" />

        <div className="relative">
          <Logo className="brightness-0 invert" />
        </div>

        <div className="relative space-y-8">
          <div>
            <h1 className="text-[32px] font-bold leading-tight text-white">
              The AI operating<br />system for your<br />business.
            </h1>
            <p className="mt-4 text-[14px] leading-relaxed text-white/55">
              Revenue intelligence, customer DNA, AI discoveries and task automation — all in one place.
            </p>
          </div>

          <div className="space-y-3">
            {[
              "Real-time business intelligence",
              "AI-powered insights and discovery",
              "Automated briefings and reports",
              "Customer relationship DNA",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2.5">
                <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand/20">
                  <Sparkles className="h-3 w-3 text-brand" strokeWidth={1.75} />
                </div>
                <span className="text-[13px] text-white/70">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-[11px] text-white/25">
          © {new Date().getFullYear()} CrediEdge. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <div className="mb-7">
            <h2 className="text-[22px] font-bold text-foreground">
              {tab === "in" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {tab === "in"
                ? "Sign in to continue to CrediEdgeOS."
                : "Start your AI business operating system today."}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="mb-6 flex rounded-xl border border-border bg-secondary/50 p-1">
            {(["in", "up"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(null); }}
                className={`flex-1 rounded-lg py-2 text-[13px] font-semibold transition-all duration-150 ${
                  tab === t
                    ? "bg-card text-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "in" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "up" && (
              <div>
                <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Dom Crediedge"
                  required
                  className="h-[42px] w-full rounded-xl border border-border bg-secondary/30 px-3.5 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-foreground/20 focus:bg-card focus:outline-none focus:ring-3 focus:ring-foreground/5"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="h-[42px] w-full rounded-xl border border-border bg-secondary/30 px-3.5 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-foreground/20 focus:bg-card focus:outline-none focus:ring-3 focus:ring-foreground/5"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[12.5px] font-medium text-muted-foreground">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete={tab === "in" ? "current-password" : "new-password"}
                className="h-[42px] w-full rounded-xl border border-border bg-secondary/30 px-3.5 text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:border-foreground/20 focus:bg-card focus:outline-none focus:ring-3 focus:ring-foreground/5"
              />
              {tab === "up" && (
                <p className="mt-1 text-[11px] text-muted-foreground">Minimum 6 characters.</p>
              )}
            </div>

            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" strokeWidth={1.75} />
                <p className="text-[12.5px] text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex h-[42px] w-full items-center justify-center gap-2 rounded-xl bg-brand text-[13px] font-semibold text-white shadow-sm transition-opacity hover:opacity-85 disabled:opacity-60"
            >
              {submitting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  {tab === "in" ? "Sign In" : "Create Account"}
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[12.5px] text-muted-foreground">
            {tab === "in" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => { setTab(tab === "in" ? "up" : "in"); setError(null); }}
              className="font-semibold text-brand hover:underline"
            >
              {tab === "in" ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
