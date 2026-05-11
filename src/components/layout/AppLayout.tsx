import { Link, NavLink, Outlet } from "react-router-dom";
import { Bot, LayoutDashboard, ListChecks } from "lucide-react";
import { cn } from "../../lib/utils";
import { CaptionPiPProvider } from "../../context/CaptionPiPContext";

const navItems = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: ListChecks },
];

export function AppLayout() {
  return (
    <CaptionPiPProvider>
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-center gap-2 font-semibold text-slate-950">
              <span className="flex size-8 items-center justify-center rounded-md bg-slate-900 text-white"><Bot size={18} /></span>
              <span>Flodi</span>
            </Link>
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950",
                      isActive && "bg-slate-100 text-slate-950",
                    )
                  }
                >
                  <item.icon size={16} />
                  <span className="hidden sm:inline">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </CaptionPiPProvider>
  );
}
