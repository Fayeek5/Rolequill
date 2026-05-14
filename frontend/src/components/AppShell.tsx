import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContextValue";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Profile", path: "/profile" },
  { label: "ATS", path: "/ats" },
  { label: "LaTeX", path: "/latex" },
  { label: "Freelance", path: "/freelance" },
  { label: "Network", path: "/network" },
  { label: "Tracker", path: "/tracker" },
  { label: "Saved", path: "/saved" },
  { label: "Alerts", path: "/notifications" },
  { label: "Settings", path: "/settings" },
];

type Props = {
  children: ReactNode;
};

function AppShell({ children }: Props) {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  return (
    <main className="min-h-screen bg-[#080a0f] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.16),transparent_24%),radial-gradient(circle_at_82%_8%,rgba(244,114,182,0.12),transparent_22%),linear-gradient(135deg,rgba(15,23,42,0.88),rgba(2,6,23,0.96))]" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-5 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#080a0f]/85 py-3 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <button
              onClick={() => navigate("/")}
              className="w-fit text-left"
              aria-label="Go to home"
            >
              <span className="block text-2xl font-black tracking-normal text-white">
                Rolequill
              </span>
              <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
                Write your next role
              </span>
            </button>

            <nav className="flex flex-wrap gap-1 rounded-lg border border-white/10 bg-white/[0.04] p-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    [
                      "whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold transition",
                      isActive
                        ? "bg-white text-slate-950"
                        : "text-slate-300 hover:bg-white/10 hover:text-white",
                    ].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-slate-100">
                  {user?.name}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {user?.email || user?.phone}
                </p>
              </div>
              <button
                onClick={() => {
                  signOut();
                  navigate("/login", { replace: true });
                }}
                className="rounded-md border border-white/10 px-3 py-2 text-xs font-black text-slate-200 hover:bg-white/10"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {children}
      </div>
    </main>
  );
}

export default AppShell;
