import type { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Footer } from "./footer";

export function MarketingShell({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="text-xl font-bold text-cyan-300">
          AEGIS QR
        </Link>
        <div className="flex gap-3">
          {isAuthenticated ? (
            <Button asChild variant="outline" className="border-cyan-400/20 text-cyan-400 hover:bg-cyan-400/10">
              <Link to="/dashboard">Open Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </header>
      <main>{children}</main>
      <Footer />
    </div>
  );
}
