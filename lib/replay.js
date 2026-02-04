export function markCompleted(room) {
  localStorage.setItem(`completed-${room}`, "yes");
}

export function hasCompleted(room) {
  return localStorage.getItem(`completed-${room}`) === "yes";
}
