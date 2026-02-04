export function saveChoice(room, sceneId, choice) {
  const key = `room-${room}-scene-${sceneId}`;
  const data = JSON.parse(localStorage.getItem(key) || "[]");

  data.push(choice);
  localStorage.setItem(key, JSON.stringify(data));
}

export function getChoices(room, sceneId) {
  const key = `room-${room}-scene-${sceneId}`;
  return JSON.parse(localStorage.getItem(key) || "[]");
}

export function clearChoices(room, sceneId) {
  const key = `room-${room}-scene-${sceneId}`;
  localStorage.removeItem(key);
}
