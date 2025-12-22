// bgm.js
(() => {
  const BGM_SRC = "bgm.mp3";
  const STORAGE_KEY = "bgm_enabled"; // 記住使用者選擇（跨頁）

  // 建立 audio（不顯示控制鍵）
  const audio = new Audio(BGM_SRC);
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0.5;

  // 狀態
  let enabled = sessionStorage.getItem(STORAGE_KEY) === "1";
  let startedOnce = false;

  // ============ UI：浮動音樂按鈕（像你圖那種） ============
  const wrap = document.createElement("div");
  wrap.className = "bgm-fab-wrap";
  wrap.innerHTML = `
    <div class="bgm-fab" id="bgmFab" aria-label="背景音樂">
      <div class="bgm-icon" id="bgmIcon">♫</div>
      <div class="bgm-caret" id="bgmCaret">▾</div>
    </div>
    <div class="bgm-menu" id="bgmMenu">
      <button type="button" id="bgmPlay">開啟音樂</button>
      <button type="button" id="bgmStop">關閉音樂</button>
    </div>
  `;
  document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(wrap);

    const fab = document.getElementById("bgmFab");
    const menu = document.getElementById("bgmMenu");
    const playBtn = document.getElementById("bgmPlay");
    const stopBtn = document.getElementById("bgmStop");
    const caret = document.getElementById("bgmCaret");

    // 展開/收起 menu（點 caret 或整個按鈕都可以）
    fab.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("show");
      caret.textContent = menu.classList.contains("show") ? "▴" : "▾";
    });

    // 點空白處關閉
    document.addEventListener("click", () => {
      menu.classList.remove("show");
      caret.textContent = "▾";
    });

    // 手動開/關
    playBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      enabled = true;
      sessionStorage.setItem(STORAGE_KEY, "1");
      await safePlay();
      menu.classList.remove("show");
      caret.textContent = "▾";
    });

    stopBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      enabled = false;
      sessionStorage.setItem(STORAGE_KEY, "0");
      safePause();
      menu.classList.remove("show");
      caret.textContent = "▾";
    });

    // 如果使用者上一頁已經開啟過音樂：這一頁「等到第一次互動」就自動播
    if (enabled) armFirstGestureAutoplay();
  });

  // ============ 核心：使用者第一次互動才允許播放 ============
  function armFirstGestureAutoplay() {
    if (startedOnce) return;

    const handler = async () => {
      startedOnce = true;
      remove();
      await safePlay();
    };

    const remove = () => {
      window.removeEventListener("pointerdown", handler);
      window.removeEventListener("touchstart", handler);
      window.removeEventListener("keydown", handler);
      window.removeEventListener("wheel", handler, { passive: true });
      window.removeEventListener("scroll", handler, { passive: true });
    };

    // ✅ 你要的：點一下 / 觸控 / 鍵盤 / 滾輪 / 滾動都算
    window.addEventListener("pointerdown", handler, { once: true });
    window.addEventListener("touchstart", handler, { once: true });
    window.addEventListener("keydown", handler, { once: true });
    window.addEventListener("wheel", handler, { passive: true, once: true });
    window.addEventListener("scroll", handler, { passive: true, once: true });
  }

  async function safePlay() {
    try {
      if (!enabled) return;
      await audio.play();
    } catch (err) {
      // 有些瀏覽器/狀況仍會擋，沒關係，下一次互動會再觸發
      startedOnce = false;
      armFirstGestureAutoplay();
    }
  }

  function safePause() {
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch (e) {}
  }
})();
