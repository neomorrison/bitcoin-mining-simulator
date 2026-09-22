/* ============================================================
   HASH FORGE v2 — a bitcoin mining clicker
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
  ["od2", "Drone overdrive II", "Drones strike ×2 again.", 25000],
];
const CHAOS = [
  ["sparks", "Hash sparks", "Every strike sprays hex shards.", 5, "⚡"],
  ["comet", "Cursor comet", "Your pointer leaves a hash trail.", 14, "☄️"],
  ["ripples", "Block ripples", "Strikes ring out across the void.", 22, "◎"],
  ["rain", "Nonce rain", "Hex ticker-tape from the sky.", 40, "🌧️"],
  ["starfield", "Deep space screensaver", "The void fills with drifting stars.", 70, "✨"],
  ["bounce", "Bouncing block", "A ₿ ricochets. Wall hits pay.", 110, "₿", true],
  ["quake", "Rig quake", "Every strike shakes the aisle.", 160, "🌋"],
  ["crt", "Old monitor", "Scanlines. +8% strike payout.", 240, "📺"],
  ["chroma", "Chromatic bleed", "The farm splits into RGB ghosts.", 340, "🌈"],
  ["smash", "Hydraulic smash", "A press slams the aisle every few seconds. Pays out.", 500, "🏗️"],
  ["spam", "Mempool spam", "Popup windows! Close them for sats.", 700, "🗯️"],
  ["strobe", "Farm strobe", "LEDs pulse when your combo runs hot.", 950, "💡"],
  ["worm", "Mempool wormhole", "Warp vignette. +10% rig output.", 1300, "🕳️"],
  ["subliminal", "Subliminal ticker", "The news sometimes says: MINE MORE.", 1800, "👁️"],
  ["ocean", "Go to the ocean", "Turn it all off. A huge payout. Peace.", 8000, "🌊"],
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
  ["ocean1", "The quiet", "Reach the ocean", (S) => S.ocean],
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
const SUBS = ["MINE MORE", "CLICK IT", "STAY ONLINE", "HASH IS LOVE", "NEVER STOP"];

const SAVE_KEY = "hash-forge-v2";
const HEX = "0123456789ABCDEF";
const COST = 1.15;

/* ---------------- state ---------------- */
const emptyCounts = () => ({ cpu: 0, gpu: 0, fpga: 0, asic: 0, farm: 0 });
function defaultState() {
  return {
    sats: 0, lifetime: 0, lifetimeTotal: 0, stim: 0, stimEarned: 0,
    hashes: 0, clicks: 0, blocks: 0,
    counts: emptyCounts(), drones: 0, ups: [], droneUps: [], chaos: [], bounceN: 0,
    ach: [], forks: 0, orbsCaught: 0,
    lucky: false, ocean: false, muted: false,
    bestCombo: 0, buffRemain: {}, lastSave: Date.now(),
  };
}
function load() {
  const d = defaultState();
  try {
    const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
    if (!raw) return d;
    const S = { ...d, ...raw, counts: { ...emptyCounts(), ...(raw.counts || {}) } };
    return S;
  } catch (_) { return d; }
}
const S = load();
S.heat = 0; S.combo = 0; S.comboUntil = 0; S.t = 0;
S.buff = {}; for (const k in (S.buffRemain || {})) S.buff[k] = S.t + (+S.buffRemain[k] || 0);
S.orbs = []; S.nextOrb = 10;
S.autoAcc = 0; S.smashAt = 6; S.spamAt = 24; S.subAt = 30;
S.newsIdx = Math.floor(Math.random() * NEWS.length);

