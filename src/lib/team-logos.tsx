// Team logo URLs sourced from public CDNs / HLTV images
const TEAM_LOGOS: Record<string, string> = {
  "Natus Vincere": "https://img-cdn.hltv.org/teamlogo/kixzGlScWnjFfD2MqwFao5.svg?ixlib=java-2.1.0&s=66680f6d74e7b8a52c2dce498e0e61a2",
  "NAVI": "https://img-cdn.hltv.org/teamlogo/kixzGlScWnjFfD2MqwFao5.svg?ixlib=java-2.1.0&s=66680f6d74e7b8a52c2dce498e0e61a2",
  "Team Vitality": "https://img-cdn.hltv.org/teamlogo/GNrmoi-ldTqEMat03BMVVQ.svg?ixlib=java-2.1.0&s=44e4da9fb43c765a8a498998bdf6a85b",
  "Vitality": "https://img-cdn.hltv.org/teamlogo/GNrmoi-ldTqEMat03BMVVQ.svg?ixlib=java-2.1.0&s=44e4da9fb43c765a8a498998bdf6a85b",
  "G2 Esports": "https://img-cdn.hltv.org/teamlogo/zFLwAELOD15BjJSDMMNBWQ.svg?ixlib=java-2.1.0&s=9a0e412b64a8b45fb1d0048a6e926d5c",
  "G2": "https://img-cdn.hltv.org/teamlogo/zFLwAELOD15BjJSDMMNBWQ.svg?ixlib=java-2.1.0&s=9a0e412b64a8b45fb1d0048a6e926d5c",
  "FaZe Clan": "https://img-cdn.hltv.org/teamlogo/SMhzsxMeFEMXHfOx-5o7ig.svg?ixlib=java-2.1.0&s=840dd876c4afc1de65e86cbc91f69e0b",
  "FaZe": "https://img-cdn.hltv.org/teamlogo/SMhzsxMeFEMXHfOx-5o7ig.svg?ixlib=java-2.1.0&s=840dd876c4afc1de65e86cbc91f69e0b",
  "Team Spirit": "https://img-cdn.hltv.org/teamlogo/elGpDJjsrW3Wfwdihoiyi0.svg?ixlib=java-2.1.0&s=a965a16625b3e8410dbb297be1548344",
  "Spirit": "https://img-cdn.hltv.org/teamlogo/elGpDJjsrW3Wfwdihoiyi0.svg?ixlib=java-2.1.0&s=a965a16625b3e8410dbb297be1548344",
  "MOUZ": "https://img-cdn.hltv.org/teamlogo/m2FajaBpOOdShhy5kToDhY.svg?ixlib=java-2.1.0&s=0e569c8cca4daaa2c8c0e9e76404cb0e",
  "Heroic": "https://img-cdn.hltv.org/teamlogo/jXx6MfbZSBi-rLQFTl-n7Q.svg?ixlib=java-2.1.0&s=a6de395ae4ec060a84e4a4f14c5cc7c9",
  "Virtus.pro": "https://img-cdn.hltv.org/teamlogo/yZ3tk_3QQF_NkFOIH_J5JA.svg?ixlib=java-2.1.0&s=7eb5d4146a08e99afe01b3ffa9d1d4b3",
  "Cloud9": "https://img-cdn.hltv.org/teamlogo/jdJO9xDh6s3AqJgfkOI3QQ.svg?ixlib=java-2.1.0&s=47bafc9a67f979f7d2efd9c6bd25c",
  "Eternal Fire": "https://img-cdn.hltv.org/teamlogo/Xv_z3CIh5bPBIb-MHj9kxA.png?ixlib=java-2.1.0&w=100&s=0edfb3e0a8adfa2e345e3d7a3b94db0d",
  "The MongolZ": "https://img-cdn.hltv.org/teamlogo/-fdGdPOfXcRsjOHTOWJdlj.png?ixlib=java-2.1.0&w=100&s=dc35e0ab29e2ac27cce03d6f30b7d0e3",
  "paiN Gaming": "https://img-cdn.hltv.org/teamlogo/BjEKtd7HWl_iDSOfxqnfCU.svg?ixlib=java-2.1.0&s=5e1b15620f0472ac2da4ab3961a81a1d",
  "paiN": "https://img-cdn.hltv.org/teamlogo/BjEKtd7HWl_iDSOfxqnfCU.svg?ixlib=java-2.1.0&s=5e1b15620f0472ac2da4ab3961a81a1d",
  "Complexity": "https://img-cdn.hltv.org/teamlogo/-X8NJRJVkkcJHEMq6Syhkq.svg?ixlib=java-2.1.0&s=45ac2fc3a5576a19fee2f94a1d3e52ee",
  "BIG": "https://img-cdn.hltv.org/teamlogo/OgMGYFF1zuUQ0aGJJzX4cB.svg?ixlib=java-2.1.0&s=5f4e69303b4adb9fe3ab4f2a2702b41d",
  "3DMAX": "https://img-cdn.hltv.org/teamlogo/2g-DhjZJL-J1L46lW_LKSg.svg?ixlib=java-2.1.0&s=98fb9d37dfafe15ab1f1ee5bb1a48e27",
  "SAW": "https://img-cdn.hltv.org/teamlogo/X-9YI4CXgN-JQZGKQZ-lUx.svg?ixlib=java-2.1.0&s=f05e84c7fc85a5b0da488e7b3d95fc05",
  "Team Liquid": "https://img-cdn.hltv.org/teamlogo/JMeLLbWKCIEJrmfPaqOz4O.svg?ixlib=java-2.1.0&s=c02caf90234d3a3ebac074c84ba1ea62",
  "Liquid": "https://img-cdn.hltv.org/teamlogo/JMeLLbWKCIEJrmfPaqOz4O.svg?ixlib=java-2.1.0&s=c02caf90234d3a3ebac074c84ba1ea62",
  "M80": "https://img-cdn.hltv.org/teamlogo/1csPGwNHb0xTvdl3NCPHB6.png?ixlib=java-2.1.0&w=100&s=03a0dfe5c8b744ca18a49e83e2fd06b0",
  "Astralis": "https://img-cdn.hltv.org/teamlogo/9bgXHp-oh1oaXr7F0mTGmd.svg?ixlib=java-2.1.0&s=10625e8cd9f7b9fded28a4a0fb0",
};

export function getTeamLogo(teamName: string): string {
  // Direct match
  if (TEAM_LOGOS[teamName]) return TEAM_LOGOS[teamName];
  
  // Try partial match
  const lower = teamName.toLowerCase();
  for (const [key, url] of Object.entries(TEAM_LOGOS)) {
    if (key.toLowerCase().includes(lower) || lower.includes(key.toLowerCase())) {
      return url;
    }
  }
  
  // Fallback: generate a placeholder with team initials
  return "";
}

import { useState } from "react";

export function TeamLogo({ name, size = 40 }: { name: string; size?: number }) {
  const url = getTeamLogo(name);
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(/[\s.]+/)
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (url && !failed) {
    return (
      <img
        src={url}
        alt={name}
        className="rounded-lg bg-muted object-contain"
        style={{ width: size, height: size }}
        onError={() => setFailed(true)}
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
