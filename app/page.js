"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main style={container}>
      <div style={card}>
        <h1 style={title}>💙 Miles Apart</h1>

        <p style={subtitle}>
          A playful 2-player game for couples,
          no matter how far apart you are.
        </p>

        <button style={button} onClick={() => router.push("/lobby")}>
          Start Together 🎮
        </button>

        <p style={hint}>
          Best experienced while on a call 📞
        </p>
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
  padding: "20px",
  background: "linear-gradient(180deg, #020617, #020617)"
};

const card = {
  width: "100%",
  maxWidth: "360px",
  background: "#020617",
  borderRadius: "22px",
  padding: "28px 22px",
  textAlign: "center",
  boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
};

const title = {
  fontSize: "34px",
  marginBottom: "10px",
  color: "white"
};

const subtitle = {
  fontSize: "15px",
  color: "#c7d2fe",
  marginBottom: "28px",
  lineHeight: "1.5"
};

const button = {
  width: "100%",
  padding: "16px",
  fontSize: "18px",
  borderRadius: "14px",
  border: "none",
  background: "#38bdf8",
  color: "#020617",
  fontWeight: "600",
  cursor: "pointer"
};

const hint = {
  marginTop: "18px",
  fontSize: "12px",
  color: "#94a3b8"
};