function save() {
  S.lastSave = Date.now();
  const remain = {};
  for (const k in S.buff) if (S.buff[k] > S.t) remain[k] = S.buff[k] - S.t;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      sats: S.sats, lifetime: S.lifetime, lifetimeTotal: S.lifetimeTotal, stim: S.stim, stimEarned: S.stimEarned,
      hashes: S.hashes, clicks: S.clicks, blocks: S.blocks,
      counts: S.counts, drones: S.drones, ups: S.ups, droneUps: S.droneUps, chaos: S.chaos, bounceN: S.bounceN,
      ach: S.ach, forks: S.forks, orbsCaught: S.orbsCaught,
      lucky: S.lucky, ocean: S.ocean, muted: S.muted,
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
  if (has("crt") && !S.ocean) p *= 1.08;
  return p * comboMult() * achMult() * forkMult();
}
function rigRate() {
  let r = MACHINES.reduce((s, m) => s + (S.counts[m[0]] || 0) * m[4], 0);
  if (up("pool")) r *= 2;
  if (up("immersion")) r *= 2;
  if (up("nuclear")) r *= 3;
  if ((S.buff.overclock || 0) > S.t) r *= 3;
  if ((S.buff.coolant || 0) > S.t) r *= 1.5;
  if (has("worm") && !S.ocean) r *= 1.1;
  if (S.ocean) r *= 0.45;
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
function bounceCost() { return Math.floor(110 * Math.pow(1.55, S.bounceN)); }
function chaosCost(id) { return id === "bounce" ? bounceCost() : (CHAOS.find((c) => c[0] === id) || [0, 0, 0, 0])[3]; }
function credit(n) { S.sats += n; S.lifetime += n; S.lifetimeTotal += n; }
function fmt(n) {
  if (!isFinite(n)) return "∞";
  if (n < 1e3) return Math.floor(n).toString();
  const u = ["K", "M", "B", "T", "Qa", "Qi"];
  let i = -1;
  while (n >= 1e3 && i < u.length - 1) { n /= 1e3; i++; }
  return (n >= 100 ? Math.floor(n) : n.toFixed(1)) + u[i];
}

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
  drone() { const n = performance.now(); if (n - lastDroneBeep > 110) { lastDroneBeep = n; tone(220, 0.045, 0.014, "sine"); } },
  crit() { tone(660, 0.1, 0.06, "square"); setTimeout(() => tone(990, 0.16, 0.06, "square"), 90); },
  buy() { tone(520, 0.07, 0.05, "triangle"); setTimeout(() => tone(780, 0.1, 0.05, "triangle"), 70); },
  orb() { tone(880, 0.12, 0.05, "sine"); setTimeout(() => tone(1320, 0.14, 0.04, "sine"), 80); },
  smash() { tone(70, 0.2, 0.09, "sawtooth", -30); },
  spam() { tone(200, 0.09, 0.05, "sawtooth"); setTimeout(() => tone(150, 0.12, 0.05, "sawtooth"), 60); },
  claim() { tone(700, 0.08, 0.05, "sine"); setTimeout(() => tone(1050, 0.1, 0.05, "sine"), 70); },
  fork() { tone(400, 0.5, 0.08, "sawtooth", -320); },
  deny() { tone(130, 0.1, 0.04, "square"); },
};

/* ---------------- canvas fx ---------------- */
const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d");
function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
resize(); addEventListener("resize", resize);

const particles = [], ripples = [], balls = [], stars = [];
let trauma = 0, trailAt = 0;
const ptr = { x: innerWidth / 2, y: innerHeight / 2 };
addEventListener("pointermove", (e) => {
  ptr.x = e.clientX; ptr.y = e.clientY;
  if (has("comet") && !S.ocean && performance.now() - trailAt > 28) {
    trailAt = performance.now();
    particles.push({ x: ptr.x, y: ptr.y, vx: (Math.random() - 0.5) * 40, vy: -30 - Math.random() * 40, life: 1, text: HEX[Math.floor(Math.random() * 16)], c: "#3ec8e8", sz: 11 });
  }
}, { passive: true });

