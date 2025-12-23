// mood.js
(() => {
  const moodBar = document.getElementById("moodBar");
  const pickedText = document.getElementById("pickedText");
  const pickedList = document.getElementById("pickedList");
  const recoGrid = document.getElementById("recoGrid");
  const recoEmpty = document.getElementById("recoEmpty");

  // 用 SVG 當圖片（不用另外放檔案也會顯示）
  const svgImage = (title, accent = "#f4a07a") => {
    const safeTitle = (title || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#fff3e6"/>
            <stop offset="1" stop-color="#fffaf2"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)"/>
        <circle cx="650" cy="130" r="90" fill="${accent}" opacity="0.22"/>
        <circle cx="120" cy="470" r="120" fill="${accent}" opacity="0.18"/>
        <rect x="90" y="150" width="620" height="300" rx="26" fill="#ffffff" opacity="0.9"/>
        <text x="400" y="290" font-size="42" text-anchor="middle" fill="#8b6a55" font-family="Microsoft JhengHei, Noto Sans TC, sans-serif">
          Healing Dessert Studio
        </text>
        <text x="400" y="350" font-size="36" text-anchor="middle" fill="#6b4f3f" font-family="Microsoft JhengHei, Noto Sans TC, sans-serif">
          ${safeTitle}
        </text>
      </svg>
    `.trim();
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  };

  // 依心情 → 推薦清單（至少包含：壓力大 → 薰衣草餅乾，符合你的頁面說明）
  const RECO = {
    stress: {
      label: "😮‍💨 壓力",
      items: [
        {
          name: "檸檬蜂蜜奶油塔",
          price: "NT$ 240",
          desc: "酸甜清爽，讓腦袋先降噪一下。",
          img: svgImage("檸檬蜂蜜奶油塔", "#c0896f"),
        },
        {
          name: "伯爵奶茶磅蛋糕",
          price: "NT$ 260",
          desc: "溫柔茶香，慢慢把緊繃放鬆。",
          img: svgImage("伯爵奶茶磅蛋糕", "#8b6a55"),
        },
      ],
    },
    stress_big: {
      label: "😵 壓力大",
      items: [
        {
          name: "薰衣草餅乾",
          price: "NT$ 220",
          desc: "淡淡薰衣草香，安撫焦躁、幫你把呼吸放慢。",
          img: svgImage("薰衣草餅乾", "#9b8bd6"),
        },
        {
          name: "海鹽可可曲奇",
          price: "NT$ 240",
          desc: "濃厚可可＋一點海鹽，給你穩定的安全感。",
          img: svgImage("海鹽可可曲奇", "#6b4f3f"),
        },
      ],
    },
    hurt: {
      label: "🥺 感傷",
      items: [
        {
          name: "莓果奶油蛋糕",
          price: "NT$ 320",
          desc: "酸甜莓果像一句安慰：你已經很努力了。",
          img: svgImage("莓果奶油蛋糕", "#f08aa7"),
        },
      ],
    },
    annoyed: {
      label: "😤 煩躁",
      items: [
        {
          name: "柚香氣泡飲",
          price: "NT$ 160",
          desc: "清爽氣泡把火氣先放掉一半。",
          img: svgImage("柚香氣泡飲", "#87b6eb"),
        },
        {
          name: "焦糖脆脆派塔",
          price: "NT$ 250",
          desc: "酥脆咬感很解壓，越嚼越冷靜。",
          img: svgImage("焦糖脆脆派塔", "#c0896f"),
        },
      ],
    },
    calm: {
      label: "🌿 安靜",
      items: [
        {
          name: "抹茶白巧餅乾",
          price: "NT$ 220",
          desc: "微苦回甘，靜靜陪你把心放平。",
          img: svgImage("抹茶白巧餅乾", "#7fbf8a"),
        },
      ],
    },
    happy: {
      label: "✨ 開心",
      items: [
        {
          name: "香草草莓杯子蛋糕",
          price: "NT$ 180",
          desc: "可愛又甜甜的，讓好心情更完整。",
          img: svgImage("香草草莓杯子蛋糕", "#f4a07a"),
        },
        {
          name: "奶油拿鐵",
          price: "NT$ 170",
          desc: "暖暖一杯，把幸福續杯。",
          img: svgImage("奶油拿鐵", "#8b6a55"),
        },
      ],
    },
  };

  const clearActive = () => {
    moodBar.querySelectorAll(".mood-btn").forEach(btn => btn.classList.remove("is-active"));
  };

  const setPulse = (btn) => {
    btn.classList.remove("is-pulse");
    // 觸發 reflow
    void btn.offsetWidth;
    btn.classList.add("is-pulse");
  };

  const renderPicked = (label) => {
    pickedText.textContent = label;
    pickedList.innerHTML = `
      <li>${label}</li>
    `;
  };

  const renderReco = (items) => {
    recoGrid.innerHTML = "";
    if (!items || items.length === 0) {
      recoEmpty.style.display = "block";
      return;
    }

    recoEmpty.style.display = "none";

    items.forEach((it) => {
      const card = document.createElement("article");
      card.className = "section1";
      card.innerHTML = `
        <h2>${it.name}</h2>

        <div class="img-wrap">
          <img src="${it.img}" alt="${it.name}">
        </div>

        <div class="dash"></div>

        <p class="price">${it.price}</p>
        <p class="mini">${it.desc || ""}</p>

        <div class="btn-row">
          <button class="action-btn primary" type="button">加入購物車</button>
          <button class="action-btn" type="button">查看更多</button>
        </div>
      `;

      const [btnCart, btnMore] = card.querySelectorAll("button");
      btnCart.addEventListener("click", () => alert(`已加入購物車：${it.name}（示範）`));
      btnMore.addEventListener("click", () => alert(`前往更多頁面（示範）：${it.name}`));

      recoGrid.appendChild(card);
    });
  };

  moodBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".mood-btn");
    if (!btn) return;

    const key = btn.dataset.mood;
    const pack = RECO[key];
    if (!pack) return;

    clearActive();
    btn.classList.add("is-active");
    setPulse(btn);

    renderPicked(pack.label);
    renderReco(pack.items);
  });

  // 語系下拉（示範，不改內容，只避免「按了沒反應」的感覺）
  const langSelect = document.getElementById("langSelect");
  if (langSelect) {
    langSelect.addEventListener("change", () => {
      alert("語系切換（示範）：目前先做介面，文字內容可之後再補。");
      langSelect.value = "zh";
    });
  }
})();
