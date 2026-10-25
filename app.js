/**
 * ===================================================================
 *  PRISM PROTOCOL // TRACKER LOGIC & AMBIENT CANVAS
 *  Copyright (c) 2026 Prism Protocol. All rights reserved.
 *  Licensed under the MIT License.
 * ===================================================================
 */

// 1. Ambient Background Particles
const canvas = document.getElementById('ambient-canvas');
const ctx = canvas.getContext('2d');
let dots = [];

function syncDimensions() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', syncDimensions);
syncDimensions();

class AmbientDot {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.dx = (Math.random() - 0.5) * 0.35;
        this.dy = (Math.random() - 0.5) * 0.35;
        this.alpha = Math.random() * 0.45 + 0.15;
    }
    advance() {
        this.x += this.dx;
        this.y += this.dy;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    paint() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 210, 255, ${this.alpha})`;
        ctx.fill();
    }
}

for (let i = 0; i < 40; i++) dots.push(new AmbientDot());

function runLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(d => { d.advance(); d.paint(); });
    requestAnimationFrame(runLoop);
}
runLoop();

// 2. Market Data & Portfolio Engine
let storedTokens = [];
const FEED_API = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=false';

const tokenFeed = document.getElementById('token-feed');
const tokenFilter = document.getElementById('token-filter');
const btnSync = document.getElementById('btn-sync');
const valuationTotal = document.getElementById('valuation-total');
const btnUpdateHoldings = document.getElementById('btn-update-holdings');

const btcInput = document.getElementById('btc-qty');
const ethInput = document.getElementById('eth-qty');
const solInput = document.getElementById('sol-qty');

async function pullFeed() {
    tokenFeed.innerHTML = `
        <div class="feed-spinner-box">
            <div class="matrix-loader"></div>
            <p>FETCHING SECURE ORBITAL FEED...</p>
        </div>
    `;
    try {
        const res = await fetch(FEED_API);
        if (!res.ok) throw new Error("Network Response Code Not OK");
        storedTokens = await res.json();
        renderTokens(storedTokens);
        refreshValuation();
    } catch (err) {
        tokenFeed.innerHTML = `<div class="feed-spinner-box" style="color:var(--neon-red);">API FEED BUSY. CLICK SYNC TO RETRY.</div>`;
    }
}

function renderTokens(list) {
    tokenFeed.innerHTML = '';
    list.forEach(coin => {
        const isUp = coin.price_change_percentage_24h >= 0;
        const row = document.createElement('div');
        row.className = 'token-row';
        row.innerHTML = `
            <div class="token-meta">
                <div>
                    <div class="token-symbol">${coin.symbol.toUpperCase()}</div>
                    <div class="token-label">${coin.name}</div>
                </div>
            </div>
            <div class="token-stats">
                <div class="price-text">$${coin.current_price.toLocaleString()}</div>
                <div class="delta-text ${isUp ? 'positive' : 'negative'}">
                    ${isUp ? '▲ +' : '▼ '}${coin.price_change_percentage_24h ? coin.price_change_percentage_24h.toFixed(2) : 0}%
                </div>
            </div>
        `;
        tokenFeed.appendChild(row);
    });
}

tokenFilter.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    const matches = storedTokens.filter(t => 
        t.name.toLowerCase().includes(val) || 
        t.symbol.toLowerCase().includes(val)
    );
    renderTokens(matches);
});

function refreshValuation() {
    const btc = parseFloat(localStorage.getItem('prism_b_hold')) || 0;
    const eth = parseFloat(localStorage.getItem('prism_e_hold')) || 0;
    const sol = parseFloat(localStorage.getItem('prism_s_hold')) || 0;

    btcInput.value = btc || '';
    ethInput.value = eth || '';
    solInput.value = sol || '';

    const btcCoin = storedTokens.find(c => c.id === 'bitcoin');
    const ethCoin = storedTokens.find(c => c.id === 'ethereum');
    const solCoin = storedTokens.find(c => c.id === 'solana');

    const total = (btcCoin ? btc * btcCoin.current_price : 0) +
                  (ethCoin ? eth * ethCoin.current_price : 0) +
                  (solCoin ? sol * solCoin.current_price : 0);

    valuationTotal.innerText = `$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

btnUpdateHoldings.addEventListener('click', () => {
    localStorage.setItem('prism_b_hold', btcInput.value || 0);
    localStorage.setItem('prism_e_hold', ethInput.value || 0);
    localStorage.setItem('prism_s_hold', solInput.value || 0);
    refreshValuation();
});

btnSync.addEventListener('click', pullFeed);

pullFeed();
                                   
