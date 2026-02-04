"use client";

import StoryScene from "./StoryScene";

export default function GameCanvas({ room }) {
  return (
    <div style={outer}>
      {/* Top HUD */}
      <div style={header}>
        <span style={title}>💙 Miles Apart</span>
        <span style={roomCode}>Room: {room}</span>
      </div>

      {/* Game Area */}
      <div style={gameArea}>
        <StoryScene room={room} />
      </div>

      {/* Footer */}
      <div style={footer}>
        <span style={footerText}>
          Two players • One journey
        </span>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const outer = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  background: "linear-gradient(180deg, #020617, #020617)",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont"
};

const header = {
  padding: "14px 18px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "white",
  borderBottom: "1px solid #1e293b"
};

const title = {
  fontSize: "18px",
  fontWeight: "600"
};

const roomCode = {
  fontSize: "13px",
  color: "#94a3b8"
};

const gameArea = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px"
};

const footer = {
  padding: "10px",
  textAlign: "center",
  borderTop: "1px solid #1e293b"
};

const footerText = {
  fontSize: "12px",
  color: "#64748b"
};
