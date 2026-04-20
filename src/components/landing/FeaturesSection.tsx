import { motion } from "framer-motion";
import {
  BrainCircuit,
  Radar,
  ScanSearch,
  Swords,
  Trophy,
  BellRing,
  ArrowUpRight,
} from "lucide-react";

const featureCards = [
  {
    icon: BrainCircuit,
    eyebrow: "Unlike any workflow you've used before",
    title: "A premium betting workspace, not another noisy pick feed.",
    description:
      "Map logic, player context, line shopping, and confidence framing all land in one composed view so the sharpest angle is obvious fast.",
    list: ["Model-weighted market ranking", "Live source freshness status", "Clean sportsbook comparison"],
    span: "lg:col-span-2",
    accent: "#4d7cff",
  },
  {
    icon: Radar,
    eyebrow: "Signal first",
    title: "Live data that stays current enough to matter.",
    description:
      "PandaScore and HLTV-backed inputs refresh your view before price drift and public sentiment flatten the edge.",
    list: ["Fresh match sync", "Rosters and form", "Book odds updates"],
    span: "",
    accent: "#2bd0b0",
  },
  {
    icon: ScanSearch,
    eyebrow: "Player market depth",
    title: "Player props with context, not just numbers.",
    description:
      "Recent form, likely maps, role fit, and market-specific framing make the prop board feel curated instead of raw.",
    list: ["Kill line reads", "Opening duel context", "Photo-led spotlight"],
    span: "",
    accent: "#9b8cff",
  },
  {
    icon: Swords,
    eyebrow: "Map veto engine",
    title: "Veto sequencing that explains why the number moved.",
    description:
      "Ban and pick forecasts expose where matchup pressure builds before a series starts.",
    list: ["Predicted bans and picks", "Map-by-map edge notes", "Series-path clarity"],
    span: "",
    accent: "#ff8c6b",
  },
  {
    icon: Trophy,
    eyebrow: "Decision-ready analysis",
    title: "Recommendations framed like a trading terminal.",
    description:
      "Every bet is shown with confidence, expected value, likely scenarios, and what could break the read.",
    list: ["Primary and secondary angles", "Probability framing", "Risk-aware rationale"],
    span: "",
    accent: "#f0c040",
  },
  {
    icon: BellRing,
    eyebrow: "Built for action",
    title: "From first look to final ticket in a few disciplined steps.",
    description:
      "The product stays dense where it matters and quiet where it should — expensive and easy at the same time.",
    list: ["Clean empty and loading states", "Responsive on every screen", "Fast interaction feedback"],
    span: "lg:col-span-2",
    accent: "#4d7cff",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="relative border-t border-white/6 py-24 sm:py-28">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-64 w-[600px] rounded-full bg-[#4d7cff]/6 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <p className="landing-section-label text-xs font-semibold uppercase">Why It Feels Different</p>
          <h2
            className="font-landing-display mt-4 text-4xl font-semibold sm:text-5xl"
            style={{
              background: "linear-gradient(135deg, #ffffff 40%, #9fb7ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Premium infrastructure for people who care where the number comes from.
          </h2>
          <p className="mx-auto mt-5 max-w-[60ch] text-base leading-8 text-white/52">
            Cleaner hierarchy, stronger authority, and a faster path from information to conviction.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid gap-4 lg:grid-cols-3">
          {featureCards.map((card, index) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, scale: 1.005 }}
              className={`group relative overflow-hidden rounded-[22px] p-6 sm:p-7 ${card.span} cursor-default`}
              style={{
                background: "linear-gradient(180deg, rgba(16,20,30,0.9) 0%, rgba(9,12,18,0.9) 100%)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
                backdropFilter: "blur(16px)",
              }}
            >
              {/* Hover glow */}
              <div
                className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: card.accent + "18" }}
              />

              {/* Icon */}
              <div
                className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10"
                style={{ background: card.accent + "15" }}
              >
                <card.icon className="h-5 w-5" style={{ color: card.accent }} />
              </div>

              <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/35">
                {card.eyebrow}
              </p>
              <h3 className="mt-3 font-landing-display text-xl font-semibold text-white leading-tight">
                {card.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-white/52">{card.description}</p>

              <ul className="mt-6 space-y-2">
                {card.list.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 rounded-xl border border-white/7 bg-black/18 px-4 py-2.5 text-sm font-medium text-white/62"
                  >
                    <span
                      className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                      style={{ background: card.accent }}
                    />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Hover arrow link hint */}
              <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ color: card.accent }}>
                Learn more <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
