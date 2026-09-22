/* ============================================================
   HASH FORGE v3 — a bitcoin mining clicker
   Strike the block. Drones hash for you. Spend stimulation on chaos.
   ============================================================ */

const MACHINES = [
  ["cpu", "Garage CPU", "A loyal first thread humming in the spare room.", 60, 0.6, "SILICON", "./assets/rig-cpu.png", "dark"],
  ["gpu", "GPU Rig", "Three fans. Parallel heat. Parallel hashes.", 380, 3.5, "ACCELERATED", "./assets/rig-gpu.png", "light"],
  ["fpga", "FPGA Board", "Rewire the fabric. Hash whatever the bitstream says.", 2200, 14, "RECONFIG", "./assets/rig-fpga.png", "light"],
  ["asic", "ASIC Pod", "Purpose-built. No games. Only SHA-256.", 12000, 62, "INDUSTRIAL", "./assets/rig-asic.png", "light"],
  ["farm", "ASIC Farm", "A shipping container of relentless machines.", 78000, 360, "MEGA SCALE", "./assets/rig-farm.png", "light"],
];
const UPGRADES = [
  ["paste", "Thermal paste", "Strike payout ×2. The chip finally breathes.", 100, "MINE"],
  ["firmware", "Firmware boost", "Strike payout ×2. Signed, sealed, profitable.", 600, "MINE"],
  ["crit1", "Photon prefetch", "+4% chance a strike finds a block.", 1500, "MINE"],
  ["pool", "Pool contract", "All rig output ×2. Strength in numbers.", 2000, "RIG"],
  ["silicon", "Custom silicon", "Strike payout ×3. Etched for one job.", 4200, "MINE"],
  ["combo", "Combo capacitor", "Combo window stretched to 2.4s.", 3000, "MINE"],
  ["immersion", "Immersion cooling", "All rig output ×2. Bathed in dielectric bliss.", 15000, "RIG"],
  ["crit2", "Quantum dice", "+6% block chance. Superposition pays.", 12000, "MINE"],
  ["cosmic", "Cosmic ray luck", "Strike payout ×4. Flip every bit you can.", 60000, "MINE"],
  ["nuclear", "Nuclear PPA", "All rig output ×3. Two gigawatts of certainty.", 90000, "RIG"],
];
const DRONE_UPS = [
  ["od1", "Drone overdrive I", "Drones strike ×2 speed.", 2500],
  ["od2", "Drone overdrive II", "Doubles it again.", 25000],
];
const CHAOS = [
  ["sparks", "Hash sparks", "Every strike sprays hex shards.", 5, "⚡"],
  ["ripples", "Shock ripples", "Strikes ring out across the void.", 14, "◎"],
  ["ribbon", "Ledger ribbon", "Your payouts scroll across the floor.", 22, "▤"],
  ["cascade", "Hash cascade", "Columns of hex pour down the walls.", 40, "⌁"],
  ["chain", "Chain constellation", "Every block you mine joins the night sky.", 70, "✦"],
  ["swarm", "Rig swarm", "Your drones orbit the strike core, visible and smug.", 110, "🛰️"],
  ["rumble", "Core rumble", "Block finds rumble the foundation. Only those.", 160, "🪨"],
  ["terminal", "Retro terminal", "Scanlines over everything. +8% strike payout.", 240, "📺"],
  ["shimmer", "Heat shimmer", "The whole bay warps in its own exhaust.", 340, "🌫️"],
  ["stamp", "Difficulty stamp", "Retargets slam the aisle every few seconds — and pay.", 500, "🏷️"],
  ["ransom", "Ransomware", "Fake lockers appear. 'Decrypt' sweeps their wallet.", 700, "🦠"],
  ["glow", "Combo overclock glow", "The core burns bright when your combo runs hot.", 950, "💡"],
  ["worm", "Mempool wormhole", "Warp vignette. +10% rig output.", 1300, "🕳️"],
  ["whale", "Whale alerts", "Whales swim past the window. Markets move. You get paid.", 1800, "🐳"],
  ["lastsat", "The last sat", "Wind it all down. Mine the final coin of 21 million.", 8000, "🏁"],
];
const ACHIEVEMENTS = [
  ["s10", "First contact", "10 strikes", (S) => S.clicks >= 10],
  ["s100", "Warming up", "100 strikes", (S) => S.hashes >= 100],
  ["s1k", "Hash factory", "1,000 strikes", (S) => S.hashes >= 1000],
  ["s10k", "Noncing forever", "10,000 strikes", (S) => S.hashes >= 10000],
  ["b1", "Genesis block", "Find a block", (S) => S.blocks >= 1],
  ["b10", "Chain builder", "10 blocks found", (S) => S.blocks >= 10],
  ["b50", "Satoshi tier", "50 blocks found", (S) => S.blocks >= 50],
  ["cpu1", "Welcome to the noise", "Own a Garage CPU", (S) => (S.counts.cpu || 0) >= 1],
  ["rig10", "Sparks fly", "10 rigs owned", (S) => totalRigs() >= 10],
  ["rig40", "Datacenter home", "40 rigs owned", (S) => totalRigs() >= 40],
  ["farm1", "Container arrived", "Own an ASIC Farm", (S) => (S.counts.farm || 0) >= 1],
  ["d1", "Auto-hash online", "Own a drone", (S) => S.drones >= 1],
  ["d10", "Swarm protocol", "10 drones", (S) => S.drones >= 10],
  ["combo15", "In the zone", "Combo ×15", (S) => S.bestCombo >= 15],
  ["combo30", "Impossible flow", "Combo ×30", (S) => S.bestCombo >= 30],
  ["stim100", "Loud", "100 stimulation earned", (S) => S.stimEarned >= 100],
  ["stim1k", "Deafening", "1,000 stimulation earned", (S) => S.stimEarned >= 1000],
  ["orb10", "Catch 'em all", "Catch 10 drops", (S) => S.orbsCaught >= 10],
  ["life1m", "Seven digits", "1M lifetime sats", (S) => S.lifetimeTotal >= 1e6],
  ["fork1", "Hard forked", "Fork the chain once", (S) => S.forks >= 1],
  ["lastsat1", "21 Million", "Mine the last sat", (S) => S.lastsat],
];
const EVENTS = [
  ["overclock", "Overclock", "Rigs ×3, 14s", "./assets/power-overclock.png", 14],
  ["coolant", "Nitrogen drop", "Rigs ×1.5, 18s", "./assets/power-coolant.png", 18],
  ["lucky", "Lucky nonce", "Next block ×25", "./assets/power-lucky.png", 0],
  ["glitch", "Merkle glitch", "+25% block chance, 12s", "./assets/power-glitch.png", 12],
  ["airdrop", "Mempool airdrop", "Instant sats", "./assets/power-lucky.png", 0],
];
const NEWS = [
  "Difficulty retarget rumored after a quiet hour.",
  "Someone in the garage just found four leading zeros.",
  "Mempool is spicy. Fees look like lava.",
  "Black-market coolant shipment sighted over the aisle.",
  "Analyst: 'the hash goes up, the number goes up.'",
  "Drone union demands more stimulation.",
  "A very large number was seen near block 900000.",
  "Local miner claims clicking faster 'just feels right'.",
];
const WHALES = [
  "🐳 WHALE ALERT — 4,021 BTC moved to cold storage. market unimpressed.",
  "🐳 WHALE ALERT — 880 BTC bought in a single block. your fees tick up.",
  "🐳 WHALE ALERT — ancient 50 BTC stash from 2010 just woke up.",
  "🐳 WHALE ALERT — exchange wallet reshuffled for no reason anyone can name.",
  "🐳 WHALE ALERT — whale denied everything. wallet says otherwise.",
];
const RANSOMWARE = [
  ["⚠ ALL YOUR HASHES BELONG TO US", "rigs encrypted with a military-grade nonce. resistance is forked.", "DECRYPT (FREE?!)"],
  ["⚠ LOCKERMINER v2.4", "pay 0.0000 BTC or the fans spin down forever. yes. zero.", "Sweep their key"],
  ["⚠ your asics are mine now", "attacker typo'd their own wallet address into the locker.", "DRAIN ATTACKER"],
];
const SAVE_KEY = "hash-forge-v3";
const HEX = "0123456789ABCDEF";
const COST = 1.15;

