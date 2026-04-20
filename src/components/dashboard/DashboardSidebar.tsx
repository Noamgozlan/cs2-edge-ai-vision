import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Swords, Brain, BarChart3, Settings,
  Sun, Moon, Globe, Crown, CircleDollarSign, Target,
  CheckCircle2, Wallet, CalendarDays, ChevronDown
} from "lucide-react";
import gozlanLogo from "@/assets/gozlan-logo.png";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage, languages } from "@/contexts/LanguageContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TranslationKeys } from "@/i18n/translations";
import { motion } from "framer-motion";

const navItems: { titleKey: TranslationKeys; url: string; icon: typeof LayoutDashboard; badge?: string }[] = [
  { titleKey: "dash.dashboard", url: "/dashboard", icon: LayoutDashboard },
  { titleKey: "dash.todaysMatches", url: "/dashboard/todays-matches", icon: CalendarDays },
  { titleKey: "dash.matches", url: "/dashboard/matches", icon: Swords },
  { titleKey: "dash.predictions", url: "/dashboard/predictions", icon: Brain },
  { titleKey: "dash.oddsComparison", url: "/dashboard/odds", icon: BarChart3 },
  { titleKey: "dash.demoBetting", url: "/dashboard/demo-betting", icon: CircleDollarSign },
  { titleKey: "dash.betTracker", url: "/dashboard/bet-tracker", icon: Target },
  { titleKey: "dash.bankroll", url: "/dashboard/bankroll", icon: Wallet },
  { titleKey: "dash.settings", url: "/dashboard/settings", icon: Settings },
];

const navGroups = [
  {
    label: "Intelligence",
    items: navItems.slice(0, 4),
  },
  {
    label: "Betting",
    items: navItems.slice(4, 8),
  },
  {
    label: "Preferences",
    items: navItems.slice(8),
  },
];

const DashboardSidebar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const { isPro, openCheckout, openPortal } = useSubscription();

  const isActive = (url: string) => {
    if (url === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(url);
  };

  return (
    <aside className="w-[240px] h-screen flex flex-col bg-sidebar border-r border-sidebar-border overflow-hidden">
      <div className="h-[57px] flex items-center px-5 border-b border-sidebar-border flex-shrink-0">
        <Link to="/" className="flex items-center">
          <img src={gozlanLogo} alt="Gozlan BETS" className="h-8 w-auto object-contain" />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-hide py-4 px-3">
        {navGroups.map((group, gi) => (
          <div key={group.label} className={gi > 0 ? "mt-6" : ""}>
            <p className="text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-[0.12em] px-2 mb-1.5">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.url);
                return (
                  <Link key={item.url} to={item.url} className="block">
                    <div
                      className={`relative flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-all duration-150 ${
                        active
                          ? "bg-sidebar-accent text-sidebar-foreground"
                          : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
                      }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-primary"
                          transition={{ type: "spring", stiffness: 400, damping: 35 }}
                        />
                      )}
                      <item.icon
                        className={`h-4 w-4 flex-shrink-0 ${active ? "text-primary" : ""}`}
                        strokeWidth={active ? 2 : 1.75}
                      />
                      <span>{t(item.titleKey as any)}</span>
                      {item.badge && (
                        <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 mb-3">
        <div className={`rounded-md p-3.5 ${
          isPro
            ? "bg-accent/8 border border-accent/15"
            : "bg-primary/5 border border-primary/15"
        }`}>
          {isPro ? (
            <>
              <div className="flex items-center gap-2 mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                <span className="text-[11px] font-semibold text-accent">Pro Active</span>
              </div>
              <p className="text-[11px] text-sidebar-foreground/50 mb-2.5">Full access enabled.</p>
              <button
                onClick={openPortal}
                className="w-full py-1.5 rounded text-[11px] font-medium text-sidebar-foreground/70 bg-sidebar-accent hover:bg-sidebar-accent/80 transition-colors"
              >
                Manage Subscription
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1.5">
                <Crown className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px] font-semibold text-sidebar-foreground">Upgrade to Pro</span>
              </div>
              <p className="text-[11px] text-sidebar-foreground/50 mb-2.5">Unlock full AI analysis & all features.</p>
              <button
                onClick={openCheckout}
                className="w-full py-1.5 rounded text-[11px] font-semibold text-white bg-primary hover:bg-primary/90 transition-colors pressable"
              >
                Get Pro
              </button>
            </>
          )}
        </div>
      </div>

      <div className="px-3 pb-4 border-t border-sidebar-border pt-3 flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={toggleTheme}
        >
          {theme === "dark"
            ? <Sun className="h-3.5 w-3.5" />
            : <Moon className="h-3.5 w-3.5" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Globe className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="max-h-64 overflow-y-auto">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={language === lang.code ? "bg-primary/8 text-primary font-medium" : ""}
              >
                {lang.nativeName}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="ml-auto text-[10px] text-sidebar-foreground/25 font-mono-data">v2.1</span>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
