<!-- ═════════════ HEADER ═════════════ -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:060810,50:0055ff,100:00ffaa&height=200&section=header&text=Quantum%20Tracker&fontSize=48&fontColor=ffffff&animation=fadeIn&fontAlignY=36&desc=Prism%20Protocol%20%E2%80%A2%20Live%20Crypto%20HUD%20Terminal&descAlignY=58&descSize=16" width="100%" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=20&duration=2600&pause=800&color=00FFAA&center=true&vCenter=true&width=620&lines=Live+prices+for+the+top+25+coins;Your+BTC+%E2%80%A2+ETH+%E2%80%A2+SOL+portfolio+value;Auto-refresh+every+60+seconds;100%25+private.+Stored+in+your+browser." alt="Typing SVG" />
</p>

<p align="center">
  <a href="https://krishyaa06.github.io/prism-crypto-tracker/"><img src="https://img.shields.io/badge/LIVE%20DEMO-00ffaa?style=for-the-badge&logo=githubpages&logoColor=black" /></a>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/CoinGecko%20API-8DC63F?style=for-the-badge&logo=coingecko&logoColor=white" />
  <a href="LICENSE"><img src="https://img.shields.io/github/license/krishyaa06/prism-crypto-tracker?style=for-the-badge&color=6C63FF" /></a>
</p>

<p align="center">
  <a href="https://krishyaa06.github.io/prism-crypto-tracker/"><img src="assets/screenshots/hero.png" width="90%" alt="Quantum Tracker dashboard" /></a>
</p>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%" />

## ⚡ Overview

**Quantum Tracker** is a cyberpunk-styled cryptocurrency dashboard by **Prism Protocol**.
It streams live market data for the top 25 coins, lets you filter the ledger instantly and calculates the value of your **BTC**, **ETH** and **SOL** holdings. Everything runs in the browser: no sign-up, no backend, no tracking.

## 🎬 Demo

<p align="center">
  <img src="assets/screenshots/demo.gif" width="420" alt="Quantum Tracker demo" />
</p>

## ✨ Features

| | Feature | Details |
|---|---|---|
| 📡 | **Live market feed** | Top 25 coins by market cap from the CoinGecko public API, with logo, rank, price and 24h change |
| 🔄 | **Auto-refresh** | Silent refresh every 60 seconds (paused when the tab is hidden), plus a manual **SYNC** button with a spinning indicator |
| 💼 | **Portfolio valuation** | Enter BTC / ETH / SOL quantities and press **COMMIT** (or `Enter`); the total counts up with an animation |
| 🔒 | **Private by design** | Holdings are saved only in your browser's `localStorage` |
| 🔍 | **Instant filter** | Search by name or symbol; the filter stays active after every refresh |
| 💲 | **Smart price format** | `$80,530.00` · `$0.9991` · `$0.00001234`, so small-cap coins never show as `$0` |
| 🌌 | **Animated UI** | Particle network background, scanning laser, rotating neon border, staggered row entrance |
| 📱 | **Responsive and accessible** | Mobile-first layout, ARIA labels and `prefers-reduced-motion` support |

## 🖼️ Screenshots

<table>
  <tr>
    <td align="center" width="55%"><img src="assets/screenshots/filter.png" width="100%" /><br><sub><b>Instant token filter</b></sub></td>
    <td align="center" width="45%"><img src="assets/screenshots/mobile.png" width="75%" /><br><sub><b>Mobile view</b></sub></td>
  </tr>
</table>

## 🚀 Getting Started

```bash
# 1. Clone
git clone https://github.com/krishyaa06/prism-crypto-tracker.git
cd prism-crypto-tracker

# 2. Serve locally (needed for the API fetch to work reliably)
python -m http.server 8081
# → http://localhost:8081
```

> **Note:** The free CoinGecko API has rate limits. If you see *"API RATE LIMIT HIT"*, wait about a minute and press **SYNC**.

## ⚙️ How It Works

```mermaid
flowchart LR
    A[CoinGecko API] -->|fetch every 60s| B(app.js)
    B --> C[Token ledger UI]
    B --> D[Valuation engine]
    E[(localStorage<br/>BTC / ETH / SOL)] <--> D
    F[Filter input] --> C
```

## 📁 Project Structure

```text
prism-crypto-tracker/
├── index.html              # Layout: header, valuation card, filter, ledger
├── style.css               # Cyberpunk theme and animations
├── app.js                  # Canvas background, API feed, portfolio logic
├── assets/
│   └── screenshots/        # README images and demo GIF
├── LICENSE
└── README.md
```

## 🗺️ Roadmap

- [x] Live top-25 market feed
- [x] Local BTC / ETH / SOL portfolio
- [x] Auto-refresh and smart formatting
- [ ] Add any coin to your portfolio
- [ ] 7-day sparkline charts
- [ ] INR / EUR currency switch
- [ ] Price alerts

## 🤝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/amazing-idea`
3. Commit: `git commit -m "Add amazing idea"`
4. Push and open a Pull Request

## 👤 Author

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/krishyaa06"><img src="https://github.com/krishyaa06.png" width="90" /><br><b>Soumya Bhandare</b></a><br>
      <sub>Founder @ Prism Protocol</sub>
    </td>
    <td>
      <a href="https://dc.gg/prismprotocol"><img src="https://img.shields.io/badge/Discord-Prism%20Protocol-5865F2?style=for-the-badge&logo=discord&logoColor=white" /></a><br>
      <a href="https://instagram.com/prism_protocol_"><img src="https://img.shields.io/badge/Instagram-@prism__protocol__-E4405F?style=for-the-badge&logo=instagram&logoColor=white" /></a><br>
      <a href="https://x.com/krishyaa06"><img src="https://img.shields.io/badge/X-@krishyaa06-000000?style=for-the-badge&logo=x&logoColor=white" /></a>
    </td>
  </tr>
</table>

## 📄 License

Released under the [MIT License](LICENSE). Market data provided by [CoinGecko](https://www.coingecko.com).

> ⚠️ This tool is for informational purposes only and is not financial advice.

<p align="center">
  <b>If you like this project, consider giving it a ⭐</b><br>
  <sub>"Build. Create. Compete." · Made with ⚡ by Prism Protocol</sub>
</p>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00ffaa,50:0055ff,100:060810&height=110&section=footer" width="100%" />
