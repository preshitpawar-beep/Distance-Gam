"use client";

import { useState } from "react";

const EMOJIS = ["💙", "🌙", "✨", "📞"];

export default function MiniGameMemory({ onComplete }) {
  const cards = [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5);

  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);

  function flip(index) {
    if (flipped.length === 2) return;
    if (flipped.includes(index)) return;
    if (matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [i1, i2] = newFlipped;
      if (cards[i1] === cards[i2]) {
        setMatched([...matched, i1, i2]);
      }

      setTimeout(() => setFlipped([]), 800);
    }
  }

  const completed = matched.length === cards.length;

  return (
    <div style={card}>
      <h3 style={title}>Memory Match</h3>

      <div style={grid}>
        {cards.map((emoji, i) => {
          const isVisible =
            flipped.includes(i) || matched.includes(i);

          return (
            <button
              key={i}
              style={{
                ...cell,
                background: isVisible ? "#38bdf8" : "#020617"
              }}
              onClick={() => flip(i)}
            >
              {isVisible ? emoji : "?"}
            </button>
          );
        })}
      </div>

      {completed && (
        <button style={completeButton} onClick={onComplete}>
          Continue 💙
        </button>
      )}
    </div>
  );
}

/* ---------- STYLES ---------- */

const card = {
  width: "100%",
  maxWidth: "360px",
  background: "#020617",
  borderRadius: "22px",
  padding: "24px 20px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  textAlign: "center"
};

const title = {
  fontSize: "18px",
  marginBottom: "16px"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "10px",
  marginBottom: "18px"
};

const cell = {
  aspectRatio: "1 / 1",
  borderRadius: "12px",
  border: "1px solid #1e293b",
  fontSize: "20px",
  color: "#020617",
  cursor: "pointer"
};

const completeButton = {
  width: "100%",
  padding: "12px",
  borderRadius: "12px",
  border: "none",
  background: "#22c55e",
  color: "#020617",
  fontWeight: "600",
  cursor: "pointer"
};
