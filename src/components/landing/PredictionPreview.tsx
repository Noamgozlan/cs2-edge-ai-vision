import { motion } from "framer-motion";
import { TeamLogo } from "@/lib/team-logos";

const PredictionPreview = () => (
  <section id="predictions" className="py-32 bg-card overflow-hidden relative">
    <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_right,_hsl(var(--primary)/0.05)_0%,_transparent_60%)] pointer-events-none" />

    <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-destructive text-[11px] font-black uppercase tracking-[0.5em] mb-4">
          Live Analysis Feed
        </h2>
        <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
          Live Broadcast Overlay
        </h3>
      </div>

      {/* Broadcast Panel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative"
      >
        <div className="relative z-10 rounded-xl overflow-hidden border border-border bg-card/80 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col xl:flex-row">
            {/* Left: Map View Placeholder */}
            <div className="xl:w-2/5 relative min-h-[300px] md:min-h-[400px] bg-muted/30">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)/0.05)_0%,_transparent_70%)]" />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
              {/* Live badge */}
              <div className="absolute top-8 left-8">
                <div className="flex items-center gap-3 bg-destructive px-4 py-1.5 rounded-sm text-[10px] font-black tracking-widest uppercase italic text-destructive-foreground">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Live Feed // Analysis Active
                </div>
              </div>
              {/* Faux map grid */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: "repeating-linear-gradient(0deg, hsl(var(--foreground)) 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, hsl(var(--foreground)) 0px, transparent 1px, transparent 40px)",
              }} />
            </div>

            {/* Right: Analysis */}
            <div className="xl:w-3/5 p-8 md:p-16 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-8 text-muted-foreground font-bold text-[11px] tracking-widest uppercase">
                <span>ESL Pro League Season 19</span>
                <span className="text-primary">•</span>
                <span>Grand Final • Map 3 (Anubis)</span>
              </div>

              {/* VS */}
              <div className="flex items-center justify-between mb-14">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-muted/50 border border-border rounded-full flex items-center justify-center p-4">
                    <TeamLogo name="M80" size={56} />
                  </div>
                  <span className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">M80</span>
                </div>
                <span className="text-muted-foreground/20 text-5xl md:text-6xl font-black italic select-none">VS</span>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/10 border border-primary rounded-full flex items-center justify-center p-4 shadow-[0_0_30px_hsl(var(--primary)/0.2)]">
                    <TeamLogo name="Team Liquid" size={56} />
                  </div>
                  <span className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-primary">Liquid</span>
                </div>
              </div>

              {/* Broadcast Overlay */}
              <div className="rounded-lg bg-primary/5 border-l-4 border-primary p-6 md:p-8 mb-10">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1">Win Probability</p>
                    <h4 className="text-3xl md:text-4xl font-black italic uppercase">Liquid Leads</h4>
                  </div>
                  <span className="text-4xl md:text-5xl font-black text-primary italic">72%</span>
                </div>

                <div className="w-full h-3 bg-muted rounded-full overflow-hidden flex mb-6">
                  <motion.div
                    className="h-full bg-muted-foreground/40"
                    initial={{ width: 0 }}
                    whileInView={{ width: "28%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                  <motion.div
                    className="h-full bg-primary shadow-[0_0_15px_hsl(var(--primary)/0.8)]"
                    initial={{ width: 0 }}
                    whileInView={{ width: "72%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                  />
                </div>

                <div className="flex items-center justify-between border-t border-border pt-6">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-muted-foreground text-[9px] font-bold uppercase mb-1">Confidence</p>
                      <p className="text-primary font-black italic text-lg tracking-tight">HIGH (8.4/10)</p>
                    </div>
                    <div className="h-10 w-px bg-border" />
                    <div>
                      <p className="text-muted-foreground text-[9px] font-bold uppercase mb-1">Calculated EV</p>
                      <p className="text-accent font-black italic text-lg tracking-tight">+14.2%</p>
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full bg-foreground text-background py-5 rounded-sm font-black text-sm uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-3">
                🔓 Unlock Premium Tactical Briefing
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default PredictionPreview;
