import React from "react";
import { Sparkles, Info, ShieldCheck } from "lucide-react";

export interface AIDisclosureProps {
  featureName: string;
  sourceStatus?: "connected" | "derived" | "estimated" | "inferred";
  description?: string;
}

export function AIDisclosure({
  featureName,
  sourceStatus = "connected",
  description,
}: AIDisclosureProps) {
  const badgeColors: Record<string, string> = {
    connected: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
    derived: "bg-blue-500/15 text-blue-700 border-blue-500/30",
    estimated: "bg-amber-500/15 text-amber-700 border-amber-500/30",
    inferred: "bg-purple-500/15 text-purple-700 border-purple-500/30",
  };

  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-3.5 text-[11.5px] leading-relaxed text-muted-foreground">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-foreground">
          <Sparkles className="h-3.5 w-3.5 text-brand" />
          <span>{featureName} Transparency & AI Governance</span>
        </div>
        <span
          className={`rounded-full border px-2 py-0.5 text-[9.5px] font-bold uppercase ${
            badgeColors[sourceStatus] || badgeColors.connected
          }`}
        >
          {sourceStatus} DATA
        </span>
      </div>

      <p className="text-[11px] text-muted-foreground">
        {description ||
          "Evaluated directly from genuine workspace database records. Requires explicit human review and confirmation before applying outbound changes."}
      </p>

      <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground/80 border-t border-border/50 pt-1.5">
        <ShieldCheck className="h-3 w-3 text-emerald-600" />
        <span>Strict workspace tenant isolation & zero fabricated data guarantee.</span>
      </div>
    </div>
  );
}
