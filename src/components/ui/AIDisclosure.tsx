import React, { useState } from "react";
import { Sparkles, Info, X, ShieldCheck } from "lucide-react";

interface AIDisclosureProps {
  className?: string;
  compact?: boolean;
}

export function AIDisclosure({ className = "", compact = false }: AIDisclosureProps) {
  const [open, setOpen] = useState(false);

  if (compact) {
    return (
      <div className={`relative inline-flex items-center text-[10.5px] font-medium text-muted-foreground ${className}`}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <Sparkles className="h-3 w-3 text-brand" />
          <span>AI Analysis Info</span>
          <Info className="h-3 w-3 text-muted-foreground/70" />
        </button>

        {open && (
          <div className="absolute right-0 top-6 z-50 w-72 rounded-xl border border-border bg-card p-3 shadow-2xl text-[11px] text-foreground space-y-1.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between font-bold border-b border-border/50 pb-1">
              <span className="flex items-center gap-1 text-brand">
                <ShieldCheck className="h-3.5 w-3.5" /> AI Guidance Principles
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-muted-foreground leading-snug">
              Insights are calculated from workspace data. AI models can occasionally make mistakes. Please verify actions against underlying financial and customer records.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-border/80 bg-secondary/30 p-3 space-y-1 text-[11.5px] ${className}`}>
      <div className="flex items-center justify-between font-bold text-foreground">
        <div className="flex items-center gap-1.5 text-brand">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Workspace AI Intelligence Disclosure</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="text-[10.5px] text-muted-foreground hover:underline font-normal"
        >
          {open ? "Hide Notice" : "Learn More"}
        </button>
      </div>

      <p className="text-muted-foreground leading-relaxed">
        AI recommendations and relationship scores are dynamically derived from your active workspace records. Data completeness affects analytical accuracy.
      </p>

      {open && (
        <div className="pt-2 border-t border-border/50 space-y-1 text-[11px] text-muted-foreground animate-in fade-in duration-150">
          <p>
            • <strong>Evidence Grounding:</strong> AI outputs interpret real signals in your workspace. Unverified projections are explicitly marked as estimates.
          </p>
          <p>
            • <strong>Review Advice:</strong> Always review customer and financial decisions with underlying workspace documents before acting.
          </p>
        </div>
      )}
    </div>
  );
}
