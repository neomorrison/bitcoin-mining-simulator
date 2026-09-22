const MACHINES = [
  ["cpu", "Garage CPU", "A loyal first thread humming in the spare room.", 35, 0.7, "SILICON", "./assets/rig-cpu.png", "dark"],
  ["gpu", "GPU Rig", "Three fans. Parallel heat. Parallel hashes.", 180, 4, "ACCELERATED", "./assets/rig-gpu.png", "light"],
  ["fpga", "FPGA Board", "Rewire the fabric. Hash whatever the bitstream says.", 520, 11, "RECONFIG", "./assets/rig-fpga.png", "light"],
  ["asic", "ASIC Pod", "Purpose-built. No games. Only SHA-256.", 950, 20, "INDUSTRIAL", "./assets/rig-asic.png", "light"],
  ["farm", "ASIC Farm", "A shipping container of relentless machines.", 6200, 120, "MEGA SCALE", "./assets/rig-farm.png", "light"],
];
const BUFFS = [
  ["overclock", "Overclock", "The entire operation runs 3× faster.", 15, "./assets/power-overclock.png"],
  ["coolant", "Liquid nitrogen", "A clean +50% output boost.", 20, "./assets/power-coolant.png"],
  ["lucky", "Lucky nonce", "The next forged block pays 25×.", 0, "./assets/power-lucky.png"],
  ["glitch", "Merkle glitch", "Random guesses land far more often.", 12, "./assets/power-glitch.png"],
];
const SAVE_KEY = "hash-forge-v1";
const COST_SCALE = 1.18;
const TARGET = "000000";

const emptyCounts = () => ({ cpu: 0, gpu: 0, fpga: 0, asic: 0, farm: 0 });
function loadSave() {
  const defaults = { version: 1, balance: 0, hashes: 0, counts: emptyCounts(), unlocked: false, luckyArmed: false };
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed, counts: { ...emptyCounts(), ...(parsed.counts || {}) }, version: 1 };
  } catch {
    return defaults;
  }
}

const saved = loadSave();
const state = {
  balance: saved.balance,
  hashes: saved.hashes,
  counts: saved.counts,
  unlocked: saved.unlocked,
  luckyArmed: saved.luckyArmed,
  buffUntil: {},
  simTime: 0,
  toast: "Boot sequence complete. Find the first hash.",
  lastWin: -10,
};

function nextCost(base, n) { return Math.floor(base * COST_SCALE ** n); }
function rate() { return MACHINES.reduce((s, m) => s + (state.counts[m[0]] || 0) * m[4], 0); }
function multi() {
  return ((state.buffUntil.overclock || 0) > state.simTime ? 3 : 1) *
    ((state.buffUntil.coolant || 0) > state.simTime ? 1.5 : 1);
}
function persist() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      version: 1, balance: state.balance, hashes: state.hashes,
      counts: state.counts, unlocked: state.unlocked, luckyArmed: state.luckyArmed,
    }));
  } catch (_) {}
}

let audioCtx = null;
function beep(freq = 440) {
  try {
    audioCtx = audioCtx || new AudioContext();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.frequency.value = freq;
    g.gain.value = 0.04;
    o.connect(g); g.connect(audioCtx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.11);
    o.stop(audioCtx.currentTime + 0.12);
  } catch (_) {}
}

