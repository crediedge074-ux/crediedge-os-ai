import type { LucideIcon } from "lucide-react";
import { Database } from "lucide-react";

interface InsufficientDataProps {
  description?: string;
  icon?: LucideIcon;
  className?: string;
}

export function InsufficientData({
  description = "There is not enough verified workspace data to show this yet.",
  icon: Icon = Database,
  className = "",
}: InsufficientDataProps) {
  return (
    <div className={`rounded-xl border border-dashed border-border bg-secondary/20 p-5 ${className}`}>
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">INSUFFICIENT DATA</div>
          <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
