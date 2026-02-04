"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Lobby() {
  const router = useRouter();

  const [yourName, setYourName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  function createRoom() {
    if (!yourName || !partnerName) {
      alert("Please enter both names 💙");
      return;
    }

    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    saveNames(code);
    router.push(`/game/${code}`);
  }

  function joinRoom() {
    if (!yourName || !partnerName || !roomCode) {
      alert("Please fill everything 💙");
      return;
    }

    saveNames(roomCode);
    router.push(`/game/${roomCode}`);
  }

  function saveNames(code) {
    localStorage.setItem(
      `names-${code}`,
      JSON.stringify({
        you: yourName,
        partner: partnerName
      })
    );
  }

  return (
    <main style={container}>
      <div style={card}>
        <h2 style={title}>Who’s Playing?</h2>

        <input
          style={input}
          placeholder="Your name"
          value={yourName}
          onChange={(e) => setYourName(e.target.value)}
        />

        <input
          style={input}
          placeholder="Partner’s name"
          value={partnerName}
          onChange={(e) => setPartnerName(e.target.value)}
        />

        <button style={primaryButton} onClick={createRoom}>
          Create Room 💙
        </button>

        <div style={divider}>— or —</div>

        <input
          style={input}
          placeholder="Enter room code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
        />

        <button style={secondaryButton} onClick={joinRoom}>
          Join Room
        </button>
      </div>
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
  marginBottom: "20px"
};

const input = {
  width: "100%",
  padding: "14px",
  marginBottom: "14px",
  fontSize: "16px",
  borderRadius: "12px",
  border: "1px solid #1e293b",
  background: "#020617",
  color: "white"
};

const primaryButton = {
  width: "100%",
  padding: "14px",
  fontSize: "16px",
  borderRadius: "12px",
  border: "none",
  background: "#38bdf8",
  color: "#020617",
  fontWeight: "600",
  marginBottom: "14px",
  cursor: "pointer"
};

const secondaryButton = {
  width: "100%",
  padding: "14px",
  fontSize: "16px",
  borderRadius: "12px",
  border: "1px solid #334155",
  background: "#020617",
  color: "#e5e7eb",
  cursor: "pointer"
};

const divider = {
  color: "#94a3b8",
  fontSize: "13px",
  margin: "10px 0"
};
