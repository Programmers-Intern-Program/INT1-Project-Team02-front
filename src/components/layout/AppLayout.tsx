import { useQueryClient } from "@tanstack/react-query";
import { Bot, LayoutDashboard, ListChecks, LogOut } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../api/flodi";
import { CaptionPiPProvider } from "../../context/CaptionPiPContext";
import { cn } from "../../lib/utils";

const LAST_CHANNEL_DASHBOARD_URL_KEY = "flodi:lastChannelDashboardUrl";
const LAST_CHANNEL_DASHBOARD_URL_EVENT = "flodi:lastChannelDashboardUrlChanged";

const navItems = [
  { to: "/projects", label: "Projects", icon: ListChecks },
];

function getStoredDashboardUrl() {
  try {
    return localStorage.getItem(LAST_CHANNEL_DASHBOARD_URL_KEY);
  } catch {
    return null;
  }
}

function subscribeToDashboardUrlChange(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(LAST_CHANNEL_DASHBOARD_URL_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(LAST_CHANNEL_DASHBOARD_URL_EVENT, onStoreChange);
  };
}

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const storedDashboardUrl = useSyncExternalStore(subscribeToDashboardUrlChange, getStoredDashboardUrl, () => null);
  const isChannelDashboard = /^\/channels\/[^/]+\/dashboard$/.test(location.pathname);
  const currentDashboardUrl = isChannelDashboard ? `${location.pathname}${location.search}` : storedDashboardUrl;

  useEffect(() => {
    if (!isChannelDashboard) return;

    try {
      localStorage.setItem(LAST_CHANNEL_DASHBOARD_URL_KEY, `${location.pathname}${location.search}`);
      window.dispatchEvent(new Event(LAST_CHANNEL_DASHBOARD_URL_EVENT));
    } catch {
      // Ignore storage failures; the current page still works without the shortcut.
    }
  }, [isChannelDashboard, location.pathname, location.search]);

  async function handleLogout() {
    await logout();
    queryClient.clear();
    navigate("/login");
  }

  return (
    <CaptionPiPProvider>
      <div className="min-h-screen text-[#F8FAFC]">
        <header className="sticky top-0 z-10 border-b border-[#303049] bg-[#0B0B13]/92 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <Link
              to="/projects"
              className="flex items-center gap-2 font-semibold text-[#F8FAFC]"
            >
              <span className="flex size-8 items-center justify-center rounded-md bg-linear-to-br from-[#3B82F6] via-[#A78BFA] to-[#F9A8D4] text-white shadow-[0_0_20px_rgba(167,139,250,0.32)]">
                <Bot size={18} />
              </span>
              <span>FLODI</span>
            </Link>
            <nav className="flex items-center gap-1">
              {currentDashboardUrl && (
                <Link
                  to={currentDashboardUrl}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-[#CBD5E1] transition hover:bg-[#1B1B2A] hover:text-[#F8FAFC]",
                    isChannelDashboard &&
                      "bg-[#1B1B2A] text-[#F8FAFC] shadow-[inset_0_0_0_1px_rgba(167,139,250,0.12)]",
                  )}
                >
                  <LayoutDashboard size={16} />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              )}
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-[#CBD5E1] transition hover:bg-[#1B1B2A] hover:text-[#F8FAFC]",
                      isActive &&
                        "bg-[#1B1B2A] text-[#F8FAFC] shadow-[inset_0_0_0_1px_rgba(167,139,250,0.12)]",
                    )
                  }
                >
                  <item.icon size={16} />
                  <span className="hidden sm:inline">{item.label}</span>
                </NavLink>
              ))}
              <button
                onClick={() => void handleLogout()}
                className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-[#CBD5E1] transition hover:bg-[#1B1B2A] hover:text-[#F8FAFC]"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">로그아웃</span>
              </button>
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
