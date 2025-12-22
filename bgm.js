document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("bgm");
  if (!audio) return;

  audio.volume = 0.25; // 音量可調 0 ~ 1

  function startBGM() {
    audio.play().catch(() => {});
    document.removeEventListener("click", startBGM);
  }

  // 使用者第一次點擊才播放（最穩）
  document.addEventListener("click", startBGM);
});
