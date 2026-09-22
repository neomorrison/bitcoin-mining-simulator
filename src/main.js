"use strict";
/* ============================================================
   HASH FORGE v4 — a bitcoin mining clicker
   Strike the coin. Build rigs. Catch golden nonces. Hard fork.
   ============================================================ */

const SAVE_KEY = "hash-forge-v4";
const LEGACY_KEY = "hash-forge-v3";
const T = "./assets/t/";
const HEX = "0123456789ABCDEF";
const GROWTH = 1.15;
const SUF = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc", "Ud", "Dd", "Td", "Qad", "Qid"];

/* ---------------- icons (stroke, 24px grid) ---------------- */
const ICONS = {
  sparkle: "M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z",
  key: "M21 2l-2 2M15.5 7.5l3 3L22 7l-3-3M11.4 12.6a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zM11.4 12.6L19 5",
  volume: "M11 5L6 9H2v6h4l5 4V5zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14",
  mute: "M11 5L6 9H2v6h4l5 4V5zM22 9l-6 6M16 9l6 6",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  server: "M3 3h18v7H3zM3 14h18v7H3zM7 6.5h.01M7 17.5h.01",
  chip: "M6 6h12v12H6zM9 9h6v6H9zM9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4",
  fork: "M6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM18 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM6 9v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9M12 12v3",
  trophy: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z",
  chart: "M3 3v18h18M7 16v-4M12 16V8M17 16v-7",
  click: "M9 9l5 12 1.8-5.2L21 14 9 9zM7.2 2.2L8 5.1M5.1 8l-2.9-.8M14 4.1L12 6M6 12l-1.9 2",
  block: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.3 7L12 12l8.7-5M12 22V12",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  flame: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z",
  snow: "M2 12h20M12 2v20M20 16l-4-4 4-4M4 8l4 4-4 4M16 4l-4 4-4-4M8 20l4-4 4 4",
  gauge: "M12 14l4-4M3.34 19a10 10 0 1 1 17.32 0",
  magnet: "M6 15l-4-4 6.75-6.77a7.79 7.79 0 0 1 11 11L13 22l-4-4 6.39-6.36a2.14 2.14 0 0 0-3-3L6 15M5 8l4 4M12 15l4 4",
  refresh: "M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5",
  ripple: "M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0-20 0M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0",
  list: "M3 6h18M3 12h18M3 18h12",
  rain: "M4 4v6M9 2v10M14 6v8M19 3v9M4 16v4M14 18v4M19 16v2M9 16v6",
  link: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  stamp: "M5 22h14M19.27 13.73A2.5 2.5 0 0 0 17.5 13h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5c0-.66-.26-1.3-.73-1.77zM14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-6 0c0 2 1 2 1 3.5V13",
  monitor: "M2 3h20v14H2zM8 21h8M12 17v4",
  waves: "M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
  lock: "M5 11h14v10H5zM7 11V7a5 5 0 0 1 10 0v4",
  orbit: "M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0M20.2 20.2c2-2 .02-7.07-4.4-11.5C11.3 4.3 6.2 2.3 4.2 4.2c-2 2-.02 7.07 4.4 11.5 4.5 4.4 9.6 6.4 11.6 4.5z",
  drone: "M13 7L9 3 5 7l4 4M17 11l4 4-4 4-4-4M8 12l4 4 6-6-4-4zM16 8l3-3M9 21a6 6 0 0 0-6-6",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  sun: "M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41",
  ghost: "M9 10h.01M15 10h.01M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z",
  seed: "M7 20h10M10 20c5.5-2.5.8-6.4 3-10M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8zM14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z",
  x: "M18 6L6 18M6 6l12 12",
  check: "M20 6L9 17l-5-5",
  clock: "M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0-20 0M12 6v6l4 2",
};
function icon(name, cls = "") {
  return `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[name] || ICONS.sparkle}"/></svg>`;
}
function hydrateIcons(root = document) {
  root.querySelectorAll("i[data-icon]").forEach((el) => { el.outerHTML = icon(el.dataset.icon); });
}

/* ---------------- content ---------------- */
const RIGS = [
  { id: "cpu", name: "Garage CPU", tag: "SILICON", base: 15, rate: 0.1, dark: true, flavor: "A loyal first thread humming in the spare room." },
  { id: "gpu", name: "GPU Rig", tag: "ACCELERATED", base: 100, rate: 1, flavor: "Three fans. Parallel heat. Parallel hashes." },
  { id: "fpga", name: "FPGA Board", tag: "RECONFIG", base: 1100, rate: 8, flavor: "Rewire the fabric. Hash whatever the bitstream says." },
  { id: "asic", name: "ASIC Pod", tag: "INDUSTRIAL", base: 12000, rate: 47, flavor: "Purpose-built. No games. Only SHA-256." },
  { id: "farm", name: "Container Farm", tag: "MEGA SCALE", base: 130000, rate: 260, flavor: "A shipping container of relentless machines." },
  { id: "hydro", name: "Hydro Bay", tag: "HYDRO", base: 1.4e6, rate: 1400, flavor: "A river, a turbine and a very loud shed." },
  { id: "immersion", name: "Immersion Hall", tag: "SUBMERGED", base: 2e7, rate: 7800, flavor: "Boards bathed in dielectric bliss. Silent. Hungry." },
  { id: "volcano", name: "Volcano Plant", tag: "GEOTHERMAL", base: 3.3e8, rate: 44000, flavor: "Geothermal power straight from the mountain." },
  { id: "orbital", name: "Orbital Miner", tag: "ORBITAL", base: 5.1e9, rate: 260000, flavor: "Solar-fed hashing above the weather." },
  { id: "quantum", name: "Quantum Rig", tag: "QUANTUM", base: 7.5e10, rate: 1.6e6, flavor: "Grover says the nonce is in there somewhere." },
  { id: "dyson", name: "Dyson Swarm", tag: "STELLAR", base: 1e12, rate: 1e7, flavor: "Wrap a star. Point it at SHA-256." },
];
const RIG = Object.fromEntries(RIGS.map((r) => [r.id, r]));
const RIG_TIERS = [
  { need: 1, mult: 10, name: "Tuned" },
  { need: 5, mult: 50, name: "Overvolted" },
  { need: 25, mult: 500, name: "Liquid-Cooled" },
  { need: 50, mult: 5e4, name: "Bespoke-Firmware" },
  { need: 100, mult: 5e6, name: "Hardened" },
  { need: 150, mult: 5e8, name: "Exotic-Alloy" },
  { need: 200, mult: 5e10, name: "Self-Healing" },
  { need: 250, mult: 5e12, name: "Transcendent" },
];
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
const MILESTONES = [25, 50, 100, 150, 200, 300, 400, 500];

// kind: click | hustle | block | reward | net | gold | combo | ability
const GLOBAL_UPS = [
  { id: "paste", name: "Thermal Paste", desc: "Strike power ×2.", cost: 100, kind: "click", unlock: () => S.clicksAll >= 5 },
  { id: "firmware", name: "Signed Firmware", desc: "Strike power ×2.", cost: 500, kind: "click", unlock: () => S.clicksAll >= 40 },
  { id: "silicon", name: "Custom Silicon", desc: "Strike power ×2.", cost: 1e4, kind: "click", unlock: () => S.clicksAll >= 150 },
  { id: "hustle1", name: "Proof of Hustle", desc: "Strikes gain +1% of your sats/sec.", cost: 5e4, kind: "hustle", unlock: () => S.clicksAll >= 400 },
  { id: "hustle2", name: "Proof of Grind", desc: "Strikes gain another +1% of sats/sec.", cost: 5e6, kind: "hustle", unlock: () => S.clicksAll >= 1000 },
  { id: "hustle3", name: "Proof of Obsession", desc: "Strikes gain another +1% of sats/sec.", cost: 5e8, kind: "hustle", unlock: () => S.clicksAll >= 2500 },
  { id: "hustle4", name: "Proof of Madness", desc: "Strikes gain another +1% of sats/sec.", cost: 5e10, kind: "hustle", unlock: () => S.clicksAll >= 5000 },
  { id: "hustle5", name: "Proof of Devotion", desc: "Strikes gain another +1% of sats/sec.", cost: 5e13, kind: "hustle", unlock: () => S.clicksAll >= 10000 },
  { id: "hustle6", name: "Proof of Divinity", desc: "Strikes gain another +1% of sats/sec.", cost: 5e16, kind: "hustle", unlock: () => S.clicksAll >= 20000 },
  { id: "prefetch", name: "Photon Prefetch", desc: "+2% block odds on every strike.", cost: 5000, kind: "block", unlock: () => S.blocksAll >= 1 },
  { id: "dice", name: "Quantum Dice", desc: "+2% block odds.", cost: 5e6, kind: "block", unlock: () => S.blocksAll >= 25 },
  { id: "merkle", name: "Merkle Mastery", desc: "+2% block odds.", cost: 5e9, kind: "block", unlock: () => S.blocksAll >= 100 },
  { id: "fees", name: "Fee Sniper", desc: "Block rewards ×2.", cost: 2e5, kind: "reward", unlock: () => S.blocksAll >= 5 },
  { id: "mev", name: "MEV Engine", desc: "Block rewards ×2.", cost: 2e8, kind: "reward", unlock: () => S.blocksAll >= 50 },
  { id: "ordinals", name: "Ordinal Inscriptions", desc: "Block rewards ×2.", cost: 2e11, kind: "reward", unlock: () => S.blocksAll >= 250 },
  { id: "pool", name: "Mining Pool", desc: "All production +5%.", cost: 1e4, kind: "net", pct: 0.05, unlock: () => S.runEarned >= 2000 },
  { id: "stratum", name: "Stratum V2", desc: "All production +10%.", cost: 1e6, kind: "net", pct: 0.1, unlock: () => S.runEarned >= 2e5 },
  { id: "ppa", name: "Nuclear PPA", desc: "All production +15%.", cost: 1e9, kind: "net", pct: 0.15, unlock: () => S.runEarned >= 2e8 },
  { id: "grid", name: "Sovereign Grid", desc: "All production +20%.", cost: 1e12, kind: "net", pct: 0.2, unlock: () => S.runEarned >= 2e11 },
  { id: "lightning", name: "Lightning Settlement", desc: "All production +25%.", cost: 1e15, kind: "net", pct: 0.25, unlock: () => S.runEarned >= 2e14 },
  { id: "hyper", name: "Hyperbitcoinization", desc: "All production +50%.", cost: 1e18, kind: "net", pct: 0.5, unlock: () => S.runEarned >= 2e17 },
  { id: "radar", name: "Nonce Radar", desc: "Golden nonces appear 20% more often.", cost: 7.7e4, kind: "gold", unlock: () => S.dropsAll >= 1 },
  { id: "sticky", name: "Sticky Nonces", desc: "Golden nonces stay on screen twice as long.", cost: 7.7e5, kind: "gold", unlock: () => S.dropsAll >= 3 },
  { id: "streak", name: "Lucky Streak", desc: "Golden nonce effects last twice as long.", cost: 7.7e7, kind: "gold", unlock: () => S.dropsAll >= 7 },
  { id: "capacitor", name: "Combo Capacitor", desc: "Combo window 1.5s → 2.5s.", cost: 3000, kind: "combo", unlock: () => S.bestCombo >= 10 },
  { id: "cryo", name: "Cryo Loop", desc: "Ability cooldowns −20%.", cost: 1e7, kind: "ability", unlock: () => S.abilitiesUsed >= 3 },
];
const KIND_ICON = { click: "click", hustle: "click", block: "block", reward: "block", net: "zap", gold: "sparkle", combo: "flame", ability: "snow" };
const KIND_LABEL = { click: "STRIKE", hustle: "STRIKE", block: "BLOCKS", reward: "BLOCKS", net: "NETWORK", gold: "GOLDEN", combo: "COMBO", ability: "ABILITY", rig: "RIG" };