function spray(x, y, n, big) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, spd = 60 + Math.random() * (big ? 300 : 190);
    particles.push({ x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd - 50, life: 1, text: HEX[i % 16], c: i % 3 === 0 ? "#ff6a1a" : i % 3 === 1 ? "#c8f24a" : "#3ec8e8", sz: big ? 14 : 11 });
  }
}
function floater(x, y, text, big) {
  particles.push({ x, y, vx: (Math.random() - 0.5) * 30, vy: -85, life: 1, text, c: big ? "#c8f24a" : "#efe8d8", sz: big ? 20 : 13, mono: true });
}
function juice(kind, x, y, text) {
  if (S.ocean) return;
  if (has("sparks")) spray(x, y, kind === "crit" ? 34 : kind === "auto" ? 5 : 13, kind === "crit");
  if (text) floater(x, y, text, kind === "crit");
  if (has("ripples") && kind !== "auto") ripples.push({ x, y, r: 8, life: 1 });
  if (has("quake")) trauma = Math.min(1, trauma + (kind === "crit" ? 0.5 : kind === "smash" ? 0.55 : 0.16));
}

/* ---------------- core actions ---------------- */
function strike(x, y, manual) {
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
    sfx.crit();
    trauma = Math.min(1, trauma + 0.6);
  } else {
    pay = clickPower() * (manual ? 1 : 0.5);
    sfx[manual ? "strike" : "drone"](S.combo);
  }
  credit(pay);
  S.stim += manual ? 1 + Math.floor(S.combo / 6) : 0.2;
  S.stimEarned += manual ? 1 + Math.floor(S.combo / 6) : 0.2;
  if (manual) {
    S.combo = Math.min(30, (S.comboUntil > S.t ? S.combo : 0) + 1);
    S.comboUntil = S.t + comboWindow();
    S.bestCombo = Math.max(S.bestCombo, S.combo);
    S.heat = Math.min(100, S.heat + 3.5);
  } else {
    S.heat = Math.min(100, S.heat + 0.5);
  }
  if (S.comboUntil > S.t) S.comboUntil = S.t + comboWindow();
  juice(manual ? (crit ? "crit" : "click") : "auto", x, y, `+${fmt(pay)}`);
  scrambleHash(crit);
}
function blockBanner(pay, luckyNow) {
  const el = document.createElement("div");
  el.className = "block-flash";
  el.innerHTML = `BLOCK FOUND +${fmt(pay)} SATS<small>${luckyNow ? "LUCKY NONCE ×25 — " : ""}NONCE ${Math.floor(Math.random() * 0xffffff).toString(16).toUpperCase().padStart(6, "0")}</small>`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 950);
}

