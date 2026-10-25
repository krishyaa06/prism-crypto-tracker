/**
 * ===================================================================
 *  PRISM PROTOCOL // TRACKER LOGIC & AMBIENT CANVAS
 *  Copyright (c) 2026 Prism Protocol. All rights reserved.
 *  Licensed under the MIT License.
 * ===================================================================
 */

/* ---------- 1. Ambient background (particles + connecting lines) ---------- */

const canvas = document.getElementById('ambient-canvas');
const ctx = canvas.getContext('2d');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let dots = [];

function syncDimensions() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', syncDimensions);
syncDimensions();

class AmbientDot {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = Math.random() * 1.6 + 0.5;
        this.dx = (Math.random() - 0.5) * 0.35;
        this.dy = (Math.random() - 0.5) * 0.35;
        this.alpha = Math.random() * 0.45 + 0.15;
    }
    advance() {
        this.x += this.dx;
        this.y += this.dy;
        if (this.x < 0 || this.x > window.innerWidth || this.y < 0 || this.y > window.innerHeight) this.reset();
    }
    paint() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 210, 255, ${this.alpha})`;
        ctx.fill();
    }
}

const DOT_COUNT = window.innerWidth < 600 ? 35 : 60;
for (let i = 0; i < DOT_COUNT; i++) dots.push(new AmbientDot());

function drawLinks() {
    for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
            const a = dots[i], b = dots[j];
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            if (dist < 120) {
                ctx.strokeStyle = `rgba(0, 210, 255, ${0.12 * (1 - dist / 120)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }
    }
}

function runLoop() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    dots.forEach(d => { if (!reduceMotion) d.advance(); d.paint(); });
    drawLinks();
    if (!reduceMotion) requestAnimationFrame(runLoop);
}
runLoop();

/* ---------- 2. Market data & portfolio engine ---------- */

const API_BASE = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&sparkline=false';
const FEED_API = `${API_BASE}&order=market_cap_desc&per_page=25&page=1`;
const HOLDING_IDS = ['bitcoin', 'ethereum', 'solana'];
const AUTO_REFRESH_MS = 60_000;
const STORAGE = { bitcoin: 'prism_b_hold', ethereum: 'prism_e_hold', solana: 'prism_s_hold' };

let storedTokens = [];
let isFetching = false;

const tokenFeed = document.getElementById('token-feed');
const tokenFilter = document.getElementById('token-filter');
const btnSync = document.getElementById('btn-sync');
const valuationTotal = document.getElementById('valuation-total');
const btnUpdateHoldings = document.getElementById('btn-update-holdings');
const lastSync = document.getElementById('last-sync');

const inputs = {
    bitcoin: document.getElementById('btc-qty'),
    ethereum: document.getElementById('eth-qty'),
    solana: document.getElementById('sol-qty')
};

// Adaptive price formatting: $64,210.12 · $1.0003 · $0.00001234
function formatPrice(value) {
    if (typeof value !== 'number' || !Number.isFinite(value)) return '—';
    const digits = value >= 1 ? 2 : value >= 0.01 ? 4 : 8;
    return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: digits });
}

function setStatus(html, isError = false) {
    tokenFeed.innerHTML = `<div class="feed-spinner-box${isError ? ' is-error' : ''}">${html}</div>`;
}

