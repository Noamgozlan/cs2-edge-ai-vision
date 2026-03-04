import { Link, useLocation } from "react-router-dom";
import { Crosshair, LayoutDashboard, Swords, Brain, BarChart3, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Matches", url: "/dashboard/matches", icon: Swords },
  { title: "Predictions", url: "/dashboard/predictions", icon: Brain },
  { title: "Odds Comparison", url: "/dashboard/odds", icon: BarChart3 },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

const DashboardSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen border-r border-border/50 bg-card/50 flex flex-col">
      <div className="p-4 border-b border-border/50">
        <Link to="/" className="flex items-center gap-2">
          <Crosshair className="h-5 w-5 text-primary" />
          <span className="font-display text-sm font-bold tracking-wider text-gradient">CS2 EDGE AI</span>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? "bg-primary/10 text-primary font-medium border-glow border"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
