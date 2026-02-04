"use client";

import { useEffect, useState } from "react";

export default function MiniGameTap({ onComplete }) {
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!started || finished) return;

    if (timeLeft === 0) {
      setFinished(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [started, timeLeft, finished]);

  function startGame() {
    setStarted(true);
    setCount(0);
    setTimeLeft(5);
    setFinished(false);
  }

  function tap() {
    if (!started || finished) return;
    setCount((c) => c + 1);
  }

  return (
    <div style={card}>
      <h3 style={title}>Rapid Tap!</h3>

      {!started && (
        <>
          <p style={info}>
            Tap the button as fast as you can for 5 seconds!
          </p>
          <button style={startBtn} onClick={startGame}>
            Start ⏱️
          </button>
        </>
      )}

      {started && !finished && (
        <>
          <p style={timer}>Time left: {timeLeft}s</p>
          <button style={tapBtn} onClick={tap}>
            TAP!
          </button>
          <p style={countText}>Taps: {count}</p>
        </>
      )}

      {finished && (
        <>
          <p style={result}>
            That was intense 😄  
            You tapped {count} times!
          </p>
          <button style={continueBtn} onClick={onComplete}>
            Continue 💙
          </button>
        </>
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
  marginBottom: "12px"
};

const info = {
  fontSize: "14px",
  color: "#c7d2fe",
  marginBottom: "16px"
};

const startBtn = {
  width: "100%",
  padding: "14px",
  borderRadius: "14px",
  border: "none",
  background: "#38bdf8",
  color: "#020617",
  fontWeight: "600",
  cursor: "pointer"
};

const timer = {
  fontSize: "16px",
  marginBottom: "12px"
};

const tapBtn = {
  width: "100%",
  padding: "20px",
  fontSize: "20px",
  borderRadius: "18px",
  border: "none",
  background: "#22c55e",
  color: "#020617",
  fontWeight: "700",
  cursor: "pointer",
  marginBottom: "12px"
};

const countText = {
  fontSize: "14px",
  color: "#94a3b8"
};

const result = {
  fontSize: "15px",
  color: "#a5b4fc",
  marginBottom: "14px",
  lineHeight: "1.5"
};

const continueBtn = {
  width: "100%",
  padding: "12px",
  borderRadius: "12px",
  border: "none",
  background: "#22c55e",
  color: "#020617",
  fontWeight: "600",
  cursor: "pointer"
};
