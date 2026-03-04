import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Crosshair, Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage, languages } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Crosshair className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-sm font-bold tracking-tight">CS2 EDGE AI</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.features")}</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.pricing")}</a>
          <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.testimonials")}</a>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-64 overflow-y-auto">
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
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">{t("nav.login")}</Link>
          </Button>
          <Button size="sm" className="bg-gradient-primary hover:opacity-90 transition-opacity text-primary-foreground" asChild>
            <Link to="/register">{t("nav.getStarted")}</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
