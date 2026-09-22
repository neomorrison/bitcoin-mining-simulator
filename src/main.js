const MACHINES = [
  ["cpu", "Garage CPU", "A loyal first thread humming in the spare room.", 35, 0.7, "SILICON", "./assets/rig-cpu.png", "dark"],
  ["gpu", "GPU Rig", "Three fans. Parallel heat. Parallel hashes.", 180, 4, "ACCELERATED", "./assets/rig-gpu.png", "light"],
  ["fpga", "FPGA Board", "Rewire the fabric. Hash whatever the bitstream says.", 520, 11, "RECONFIG", "./assets/rig-fpga.png", "light"],
  ["asic", "ASIC Pod", "Purpose-built. No games. Only SHA-256.", 950, 20, "INDUSTRIAL", "./assets/rig-asic.png", "light"],
  ["farm", "ASIC Farm", "A shipping container of relentless machines.", 6200, 120, "MEGA SCALE", "./assets/rig-farm.png", "light"],
];
const EVENTS = [
  ["overclock", "Overclock", "3× hashrate", "./assets/power-overclock.png", 14],
  ["coolant", "Nitrogen drop", "+50% output", "./assets/power-coolant.png", 18],
  ["lucky", "Lucky nonce", "Next hit 25×", "./assets/power-lucky.png", 0],
  ["glitch", "Merkle glitch", "Hot entropy", "./assets/power-glitch.png", 12],
  ["airdrop", "Mempool airdrop", "Instant sats", "./assets/power-lucky.png", 0],
];
const STIMS = [
  ["sparks", "Hash sparks", "Every strike sprays hex.", 6],
  ["bounce", "Bouncing block", "A ₿ ricochets. Wall hits pay.", 18, true],
  ["quake", "Rig quake", "Hits shake the aisle.", 32],
  ["rain", "Nonce rain", "Hex ticker-tape forever.", 55],
  ["crt", "Old monitor", "Scanlines. Clicks feel thicker.", 80],
  ["chroma", "Chromatic bleed", "The farm splits into RGB.", 120],
  ["smash", "Nonce press", "A hydraulic smash every few seconds.", 220],
  ["strobe", "Farm strobe", "LEDs pulse with combo.", 280],
  ["worm", "Mempool wormhole", "Warp vignette. +10% output.", 420],
  ["ocean", "Go to the ocean", "Quiet. A huge payout.", 8000],
];
const NEWS = [
  "Difficulty retarget rumored after a quiet hour.",
  "Someone in the garage just found four leading zeros.",
  "Mempool is spicy. Fees look like lava.",
  "Black-market coolant shipment sighted over the aisle.",
];
const SAVE_KEY = "hash-forge-gh-v4";
const COST = 1.15;
const TARGET = "000000";
const HEX = "0123456789ABCDEF";

const empty = () => ({ cpu: 0, gpu: 0, fpga: 0, asic: 0, farm: 0 });
function load() {
  const d = { balance: 0, hashes: 0, counts: empty(), unlocked: false, lucky: false, seen: [], stim: 0, stimOwned: [], bounceN: 0, clicks: 0, ocean: false, lifetime: 0, forks: 0 };
  try { return { ...d, ...JSON.parse(localStorage.getItem(SAVE_KEY) || "null"), counts: { ...empty(), ...(JSON.parse(localStorage.getItem(SAVE_KEY) || "{}").counts || {}) } }; }
  catch { return d; }
}
const S = { ...load(), buff: {}, t: 0, toast: "Boot sequence complete. Find the first hash.", combo: 0, comboUntil: 0, heat: 0, events: [], nextEv: 8, smash: 0, news: 0, lastWin: -10, ptr: { x: 400, y: 240 } };
function save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      balance: S.balance, hashes: S.hashes, counts: S.counts, unlocked: S.unlocked, lucky: S.lucky, seen: S.seen.slice(-400),
      stim: S.stim, stimOwned: S.stimOwned, bounceN: S.bounceN, clicks: S.clicks, ocean: S.ocean, lifetime: S.lifetime, forks: S.forks,
    }));
  } catch (_) {}
}
const has = (id) => S.stimOwned.includes(id);
function nextCost(base, n) { return Math.floor(base * COST ** n); }
function rate() {
  let r = MACHINES.reduce((s, m) => s + (S.counts[m[0]] || 0) * m[4], 0);
  if ((S.buff.overclock || 0) > S.t) r *= 3;
  if ((S.buff.coolant || 0) > S.t) r *= 1.5;
  if (has("worm")) r *= 1.1;
  if (S.ocean) r *= 0.45;
  if (S.heat > 88) r *= 0.6;
  return r * (1 + S.forks * 0.18);
}
function clickM() {
  let m = 1 + Math.min(S.comboUntil > S.t ? S.combo : 0, 25) * 0.06;
  if (has("crt")) m *= 1.08;
  if ((S.buff.frenzy || 0) > S.t) m *= 7;
  return m;
}
function credit(n) { S.balance += n; S.lifetime += n; }
function stimCost(id) {
  const spec = STIMS.find((s) => s[0] === id);
  return id === "bounce" ? Math.floor(spec[2] * 1.55 ** S.bounceN) : spec[2];
}

