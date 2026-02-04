"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Lobby() {
  const [room, setRoom] = useState("");
  const router = useRouter();

  function createRoom() {
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    router.push(`/game/${code}`);
  }

  function joinRoom() {
    if (!room) return;
    router.push(`/game/${room}`);
  }

  return (
    <main style={container}>
      <h2>Room Lobby</h2>

      <button style={button} onClick={createRoom}>
        Create Room
      </button>

      <input
        placeholder="Enter Room Code"
        value={room}
        onChange={(e) => setRoom(e.target.value.toUpperCase())}
        style={input}
      />

      <button style={button} onClick={joinRoom}>
        Join Room
      </button>
    </main>
  );
}

const container = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "15px"
};

const button = {
  padding: "12px 20px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "none",
  background: "#16a34a",
  color: "white"
};

const input = {
  padding: "10px",
  fontSize: "16px",
  textAlign: "center"
};
