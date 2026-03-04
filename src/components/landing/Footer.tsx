import { Link } from "react-router-dom";
import gozlanLogo from "@/assets/gozlan-logo.png";

const Footer = () => (
  <footer className="bg-card/50 py-16 border-t border-border/50">
    <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-2 md:col-span-1">
          <div className="mb-4">
            <img src={gozlanLogo} alt="Gozlan BETS" className="h-9 w-auto" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            AI-powered CS2 betting intelligence. Real data, smart predictions, better results.
          </p>
        </div>

        <div>
          <h5 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">Product</h5>
          <ul className="space-y-3">
            <li><Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Dashboard</Link></li>
            <li><Link to="/dashboard/predictions" className="text-sm text-muted-foreground hover:text-primary transition-colors">Predictions</Link></li>
            <li><Link to="/dashboard/odds" className="text-sm text-muted-foreground hover:text-primary transition-colors">Odds Comparison</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">Company</h5>
          <ul className="space-y-3">
            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Changelog</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">Legal</h5>
          <ul className="space-y-3">
            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</a></li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground">
          © 2026 Gozlan BETS. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground">
          Predictions are for informational purposes only. Please gamble responsibly.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