const MODS = [
  { id: "sparks", name: "Hash Sparks", desc: "Strikes spray hex shards. +3% strike power.", cost: 10, icon: "sparkle", click: 0.03 },
  { id: "ripples", name: "Shock Ripples", desc: "Strikes ring out across the bay. +3% strike power.", cost: 30, icon: "ripple", click: 0.03 },
  { id: "ribbon", name: "Ledger Ribbon", desc: "Payouts scroll along the floor. +3% production.", cost: 60, icon: "list", prod: 0.03 },
  { id: "cascade", name: "Hash Cascade", desc: "Hex rains down the walls. +5% production.", cost: 120, icon: "rain", prod: 0.05 },
  { id: "chain", name: "Chain Constellation", desc: "Every block joins the night sky. +1% block odds.", cost: 220, icon: "link", block: 0.01 },
  { id: "stamp", name: "Difficulty Stamps", desc: "A retarget slams down every 25s and pays 20s of production.", cost: 400, icon: "stamp" },
  { id: "terminal", name: "Retro Terminal", desc: "Scanlines over everything. +8% strike power.", cost: 650, icon: "monitor", click: 0.08 },
  { id: "whale", name: "Whale Alerts", desc: "A whale swims by about once a minute. Each pays 45s of production.", cost: 1000, icon: "waves" },
  { id: "glow", name: "Overclock Glow", desc: "The coin burns hot on long combos. Combo cap 30 → 40.", cost: 1500, icon: "flame" },
  { id: "ransom", name: "Ransomware", desc: "Fake lockers pop up. Sweep their wallet for 2 min of production.", cost: 2400, icon: "lock" },
  { id: "worm", name: "Mempool Wormhole", desc: "A warp vignette around the bay. +10% production.", cost: 4000, icon: "orbit", prod: 0.1 },
  { id: "swarm", name: "Drone Swarm", desc: "Drones orbit the coin and strike it 3× per second.", cost: 7000, icon: "drone" },
];

const ABILITIES = [
  { id: "overclock", name: "Overclock", desc: "Rigs ×3 for 30s", cd: 300, icon: "gauge", unlock: () => totalRigs() >= 15, hint: "Own 15 rigs" },
  { id: "storm", name: "Hash Storm", desc: "Auto-strike 15×/s for 10s", cd: 180, icon: "zap", unlock: () => S.clicksAll >= 300, hint: "Strike 300 times" },
  { id: "magnet", name: "Nonce Magnet", desc: "Summon a golden nonce", cd: 600, icon: "magnet", unlock: () => S.dropsAll >= 3, hint: "Catch 3 golden nonces" },
  { id: "hop", name: "Pool Hop", desc: "Collect 15 min of production", cd: 1200, icon: "refresh", unlock: () => S.allEarned >= 1e6, hint: "Mine 1M sats" },
];

const DROPS = [
  { id: "lucky", name: "Lucky Nonce", img: "power-lucky", w: 45 },
  { id: "frenzy", name: "Frenzy", img: "power-overclock", w: 30 },
  { id: "clickfrenzy", name: "Click Frenzy", img: "power-glitch", w: 10 },
  { id: "rush", name: "Block Rush", img: "power-glitch", w: 8 },
  { id: "flush", name: "Coolant Flush", img: "power-coolant", w: 7 },
];
const BUFF_INFO = {
  frenzy: { name: "Frenzy", note: "production ×7", icon: "flame", cls: "b-gold" },
  clickfrenzy: { name: "Click Frenzy", note: "strikes ×777", icon: "click", cls: "b-gold" },
  rush: { name: "Block Rush", note: "+50% block odds", icon: "block", cls: "b-cyan" },
  overclock: { name: "Overclock", note: "rigs ×3", icon: "gauge", cls: "b-orange" },
  storm: { name: "Hash Storm", note: "15 strikes/s", icon: "zap", cls: "b-green" },
};

const PERKS = [
  { id: "cold", name: "Cold Storage", desc: "Offline mining 50% → 100%, cap 8h → 24h.", cost: 1, icon: "shield" },
  { id: "seed", name: "Seed Phrase", desc: "Start each fork with 10 Garage CPUs and 5 GPU Rigs.", cost: 2, icon: "seed" },
  { id: "radar", name: "Golden Eye", desc: "Golden nonces appear 30% more often.", cost: 5, icon: "sparkle" },
  { id: "hour", name: "Golden Hour", desc: "Golden nonce effects last 50% longer.", cost: 10, icon: "clock" },
  { id: "twin", name: "Twin Hash", desc: "+3% block odds.", cost: 15, icon: "block" },
  { id: "nitrogen", name: "Liquid Nitrogen", desc: "Ability cooldowns −25%.", cost: 25, icon: "snow" },
  { id: "ghost", name: "Ghost Miner", desc: "An invisible hand strikes 3× per second.", cost: 40, icon: "ghost" },
  { id: "dopamine", name: "Dopamine Loop", desc: "Stimulation gains ×2.", cost: 60, icon: "flame" },
  { id: "premine", name: "Pre-mine", desc: "Start each fork with 25 of each of the first four rigs.", cost: 100, icon: "server" },
  { id: "genesis", name: "Genesis Block", desc: "Each key level grants +3% instead of +2%.", cost: 150, icon: "key" },
  { id: "mesh", name: "Mesh Network", desc: "+10% production for each rig type you own 100+ of.", cost: 250, icon: "link" },
  { id: "satoshi", name: "Satoshi's Blessing", desc: "All production and strikes ×2.", cost: 500, icon: "sun" },
];

const RANSOMWARE = [
  ["ALL YOUR HASHES BELONG TO US", "Rigs encrypted with a military-grade nonce. Resistance is forked.", "Decrypt (free?!)"],
  ["LOCKERMINER v2.4", "Pay 0.0000 BTC or the fans spin down forever. Yes. Zero.", "Sweep their key"],
  ["your asics are mine now", "The attacker typo'd their own wallet address into the locker.", "Drain attacker"],
];
const WHALES = [
  "4,021 BTC moved to cold storage. Market unimpressed.",
  "880 BTC bought in a single block. Your fees tick up.",
  "An ancient 50 BTC stash from 2010 just woke up.",
  "Exchange wallet reshuffled for no reason anyone can name.",
  "Whale denied everything. The wallet says otherwise.",
];
const NEWS = [
  [() => true, "Difficulty retarget rumored after a quiet hour."],
  [() => true, "Analyst: 'the hash goes up, the number goes up.'"],
  [() => true, "Someone in the garage just found four leading zeros."],
  [() => true, "Local miner insists clicking faster 'just feels right'."],
  [() => S.counts.gpu >= 5, "Gamers report a GPU shortage. Nobody suspects the garage."],
  [() => S.counts.asic >= 10, "The power company sends a fruit basket and a very large bill."],
  [() => S.counts.farm >= 1, "Shipping container spotted humming in a field. Cows unbothered."],
  [() => S.counts.hydro >= 1, "Fish downstream report a slight increase in water temperature."],
  [() => S.counts.immersion >= 1, "Dielectric fluid suppliers post record quarter."],
  [() => S.counts.volcano >= 1, "Volcano erupts. Analysts call it bullish."],
  [() => S.counts.orbital >= 1, "Astronomers baffled by a new constellation shaped like ₿."],
  [() => S.counts.quantum >= 1, "Quantum rig found the nonce and did not find it, simultaneously."],
  [() => S.counts.dyson >= 1, "Sun dims 0.3%. Hashrate up 4,000%."],
  [() => S.blocksAll >= 10, "Mempool is spicy. Fees look like lava."],
  [() => S.forks >= 1, "Chain split drama: both sides claim to be the real one."],
  [() => S.allEarned >= 1e8, "You own a whole bitcoin. Your family still does not get it."],
  [() => S.allEarned >= 1e12, "10,000 BTC. Enough for two pizzas, historically."],
  [() => S.allEarned >= 2.1e15, "Every sat that will ever exist has passed through your hands."],
  [() => S.dropsAll >= 1, "Golden nonces sighted drifting over the server aisles."],
];

/* ---------------- achievements ---------------- */
const ACH = [];
const ach = (id, name, desc, get, target) => ACH.push({ id, name, desc, get, target });
[[1, "First Strike"], [100, "Warming Up"], [1000, "Carpal Tunnel"], [10000, "Noncing Forever"], [50000, "Human ASIC"]]
  .forEach(([n, name]) => ach("c" + n, name, n === 1 ? "Strike the coin once" : `Strike ${fmtPlain(n)} times`, () => S.clicksAll, n));
[[1, "Genesis Block"], [10, "Chain Builder"], [100, "Hundred Deep"], [500, "Satoshi Tier"], [2000, "Longest Chain"]]
  .forEach(([n, name]) => ach("b" + n, name, `Find ${fmtPlain(n)} block${n > 1 ? "s" : ""}`, () => S.blocksAll, n));
[[1e3, "Pocket Change"], [1e5, "Stacking Sats"], [1e6, "Seven Digits"], [1e8, "One Whole Coin"], [1e9, "Ten Bitcoin"],
 [1e11, "Whale in Training"], [1e12, "Pizza Day Revenge"], [1e14, "One Million BTC"], [2.1e15, "21 Million"], [1e18, "Beyond the Cap"]]
  .forEach(([n, name]) => ach("e" + n, name, `Mine ${fmtShort(n)} sats all-time`, () => S.allEarned, n));
[[10, "Humming"], [1e3, "Datacenter at Home"], [1e5, "Industrial"], [1e7, "Grid Operator"], [1e9, "Planetary"], [1e11, "Stellar"]]
  .forEach(([n, name]) => ach("p" + n, name, `Reach ${fmtShort(n)} sats/sec`, () => spsRawBase() * prodMult(true), n));
RIGS.forEach((r) => {
  ach("r1" + r.id, `First ${r.name}`, `Own a ${r.name}`, () => S.counts[r.id], 1);
  ach("r100" + r.id, `${r.name} Fleet`, `Own 100 ${r.name}s`, () => S.counts[r.id], 100);
});
[[1, "Shiny"], [10, "Nonce Hunter"], [50, "Golden Touch"], [200, "Midas Hash"]]
  .forEach(([n, name]) => ach("g" + n, name, `Catch ${n} golden nonce${n > 1 ? "s" : ""}`, () => S.dropsAll, n));
[[20, "In the Zone"], [30, "Impossible Flow"], [40, "Beyond Flow"]]
  .forEach(([n, name]) => ach("k" + n, name, `Reach a ×${n} combo`, () => S.bestCombo, n));
[[1, "Hard Forked"], [5, "Chain Splitter"], [15, "Fork Bomb"]]
  .forEach(([n, name]) => ach("f" + n, name, `Hard fork ${n} time${n > 1 ? "s" : ""}`, () => S.forks, n));
ach("m3", "Getting Loud", "Own 3 mods", () => S.mods.length, 3);
ach("mall", "Maximum Stimulation", "Own every mod", () => S.mods.length, MODS.length);
ach("a10", "Power User", "Use abilities 10 times", () => S.abilitiesUsed, 10);
ach("a100", "Button Masher", "Use abilities 100 times", () => S.abilitiesUsed, 100);

