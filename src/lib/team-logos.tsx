import { useState } from "react";

// Local logos stored in /public/esports-logos/ (downloaded SVG/PNG)
// Falls back to CDN URLs for teams without local files
// Falls back to initials if all sources fail

type TeamEntry = {
  local?: string;       // path in /public/esports-logos/
  cdn?: string;         // remote CDN fallback
  game?: string;        // primary game
  aliases?: string[];   // alternative team names
};

const TEAMS: Record<string, TeamEntry> = {
  // ── CS2 Tier-1 ──
  "Natus Vincere": {
    local: "/esports-logos/natus_vincere.svg",
    cdn: "https://img-cdn.hltv.org/teamlogo/kixzGlScWnjFfD2MqwFao5.svg?ixlib=java-2.1.0&s=66680f6d74e7b8a52c2dce498e0e61a2",
    game: "CS2",
    aliases: ["NAVI", "NaVi", "Na'Vi"],
  },
  "Team Vitality": {
    local: "/esports-logos/vitality.svg",
    cdn: "https://img-cdn.hltv.org/teamlogo/GNrmoi-ldTqEMat03BMVVQ.svg?ixlib=java-2.1.0&s=44e4da9fb43c765a8a498998bdf6a85b",
    game: "CS2",
    aliases: ["Vitality"],
  },
  "G2 Esports": {
    local: "/esports-logos/g2_esports.svg",
    cdn: "https://img-cdn.hltv.org/teamlogo/zFLwAELOD15BjJSDMMNBWQ.svg?ixlib=java-2.1.0&s=9a0e412b64a8b45fb1d0048a6e926d5c",
    game: "CS2",
    aliases: ["G2"],
  },
  "FaZe Clan": {
    local: "/esports-logos/faze_clan.svg",
    cdn: "https://img-cdn.hltv.org/teamlogo/SMhzsxMeFEMXHfOx-5o7ig.svg?ixlib=java-2.1.0&s=840dd876c4afc1de65e86cbc91f69e0b",
    game: "CS2",
    aliases: ["FaZe"],
  },
  "Team Spirit": {
    cdn: "https://img-cdn.hltv.org/teamlogo/elGpDJjsrW3Wfwdihoiyi0.svg?ixlib=java-2.1.0&s=a965a16625b3e8410dbb297be1548344",
    game: "CS2",
    aliases: ["Spirit"],
  },
  "MOUZ": {
    local: "/esports-logos/mouz.svg",
    cdn: "https://img-cdn.hltv.org/teamlogo/m2FajaBpOOdShhy5kToDhY.svg?ixlib=java-2.1.0&s=0e569c8cca4daaa2c8c0e9e76404cb0e",
    game: "CS2",
    aliases: ["mousesports"],
  },
  "Heroic": {
    local: "/esports-logos/heroic.svg",
    cdn: "https://img-cdn.hltv.org/teamlogo/jXx6MfbZSBi-rLQFTl-n7Q.svg?ixlib=java-2.1.0&s=a6de395ae4ec060a84e4a4f14c5cc7c9",
    game: "CS2",
  },
  "Virtus.pro": {
    cdn: "https://img-cdn.hltv.org/teamlogo/yZ3tk_3QQF_NkFOIH_J5JA.svg?ixlib=java-2.1.0&s=7eb5d4146a08e99afe01b3ffa9d1d4b3",
    game: "CS2",
    aliases: ["VP"],
  },
  "Cloud9": {
    local: "/esports-logos/cloud9.svg",
    cdn: "https://img-cdn.hltv.org/teamlogo/jdJO9xDh6s3AqJgfkOI3QQ.svg?ixlib=java-2.1.0&s=47bafc9a67f979f7d2efd9c6bd25c",
    game: "CS2",
    aliases: ["C9"],
  },
  "Eternal Fire": {
    cdn: "https://img-cdn.hltv.org/teamlogo/Xv_z3CIh5bPBIb-MHj9kxA.png?ixlib=java-2.1.0&w=100&s=0edfb3e0a8adfa2e345e3d7a3b94db0d",
    game: "CS2",
    aliases: ["EF"],
  },
  "The MongolZ": {
    cdn: "https://img-cdn.hltv.org/teamlogo/-fdGdPOfXcRsjOHTOWJdlj.png?ixlib=java-2.1.0&w=100&s=dc35e0ab29e2ac27cce03d6f30b7d0e3",
    game: "CS2",
  },
  "paiN Gaming": {
    cdn: "https://img-cdn.hltv.org/teamlogo/BjEKtd7HWl_iDSOfxqnfCU.svg?ixlib=java-2.1.0&s=5e1b15620f0472ac2da4ab3961a81a1d",
    game: "CS2",
    aliases: ["paiN"],
  },
  "Complexity": {
    cdn: "https://img-cdn.hltv.org/teamlogo/-X8NJRJVkkcJHEMq6Syhkq.svg?ixlib=java-2.1.0&s=45ac2fc3a5576a19fee2f94a1d3e52ee",
    game: "CS2",
    aliases: ["coL", "Complexity Gaming"],
  },
  "BIG": {
    cdn: "https://img-cdn.hltv.org/teamlogo/OgMGYFF1zuUQ0aGJJzX4cB.svg?ixlib=java-2.1.0&s=5f4e69303b4adb9fe3ab4f2a2702b41d",
    game: "CS2",
  },
  "3DMAX": {
    cdn: "https://img-cdn.hltv.org/teamlogo/2g-DhjZJL-J1L46lW_LKSg.svg?ixlib=java-2.1.0&s=98fb9d37dfafe15ab1f1ee5bb1a48e27",
    game: "CS2",
  },
  "SAW": {
    cdn: "https://img-cdn.hltv.org/teamlogo/X-9YI4CXgN-JQZGKQZ-lUx.svg?ixlib=java-2.1.0&s=f05e84c7fc85a5b0da488e7b3d95fc05",
    game: "CS2",
  },
  "Team Liquid": {
    local: "/esports-logos/team_liquid.svg",
    cdn: "https://img-cdn.hltv.org/teamlogo/JMeLLbWKCIEJrmfPaqOz4O.svg?ixlib=java-2.1.0&s=c02caf90234d3a3ebac074c84ba1ea62",
    game: "CS2",
    aliases: ["Liquid", "TL"],
  },
  "M80": {
    cdn: "https://img-cdn.hltv.org/teamlogo/1csPGwNHb0xTvdl3NCPHB6.png?ixlib=java-2.1.0&w=100&s=03a0dfe5c8b744ca18a49e83e2fd06b0",
    game: "CS2",
  },
  "Astralis": {
    local: "/esports-logos/astralis.svg",
    cdn: "https://img-cdn.hltv.org/teamlogo/9bgXHp-oh1oaXr7F0mTGmd.svg?ixlib=java-2.1.0&s=10625e8cd9f7b9fded28a4a0fb0",
    game: "CS2",
  },

  // ── Multi-game / Valorant / LoL / Dota 2 ──
  "Fnatic": {
    local: "/esports-logos/fnatic.svg",
    cdn: "https://img-cdn.hltv.org/teamlogo/hoSdMb_FBpCTHsN6KkCfHp.svg?ixlib=java-2.1.0&s=2ef6cc4cdc9b1ad tried",
    game: "Multi",
  },
  "OG": {
    local: "/esports-logos/og.svg",
    game: "Dota 2",
  },
  "100 Thieves": {
    local: "/esports-logos/100_thieves.svg",
    game: "Valorant",
    aliases: ["100T"],
  },
  "Evil Geniuses": {
    local: "/esports-logos/evil_geniuses.svg",
    game: "Multi",
    aliases: ["EG"],
  },
  "Gen.G": {
    local: "/esports-logos/gen_g.svg",
    game: "LoL",
    aliases: ["GenG", "Gen.G Esports"],
  },
  "T1": {
    game: "LoL",
    aliases: ["SK Telecom T1", "SKT"],
  },
  "Sentinels": {
    game: "Valorant",
    aliases: ["SEN"],
  },
  "LOUD": {
    game: "Valorant",
  },
  "Paper Rex": {
    game: "Valorant",
    aliases: ["PRX"],
  },
  "DRX": {
    game: "Valorant",
  },

  // ── Additional CS2 teams ──
  "FURIA": {
    cdn: "https://img-cdn.hltv.org/teamlogo/mvNQc4csFGtxXk5GuAh7JQ.svg?ixlib=java-2.1.0&s=dbb0e843e4617e18940bf4e5e8b663d3",
    game: "CS2",
    aliases: ["FURIA Esports"],
  },
  "GamerLegion": {
    cdn: "https://img-cdn.hltv.org/teamlogo/FMWFOEM2KAAOQ7O2DN0pjC.svg?ixlib=java-2.1.0&s=ba26252ce4c493990fde2a46e6bcf2fb",
    game: "CS2",
    aliases: ["GL"],
  },
  "ENCE": {
    cdn: "https://img-cdn.hltv.org/teamlogo/yEz4Os2rryQ6zRfhNJzpOh.svg?ixlib=java-2.1.0&s=ba7db7fee43e75ef4a0d3b291ab7c3a4",
    game: "CS2",
  },
  "Wildcard": {
    cdn: "https://img-cdn.hltv.org/teamlogo/dnkJz-ouolx6LB_xibxDm6.png?ixlib=java-2.1.0&w=100&s=f2edcb0c1fcb1c105a4f0a1bcde7ed87",
    game: "CS2",
  },
  "Imperial": {
    cdn: "https://img-cdn.hltv.org/teamlogo/puXxeI8ksAj10JJ96GWWOA.svg?ixlib=java-2.1.0&s=f4ce2b3c38c4f86fd89aa tried",
    game: "CS2",
    aliases: ["Imperial Esports"],
  },
  "Monte": {
    cdn: "https://img-cdn.hltv.org/teamlogo/S_FI_ZaBr7RvWJAiIH7bsH.png?ixlib=java-2.1.0&w=100&s=c55add13a3db1c2dcf1a1c2e2bb1f5b3",
    game: "CS2",
  },
  "Apogee": {
    game: "CS2",
  },
  "Legacy": {
    game: "CS2",
  },
  "Falcons": {
    cdn: "https://img-cdn.hltv.org/teamlogo/a4d3t70xCPTtJ4sm3TO-X5.png?ixlib=java-2.1.0&w=100&s=cc95c7e2b7b1d2b4c2acdf9e7cd2c8e4",
    game: "CS2",
    aliases: ["Team Falcons"],
  },
};

