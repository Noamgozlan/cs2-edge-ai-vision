import { Link, useLocation } from "react-router-dom";
import { Crosshair, LayoutDashboard, Swords, Brain, BarChart3, Settings, Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage, languages } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TranslationKeys } from "@/i18n/translations";

const navItems: { titleKey: TranslationKeys; url: string; icon: typeof LayoutDashboard }[] = [
  { titleKey: "dash.dashboard", url: "/dashboard", icon: LayoutDashboard },
  { titleKey: "dash.matches", url: "/dashboard/matches", icon: Swords },
  { titleKey: "dash.predictions", url: "/dashboard/predictions", icon: Brain },
  { titleKey: "dash.oddsComparison", url: "/dashboard/odds", icon: BarChart3 },
  { titleKey: "dash.settings", url: "/dashboard/settings", icon: Settings },
];

const DashboardSidebar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();

  return (
    <aside className="w-64 min-h-screen border-r border-border bg-card/50 flex flex-col">
      <div className="p-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Crosshair className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-display text-xs font-bold tracking-tight">CS2 EDGE AI</span>
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
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {t(item.titleKey)}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
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
      </div>
    </aside>
  );
};

export default DashboardSidebar;
