import type { PropsWithChildren } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Community Reports", href: "/reports" }
];

export function AppShell({ children }: PropsWithChildren) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-slate-950/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-semibold text-cyan-300">
            AEGIS QR
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-900",
                    isActive && "bg-slate-900 text-cyan-300"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden text-right text-sm md:block">
              <div>{user?.email}</div>
              <div className="text-slate-400">Protected workspace</div>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}