let hashShown = "";
function scrambleHash(crit) {
  const el = $("#hashDisplay");
  if (!el) return;
  let s = "";
  for (let i = 0; i < 8; i++) s += crit && i < 4 ? "0" : HEX[Math.floor(Math.random() * 16)];
  hashShown = s;
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
  spray(ptr.x, ptr.y, 20); sfx.buy(); save(); renderLists();
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
  const cost = chaosCost(id);
  const repeat = !!spec[5];
  if (!repeat && has(id)) return;
  if (S.stim < cost) { sfx.deny(); toast(`Need ${Math.ceil(cost - S.stim)} more stimulation.`); return; }
  S.stim -= cost;
  if (!has(id)) S.chaos.push(id);
  if (id === "bounce") S.bounceN += 1;
  if (id === "ocean") {
    S.ocean = true;
    credit(4000); S.heat = 0;
    toast("The fans spin down. You can hear the ocean. +4,000 sats.");
    sfx.fork();
  } else {
    toast(`${spec[1]} unlocked.`);
    sfx.buy();
  }
  spray(ptr.x, ptr.y, 26, true);
  save(); renderLists();
}
function catchOrb(orb, e) {
  S.orbs = S.orbs.filter((o) => o.id !== orb.id);
  orb.el.remove();
  S.orbsCaught += 1;
  if (orb.kind === "airdrop") {
    const p = Math.max(60, rigRate() * 45) * (0.8 + Math.random() * 0.5);
    credit(p); toast(`Airdrop caught: +${fmt(p)} sats.`);
    spray(e.clientX, e.clientY, 24, true); floater(e.clientX, e.clientY, `+${fmt(p)}`, true);
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
  trauma = 1;
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
        <p>Reset your rigs, drones and upgrades. Keep chaos, achievements and the ocean. Every fork grants a permanent <b style="color:var(--accent)">+18% to all output</b>.</p>
        <p class="fork-stat" id="forkStat"></p>
        <button class="fork-btn" id="forkBtn" type="button">HARD FORK THE CHAIN</button>
      </div>
    </div>
  </section>
  <footer><span>HASH FORGE MINING CO.</span><span>SIMULATION ONLY</span><span>CATCH THE DROPS</span></footer>
</main>`;

/* ---------------- render ---------------- */
function hashrate() {
  // strikes per second: drones + a gentle nod to manual clicking
  return autoRate() + (S.clicks > 4 ? 1.5 : 0);
}
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
  forge.classList.toggle("fx-crt", has("crt") && !S.ocean);
  forge.classList.toggle("fx-chroma", has("chroma") && !S.ocean);
  forge.classList.toggle("fx-strobe", has("strobe") && S.comboUntil > S.t && S.combo > 6 && !S.ocean);
  forge.classList.toggle("fx-worm", has("worm") && !S.ocean);
  forge.classList.toggle("fx-ocean", S.ocean);
  forge.classList.toggle("fx-heat", S.heat > 88 && !S.ocean);
  $("#muteBtn").textContent = S.muted ? "🔇" : "🔊";
}

function renderLists() {
  // auto-hasher
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

  // upgrades: show owned first (dim), then affordable-ish
  const ups = UPGRADES.filter((u) => !up(u[0]) || up(u[0]))
    .sort((a, b) => (up(a[0]) ? 1 : 0) - (up(b[0]) ? 1 : 0) || a[3] - b[3]);
  $("#upGrid").innerHTML = ups.filter((u) => up(u[0]) || S.sats >= u[3] * 0.35 || S.lifetimeTotal > u[3] * 0.5)
    .slice(0, 8).map((u) => {
      const owned = up(u[0]);
      const ready = !owned && S.sats >= u[3];
      return `<button type="button" class="shop-card ${owned ? "owned" : ready ? "ready" : ""}" data-up="${u[0]}">
        <span class="tag">${u[4]}</span><b>${u[1]}</b><small>${u[2]}</small>
        <i>${owned ? "INSTALLED" : fmt(u[3]) + " SATS"}</i></button>`;
    }).join("") || `<p class="locked">First upgrades appear at ~35 sats.</p>`;

  // chaos
  const unowned = CHAOS.filter((c) => !has(c[0]) || c[5]).sort((a, b) => chaosCost(a[0]) - chaosCost(b[0])).slice(0, 5);
  const owned = CHAOS.filter((c) => has(c[0]) && !c[5]);
  $("#stimGrid").innerHTML = S.ocean
    ? `<p class="terminal-log">Shore leave. The aisle is quiet. <span>+4,000 sats collected.</span></p>`
    : unowned.map((c) => {
      const cost = chaosCost(c[0]);
      return `<button type="button" class="stim-slot ${S.stim >= cost ? "ready" : ""} ${c[5] ? "rep" : ""}" data-chaos="${c[0]}">
        <span><span class="stim-ico">${c[4]}</span><b>${c[1]}${c[5] && has(c[0]) ? ` ×${S.bounceN}` : ""}</b><small>${c[2]}</small></span>
        <i>${fmt(cost)} STIM</i></button>`;
    }).join("") + owned.map((c) =>
      `<div class="stim-slot owned"><span><span class="stim-ico">${c[4]}</span><b>${c[1]}</b><small>${c[2]}</small></span><i>ACTIVE</i></div>`
    ).join("");

  // machines
  $("#machines").innerHTML = MACHINES.map((m) => {
    const n = S.counts[m[0]] || 0;
    const cost = nextCost(m[3], n);
    const can = S.sats >= cost;
    return `<article class="machine"><div class="machine-art ${m[7]}"><img src="${m[6]}" alt="${m[1]}" /></div>
      <div class="machine-body"><div class="machine-top"><span>${m[5]}</span><span>×${n}</span></div>
      <h3>${m[1]}</h3><p>${m[2]}</p><div class="rate">+${m[4]} <small>SATS / SEC</small></div>
      <button type="button" class="${can ? "ready" : ""}" data-buy="${m[0]}">${can ? "DEPLOY" : "NEED SATS"} <span>${fmt(cost)}</span></button></div></article>`;
  }).join("");

  // achievements
  $("#achGrid").innerHTML = ACHIEVEMENTS.map((a) => {
    const got = S.ach.includes(a[0]);
    return `<div class="ach ${got ? "got" : "locked"}"><span class="tick">${got ? "✔" : "·"}</span><b>${a[1]}</b><small>${a[2]}</small></div>`;
  }).join("");

  // fork panel
  const need = 1e6;
  $("#forkStat").textContent = `FORKS: ${S.forks} · CURRENT BONUS ×${forkMult().toFixed(2)} · NEEDS ${fmt(need)} LIFETIME SATS`;
  const fb = $("#forkBtn");
  fb.disabled = S.lifetimeTotal < need;
  fb.textContent = "HARD FORK THE CHAIN";
  fb.classList.remove("armed");
}

/* ---------------- input ---------------- */
document.addEventListener("pointerdown", (e) => { audio(); }, { once: true });

const strikeBtn = $("#strikeBtn");
strikeBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  strike(e.clientX, e.clientY, true);
  strikeBtn.classList.add("smash");
  setTimeout(() => strikeBtn.classList.remove("smash"), 70);
});
addEventListener("keydown", (e) => {
  if (e.repeat) return;
  if (e.code === "Space" || e.code === "Enter") {
    const t = document.activeElement && document.activeElement.tagName;
    if (t === "BUTTON" && document.activeElement !== strikeBtn) return;
    e.preventDefault();
    strike(innerWidth / 2, innerHeight * 0.42, true);
    strikeBtn.classList.add("smash");
    setTimeout(() => strikeBtn.classList.remove("smash"), 70);
  }
});

document.addEventListener("click", (e) => {
  const t = e.target;
  const drone = t.closest("[data-drone]");
  if (drone) return buyDrone();
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

/* ---------------- spam popups ---------------- */
const SPAM_LINES = [
  ["CONGRATULATIONS!!!", "You are the 1,000,000th hasher today. Claim your sats immediately.", "CLAIM SATS"],
  ["mempool.exe has stopped", "A fee market formed inside your RAM. Someone should probably claim it.", "SWEEP MEMPOOL"],
  ["Hot single nonces", "Lonely nonces in your area want to be hashed. Act now.", "HASH THEM"],
  ["PRINTER NOT FOUND", "Print more sats? The printer is missing. Claim what's left.", "CLAIM REMAINDER"],
  ["Your block wants attention", "It has been 0.4 seconds since your last block. Terrible. Claim compensation.", "CLAIM COMP"],
];
function spawnSpam() {
  if (!has("spam") || S.ocean || document.querySelectorAll(".spam").length >= 3) return;
  const [title, body, cta] = SPAM_LINES[Math.floor(Math.random() * SPAM_LINES.length)];
  const el = document.createElement("div");
  el.className = "spam";
  el.style.left = 8 + Math.random() * 68 + "vw";
  el.style.top = 12 + Math.random() * 55 + "vh";
  el.style.rotate = (Math.random() * 6 - 3) + "deg";
  let hex = ""; for (let i = 0; i < 42; i++) hex += HEX[Math.floor(Math.random() * 16)];
  el.innerHTML = `<div class="spam-bar"><span>${title}</span><button type="button" data-spam-x="1">✕</button></div>
    <div class="spam-body">${body}<div class="spam-hex">${hex}</div></div>
    <button type="button" class="spam-claim" data-spam-claim="1">${cta}</button>`;
  document.body.appendChild(el);
  sfx.spam();
  const pay = Math.max(40, rigRate() * 25);
  el.querySelector("[data-spam-claim]").onclick = () => {
    credit(pay); S.stim += 3; S.stimEarned += 3;
    toast(`Spam swept: +${fmt(pay)} sats.`);
    floater(parseFloat(el.style.left) / 100 * innerWidth, parseFloat(el.style.top) / 100 * innerHeight, `+${fmt(pay)}`, true);
    sfx.claim(); el.remove(); save();
  };
  el.querySelector("[data-spam-x]").onclick = () => { el.remove(); };
  setTimeout(() => el.isConnected && el.remove(), 18000);
}

/* ---------------- hydraulic press ---------------- */
function spawnSmash() {
  if (!has("smash") || S.ocean) return;
  const pay = Math.max(30, rigRate() * 2.5);
  credit(pay); S.stim += 2; S.stimEarned += 2;
  const x = innerWidth * (0.2 + Math.random() * 0.6);
  juice("smash", x, innerHeight * 0.4, `SMASH +${fmt(pay)}`);
  trauma = Math.min(1, trauma + 0.6);
  sfx.smash();
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

/* ---------------- news + subliminal ---------------- */
function rotateNews() {
  S.newsIdx = (S.newsIdx + 1) % NEWS.length;
  const el = $("#news");
  el.classList.remove("flash");
  el.textContent = NEWS[S.newsIdx];
}
function subliminal() {
  if (!has("subliminal") || S.ocean) return;
  const el = $("#news");
  el.classList.add("flash");
  el.textContent = SUBS[Math.floor(Math.random() * SUBS.length)];
  setTimeout(rotateNews, 420);
}

/* ---------------- main loop ---------------- */
let last = performance.now(), acc = 0, saveAcc = 0, newsAcc = 0, renderAcc = 0;
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

// offline earnings on load
(function offline() {
  const secs = Math.min((Date.now() - (S.lastSave || Date.now())) / 1000, 28800);
  if (secs > 120 && rigRate() > 0) {
    const gain = rigRate() * secs * 0.5;
    credit(gain);
    setTimeout(() => toast(`While you were away (${Math.floor(secs / 60)} min): the rigs mined +${fmt(gain)} sats.`), 800);
  }
})();

function loop(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  S.t += dt;
  S.heat = Math.max(0, S.heat - dt * 11);

  // passive income
  const rr = rigRate();
  if (rr) credit(rr * dt);

  // drones auto-strike
  const ar = autoRate();
  if (ar) {
    S.autoAcc += ar * dt;
    let guard = 0;
    while (S.autoAcc >= 1 && guard < 40) {
      S.autoAcc -= 1; guard++;
      const bx = strikeBtn.getBoundingClientRect();
      strike(bx.left + bx.width / 2 + (Math.random() - 0.5) * 120, bx.top + bx.height / 2 + (Math.random() - 0.5) * 100, false);
    }
  }

  // events
  S.nextOrb -= dt;
  if (S.nextOrb <= 0) { spawnOrb(); S.nextOrb = 14 + Math.random() * 14; }
  S.smashAt -= dt;
  if (S.smashAt <= 0) { spawnSmash(); S.smashAt = 3.4; }
  S.spamAt -= dt;
  if (S.spamAt <= 0) { spawnSpam(); S.spamAt = 22 + Math.random() * 18; }
  S.subAt -= dt;
  if (S.subAt <= 0) { subliminal(); S.subAt = 45 + Math.random() * 30; }
  newsAcc += dt;
  if (newsAcc > 8) { newsAcc = 0; rotateNews(); }

  // housekeeping
  acc += dt; saveAcc += dt; renderAcc += dt;
  if (acc > 1) { acc = 0; checkAch(); }
  if (saveAcc > 6) { saveAcc = 0; save(); }
  if (renderAcc > 0.15) { renderAcc = 0; renderStats(); }

  drawCanvas(dt, now);
  requestAnimationFrame(loop);
}

/* ---------------- canvas ---------------- */
for (let i = 0; i < 150; i++) stars.push({ x: Math.random(), y: Math.random(), z: 0.2 + Math.random() * 0.8, tw: Math.random() * Math.PI * 2 });

function drawCanvas(dt, now) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const ocean = S.ocean;
  const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // starfield (deepest layer)
  if (has("starfield")) {
    for (const st of stars) {
      st.y += st.z * dt * (ocean ? 0.01 : 0.035);
      if (st.y > 1) { st.y = 0; st.x = Math.random(); }
      const tw = 0.35 + 0.3 * Math.sin(now / 700 + st.tw);
      ctx.globalAlpha = (ocean ? 0.25 : 0.7) * tw;
      ctx.fillStyle = ocean ? "#9fd7e8" : "#cfe8ff";
      const s = st.z * 2.2;
      ctx.fillRect(st.x * canvas.width, st.y * canvas.height, s, s);
    }
    ctx.globalAlpha = 1;
  }

  // nonce rain
  if (has("rain") && !ocean) {
    ctx.font = "12px IBM Plex Mono, monospace";
    for (let i = 0; i < 42; i++) {
      ctx.fillStyle = i % 4 === 0 ? "rgb(255 106 26 / 0.3)" : "rgb(200 242 74 / 0.26)";
      ctx.fillText(HEX[(i + Math.floor(now / 400)) % 16], (i * 97 + (now * 0.03) % 97) % canvas.width, (now * (0.14 + (i % 5) * 0.03) + i * 61) % canvas.height);
    }
  }

  // bouncing blocks
  const wantBalls = ocean ? 0 : (has("bounce") ? S.bounceN : 0);
  while (balls.length < wantBalls) balls.push({ x: 80 + Math.random() * (canvas.width - 160), y: 80 + Math.random() * (canvas.height - 160), vx: (Math.random() < 0.5 ? -1 : 1) * 170, vy: (Math.random() < 0.5 ? -1 : 1) * 130 });
  while (balls.length > wantBalls) balls.pop();
  ctx.font = "30px Space Grotesk, sans-serif";
  for (const b of balls) {
    b.x += b.vx * dt; b.y += b.vy * dt;
    if (b.x < 26 || b.x > canvas.width - 26) { b.vx *= -1; credit(2 + forksFlat()); S.stim += 0.4; S.stimEarned += 0.4; }
    if (b.y < 26 || b.y > canvas.height - 26) { b.vy *= -1; credit(2 + forksFlat()); S.stim += 0.4; S.stimEarned += 0.4; }
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = "#ff6a1a";
    ctx.shadowColor = "rgb(255 106 26 / 0.8)"; ctx.shadowBlur = 18;
    ctx.fillText("₿", b.x - 12, b.y + 11);
    ctx.shadowBlur = 0;
  }
  ctx.globalAlpha = 1;

  // ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    const r = ripples[i];
    r.r += dt * 340; r.life -= dt / 0.6;
    if (r.life <= 0) { ripples.splice(i, 1); continue; }
    ctx.globalAlpha = Math.max(0, r.life) * 0.5;
    ctx.strokeStyle = "#3ec8e8"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2); ctx.stroke();
  }

  // particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= dt / 0.75; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 130 * dt;
    if (p.life <= 0 || particles.length > 340) { particles.splice(i, 1); continue; }
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.c;
    ctx.font = `${p.sz}px ${p.mono ? "IBM Plex Mono" : "Space Grotesk"}, monospace`;
    ctx.fillText(p.text, p.x, p.y);
  }
  ctx.globalAlpha = 1;

  // screen shake
  trauma = Math.max(0, trauma - dt * 1.7);
  const sh = trauma * trauma;
  const root = $("#forge");
  if (root && !rm) {
    root.style.transform = sh > 0.005 ? `translate(${(Math.random() * 2 - 1) * sh * 13}px, ${(Math.random() * 2 - 1) * sh * 13}px)` : "";
  }
}
function forksFlat() { return S.forks * 2; }

/* ---------------- boot ---------------- */
window.__HF__ = S; // debug/testing handle
renderStats();
renderLists();
scrambleHash(false);
requestAnimationFrame(loop);
