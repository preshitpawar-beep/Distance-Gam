"use client";

import { startMusic } from "../../../lib/music";
import { useEffect, useState } from "react";
import GameCanvas from "../../../components/GameCanvas";

export default function GameRoom({ params }) {
  const { room } = params;

  const [names, setNames] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`names-${room}`);
    if (stored) {
      setNames(JSON.parse(stored));
    }
  }, [room]);

  return (
    <main style={container}>
      {!ready ? (
        <div style={card}>
          <h2 style={title}>Room {room}</h2>

          {names && (
            <p style={namesText}>
              {names.you} 💙 {names.partner}
            </p>
          )}

          <p style={info}>
            Both players should open this room
            on their phones.
          </p>

          <button
            style={button}
            onClick={() => {
             startMusic();
             setReady(true);
           }}
  >
  I’m Ready ❤️
          </button>
        </div>
      ) : (
        <GameCanvas room={room} names={names} />
      )}
    </main>
  );
}

/* ---------- STYLES ---------- */

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px"
};

const card = {
  width: "100%",
  maxWidth: "360px",
  background: "#020617",
  borderRadius: "22px",
  padding: "26px 22px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  textAlign: "center"
};

const title = {
  color: "white",
  fontSize: "22px",
  marginBottom: "10px"
};

const namesText = {
  color: "#a5b4fc",
  fontSize: "14px",
  marginBottom: "14px"
};

const info = {
  fontSize: "14px",
  color: "#94a3b8",
  marginBottom: "20px",
  lineHeight: "1.5"
};

const button = {
  width: "100%",
  padding: "14px",
  fontSize: "16px",
  borderRadius: "12px",
  border: "none",
  background: "#22c55e",
  color: "#020617",
  fontWeight: "600",
  cursor: "pointer"
};
