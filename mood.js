(() => {
  const moods = [
    { key: "stress", label: "壓力", emoji: "😮‍💨" },
    { key: "overwhelm", label: "壓力大", emoji: "🫠" },
    { key: "sad", label: "感傷", emoji: "🥺" },
    { key: "angry", label: "煩躁", emoji: "😤" },
    { key: "calm", label: "安靜", emoji: "🌿" },
    { key: "happy", label: "開心", emoji: "✨" }
  ];

  // 用 SVG 當「照片」，不用另外放圖檔
  const svgPhoto = (theme = "lavender") => {
    const themes = {
      lavender: { bg1: "#f6efe9", bg2: "#efe2d8", acc: "#cbb1a2", dot: "#a58c7a" },
      caramel:  { bg1: "#fff0e2", bg2: "#f3d8c5", acc: "#e2b38e", dot: "#b07b5a" },
      mint:     { bg1: "#eff7f1", bg2: "#d7efe0", acc: "#9fd3b2", dot: "#5b8c74" },
      cocoa:    { bg1: "#f4efe9", bg2: "#e7d6c9", acc: "#c89f7c", dot: "#7c5a42" },
      berry:    { bg1: "#fff0f3", bg2: "#f3c9d1", acc: "#d98aa0", dot: "#9a4f5f" },
      citrus:   { bg1: "#fff7e8", bg2: "#ffe2b8", acc: "#f2b36a", dot: "#a86a2a" }
    };

    const t = themes[theme] || themes.lavender;

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="${t.bg1}"/>
            <stop offset="1" stop-color="${t.bg2}"/>
          </linearGradient>
          <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="12" stdDeviation="18" flood-color="rgba(0,0,0,0.10)"/>
          </filter>
        </defs>

        <rect width="1200" height="675" fill="url(#g)"/>
        <!-- 桌面 / 盤子 -->
        <ellipse cx="740" cy="410" rx="330" ry="110" fill="rgba(255,255,255,0.7)"/>
        <ellipse cx="740" cy="410" rx="260" ry="85" fill="rgba(255,255,255,0.9)"/>
        <!-- 甜點(簡化) -->
        <g filter="url(#s)">
          <circle cx="665" cy="385" r="56" fill="#fff" stroke="${t.acc}" stroke-width="8"/>
          <circle cx="740" cy="350" r="66" fill="#fff" stroke="${t.acc}" stroke-width="8"/>
          <circle cx="820" cy="392" r="54" fill="#fff" stroke="${t.acc}" stroke-width="8"/>
          <!-- 巧克力豆 -->
          ${Array.from({length: 24}).map((_,i)=>{
            const x = 610 + (i*23)%280;
            const y = 320 + Math.floor(i/12)*90 + (i%3)*10;
            return `<circle cx="${x}" cy="${y}" r="6" fill="${t.dot}" opacity="0.55"/>`;
          }).join("")}
        </g>

        <!-- 薰衣草/裝飾 -->
        <g opacity="0.45">
          <rect x="240" y="220" width="18" height="220" rx="9" fill="${t.dot}"/>
          <circle cx="249" cy="210" r="26" fill="${t.dot}"/>
          <circle cx="280" cy="240" r="18" fill="${t.dot}"/>
          <circle cx="220" cy="260" r="14" fill="${t.dot}"/>
        </g>
      </svg>
    `.trim();

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };

  const dessertByMood = {
    stress: {
      name: "薰衣草奶酥餅乾",
      price: 220,
      tag: "放鬆 / 舒壓",
      theme: "lavender",
      desc: "帶點花香與奶油的柔軟甜味，讓你慢慢把呼吸放回來。"
    },
    overwhelm: {
      name: "焦糖海鹽奶油塔",
      price: 260,
      tag: "安定 / 撫慰",
      theme: "caramel",
      desc: "甜與鹹的平衡像是給大腦一個「先停一下」的訊號。"
    },
    sad: {
      name: "莓果雲朵戚風",
      price: 280,
      tag: "溫柔 / 陪伴",
      theme: "berry",
      desc: "輕盈口感配上酸甜莓果，像一句不打擾的安慰。"
    },
    angry: {
      name: "濃可可布朗尼",
      price: 240,
      tag: "釋放 / 療癒",
      theme: "cocoa",
      desc: "厚實可可讓情緒有地方落地，慢慢把尖銳磨圓。"
    },
    calm: {
      name: "薄荷奶油飲",
      price: 180,
      tag: "清新 / 續航",
      theme: "mint",
      desc: "清清涼涼的節奏，適合你想維持平靜的今天。"
    },
    happy: {
      name: "柑橘奶油蛋糕",
      price: 300,
      tag: "明亮 / 加分",
      theme: "citrus",
      desc: "果香讓快樂更立體，像把好心情再往上推一點。"
    }
  };

  const $buttons = document.getElementById("moodButtons");
  const $preview = document.getElementById("previewPills");
  const $reveal = document.getElementById("moodReveal");

  const renderButtons = () => {
    $buttons.innerHTML = moods.map(m => `
      <button class="mood-pill" type="button" data-mood="${m.key}">
        <span class="mood-emoji">${m.emoji}</span>
        <span class="mood-text">${m.label}</span>
      </button>
    `).join("");

    // 同步預覽區(Interact)
    $preview.innerHTML = moods.map(m => `
      <div class="mood-pill ghost" data-mood="${m.key}">
        <span class="mood-emoji">${m.emoji}</span>
        <span class="mood-text">${m.label}</span>
      </div>
    `).join("");
  };

  const setActive = (key) => {
    document.querySelectorAll(".mood-pill").forEach(el => {
      const isActive = el.dataset.mood === key;
      el.classList.toggle("active", isActive);
      el.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
    document.querySelectorAll(".mood-preview-pills .mood-pill").forEach(el => {
      el.classList.toggle("active", el.dataset.mood === key);
    });
  };

  const renderReveal = (key) => {
    const d = dessertByMood[key];
    if (!d) return;

    const photo = svgPhoto(d.theme);

    $reveal.innerHTML = `
      <div class="dessert-card" role="region" aria-label="甜點推薦">
        <div class="dessert-photo" style="background-image:url('${photo}')"></div>

        <div class="dessert-body">
          <div class="dessert-top">
            <div class="dessert-name">${d.name}</div>
            <div class="dessert-tag">${d.tag}</div>
          </div>

          <div class="dessert-desc">${d.desc}</div>

          <div class="dessert-bottom">
            <div class="dessert-price">NT$ ${d.price}</div>
            <a class="dessert-link" href="order.html">加入購物車 →</a>
          </div>
        </div>
      </div>
    `;

    // 小動畫：每次重建卡片都 reflow 一下再加 class
    requestAnimationFrame(() => {
      const card = $reveal.querySelector(".dessert-card");
      if (card) card.classList.add("show");
    });
  };

  const onPick = (key) => {
    setActive(key);
    renderReveal(key);
  };

  const bind = () => {
    $buttons.addEventListener("click", (e) => {
      const btn = e.target.closest(".mood-pill");
      if (!btn) return;
      onPick(btn.dataset.mood);
    });
  };

  // init
  renderButtons();
  bind();
})();
