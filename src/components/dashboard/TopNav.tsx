import { Menu, Search, Bell, HelpCircle, ChevronDown } from "lucide-react";

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-5">
      <button className="grid h-9 w-9 place-items-center rounded-md text-foreground/70 transition hover:bg-secondary">
        <Menu className="h-5 w-5" strokeWidth={1.75} />
      </button>

      <div className="mx-auto w-full max-w-xl">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.75}
          />
          <input
            type="text"
            placeholder="Search anything..."
            className="h-9 w-full rounded-full border border-border bg-secondary/60 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/20 focus:bg-card focus:outline-none focus:ring-4 focus:ring-foreground/5"
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className="relative grid h-9 w-9 place-items-center rounded-md text-foreground/70 transition hover:bg-secondary hover:text-foreground">
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
          <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[9px] font-bold text-white">
            5
          </span>
        </button>
        <button className="grid h-9 w-9 place-items-center rounded-md text-foreground/70 transition hover:bg-secondary hover:text-foreground">
          <HelpCircle className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </button>
        <div className="mx-1 h-6 w-px bg-border" />
        <button className="flex items-center gap-2.5 rounded-lg px-1.5 py-1 transition hover:bg-secondary">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-[12px] font-semibold text-foreground">
            D
          </div>
          <div className="hidden text-left sm:block">
            <div className="text-[13px] font-semibold leading-tight text-foreground">Dom</div>
            <div className="text-[11px] leading-tight text-muted-foreground">Founder</div>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
