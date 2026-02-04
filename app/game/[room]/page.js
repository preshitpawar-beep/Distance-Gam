"use client";

import { useEffect, useState } from "react";

export default function GameRoom({ params }) {
  const { room } = params;
  const [players, setPlayers] = useState(1);

  useEffect(() => {
    const key = `room-${room}`;

    const current = JSON.parse(localStorage.getItem(key) || "[]");

    if (!current.includes("player")) {
      current.push("player");
      localStorage.setItem(key, JSON.stringify(current));
    }

    setPlayers(current.length);
  }, [room]);

  return (
    <main style={container}>
      <h2>Room Code: {room}</h2>
      <p>Players in room: {players} / 2</p>

      {players < 2 ? (
        <p style={{ color: "#888" }}>
          Waiting for second player…
        </p>
      ) : (
        <button style={button}>
          Start Game 🎮
        </button>
      )}
    </main>
  );
}

const container = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "sans-serif",
  gap: "15px"
};

const button = {
  padding: "14px 24px",
  fontSize: "18px",
  borderRadius: "10px",
  border: "none",
  background: "#dc2626",
  color: "white"
};
