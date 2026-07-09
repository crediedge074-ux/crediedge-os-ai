import logoAsset from "@/assets/crediedge-logo.png.asset.json";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={logoAsset.url}
        alt="CrediEdge"
        className="h-9 w-auto shrink-0 object-contain"
      />
      <span className="rounded-md bg-foreground px-1.5 py-0.5 text-[9.5px] font-bold tracking-wider text-background">
        OS
      </span>
    </div>
  );
}
