import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, XCircle, CheckCircle, Scale } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const MatchDetail = () => {
  const { id } = useParams();
  const { t } = useLanguage();

  return (
    <div className="space-y-6 max-w-4xl">
      <Link to="/dashboard/matches" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t("match.back")}
      </Link>

      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-bold text-xl">M80</span>
              <span className="text-muted-foreground text-sm">vs</span>
              <span className="font-bold text-xl">Team Liquid</span>
            </div>
            <p className="text-xs text-muted-foreground">PGL Major · Swiss Stage · Bo3</p>
          </div>
          <Badge className="bg-primary text-primary-foreground border-0 text-sm px-4 py-1">72% {t("match.confidence")}</Badge>
        </div>

        <div className="p-6 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold text-accent">{t("match.recommendedBet")}</span>
          </div>
          <p className="font-bold text-2xl">M80 ML @ 1.82</p>
        </div>

        <div className="p-6 border-b border-border">
          <h4 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">{t("match.projectedVeto")}</h4>
          <div className="space-y-3">
            {[
              { icon: XCircle, color: "text-destructive", text: "M80 ban", map: "Nuke" },
              { icon: XCircle, color: "text-destructive", text: "Liquid ban", map: "Overpass" },
              { icon: CheckCircle, color: "text-accent", text: "M80 pick", map: "Anubis" },
              { icon: CheckCircle, color: "text-accent", text: "Liquid pick", map: "Inferno" },
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

        <div className="p-6 space-y-5">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">🔥 {t("match.breakdown")}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This is an elimination match in the Swiss Stage. While Liquid has the "big name", their recent form and path to this 1-2 record have been disastrous compared to M80.
          </p>
          {[
            { title: "🔹 Liquid's Collapse", text: "Liquid had the easiest schedule and still struggled against rank #140 teams. NAF (0.52 KPR) and siuhy are currently liabilities." },
            { title: "🔹 M80's Form", text: "M80 is pushing Top 10 teams like G2 to 3 maps. They are playing at a much higher level." },
            { title: "🔹 Veto Edge", text: "Liquid's best map (Nuke) is M80's perma-ban. This forces the series onto M80's comfort zone." },
            { title: "🔹 Star Power", text: "Lake is the best player in this matchup. Supported by JBa and s1n, M80's core outclasses Liquid." },
          ].map((section) => (
            <div key={section.title}>
              <h5 className="text-sm font-semibold mb-1">{section.title}</h5>
              <p className="text-sm text-muted-foreground leading-relaxed">{section.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchDetail;
