import type { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function MarketingShell({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="text-xl font-semibold text-cyan-300">
          AEGIS QR
        </Link>
        <div className="flex gap-3">
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
      </header>
      <main>{children}</main>
    </div>
  );
}

