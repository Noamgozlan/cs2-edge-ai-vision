import { Link } from "react-router-dom";
import { Crosshair } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Crosshair className="h-5 w-5 text-primary" />
            <span className="font-display text-sm font-bold tracking-wider text-gradient">CS2 EDGE AI</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <Link to="/login" className="hover:text-foreground transition-colors">Login</Link>
            <Link to="/register" className="hover:text-foreground transition-colors">Register</Link>
            <span className="hover:text-foreground transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Privacy</span>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-muted-foreground">
          © 2026 CS2 Edge AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