let audio;
function beep(f, d = 0.08, v = 0.04) {
  try {
    audio = audio || new AudioContext();
    if (audio.state === "suspended") audio.resume();
    const o = audio.createOscillator(), g = audio.createGain();
    o.frequency.value = f; g.gain.value = v; o.connect(g); g.connect(audio.destination);
    o.start(); g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + d); o.stop(audio.currentTime + d + 0.02);
  } catch (_) {}
}

const particles = [];
const balls = [];
function juice(kind, text) {
  const n = kind === "crit" || kind === "smash" ? 32 : 14;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, spd = 60 + Math.random() * 220;
    particles.push({ x: S.ptr.x, y: S.ptr.y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd - 40, life: 1, text: HEX[i % 16], c: kind === "crit" ? "#ff6a1a" : i % 2 ? "#c8f24a" : "#3ec8e8", sz: 12 });
  }
  if (text) particles.push({ x: S.ptr.x, y: S.ptr.y, vx: 0, vy: -80, life: 1, text, c: "#c8f24a", sz: 18 });
  if (has("quake") && !S.ocean) trauma = Math.min(1, trauma + (kind === "smash" ? 0.55 : 0.22));
}
let trauma = 0;

function strike(pay, kind, toast) {
  S.clicks += 1;
  S.combo = Math.min(25, (S.comboUntil > S.t ? S.combo : 0) + 1);
  S.comboUntil = S.t + 1.35;
  S.stim += 1 + Math.floor(S.combo / 4);
  S.heat = Math.min(100, S.heat + (S.ocean ? 2 : 8));
  S.hashes += 1;
  if (pay) credit(pay);
  S.toast = toast;
  juice(kind, pay ? `+${pay}` : "");
  beep(320 + S.combo * 30);
  render();
  save();
}

function forge() {
  const q = ($("#guess").value || "").replace(/[^0-9a-f]/gi, "").toUpperCase();
  if (!q) return;
  if (q === TARGET) {
    const p = Math.floor((S.unlocked ? 100 : 40) * (S.lucky ? 25 : 1) * clickM());
    S.unlocked = true; S.lucky = false; S.lastWin = S.t;
    strike(p, "block", `Block accepted. +${p} sats.`);
  } else {
    const unique = !S.seen.includes(q);
    if (unique) S.seen.push(q);
    const pay = unique ? Math.floor(3 * clickM()) : 0;
    strike(pay, "click", unique ? `${q} missed. Unique +${pay} sats.` : `${q} already scanned.`);
  }
  $("#guess").value = "";
  $("#guess").focus();
}

function randomGuess() {
  if (!S.unlocked) return;
  const nonce = Math.floor(Math.random() * 0x1000000).toString(16).toUpperCase().padStart(6, "0");
  const glitch = (S.buff.glitch || 0) > S.t;
  const won = Math.random() < (glitch ? 0.7 : 0.3);
  if (won) {
    const crit = Math.random() < 0.1;
    let p = Math.floor(35 * (S.lucky ? 25 : 1) * clickM() * (crit ? 5 : 1));
    S.lucky = false; S.lastWin = S.t;
    strike(p, crit ? "crit" : "click", crit ? `Critical ${nonce}. +${p}` : `Luck strike ${nonce}. +${p}`);
  } else {
    const unique = !S.seen.includes(nonce);
    if (unique) S.seen.push(nonce);
    const pay = unique ? Math.floor(3 * clickM()) : 0;
    strike(pay, "click", unique ? `${nonce} missed. Unique +${pay} sats.` : `${nonce} already scanned.`);
  }
}

