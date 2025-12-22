// bgm.js
(function () {
  /* =====================
     音樂本體（你原本的）
  ===================== */
  const audio = new Audio("bgm.mp3");
  audio.loop = true;
  audio.volume = 0.5;

  // 給 HTML UI 使用
  window.__bgmAudio = audio;

  let started = false;

  function startOnce() {
    if (started) return;
    started = true;

    audio.play().catch(() => {
      started = false;
    });

    window.removeEventListener("click", startOnce, true);
    window.removeEventListener("touchstart", startOnce, true);
    window.removeEventListener("keydown", startOnce, true);
    window.removeEventListener("wheel", startOnce, true);
  }

  // 第一次互動就嘗試播放
  window.addEventListener("click", startOnce, true);
  window.addEventListener("touchstart", startOnce, true);
  window.addEventListener("keydown", startOnce, true);
  window.addEventListener("wheel", startOnce, true);

  /* =====================
     🔽 UI 控制（你原本沒有的）
  ===================== */
  document.addEventListener("DOMContentLoaded", () => {
    const widget = document.getElementById("bgmWidget");
    const btn = document.getElementById("bgmBtn");
    const menu = document.getElementById("bgmMenu");
    const toggleBtn = document.getElementById("bgmToggle");
    const muteBtn = document.getElementById("bgmMute");
    const volume = document.getElementById("bgmVolume");

    // 若這頁沒有音樂 UI（例如某些子頁），直接略過
    if (!widget || !btn || !menu) return;

    /* 開 / 關選單 */
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      widget.classList.toggle("open");
    });

    document.addEventListener("click", () => {
      widget.classList.remove("open");
    });

    /* 播放 / 暫停 */
    if (toggleBtn) {
      toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (audio.paused) {
          audio.play().catch(() => {});
        } else {
          audio.pause();
        }
        updateUI();
      });
    }

    /* 靜音 */
    if (muteBtn) {
      muteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        audio.muted = !audio.muted;
        updateUI();
      });
    }

    /* 音量 */
    if (volume) {
      volume.addEventListener("input", () => {
        audio.volume = Number(volume.value);
        audio.muted = audio.volume === 0;
      });
    }

    function updateUI() {
      if (toggleBtn) {
        toggleBtn.textContent = audio.paused ? "▶️ 播放" : "⏸ 暫停";
      }
      if (muteBtn) {
        muteBtn.textContent = audio.muted ? "🔈 取消靜音" : "🔇 靜音";
      }
      if (volume) {
        volume.value = audio.volume;
      }
    }

    updateUI();
  });
})();
