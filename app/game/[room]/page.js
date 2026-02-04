"use client";

import { useEffect, useState } from "react";
import GameCanvas from "../../../components/GameCanvas";

export default function GameRoom({ params }) {
  const { room } = params;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const key = `ready-${room}`;
    const current = JSON.parse(localStorage.getItem(key) || "[]");

    if (!current.includes("player")) {
      current.push("player");
      localStorage.setItem(key, JSON.stringify(current));
    }
  }, [room]);

  function startGame() {
    setReady(true);
  }

  return (
    <main style={container}>
      {!ready ? (
        <>
          <h2>Room: {room}</h2>
          <p>Both players tap when ready</p>
          <button style={button} onClick={startGame}>
            I’m Ready ❤️
          </button>
        </>
      ) : (
        <GameCanvas />
      )}
    </main>
  );
}

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column"
};

const button = {
  padding: "14px 26px",
  fontSize: "18px",
  borderRadius: "10px",
  border: "none",
  background: "#2563eb",
  color: "white"
};
