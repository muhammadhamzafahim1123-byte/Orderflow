const page = document.body.dataset.page || "";
const sidebarToggles = document.querySelectorAll("[data-sidebar-toggle]");
let cursorGlow = document.querySelector(".cursor-glow");
const liveDateNodes = document.querySelectorAll("[data-live-date]");
const liveTimeNodes = document.querySelectorAll("[data-live-time]");

const trackedCoins = [
    "bitcoin",
    "ethereum",
    "solana",
    "binancecoin",
    "ripple",
    "cardano",
    "dogecoin",
    "avalanche-2",
    "chainlink",
    "toncoin",
    "sui",
    "usd-coin"
];

const tradingViewSymbolMap = {
    bitcoin: "BINANCE:BTCUSDT",
    ethereum: "BINANCE:ETHUSDT",
    solana: "BINANCE:SOLUSDT",
    binancecoin: "BINANCE:BNBUSDT",
    tether: "CRYPTO:USDTUSD",
    ripple: "BINANCE:XRPUSDT",
    cardano: "BINANCE:ADAUSDT",
    dogecoin: "BINANCE:DOGEUSDT",
    tron: "BINANCE:TRXUSDT",
    "staked-ether": "BINANCE:ETHUSDT",
    "wrapped-bitcoin": "BINANCE:BTCUSDT",
    "avalanche-2": "BINANCE:AVAXUSDT",
    "bitcoin-cash": "BINANCE:BCHUSDT",
    polkadot: "BINANCE:DOTUSDT",
    chainlink: "BINANCE:LINKUSDT",
    stellar: "BINANCE:XLMUSDT",
    "the-open-network": "BINANCE:TONUSDT",
    toncoin: "BINANCE:TONUSDT",
    sui: "BINANCE:SUIUSDT",
    litecoin: "BINANCE:LTCUSDT",
    "shiba-inu": "BINANCE:SHIBUSDT",
    "hedera-hashgraph": "BINANCE:HBARUSDT",
    "wrapped-eeth": "BINANCE:ETHUSDT",
    "usd-coin": "CRYPTO:USDCUSD",
    "usds": "CRYPTO:USDSUSD",
    "weth": "BINANCE:ETHUSDT",
    "bitcoin-cash-sv": "BINANCE:BSVUSDT",
    "hyperliquid": "KUCOIN:HYPEUSDT",
    "leo-token": "BITFINEX:LEOUSD",
    "monero": "BINANCE:XMRUSDT",
    "near": "BINANCE:NEARUSDT",
    "aptos": "BINANCE:APTUSDT",
    "uniswap": "BINANCE:UNIUSDT",
    "dai": "CRYPTO:DAIUSD",
    "pepe": "BINANCE:PEPEUSDT",
    "internet-computer": "BINANCE:ICPUSDT",
    "ethereum-classic": "BINANCE:ETCUSDT",
    "aave": "BINANCE:AAVEUSDT",
    "mantle": "BYBIT:MNTUSDT",
    "polygon-ecosystem-token": "BINANCE:POLUSDT",
    "okb": "OKX:OKBUSDT",
    "official-trump": "BINANCE:TRUMPUSDT",
    "cronos": "CRYPTOCOM:CROUSD",
    "render-token": "BINANCE:RENDERUSDT",
    "vechain": "BINANCE:VETUSDT",
    "bittensor": "BINANCE:TAOUSDT",
    "kaspa": "KUCOIN:KASUSDT",
    "filecoin": "BINANCE:FILUSDT",
    "arbitrum": "BINANCE:ARBUSDT",
    "algorand": "BINANCE:ALGOUSDT",
    "cosmos": "BINANCE:ATOMUSDT",
    "fetch-ai": "BINANCE:FETUSDT",
    "first-digital-usd": "CRYPTO:FDUSDUSD",
    "ethena-usde": "CRYPTO:USDEUSD"
};

sidebarToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
        if (window.innerWidth <= 900) {
            document.body.classList.toggle("sidebar-open");
            return;
        }

        document.body.classList.toggle("sidebar-collapsed");
        const expanded = !document.body.classList.contains("sidebar-collapsed");
        sidebarToggles.forEach((button) => button.setAttribute("aria-expanded", String(expanded)));
    });
});

if (document.body.classList.contains("figma-dashboard") && !cursorGlow && window.matchMedia("(pointer: fine)").matches) {
    cursorGlow = document.createElement("div");
    cursorGlow.className = "cursor-glow";
    cursorGlow.setAttribute("aria-hidden", "true");
    document.documentElement.appendChild(cursorGlow);
} else if (cursorGlow && cursorGlow.parentElement !== document.documentElement) {
    document.documentElement.appendChild(cursorGlow);
}

