import { Link } from "react-router-dom";
import { Zap, Mail, Wifi } from "lucide-react";

const Footer = () => (
  <footer className="bg-background py-24 border-t border-border/50">
    <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center rotate-45">
              <Zap className="w-4 h-4 -rotate-45 text-primary-foreground" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">
              CS2<span className="text-primary">EDGE</span>AI
            </span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
            The final word in CS2 competitive intelligence. Engineered for professionals, refined by machines.
          </p>
        </div>

        <div>
          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground mb-8">Intelligence</h5>
          <ul className="space-y-4">
            <li><Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Live Analytics</Link></li>
            <li><Link to="/dashboard/predictions" className="text-sm text-muted-foreground hover:text-primary transition-colors">Veto Modeling</Link></li>
            <li><Link to="/dashboard/odds" className="text-sm text-muted-foreground hover:text-primary transition-colors">Market Tracker</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground mb-8">Network</h5>
          <ul className="space-y-4">
            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">System Status</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Change Log</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground mb-8">Transmission</h5>
          <div className="flex gap-4">
            <a href="#" className="w-12 h-12 rounded border border-border bg-card flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
              <Mail className="w-5 h-5" />
            </a>
            <a href="#" className="w-12 h-12 rounded border border-border bg-card flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
              <Wifi className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="pt-12 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
          © 2025 EDGE AI TECHNOLOGIES. DEPLOYED IN NEURAL NETWORKS WORLDWIDE.
        </p>
        <div className="flex gap-8">
          <a href="#" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">Privacy Protocol</a>
          <a href="#" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">Terms of Engagement</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