/* ---------------- state ---------------- */
const zeroCounts = () => Object.fromEntries(RIGS.map((r) => [r.id, 0]));
function defaultState() {
  return {
    v: 4,
    sats: 0, runEarned: 0, allEarned: 0,
    stim: 0, stimEarned: 0,
    keys: 0, keysEarned: 0,
    clicks: 0, clicksAll: 0, blocks: 0, blocksAll: 0,
    drops: 0, dropsAll: 0, forks: 0, bestCombo: 0, abilitiesUsed: 0,
    counts: zeroCounts(), ups: [], mods: [], modsOff: [], perks: [], ach: [], abUnlocked: [],
    cd: {}, buffs: {},
    settings: { sound: true, vol: 0.6, shake: "subtle", fx: "full", fmt: "short", buy: "1" },
    playTime: 0, runStart: Date.now(), firstPlay: Date.now(), lastSave: Date.now(),
  };
}
function load() {
  const d = defaultState();
  try {
    const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
    if (raw) {
      return { ...d, ...raw, counts: { ...zeroCounts(), ...(raw.counts || {}) }, settings: { ...d.settings, ...(raw.settings || {}) } };
    }
    // carry an old v3 chain forward: its lifetime becomes all-time earnings, claimable as keys on the first fork
    const old = JSON.parse(localStorage.getItem(LEGACY_KEY) || "null");
    if (old && old.lifetimeTotal > 0) {
      d.allEarned = old.lifetimeTotal;
      d.legacy = true;
    }
  } catch (_) {}
  return d;
}
const S = load();
let OWN = new Set(S.ups);
let combo = 0, comboUntil = 0;

function save() {
  S.lastSave = Date.now();
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (_) {}
}

/* ---------------- math ---------------- */
const now = () => Date.now();
const owns = (id) => OWN.has(id);
const hasMod = (id) => S.mods.includes(id);
const modVisual = (id) => hasMod(id) && !S.modsOff.includes(id) && S.settings.fx !== "off";
const hasPerk = (id) => S.perks.includes(id);
const buffOn = (id) => (S.buffs[id] || 0) > now();
const totalRigs = () => RIGS.reduce((s, r) => s + S.counts[r.id], 0);

function rigMult(id) {
  const n = S.counts[id];
  let m = 1;
  for (let i = 0; i < RIG_TIERS.length; i++) if (OWN.has(`r:${id}:${i}`)) m *= 2;
  for (const ms of MILESTONES) if (n >= ms) m *= 2;
  return m;
}
const unitRate = (r) => r.rate * rigMult(r.id);
function spsRawBase() { return RIGS.reduce((s, r) => s + S.counts[r.id] * unitRate(r), 0); }
const achMult = () => 1 + S.ach.length * 0.01;
const keyMult = () => 1 + S.keysEarned * (hasPerk("genesis") ? 0.03 : 0.02);
function prodMult(noBuff) {
  let pct = 1;
  for (const u of GLOBAL_UPS) if (u.pct && owns(u.id)) pct += u.pct;
  let modPct = 1;
  for (const m of MODS) if (m.prod && hasMod(m.id)) modPct += m.prod;
  let mesh = 1;
  if (hasPerk("mesh")) for (const r of RIGS) if (S.counts[r.id] >= 100) mesh += 0.1;
  let m = pct * modPct * mesh * achMult() * keyMult() * (hasPerk("satoshi") ? 2 : 1);
  if (!noBuff) {
    if (buffOn("frenzy")) m *= 7;
    if (buffOn("overclock")) m *= 3;
  }
  return m;
}
const sps = () => spsRawBase() * prodMult(false);
const spsBase = () => spsRawBase() * prodMult(true);

const comboCap = () => (hasMod("glow") ? 40 : 30);
const comboWindow = () => (owns("capacitor") ? 2.5 : 1.5);
const comboNow = () => (comboUntil > now() ? combo : 0);
const comboMult = () => 1 + comboNow() * 0.03;
function clickPower() {
  let base = 1;
  if (owns("paste")) base *= 2;
  if (owns("firmware")) base *= 2;
  if (owns("silicon")) base *= 2;
  let hustle = 0;
  for (let i = 1; i <= 6; i++) if (owns("hustle" + i)) hustle += 0.01;
  let modPct = 1;
  for (const m of MODS) if (m.click && hasMod(m.id)) modPct += m.click;
  let p = (base + sps() * hustle) * modPct * achMult() * keyMult() * (hasPerk("satoshi") ? 2 : 1) * comboMult();
  if (buffOn("clickfrenzy")) p *= 777;
  return p;
}
function blockChance() {
  let c = 0.03;
  for (const id of ["prefetch", "dice", "merkle"]) if (owns(id)) c += 0.02;
  if (hasMod("chain")) c += 0.01;
  if (hasPerk("twin")) c += 0.03;
  if (buffOn("rush")) c += 0.5;
  return Math.min(0.75, c);
}
function blockMult() { let m = 1; for (const id of ["fees", "mev", "ordinals"]) if (owns(id)) m *= 2; return m; }
const blockReward = (p) => (p * 15 + sps() * 10) * blockMult();
const stimMult = () => (hasPerk("dopamine") ? 2 : 1);
const cdMult = () => (owns("cryo") ? 0.8 : 1) * (hasPerk("nitrogen") ? 0.75 : 1);
const dropStay = () => 13000 * (owns("sticky") ? 2 : 1);
const dropEffectMult = () => (owns("streak") ? 2 : 1) * (hasPerk("hour") ? 1.5 : 1);
const dropFreq = () => (owns("radar") ? 1.2 : 1) * (hasPerk("radar") ? 1.3 : 1);
const offlineRate = () => (hasPerk("cold") ? 1 : 0.5);
const offlineCap = () => (hasPerk("cold") ? 86400 : 28800);

const rigCost = (r, n, k) => (r.base * Math.pow(GROWTH, n) * (Math.pow(GROWTH, k) - 1)) / (GROWTH - 1);
function maxAfford(r, n, sats) {
  const k = Math.floor(Math.log((sats * (GROWTH - 1)) / (r.base * Math.pow(GROWTH, n)) + 1) / Math.log(GROWTH));
  return Math.max(0, k);
}
function buyQty(r) {
  const b = S.settings.buy;
  if (b === "max") return Math.max(1, maxAfford(r, S.counts[r.id], S.sats));
  return +b;
}
const keysFor = (all) => Math.floor(Math.cbrt(all / 1e7));
const pendingKeys = () => Math.max(0, keysFor(S.allEarned) - S.keysEarned);
const nextKeyAt = () => 1e7 * Math.pow(keysFor(S.allEarned) + 1, 3);

function credit(n) { if (!(n > 0)) return; S.sats += n; S.runEarned += n; S.allEarned += n; }
function gainStim(n) { n *= stimMult(); S.stim += n; S.stimEarned += n; }

