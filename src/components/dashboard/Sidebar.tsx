import {
  LayoutDashboard,
  Sparkles,
  CheckSquare,
  Calendar,
  Users,
  Inbox,
  Star,
  BarChart3,
  FileText,
  Target,
  Globe,
  Plug,
  Settings,
} from "lucide-react";
import { Logo } from "./Logo";
import { HealthScore } from "./HealthScore";

const nav = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "AI Coach", icon: Sparkles },
  { label: "Tasks", icon: CheckSquare },
  { label: "Calendar", icon: Calendar },
  { label: "Customers", icon: Users },
  { label: "Inbox", icon: Inbox, badge: 5 },
  { label: "Reviews", icon: Star },
  { label: "Analytics", icon: BarChart3 },
  { label: "Reports", icon: FileText },
  { label: "Goals", icon: Target },
  { label: "Website", icon: Globe },
  { label: "Integrations", icon: Plug },
  { label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card lg:flex">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="space-y-0.5">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <button
                  className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-all duration-150 ${
                    item.active
                      ? "bg-brand text-white shadow-sm"
                      : "text-foreground/80 hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      className={`h-[17px] w-[17px] ${item.active ? "" : "text-foreground/70"}`}
                      strokeWidth={1.75}
                    />
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1.5 text-[10px] font-semibold text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3">
        <HealthScore />
      </div>
    </aside>
  );
}
