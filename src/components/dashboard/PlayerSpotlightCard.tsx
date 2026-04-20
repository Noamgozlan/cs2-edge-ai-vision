import { User2, ScanSearch, Sparkles } from "lucide-react";
import { PlayerSpotlight } from "@/lib/api";

type PlayerSpotlightCardProps = {
  spotlight: PlayerSpotlight;
  compact?: boolean;
};

const fallbackGradient = [
  "from-primary/30 via-primary/10 to-transparent",
  "from-accent/30 via-accent/10 to-transparent",
  "from-sky-500/25 via-sky-400/10 to-transparent",
];

function pickFallback(name: string) {
  const hash = name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return fallbackGradient[hash % fallbackGradient.length];
}

export default function PlayerSpotlightCard({ spotlight, compact = false }: PlayerSpotlightCardProps) {
  const imageUrl = spotlight.imageUrl || spotlight.playerPhoto?.imageUrl || null;
  const initials = spotlight.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

  return (
    <div
      className={`relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-[0_18px_50px_rgba(0,0,0,0.24)] ${
        compact ? "p-3.5" : "p-5"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(72,112,255,0.22),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(39,201,140,0.16),transparent_38%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/20" />

      <div className={`relative z-10 flex ${compact ? "items-center gap-3" : "flex-col gap-4"}`}>
        <div className={`relative overflow-hidden rounded-[1.15rem] border border-white/10 bg-slate-950/50 ${compact ? "h-16 w-16 shrink-0" : "h-44 w-full"}`}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={spotlight.name}
              loading="lazy"
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${pickFallback(spotlight.name)}`}>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/25 text-sm font-semibold text-white/90 backdrop-blur-sm">
                {initials || <User2 className="h-5 w-5" />}
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
          <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/35 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-md">
            <ScanSearch className="h-3 w-3" />
            Player Edge
          </div>
          {!compact && (
            <div className="absolute inset-x-0 bottom-0 p-4">
              <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-[10px] font-medium text-white/80 backdrop-blur-md">
                <Sparkles className="h-3 w-3" />
                {spotlight.source || "HLTV"}
              </div>
            </div>
          )}
        </div>

        <div className="relative z-10 min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">Featured Player</p>
              <h3 className={`truncate font-semibold text-white ${compact ? "text-base" : "text-xl"}`}>{spotlight.name}</h3>
              <p className="text-sm text-white/60">{spotlight.team}</p>
            </div>
            {compact && (
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/55">
                {spotlight.source || "HLTV"}
              </span>
            )}
          </div>

          <div className={`mt-3 rounded-2xl border border-white/10 bg-black/20 ${compact ? "p-2.5" : "p-3.5"} backdrop-blur-sm`}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">Detected Market</p>
            <p className={`mt-1 line-clamp-3 font-medium text-white/90 ${compact ? "text-xs" : "text-sm leading-6"}`}>{spotlight.market}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
