import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage, languages } from "@/contexts/LanguageContext";
import { Sun, Moon, Globe, Zap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center rotate-45 shadow-[0_0_20px_hsl(var(--primary)/0.4)]">
              <Zap className="w-5 h-5 -rotate-45 text-primary-foreground" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase ml-2 italic">
              CS2<span className="text-primary">EDGE</span>AI
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-10">
            <a href="#features" className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">
              Tactical Intel
            </a>
            <a href="#predictions" className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">
              Live Feed
            </a>
            <a href="#pricing" className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">
              The Vault
            </a>
            <div className="h-6 w-px bg-border" />

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

            <Link to="/login" className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
              Terminal Login
            </Link>
            <Link
              to="/register"
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-sm text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all hover:scale-105 active:scale-95"
            >
              Access Edge
            </Link>
          </nav>

          <button className="lg:hidden text-foreground">
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
