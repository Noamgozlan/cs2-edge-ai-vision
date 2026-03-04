import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, XCircle, CheckCircle, Scale } from "lucide-react";

const PredictionPreview = () => {
  return (
    <section className="py-24 relative">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            See AI Predictions <span className="text-gradient">In Action</span>
          </h2>
          <p className="text-muted-foreground">Here's what a real prediction looks like.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="rounded-2xl bg-card border border-border/50 overflow-hidden glow-blue">
            {/* Header */}
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-display font-bold text-lg">M80</span>
                  <span className="text-muted-foreground text-sm">vs</span>
                  <span className="font-display font-bold text-lg">Team Liquid</span>
                </div>
                <p className="text-xs text-muted-foreground">PGL Major · Swiss Stage · Bo3</p>
              </div>
              <Badge className="bg-gradient-primary border-0 font-display">72% Confidence</Badge>
            </div>

            {/* Bet recommendation */}
            <div className="p-6 border-b border-border/50 bg-surface/30">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-neon-green" />
                <span className="text-sm font-semibold text-neon-green">Recommended Bet</span>
              </div>
              <p className="text-foreground font-display font-bold text-xl">M80 ML @ 1.82</p>
            </div>

            {/* Veto */}
            <div className="p-6 border-b border-border/50">
              <h4 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Projected Veto</h4>
              <div className="space-y-2.5">
                {[
                  { icon: XCircle, color: "text-destructive", text: "M80 ban", map: "Nuke" },
                  { icon: XCircle, color: "text-destructive", text: "Liquid ban", map: "Overpass" },
                  { icon: CheckCircle, color: "text-neon-green", text: "M80 pick", map: "Anubis" },
                  { icon: CheckCircle, color: "text-neon-green", text: "Liquid pick", map: "Inferno" },
                  { icon: Scale, color: "text-primary", text: "Decider", map: "Mirage / Dust2" },
                ].map((veto, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <veto.icon className={`h-4 w-4 ${veto.color}`} />
                    <span className="text-muted-foreground w-24">{veto.text}</span>
                    <span className="font-medium">{veto.map}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Analysis preview */}
            <div className="p-6">
              <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">🔥 The Breakdown</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This is an elimination match in the Swiss Stage. While Liquid has the "big name", their recent form has been disastrous compared to M80. Liquid struggled against rank #140 teams while M80 pushed G2 to 3 maps. The veto heavily favors M80's comfort zone.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PredictionPreview;
