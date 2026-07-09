import { Sparkles, Bell, Circle as HelpCircle, ChevronDown, Menu } from "lucide-react";

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 flex h-[60px] items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur-sm sm:px-6">
      <button className="grid h-8 w-8 place-items-center rounded-lg text-foreground/60 transition-colors duration-150 hover:bg-secondary hover:text-foreground lg:hidden">
        <Menu className="h-4.5 w-4.5" strokeWidth={1.75} />
      </button>

      <div className="mx-auto w-full max-w-lg">
        <div className="relative">
          <Sparkles
            className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand"
            strokeWidth={1.75}
          />
          <input
            type="text"
            placeholder="Ask anything about your business..."
            className="h-[34px] w-full rounded-full border border-border bg-secondary/50 pl-9 pr-4 text-[12.5px] text-foreground placeholder:text-muted-foreground/70 transition-all duration-200 focus:border-foreground/20 focus:bg-card focus:outline-none focus:ring-3 focus:ring-foreground/5"
          />
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        <button className="relative grid h-8 w-8 place-items-center rounded-lg text-foreground/60 transition-colors duration-150 hover:bg-secondary hover:text-foreground">
          <Bell className="h-[17px] w-[17px]" strokeWidth={1.75} />
          <span className="absolute right-1 top-1 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-brand px-0.5 text-[8px] font-bold text-white">
            5
          </span>
        </button>
        <button className="grid h-8 w-8 place-items-center rounded-lg text-foreground/60 transition-colors duration-150 hover:bg-secondary hover:text-foreground">
          <HelpCircle className="h-[17px] w-[17px]" strokeWidth={1.75} />
        </button>
        <div className="mx-1.5 h-5 w-px bg-border" />
        <button className="flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors duration-150 hover:bg-secondary">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
            D
          </div>
          <div className="hidden text-left sm:block">
            <div className="text-[12.5px] font-semibold leading-tight text-foreground">Dom</div>
            <div className="text-[10.5px] leading-tight text-muted-foreground">Founder</div>
          </div>
          <ChevronDown className="h-3 w-3 text-muted-foreground" strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
