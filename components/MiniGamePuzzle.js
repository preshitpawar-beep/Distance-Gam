"use client";

import { useState } from "react";

const SEQUENCE = ["💙", "🌙", "✨"];

export default function MiniGamePuzzle({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);

  function press(symbol) {
    if (symbol === SEQUENCE[progress]) {
      setProgress((p) => p + 1);
      setError(false);
    } else {
      setError(true);
      setProgress(0);
    }
  }

  const completed = progress === SEQUENCE.length;

  return (
    <div style={card}>
      <h3 style={title}>Together Puzzle</h3>

      <p style={instruction}>
        Tap the symbols together in the correct order.
      </p>

      <div style={sequence}>
        {SEQUENCE.map((s, i) => (
          <span
            key={i}
            style={{
              ...seqItem,
              opacity: i < progress ? 1 : 0.3
            }}
          >
            {s}
          </span>
        ))}
      </div>

      <div style={buttons}>
        {SEQUENCE.map((s, i) => (
          <button
            key={i}
            style={button}
            onClick={() => press(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {error && (
        <p style={errorText}>
          Oops 😄 Try again — talk it through!
        </p>
      )}

      {completed && (
        <button style={completeBtn} onClick={onComplete}>
          Puzzle Solved 💙
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
  marginBottom: "10px"
};

const instruction = {
  fontSize: "14px",
  color: "#c7d2fe",
  marginBottom: "14px"
};

const sequence = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  marginBottom: "16px"
};

const seqItem = {
  fontSize: "20px"
};

const buttons = {
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  marginBottom: "14px"
};

const button = {
  padding: "14px",
  borderRadius: "14px",
  border: "none",
  background: "#38bdf8",
  color: "#020617",
  fontSize: "18px",
  cursor: "pointer"
};

const errorText = {
  fontSize: "13px",
  color: "#fca5a5",
  marginBottom: "10px"
};

const completeBtn = {
  width: "100%",
  padding: "12px",
  borderRadius: "12px",
  border: "none",
  background: "#22c55e",
  color: "#020617",
  fontWeight: "600",
  cursor: "pointer"
};
