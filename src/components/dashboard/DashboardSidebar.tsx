import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Swords, Brain, BarChart3, Settings, Sun, Moon, Globe, ChevronRight, Crown, CircleDollarSign, Target, CheckCircle2, Wallet, CalendarDays } from "lucide-react";
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
  { titleKey: "dash.todaysMatches", url: "/dashboard/todays-matches", icon: CalendarDays, badge: "NEW" },
  { titleKey: "dash.matches", url: "/dashboard/matches", icon: Swords, badge: "LIVE" },
  { titleKey: "dash.predictions", url: "/dashboard/predictions", icon: Brain },
  { titleKey: "dash.oddsComparison", url: "/dashboard/odds", icon: BarChart3 },
  { titleKey: "dash.demoBetting", url: "/dashboard/demo-betting", icon: CircleDollarSign },
  { titleKey: "dash.betTracker", url: "/dashboard/bet-tracker", icon: Target, badge: "NEW" },
  { titleKey: "dash.bankroll", url: "/dashboard/bankroll", icon: Wallet },
  { titleKey: "dash.settings", url: "/dashboard/settings", icon: Settings },
];

const DashboardSidebar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const { isPro, openCheckout, openPortal } = useSubscription();

  return (
    <aside className="w-64 min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, hsl(var(--sidebar-background)) 0%, hsl(var(--sidebar-background) / 0.95) 100%)`,
      }}
    >
      {/* Subtle glow accent at top */}
      <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(ellipse at 30% 0%, hsl(199 90% 55% / 0.2) 0%, transparent 70%)',
        }}
      />

      {/* Border line with gradient */}
      <div className="absolute top-0 right-0 bottom-0 w-px"
        style={{
          background: 'linear-gradient(180deg, hsl(199 90% 55% / 0.3) 0%, hsl(var(--border)) 30%, hsl(var(--border)) 70%, transparent 100%)',
        }}
      />

      {/* Logo */}
      <div className="p-4 pb-6 pt-5 relative z-10">
        <Link to="/" className="flex items-center group">
          <img src={gozlanLogo} alt="Gozlan BETS" className="h-12 w-auto object-contain" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 relative z-10">
        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] px-3 mb-3">
          {t("dash.commandCenter" as any)}
        </p>
        {navItems.map((item) => {
          const active = location.pathname === item.url ||
            (item.url !== "/dashboard" && location.pathname.startsWith(item.url));
          const isExactDashboard = item.url === "/dashboard" && location.pathname === "/dashboard";
          const isActive = isExactDashboard || (item.url !== "/dashboard" && active);

          return (
            <Link
              key={item.url}
              to={item.url}
              className="relative block"
            >
              <motion.div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all relative ${
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                {/* Active background */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, hsl(199 90% 55% / 0.12) 0%, hsl(199 90% 55% / 0.06) 100%)',
                      border: '1px solid hsl(199 90% 55% / 0.15)',
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-primary shadow-[0_0_8px_hsl(199_90%_55%/0.6)]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                <item.icon className={`h-4 w-4 relative z-10 ${isActive ? "text-primary" : ""}`} />
                <span className="relative z-10">{t(item.titleKey as any)}</span>

                {item.badge && (
                  <span className="ml-auto relative z-10 px-1.5 py-0.5 rounded text-[9px] font-black bg-accent/15 text-accent border border-accent/20 animate-pulse">
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <ChevronRight className="ml-auto h-3 w-3 text-primary/50 relative z-10" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 mb-3 relative z-10">
        <div className="rounded-xl p-4 relative overflow-hidden"
          style={{
            background: isPro
              ? 'linear-gradient(135deg, hsl(160 60% 45% / 0.12) 0%, hsl(199 90% 55% / 0.08) 100%)'
              : 'linear-gradient(135deg, hsl(199 90% 55% / 0.1) 0%, hsl(270 80% 60% / 0.08) 100%)',
            border: isPro
              ? '1px solid hsl(160 60% 45% / 0.2)'
              : '1px solid hsl(199 90% 55% / 0.15)',
          }}
        >
          <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, hsl(199 90% 55% / 0.15) 0%, transparent 70%)',
            }}
          />
          {isPro ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold text-accent">{t("settings.proActive" as any)}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                {t("settings.fullAccess" as any)}
              </p>
              <button
                onClick={openPortal}
                className="w-full py-2 rounded-lg text-[11px] font-bold text-foreground bg-muted hover:bg-muted/80 transition-all"
              >
                {t("settings.manageSubscription" as any)}
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-foreground">{t("settings.proPlan" as any)}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                {t("settings.unlockFeatures" as any)}
              </p>
              <button
                onClick={openCheckout}
                className="w-full py-2 rounded-lg text-[11px] font-bold text-primary-foreground bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all shadow-md shadow-primary/20"
              >
                {t("predictions.upgradePro" as any)}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Footer controls */}
      <div className="px-3 pb-4 relative z-10">
        <div className="flex items-center gap-1 px-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50">
                <Globe className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="max-h-64 overflow-y-auto">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={language === lang.code ? "bg-primary/10 text-primary" : ""}
                >
                  {lang.nativeName}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="ml-auto text-[10px] text-muted-foreground/40 font-mono">v2.1</span>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
