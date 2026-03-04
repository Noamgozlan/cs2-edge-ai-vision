import { motion } from "framer-motion";
import { TeamLogo } from "@/lib/team-logos";
import { Zap, TrendingUp, Shield, Database } from "lucide-react";

const PredictionPreview = () => (
  <section id="predictions" className="py-28 bg-card/50 overflow-hidden relative">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(var(--primary)/0.04)_0%,_transparent_60%)] pointer-events-none" />

    <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block text-[11px] font-bold text-accent uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5">
            Live Preview
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            See the AI in <span className="text-primary">Action</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Real analysis output from our neural engine — updated in real-time with live HLTV data.
          </p>
        </motion.div>
      </div>

      {/* Preview card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-accent/40" />
                <div className="w-3 h-3 rounded-full bg-primary/40" />
              </div>
              <span className="text-[11px] font-bold text-muted-foreground">CS2 Edge AI — Match Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-accent" />
              <span className="text-[10px] font-bold text-accent">LIVE DATA</span>
            </div>
          </div>

          <div className="p-6 md:p-10">
            {/* Match header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <TeamLogo name="G2 Esports" size={44} />
                <div>
                  <p className="font-bold text-lg">G2 Esports</p>
                  <p className="text-xs text-muted-foreground">World #3</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-muted-foreground/30">VS</p>
                <p className="text-[10px] text-muted-foreground mt-1">IEM Katowice • Bo3</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-lg">FaZe Clan</p>
                  <p className="text-xs text-muted-foreground">World #4</p>
                </div>
                <TeamLogo name="FaZe Clan" size={44} />
              </div>
            </div>

            {/* Smart bet card */}
            <div className="rounded-xl p-5 mb-6" style={{
              background: "linear-gradient(135deg, hsl(var(--primary) / 0.1) 0%, hsl(var(--accent) / 0.05) 100%)",
              border: "1px solid hsl(var(--primary) / 0.2)",
            }}>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">AI Smart Bet — Both Win Map</span>
              </div>
              <p className="text-xl font-black mb-3">Both Teams to Win a Map (Yes) @ 1.88</p>
              <div className="flex items-center gap-6">
                <span className="text-sm font-bold text-primary">84% confidence</span>
                <span className="text-sm font-bold text-accent">EV: +16.2%</span>
              </div>
            </div>

            {/* Probability + Veto side by side */}
            <div className="grid md:grid-cols-2 gap-5">
              {/* Win probability */}
              <div className="rounded-xl border border-border p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold">Win Probability</span>
                </div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span>G2 — 52%</span>
                  <span className="text-primary">FaZe — 48%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-muted overflow-hidden flex">
                  <motion.div
                    className="h-full bg-primary rounded-l-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "52%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  />
                  <motion.div
                    className="h-full bg-muted-foreground/30 rounded-r-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "48%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-3">
                  m0NESY predicted 39+ kills — top fragger prop @ 1.83
                </p>
              </div>

              {/* Veto preview */}
              <div className="rounded-xl border border-border p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold">Predicted Veto</span>
                </div>
                <div className="space-y-2">
                  {[
                    { action: "ban", team: "G2", map: "Vertigo", color: "text-destructive bg-destructive/8 border-destructive/15" },
                    { action: "ban", team: "FaZe", map: "Anubis", color: "text-destructive bg-destructive/8 border-destructive/15" },
                    { action: "pick", team: "G2", map: "Inferno", color: "text-accent bg-accent/8 border-accent/15" },
                    { action: "pick", team: "FaZe", map: "Nuke", color: "text-accent bg-accent/8 border-accent/15" },
                  ].map((v, i) => (
                    <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs border ${v.color}`}>
                      <span className="font-bold uppercase tracking-wider">{v.team} {v.action}</span>
                      <span className="font-bold">{v.map}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default PredictionPreview;