function buy(id) {
  const m = MACHINES.find((x) => x[0] === id);
  const cost = nextCost(m[3], S.counts[id] || 0);
  if (S.balance < cost) { S.toast = "Need more sats."; beep(130); render(); return; }
  S.balance -= cost; S.counts[id] = (S.counts[id] || 0) + 1;
  S.toast = `${m[1]} is online.`; beep(580); save(); render();
}

function buyStim(id) {
  const spec = STIMS.find((s) => s[0] === id);
  const cost = stimCost(id);
  if (S.stim < cost) { S.toast = `Need ${cost - Math.floor(S.stim)} more stimulation.`; beep(130); render(); return; }
  if (!spec[4] && has(id)) return;
  S.stim -= cost;
  if (!has(id)) S.stimOwned.push(id);
  if (id === "bounce") S.bounceN += 1;
  if (id === "ocean") { S.ocean = true; credit(4000); S.heat = 0; S.toast = "The fans go quiet. You can hear the ocean."; }
  else S.toast = `${spec[1]} online.`;
  juice("buy", spec[1]); beep(760); save(); render();
}

function claim(id) {
  const ev = S.events.find((e) => e.id === id);
  if (!ev) return;
  S.events = S.events.filter((e) => e.id !== id);
  if (ev.kind === "airdrop") {
    const p = 40 + Math.floor(Math.random() * 90);
    credit(p); S.toast = `Airdrop +${p} sats.`; juice("drop", `+${p}`);
  } else if (ev.kind === "lucky") { S.lucky = true; S.toast = "Lucky nonce armed."; }
  else {
    const spec = EVENTS.find((e) => e[0] === ev.kind);
    S.buff[ev.kind] = S.t + spec[4];
    if (ev.kind === "coolant") S.heat = Math.max(0, S.heat - 40);
    S.toast = `${spec[1]} from a market drop.`;
  }
  beep(720); save(); render();
}

const $ = (s) => document.querySelector(s);
document.getElementById("root").innerHTML = `
<main id="forge">
  <header class="nav">
    <div class="heat-bar"><span id="heat"></span></div>
    <div class="brand"><span class="brand-mark">₿</span><div><small>HASH</small><b>FORGE</b></div></div>
    <div class="network" id="news">${NEWS[0]}</div>
    <div class="wallet"><small id="stimline">STIM 0</small><strong id="balance">0 <em>SATS</em></strong></div>
  </header>
  <section class="hero" id="hero">
    <div class="hero-copy">
      <p class="eyebrow">PROOF OF WORK / CHAPTER 01</p>
      <h1>Find the<br /><i>impossible.</i></h1>
      <p class="lede">Click to hash. Spend stimulation on chaos. Catch drops over the aisle.</p>
    </div>
  </section>
  <section class="dashboard">
    <div class="panel">
      <div class="panel-head"><span class="dot"></span> MANUAL HASH TERMINAL <label>COMBO <b id="combo">×0</b></label></div>
      <div class="terminal-body">
        <div class="target"><span>TARGET NONCE</span><strong id="target">00 00 00</strong><small>First block is 000000. Then mash space.</small></div>
        <div class="input-row">
          <div class="hash-prefix">#</div>
          <input id="guess" maxlength="6" placeholder="______" aria-label="Nonce guess" autocomplete="off" spellcheck="false" />
          <button class="forge" id="forgeBtn" type="button">FORGE</button>
        </div>
        <p class="terminal-log"><span>›</span> <span id="toast"></span></p>
        <div id="random-slot"></div>
      </div>
    </div>
    <div class="stats">
      <article><small>LIVE HASHRATE</small><strong id="rate">0.0 H/s</strong><span id="operation">No hardware</span></article>
      <article><small>HASHES FORGED</small><strong id="hashes">0</strong><span>Local lifetime</span></article>
      <article><small>LIFETIME</small><strong id="life">0</strong><span>Sats ever mined</span></article>
    </div>
  </section>
  <section class="section stim">
    <div class="section-head"><div><p class="eyebrow">00 / STIMULATION</p><h2>Make it <i>louder.</i></h2></div><p>Neal.fun energy. Clicks buy chaos.</p></div>
    <div class="stim-grid" id="stims"></div>
  </section>
  <section class="section">
    <div class="section-head"><div><p class="eyebrow">01 / HARDWARE BAY</p><h2>Scale the <i>operation.</i></h2></div></div>
    <div class="machines" id="machines"></div>
  </section>
  <footer><span>HASH FORGE MINING CO.</span><span>SIMULATION ONLY</span><span>CATCH THE DROPS</span></footer>
</main>`;

