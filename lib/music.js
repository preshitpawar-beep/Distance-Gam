let audio = null;
let enabled = false;

export function startMusic() {
  if (!audio) {
    audio = new Audio("/music/calm.mp3");
    audio.loop = true;
    audio.volume = 0.25;
  }

  enabled = true;
  audio.play().catch(() => {
    // Autoplay may be blocked until user interaction
  });
}

export function toggleMusic() {
  if (!audio) return;

  if (enabled) {
    audio.pause();
    enabled = false;
  } else {
    audio.play().catch(() => {});
    enabled = true;
  }
}

export function isMusicOn() {
  return enabled;
}
