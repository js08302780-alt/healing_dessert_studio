// bgm.js
(function () {
  const audio = new Audio("bgm.mp3");
  audio.loop = true;
  audio.volume = 0.5;

  // 給 index.html 的控制面板使用
  window.__bgmAudio = audio;

  let started = false;

  function startOnce() {
    if (started) return;
    started = true;

    audio.play().catch(() => {
      // 某些瀏覽器可能仍要求「點擊」才行，沒關係，後面再互動一次會觸發
      started = false;
    });

    // 移除監聽（只要一次互動）
    window.removeEventListener("click", startOnce, true);
    window.removeEventListener("touchstart", startOnce, true);
    window.removeEventListener("keydown", startOnce, true);
    window.removeEventListener("wheel", startOnce, true);
  }

  // ✅ 任意互動就觸發（含你說的滑鼠滾一下 wheel）
  window.addEventListener("click", startOnce, true);
  window.addEventListener("touchstart", startOnce, true);
  window.addEventListener("keydown", startOnce, true);
  window.addEventListener("wheel", startOnce, true);
})();
