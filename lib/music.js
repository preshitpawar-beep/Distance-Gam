let audio = null;

export function playMusic() {
  if (!audio) {
    audio = new Audio("/music/calm.mp3");
    audio.loop = true;
    audio.volume = 0.25;
  }
  audio.play().catch(() => {});
}

export function stopMusic() {
  if (audio) audio.pause();
}
