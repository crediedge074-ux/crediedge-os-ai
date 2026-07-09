import { LayoutDashboard, Sparkles, SquareCheck as CheckSquare, Calendar, Users, Inbox, Star, ChartBar as BarChart3, FileText, Target, Globe, Plug, Settings, Menu, X } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { HealthScore } from "./HealthScore";
import { useState } from "react";

const nav = [
  { label: "Command Centre", icon: LayoutDashboard, to: "/" },
  { label: "Business Advisor", icon: Sparkles, to: "/advisor" },
  { label: "Tasks", icon: CheckSquare, to: "/tasks" },
  { label: "Calendar", icon: Calendar, to: "/calendar" },
  { label: "Relationships", icon: Users, to: "/relationships" },
  { label: "Communications", icon: Inbox, to: "/communications", badge: 5 },
  { label: "Reviews", icon: Star, to: "/reviews" },
  { label: "Business Intelligence", icon: BarChart3, to: "/intelligence" },
  { label: "Insights", icon: FileText, to: "/insights" },
  { label: "Goals", icon: Target, to: "/goals" },
  { label: "Website", icon: Globe, to: "/website" },
  { label: "Integrations", icon: Plug, to: "/integrations" },
  { label: "Settings", icon: Settings, to: "/settings" },
];

export function Sidebar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavItem = ({ item }: { item: (typeof nav)[number] }) => {
    const isActive = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
    const Icon = item.icon;
    return (
      <li>
        <Link
          to={item.to}
          onClick={() => setMobileOpen(false)}
          className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-[12.5px] font-medium transition-all duration-150 xl:py-2 xl:text-[13px] ${
            isActive
              ? "bg-brand text-white shadow-sm"
              : "text-foreground/70 hover:bg-secondary hover:text-foreground"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <Icon
              className={`h-[15px] w-[15px] shrink-0 transition-transform duration-150 group-hover:scale-105 ${
                isActive ? "text-white" : "text-foreground/55"
              }`}
              strokeWidth={1.75}
            />
            {item.label}
          </span>
          {item.badge && !isActive && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
              {item.badge}
            </span>
          )}
        </Link>
      </li>
    );
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 grid h-8 w-8 place-items-center rounded-lg border border-border bg-card text-foreground shadow-soft lg:hidden"
      >
        <Menu className="h-4 w-4" strokeWidth={1.75} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-border bg-card transition-transform duration-200 lg:translate-x-0 xl:w-64 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-[60px] items-center justify-between border-b border-border px-4 xl:px-5">
          <Logo />
          <button
            onClick={() => setMobileOpen(false)}
            className="grid h-7 w-7 place-items-center rounded-lg text-foreground/50 transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2.5 py-2 xl:px-3">
          <ul className="space-y-0.5">
            {nav.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </ul>
        </nav>

        <div className="p-2.5 xl:p-3">
          <HealthScore />
        </div>
      </aside>
    </>
  );
}
