export function saveChoice(room, sceneId, choice) {
  const key = `room-${room}-scene-${sceneId}`;
  const existing = JSON.parse(localStorage.getItem(key) || "[]");

  // Prevent duplicate submissions from same device
  if (existing.length < 2) {
    existing.push(choice);
    localStorage.setItem(key, JSON.stringify(existing));
  }
}

export function getChoices(room, sceneId) {
  const key = `room-${room}-scene-${sceneId}`;
  return JSON.parse(localStorage.getItem(key) || "[]");
}

export function clearChoices(room, sceneId) {
  const key = `room-${room}-scene-${sceneId}`;
  localStorage.removeItem(key);
}