let lastPointerX = -9999;
let lastPointerY = -9999;
let pointerFrame = 0;

function setPointerPosition(x, y) {
    lastPointerX = x;
    lastPointerY = y;
    document.documentElement.style.setProperty("--x", x.toFixed(2));
    document.documentElement.style.setProperty("--y", y.toFixed(2));
    document.documentElement.style.setProperty("--xp", (x / window.innerWidth).toFixed(3));
    document.documentElement.style.setProperty("--yp", (y / window.innerHeight).toFixed(3));

    if (pointerFrame) return;
    pointerFrame = window.requestAnimationFrame(() => {
        if (cursorGlow) {
            cursorGlow.style.left = `${lastPointerX}px`;
            cursorGlow.style.top = `${lastPointerY}px`;
        }
        window.dispatchEvent(new CustomEvent("orderflow:pointer-sync", {
            detail: { x: lastPointerX, y: lastPointerY }
        }));
        pointerFrame = 0;
    });
}

document.addEventListener("pointermove", (event) => {
    setPointerPosition(event.clientX, event.clientY);
}, { passive: true, capture: true });

document.addEventListener("pointerleave", () => {
    setPointerPosition(-9999, -9999);
}, { passive: true });

function updateClock() {
    const now = new Date();
    const dateText = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const timeText = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    liveDateNodes.forEach((node) => {
        node.textContent = dateText;
    });
    liveTimeNodes.forEach((node) => {
        node.textContent = timeText;
    });
}

updateClock();
setInterval(updateClock, 1000);

function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: value >= 1000 ? 0 : value >= 1 ? 2 : 4
    }).format(value);
}

function formatCompactCurrency(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumFractionDigits: 2
    }).format(value);
}

