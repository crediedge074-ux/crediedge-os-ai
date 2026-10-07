import React from "react";
import { Sparkles, Info } from "lucide-react";

interface AIDisclosureProps {
  featureName: string;
  dataDependencies: string[];
  limitations: string[];
}

export function AIDisclosure({
  featureName,
  dataDependencies,
  limitations,
}: AIDisclosureProps) {
  return (
    <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/70 text-xs text-slate-400 space-y-2">
      <div className="flex items-center gap-1.5 font-medium text-slate-300">
        <Sparkles className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
        <span>AI Governance & Data Provenance — {featureName}</span>
      </div>
      <div className="space-y-1 text-[11px] leading-relaxed">
        <p>
          <strong className="text-slate-300">Data Dependencies:</strong>{" "}
          {dataDependencies.join(", ")}
        </p>
        <p>
          <strong className="text-slate-300">Limitations & Safeguards:</strong>{" "}
          {limitations.join(" ")}
        </p>
      </div>
    </div>
  );
}