/* ---------------- state ---------------- */
const emptyCounts = () => ({ cpu: 0, gpu: 0, fpga: 0, asic: 0, farm: 0 });
function defaultState() {
  return {
    sats: 0, lifetime: 0, lifetimeTotal: 0, stim: 0, stimEarned: 0,
    hashes: 0, clicks: 0, blocks: 0,
    counts: emptyCounts(), drones: 0, ups: [], droneUps: [], chaos: [],
    ach: [], forks: 0, orbsCaught: 0,
    lucky: false, lastsat: false, muted: false,
    bestCombo: 0, buffRemain: {}, lastSave: Date.now(),
  };
}
function load() {
  const d = defaultState();
  try {
    const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
    if (!raw) return d;
    return { ...d, ...raw, counts: { ...emptyCounts(), ...(raw.counts || {}) } };
  } catch (_) { return d; }
}
const S = load();
S.heat = 0; S.combo = 0; S.comboUntil = 0; S.t = 0;
S.buff = {}; for (const k in (S.buffRemain || {})) S.buff[k] = S.t + (+S.buffRemain[k] || 0);
S.orbs = []; S.nextOrb = 10;
S.autoAcc = 0; S.stampAt = 8; S.ransomAt = 26; S.whaleAt = 40;
S.newsIdx = Math.floor(Math.random() * NEWS.length);

function save() {
  S.lastSave = Date.now();
  const remain = {};
  for (const k in S.buff) if (S.buff[k] > S.t) remain[k] = S.buff[k] - S.t;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      sats: S.sats, lifetime: S.lifetime, lifetimeTotal: S.lifetimeTotal, stim: S.stim, stimEarned: S.stimEarned,
      hashes: S.hashes, clicks: S.clicks, blocks: S.blocks,
      counts: S.counts, drones: S.drones, ups: S.ups, droneUps: S.droneUps, chaos: S.chaos,
      ach: S.ach, forks: S.forks, orbsCaught: S.orbsCaught,
      lucky: S.lucky, lastsat: S.lastsat, muted: S.muted,
      bestCombo: S.bestCombo, buffRemain: remain, lastSave: S.lastSave,
    }));
  } catch (_) {}
}

/* ---------------- math ---------------- */
const has = (id) => S.chaos.includes(id);
const up = (id) => S.ups.includes(id);
const totalRigs = () => MACHINES.reduce((s, m) => s + (S.counts[m[0]] || 0), 0);
const achMult = () => 1 + S.ach.length * 0.01;
const forkMult = () => 1 + S.forks * 0.18;
function comboMult() {
  const c = S.comboUntil > S.t ? S.combo : 0;
  return 1 + c * 0.04;
}
function clickPower() {
  let p = 3;
  if (up("paste")) p *= 2;
  if (up("firmware")) p *= 2;
  if (up("silicon")) p *= 3;
  if (up("cosmic")) p *= 4;
  if (has("terminal") && !S.lastsat) p *= 1.08;
  return p * comboMult() * achMult() * forkMult();
}
function rigRate() {
  let r = MACHINES.reduce((s, m) => s + (S.counts[m[0]] || 0) * m[4], 0);
  if (up("pool")) r *= 2;
  if (up("immersion")) r *= 2;
  if (up("nuclear")) r *= 3;
  if ((S.buff.overclock || 0) > S.t) r *= 3;
  if ((S.buff.coolant || 0) > S.t) r *= 1.5;
  if (has("worm") && !S.lastsat) r *= 1.1;
  if (S.lastsat) r *= 0.45;
  if (S.heat > 88) r *= 0.6;
  return r * forkMult();
}
function droneSpeed() { return (S.droneUps.includes("od1") ? 2 : 1) * (S.droneUps.includes("od2") ? 2 : 1); }
function autoRate() { return S.drones * droneSpeed(); }
function critChance() {
  let c = 0.08;
  if (up("crit1")) c += 0.04;
  if (up("crit2")) c += 0.06;
  if ((S.buff.glitch || 0) > S.t) c += 0.25;
  return Math.min(0.5, c);
}
function critPay() { return clickPower() * 20 * (S.lucky ? 25 : 1); }
function comboWindow() { return up("combo") ? 2.4 : 1.4; }
function nextCost(base, n) { return Math.floor(base * Math.pow(COST, n)); }
function droneCost() { return Math.floor(120 * Math.pow(1.7, S.drones)); }
function credit(n) { S.sats += n; S.lifetime += n; S.lifetimeTotal += n; }
function fmt(n) {
  if (!isFinite(n)) return "∞";
  if (n < 1e3) return Math.floor(n).toString();
  const u = ["K", "M", "B", "T", "Qa", "Qi"];
  let i = -1;
  while (n >= 1e3 && i < u.length - 1) { n /= 1e3; i++; }
  return (n >= 100 ? Math.floor(n) : n.toFixed(1)) + u[i];
}
function hex6() { let s = ""; for (let i = 0; i < 6; i++) s += HEX[Math.floor(Math.random() * 16)]; return s; }