function formatPercent(value) {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function changeClass(value) {
    return value >= 0 ? "positive-pill" : "negative-pill";
}

async function fetchMarketData() {
    const endpoint = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${trackedCoins.join(",")}&order=market_cap_desc&per_page=${trackedCoins.length}&page=1&sparkline=true&price_change_percentage=24h`;
    const response = await fetch(endpoint, { headers: { accept: "application/json" } });

    if (!response.ok) {
        throw new Error(`CoinGecko request failed with ${response.status}`);
    }

    return response.json();
}

async function fetchTradingMarketData() {
    const endpoint = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h";
    const response = await fetch(endpoint, { headers: { accept: "application/json" } });

    if (!response.ok) {
        throw new Error(`CoinGecko request failed with ${response.status}`);
    }

    return response.json();
}

function getTradingViewSymbol(coinId) {
    if (coinId && typeof coinId === "object") {
        const symbol = coinId.symbol ? coinId.symbol.toUpperCase() : "";
        return tradingViewSymbolMap[coinId.id] || (symbol ? `BINANCE:${symbol}USDT` : "BINANCE:BTCUSDT");
    }

    return tradingViewSymbolMap[coinId] || "BINANCE:BTCUSDT";
}

function renderTradingViewWidget(containerId, coinId, overrides = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const symbol = getTradingViewSymbol(coinId);
    const symbolLabel = symbol.split(":")[1] || symbol;
    if (container.dataset.tvSymbol === symbol && container.querySelector(".tradingview-widget-container__widget")) {
        return;
    }

    container.dataset.tvSymbol = symbol;
    container.innerHTML = `
        <div class="chart-loading" aria-hidden="true">
            <span></span>
            <strong>Loading chart</strong>
        </div>
        <div class="tradingview-widget-container__widget"></div>
        <div class="tradingview-widget-copyright">
            <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">${symbolLabel} chart by TradingView</a>
        </div>
    `;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.innerHTML = JSON.stringify({
        autosize: true,
        width: "100%",
        height: "100%",
        symbol,
        interval: "240",
        timezone: "Asia/Almaty",
        theme: "dark",
        style: "1",
        locale: "en",
        allow_symbol_change: false,
        calendar: false,
        hide_top_toolbar: true,
        hide_legend: true,
        hide_side_toolbar: false,
        save_image: false,
        withdateranges: false,
        support_host: "https://www.tradingview.com",
        ...overrides
    });

    const mountScript = () => {
        if (container.dataset.tvSymbol !== symbol || container.querySelector('script[src*="tradingview"]')) return;
        const removeLoading = () => {
            container.querySelector(".chart-loading")?.remove();
        };
        script.addEventListener("load", () => window.setTimeout(removeLoading, 450), { once: true });
        script.addEventListener("error", removeLoading, { once: true });
        container.appendChild(script);
        window.setTimeout(removeLoading, 2200);
    };

    if ("requestIdleCallback" in window) {
        window.requestIdleCallback(mountScript, { timeout: 900 });
    } else {
        window.setTimeout(mountScript, 120);
    }
}

function initDashboard() {
    const searchInput = document.querySelector(".search-field input");
    const dropdown = document.getElementById("searchDropdown");
    const tickerTrack = document.querySelector("[data-ticker-track]");
    const marketTable = document.querySelector("[data-market-table]");
    const refreshButton = document.querySelector("[data-refresh-button]");
    const assetSelector = document.querySelector("[data-asset-selector]");

    const statMarketCap = document.querySelector("[data-stat-market-cap]");
    const statVolume = document.querySelector("[data-stat-volume]");
    const statMovers = document.querySelector("[data-stat-movers]");

    const chartImage = document.querySelector("[data-chart-image]");
    const chartTitle = document.querySelector("[data-chart-title]");
    const chartVolume = document.querySelector("[data-chart-volume]");
    const chartMomentum = document.querySelector("[data-chart-momentum]");
    const chartBias = document.querySelector("[data-chart-bias]");
    const chartLiquidity = document.querySelector("[data-chart-liquidity]");

    let selectedId = "bitcoin";
    let marketState = [];
    let visibleState = [];

    function getCoin(id) {
        return marketState.find((coin) => coin.id === id);
    }

    function renderTicker(data) {
        const chips = data.map((coin) => `
            <span class="ticker-chip">
                <img src="${coin.image}" alt="${coin.name} icon">
                <strong>${coin.symbol.toUpperCase()}</strong>
                <span>${formatCurrency(coin.current_price)}</span>
                <span class="${changeClass(coin.price_change_percentage_24h)}">${formatPercent(coin.price_change_percentage_24h)}</span>
            </span>
        `).join("");

        tickerTrack.innerHTML = chips + chips;
    }

    function renderHero(coin) {
        const totalCap = marketState.reduce((sum, item) => sum + item.market_cap, 0);
        const totalVolume = marketState.reduce((sum, item) => sum + item.total_volume, 0);
        const movers = marketState.filter((item) => item.price_change_percentage_24h > 0).length;

        statMarketCap.textContent = formatCompactCurrency(totalCap);
        statVolume.textContent = formatCompactCurrency(totalVolume);
        statMovers.textContent = `${movers}/${marketState.length}`;
    }

    function renderChart(coin) {
        const high = Math.max(...coin.sparkline_in_7d.price);
        const low = Math.min(...coin.sparkline_in_7d.price);
        const delta = coin.price_change_percentage_24h;

        if (chartImage) {
            chartImage.src = coin.image;
            chartImage.alt = `${coin.name} icon`;
        }
        if (chartTitle) chartTitle.textContent = `${coin.name} / ${coin.symbol.toUpperCase()}`;
        if (chartVolume) chartVolume.textContent = formatCompactCurrency(coin.total_volume);
        if (chartMomentum) chartMomentum.textContent = delta >= 1 ? "Strong" : delta >= 0 ? "Stable" : "Weak";
        if (chartBias) chartBias.textContent = delta >= 0 ? "Bullish tilt" : "Defensive";
        if (chartLiquidity) chartLiquidity.textContent = high - low > coin.current_price * 0.08 ? "Wide range" : "Tight range";
        renderTradingViewWidget("dashboardTvChart", coin.id, {
            interval: "240",
            hide_top_toolbar: true,
            hide_legend: true,
            hide_side_toolbar: true,
            withdateranges: false
        });
    }

    function renderSelector(data) {
        assetSelector.innerHTML = data.slice(0, 4).map((coin) => `
            <button class="asset-chip ${coin.id === selectedId ? "is-active" : ""}" type="button" data-coin-id="${coin.id}">
                <div class="asset-chip-header"><img src="${coin.image}" alt="${coin.name}"><strong>${coin.symbol.toUpperCase()}</strong></div>
                <span>${formatCurrency(coin.current_price)}</span>
                <span class="${changeClass(coin.price_change_percentage_24h)}">${formatPercent(coin.price_change_percentage_24h)}</span>
            </button>
        `).join("");
    }

    function renderTable(data) {
        marketTable.innerHTML = data.map((coin) => `
            <tr class="${coin.id === selectedId ? "is-active" : ""}" data-coin-id="${coin.id}">
                <td>
                    <div class="table-token">
                        <img src="${coin.image}" alt="${coin.name} icon">
                        <div>
                            <strong>${coin.symbol.toUpperCase()} <span class="table-name">${coin.name}</span></strong>
                            <small>Market cap ${formatCompactCurrency(coin.market_cap)}</small>
                        </div>
                    </div>
                </td>
                <td>${formatCurrency(coin.current_price)}</td>
                <td><span class="${changeClass(coin.price_change_percentage_24h)}">${formatPercent(coin.price_change_percentage_24h)}</span></td>
                <td>${formatCompactCurrency(coin.market_cap)}</td>
                <td>${formatCompactCurrency(coin.total_volume)}</td>
                <td>${new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(coin.circulating_supply || 0)}</td>
            </tr>
        `).join("");
    }

    function renderAllocation(data) {
        const coins_palette = [
            { c0:'#00ffd5', c1:'#00c9a7', c2:'#007a68' },
            { c0:'#00ff99', c1:'#00d474', c2:'#007a40' },
            { c0:'#43ffc8', c1:'#1ad4a0', c2:'#0a6b50' },
            { c0:'#80ffcc', c1:'#40e8a0', c2:'#1a7850' },
            { c0:'#b0ffd8', c1:'#70d4a8', c2:'#2a6e54' },
            { c0:'#d0fff0', c1:'#98e8c8', c2:'#3a6858' },
        ];

        const top = data.slice(0, 6);
        const total = top.reduce((s, c) => s + c.market_cap, 0);

        const allocationShell = document.querySelector('.allocation-composition');
        if (allocationShell && !allocationShell.querySelector('.allocation-chart-wrap')) {
            allocationShell.innerHTML = `
                <div class="allocation-side-list">
                    <div data-allocation-list-left></div>
                </div>
                <div class="allocation-chart-wrap">
                    <canvas id="allocationCanvas" width="480" height="480" style="width:240px;height:240px"></canvas>
                </div>
                <div class="allocation-side-list">
                    <div data-allocation-list-right></div>
                </div>
            `;

            const existingFooter = document.querySelector('.allocation-footer-grid');
            if (!existingFooter) {
                const footer = document.createElement('div');
                footer.className = 'allocation-footer-grid';
                footer.innerHTML = `
                    <div class="alloc-foot-card"><div class="alloc-foot-label">Top weight</div><div class="alloc-foot-val" id="allocTopWeight">—</div></div>
                    <div class="alloc-foot-card"><div class="alloc-foot-label">Tracked set</div><div class="alloc-foot-val" id="allocTracked">— assets</div></div>
                    <div class="alloc-foot-card"><div class="alloc-foot-label">Dominant side</div><div class="alloc-foot-val" id="allocDominant">Core majors</div></div>
                    <div class="alloc-foot-card"><div class="alloc-foot-label">Coverage</div><div class="alloc-foot-val" id="allocCoverage">6 tokens</div></div>
                `;
                allocationShell.insertAdjacentElement('afterend', footer);
            }
        }

        const cv = document.getElementById('allocationCanvas');
        if (!cv) return;
        const ctx = cv.getContext('2d');
        const S = 2;
        const CX = 120*S, CY = 120*S, RO = 104*S, RI = 52*S;
        const GAP = 0.038;
        let hovered = -1;

        const angles = [];
        let a = -Math.PI / 2;
        top.forEach(coin => {
            const sw = (coin.market_cap / total) * Math.PI * 2;
            angles.push({ s: a + GAP, e: a + sw - GAP, rs: a, re: a + sw });
            a += sw;
        });

        function drawSeg(sa, ea, pal, lifted) {
            if (ea - sa < 0.01) return;
            const mid = (sa + ea) / 2;
            const lx = lifted ? Math.cos(mid) * 7 * S : 0;
            const ly = lifted ? Math.sin(mid) * 7 * S : 0;
            ctx.save();
            ctx.translate(lx, ly);
            const clip = new Path2D();
            clip.arc(CX, CY, RO + 2, sa, ea);
            clip.arc(CX, CY, RI - 2, ea, sa, true);
            clip.closePath();
            ctx.clip(clip);
            ctx.save();
            ctx.shadowColor = pal.c0;
            ctx.shadowBlur = lifted ? 48 * S : 28 * S;
            const base = new Path2D();
            base.arc(CX, CY, RO, sa, ea);
            base.arc(CX, CY, RI, ea, sa, true);
            base.closePath();
            const g = ctx.createRadialGradient(CX, CY, RI, CX, CY, RO);
            g.addColorStop(0, pal.c2 + 'ff');
            g.addColorStop(0.4, pal.c1 + 'ff');
            g.addColorStop(1, pal.c0 + 'ff');
            ctx.fillStyle = g;
            ctx.fill(base);
            ctx.restore();
            ctx.save();
            ctx.globalAlpha = 0.10;
            ctx.fillStyle = '#ffffff';
            ctx.fill(base);
            ctx.restore();
            ctx.save();
            const span = ea - sa;
            const refPath = new Path2D();
            refPath.arc(CX, CY, RO, sa, sa + span * 0.52);
            refPath.arc(CX, CY, RO - 16 * S, sa + span * 0.52, sa, true);
            refPath.closePath();
            const rg = ctx.createLinearGradient(
                CX + Math.cos(mid) * (RO - 16 * S), CY + Math.sin(mid) * (RO - 16 * S),
                CX + Math.cos(mid) * RO, CY + Math.sin(mid) * RO
            );
            rg.addColorStop(0, 'rgba(255,255,255,0.0)');
            rg.addColorStop(0.5, 'rgba(255,255,255,0.15)');
            rg.addColorStop(1, 'rgba(255,255,255,0.50)');
            ctx.fillStyle = rg;
            ctx.fill(refPath);
            ctx.restore();
            ctx.save();
            const rimPath = new Path2D();
            rimPath.arc(CX, CY, RI + 10 * S, sa, sa + span * 0.45);
            rimPath.arc(CX, CY, RI, sa + span * 0.45, sa, true);
            rimPath.closePath();
            ctx.fillStyle = 'rgba(255,255,255,0.08)';
            ctx.fill(rimPath);
            ctx.restore();
            ctx.save();
            ctx.strokeStyle = 'rgba(255,255,255,0.18)';
            ctx.lineWidth = 1.5;
            ctx.stroke(base);
            ctx.restore();
            ctx.restore();
        }

        function drawCenter() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(CX, CY, RI - 4, 0, Math.PI * 2);
            const bg = ctx.createRadialGradient(CX, CY - 10, 4, CX, CY, RI);
            bg.addColorStop(0, '#0f201a');
            bg.addColorStop(1, '#050c09');
            ctx.fillStyle = bg;
            ctx.shadowColor = 'rgba(0,255,200,0.12)';
            ctx.shadowBlur = 20;
            ctx.fill();
            ctx.strokeStyle = 'rgba(41,225,203,0.15)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'rgba(138,155,144,0.9)';
            ctx.font = `600 ${9 * S}px "Open Sauce Sans", sans-serif`;
            ctx.fillText('TVL', CX, CY - 11 * S);
            ctx.fillStyle = '#f0faf7';
            ctx.font = `700 ${15 * S}px "Open Sauce Sans", sans-serif`;
            ctx.fillText(formatCompactCurrency(total), CX, CY + 8 * S);
            ctx.restore();
        }

        function draw() {
            ctx.clearRect(0, 0, 480, 480);
            angles.forEach(({ s, e }, i) => { if (i !== hovered) drawSeg(s, e, coins_palette[i], false); });
            if (hovered >= 0) drawSeg(angles[hovered].s, angles[hovered].e, coins_palette[hovered], true);
            drawCenter();
        }

        const leftListEl = document.querySelector('[data-allocation-list-left]');
        const rightListEl = document.querySelector('[data-allocation-list-right]');
        const buildAllocationItem = (coin, i) => {
            const share = ((coin.market_cap / total) * 100).toFixed(2);
            const pal = coins_palette[i];
            return `<div class="allocation-item" data-alloc-idx="${i}">
                <span class="allocation-dot" style="background:${pal.c0};box-shadow:0 0 10px ${pal.c0}bb"></span>
                <span class="allocation-name">${coin.symbol.toUpperCase()}<small>${coin.name}</small></span>
                <span class="allocation-value" style="color:${pal.c0}">${share}%</span>
            </div>`;
        };

        if (leftListEl) {
            leftListEl.innerHTML = top.slice(0, 3).map((coin, i) => buildAllocationItem(coin, i)).join('');
        }
        if (rightListEl) {
            rightListEl.innerHTML = top.slice(3, 6).map((coin, idx) => buildAllocationItem(coin, idx + 3)).join('');
        }

        document.querySelectorAll('[data-alloc-idx]').forEach(el => {
            const i = parseInt(el.dataset.allocIdx);
            el.addEventListener('mouseenter', () => { hovered = i; draw(); });
            el.addEventListener('mouseleave', () => { hovered = -1; draw(); });
        });

        const topWeightEl = document.getElementById('allocTopWeight');
        const trackedEl = document.getElementById('allocTracked');
        const dominantEl = document.getElementById('allocDominant');
        const coverageEl = document.getElementById('allocCoverage');
        if (topWeightEl) {
            const topCoin = top[0];
            const topShare = ((topCoin.market_cap / total) * 100).toFixed(2);
            topWeightEl.textContent = `${topCoin.symbol.toUpperCase()} ${topShare}%`;
        }
        if (trackedEl) trackedEl.textContent = `${top.length} assets`;
        if (dominantEl) dominantEl.textContent = `${top[0].symbol.toUpperCase()} leads`;
        if (coverageEl) coverageEl.textContent = `${top.length} tokens`;

        cv.onmousemove = e => {
            const r = cv.getBoundingClientRect();
            const dx = (e.clientX - r.left) * (480 / r.width) - CX;
            const dy = (e.clientY - r.top) * (480 / r.height) - CY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < RI - 4 || dist > RO + 10) { if (hovered !== -1) { hovered = -1; draw(); } return; }
            let ang = Math.atan2(dy, dx);
            let found = -1;
            angles.forEach(({ rs, re }, i) => {
                let ta = ang;
                if (ta < rs && re > Math.PI / 2) ta += Math.PI * 2;
                if (ta >= rs && ta < re) found = i;
            });
            if (found !== hovered) { hovered = found; draw(); }
        };
        cv.onmouseleave = () => { hovered = -1; draw(); };

        draw();
    }

    function bindSelection() {
        document.querySelectorAll("[data-coin-id]").forEach((element) => {
            element.addEventListener("click", () => {
                if (element.classList.contains("search-drop-item")) return;
                if (searchInput && searchInput.value.trim()) {
                    window.location.href = `trading.html?asset=${encodeURIComponent(element.dataset.coinId)}`;
                    return;
                }

                selectedId = element.dataset.coinId;
                const coin = getCoin(selectedId);
                renderHero(coin);
                renderChart(coin);
                renderSelector(visibleState);
                renderTable(visibleState);
                bindSelection();
            });
        });
    }

    function renderVisibleState() {
        renderSelector(visibleState);
        renderTable(visibleState);
        bindSelection();
    }

    async function hydrate() {
        refreshButton.disabled = true;
        refreshButton.textContent = "Refreshing...";

        try {
            marketState = await fetchMarketData();
            visibleState = [...marketState];
            const selected = getCoin(selectedId) || marketState[0];
            renderTicker(marketState);
            renderHero(selected);
            renderChart(selected);
            renderVisibleState();
            renderAllocation(marketState);
        } catch (error) {
            console.error(error);
            marketTable.innerHTML = `<tr><td colspan="6" class="loading-row">Live prices could not be loaded right now.</td></tr>`;
        } finally {
            refreshButton.disabled = false;
            refreshButton.textContent = "Refresh data";
        }
    }

    if (refreshButton) refreshButton.addEventListener("click", hydrate);
    searchInput?.addEventListener('input', e => {
      const q = e.target.value.trim().toLowerCase();
      visibleState = q ? marketState.filter(c => c.name.toLowerCase().includes(q)||c.symbol.toLowerCase().includes(q)) : [...marketState];
      renderVisibleState();
      if (!dropdown) return;
      dropdown.innerHTML = q ? visibleState.slice(0,5).map(c => `<div class="search-drop-item" data-coin-id="${c.id}"><img src="${c.image}" alt="${c.name} icon"><span>${c.name}</span><strong>${c.symbol.toUpperCase()}</strong><small>${formatCurrency(c.current_price)}</small></div>`).join('') : '';
      dropdown.classList.toggle('open', !!q && visibleState.length > 0);
    });
    searchInput?.addEventListener('blur', () => setTimeout(() => dropdown?.classList.remove('open'), 150));
    dropdown?.addEventListener('click', e => {
      const item = e.target.closest('[data-coin-id]');
      if (!item) return;
      window.location.href = `trading.html?asset=${encodeURIComponent(item.dataset.coinId)}`;
    });
    hydrate();
    setInterval(hydrate, 120000);
}

function initTrading() {
    const searchInput = document.querySelector("[data-trade-search]");
    const searchDropdown = document.getElementById("tradeSearchDropdown");
    const tradeTitle = document.querySelector("[data-trade-page-title]");
    const tradeImage = document.querySelector("[data-trade-image]");
    const tradeSymbol = document.querySelector("[data-trade-symbol]");
    const priceNode = document.querySelector("[data-trade-price]");
    const markNode = document.querySelector("[data-trade-mark]");
    const volNode = document.querySelector("[data-trade-vol]");
    const orderBook = document.querySelector("[data-order-book]");
    const recentTrades = document.querySelector("[data-recent-trades]");
    const sideButtons = document.querySelectorAll("[data-trade-side]");
    const actionButton = document.querySelector(".trade-action-button");
    const requestedAsset = new URLSearchParams(window.location.search).get("asset");
    let activeAssetId = requestedAsset || "bitcoin";
    let marketState = [];

    function renderTradingChart(asset) {
        renderTradingViewWidget("tradingTvChart", asset, {
            interval: "60",
            hide_top_toolbar: false,
            hide_legend: false,
            withdateranges: true
        });
    }

    function renderLists(asset) {
        const price = asset?.current_price || 76780;
        const symbol = asset?.symbol?.toUpperCase() || "BTC";
        const bookRows = [
            [price * 1.0022, `0.42 ${symbol}`, price * 0.42],
            [price * 1.0014, `0.90 ${symbol}`, price * 0.9],
            [price, `1.40 ${symbol}`, price * 1.4],
            [price * 0.9988, `0.64 ${symbol}`, price * 0.64]
        ];

        const tradeRows = [
            ["16:18", "Buy", "$2.1M", "Aggressive"],
            ["16:17", "Sell", "$540K", "Absorption"],
            ["16:16", "Buy", "$1.3M", "Sweep"],
            ["16:15", "Buy", "$880K", "Reclaim"]
        ];

        orderBook.innerHTML = bookRows.map((row) => `
            <div class="mini-row">
                <span>${formatCurrency(row[0])}</span>
                <strong>${row[1]}</strong>
                <small>${formatCurrency(row[2])}</small>
            </div>
        `).join("");

        recentTrades.innerHTML = tradeRows.map((row) => `
            <div class="mini-row">
                <span>${row[0]}</span>
                <strong>${row[1]}</strong>
                <small>${row[2]} · ${row[3]}</small>
            </div>
        `).join("");
    }

    function renderSearchResults(query) {
        if (!searchDropdown) return;
        const q = query.trim().toLowerCase();
        const results = q
            ? marketState.filter((coin) => coin.name.toLowerCase().includes(q) || coin.symbol.toLowerCase().includes(q)).slice(0, 8)
            : [];

        searchDropdown.innerHTML = results.map((coin) => `
            <div class="search-drop-item" data-trade-coin-id="${coin.id}">
                <img src="${coin.image}" alt="${coin.name} icon">
                <span>${coin.name}</span>
                <strong>${coin.symbol.toUpperCase()}</strong>
                <small>${formatCurrency(coin.current_price)}</small>
            </div>
        `).join("");
        searchDropdown.classList.toggle("open", results.length > 0);
    }

    function setActiveAsset(asset, shouldPushUrl = false) {
        if (!asset) return;
        activeAssetId = asset.id;

        if (tradeTitle) tradeTitle.textContent = `${asset.symbol.toUpperCase()} / USDT Desk`;
        if (tradeImage) {
            tradeImage.src = asset.image;
            tradeImage.alt = `${asset.name} icon`;
        }
        if (tradeSymbol) tradeSymbol.textContent = `${asset.name} / USDT`;
        if (priceNode) priceNode.textContent = formatCurrency(asset.current_price);
        if (markNode) markNode.textContent = formatCurrency(asset.current_price * 1.0014);
        if (volNode) volNode.textContent = formatCompactCurrency(asset.total_volume);
        if (searchInput) searchInput.value = `${asset.name} / ${asset.symbol.toUpperCase()}`;

        renderTradingChart(asset);
        renderLists(asset);

        if (shouldPushUrl) {
            const url = new URL(window.location.href);
            url.searchParams.set("asset", asset.id);
            window.history.replaceState({}, "", url);
        }
    }

    sideButtons.forEach((button) => {
        button.addEventListener("click", () => {
            sideButtons.forEach((item) => item.classList.remove("is-active"));
            button.classList.add("is-active");
            actionButton.textContent = button.dataset.tradeSide === "buy" ? "Place Buy Order" : "Place Sell Order";
            actionButton.style.background = button.dataset.tradeSide === "buy"
                ? "linear-gradient(135deg, rgba(49, 208, 142, 0.28), rgba(41, 225, 203, 0.12))"
                : "linear-gradient(135deg, rgba(255, 127, 127, 0.24), rgba(255, 127, 127, 0.1))";
        });
    });

    fetchTradingMarketData()
        .then((data) => {
            marketState = data;
            const asset = marketState.find((coin) => coin.id === activeAssetId) || marketState[0];
            setActiveAsset(asset);
        })
        .catch((error) => {
            console.error(error);
            renderTradingChart(activeAssetId);
            renderLists();
        });

    searchInput?.addEventListener("input", (event) => {
        renderSearchResults(event.target.value);
    });

    searchInput?.addEventListener("focus", () => {
        renderSearchResults(searchInput.value);
    });

    searchInput?.addEventListener("blur", () => {
        setTimeout(() => searchDropdown?.classList.remove("open"), 150);
    });

    searchDropdown?.addEventListener("click", (event) => {
        const item = event.target.closest("[data-trade-coin-id]");
        if (!item) return;

        const asset = marketState.find((coin) => coin.id === item.dataset.tradeCoinId);
        setActiveAsset(asset, true);
        searchDropdown.classList.remove("open");
    });

    renderTradingChart(activeAssetId);
    renderLists();
}

if (page === "dashboard") {
    initDashboard();
}

if (page === "trading") {
    initTrading();
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-ready');
  requestAnimationFrame(() => {
    document.querySelectorAll('.panel').forEach((panel) => panel.classList.add('is-visible'));
  });

  document.querySelectorAll(".tv-chart").forEach((chart) => {
    chart.addEventListener("pointerenter", () => {
      document.body.classList.add("chart-interaction");
      if (cursorGlow) cursorGlow.style.opacity = "0";
    });

    chart.addEventListener("pointerleave", () => {
      document.body.classList.remove("chart-interaction");
      if (cursorGlow) cursorGlow.style.opacity = "";
    });
  });

  const glowCards = Array.from(document.querySelectorAll(`
    .figma-dashboard .main-content > .panel,
    .figma-dashboard .dashboard-grid > .panel,
    .figma-dashboard .summary-grid > .panel,
    .figma-dashboard .trading-layout > .panel,
    .figma-dashboard .trade-lower-grid > .panel,
    .figma-dashboard .auth-panel
  `));

  const syncGlowCards = (x, y) => {
    if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) {
      glowCards.forEach((card) => card.classList.remove("is-glow-active"));
      return;
    }

    let activeCard = null;
    let activeArea = Number.POSITIVE_INFINITY;

    glowCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const isInside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      if (!isInside) return;

      const area = rect.width * rect.height;
      if (area < activeArea) {
        activeArea = area;
        activeCard = card;
      }
    });

    glowCards.forEach((card) => {
      const isActive = card === activeCard;
      card.classList.toggle("is-glow-active", isActive);
      if (!isActive) return;

      const rect = card.getBoundingClientRect();
      card.style.setProperty("--glow-x", `${(x - rect.left).toFixed(2)}px`);
      card.style.setProperty("--glow-y", `${(y - rect.top).toFixed(2)}px`);
    });
  };

  window.addEventListener("orderflow:pointer-sync", (event) => {
    syncGlowCards(event.detail.x, event.detail.y);
  });

  window.setInterval(() => {
    syncGlowCards(lastPointerX, lastPointerY);
  }, 120);
});

window.addEventListener('pageshow', () => {
  document.body.classList.remove('page-leaving');
  document.body.classList.add('page-ready');
});

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href]');
  if (!link) return;

  const href = link.getAttribute('href');
  const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank';
  const isLocalPage = href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto:');
  if (!isLocalPage || isModifiedClick) return;

  event.preventDefault();
  document.body.classList.add('page-leaving');
  window.setTimeout(() => {
    window.location.href = href;
  }, 115);
});

(function(){
  const pal=document.getElementById('cmdPalette'),bd=document.getElementById('cmdBackdrop'),si=document.getElementById('cmdSearch'),res=document.getElementById('cmdResults');
  if(!pal)return;
  const items=[{l:'Dashboard',t:'page',h:'index.html'},{l:'Trading',t:'page',h:'trading.html'},{l:'Portfolio',t:'page',h:'portfolio.html'},{l:'Watchlist',t:'page',h:'watchlist.html'},{l:'Research',t:'page',h:'research.html'},{l:'BTC',t:'asset',h:'trading.html'},{l:'ETH',t:'asset',h:'trading.html'},{l:'SOL',t:'asset',h:'trading.html'}];
  const render=q=>res.innerHTML=(q?items.filter(i=>i.l.toLowerCase().includes(q)):items).map(i=>`<div class="cmd-result-item" data-href="${i.h}">${i.l}<small style="color:#8a9b90">${i.t}</small></div>`).join('');
  const open=()=>{pal.classList.add('open');setTimeout(()=>si.focus(),50)};
  const close=()=>{pal.classList.remove('open');si.value='';render('')};
  render('');
  document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();pal.classList.contains('open')?close():open()}if(e.key==='Escape')close()});
  bd.addEventListener('click',close);
  si.addEventListener('input',()=>render(si.value.toLowerCase()));
  res.addEventListener('click',e=>{const i=e.target.closest('[data-href]');if(i)location.href=i.dataset.href});
})();

(function(){
  const selector = document.querySelector('[data-asset-selector]');
  if (!selector || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  selector.addEventListener('pointermove', (event) => {
    const card = event.target.closest('.asset-chip');
    if (!card || !selector.contains(card)) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const tiltX = (0.5 - y) * 12;
    const tiltY = (x - 0.5) * 16;

    card.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
    card.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
    card.style.setProperty('--shine-x', `${(x * 100).toFixed(1)}%`);
    card.style.setProperty('--shine-y', `${(y * 100).toFixed(1)}%`);
  });

  selector.addEventListener('pointerleave', () => {
    selector.querySelectorAll('.asset-chip').forEach((card) => {
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
      card.style.removeProperty('--shine-x');
      card.style.removeProperty('--shine-y');
    });
  });
})();