// Build lookup map including aliases
const LOGO_MAP: Record<string, TeamEntry> = {};
for (const [name, entry] of Object.entries(TEAMS)) {
  LOGO_MAP[name.toLowerCase()] = entry;
  entry.aliases?.forEach(alias => {
    LOGO_MAP[alias.toLowerCase()] = entry;
  });
}

export function getTeamLogo(teamName: string): string {
  const lower = teamName.toLowerCase();

  // Direct match
  const entry = LOGO_MAP[lower];
  if (entry) return entry.local || entry.cdn || "";

  // Partial match
  for (const [key, e] of Object.entries(LOGO_MAP)) {
    if (key.includes(lower) || lower.includes(key)) {
      return e.local || e.cdn || "";
    }
  }

  return "";
}

export function getTeamEntry(teamName: string): TeamEntry | undefined {
  const lower = teamName.toLowerCase();
  return LOGO_MAP[lower];
}

export function TeamLogo({ name, size = 40 }: { name: string; size?: number }) {
  const entry = (() => {
    const lower = name.toLowerCase();
    let e = LOGO_MAP[lower];
    if (e) return e;
    for (const [key, val] of Object.entries(LOGO_MAP)) {
      if (key.includes(lower) || lower.includes(key)) return val;
    }
    return undefined;
  })();

  const sources = [entry?.local, entry?.cdn].filter(Boolean) as string[];
  const [sourceIndex, setSourceIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  const initials = name
    .split(/[\s.]+/)
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const currentSrc = sources[sourceIndex];

  if (currentSrc && !failed) {
    return (
      <img
        src={currentSrc}
        alt={name}
        className="rounded-lg bg-muted object-contain"
        style={{ width: size, height: size }}
        onError={() => {
          if (sourceIndex < sources.length - 1) {
            setSourceIndex(prev => prev + 1);
          } else {
            setFailed(true);
          }
        }}
      />
    );
  }

  return (
    <div
      className="rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-black"
      style={{ width: size, height: size, fontSize: size * 0.3 }}
    >
      {initials}
    </div>
  );
}