/* ---------------- formatting ---------------- */
function fmtPlain(n) { return Math.floor(n).toLocaleString("en-US"); }
function fmtShort(n) {
  if (n < 1000) return String(Math.floor(n));
  const i = Math.floor(Math.log10(n) / 3);
  if (i >= SUF.length) return n.toExponential(2).replace("e+", "e");
  const v = n / Math.pow(1000, i);
  return (v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2)) + SUF[i];
}
function fmt(n, dec) {
  if (!isFinite(n)) return "∞";
  if (n < 0) return "-" + fmt(-n, dec);
  if (n < 1000) {
    if (dec && n < 100 && n % 1 !== 0) return n < 10 ? n.toFixed(1) : n.toFixed(1).replace(/\.0$/, "");
    return String(Math.floor(n));
  }
  if (S.settings.fmt === "sci" && n >= 1e6) return n.toExponential(2).replace("e+", "e");
  if (n < 1e6) return fmtPlain(n);
  return fmtShort(n);
}
function fmtTime(sec) {
  sec = Math.max(0, Math.round(sec));
  if (sec < 60) return sec + "s";
  const m = Math.floor(sec / 60), s = sec % 60;
  if (m < 60) return `${m}m ${String(s).padStart(2, "0")}s`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h}h ${String(m % 60).padStart(2, "0")}m`;
  return `${Math.floor(h / 24)}d ${h % 24}h`;
}
const hex = (n) => { let s = ""; for (let i = 0; i < n; i++) s += HEX[(Math.random() * 16) | 0]; return s; };
const btc = (sats) => "₿ " + (sats / 1e8).toFixed(sats >= 1e12 ? 0 : sats >= 1e9 ? 2 : 8);

/* ---------------- audio ---------------- */
let AC = null, master = null;
const lastTone = {};
function audio() {
  try {
    if (!AC) {
      AC = new (window.AudioContext || window.webkitAudioContext)();
      master = AC.createGain(); master.connect(AC.destination);
    }
    if (AC.state === "suspended") AC.resume();
    master.gain.value = S.settings.vol;
    return AC;
  } catch (_) { return null; }
}
function tone(f, d = 0.08, v = 0.05, type = "square", slide = 0, delay = 0) {
  if (!S.settings.sound) return;
  const ac = audio(); if (!ac) return;
  try {
    const t0 = ac.currentTime + delay;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + slide), t0 + d);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(v, t0 + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + d + 0.03);
  } catch (_) {}
}
function throttled(key, ms) { const t = performance.now(); if (t - (lastTone[key] || 0) < ms) return false; lastTone[key] = t; return true; }
const sfx = {
  strike(c) { if (throttled("strike", 35)) tone(260 + Math.min(c, 40) * 14, 0.05, 0.035, "triangle"); },
  block() { if (!throttled("block", 180)) return; tone(660, 0.09, 0.05, "square"); tone(990, 0.14, 0.05, "square", 0, 0.08); tone(1320, 0.18, 0.035, "sine", 0, 0.16); },
  buy() { tone(520, 0.06, 0.045, "triangle"); tone(780, 0.09, 0.045, "triangle", 0, 0.06); },
  bigbuy() { tone(392, 0.07, 0.05, "triangle"); tone(523, 0.07, 0.05, "triangle", 0, 0.06); tone(784, 0.14, 0.05, "triangle", 0, 0.12); },
  deny() { tone(140, 0.08, 0.035, "square"); },
  drop() { tone(880, 0.12, 0.04, "sine"); tone(1175, 0.14, 0.035, "sine", 0, 0.09); },
  catch() { [784, 988, 1175, 1568].forEach((f, i) => tone(f, 0.12, 0.045, "sine", 0, i * 0.055)); },
  ability() { tone(220, 0.22, 0.05, "sawtooth", 440); },
  ach() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.16, 0.04, "triangle", 0, i * 0.07)); },
  stamp() { tone(90, 0.16, 0.07, "sawtooth", -40); },
  whale() { tone(98, 0.5, 0.05, "sine", -20); },
  ransom() { tone(520, 0.09, 0.04, "sawtooth"); tone(392, 0.12, 0.04, "sawtooth", 0, 0.11); },
  fork() { tone(400, 0.6, 0.07, "sawtooth", -320); tone(100, 0.8, 0.06, "sine", 200, 0.3); },
};

/* ---------------- DOM refs ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
hydrateIcons();
const el = {
  balance: $("#balance"), sps: $("#sps"), btc: $("#btc"), stim: $("#stim"), keys: $("#keys"),
  coin: $("#coin"), coreCard: $("#coreCard"), coreShake: $("#coreShake"), hash: $("#hashDisplay"),
  blockOdds: $("#blockOdds"), clickPower: $("#clickPower"), combo: $("#combo"), comboBar: $("#comboBar"),
  buffs: $("#buffs"), abilities: $("#abilities"), goal: $("#goalCard"), news: $("#news"),
  rigList: $("#rigList"), rigNote: $("#rigNote"), upList: $("#upList"), ownedGrid: $("#ownedGrid"), ownedCount: $("#ownedCount"),
  modGrid: $("#modGrid"), forkHero: $("#forkHero"), perkGrid: $("#perkGrid"), trophyGrid: $("#trophyGrid"), trophyTitle: $("#trophyTitle"),
  statsGrid: $("#statsGrid"), toasts: $("#toasts"), dropLayer: $("#dropLayer"), modalBack: $("#modalBack"), modal: $("#modal"),
  mute: $("#muteBtn"),
};
function setText(node, v) { if (node._v !== v) { node._v = v; node.textContent = v; } }
function setHTML(node, v) { if (node._h !== v) { node._h = v; node.innerHTML = v; } }
function setCls(node, cls, on) { if (node.classList.contains(cls) !== !!on) node.classList.toggle(cls, !!on); }

/* ---------------- toasts ---------------- */
function toast(msg, kind = "") {
  const t = document.createElement("div");
  t.className = "toast " + kind;
  t.innerHTML = msg;
  el.toasts.prepend(t);
  while (el.toasts.children.length > 3) el.toasts.lastChild.remove();
  setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 300); }, 3200);
}

/* ---------------- canvas fx ---------------- */
const canvas = $("#fx");
const ctx = canvas.getContext("2d");
const bgCanvas = $("#bgfx");
const bctx = bgCanvas.getContext("2d");
let DPR = 1;
let coinX = 0, coinY = 0, coinR = 100, coinAt = 0, coinOnScreen = true;
function resize() {
  DPR = Math.min(2, window.devicePixelRatio || 1);
  for (const [cv, c] of [[canvas, ctx], [bgCanvas, bctx]]) {
    cv.width = innerWidth * DPR; cv.height = innerHeight * DPR;
    cv.style.width = innerWidth + "px"; cv.style.height = innerHeight + "px";
    c.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  coinAt = 0;
}
resize(); addEventListener("resize", resize);
const particles = [], ripples = [], chainNodes = [], ribbon = [];
function coinCenter() {
  const t = performance.now();
  if (t - coinAt > 300) {
    coinAt = t;
    const b = el.coin.getBoundingClientRect();
    coinX = b.left + b.width / 2; coinY = b.top + b.height / 2; coinR = b.width / 2;
    coinOnScreen = b.bottom > 70 && b.top < innerHeight;
  }
}
const budget = () => (S.settings.fx === "full" ? 220 : S.settings.fx === "lite" ? 70 : 0);
const FONTS = {};
const font = (sz, mono) => FONTS[sz + (mono ? "m" : "s")] || (FONTS[sz + (mono ? "m" : "s")] = `600 ${sz}px ${mono ? "'IBM Plex Mono'" : "'Space Grotesk'"}, monospace`);
function spray(x, y, n, big) {
  if (S.settings.fx !== "full") n = Math.ceil(n / 3);
  if (particles.length + n > budget()) n = Math.max(0, budget() - particles.length);
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, spd = 70 + Math.random() * (big ? 320 : 180);
    particles.push({ x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd - 60, life: 1, decay: 1.3, text: HEX[(Math.random() * 16) | 0],
      c: i % 3 === 0 ? "#f7931a" : i % 3 === 1 ? "#c8f24a" : "#3ec8e8", sz: big ? 14 : 11, mono: true, g: 260 });
  }
}
function floater(x, y, text, kind = "") {
  if (S.settings.fx === "off") return;
  if (particles.length > budget() + 40) return;
  const big = kind === "block" || kind === "gold";
  particles.push({ x: x + (Math.random() - 0.5) * 24, y, vx: (Math.random() - 0.5) * 20, vy: big ? -70 : -95, life: 1, decay: big ? 0.7 : 1.1,
    text, c: kind === "block" ? "#c8f24a" : kind === "gold" ? "#ffd166" : kind === "auto" ? "rgba(241,236,226,.55)" : "#f1ece2",
    sz: big ? 22 : kind === "auto" ? 12 : 15, mono: false, g: 0, float: true });
}
function ribbonPush(text) {
  if (!modVisual("ribbon")) return;
  ribbon.push({ text, x: innerWidth + 20 });
  if (ribbon.length > 14) ribbon.shift();
}
function addChainNode() {
  if (!hasMod("chain")) return;
  chainNodes.push({ x: 20 + Math.random() * (innerWidth - 40), y: 70 + Math.random() * (innerHeight * 0.7), born: performance.now(), seed: Math.random() * 10 });
  if (chainNodes.length > 80) chainNodes.shift();
}
const droneSprite = document.createElement("canvas");
droneSprite.width = droneSprite.height = 22;
{
  const c = droneSprite.getContext("2d");
  c.strokeStyle = "#3ec8e8"; c.lineWidth = 2;
  c.beginPath(); c.moveTo(11, 2); c.lineTo(20, 11); c.lineTo(11, 20); c.lineTo(2, 11); c.closePath(); c.stroke();
  c.fillStyle = "#c8f24a"; c.fillRect(9, 9, 4, 4);
}

/* ---------------- shake: the coin panel only, hand-found blocks only ---------------- */
let trauma = 0, lastShakeAt = 0, shakeCount = 0;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
function shake(amt) {
  if (S.settings.shake === "off" || reducedMotion.matches) return;
  const t = performance.now();
  if (t - lastShakeAt < 1200) return; // never chain shakes back to back
  lastShakeAt = t;
  shakeCount++;
  trauma = Math.min(1, trauma + amt);
}

/* ---------------- core actions ---------------- */
let lastBanner = null, lastBannerAt = 0, bannerCount = 0;
function blockBanner(pay) {
  const t = performance.now();
  if (lastBanner && lastBanner.isConnected && t - lastBannerAt < 900) {
    bannerCount++;
    lastBanner.querySelector("b").textContent = `BLOCK ×${bannerCount}`;
    lastBanner.querySelector("span").textContent = `+${fmt(pay)} sats`;
    return;
  }
  bannerCount = 1;
  lastBannerAt = t;
  const b = document.createElement("div");
  b.className = "block-flash";
  b.innerHTML = `<b>BLOCK FOUND</b><span>+${fmt(pay)} sats</span><small>NONCE 0000${hex(4)}</small>`;
  el.coreCard.appendChild(b);
  lastBanner = b;
  setTimeout(() => b.remove(), 1100);
}

let critShownAt = 0;
function scramble() {
  if (performance.now() - critShownAt < 500) return;
  el.hash.textContent = hex(8);
}
function scrambleCrit() {
  critShownAt = performance.now();
  el.hash.innerHTML = `<span class="zero">0000</span>${hex(4)}`;
}

// kind: "manual" (a real click or key press) | "storm" (Hash Storm ability) | "auto" (swarm / ghost miner)
function strike(x, y, kind) {
  const t = now();
  const handish = kind !== "auto";
  const show = kind === "manual" || coinOnScreen;
  if (handish) {
    combo = Math.min(comboCap(), (comboUntil > t ? combo : 0) + 1);
    comboUntil = t + comboWindow() * 1000;
    if (combo > S.bestCombo) S.bestCombo = combo;
    S.clicks++; S.clicksAll++;
  }
  let p = clickPower();
  if (kind === "auto") p *= 0.5;
  const crit = Math.random() < blockChance();
  const pay = crit ? blockReward(p) : p;
  credit(pay);
  gainStim(handish ? 1 + Math.floor(comboNow() / 10) : 0.25);

  if (crit) {
    S.blocks++; S.blocksAll++;
    gainStim(5);
    addChainNode();
    scrambleCrit();
    if (kind === "manual") {
      blockBanner(pay);
      shake(0.8);
      sfx.block();
    } else {
      if (show) floater(x, y - 20, `BLOCK +${fmt(pay)}`, "block");
      if (kind === "storm") sfx.block();
    }
    if (kind !== "auto" && show) spray(x, y, 24, true);
  } else if (kind === "manual") {
    sfx.strike(combo);
  }
  if (show && (!crit || kind === "manual")) floater(x, y - 10, `+${fmt(pay)}`, kind === "auto" ? "auto" : "");
  if (kind === "manual" && !crit) spray(x, y, modVisual("sparks") ? 10 : 4);
  if (kind !== "auto" && show && modVisual("ripples")) ripples.push({ x, y, r: 10, life: 1 });
  if (kind === "manual") ribbonPush(`${hex(6)}  +${fmt(pay)}`);
}

function pressCoin() {
  el.coin.classList.remove("press");
  void el.coin.offsetWidth;
  el.coin.classList.add("press");
}

function buyRig(id) {
  const r = RIG[id];
  const n = S.counts[id];
  const k = buyQty(r);
  const cost = rigCost(r, n, k);
  if (S.sats < cost || k < 1) { sfx.deny(); return; }
  S.sats -= cost;
  const before = n;
  S.counts[id] += k;
  const hitMs = MILESTONES.find((m) => before < m && S.counts[id] >= m);
  if (hitMs) { toast(`${icon("zap")}<span><b>${r.name} milestone</b> ${hitMs} owned: output ×2</span>`, "t-gold"); sfx.bigbuy(); }
  else sfx.buy();
  if (before === 0) toast(`${icon("server")}<span><b>${r.name}</b> is online.</span>`);
  const row = rowEls[id];
  if (row) { row.row.classList.remove("bought"); void row.row.offsetWidth; row.row.classList.add("bought"); }
  afterPurchase();
}
function upgradeById(id) {
  if (id.startsWith("r:")) {
    const [, rid, i] = id.split(":");
    const r = RIG[rid], t = RIG_TIERS[+i];
    return { id, name: `${t.name} ${r.name}`, desc: `${r.name} output ×2.`, cost: r.base * t.mult, kind: "rig", rig: r, tier: +i, unlock: () => S.counts[rid] >= t.need };
  }
  return GLOBAL_UPS.find((u) => u.id === id);
}
const ALL_UPS = [...GLOBAL_UPS.map((u) => u.id), ...RIGS.flatMap((r) => RIG_TIERS.map((_, i) => `r:${r.id}:${i}`))].map(upgradeById);
function buyUpgrade(id, quiet) {
  const u = ALL_UPS.find((x) => x.id === id);
  if (!u || owns(id) || !u.unlock()) return false;
  if (S.sats < u.cost) { if (!quiet) sfx.deny(); return false; }
  S.sats -= u.cost;
  S.ups.push(id); OWN.add(id);
  if (!quiet) { sfx.buy(); toast(`${icon("chip")}<span><b>${u.name}</b> installed.</span>`); afterPurchase(); }
  return true;
}
function buyAllUpgrades() {
  const list = availableUpgrades().filter((u) => u.cost <= S.sats);
  let n = 0;
  for (const u of list) if (buyUpgrade(u.id, true)) n++;
  if (n) { sfx.bigbuy(); toast(`${icon("chip")}<span><b>${n} upgrade${n > 1 ? "s" : ""}</b> installed.</span>`); afterPurchase(); }
  else sfx.deny();
}
function buyMod(id) {
  const m = MODS.find((x) => x.id === id);
  if (hasMod(id)) return;
  if (S.stim < m.cost) { sfx.deny(); toast(`${icon("sparkle")}<span>Need <b>${fmt(Math.ceil(m.cost - S.stim))}</b> more stimulation.</span>`); return; }
  S.stim -= m.cost; S.mods.push(id);
  sfx.bigbuy(); toast(`${icon(m.icon)}<span><b>${m.name}</b> unlocked.</span>`, "t-cyan");
  coinCenter(); spray(coinX, coinY, 30, true);
  afterPurchase();
}
function toggleModVisual(id) {
  const i = S.modsOff.indexOf(id);
  if (i >= 0) S.modsOff.splice(i, 1); else S.modsOff.push(id);
  save(); renderMods(true);
}
function buyPerk(id) {
  const p = PERKS.find((x) => x.id === id);
  if (hasPerk(id)) return;
  if (S.keys < p.cost) { sfx.deny(); return; }
  S.keys -= p.cost; S.perks.push(id);
  if (id === "seed") { S.counts.cpu += 10; S.counts.gpu += 5; }
  if (id === "premine") for (const r of ["cpu", "gpu", "fpga", "asic"]) S.counts[r] += 25;
  sfx.bigbuy(); toast(`${icon(p.icon)}<span><b>${p.name}</b> is permanent.</span>`, "t-gold");
  afterPurchase();
}
function afterPurchase() {
  save();
  renderAll(true);
}

/* ---------------- abilities ---------------- */
function abilityReady(a) { return (S.cd[a.id] || 0) <= now(); }
function abilityUnlocked(a) {
  if (S.abUnlocked.includes(a.id)) return true;
  if (a.unlock()) { S.abUnlocked.push(a.id); toast(`${icon(a.icon)}<span>Ability unlocked: <b>${a.name}</b></span>`, "t-cyan"); buildAbilities(); return true; }
  return false;
}
function useAbility(id) {
  const a = ABILITIES.find((x) => x.id === id);
  if (!a || !S.abUnlocked.includes(id)) return;
  if (!abilityReady(a)) { sfx.deny(); return; }
  S.cd[id] = now() + a.cd * cdMult() * 1000;
  S.abilitiesUsed++;
  sfx.ability();
  if (id === "overclock") S.buffs.overclock = now() + 30000;
  else if (id === "storm") S.buffs.storm = now() + 10000;
  else if (id === "magnet") spawnDrop(true);
  else if (id === "hop") {
    const g = spsBase() * 900;
    credit(g);
    coinCenter(); floater(coinX, coinY - 40, `+${fmt(g)}`, "gold");
    toast(`${icon("refresh")}<span>Pool hop paid out <b>${fmt(g)} sats</b>.</span>`, "t-gold");
  }
  save();
  renderCore();
}

/* ---------------- golden nonces ---------------- */
let nextDropAt = now() + 45000;
let dropId = 1;
const liveDrops = [];
function scheduleDrop() { nextDropAt = now() + ((60 + Math.random() * 90) * 1000) / dropFreq(); }
function spawnDrop(forced) {
  if (liveDrops.length >= (forced ? 3 : 1)) return;
  let pick = Math.random() * DROPS.reduce((s, d) => s + d.w, 0);
  let spec = DROPS[0];
  for (const d of DROPS) { pick -= d.w; if (pick <= 0) { spec = d; break; } }
  const b = document.createElement("button");
  b.type = "button";
  b.className = "gold-drop";
  b.setAttribute("aria-label", "Golden nonce");
  const margin = 70;
  b.style.left = margin + Math.random() * (innerWidth - margin * 2) + "px";
  b.style.top = 90 + Math.random() * (innerHeight - 90 - margin * 1.5) + "px";
  b.innerHTML = `<img src="${T}power-lucky.webp" alt="" draggable="false" />`;
  const drop = { id: dropId++, spec, el: b };
  b.addEventListener("pointerdown", (e) => { e.preventDefault(); e.stopPropagation(); catchDrop(drop, e.clientX, e.clientY); });
  el.dropLayer.appendChild(b);
  liveDrops.push(drop);
  sfx.drop();
  const stay = dropStay();
  b.style.setProperty("--stay", stay + "ms");
  drop.timer = setTimeout(() => removeDrop(drop, true), stay);
}
function removeDrop(drop, missed) {
  const i = liveDrops.indexOf(drop);
  if (i >= 0) liveDrops.splice(i, 1);
  clearTimeout(drop.timer);
  if (missed) { drop.el.classList.add("gone"); setTimeout(() => drop.el.remove(), 400); }
  else drop.el.remove();
}
function catchDrop(drop, x, y) {
  removeDrop(drop, false);
  S.drops++; S.dropsAll++;
  gainStim(10);
  let kind = drop.spec.id;
  if (kind === "flush" && !ABILITIES.some((a) => S.abUnlocked.includes(a.id) && !abilityReady(a))) kind = "lucky";
  const mult = dropEffectMult();
  let msg;
  if (kind === "lucky") {
    const g = Math.min(S.sats * 0.15, spsBase() * 900) + 13 + clickPower() * 10;
    credit(g);
    floater(x, y, `+${fmt(g)}`, "gold");
    msg = `<b>Lucky nonce!</b> +${fmt(g)} sats`;
  } else if (kind === "frenzy") {
    S.buffs.frenzy = now() + 77000 * mult;
    msg = `<b>Frenzy!</b> Production ×7 for ${Math.round(77 * mult)}s`;
  } else if (kind === "clickfrenzy") {
    S.buffs.clickfrenzy = now() + 13000 * mult;
    msg = `<b>Click Frenzy!</b> Strikes ×777 for ${Math.round(13 * mult)}s. Go go go!`;
  } else if (kind === "rush") {
    S.buffs.rush = now() + 30000 * mult;
    msg = `<b>Block Rush!</b> +50% block odds for ${Math.round(30 * mult)}s`;
  } else if (kind === "flush") {
    for (const a of ABILITIES) S.cd[a.id] = 0;
    msg = `<b>Coolant flush!</b> Every ability is ready`;
  }
  toast(`<img class="t-img" src="${T}power-lucky.webp" alt="" /><span>${msg}</span>`, "t-gold");
  spray(x, y, 36, true);
  shake(0.6);
  sfx.catch();
  save();
  renderCore();
}

/* ---------------- mod events ---------------- */
let stampAt = now() + 25000, whaleAt = now() + 60000, ransomAt = now() + 45000;
function modEvents(t) {
  if (hasMod("stamp") && t >= stampAt) {
    stampAt = t + 25000;
    const pay = Math.max(30, spsBase() * 20 + clickPower() * 5);
    credit(pay);
    ribbonPush(`${hex(6)}  +${fmt(pay)}`);
    if (modVisual("stamp")) {
      const up = Math.random() < 0.55;
      const s = document.createElement("div");
      s.className = "stamp " + (up ? "up" : "down");
      s.innerHTML = `DIFFICULTY ${up ? "▲" : "▼"} ${(0.4 + Math.random() * 4.8).toFixed(1)}%<small>+${fmt(pay)} sats</small>`;
      s.style.left = 30 + Math.random() * 40 + "vw";
      s.style.top = 20 + Math.random() * 40 + "vh";
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1500);
      sfx.stamp();
    }
  }
  if (hasMod("whale") && t >= whaleAt) {
    whaleAt = t + (50 + Math.random() * 30) * 1000;
    const pay = Math.max(40, spsBase() * 45);
    credit(pay); gainStim(3);
    if (modVisual("whale") && !$(".whale")) {
      const w = document.createElement("div");
      w.className = "whale";
      w.innerHTML = `<span>WHALE ALERT</span> ${WHALES[(Math.random() * WHALES.length) | 0]} <b>+${fmt(pay)} sats</b>`;
      document.body.appendChild(w);
      setTimeout(() => w.remove(), 6300);
      sfx.whale();
    } else toast(`${icon("waves")}<span>A whale passed: <b>+${fmt(pay)} sats</b></span>`);
  }
  if (hasMod("ransom") && t >= ransomAt) {
    ransomAt = t + (45 + Math.random() * 30) * 1000;
    if (modVisual("ransom")) spawnRansom();
  }
}
function spawnRansom() {
  if ($$(".ransom").length >= 2) return;
  const [title, body, cta] = RANSOMWARE[(Math.random() * RANSOMWARE.length) | 0];
  const r = document.createElement("div");
  r.className = "ransom";
  r.style.left = Math.max(12, Math.random() * (innerWidth - 300)) + "px";
  r.style.top = 90 + Math.random() * Math.max(40, innerHeight - 320) + "px";
  r.style.rotate = (Math.random() * 4 - 2) + "deg";
  r.innerHTML = `<div class="ransom-bar"><span>${icon("lock")} ${title}</span><button type="button" aria-label="Close">${icon("x")}</button></div>
    <div class="ransom-body">${body}<pre>${hex(12)}…${hex(6)}</pre></div>
    <button type="button" class="ransom-claim">${cta}</button>`;
  document.body.appendChild(r);
  sfx.ransom();
  r.querySelector(".ransom-claim").onclick = () => {
    const pay = Math.max(60, spsBase() * 120);
    credit(pay); gainStim(3);
    const b = r.getBoundingClientRect();
    floater(b.left + b.width / 2, b.top + 40, `+${fmt(pay)}`, "gold");
    toast(`${icon("lock")}<span>Wallet swept: <b>+${fmt(pay)} sats</b></span>`, "t-gold");
    sfx.catch(); r.remove(); save();
  };
  r.querySelector(".ransom-bar button").onclick = () => r.remove();
  setTimeout(() => r.isConnected && r.remove(), 16000);
}

/* ---------------- hard fork ---------------- */
function forkReset() {
  S.sats = 0; S.runEarned = 0; S.clicks = 0; S.blocks = 0; S.drops = 0;
  S.counts = zeroCounts(); S.ups = []; OWN = new Set();
  S.buffs = {}; S.runStart = now();
  combo = 0; comboUntil = 0;
  if (hasPerk("seed")) { S.counts.cpu += 10; S.counts.gpu += 5; }
  if (hasPerk("premine")) for (const id of ["cpu", "gpu", "fpga", "asic"]) S.counts[id] += 25;
}
function doFork() {
  const k = pendingKeys();
  if (k < 1) return;
  S.keysEarned += k; S.keys += k; S.forks++;
  delete S.legacy;
  forkReset();
  closeModal();
  sfx.fork();
  document.body.classList.add("forking");
  setTimeout(() => document.body.classList.remove("forking"), 1200);
  toast(`${icon("fork")}<span><b>Hard fork #${S.forks}.</b> +${k} keys. Everything now earns ×${keyMult().toFixed(2)}.</span>`, "t-gold");
  save();
  buildRigs();
  renderAll(true);
}
function confirmFork() {
  const k = pendingKeys();
  if (k < 1) return;
  const newMult = 1 + (S.keysEarned + k) * (hasPerk("genesis") ? 0.03 : 0.02);
  openModal(`
    <div class="modal-icon m-orange">${icon("fork")}</div>
    <h2>Hard fork the chain?</h2>
    <p>Your sats, rigs and upgrades reset. You keep mods, trophies, perks, stimulation and keys.</p>
    <div class="modal-stats">
      <div><small>Keys gained</small><b class="c-gold">+${fmt(k)}</b></div>
      <div><small>Permanent bonus</small><b>×${keyMult().toFixed(2)} → ×${newMult.toFixed(2)}</b></div>
    </div>
    <div class="modal-actions">
      <button type="button" class="btn" data-close>Keep mining</button>
      <button type="button" class="btn btn-primary" id="forkConfirm">Fork it</button>
    </div>`);
  $("#forkConfirm").onclick = doFork;
}

