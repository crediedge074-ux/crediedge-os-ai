export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand text-brand-foreground font-bold text-sm">
        C
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[15px] font-semibold tracking-tight text-white">
          CrediEdge
        </span>
        <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-white/90">
          OS
        </span>
      </div>
    </div>
  );
}