/* ---------------- audio ---------------- */
let AC = null, lastDroneBeep = 0;
function audio() {
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === "suspended") AC.resume();
    return AC;
  } catch (_) { return null; }
}
function tone(f, d = 0.08, v = 0.045, type = "square", slide = 0) {
  if (S.muted) return;
  const ac = audio(); if (!ac) return;
  try {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.value = f;
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + slide), ac.currentTime + d);
    g.gain.value = v;
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d);
    o.connect(g); g.connect(ac.destination);
    o.start(); o.stop(ac.currentTime + d + 0.03);
  } catch (_) {}
}
const sfx = {
  strike(c) { tone(300 + c * 22, 0.06, 0.04); },
  drone() { const n = performance.now(); if (n - lastDroneBeep > 140) { lastDroneBeep = n; tone(220, 0.045, 0.012, "sine"); } },
  crit() { tone(660, 0.1, 0.06, "square"); setTimeout(() => tone(990, 0.16, 0.06, "square"), 90); },
  buy() { tone(520, 0.07, 0.05, "triangle"); setTimeout(() => tone(780, 0.1, 0.05, "triangle"), 70); },
  orb() { tone(880, 0.12, 0.05, "sine"); setTimeout(() => tone(1320, 0.14, 0.04, "sine"), 80); },
  stamp() { tone(90, 0.16, 0.08, "sawtooth", -40); },
  ransom() { tone(520, 0.09, 0.05, "sawtooth"); setTimeout(() => tone(392, 0.12, 0.05, "sawtooth"), 110); },
  claim() { tone(700, 0.08, 0.05, "sine"); setTimeout(() => tone(1050, 0.1, 0.05, "sine"), 70); },
  whale() { tone(98, 0.5, 0.06, "sine", -20); },
  fork() { tone(400, 0.5, 0.08, "sawtooth", -320); },
  deny() { tone(130, 0.1, 0.04, "square"); },
};

/* ---------------- screen shake (block finds only) ---------------- */
let trauma = 0;
function shake(amt) {
  if (S.lastsat) amt *= 0.4;
  trauma = Math.min(0.7, trauma + amt);
}

/* ---------------- canvas fx ---------------- */
const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d");
function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
resize(); addEventListener("resize", resize);

const particles = [], ripples = [], chainNodes = [], ribbon = [];
let coreX = innerWidth / 2, coreY = innerHeight / 2, coreAt = 0;
const ptr = { x: innerWidth / 2, y: innerHeight / 2 };

// adaptive quality: drop particle budgets when frames run long
let Q = 1, emaDt = 16;
const FONT_CACHE = {};
function fontStr(sz, mono) {
  const k = sz + (mono ? "m" : "s");
  return FONT_CACHE[k] || (FONT_CACHE[k] = `${sz}px ${mono ? "'IBM Plex Mono'" : "'Space Grotesk'"}, monospace`);
}
function spray(x, y, n, big) {
  n = Math.round(n * Q);
  if (particles.length > 240 * Q) return;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, spd = 60 + Math.random() * (big ? 300 : 190);
    particles.push({ x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd - 50, life: 1, text: HEX[i % 16], c: i % 3 === 0 ? "#ff6a1a" : i % 3 === 1 ? "#c8f24a" : "#3ec8e8", sz: big ? 14 : 11 });
  }
}
function floater(x, y, text, big) {
  if (particles.length > 240 * Q) return;
  particles.push({ x, y, vx: (Math.random() - 0.5) * 30, vy: -85, life: 1, text, c: big ? "#c8f24a" : "#efe8d8", sz: big ? 20 : 13, mono: true });
}
function ribbonPush(text) {
  if (!has("ribbon") || S.lastsat) return;
  ribbon.push({ text, x: canvas.width + 30 });
  if (ribbon.length > 18) ribbon.shift();
}
function addChainNode() {
  if (!has("chain") || S.lastsat) return;
  chainNodes.push({ x: 30 + Math.random() * (canvas.width - 60), y: 20 + Math.random() * (canvas.height * 0.65), born: S.t, seed: Math.random() * 10 });
  if (chainNodes.length > 90) chainNodes.shift();
}
// pre-rendered drone sprite for the swarm
const droneSprite = document.createElement("canvas");
droneSprite.width = droneSprite.height = 22;
{
  const c = droneSprite.getContext("2d");
  c.strokeStyle = "#3ec8e8"; c.lineWidth = 2;
  c.beginPath(); c.moveTo(11, 2); c.lineTo(20, 11); c.lineTo(11, 20); c.lineTo(2, 11); c.closePath(); c.stroke();
  c.fillStyle = "#c8f24a"; c.fillRect(9, 9, 4, 4);
}

function manualJuice(x, y, crit, text) {
  if (S.lastsat) return;
  if (has("sparks")) spray(x, y, crit ? 30 : 13, crit);
  if (text) floater(x, y, text, crit);
  if (has("ripples")) ripples.push({ x, y, r: 8, life: 1 });
}
function droneJuice(acc, pay) {
  if (S.lastsat || !acc) return;
  const bx = coreX, by = coreY;
  spray(bx + (Math.random() - 0.5) * 140, by + (Math.random() - 0.5) * 110, Math.min(3 + acc, 9));
  floater(bx + (Math.random() - 0.5) * 160, by - 40, `+${fmt(pay)}`, false);
}

/* ---------------- core actions ---------------- */
function strikeEconomy(manual) {
  S.hashes += 1;
  if (manual) S.clicks += 1;
  const crit = Math.random() < critChance() * (manual ? 1 : 0.55);
  let pay;
  if (crit) {
    pay = critPay();
    const luckyNow = S.lucky;
    S.blocks += 1;
    if (S.lucky) S.lucky = false;
    blockBanner(pay, luckyNow);
    addChainNode();
    scrambleCrit();
    sfx.crit();
    shake(0.3);
  } else {
    pay = clickPower() * (manual ? 1 : 0.5);
    if (manual) sfx.strike(S.combo); else sfx.drone();
  }
  credit(pay);
  const stimGain = manual ? 1 + Math.floor(S.combo / 6) : 0.2;
  S.stim += stimGain; S.stimEarned += stimGain;
  if (manual) {
    S.combo = Math.min(30, (S.comboUntil > S.t ? S.combo : 0) + 1);
    S.bestCombo = Math.max(S.bestCombo, S.combo);
    S.heat = Math.min(100, S.heat + 3.5);
    S.comboUntil = S.t + comboWindow();
  } else {
    S.heat = Math.min(100, S.heat + 0.5);
    if (S.comboUntil > S.t) S.comboUntil = S.t + comboWindow(); // drones keep the combo warm
  }
  return { pay, crit };
}
function manualStrike(x, y) {
  const res = strikeEconomy(true);
  manualJuice(x, y, res.crit, `+${fmt(res.pay)}`);
  ribbonPush(`${hex6()} +${fmt(res.pay)}`);
}
function blockBanner(pay, luckyNow) {
  const el = document.createElement("div");
  el.className = "block-flash";
  el.innerHTML = `BLOCK FOUND +${fmt(pay)} SATS<small>${luckyNow ? "LUCKY NONCE ×25 — " : ""}NONCE ${hex6()}</small>`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 950);
}

