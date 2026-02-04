"use client";

export default function GameCanvas({ room, names }) {
  return (
    <div style={outer}>
      {/* Top HUD */}
      <div style={header}>
        <div style={left}>
          <span style={gameTitle}>💙 Miles Apart</span>
          <span style={roomCode}>Room {room}</span>
        </div>

        {names && (
          <div style={right}>
            <span style={name}>{names.you}</span>
            <span style={heart}>💙</span>
            <span style={name}>{names.partner}</span>
          </div>
        )}
      </div>

      {/* Game Area */}
      <div style={gameArea}>
        <div style={placeholder}>
          <h3 style={placeholderTitle}>Adventure begins…</h3>
          <p style={placeholderText}>
            Your story will appear here very soon.
          </p>
        </div>
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

/* ---------- STYLES ---------- */

const outer = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  background: "#020617",
  color: "white"
};

const header = {
  padding: "14px 16px",
  borderBottom: "1px solid #1e293b",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const left = {
  display: "flex",
  flexDirection: "column"
};

const gameTitle = {
  fontSize: "16px",
  fontWeight: "600"
};

const roomCode = {
  fontSize: "11px",
  color: "#94a3b8"
};

const right = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "13px"
};

const name = {
  color: "#c7d2fe"
};

const heart = {
  fontSize: "14px"
};

const gameArea = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px"
};

const placeholder = {
  width: "100%",
  maxWidth: "360px",
  background: "#020617",
  borderRadius: "22px",
  padding: "28px 22px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  textAlign: "center"
};

const placeholderTitle = {
  fontSize: "20px",
  marginBottom: "10px"
};

const placeholderText = {
  fontSize: "14px",
  color: "#94a3b8"
};

const footer = {
  padding: "10px",
  borderTop: "1px solid #1e293b",
  textAlign: "center"
};

const footerText = {
  fontSize: "12px",
  color: "#64748b"
};
