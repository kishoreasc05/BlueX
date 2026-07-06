import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthedLayout,
});

function AuthedLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/signin", replace: true });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-accent-blue/5 via-accent-indigo/5 to-accent-purple/5 opacity-50 animate-gradient-mesh pointer-events-none" />
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-blue to-accent-indigo text-white text-lg font-bold shadow-lg shadow-accent-blue/20 animate-pulse">
            B
            <span className="absolute -inset-1.5 rounded-3xl bg-accent-blue/20 blur-md animate-ping duration-1000 pointer-events-none" />
          </div>
          <div className="mono-label text-[10px] font-mono tracking-widest text-muted-foreground/80 animate-pulse">
            Initializing workspace…
          </div>
        </div>
      </div>
    );
  }
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
