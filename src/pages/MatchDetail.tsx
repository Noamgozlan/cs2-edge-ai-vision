import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, XCircle, CheckCircle, Scale } from "lucide-react";

const MatchDetail = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6 max-w-4xl">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/dashboard/matches"><ArrowLeft className="mr-2 h-4 w-4" />Back to Matches</Link>
      </Button>

      {/* Prediction Card */}
      <div className="rounded-2xl bg-card border border-border/50 overflow-hidden glow-blue">
        <div className="p-6 border-b border-border/50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-display font-bold text-xl">M80</span>
              <span className="text-muted-foreground text-sm">vs</span>
              <span className="font-display font-bold text-xl">Team Liquid</span>
            </div>
            <p className="text-xs text-muted-foreground">PGL Major · Swiss Stage · Bo3</p>
          </div>
          <Badge className="bg-gradient-primary border-0 font-display text-sm px-4 py-1">72% Confidence</Badge>
        </div>

        <div className="p-6 border-b border-border/50 bg-surface/30">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-neon-green" />
            <span className="text-sm font-semibold text-neon-green">Recommended Bet</span>
          </div>
          <p className="font-display font-bold text-2xl">M80 ML @ 1.82</p>
        </div>

        {/* Veto */}
        <div className="p-6 border-b border-border/50">
          <h4 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Projected Veto</h4>
          <div className="space-y-3">
            {[
              { icon: XCircle, color: "text-destructive", text: "M80 ban", map: "Nuke" },
              { icon: XCircle, color: "text-destructive", text: "Liquid ban", map: "Overpass" },
              { icon: CheckCircle, color: "text-neon-green", text: "M80 pick", map: "Anubis" },
              { icon: CheckCircle, color: "text-neon-green", text: "Liquid pick", map: "Inferno" },
              { icon: Scale, color: "text-primary", text: "Decider", map: "Mirage / Dust2" },
            ].map((v, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <v.icon className={`h-4 w-4 ${v.color}`} />
                <span className="text-muted-foreground w-28">{v.text}</span>
                <span className="font-medium">{v.map}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis */}
        <div className="p-6 space-y-5">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">🔥 The Breakdown</h4>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            This is an elimination match in the Swiss Stage. While Liquid has the "big name", their recent form and path to this 1-2 record have been disastrous compared to M80.
          </p>

          {[
            { title: "🔹 Liquid's Collapse", text: "Liquid had the easiest schedule and still struggled against rank #140 teams. NAF (0.52 KPR) and siuhy are currently liabilities, lacking the firepower to close maps." },
            { title: "🔹 M80's Form", text: "M80 is pushing Top 10 teams like G2 to 3 maps. They are playing at a much higher level than Liquid's previous opponents." },
            { title: "🔹 Veto Edge", text: "Liquid's best map (Nuke) is M80's perma-ban, while M80's worst map (Overpass) is Liquid's perma-ban. This forces the series onto M80's comfort zone." },
            { title: "🔹 Star Power", text: "Lake is the best player in this matchup. Supported by JBa and s1n, M80's core currently outclasses Liquid's struggling lineup." },
          ].map((section) => (
            <div key={section.title}>
              <h5 className="text-sm font-semibold mb-1">{section.title}</h5>
              <p className="text-sm text-muted-foreground leading-relaxed">{section.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Odds Comparison */}
      <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
        <div className="p-5 border-b border-border/50">
          <h2 className="font-display font-bold">Odds Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 text-muted-foreground font-medium">Site</th>
                <th className="text-center p-4 text-muted-foreground font-medium">M80</th>
                <th className="text-center p-4 text-muted-foreground font-medium">Team Liquid</th>
              </tr>
            </thead>
            <tbody>
              {[
                { site: "HLTV Odds", m80: "1.82", liquid: "1.95", best: "m80" },
                { site: "Bet365", m80: "1.80", liquid: "2.00", best: "liquid" },
                { site: "GGbet", m80: "1.85", liquid: "1.90", best: "m80" },
              ].map((row) => (
                <tr key={row.site} className="border-b border-border/50 last:border-0 hover:bg-surface-hover transition-colors">
                  <td className="p-4 font-medium">{row.site}</td>
                  <td className={`p-4 text-center font-display font-bold ${row.best === "m80" && row.site === "GGbet" ? "text-neon-green" : ""}`}>{row.m80}</td>
                  <td className={`p-4 text-center font-display font-bold ${row.best === "liquid" && row.site === "Bet365" ? "text-neon-green" : ""}`}>{row.liquid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MatchDetail;