const $ = (s) => document.querySelector(s);
document.getElementById("root").innerHTML = `
<main>
  <header class="nav">
    <div class="brand"><span class="brand-mark">₿</span><div><small>HASH</small><b>FORGE</b></div></div>
    <div class="network">BITCOIN TESTNET · SIMULATION</div>
    <div class="wallet"><small>WALLET</small><strong id="balance">0 <em>SATS</em></strong></div>
  </header>
  <section class="hero">
    <div class="hero-copy">
      <p class="eyebrow">PROOF OF WORK / CHAPTER 01</p>
      <h1>Find the<br /><i>impossible.</i></h1>
      <p class="lede">Guess the nonce, forge the first block, then fill the aisle with machines.</p>
    </div>
  </section>
  <section class="dashboard">
    <div class="panel">
      <div class="panel-head"><span class="dot"></span> MANUAL HASH TERMINAL <label>DIFFICULTY <b>6</b></label></div>
      <div class="terminal-body">
        <div class="target"><span>TARGET NONCE</span><strong id="target">00 00 00</strong><small>Enter the six-character solution.</small></div>
        <div class="input-row">
          <div class="hash-prefix">#</div>
          <input id="guess" maxlength="6" placeholder="______" aria-label="Nonce guess" autocomplete="off" spellcheck="false" />
          <button class="forge" id="forge" type="button">FORGE HASH</button>
        </div>
        <p class="terminal-log"><span>›</span> <span id="toast"></span></p>
        <div id="random-slot"></div>
      </div>
    </div>
    <div class="stats">
      <article><small>LIVE HASHRATE</small><strong id="rate">0.0 H/s</strong><span id="operation">No hardware</span></article>
      <article><small>HASHES FORGED</small><strong id="hashes">0</strong><span>Local lifetime</span></article>
      <article><small>MULTIPLIER</small><strong id="multiplier">×1.0</strong><span id="boost" class="up">Baseline</span></article>
    </div>
  </section>
  <section class="section">
    <div class="section-head">
      <div><p class="eyebrow">01 / HARDWARE BAY</p><h2>Scale the <i>operation.</i></h2></div>
      <p>Each machine mines sats while you chase the next block.</p>
    </div>
    <div class="machines" id="machines"></div>
  </section>
  <section class="section power-section">
    <div class="section-head">
      <div><p class="eyebrow">02 / BLACK MARKET CACHE</p><h2>Break the <i>rules.</i></h2><p class="lede">Rare one-shot powerups. Time them with intent.</p></div>
    </div>
    <div class="buffs" id="buffs"></div>
  </section>
  <footer>
    <span>HASH FORGE MINING CO.</span>
    <span>SIMULATION ONLY · NO REAL CRYPTOCURRENCY</span>
    <span>EST. 2024</span>
  </footer>
</main>`;

function render() {
  const r = rate(), m = multi();
  $("#balance").innerHTML = `${Math.floor(state.balance).toLocaleString()} <em>SATS</em>`;
  $("#rate").textContent = `${(r * m).toFixed(1)} H/s`;
  $("#operation").textContent = r ? "Operation online" : "No hardware";
  $("#operation").className = r ? "up" : "";
  $("#hashes").textContent = Math.floor(state.hashes).toLocaleString();
  $("#multiplier").textContent = "×" + m.toFixed(1);
  $("#boost").textContent = m > 1 ? "Boosted" : "Baseline";
  $("#toast").textContent = state.toast;
  $("#target").className = state.simTime - state.lastWin < 0.8 ? "win-pulse" : "";
  $("#machines").innerHTML = MACHINES.map((x) => {
    const owned = state.counts[x[0]] || 0;
    const cost = nextCost(x[3], owned);
    const can = state.balance >= cost;
    return `<article class="machine">
      <div class="machine-art ${x[7]}"><img src="${x[6]}" alt="${x[1]}" /></div>
      <div class="machine-body">
        <div class="machine-top"><span>${x[5]}</span><span>×${owned}</span></div>
        <h3>${x[1]}</h3><p>${x[2]}</p>
        <div class="rate">+${x[4]} <small>SATS / SEC</small></div>
        <button type="button" class="${can ? "ready" : ""}" data-buy="${x[0]}">${can ? "DEPLOY" : "NEED SATS"} <span>${cost.toLocaleString()} SATS</span></button>
      </div>
    </article>`;
  }).join("");
  $("#buffs").innerHTML = BUFFS.map((b) => {
    const remain = Math.max(0, Math.ceil((state.buffUntil[b[0]] || 0) - state.simTime));
    const active = b[0] === "lucky" ? state.luckyArmed : remain > 0;
    return `<button type="button" class="buff ${active ? "active" : ""}" data-power="${b[0]}">
      <img src="${b[4]}" alt="" />
      <span><b>${active && remain ? remain + "s active" : b[1]}</b><small>${b[2]}</small></span>
      <i>${active ? "LIVE" : "USE"}</i>
    </button>`;
  }).join("");
  if (state.unlocked) {
    $("#random-slot").innerHTML = `<button class="random" id="random" type="button"><span><b>Random guess</b><small>Let entropy decide</small></span><kbd>UNLOCKED</kbd></button>`;
    $("#random").onclick = randomGuess;
  } else {
    $("#random-slot").innerHTML = `<p class="locked">Guess the correct nonce to unlock random guess.</p>`;
  }
}

