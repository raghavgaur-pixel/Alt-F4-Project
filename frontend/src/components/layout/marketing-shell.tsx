import type { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function MarketingShell({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-slate-950/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <Link to="/" className="text-xl font-semibold text-cyan-300">
            QRGuard AI
          </Link>
          <div className="flex flex-wrap gap-3">
            {isAuthenticated ? (
              <Button asChild variant="outline">
                <Link to="/dashboard">Open Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-border bg-slate-950/30">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <div>© 2026 Alt F4 Team. All rights reserved.</div>
          <div className="flex flex-wrap gap-4">
            <Link to="/reports" className="transition hover:text-cyan-300">
              Community Reports
            </Link>
            <Link to={isAuthenticated ? "/dashboard" : "/register"} className="transition hover:text-cyan-300">
              {isAuthenticated ? "Dashboard" : "Start Scanning"}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
