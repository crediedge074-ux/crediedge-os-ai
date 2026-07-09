import type { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNav } from "@/components/dashboard/TopNav";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="lg:pl-60 xl:pl-64">
        <TopNav />
        <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-7 xl:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