/* ---------------- modal ---------------- */
let modalOpen = false;
function openModal(html) {
  el.modal.innerHTML = html;
  el.modalBack.hidden = false;
  modalOpen = true;
  setTimeout(() => el.modalBack.classList.add("show"), 16);
  el.modal.querySelectorAll("[data-close]").forEach((b) => (b.onclick = closeModal));
}
function closeModal() {
  if (!modalOpen) return;
  modalOpen = false;
  el.modalBack.classList.remove("show");
  setTimeout(() => { if (!modalOpen) el.modalBack.hidden = true; }, 200);
}
el.modalBack.addEventListener("pointerdown", (e) => { if (e.target === el.modalBack) closeModal(); });

function openSettings() {
  const st = S.settings;
  const seg = (key, opts) => `<div class="seg seg-full" data-setting="${key}">${opts.map(([v, l]) => `<button type="button" data-val="${v}" class="${String(st[key]) === v ? "on" : ""}">${l}</button>`).join("")}</div>`;
  openModal(`
    <div class="modal-head"><h2>Settings</h2><button type="button" class="icon-btn" data-close aria-label="Close">${icon("x")}</button></div>
    <div class="set-row"><div><b>Sound</b><small>Clicks, blocks, drops</small></div>${seg("sound", [["true", "On"], ["false", "Off"]])}</div>
    <div class="set-row"><div><b>Volume</b></div><input type="range" min="0" max="1" step="0.05" value="${st.vol}" id="volRange" /></div>
    <div class="set-row"><div><b>Screen shake</b><small>Only the coin panel, only on blocks you find by hand</small></div>${seg("shake", [["off", "Off"], ["subtle", "Subtle"], ["full", "Full"]])}</div>
    <div class="set-row"><div><b>Particles</b><small>Hex shards, floaters, mod visuals</small></div>${seg("fx", [["off", "Off"], ["lite", "Lite"], ["full", "Full"]])}</div>
    <div class="set-row"><div><b>Numbers</b></div>${seg("fmt", [["short", "1.23M"], ["sci", "1.23e6"]])}</div>
    <div class="set-divider"></div>
    <div class="set-row"><div><b>Save</b><small>Autosaves every 10 seconds</small></div>
      <div class="set-btns"><button type="button" class="btn" id="exportBtn">Export</button><button type="button" class="btn" id="importBtn">Import</button></div></div>
    <textarea id="saveBox" class="save-box" rows="3" placeholder="Paste a save here, then press Import" hidden></textarea>
    <div class="set-row danger"><div><b>Wipe everything</b><small>Deletes this save for good</small></div><button type="button" class="btn btn-danger" id="wipeBtn">Wipe save</button></div>
  `);
  el.modal.querySelectorAll("[data-setting]").forEach((g) => {
    g.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      const key = g.dataset.setting;
      let v = b.dataset.val;
      if (key === "sound") v = v === "true";
      S.settings[key] = v;
      g.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
      if (key === "sound") renderMute();
      save(); renderAll(true);
    });
  });
  $("#volRange").oninput = (e) => { S.settings.vol = +e.target.value; if (master) master.gain.value = S.settings.vol; };
  $("#volRange").onchange = () => { save(); tone(660, 0.08, 0.05, "triangle"); };
  const box = $("#saveBox");
  $("#exportBtn").onclick = () => {
    save();
    box.hidden = false;
    box.value = btoa(unescape(encodeURIComponent(JSON.stringify(S))));
    box.select();
    try { navigator.clipboard.writeText(box.value); toast(`${icon("check")}<span>Save copied to clipboard.</span>`); } catch (_) {}
  };
  $("#importBtn").onclick = () => {
    if (box.hidden) { box.hidden = false; box.value = ""; box.focus(); return; }
    try {
      const data = JSON.parse(decodeURIComponent(escape(atob(box.value.trim()))));
      if (!data || data.v !== 4) throw new Error("bad");
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      location.reload();
    } catch (_) { toast(`${icon("x")}<span>That save code did not work.</span>`, "t-red"); }
  };
  const wipe = $("#wipeBtn");
  wipe.onclick = () => {
    if (!wipe.classList.contains("armed")) { wipe.classList.add("armed"); wipe.textContent = "Tap again to wipe"; setTimeout(() => { wipe.classList.remove("armed"); wipe.textContent = "Wipe save"; }, 3000); return; }
    wiping = true;
    localStorage.removeItem(SAVE_KEY); localStorage.removeItem(LEGACY_KEY);
    location.reload();
  };
}
let wiping = false;

