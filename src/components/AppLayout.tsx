import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home, FileText, Shield, Trophy, Wallet, BarChart3, Code, MessageCircle, Menu, X, Leaf
} from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/report", label: "Report", icon: FileText },
  { path: "/proof", label: "Proof of Impact", icon: Shield },
  { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { path: "/donor", label: "Donor Dashboard", icon: Wallet },
  { path: "/esg", label: "ESG Report", icon: BarChart3 },
  { path: "/api", label: "API Explorer", icon: Code },
  { path: "/community", label: "Community Hive", icon: MessageCircle },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 lg:translate-x-0 lg:static ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-2 p-5 border-b border-border">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Leaf className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-lg text-foreground">CivicLens</span>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-primary/10 text-primary glow-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-3 right-3">
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
            <p className="text-xs font-heading text-primary">Priority Alpha</p>
            <p className="text-xs text-muted-foreground mt-1">2 urgent missions nearby</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md px-4 py-3 flex items-center gap-3 lg:px-6">
          <button className="lg:hidden text-muted-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-muted-foreground font-body">Polygon Mumbai</span>
          </div>
        </header>
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