function visibleStims() {
  return STIMS.filter((s) => s[4] || !has(s[0])).slice(0, 5);
}

function render() {
  const r = rate();
  const combo = S.comboUntil > S.t ? S.combo : 0;
  $("#balance").innerHTML = `${Math.floor(S.balance).toLocaleString()} <em>SATS</em>`;
  $("#stimline").textContent = `STIM ${Math.floor(S.stim)} · ×${(1 + S.forks * 0.18).toFixed(2)} fork`;
  $("#rate").textContent = `${r.toFixed(1)} H/s`;
  $("#operation").textContent = r ? "Operation online" : "No hardware";
  $("#hashes").textContent = Math.floor(S.hashes).toLocaleString();
  $("#life").textContent = Math.floor(S.lifetime).toLocaleString();
  $("#toast").textContent = S.toast;
  $("#combo").textContent = "×" + combo;
  $("#heat").style.width = S.heat + "%";
  const root = $("#forge");
  root.classList.toggle("fx-crt", has("crt") && !S.ocean);
  root.classList.toggle("fx-chroma", has("chroma") && !S.ocean);
  root.classList.toggle("fx-strobe", has("strobe") && combo > 6 && !S.ocean);
  root.classList.toggle("fx-worm", has("worm") && !S.ocean);
  root.classList.toggle("fx-ocean", S.ocean);
  root.classList.toggle("fx-heat", S.heat > 88);
  $("#stims").innerHTML = S.ocean
    ? `<p class="terminal-log">Shore leave. The aisle is quiet.</p>`
    : visibleStims().map((s) => {
        const cost = stimCost(s[0]);
        return `<button type="button" class="stim-slot ${S.stim >= cost ? "ready" : ""}" data-stim="${s[0]}"><span><b>${s[1]}</b><small>${s[2]}</small></span><i>${cost} STIM</i></button>`;
      }).join("");
  $("#machines").innerHTML = MACHINES.map((x) => {
    const owned = S.counts[x[0]] || 0;
    const cost = nextCost(x[3], owned);
    const can = S.balance >= cost;
    return `<article class="machine"><div class="machine-art ${x[7]}"><img src="${x[6]}" alt="${x[1]}" /></div>
      <div class="machine-body"><div class="machine-top"><span>${x[5]}</span><span>×${owned}</span></div>
      <h3>${x[1]}</h3><p>${x[2]}</p><div class="rate">+${x[4]} <small>SATS / SEC</small></div>
      <button type="button" class="${can ? "ready" : ""}" data-buy="${x[0]}">${can ? "DEPLOY" : "NEED SATS"} <span>${cost.toLocaleString()}</span></button></div></article>`;
  }).join("");
  if (S.unlocked) {
    $("#random-slot").innerHTML = `<button class="random big-hash" id="hashClick" type="button"><span><b>Hash click</b><small>Spacebar · combos decay if you idle</small></span><kbd>STRIKE</kbd></button>`;
    $("#hashClick").onclick = (e) => { S.ptr = { x: e.clientX, y: e.clientY }; randomGuess(); };
  } else {
    $("#random-slot").innerHTML = `<p class="locked">Forge 000000 to unlock hash clicking and market drops.</p>`;
  }
  document.querySelectorAll(".event-orb").forEach((n) => n.remove());
  S.events.forEach((ev) => {
    const spec = EVENTS.find((e) => e[0] === ev.kind);
    const b = document.createElement("button");
    b.className = "event-orb";
    b.style.left = ev.x + "%";
    b.style.top = ev.y + "%";
    b.innerHTML = `<img src="${spec[3]}" alt="" /><span>${Math.ceil(ev.until - S.t)}s</span>`;
    b.onclick = (e) => { S.ptr = { x: e.clientX, y: e.clientY }; claim(ev.id); };
    $("#hero").appendChild(b);
  });
}

