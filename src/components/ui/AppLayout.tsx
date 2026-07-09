import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNav } from "@/components/dashboard/TopNav";
import { useAuthContext } from "@/contexts/AuthContext";

interface AppLayoutProps {
  children: ReactNode;
}

function AppSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-y-0 left-0 w-60 animate-pulse border-r border-border bg-card xl:w-64" />
      <div className="lg:pl-60 xl:pl-64">
        <div className="h-[60px] animate-pulse border-b border-border bg-card" />
        <div className="mx-auto max-w-[1600px] space-y-4 px-4 py-6 sm:px-6 lg:px-7 xl:px-8">
          <div className="h-24 animate-pulse rounded-2xl bg-secondary" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-secondary" />
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-2xl bg-secondary" />
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-48 animate-pulse rounded-2xl bg-secondary" />
            <div className="h-48 animate-pulse rounded-2xl bg-secondary" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  const { session, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      navigate({ to: "/login" });
    }
  }, [loading, session, navigate]);

  if (loading) return <AppSkeleton />;
  if (!session) return null;

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