async function pullFeed({ silent = false } = {}) {
    if (isFetching) return;
    isFetching = true;
    btnSync.classList.add('is-loading');
    btnSync.disabled = true;
    if (!silent || !storedTokens.length) {
        setStatus('<div class="matrix-loader"></div><p>FETCHING SECURE ORBITAL FEED...</p>');
    }

    try {
        const res = await fetch(FEED_API);
        if (res.status === 429) throw new Error('RATE LIMITED');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        let data = await res.json();

        // Make sure the coins used for valuation are always present
        const missing = HOLDING_IDS.filter(id => !data.some(c => c.id === id));
        if (missing.length) {
            const extra = await fetch(`${API_BASE}&ids=${missing.join(',')}`);
            if (extra.ok) data = data.concat(await extra.json());
        }

        storedTokens = data;
        applyFilter();
        refreshValuation();
        lastSync.textContent = `SYNCED ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
    } catch (err) {
        if (!storedTokens.length) {
            const msg = err.message === 'RATE LIMITED' ? 'API RATE LIMIT HIT. WAIT A MINUTE, THEN SYNC.' : 'API FEED BUSY. CLICK SYNC TO RETRY.';
            setStatus(msg, true);
        }
        lastSync.textContent = 'SYNC FAILED';
    } finally {
        isFetching = false;
        btnSync.classList.remove('is-loading');
        btnSync.disabled = false;
    }
}

function renderTokens(list) {
    tokenFeed.innerHTML = '';
    if (!list.length) {
        setStatus('NO TOKENS MATCH YOUR FILTER.');
        return;
    }

    list.forEach((coin, i) => {
        const change = coin.price_change_percentage_24h;
        const hasChange = typeof change === 'number' && Number.isFinite(change);
        const isUp = hasChange && change >= 0;

        const row = document.createElement('div');
        row.className = 'token-row';
        row.style.animationDelay = `${Math.min(i, 15) * 35}ms`;

        const meta = document.createElement('div');
        meta.className = 'token-meta';

        const rank = document.createElement('span');
        rank.className = 'token-rank';
        rank.textContent = coin.market_cap_rank ?? '–';

        const icon = document.createElement('img');
        icon.className = 'token-icon';
        icon.alt = '';
        icon.loading = 'lazy';
        icon.src = coin.image || '';
        icon.onerror = () => icon.remove();

        const names = document.createElement('div');
        const symbol = document.createElement('div');
        symbol.className = 'token-symbol';
        symbol.textContent = String(coin.symbol || '').toUpperCase();
        const label = document.createElement('div');
        label.className = 'token-label';
        label.textContent = coin.name || '';
        names.append(symbol, label);
        meta.append(rank, icon, names);

        const stats = document.createElement('div');
        stats.className = 'token-stats';
        const price = document.createElement('div');
        price.className = 'price-text';
        price.textContent = formatPrice(coin.current_price);
        const delta = document.createElement('div');
        delta.className = `delta-text ${hasChange ? (isUp ? 'positive' : 'negative') : ''}`;
        delta.textContent = hasChange ? `${isUp ? '▲ +' : '▼ '}${change.toFixed(2)}%` : '—';
        stats.append(price, delta);

        row.append(meta, stats);
        tokenFeed.appendChild(row);
    });
}

function applyFilter() {
    const val = tokenFilter.value.trim().toLowerCase();
    const matches = storedTokens.filter(t =>
        String(t.name).toLowerCase().includes(val) ||
        String(t.symbol).toLowerCase().includes(val)
    );
    renderTokens(matches);
}

tokenFilter.addEventListener('input', applyFilter);

function readHolding(id) {
    const v = parseFloat(localStorage.getItem(STORAGE[id]));
    return Number.isFinite(v) && v > 0 ? v : 0;
}

let shownTotal = 0;
function animateTotal(target) {
    const start = shownTotal;
    const t0 = performance.now();
    const duration = reduceMotion ? 0 : 700;
    function step(now) {
        const p = duration ? Math.min((now - t0) / duration, 1) : 1;
        const eased = 1 - Math.pow(1 - p, 3);
        const value = start + (target - start) * eased;
        valuationTotal.textContent = '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (p < 1) requestAnimationFrame(step);
        else shownTotal = target;
    }
    requestAnimationFrame(step);
}

function refreshValuation() {
    let total = 0;
    HOLDING_IDS.forEach(id => {
        const qty = readHolding(id);
        inputs[id].value = qty || '';
        const coin = storedTokens.find(c => c.id === id);
        if (coin && Number.isFinite(coin.current_price)) total += qty * coin.current_price;
    });
    animateTotal(total);
}

function commitHoldings() {
    HOLDING_IDS.forEach(id => {
        const v = parseFloat(inputs[id].value);
        localStorage.setItem(STORAGE[id], Number.isFinite(v) && v > 0 ? v : 0);
    });
    refreshValuation();
    btnUpdateHoldings.textContent = 'SAVED ✓';
    setTimeout(() => (btnUpdateHoldings.textContent = 'COMMIT'), 1200);
}

btnUpdateHoldings.addEventListener('click', commitHoldings);
Object.values(inputs).forEach(input =>
    input.addEventListener('keydown', e => { if (e.key === 'Enter') commitHoldings(); })
);

btnSync.addEventListener('click', () => pullFeed());

// Auto-refresh every minute while the tab is visible
setInterval(() => { if (!document.hidden) pullFeed({ silent: true }); }, AUTO_REFRESH_MS);

refreshValuation();
pullFeed();