let lastCritShown = -10;
function scramble(forceCrit) {
  const el = $("#hashDisplay");
  if (!el) return;
  if (forceCrit) lastCritShown = S.t;
  if (S.t - lastCritShown < 0.45) return; // let the zeros linger after a block
  let s = "";
  for (let i = 0; i < 8; i++) s += HEX[Math.floor(Math.random() * 16)];
  el.textContent = s;
}
function scrambleCrit() {
  const el = $("#hashDisplay");
  if (!el) return;
  let s = "0000";
  for (let i = 0; i < 4; i++) s += HEX[Math.floor(Math.random() * 16)];
  lastCritShown = S.t;
  el.innerHTML = [...s].map((c) => (c === "0" ? `<span class="zero">${c}</span>` : c)).join("");
}

function buyMachine(id) {
  const m = MACHINES.find((x) => x[0] === id);
  const cost = nextCost(m[3], S.counts[id] || 0);
  if (S.sats < cost) { sfx.deny(); return; }
  S.sats -= cost; S.counts[id] = (S.counts[id] || 0) + 1;
  toast(`${m[1]} is online.`);
  sfx.buy(); save(); renderLists();
}
function buyDrone() {
  if (S.clicks < 10) { sfx.deny(); toast("Reach 10 strikes to unlock the auto-hasher."); renderStats(); return; }
  const cost = droneCost();
  if (S.sats < cost) { sfx.deny(); return; }
  S.sats -= cost; S.drones += 1;
  toast(S.drones === 1 ? "Auto-hasher online. It never sleeps." : `Drone #${S.drones} deployed.`);
  spray(ptr.x, ptr.y, 18); sfx.buy(); save(); renderLists();
}
function buyUpgrade(id) {
  const u = UPGRADES.find((x) => x[0] === id);
  if (up(id)) return;
  if (S.sats < u[3]) { sfx.deny(); return; }
  S.sats -= u[3]; S.ups.push(id);
  toast(`${u[1]} installed.`); sfx.buy(); save(); renderLists();
}
function buyDroneUp(id) {
  const d = DRONE_UPS.find((x) => x[0] === id);
  if (S.droneUps.includes(id)) return;
  if (S.sats < d[3]) { sfx.deny(); return; }
  S.sats -= d[3]; S.droneUps.push(id);
  toast(`${d[1]} — drones ×2.`); sfx.buy(); save(); renderLists();
}
function buyChaos(id) {
  const spec = CHAOS.find((c) => c[0] === id);
  if (has(id)) return;
  if (S.stim < spec[3]) { sfx.deny(); toast(`Need ${Math.ceil(spec[3] - S.stim)} more stimulation.`); return; }
  S.stim -= spec[3]; S.chaos.push(id);
  if (id === "lastsat") {
    S.lastsat = true;
    credit(5000); S.heat = 0;
    toast("20,999,999.9999760 → 21,000,000. That's all of them. The farm hums, golden and calm.");
    shake(0.55); sfx.fork();
  } else {
    toast(`${spec[1]} unlocked.`);
    sfx.buy();
  }
  spray(ptr.x, ptr.y, 22, true);
  save(); renderLists();
}
function catchOrb(orb, e) {
  S.orbs = S.orbs.filter((o) => o.id !== orb.id);
  orb.el.remove();
  S.orbsCaught += 1;
  if (orb.kind === "airdrop") {
    const p = Math.max(60, rigRate() * 45) * (0.8 + Math.random() * 0.5);
    credit(p); toast(`Airdrop caught: +${fmt(p)} sats.`);
    spray(e.clientX, e.clientY, 22, true); floater(e.clientX, e.clientY, `+${fmt(p)}`, true);
    ribbonPush(`${hex6()} +${fmt(p)}`);
  } else if (orb.kind === "lucky") {
    S.lucky = true; toast("Lucky nonce armed — next block ×25.");
  } else {
    const spec = EVENTS.find((x) => x[0] === orb.kind);
    S.buff[orb.kind] = S.t + spec[4];
    if (orb.kind === "coolant") S.heat = Math.max(0, S.heat - 40);
    toast(`${spec[1]} caught: ${spec[2]}.`);
  }
  S.stim += 4; S.stimEarned += 4;
  sfx.orb(); save();
}
function doFork() {
  const btn = $("#forkBtn");
  if (btn && !btn.classList.contains("armed")) {
    btn.classList.add("armed");
    btn.textContent = "SURE? THE AISLE GOES QUIET…";
    setTimeout(() => { if (btn.isConnected) { btn.classList.remove("armed"); btn.textContent = "HARD FORK THE CHAIN"; } }, 3200);
    return;
  }
  S.forks += 1;
  S.sats = 0; S.lifetime = 0;
  S.counts = emptyCounts(); S.drones = 0; S.ups = []; S.droneUps = [];
  S.heat = 0; S.combo = 0;
  S.lucky = false; S.buff = {};
  toast(`HARD FORK #${S.forks}. All output +${Math.round(S.forks * 18)}%. The chain survives.`);
  sfx.fork();
  shake(0.5);
  save(); renderLists(); renderStats();
}

/* ---------------- helpers ---------------- */
const $ = (s) => document.querySelector(s);
function toast(msg) { const el = $("#toast"); if (el) el.textContent = msg; }