/* ---------------- offline ---------------- */
function grantOffline(secs, announce) {
  const capped = Math.min(secs, offlineCap());
  const g = spsBase() * capped * offlineRate();
  if (g <= 0) return;
  credit(g);
  if (announce) {
    openModal(`
      <div class="modal-icon m-green">${icon("server")}</div>
      <h2>Welcome back</h2>
      <p>Your rigs kept hashing for ${fmtTime(capped)}${secs > capped ? ` (capped at ${fmtTime(offlineCap())})` : ""} at ${Math.round(offlineRate() * 100)}% speed.</p>
      <div class="modal-big">+${fmt(g)} <span>sats</span></div>
      <div class="modal-actions"><button type="button" class="btn btn-primary" data-close>Collect</button></div>`);
  } else toast(`${icon("server")}<span>While you were away: <b>+${fmt(g)} sats</b></span>`);
}

/* ---------------- building the UI ---------------- */
const rowEls = {};
function buildRigs() {
  el.rigList.innerHTML = RIGS.map((r) => `
    <button type="button" class="rig" data-rig="${r.id}" title="${r.flavor}">
      <span class="rig-art ${r.dark ? "dark" : ""}"><img src="${T}rig-${r.id}.webp" alt="" draggable="false" loading="lazy" /></span>
      <span class="rig-info">
        <span class="rig-name"><b>${r.name}</b><em class="rig-tag">${r.tag}</em></span>
        <span class="rig-rate"></span>
        <span class="rig-ms"><span class="rig-ms-bar"><i></i></span><small></small></span>
      </span>
      <span class="rig-side">
        <span class="rig-count">0</span>
        <span class="rig-cost"><em class="rig-qty"></em><b></b></span>
      </span>
    </button>`).join("") + `<div class="rig-teaser" id="rigTeaser"></div>`;
  for (const r of RIGS) {
    const row = el.rigList.querySelector(`[data-rig="${r.id}"]`);
    rowEls[r.id] = {
      row, rate: $(".rig-rate", row), count: $(".rig-count", row), cost: $(".rig-cost b", row), qty: $(".rig-qty", row),
      msBar: $(".rig-ms-bar i", row), msTxt: $(".rig-ms small", row), name: $(".rig-name b", row),
    };
  }
}
function buildAbilities() {
  el.abilities.innerHTML = ABILITIES.map((a, i) => `
    <button type="button" class="ability" data-ability="${a.id}">
      <span class="ab-ring"></span>
      ${icon(a.icon, "ab-ico")}
      <span class="ab-name">${a.name}</span>
      <span class="ab-state"></span>
      <kbd>${i + 1}</kbd>
    </button>`).join("");
}

/* ---------------- rendering ---------------- */
let activeTab = "rigs";
function renderTop() {
  setText(el.balance, fmt(S.sats));
  setText(el.sps, fmt(sps(), true));
  setText(el.btc, btc(S.sats));
  setText(el.stim, fmt(Math.floor(S.stim)));
  setText(el.keys, fmt(S.keys));
}
function renderMute() { el.mute.innerHTML = icon(S.settings.sound ? "volume" : "mute"); }

function renderCore() {
  const t = now();
  setText(el.clickPower, "+" + fmt(clickPower(), true));
  setText(el.blockOdds, Math.round(blockChance() * 100) + "%");
  const c = comboNow();
  setText(el.combo, "×" + c + (c ? `  +${Math.round(c * 3)}%` : ""));
  el.comboBar.style.width = (c / comboCap()) * 100 + "%";
  setCls(el.coreCard, "hot", c >= 20);
  setCls(el.coreCard, "glow", modVisual("glow") && c >= 15);
  setCls(el.coreCard, "overclock", buffOn("overclock") || buffOn("frenzy"));
  setCls(el.coreCard, "clickfrenzy", buffOn("clickfrenzy"));

  // buffs
  const active = Object.keys(BUFF_INFO).filter(buffOn);
  const html = active.map((id) => {
    const b = BUFF_INFO[id];
    return `<span class="buff ${b.cls}">${icon(b.icon)}<b>${b.name}</b><em>${b.note}</em><i data-buff="${id}">${Math.ceil((S.buffs[id] - t) / 1000)}s</i></span>`;
  }).join("");
  const key = active.join(",");
  if (el.buffs._k !== key) { el.buffs._k = key; el.buffs.innerHTML = html; }
  else active.forEach((id) => { const n = el.buffs.querySelector(`[data-buff="${id}"]`); if (n) setText(n, Math.ceil((S.buffs[id] - t) / 1000) + "s"); });

  // abilities
  for (const a of ABILITIES) {
    const b = el.abilities.querySelector(`[data-ability="${a.id}"]`);
    if (!b) continue;
    const unlocked = abilityUnlocked(a);
    const st = $(".ab-state", b);
    setCls(b, "locked", !unlocked);
    if (!unlocked) { setText(st, a.hint); b.title = `${a.name}: ${a.desc}. Unlock: ${a.hint}.`; b.style.setProperty("--cd", 0); continue; }
    b.title = `${a.name}: ${a.desc}`;
    const left = Math.max(0, (S.cd[a.id] || 0) - t);
    const total = a.cd * cdMult() * 1000;
    const running = a.id === "overclock" ? buffOn("overclock") : a.id === "storm" ? buffOn("storm") : false;
    setCls(b, "ready", left === 0);
    setCls(b, "running", running);
    b.style.setProperty("--cd", left ? Math.min(1, left / total) : 0);
    setText(st, left ? fmtTime(left / 1000) : a.desc);
  }
}

function renderGoal() {
  let best = null, bestP = -1;
  for (const a of ACH) {
    if (S.ach.includes(a.id)) continue;
    const p = Math.min(1, (a.get() || 0) / a.target);
    if (p > bestP) { bestP = p; best = a; }
  }
  if (!best) { setHTML(el.goal, `<div class="goal-top"><span class="goal-label">${icon("trophy")} Every trophy earned</span></div><div class="goal-name">You beat Hash Forge. The chain is yours.</div>`); return; }
  const key = best.id;
  if (el.goal._k !== key) {
    el.goal._k = key;
    el.goal.innerHTML = `<div class="goal-top"><span class="goal-label">${icon("trophy")} Next goal</span><span class="goal-reward">+1% everything</span></div>
      <div class="goal-name">${best.name} <small>${best.desc}</small></div>
      <div class="goal-bar"><i></i></div><div class="goal-num"></div>`;
  }
  $(".goal-bar i", el.goal).style.width = bestP * 100 + "%";
  setText($(".goal-num", el.goal), `${fmt(Math.min(best.get() || 0, best.target))} / ${fmt(best.target)}`);
}

