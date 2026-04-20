import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-white/[0.06] bg-black/20 py-16 sm:py-20">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.5fr_0.75fr_0.75fr_0.75fr]">
        <div className="max-w-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[hsl(221,83%,58%)] text-white text-xs font-bold">
              C
            </div>
            <span className="font-landing-display text-sm text-white">CS2Edge</span>
          </div>
          <p className="mt-5 text-[13px] leading-6 text-white/[0.45]">
            Premium CS2 betting intelligence. Live match context, bookmaker comparison, and AI-driven conviction.
          </p>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/[0.30]">Product</p>
          <ul className="mt-4 space-y-3">
            <li><Link to="/dashboard" className="text-[13px] text-white/[0.55] transition-colors hover:text-white">Dashboard</Link></li>
            <li><Link to="/dashboard/predictions" className="text-[13px] text-white/[0.55] transition-colors hover:text-white">Predictions</Link></li>
            <li><Link to="/dashboard/matches" className="text-[13px] text-white/[0.55] transition-colors hover:text-white">Live Matches</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/[0.30]">Company</p>
          <ul className="mt-4 space-y-3">
            <li><a href="#features" className="text-[13px] text-white/[0.55] transition-colors hover:text-white">Features</a></li>
            <li><a href="#pricing" className="text-[13px] text-white/[0.55] transition-colors hover:text-white">Pricing</a></li>
            <li><Link to="/register" className="text-[13px] text-white/[0.55] transition-colors hover:text-white">Create Account</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/[0.30]">Legal</p>
          <ul className="mt-4 space-y-3">
            <li><a href="#" className="text-[13px] text-white/[0.55] transition-colors hover:text-white">Terms of Service</a></li>
            <li><a href="#" className="text-[13px] text-white/[0.55] transition-colors hover:text-white">Privacy Policy</a></li>
            <li><span className="text-[13px] text-white/[0.30]">Informational purposes only</span></li>
          </ul>
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-4 border-t border-white/[0.06] pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] text-white/[0.40]">© 2026 CS2Edge. All rights reserved.</p>
        <p className="text-[12px] text-white/[0.30]">Gamble responsibly. Always compare the lines before acting.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
