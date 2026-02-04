"use client";

import { useEffect, useState } from "react";
import { saveChoice, getChoices, clearChoices } from "../lib/multiplayer";

const QUESTION = {
  text: "What would you rather do together right now?",
  options: [
    "Go on a late-night walk 🌙",
    "Watch something silly 😄",
    "Just talk for hours 💬"
  ]
};

export default function MiniGameChoice({ room, onComplete }) {
  const [status, setStatus] = useState("choose"); // choose | waiting | result
  const [matched, setMatched] = useState(false);

  function choose(option) {
    saveChoice(room, "choice-mini", option);
    setStatus("waiting");
  }

  useEffect(() => {
    if (status !== "waiting") return;

    const interval = setInterval(() => {
      const choices = getChoices(room, "choice-mini");

      if (choices.length === 2) {
        setMatched(choices[0] === choices[1]);
        clearChoices(room, "choice-mini");
        setStatus("result");
        clearInterval(interval);
      }
    }, 700);

    return () => clearInterval(interval);
  }, [status, room]);

  return (
    <div style={card}>
      <h3 style={title}>Same Page?</h3>
      <p style={question}>{QUESTION.text}</p>

      {status === "choose" && (
        <div style={options}>
          {QUESTION.options.map((opt, i) => (
            <button
              key={i}
              style={button}
              onClick={() => choose(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {status === "waiting" && (
        <p style={waiting}>Waiting for the other player…</p>
      )}

      {status === "result" && (
        <>
          <p style={result}>
            {matched
              ? "You both chose the same thing 💙"
              : "Different answers, still perfect together 😄"}
          </p>

          <button style={continueBtn} onClick={onComplete}>
            Continue
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
  marginBottom: "10px"
};

const question = {
  fontSize: "14px",
  color: "#c7d2fe",
  marginBottom: "18px",
  lineHeight: "1.5"
};

const options = {
  display: "flex",
  flexDirection: "column",
  gap: "12px"
};

const button = {
  padding: "14px",
  borderRadius: "14px",
  border: "none",
  background: "#38bdf8",
  color: "#020617",
  fontWeight: "600",
  cursor: "pointer"
};

const waiting = {
  fontSize: "14px",
  color: "#94a3b8"
};

const result = {
  fontSize: "16px",
  color: "#a5b4fc",
  marginBottom: "14px"
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