/* ---------------- shell ---------------- */
document.getElementById("root").innerHTML = `
<main id="forge">
  <header class="nav">
    <div class="heat-bar"><span id="heat"></span></div>
    <div class="brand"><span class="brand-mark">₿</span><div><small>HASH</small><b>FORGE</b></div></div>
    <div class="network" id="news">${NEWS[0]}</div>
    <div class="wallet">
      <div class="stim-line"><small>STIMULATION</small><strong id="stim">0</strong></div>
      <div><small>BALANCE</small><strong id="balance">0 <em>SATS</em></strong></div>
      <button class="mute-btn" id="muteBtn" type="button" title="Toggle sound">🔊</button>
    </div>
  </header>
  <section class="hero" id="hero">
    <div class="hero-copy">
      <p class="eyebrow">PROOF OF WORK / CHAPTER 01</p>
      <h1>Strike the<br /><i>impossible.</i></h1>
      <p class="lede">Click to hash. <b>Drones hash for you</b> the moment you unlock them. Spend stimulation on chaos. Catch the drops.</p>
    </div>
    <div class="mine-console">
      <div class="hash-display" id="hashDisplay">00000000</div>
      <div class="hash-display-caption">CANDIDATE BLOCK HASH — LEADING ZEROS PAY</div>
      <button class="strike-btn" id="strikeBtn" type="button" aria-label="Mine">
        <span class="glyph">₿</span>
        <span class="lbl">STRIKE</span>
        <span class="power" id="clickPower">+3</span>
      </button>
      <div class="combo-wrap">
        <div class="combo-line"><span>COMBO</span><b id="combo">×0</b></div>
        <div class="combo-bar"><span id="comboBar"></span></div>
      </div>
      <p class="auto-hint locked" id="autoHint">10 STRIKES → AUTO-HASHER ONLINE</p>
    </div>
  </section>
  <section class="dashboard">
    <div class="stats">
      <article><small>HASHRATE</small><strong id="rate">0.0</strong><span>strikes / second</span></article>
      <article><small>INCOME</small><strong id="income" class="up">0</strong><span>sats / second</span></article>
      <article><small>BLOCKS FOUND</small><strong id="blocks" class="cyan">0</strong><span id="critLine">8% per strike</span></article>
      <article><small>LIFETIME</small><strong id="life">0</strong><span>sats ever mined</span></article>
    </div>
    <p class="terminal-log" style="margin-top:10px"><span>›</span> <span id="toast">Boot complete. Strike the block to mine.</span></p>
  </section>
  <section class="section" id="autoSection">
    <div class="section-head">
      <div><p class="eyebrow">01 / AUTO-HASHER</p><h2>Stop typing. <i>Start humming.</i></h2></div>
      <p>Drones strike the block for you, feed your combo, and earn stimulation while you watch.</p>
    </div>
    <div class="auto-grid" id="autoGrid"></div>
  </section>
  <section class="section tint">
    <div class="section-head">
      <div><p class="eyebrow">02 / UPGRADES</p><h2>Sharper <i>silicon.</i></h2></div>
      <p>One-time installs. Bought with sats. They never un-buy.</p>
    </div>
    <div class="shop-grid" id="upGrid"></div>
  </section>
  <section class="section">
    <div class="section-head">
      <div><p class="eyebrow">03 / STIMULATION</p><h2>Make it <i>louder.</i></h2></div>
      <p>Every strike and drone tick earns stimulation. Buy chaos. Chaos pays you back.</p>
    </div>
    <div class="stim-grid" id="stimGrid"></div>
  </section>
  <section class="section tint">
    <div class="section-head">
      <div><p class="eyebrow">04 / HARDWARE BAY</p><h2>Scale the <i>operation.</i></h2></div>
      <p>Rigs earn sats every second, even while you stare at the chaos you bought.</p>
    </div>
    <div class="machines" id="machines"></div>
  </section>
  <section class="section">
    <div class="section-head">
      <div><p class="eyebrow">05 / THE LONG GAME</p><h2>Legacy <i>stats.</i></h2></div>
      <p>Achievements add +1% strike payout each, forever. Forks multiply everything.</p>
    </div>
    <div class="endgame">
      <div class="ach-grid" id="achGrid"></div>
      <div class="fork-panel">
        <h3>HARD FORK</h3>
        <p>Reset your rigs, drones and upgrades. Keep chaos, achievements and the last sat. Every fork grants a permanent <b style="color:var(--accent)">+18% to all output</b>.</p>
        <p class="fork-stat" id="forkStat"></p>
        <button class="fork-btn" id="forkBtn" type="button">HARD FORK THE CHAIN</button>
      </div>
    </div>
  </section>
  <footer><span>HASH FORGE MINING CO.</span><span>SIMULATION ONLY</span><span>CATCH THE DROPS</span></footer>
</main>`;

/* ---------------- render ---------------- */
function hashrate() { return autoRate() + (S.clicks > 4 ? 1.5 : 0); }
function incomeRate() {
  const dronePay = clickPower() * 0.5 * (1 + 19 * critChance() * 0.55);
  return rigRate() + autoRate() * dronePay;
}
function renderStats() {
  $("#balance").innerHTML = `${fmt(S.sats)} <em>SATS</em>`;
  $("#stim").textContent = fmt(Math.floor(S.stim));
  $("#rate").textContent = hashrate().toFixed(1);
  $("#income").textContent = fmt(incomeRate());
  $("#blocks").textContent = fmt(S.blocks);
  $("#critLine").textContent = `${Math.round(critChance() * 100)}% per strike`;
  $("#life").textContent = fmt(S.lifetimeTotal);
  $("#combo").textContent = "×" + (S.comboUntil > S.t ? S.combo : 0);
  $("#comboBar").style.width = (S.comboUntil > S.t ? (S.combo / 30) * 100 : 0) + "%";
  $("#heat").style.width = S.heat + "%";
  $("#clickPower").textContent = "+" + fmt(clickPower());
  const hint = $("#autoHint");
  if (S.drones > 0) {
    hint.classList.add("done"); hint.classList.remove("locked");
    hint.innerHTML = `<b>🤖 ${S.drones} DRONE${S.drones > 1 ? "S" : ""}</b> — ${autoRate().toFixed(1)} strikes/sec`;
  } else if (S.clicks >= 10) {
    hint.classList.add("done"); hint.classList.remove("locked");
    hint.innerHTML = `<b>AUTO-HASHER ONLINE</b> — buy your first drone below`;
  } else {
    hint.innerHTML = `${S.clicks}/10 STRIKES → AUTO-HASHER ONLINE`;
  }
  const forge = $("#forge");
  const calm = S.lastsat;
  forge.classList.toggle("fx-terminal", has("terminal") && !calm);
  forge.classList.toggle("fx-shimmer", has("shimmer") && !calm);
  forge.classList.toggle("fx-glow", has("glow") && S.comboUntil > S.t && S.combo > 8 && !calm);
  forge.classList.toggle("fx-worm", has("worm") && !calm);
  forge.classList.toggle("fx-lastsat", calm);
  forge.classList.toggle("fx-heat", S.heat > 88 && !calm);
  $("#muteBtn").textContent = S.muted ? "🔇" : "🔊";
}