$("#forgeBtn").onclick = forge;
$("#guess").onkeydown = (e) => { if (e.key === "Enter") forge(); };
$("#guess").oninput = (e) => { e.target.value = e.target.value.replace(/[^0-9a-f]/gi, "").slice(0, 6); };
document.getElementById("machines").addEventListener("click", (e) => {
  const b = e.target.closest("[data-buy]"); if (b) buy(b.getAttribute("data-buy"));
});
document.getElementById("stims").addEventListener("click", (e) => {
  const b = e.target.closest("[data-stim]"); if (b) buyStim(b.getAttribute("data-stim"));
});
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && S.unlocked && document.activeElement.id !== "guess") { e.preventDefault(); S.ptr = { x: innerWidth / 2, y: innerHeight * 0.4 }; randomGuess(); }
});

const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d");
function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
resize(); addEventListener("resize", resize);

let last = performance.now(), acc = 0, newsAt = 0, evId = 1;
function loop(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  acc += dt;
  S.t += dt;
  S.heat = Math.max(0, S.heat - dt * 11);
  const r = rate();
  if (r) { S.balance += r * dt; S.lifetime += r * dt; S.hashes += r * dt; }
  S.events = S.events.filter((e) => e.until > S.t);
  if (S.unlocked && S.events.length < 2 && S.t >= S.nextEv) {
    const spec = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    S.events.push({ id: evId++, kind: spec[0], x: 12 + Math.random() * 70, y: 18 + Math.random() * 55, until: S.t + 9 });
    S.nextEv = S.t + 9 + Math.random() * 14;
    S.toast = "A drop appeared over the farm. Catch it.";
    beep(500);
  }
  if (has("smash") && !S.ocean) {
    S.smash += dt;
    if (S.smash >= 3.4) {
      S.smash = 0;
      const p = Math.floor(18 * (1 + S.forks * 0.18));
      credit(p); S.stim += 2; juice("smash", `SMASH +${p}`); beep(90, 0.16, 0.07);
    }
  }
  newsAt += dt;
  if (newsAt > 7) { newsAt = 0; S.news = (S.news + 1) % NEWS.length; $("#news").textContent = NEWS[S.news]; }
  if (acc > 0.2) { acc = 0; render(); }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (has("rain") && !S.ocean) {
    ctx.fillStyle = "rgb(200 242 74 / 0.28)";
    ctx.font = "11px IBM Plex Mono, monospace";
    for (let i = 0; i < 40; i++) ctx.fillText(HEX[i % 16], (now * 0.05 + i * 97) % canvas.width, (now * 0.2 + i * 53) % canvas.height);
  }
  while (balls.length < S.bounceN) balls.push({ x: 80 + Math.random() * (canvas.width - 160), y: 80 + Math.random() * (canvas.height - 160), vx: (Math.random() < 0.5 ? -1 : 1) * 160, vy: (Math.random() < 0.5 ? -1 : 1) * 120 });
  while (balls.length > S.bounceN) balls.pop();
  ctx.font = "28px Space Grotesk, sans-serif";
  ctx.fillStyle = S.ocean ? "rgb(62 200 232 / 0.75)" : "rgb(255 106 26 / 0.92)";
  for (const b of balls) {
    b.x += b.vx * dt; b.y += b.vy * dt;
    if (b.x < 24 || b.x > canvas.width - 24) { b.vx *= -1; credit(2); S.stim += 0.4; }
    if (b.y < 24 || b.y > canvas.height - 24) { b.vy *= -1; credit(2); S.stim += 0.4; }
    ctx.fillText("₿", b.x - 12, b.y + 10);
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= dt / 0.7; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 90 * dt;
    if (p.life <= 0) { particles.splice(i, 1); continue; }
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.c;
    ctx.font = `${p.sz}px IBM Plex Mono, monospace`;
    ctx.fillText(p.text, p.x, p.y);
  }
  ctx.globalAlpha = 1;
  trauma = Math.max(0, trauma - dt * 1.6);
  const sh = trauma * trauma;
  const root = $("#forge");
  if (root && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.style.transform = sh > 0.01 ? `translate(${(Math.random() * 2 - 1) * sh * 12}px, ${(Math.random() * 2 - 1) * sh * 12}px)` : "";
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
addEventListener("pagehide", save);
render();
