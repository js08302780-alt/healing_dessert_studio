// mood.js — 心情選單互動：Choose → Interact → Reveal

const moodData = {
  pressure: {
    moodLabel: "😮‍💨 壓力",
    name: "伯爵奶油小塔",
    price: "NT$ 220",
    desc: "淡淡茶香＋奶油圓潤，讓腦袋慢慢放鬆下來。",
  },
  pressureBig: {
    moodLabel: "😵 壓力大",
    name: "薰衣草曲奇餅乾",
    price: "NT$ 220",
    desc: "薰衣草香氣＋酥鬆口感，像把心情柔柔放回原位。",
  },
  sad: {
    moodLabel: "🥺 感傷",
    name: "草莓奶油戚風",
    price: "NT$ 260",
    desc: "酸甜草莓把低落拉回來，溫柔不刺激。",
  },
  annoyed: {
    moodLabel: "😤 煩躁",
    name: "海鹽焦糖布丁杯",
    price: "NT$ 180",
    desc: "鹹甜平衡，幫你把心裡那股躁感緩下來。",
  },
  calm: {
    moodLabel: "🌿 安靜",
    name: "抹茶白巧餅乾",
    price: "NT$ 200",
    desc: "細緻抹茶苦甜，適合安靜的你慢慢咬。",
  },
  happy: {
    moodLabel: "✨ 開心",
    name: "檸檬奶霜小蛋糕",
    price: "NT$ 240",
    desc: "清爽檸檬香，讓好心情更亮一點。",
  },
};

function svgPlaceholder(title) {
  const safe = String(title).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fff3e6"/>
        <stop offset="1" stop-color="#f7f0ea"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="900" fill="url(#g)"/>
    <circle cx="220" cy="210" r="90" fill="rgba(244,160,122,0.25)"/>
    <circle cx="980" cy="700" r="140" fill="rgba(135,168,235,0.22)"/>
    <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle"
          font-size="54" font-family="Microsoft JhengHei, Noto Sans TC, sans-serif"
          fill="#8b6a55" font-weight="700">${safe}</text>
    <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle"
          font-size="26" font-family="Microsoft JhengHei, Noto Sans TC, sans-serif"
          fill="#a58c7a">Healing Dessert Studio</text>
  </svg>
  `.trim();

  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function renderRecommendation(key) {
  const area = document.getElementById("recommendationArea");
  const d = moodData[key];
  if (!area || !d) return;

  // 每次點擊都「重新生成」一張卡（符合你文件：動態生成 section1）
  area.innerHTML = `
    <section class="section1" aria-label="心情推薦卡">
      <h2>${d.name}</h2>
      <a class="img" href="cookies.html" aria-label="前往查看商品">
        <img src="${svgPlaceholder(d.name)}" alt="${d.name}">
      </a>
      <div class="dash"></div>
      <div class="price">${d.price}</div>
      <p class="desc"><strong>${d.moodLabel}</strong>｜${d.desc}</p>
      <div class="btn-row">
        <button class="action-btn" type="button" id="goOrderBtn">前往線上訂購</button>
        <button class="action-btn" type="button" id="seeMoreBtn">查看更多甜點</button>
      </div>
    </section>
  `;

  // 按鈕行為
  const goOrderBtn = document.getElementById("goOrderBtn");
  const seeMoreBtn = document.getElementById("seeMoreBtn");

  if (goOrderBtn) goOrderBtn.addEventListener("click", () => (window.location.href = "order.html"));
  if (seeMoreBtn) seeMoreBtn.addEventListener("click", () => (window.location.href = "cookies.html"));
}

function setActiveButton(clickedBtn) {
  const buttons = document.querySelectorAll(".mood-pill");
  buttons.forEach((b) => b.classList.remove("active"));
  clickedBtn.classList.add("active");
}

function initMoodButtons() {
  const toolbar = document.getElementById("moodToolbar");
  if (!toolbar) return;

  toolbar.addEventListener("click", (e) => {
    const btn = e.target.closest(".mood-pill");
    if (!btn) return;

    const key = btn.dataset.mood;
    if (!moodData[key]) return;

    setActiveButton(btn);
    renderRecommendation(key);
  });
}

// 啟動
document.addEventListener("DOMContentLoaded", () => {
  initMoodButtons();

  // 預設先顯示「壓力大」示範（你文件也提到壓力大 → 薰衣草餅乾）
  const defaultBtn = document.querySelector('.mood-pill[data-mood="pressureBig"]');
  if (defaultBtn) {
    defaultBtn.classList.add("active");
    renderRecommendation("pressureBig");
  }
});