function renderLists() {
  const dCost = droneCost();
  const canD = S.sats >= dCost;
  $("#autoGrid").innerHTML = `
    <button type="button" class="auto-card ${canD ? "ready" : ""} ${S.clicks < 10 ? "locked" : ""}" data-drone="1">
      <span class="drone-icon">🤖</span>
      <span><b>Hash drone ×${S.drones}</b>
      <small>${S.clicks < 10 ? "Unlock: reach 10 strikes." : `Each drone strikes the block ${(droneSpeed()).toFixed(0)}×/sec at half power and keeps your combo warm.`}</small></span>
      <span class="buy-line"><i>${fmt(dCost)} SATS</i><em>${canD ? "READY TO DEPLOY" : "NEED SATS"}</em></span>
    </button>
    <div class="auto-up-list">${DRONE_UPS.map((d) => {
      const owned = S.droneUps.includes(d[0]);
      const ready = !owned && S.sats >= d[3];
      return `<button type="button" class="mini-up ${owned ? "owned" : ready ? "ready" : ""}" data-dup="${d[0]}">
        <span><b>${d[1]}</b><small>${d[2]}</small></span>
        <i>${owned ? "INSTALLED" : fmt(d[3]) + " SATS"}</i>
      </button>`;
    }).join("")}</div>`;

  const ups = UPGRADES.slice().sort((a, b) => (up(a[0]) ? 1 : 0) - (up(b[0]) ? 1 : 0) || a[3] - b[3]);
  $("#upGrid").innerHTML = ups.filter((u) => up(u[0]) || S.sats >= u[3] * 0.35 || S.lifetimeTotal > u[3] * 0.5)
    .slice(0, 8).map((u) => {
      const owned = up(u[0]);
      const ready = !owned && S.sats >= u[3];
      return `<button type="button" class="shop-card ${owned ? "owned" : ready ? "ready" : ""}" data-up="${u[0]}">
        <span class="tag">${u[4]}</span><b>${u[1]}</b><small>${u[2]}</small>
        <i>${owned ? "INSTALLED" : fmt(u[3]) + " SATS"}</i></button>`;
    }).join("") || `<p class="locked">First upgrades appear at ~35 sats.</p>`;

  const unowned = CHAOS.filter((c) => !has(c[0])).sort((a, b) => a[3] - b[3]).slice(0, 5);
  const owned = CHAOS.filter((c) => has(c[0]));
  $("#stimGrid").innerHTML = S.lastsat
    ? `<p class="terminal-log">21,000,000 / 21,000,000 mined. The ledger is full. <span>The farm hums on, golden.</span></p>`
    : unowned.map((c) => `<button type="button" class="stim-slot ${S.stim >= c[3] ? "ready" : ""}" data-chaos="${c[0]}">
        <span><span class="stim-ico">${c[4]}</span><b>${c[1]}</b><small>${c[2]}</small></span>
        <i>${fmt(c[3])} STIM</i></button>`).join("")
      + owned.map((c) => `<div class="stim-slot owned"><span><span class="stim-ico">${c[4]}</span><b>${c[1]}</b><small>${c[2]}</small></span><i>ACTIVE</i></div>`).join("");

  $("#machines").innerHTML = MACHINES.map((m) => {
    const n = S.counts[m[0]] || 0;
    const cost = nextCost(m[3], n);
    const can = S.sats >= cost;
    return `<article class="machine"><div class="machine-art ${m[7]}"><img src="${m[6]}" alt="${m[1]}" /></div>
      <div class="machine-body"><div class="machine-top"><span>${m[5]}</span><span>×${n}</span></div>
      <h3>${m[1]}</h3><p>${m[2]}</p><div class="rate">+${m[4]} <small>SATS / SEC</small></div>
      <button type="button" class="${can ? "ready" : ""}" data-buy="${m[0]}">${can ? "DEPLOY" : "NEED SATS"} <span>${fmt(cost)}</span></button></div></article>`;
  }).join("");

  $("#achGrid").innerHTML = ACHIEVEMENTS.map((a) => {
    const got = S.ach.includes(a[0]);
    return `<div class="ach ${got ? "got" : "locked"}"><span class="tick">${got ? "✔" : "·"}</span><b>${a[1]}</b><small>${a[2]}</small></div>`;
  }).join("");

  const need = 1e6;
  $("#forkStat").textContent = `FORKS: ${S.forks} · CURRENT BONUS ×${forkMult().toFixed(2)} · NEEDS ${fmt(need)} LIFETIME SATS`;
  const fb = $("#forkBtn");
  fb.disabled = S.lifetimeTotal < need;
  fb.textContent = "HARD FORK THE CHAIN";
  fb.classList.remove("armed");
}

/* ---------------- input ---------------- */
document.addEventListener("pointerdown", () => audio(), { once: true });
addEventListener("pointermove", (e) => { ptr.x = e.clientX; ptr.y = e.clientY; }, { passive: true });

const strikeBtn = $("#strikeBtn");
strikeBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  manualStrike(e.clientX, e.clientY);
  strikeBtn.classList.add("smash");
  setTimeout(() => strikeBtn.classList.remove("smash"), 70);
});
addEventListener("keydown", (e) => {
  if (e.repeat) return;
  if (e.code === "Space" || e.code === "Enter") {
    const t = document.activeElement && document.activeElement.tagName;
    if (t === "BUTTON" && document.activeElement !== strikeBtn) return;
    e.preventDefault();
    manualStrike(coreX, coreY);
    strikeBtn.classList.add("smash");
    setTimeout(() => strikeBtn.classList.remove("smash"), 70);
  }
});
document.addEventListener("click", (e) => {
  const t = e.target;
  if (t.closest("[data-drone]")) return buyDrone();
  const dup = t.closest("[data-dup]");
  if (dup) return buyDroneUp(dup.getAttribute("data-dup"));
  const upEl = t.closest("[data-up]");
  if (upEl) return buyUpgrade(upEl.getAttribute("data-up"));
  const chaos = t.closest("[data-chaos]");
  if (chaos) return buyChaos(chaos.getAttribute("data-chaos"));
  const buy = t.closest("[data-buy]");
  if (buy) return buyMachine(buy.getAttribute("data-buy"));
  if (t.closest("#forkBtn")) return doFork();
  if (t.closest("#muteBtn")) { S.muted = !S.muted; renderStats(); save(); }
});