function renderRigs() {
  const total = sps();
  const pm = prodMult(false);
  let maxOwned = -1;
  RIGS.forEach((r, i) => { if (S.counts[r.id] > 0) maxOwned = i; });
  let teaser = null;
  RIGS.forEach((r, i) => {
    const e = rowEls[r.id];
    const n = S.counts[r.id];
    const visible = n > 0 || i <= maxOwned + 1 || S.runEarned >= r.base * 0.5;
    if (!visible && !teaser) teaser = r;
    setCls(e.row, "hidden", !visible);
    if (!visible) return;
    const k = buyQty(r);
    const cost = rigCost(r, n, k);
    const can = S.sats >= cost && (S.settings.buy !== "max" || maxAfford(r, n, S.sats) >= 1);
    setCls(e.row, "can", can);
    setCls(e.row, "fresh", n === 0);
    setText(e.count, n ? fmt(n) : "");
    setText(e.cost, fmt(cost));
    setText(e.qty, k > 1 ? `×${k}` : "");
    const each = unitRate(r) * pm;
    const share = total > 0 ? (n * each) / total : 0;
    setText(e.rate, n ? `${fmt(n * each, true)}/s · ${Math.round(share * 100)}% of output` : `+${fmt(each, true)}/s each`);
    const nextMs = MILESTONES.find((m) => n < m);
    if (nextMs) {
      const prev = [...MILESTONES].reverse().find((m) => n >= m) || 0;
      e.msBar.style.width = ((n - prev) / (nextMs - prev)) * 100 + "%";
      setText(e.msTxt, `${nextMs - n} to ×2`);
    } else { e.msBar.style.width = "100%"; setText(e.msTxt, "maxed"); }
  });
  const tz = $("#rigTeaser");
  if (teaser) setHTML(tz, `<span class="rig-art ghost"><img src="${T}rig-${teaser.id}.webp" alt="" /></span><span><b>???</b><small>Mine ${fmt(teaser.base * 0.5)} sats this run to reveal</small></span>`);
  setCls(tz, "hidden", !teaser);
  setText(el.rigNote, `${fmt(totalRigs())} rigs · ${fmt(total, true)} sats/s`);
  $$("#buySeg button").forEach((b) => setCls(b, "on", b.dataset.buyAmt === S.settings.buy));
}

function availableUpgrades() {
  return ALL_UPS.filter((u) => !owns(u.id) && u.unlock()).sort((a, b) => a.cost - b.cost);
}
function upIcon(u) {
  if (u.kind === "rig") return `<span class="up-ico rig ${u.rig.dark ? "dark" : ""}"><img src="${T}rig-${u.rig.id}.webp" alt="" /><em>${ROMAN[u.tier]}</em></span>`;
  return `<span class="up-ico k-${u.kind}">${icon(KIND_ICON[u.kind])}</span>`;
}
function renderUpgrades(force) {
  const list = availableUpgrades();
  const key = list.map((u) => u.id).join(",") + "|" + S.ups.length;
  if (force || el.upList._k !== key) {
    el.upList._k = key;
    el.upList.innerHTML = list.length ? list.map((u) => `
      <button type="button" class="up" data-up="${u.id}">
        ${upIcon(u)}
        <span class="up-info"><span class="up-kind">${KIND_LABEL[u.kind]}</span><b>${u.name}</b><small>${u.desc}</small></span>
        <span class="up-cost">${fmt(u.cost)}<em>sats</em></span>
      </button>`).join("") : `<div class="empty">${icon("chip")}<p>No upgrades right now. Buy more rigs, strike more and find blocks to unlock new ones.</p></div>`;
    const owned = S.ups.map(upgradeById).filter(Boolean);
    setText(el.ownedCount, owned.length ? `(${owned.length})` : "");
    el.ownedGrid.innerHTML = owned.length ? owned.map((u) => `<span class="owned" title="${u.name}: ${u.desc}">${upIcon(u)}</span>`).join("") : `<p class="muted-note">Nothing installed yet.</p>`;
  }
  $$(".up", el.upList).forEach((b) => { const u = ALL_UPS.find((x) => x.id === b.dataset.up); setCls(b, "can", u && S.sats >= u.cost); });
}

function renderMods(force) {
  const key = S.mods.join(",") + "|" + S.modsOff.join(",") + "|" + S.settings.fx;
  if (force || el.modGrid._k !== key) {
    el.modGrid._k = key;
    el.modGrid.innerHTML = MODS.map((m) => {
      const own = hasMod(m.id);
      const on = own && !S.modsOff.includes(m.id);
      return `<div class="mod ${own ? "owned" : ""}" data-mod-card="${m.id}">
        <span class="mod-ico">${icon(m.icon)}</span>
        <span class="mod-info"><b>${m.name}</b><small>${m.desc}</small></span>
        ${own
          ? `<button type="button" class="switch ${on ? "on" : ""}" data-mod-toggle="${m.id}" aria-label="Toggle ${m.name} visuals"><i></i><span>${on ? "Visuals on" : "Visuals off"}</span></button>`
          : `<button type="button" class="mod-buy" data-mod="${m.id}">${icon("sparkle")}${fmt(m.cost)}</button>`}
      </div>`;
    }).join("");
  }
  $$("[data-mod]", el.modGrid).forEach((b) => { const m = MODS.find((x) => x.id === b.dataset.mod); setCls(b, "can", S.stim >= m.cost); });
}

function renderFork(force) {
  const k = pendingKeys();
  const next = nextKeyAt();
  const prevAt = 1e7 * Math.pow(keysFor(S.allEarned), 3);
  const prog = Math.min(1, (S.allEarned - prevAt) / (next - prevAt));
  const key = `${k}|${S.keys}|${S.keysEarned}|${S.perks.length}`;
  if (force || el.forkHero._k !== key) {
    el.forkHero._k = key;
    el.forkHero.innerHTML = `
      <div class="fork-top">
        <div><small>Key level</small><b>${fmt(S.keysEarned)}</b><span>×${keyMult().toFixed(2)} to everything</span></div>
        <div><small>Keys to spend</small><b class="c-gold">${fmt(S.keys)}</b><span>on genesis perks</span></div>
        <div><small>Fork now for</small><b class="c-orange">+${fmt(k)}</b><span>keys</span></div>
      </div>
      <div class="fork-next"><div class="goal-bar"><i style="width:${prog * 100}%"></i></div><small>Next key at <b data-next>${fmt(next)}</b> all-time sats</small></div>
      ${S.legacy ? `<p class="fork-legacy">${icon("sparkle")} Your old v3 chain carried over. Fork to claim its keys.</p>` : ""}
      <p class="fork-copy">A hard fork resets sats, rigs and upgrades. Each key level adds a permanent ${hasPerk("genesis") ? 3 : 2}% to production and strikes. Keys come from all-time sats, so every fork is faster than the last.</p>
      <button type="button" class="btn btn-primary btn-wide" id="forkBtn" ${k < 1 ? "disabled" : ""}>${icon("fork")} ${k < 1 ? "Mine more to earn a key" : `Hard fork for ${fmt(k)} key${k > 1 ? "s" : ""}`}</button>`;
    el.perkGrid.innerHTML = PERKS.map((p) => {
      const own = hasPerk(p.id);
      return `<button type="button" class="perk ${own ? "owned" : ""}" data-perk="${p.id}" ${own ? "disabled" : ""}>
        <span class="perk-ico">${icon(p.icon)}</span>
        <span class="perk-info"><b>${p.name}</b><small>${p.desc}</small></span>
        <span class="perk-cost">${own ? icon("check") : `${icon("key")}${fmt(p.cost)}`}</span>
      </button>`;
    }).join("");
  } else {
    const n = el.forkHero.querySelector(".goal-bar i"); if (n) n.style.width = prog * 100 + "%";
  }
  $$(".perk:not(.owned)", el.perkGrid).forEach((b) => { const p = PERKS.find((x) => x.id === b.dataset.perk); setCls(b, "can", S.keys >= p.cost); });
}

function renderTrophies(force) {
  const key = S.ach.length;
  setText(el.trophyTitle, `Trophies ${S.ach.length}/${ACH.length}`);
  if (force || el.trophyGrid._k !== key) {
    el.trophyGrid._k = key;
    el.trophyGrid.innerHTML = ACH.map((a) => {
      const got = S.ach.includes(a.id);
      return `<div class="trophy ${got ? "got" : ""}" data-ach="${a.id}" title="${a.desc}">
        <span class="trophy-ico">${icon(got ? "trophy" : "lock")}</span>
        <b>${a.name}</b><small>${a.desc}</small>
        ${got ? "" : `<span class="trophy-bar"><i></i></span>`}
      </div>`;
    }).join("");
  }
  for (const a of ACH) {
    if (S.ach.includes(a.id)) continue;
    const bar = el.trophyGrid.querySelector(`[data-ach="${a.id}"] .trophy-bar i`);
    if (bar) bar.style.width = Math.min(1, (a.get() || 0) / a.target) * 100 + "%";
  }
}

function renderStats() {
  const rows = [
    ["Sats this fork", fmt(S.runEarned)], ["Sats all-time", fmt(S.allEarned)], ["In bitcoin", btc(S.allEarned)],
    ["Sats per second", fmt(sps(), true)], ["Per strike", fmt(clickPower(), true)], ["Block odds", Math.round(blockChance() * 100) + "%"],
    ["Block reward", fmt(blockReward(clickPower()))], ["Strikes (fork / all)", `${fmt(S.clicks)} / ${fmt(S.clicksAll)}`],
    ["Blocks (fork / all)", `${fmt(S.blocks)} / ${fmt(S.blocksAll)}`], ["Golden nonces", `${fmt(S.drops)} / ${fmt(S.dropsAll)}`],
    ["Best combo", "×" + S.bestCombo], ["Rigs owned", fmt(totalRigs())], ["Upgrades", `${S.ups.length} / ${ALL_UPS.length}`],
    ["Hard forks", fmt(S.forks)], ["Key level", `${fmt(S.keysEarned)} (×${keyMult().toFixed(2)})`], ["Trophy bonus", `+${S.ach.length}%`],
    ["Stimulation earned", fmt(S.stimEarned)], ["Abilities used", fmt(S.abilitiesUsed)],
    ["This fork", fmtTime((now() - S.runStart) / 1000)], ["Time played", fmtTime(S.playTime)],
  ];
  setHTML(el.statsGrid, rows.map(([k, v]) => `<div class="stat"><small>${k}</small><b>${v}</b></div>`).join(""));
}

function renderBadges() {
  const upN = availableUpgrades().filter((u) => S.sats >= u.cost).length;
  const modN = MODS.filter((m) => !hasMod(m.id) && S.stim >= m.cost).length;
  const fk = pendingKeys();
  const perkN = PERKS.filter((p) => !hasPerk(p.id) && S.keys >= p.cost).length;
  setText($("#badge-upgrades"), upN ? String(upN) : "");
  setText($("#badge-mods"), modN ? String(modN) : "");
  setText($("#badge-fork"), perkN ? String(perkN) : fk >= 1 ? "+" + fmt(fk) : "");
}

function renderTab(force) {
  if (activeTab === "rigs") renderRigs();
  else if (activeTab === "upgrades") renderUpgrades(force);
  else if (activeTab === "mods") renderMods(force);
  else if (activeTab === "fork") renderFork(force);
  else if (activeTab === "trophies") renderTrophies(force);
  else if (activeTab === "stats") renderStats();
}
function renderAll(force) {
  renderTop(); renderCore(); renderGoal(); renderBadges();
  renderTab(force);
  el.app.classList.toggle("fx-terminal", modVisual("terminal"));
  el.app.classList.toggle("fx-worm", modVisual("worm"));
}
el.app = $("#app");

