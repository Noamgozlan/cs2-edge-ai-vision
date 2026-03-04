import { Link } from "react-router-dom";
import { Crosshair } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border py-12">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Crosshair className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-display text-sm font-bold tracking-tight">CS2 EDGE AI</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">{t("nav.features")}</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">{t("nav.pricing")}</a>
            <Link to="/login" className="hover:text-foreground transition-colors">{t("nav.login")}</Link>
            <Link to="/register" className="hover:text-foreground transition-colors">{t("nav.getStarted")}</Link>
            <span className="hover:text-foreground transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Privacy</span>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-muted-foreground">{t("footer.rights")}</div>
      </div>
    </footer>
  );
};

export default Footer;
