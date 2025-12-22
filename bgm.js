// bgm.js
(function () {
  const KEY_ENABLED = "bgm_enabled";   // 是否要播放（使用者按過播放）
  const KEY_TIME = "bgm_time";         // 記住播放秒數
  const KEY_VOL = "bgm_volume";        // 音量
  const KEY_MUTED = "bgm_muted";       // 靜音

  const audio = new Audio("bgm.mp3");
  audio.loop = true;

  // 讀取設定
  const savedVol = localStorage.getItem(KEY_VOL);
  const savedMuted = localStorage.getItem(KEY_MUTED);
  const savedTime = localStorage.getItem(KEY_TIME);

  audio.volume = savedVol !== null ? Number(savedVol) : 0.5;
  audio.muted = savedMuted === "1";

  if (savedTime !== null && !Number.isNaN(Number(savedTime))) {
    audio.currentTime = Math.max(0, Number(savedTime));
  }

  // 讓頁面上的控制面板可以抓到
  window.__bgmAudio = audio;

  // ---------- UI 控制（如果頁面有放浮標） ----------
  const btn = document.getElementById("bgmBtn");
  const menu = document.getElementById("bgmMenu");
  const toggleBtn = document.getElementById("bgmToggle");
  const muteBtn = document.getElementById("bgmMute");
  const vol = document.getElementById("bgmVolume");

  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", String(!open));
  }

  function refreshUI() {
    if (toggleBtn) toggleBtn.textContent = audio.paused ? "▶️ 播放" : "⏸ 暫停";
    if (muteBtn) muteBtn.textContent = audio.muted ? "🔈 取消靜音" : "🔇 靜音";
    if (vol) vol.value = String(audio.volume);
  }

  if (btn && menu) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      setMenu(!menu.classList.contains("open"));
    });
    document.addEventListener("click", () => setMenu(false));
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (audio.paused) {
        localStorage.setItem(KEY_ENABLED, "1");
        audio.play().catch(() => {});
      } else {
        localStorage.setItem(KEY_ENABLED, "0");
        audio.pause();
      }
      refreshUI();
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      audio.muted = !audio.muted;
      localStorage.setItem(KEY_MUTED, audio.muted ? "1" : "0");
      refreshUI();
    });
  }

  if (vol) {
    vol.addEventListener("input", () => {
      audio.volume = Number(vol.value);
      localStorage.setItem(KEY_VOL, String(audio.volume));
      if (audio.volume === 0) {
        audio.muted = true;
        localStorage.setItem(KEY_MUTED, "1");
      }
      refreshUI();
    });
  }

  // ---------- 記住播放秒數（切頁接續用） ----------
  function saveTime() {
    try { localStorage.setItem(KEY_TIME, String(audio.currentTime || 0)); } catch (e) {}
  }
  setInterval(saveTime, 700);
  window.addEventListener("beforeunload", saveTime);

  // ---------- 自動接續播放（盡量不中斷） ----------
  // 如果使用者之前按過「播放」，下一頁就會嘗試自動播放；
  // 若瀏覽器仍要求互動，就等下一次點/觸控/滾動再啟動
  let started = false;

  function tryPlay() {
    if (started) return;
    started = true;

    audio.play().then(() => {
      refreshUI();
    }).catch(() => {
      started = false; // 被擋就再等下一次互動
    });
  }

  // 如果之前是「播放狀態」，直接嘗試一次
  const enabled = localStorage.getItem(KEY_ENABLED) === "1";
  if (enabled) {
    // 先嘗試在 load 後播放（有些瀏覽器在同站點互動後會放行）
    window.addEventListener("load", () => {
      tryPlay();
      refreshUI();
    });
  } else {
    refreshUI();
  }

  // ✅ 任意互動啟動（含你說的滾動）
  function startOnGesture() {
    if (localStorage.getItem(KEY_ENABLED) !== "1") return; // 使用者沒按播放就不強制
    tryPlay();
  }

  window.addEventListener("click", startOnGesture, true);
  window.addEventListener("touchstart", startOnGesture, true);
  window.addEventListener("keydown", startOnGesture, true);
  window.addEventListener("wheel", startOnGesture, true);
})();
