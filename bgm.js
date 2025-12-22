(function () {
  const AUDIO_ID = "bgm";
  const SRC = "bgm.mp3";
  const VOLUME = 0.25; // 音量 0 ~ 1
  const KEY = "HDS_BGM_ALLOWED";

  let audio = document.getElementById(AUDIO_ID);
  if (!audio) {
    audio = document.createElement("audio");
    audio.id = AUDIO_ID;
    audio.src = SRC;
    audio.loop = true;
    audio.preload = "auto";
    audio.playsInline = true;
    document.body.appendChild(audio);
  }

  audio.volume = VOLUME;

  async function tryPlay() {
    try { await audio.play(); } catch (e) {}
  }

  // 如果之前已互動過，進頁就自動播
  if (localStorage.getItem(KEY) === "1") {
    tryPlay();
  }

  function unlock() {
    localStorage.setItem(KEY, "1");
    tryPlay();

    // 播放後就移除所有監聽（只要一次）
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("click", unlock);
    window.removeEventListener("touc