function buy(id) {
  const m = MACHINES.find((x) => x[0] === id);
  const cost = nextCost(m[3], state.counts[id] || 0);
  if (state.balance < cost) {
    state.toast = `Need ${Math.ceil(cost - state.balance)} more sats for ${m[1]}.`;
    beep(130);
  } else {
    state.balance -= cost;
    state.counts[id] = (state.counts[id] || 0) + 1;
    state.toast = `${m[1]} is online. Hashrate increased.`;
    beep(580);
    persist();
  }
  render();
}

function forge() {
  const q = $("#guess").value.replace(/[^0-9a-f]/gi, "").toUpperCase();
  if (!q) return;
  state.hashes += 1;
  if (q === TARGET) {
    const payout = (state.unlocked ? 100 : 40) * (state.luckyArmed ? 25 : 1);
    state.balance += payout;
    state.unlocked = true;
    state.luckyArmed = false;
    state.toast = `Block accepted. +${payout} sats.`;
    state.lastWin = state.simTime;
    beep(820);
  } else {
    state.toast = `Rejected: ${q.padEnd(6, "·")} is not the nonce.`;
    beep(160);
  }
  $("#guess").value = "";
  persist();
  render();
  $("#guess").focus();
}

function randomGuess() {
  if (!state.unlocked) return;
  const glitch = (state.buffUntil.glitch || 0) > state.simTime;
  const won = Math.random() < (glitch ? 0.55 : 0.12);
  state.hashes += 1;
  if (won) {
    const award = (state.luckyArmed ? 25 : 1) * 35;
    state.balance += award;
    state.luckyArmed = false;
    state.toast = `Luck strike. +${award} sats.`;
    state.lastWin = state.simTime;
    beep(960);
  } else {
    state.toast = `Random nonce ${Math.random().toString(16).slice(2, 8).toUpperCase()} rejected. Keep forging.`;
    beep(220);
  }
  persist();
  render();
}

function power(id) {
  const b = BUFFS.find((x) => x[0] === id);
  if (id === "lucky") {
    if (state.luckyArmed) return;
    state.luckyArmed = true;
    state.toast = "Lucky nonce armed — next block pays 25×.";
    beep(720);
    persist();
    render();
    return;
  }
  if ((state.buffUntil[id] || 0) > state.simTime) return;
  state.buffUntil[id] = state.simTime + b[3];
  state.toast = `${b[1]} engaged — ${b[2]}`;
  beep(720);
  render();
}

document.getElementById("machines").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-buy]");
  if (btn) buy(btn.getAttribute("data-buy"));
});
document.getElementById("buffs").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-power]");
  if (btn) power(btn.getAttribute("data-power"));
});
$("#forge").onclick = forge;
$("#guess").onkeydown = (e) => { if (e.key === "Enter") forge(); };
$("#guess").oninput = (e) => { e.target.value = e.target.value.replace(/[^0-9a-f]/gi, "").slice(0, 6); };

let last = performance.now(), acc = 0, sinceSave = 0;
const STEP = 1 / 20;
function loop(t) {
  const dt = Math.min(0.1, (t - last) / 1000);
  last = t;
  acc += dt;
  sinceSave += dt;
  let dirty = false;
  while (acc >= STEP) {
    state.simTime += STEP;
    const r = rate() * multi();
    if (r) {
      state.balance += r * STEP;
      state.hashes += r * STEP;
      dirty = true;
    }
    acc -= STEP;
  }
  if (dirty) render();
  if (sinceSave > 4) { persist(); sinceSave = 0; }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") persist(); });
window.addEventListener("pagehide", persist);
render();