function switchTab(tab) {
  activeTab = tab;
  $$("#tabs [data-tab]").forEach((b) => { b.classList.toggle("active", b.dataset.tab === tab); b.setAttribute("aria-selected", b.dataset.tab === tab); });
  $$(".pane").forEach((p) => p.classList.toggle("active", p.dataset.pane === tab));
  $(".tab-body").scrollTop = 0;
  renderTab(true);
}

/* ---------------- achievements ---------------- */
function checkAch() {
  for (const a of ACH) {
    if (S.ach.includes(a.id)) continue;
    if ((a.get() || 0) >= a.target) {
      S.ach.push(a.id);
      const t = document.createElement("div");
      t.className = "ach-pop";
      t.innerHTML = `<span class="ach-medal">${icon("trophy")}</span><span><small>Trophy unlocked · +1% everything</small><b>${a.name}</b></span>`;
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 3800);
      sfx.ach();
    }
  }
}

/* ---------------- news ---------------- */
let newsIdx = 0;
function rotateNews() {
  const pool = NEWS.filter(([c]) => c()).map(([, s]) => s);
  newsIdx = (newsIdx + 1 + ((Math.random() * (pool.length - 1)) | 0)) % pool.length;
  el.news.classList.remove("in"); void el.news.offsetWidth;
  el.news.textContent = pool[newsIdx];
  el.news.classList.add("in");
}

/* ---------------- input ---------------- */
document.addEventListener("pointerdown", () => audio(), { once: true });
el.coin.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  strike(e.clientX, e.clientY - 6, "manual");
  pressCoin();
});
addEventListener("keydown", (e) => {
  if (e.target.matches("input, textarea")) return;
  if (e.key === "Escape") return closeModal();
  if (modalOpen) return;
  if ((e.code === "Space" || e.code === "Enter") && !e.repeat) {
    if (document.activeElement && document.activeElement.tagName === "BUTTON" && document.activeElement !== el.coin) return;
    e.preventDefault();
    coinCenter();
    strike(coinX + (Math.random() - 0.5) * coinR, coinY + (Math.random() - 0.5) * coinR, "manual");
    pressCoin();
  }
  const n = +e.key;
  if (n >= 1 && n <= ABILITIES.length && !e.repeat) useAbility(ABILITIES[n - 1].id);
});
document.addEventListener("click", (e) => {
  const t = e.target;
  let m;
  if ((m = t.closest("[data-rig]"))) return buyRig(m.dataset.rig);
  if ((m = t.closest("[data-up]"))) return buyUpgrade(m.dataset.up);
  if ((m = t.closest("[data-mod]"))) return buyMod(m.dataset.mod);
  if ((m = t.closest("[data-mod-toggle]"))) return toggleModVisual(m.dataset.modToggle);
  if ((m = t.closest("[data-perk]"))) return buyPerk(m.dataset.perk);
  if ((m = t.closest("[data-ability]"))) return useAbility(m.dataset.ability);
  if ((m = t.closest("[data-tab]"))) return switchTab(m.dataset.tab);
  if ((m = t.closest("[data-buy-amt]"))) { S.settings.buy = m.dataset.buyAmt; save(); return renderRigs(); }
  if (t.closest("#buyAllBtn")) return buyAllUpgrades();
  if (t.closest("#forkBtn")) return confirmFork();
  if (t.closest("#settingsBtn")) return openSettings();
  if (t.closest("#muteBtn")) { S.settings.sound = !S.settings.sound; renderMute(); save(); }
});

/* ---------------- main loop ---------------- */
let lastTick = now(), stormAcc = 0, autoAcc = 0, saveAcc = 0, achAcc = 0, newsAcc = 0, scrambleAcc = 0, slowAcc = 0;
function tick() {
  const t = now();
  const dt = (t - lastTick) / 1000;
  lastTick = t;
  if (dt <= 0) return;
  if (dt > 60) { grantOffline(dt, dt > 300); return; } // tab was frozen: treat the gap as offline time
  S.playTime += dt;
  credit(sps() * dt);

  // automatic strikes
  coinCenter();
  if (buffOn("storm")) {
    stormAcc += dt * 15;
    let n = Math.min(6, Math.floor(stormAcc)); stormAcc -= Math.floor(stormAcc);
    while (n-- > 0) {
      const a = Math.random() * Math.PI * 2, d = Math.random() * coinR * 0.8;
      strike(coinX + Math.cos(a) * d, coinY + Math.sin(a) * d, "storm");
    }
    if (Math.random() < 0.5) pressCoin();
  }
  const autoRate = (hasMod("swarm") ? 3 : 0) + (hasPerk("ghost") ? 3 : 0);
  if (autoRate) {
    autoAcc += dt * autoRate;
    let n = Math.min(4, Math.floor(autoAcc)); autoAcc -= Math.floor(autoAcc);
    while (n-- > 0) strike(coinX + (Math.random() - 0.5) * coinR * 1.4, coinY - coinR * 0.3 + (Math.random() - 0.5) * coinR, "auto");
  }

  if (t >= nextDropAt) { spawnDrop(false); scheduleDrop(); }
  modEvents(t);

  scrambleAcc += dt; if (scrambleAcc > 0.12) { scrambleAcc = 0; scramble(); }
  achAcc += dt; if (achAcc > 1) { achAcc = 0; checkAch(); }
  saveAcc += dt; if (saveAcc > 10) { saveAcc = 0; save(); }
  newsAcc += dt; if (newsAcc > 10) { newsAcc = 0; rotateNews(); }

  renderTop(); renderCore();
  slowAcc += dt;
  if (slowAcc > 0.25) { slowAcc = 0; renderGoal(); renderBadges(); renderTab(false); }
}

/* ---------------- canvas loop ---------------- */
let lastFrame = performance.now();
function frame(tNow) {
  const dt = Math.min(0.05, (tNow - lastFrame) / 1000);
  lastFrame = tNow;
  const w = innerWidth, h = innerHeight;
  ctx.clearRect(0, 0, w, h);
  bctx.clearRect(0, 0, w, h);
  coinCenter();

  if (modVisual("cascade")) {
    const cols = Math.round(w / 60);
    bctx.font = font(12, true);
    for (let i = 0; i < cols; i++) {
      const speed = 60 + (i % 5) * 28;
      const y = ((tNow * 0.001 * speed + i * 197) % (h + 120)) - 60;
      const x = i * (w / cols) + 12;
      bctx.fillStyle = "rgba(200,242,74,.22)";
      bctx.fillText(HEX[(i + Math.floor(tNow / 300)) % 16], x, y);
      bctx.fillStyle = "rgba(200,242,74,.09)";
      bctx.fillText(HEX[(i * 3) % 16], x, y - 18);
    }
  }
  if (chainNodes.length && modVisual("chain")) {
    bctx.lineWidth = 1;
    for (let i = 0; i < chainNodes.length; i++) {
      const n = chainNodes[i];
      if (i > 0) {
        const p = chainNodes[i - 1];
        bctx.strokeStyle = `rgba(200,242,74,${0.12 * Math.min(1, (tNow - n.born) / 600)})`;
        bctx.beginPath(); bctx.moveTo(p.x, p.y); bctx.lineTo(n.x, n.y); bctx.stroke();
      }
      const tw = 0.5 + 0.5 * Math.sin(tNow / 600 + n.seed);
      const newest = i === chainNodes.length - 1;
      bctx.fillStyle = newest ? `rgba(255,200,80,${0.7 + 0.3 * tw})` : `rgba(207,232,255,${0.3 * tw + 0.12})`;
      const s = newest ? 5 : 3;
      bctx.fillRect(n.x - s / 2, n.y - s / 2, s, s);
    }
  }
  if (modVisual("swarm") && coinOnScreen) {
    const n = 8;
    const ts = tNow / 1000;
    for (let i = 0; i < n; i++) {
      const a = ts * 0.9 + (i / n) * Math.PI * 2;
      const r = coinR * 1.35 + Math.sin(ts * 1.3 + i) * 6;
      ctx.drawImage(droneSprite, coinX + Math.cos(a) * r - 11, coinY + Math.sin(a) * r * 0.7 - 11);
    }
  }
  for (let i = ripples.length - 1; i >= 0; i--) {
    const r = ripples[i];
    r.r += dt * 300; r.life -= dt / 0.55;
    if (r.life <= 0) { ripples.splice(i, 1); continue; }
    ctx.globalAlpha = r.life * 0.45;
    ctx.strokeStyle = "#3ec8e8"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  if (ribbon.length) {
    const rh = 22;
    ctx.fillStyle = "rgba(7,8,10,.72)";
    ctx.fillRect(0, h - rh, w, rh);
    ctx.font = font(10, true);
    for (let i = ribbon.length - 1; i >= 0; i--) {
      const e = ribbon[i];
      e.x -= 80 * dt;
      if (e.x < -240) { ribbon.splice(i, 1); continue; }
      ctx.fillStyle = "rgba(62,200,232,.75)";
      ctx.fillText(e.text, e.x, h - 7);
    }
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= dt * p.decay; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += p.g * dt;
    if (p.float) p.vy *= 0.985;
    if (p.life <= 0) { particles[i] = particles[particles.length - 1]; particles.pop(); continue; }
    ctx.globalAlpha = Math.min(1, p.life * 1.6);
    ctx.font = font(p.sz, p.mono);
    if (p.float) { ctx.fillStyle = "rgba(0,0,0,.45)"; ctx.fillText(p.text, p.x + 1, p.y + 2); }
    ctx.fillStyle = p.c;
    ctx.fillText(p.text, p.x, p.y);
  }
  ctx.globalAlpha = 1;

  // shake: small, fast-decaying, applied to the coin panel only
  trauma = Math.max(0, trauma - dt * 3.5);
  const amp = S.settings.shake === "full" ? 8 : 3.5;
  const s = trauma * trauma * amp;
  const tx = s > 0.15 ? `translate(${((Math.random() * 2 - 1) * s).toFixed(1)}px, ${((Math.random() * 2 - 1) * s).toFixed(1)}px) rotate(${((Math.random() * 2 - 1) * s * 0.12).toFixed(2)}deg)` : "";
  if (el.coreShake._t !== tx) { el.coreShake._t = tx; el.coreShake.style.transform = tx; }

  requestAnimationFrame(frame);
}

/* ---------------- boot ---------------- */
document.addEventListener("visibilitychange", () => { if (document.hidden) save(); });
addEventListener("pagehide", () => { if (!wiping) save(); });
addEventListener("beforeunload", () => { if (!wiping) save(); });

buildRigs();
buildAbilities();
renderMute();
ctx.font = font(12, true);
{
  const away = (now() - (S.lastSave || now())) / 1000;
  if (away > 60 && spsBase() > 0) grantOffline(away, true);
}
if (S.legacy && S.forks === 0) setTimeout(() => toast(`${icon("sparkle")}<span>Your v3 chain carried over. Open <b>Fork</b> to claim its keys.</span>`, "t-gold"), 1200);
scrambleCrit();
rotateNews();
renderAll(true);
setInterval(tick, 100);
requestAnimationFrame(frame);
window.__HF__ = S; // debug handles
window.__HFD__ = { get shakes() { return shakeCount; }, useAbility, spawnDrop, sps, clickPower };
