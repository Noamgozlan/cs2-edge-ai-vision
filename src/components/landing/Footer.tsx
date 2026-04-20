import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import gozlanLogo from "@/assets/gozlan-logo.png";

const Footer = () => (
  <footer className="border-t border-white/8 py-16 sm:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="landing-surface rounded-[32px] p-6 sm:p-8">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr_0.75fr_0.75fr]">
          <div className="max-w-md">
            <img src={gozlanLogo} alt="CS2Edge" className="h-12 w-auto" />
            <p className="mt-5 text-sm leading-7 text-white/60">
              Premium CS2 betting intelligence with live match context, bookmaker comparison, and AI-driven conviction built into every step.
            </p>
            <Link
              to="/register"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/8"
            >
              Launch your workspace
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/38">Product</p>
            <ul className="mt-5 space-y-3">
              <li><Link to="/dashboard" className="text-sm text-white/62 transition-colors hover:text-white">Dashboard</Link></li>
              <li><Link to="/dashboard/predictions" className="text-sm text-white/62 transition-colors hover:text-white">Predictions</Link></li>
              <li><Link to="/dashboard/matches" className="text-sm text-white/62 transition-colors hover:text-white">Matches</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/38">Resources</p>
            <ul className="mt-5 space-y-3">
              <li><a href="#features" className="text-sm text-white/62 transition-colors hover:text-white">Features</a></li>
              <li><a href="#workflow" className="text-sm text-white/62 transition-colors hover:text-white">How it works</a></li>
              <li><a href="#pricing" className="text-sm text-white/62 transition-colors hover:text-white">Pricing</a></li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/38">Company</p>
            <ul className="mt-5 space-y-3">
              <li><Link to="/login" className="text-sm text-white/62 transition-colors hover:text-white">Sign in</Link></li>
              <li><Link to="/register" className="text-sm text-white/62 transition-colors hover:text-white">Create account</Link></li>
              <li><span className="text-sm text-white/38">Predictions are informational only</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/8 pt-6 text-sm text-white/44 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 CS2Edge. All rights reserved.</p>
          <p>Gamble responsibly and always compare the number before you act.</p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
