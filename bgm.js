(() => {
  const audio = document.getElementById("bgm");
  const widget = document.getElementById("bgmWidget");
  const btn = document.getElementById("bgmBtn");
  const menu = document.getElementById("bgmMenu");
  const toggleBtn = document.getElementById("bgmToggle");
  const volumeSlider = document.getElementById("bgmVolume");

  if (!audio || !widget || !btn || !menu || !toggleBtn || !volumeSlider) return;

  // ====== 讀取偏好（跨頁記住） ======
  const savedVol = localStorage.getItem("bgmVolume");
  const savedState = localStorage.getItem("bgmState"); // "playing" | "paused"

  if (savedVol !== null) {
    const v = Math.max(0, Math.min(1, parseFloat(savedVol)));
    audio.volume = isNaN(v) ? 0.5 : v;
    volumeSlider.value = audio.volume;
  } else {
    audio.volume = 0.5;
    volumeSlider.value = 0.5;
  }

  // ====== UI 更新 ======
  function syncToggleText() {
    if (!audio.paused) {
      toggleBtn.textContent = "⏸ 暫停";
      localStorage.setItem("bgmState", "playing");
    } else {
      toggleBtn.textContent = "▶︎ 播放";
      localStorage.setItem("bgmState", "paused");
    }
  }

  // ====== 播放（可能被瀏覽器擋） ======
  async function tryPlay() {
    try {
      await audio.play();
      syncToggleText();
      return true;
    } catch (e) {
      // 需要使用者互動才可播放
      syncToggleText();
      return false;
    }
  }

  function pause() {
    audio.pause();
    syncToggleText();
  }

  // ====== 第一次互動觸發播放 ======
  let hasStartedOnce = localStorage.getItem("bgmStarted") === "1";

  async function onFirstGesture() {
    // 如果使用者希望是播放狀態，就在第一次互動試著播
    const wantPlaying = (localStorage.getItem("bgmState") || "playing") === "playing";

    if (wantPlaying) {
      const ok = await tryPlay();
      if (ok) {
        localStorage.setItem("bgmStarted", "1");
        hasStartedOnce = true;
      }
    }

    window.removeEventListener("click", onFirstGesture, { capture: true });
    window.removeEventListener("touchstart", onFirstGesture, { capture: true });
    window.removeEventListener("scroll", onFirstGesture, { capture: true });
    window.removeEventListener("keydown", onFirstGesture, { capture: true });
  }

  // 註冊「任意互動」
  window.addEventListener("click", onFirstGesture, { capture: true, passive: true });
  window.addEventListener("touchstart", onFirstGesture, { capture: true, passive: true });
  window.addEventListener("scroll", onFirstGesture, { capture: true, passive: true });
  window.addEventListener("keydown", onFirstGesture, { capture: true });

  // 若已經在上一頁互動過，這一頁先「嘗試」自動接上（成功就直接播；失敗就等互動）
  (async () => {
    const wantPlaying = (localStorage.getItem("bgmState") || "playing") === "playing";
    if (hasStartedOnce && wantPlaying) {
      await tryPlay();
    } else {
      syncToggleText();
    }
  })();

  // ====== 下拉選單開關 ======
  function closeMenu() {
    widget.classList.remove("open");
    menu.setAttribute("aria-hidden", "true");
  }

  function toggleMenu() {
    widget.classList.toggle("open");
    menu.setAttribute("aria-hidden", widget.classList.contains("open") ? "false" : "true");
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener("click", () => closeMenu());

  // ====== 播放/暫停按鈕 ======
  toggleBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    if (audio.paused) {
      const ok = await tryPlay();
      if (ok) {
        localStorage.setItem("bgmStarted", "1");
        hasStartedOnce = true;
      }
    } else {
      pause();
    }
  });

  // ====== 音量 ======
  volumeSlider.addEventListener("input", (e) => {
    const v = parseFloat(e.target.value);
    audio.volume = isNaN(v) ? 0.5 : v;
    localStorage.setItem("bgmVolume", String(audio.volume));
  });

  // 初始文字
  // 若使用者上次選擇 paused，就保持 paused
  if ((savedState || "playing") === "paused") {
    pause();
  } else {
    syncToggleText();
  }
})();
