// bgm.js —— 進站一次點擊，之後全站自動播放
(function () {
  const KEY_ALLOWED = "HDS_BGM_ALLOWED"; // 是否已授權播放
  const KEY_TIME = "HDS_BGM_TIME";       // 播放秒數
  const KEY_VOL = "HDS_BGM_VOL";
  const KEY_MUTED = "HDS_BGM_MUTED";

  const audio = new Audio("bgm.mp3");
  audio.loop = true;
  audio.preload = "auto";

  // === 讀取設定 ===
  audio.volume = Number(localStorage.getItem(KEY_VOL)) || 0.5;
  audio.muted = localStorage.getItem(KEY_MUTED) === "1";

  const savedTime = Number(localStorage.getItem(KEY_TIME));
  if (!Number.isNaN(savedTime)) {
    audio.currentTime = savedTime;
  }

  // 讓頁面控制 UI 可以抓
  window.__bgmAudio = audio;

  // === 嘗試自動播放（已授權的情況） ===
  function tryAutoPlay() {
    audio.play().catch(() => {
      // 若仍被擋，等下一次互動
    });
  }

  if (localStorage.getItem(KEY_ALLOWED) === "1") {
    // 曾經點過 → 直接嘗試自動播放
    window.addEventListener("load", tryAutoPlay);
  }

  // === 第一次互動授權播放 ===
  function firstInteraction() {
    localStorage.setItem(KEY_ALLOWED, "1");
    tryAutoPlay();

    window.removeEventListener("click", firstInteraction, true);
    window.removeEventListener("touchstart", firstInteraction, true);
    window.removeEventListener("keydown", firstInteraction, true);
    window.removeEventListener("wheel", firstInteraction, true);
  }

  window.addEventListener("click", firstInteraction, true);
  window.addEventListener("touchstart", firstInteraction, true);
  window.addEventListener("keydown", firstInteraction, true);
  window.addEventListener("wheel", firstInteraction, true);

  // === 記住狀態（切頁用） ===
  function saveState() {
    localStorage.setItem(KEY_TIME, audio.currentTime || 0);
    localStorage.setItem(KEY_VOL, audio.volume);
    localStorage.setItem(KEY_MUTED, audio.muted ? "1" : "0");
  }

  setInterval(saveState, 800);
  window.addEventListener("beforeunload", saveState);
})();