/* ---------------- difficulty stamp ---------------- */
function spawnStamp() {
  if (!has("stamp") || S.lastsat) return;
  const up = Math.random() < 0.55;
  const pct = (0.4 + Math.random() * 4.8).toFixed(1);
  const pay = Math.max(30, rigRate() * (up ? 6 : 3));
  credit(pay);
  if (up) S.stim += 2, S.stimEarned += 2;
  const el = document.createElement("div");
  el.className = "stamp " + (up ? "up" : "down");
  el.innerHTML = `DIFFICULTY ${up ? "▲" : "▼"} ${pct}%<small>${up ? `network pays the strong — +${fmt(pay)} sats` : `easier blocks ahead — +${fmt(pay)} sats`}</small>`;
  el.style.left = 18 + Math.random() * 52 + "vw";
  el.style.top = 16 + Math.random() * 34 + "vh";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1500);
  ribbonPush(`${hex6()} +${fmt(pay)}`);
  if (has("rumble")) shake(0.22);
  sfx.stamp();
}

/* ---------------- ransomware windows ---------------- */
function spawnRansom() {
  if (!has("ransom") || S.lastsat || document.querySelectorAll(".ransom").length >= 2) return;
  const [title, body, cta] = RANSOMWARE[Math.floor(Math.random() * RANSOMWARE.length)];
  const el = document.createElement("div");
  el.className = "ransom";
  el.style.left = 10 + Math.random() * 66 + "vw";
  el.style.top = 14 + Math.random() * 52 + "vh";
  el.style.rotate = (Math.random() * 5 - 2.5) + "deg";
  el.innerHTML = `<div class="ransom-bar"><span>${title}</span><button type="button" data-ransom-x="1">✕</button></div>
    <div class="ransom-body">${body}<pre>${hex6()}${hex6()}…${hex6()}</pre></div>
    <button type="button" class="ransom-claim" data-ransom-claim="1">${cta}</button>`;
  document.body.appendChild(el);
  sfx.ransom();
  const pay = Math.max(50, rigRate() * 22);
  el.querySelector("[data-ransom-claim]").onclick = () => {
    credit(pay); S.stim += 3; S.stimEarned += 3;
    toast(`Wallet swept: their ${fmt(pay)} sats are your sats now.`);
    floater(el.getBoundingClientRect().left + 80, el.getBoundingClientRect().top + 60, `+${fmt(pay)}`, true);
    ribbonPush(`${hex6()} +${fmt(pay)}`);
    if (has("rumble")) shake(0.2);
    sfx.claim(); el.remove(); save();
  };
  el.querySelector("[data-ransom-x]").onclick = () => el.remove();
  setTimeout(() => el.isConnected && el.remove(), 16000);
}

/* ---------------- whale alerts ---------------- */
function spawnWhale() {
  if (!has("whale") || S.lastsat || document.querySelector(".whale")) return;
  const pay = Math.max(20, rigRate() * 6);
  credit(pay); S.stim += 3; S.stimEarned += 3;
  const el = document.createElement("div");
  el.className = "whale";
  el.textContent = `${WHALES[Math.floor(Math.random() * WHALES.length)]} +${fmt(pay)} sats`;
  document.body.appendChild(el);
  ribbonPush(`${hex6()} +${fmt(pay)}`);
  sfx.whale();
  setTimeout(() => el.remove(), 6300);
}

/* ---------------- orbs ---------------- */
let orbId = 1;
function spawnOrb() {
  if (S.orbs.length >= 2) return;
  const kind = EVENTS[Math.floor(Math.random() * EVENTS.length)][0];
  const el = document.createElement("button");
  el.className = "event-orb";
  el.type = "button";
  const spec = EVENTS.find((x) => x[0] === kind);
  el.style.left = 10 + Math.random() * 78 + "vw";
  el.style.top = 14 + Math.random() * 66 + "vh";
  el.innerHTML = `<img src="${spec[3]}" alt="" /><span>${spec[1].toUpperCase()}</span>`;
  const orb = { id: orbId++, kind, el };
  el.addEventListener("pointerdown", (e) => { e.preventDefault(); catchOrb(orb, e); });
  document.body.appendChild(el);
  S.orbs.push(orb);
  sfx.orb();
  setTimeout(() => { if (orb.el.isConnected) { orb.el.remove(); S.orbs = S.orbs.filter((o) => o !== orb); } }, 11000);
}

/* ---------------- achievements ---------------- */
function checkAch() {
  for (const a of ACHIEVEMENTS) {
    if (!S.ach.includes(a[0]) && a[3](S)) {
      S.ach.push(a[0]);
      const el = document.createElement("div");
      el.className = "ach-toast";
      el.innerHTML = `<span class="medal">🏆</span><span><b>${a[1]}</b><small>${a[2]} · +1% strike payout</small></span>`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4000);
      sfx.claim();
      renderLists();
    }
  }
}

/* ---------------- news ---------------- */
function rotateNews() {
  S.newsIdx = (S.newsIdx + 1) % NEWS.length;
  const el = $("#news");
  el.classList.remove("flash");
  el.textContent = NEWS[S.newsIdx];
}

/* ---------------- main loop ---------------- */
let last = performance.now(), acc = 0, saveAcc = 0, newsAcc = 0, renderAcc = 0, scrambleAcc = 0;
const droneVis = { t: 0, acc: 0, pay: 0 };
let hiddenAt = 0;
document.addEventListener("visibilitychange", () => {
  if (document.hidden) { hiddenAt = Date.now(); save(); }
  else if (hiddenAt) {
    const secs = Math.min((Date.now() - hiddenAt) / 1000, 28800);
    hiddenAt = 0;
    if (secs > 10 && rigRate() > 0) {
      const gain = rigRate() * secs;
      credit(gain);
      toast(`The rigs kept humming: +${fmt(gain)} sats while you were away.`);
      save();
    }
  }
});
addEventListener("pagehide", save);

(function offline() {
  const secs = Math.min((Date.now() - (S.lastSave || Date.now())) / 1000, 28800);
  if (secs > 120 && rigRate() > 0) {
    const gain = rigRate() * secs * 0.5;
    credit(gain);
    setTimeout(() => toast(`While you were away (${Math.floor(secs / 60)} min): the rigs mined +${fmt(gain)} sats.`), 800);
  }
})();

function loop(now) {
  const rawDt = now - last;
  const dt = Math.min(0.1, rawDt / 1000);
  last = now;
  emaDt = emaDt * 0.95 + rawDt * 0.05;
  Q = emaDt > 26 ? 0.55 : emaDt < 18 ? 1 : Q; // adaptive quality
  S.t += dt;
  S.heat = Math.max(0, S.heat - dt * 11);

  const rr = rigRate();
  if (rr) credit(rr * dt);

  // drone strikes: exact economy, batched visuals
  const ar = autoRate();
  if (ar) {
    S.autoAcc += ar * dt;
    let n = Math.floor(S.autoAcc);
    if (n > 60) { n = 60; S.autoAcc = 0; } else S.autoAcc -= n;
    let gained = 0;
    for (let i = 0; i < n; i++) gained += strikeEconomy(false).pay;
    droneVis.acc += n; droneVis.pay += gained;
  }
  droneVis.t += dt;
  if (droneVis.t >= 0.22) {
    if (droneVis.acc > 0) {
      droneJuice(droneVis.acc, droneVis.pay);
      ribbonPush(`${hex6()} +${fmt(droneVis.pay)}`);
    }
    droneVis.t = 0; droneVis.acc = 0; droneVis.pay = 0;
  }

  // timers
  S.nextOrb -= dt; if (S.nextOrb <= 0) { spawnOrb(); S.nextOrb = 14 + Math.random() * 14; }
  S.stampAt -= dt; if (S.stampAt <= 0) { spawnStamp(); S.stampAt = 7.5; }
  S.ransomAt -= dt; if (S.ransomAt <= 0) { spawnRansom(); S.ransomAt = 26 + Math.random() * 20; }
  S.whaleAt -= dt; if (S.whaleAt <= 0) { spawnWhale(); S.whaleAt = 42 + Math.random() * 30; }
  newsAcc += dt; if (newsAcc > 8) { newsAcc = 0; rotateNews(); }

  // housekeeping (staggered)
  acc += dt; if (acc > 1) { acc = 0; checkAch(); }
  saveAcc += dt; if (saveAcc > 6) { saveAcc = 0; save(); }
  renderAcc += dt; if (renderAcc > 0.18) { renderAcc = 0; renderStats(); }
  scrambleAcc += dt;
  if (scrambleAcc > 0.13) { scrambleAcc = 0; scramble(false); }

  drawCanvas(dt, now);
  requestAnimationFrame(loop);
}

/* ---------------- canvas ---------------- */
function drawCanvas(dt, now) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const calm = S.lastsat;
  const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // cache the strike core position once per frame (swarm orbits it)
  if (now - coreAt > 250 || !coreAt) {
    coreAt = now;
    const b = strikeBtn.getBoundingClientRect();
    coreX = b.left + b.width / 2; coreY = b.top + b.height / 2;
  }

  // hash cascade
  if (has("cascade") && !calm) {
    const cols = Math.round((Q < 1 ? 14 : 24) * (canvas.width / 1440 + 0.4));
    const colW = canvas.width / cols;
    for (let i = 0; i < cols; i++) {
      const speed = 90 + (i % 5) * 40;
      const y = (now * 0.001 * speed + i * 197) % (canvas.height + 120) - 60;
      const x = i * colW + 14;
      ctx.font = fontStr(12, true);
      ctx.fillStyle = "rgb(200 242 74 / 0.3)";
      ctx.fillText(HEX[(i + Math.floor(now / 300)) % 16], x, y);
      ctx.fillStyle = "rgb(200 242 74 / 0.14)";
      ctx.fillText(HEX[(i * 3) % 16], x, y - 18);
    }
  }

  // chain constellation
  if (chainNodes.length) {
    ctx.lineWidth = 1;
    for (let i = 0; i < chainNodes.length; i++) {
      const n = chainNodes[i];
      if (i > 0) {
        const p = chainNodes[i - 1];
        const a = Math.min(1, (S.t - n.born) / 0.6);
        ctx.strokeStyle = `rgb(200 242 74 / ${0.14 * a})`;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(n.x, n.y); ctx.stroke();
      }
      const tw = 0.5 + 0.5 * Math.sin(now / 600 + n.seed);
      const newest = i === chainNodes.length - 1;
      ctx.fillStyle = newest ? `rgb(255 200 80 / ${0.7 + 0.3 * tw})` : `rgb(207 232 255 / ${0.35 * tw + 0.15})`;
      const s = newest ? 5 : 3;
      ctx.fillRect(n.x - s / 2, n.y - s / 2, s, s);
    }
  }

  // rig swarm
  if (has("swarm") && S.drones > 0 && !calm) {
    const n = Math.min(S.drones, Q < 1 ? 12 : 24);
    for (let i = 0; i < n; i++) {
      const a = S.t * (0.7 + droneSpeed() * 0.25) + (i / n) * Math.PI * 2;
      const r = 150 + (i % 5) * 16 + Math.sin(S.t * 1.3 + i) * 7;
      const x = coreX + Math.cos(a) * r, y = coreY + Math.sin(a) * r * 0.55;
      ctx.drawImage(droneSprite, x - 11, y - 11);
    }
  }

  // ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    const r = ripples[i];
    r.r += dt * 340; r.life -= dt / 0.6;
    if (r.life <= 0) { ripples.splice(i, 1); continue; }
    ctx.globalAlpha = Math.max(0, r.life) * 0.5;
    ctx.strokeStyle = "#3ec8e8"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // ledger ribbon (canvas-drawn, bottom strip)
  if (ribbon.length) {
    const h = 24;
    ctx.fillStyle = "rgb(8 9 10 / 0.6)";
    ctx.fillRect(0, canvas.height - h, canvas.width, h);
    ctx.font = fontStr(10, true);
    for (let i = ribbon.length - 1; i >= 0; i--) {
      const e = ribbon[i];
      e.x -= 70 * dt;
      if (e.x < -260) { ribbon.splice(i, 1); continue; }
      ctx.fillStyle = "rgb(62 200 232 / 0.75)";
      ctx.fillText(e.text, e.x, canvas.height - 8);
    }
  }

  // particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= dt / 0.75; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 130 * dt;
    if (p.life <= 0) {
      const moved = particles.pop();
      if (i < particles.length) particles[i] = moved; // swap-pop while iterating backward
      continue;
    }
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.c;
    ctx.font = fontStr(p.sz, p.mono);
    ctx.fillText(p.text, p.x, p.y);
  }
  ctx.globalAlpha = 1;

  // screen shake: block-finds only, capped, fast decay
  trauma = Math.max(0, trauma - dt * 2.8);
  const sh = trauma * trauma;
  const root = $("#forge");
  if (root && !rm) {
    const tx = sh > 0.004 ? `translate(${(Math.random() * 2 - 1) * sh * 9}px, ${(Math.random() * 2 - 1) * sh * 9}px)` : "";
    if (root.__shake !== tx) { root.style.transform = tx; root.__shake = tx; }
  }
}

/* ---------------- boot ---------------- */
window.__HF__ = S; // debug/testing handle
window.__HFD__ = { get trauma() { return trauma; } };
renderStats();
renderLists();
scrambleCrit();
requestAnimationFrame(loop);
