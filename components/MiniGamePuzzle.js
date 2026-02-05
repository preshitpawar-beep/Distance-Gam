"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

const PUZZLES = [
  {
    text: "Pick the SAME symbol",
    options: ["⭐", "🔥", "🌙"]
  },
  {
    text: "Match again!",
    options: ["🍎", "🍌", "🍇"]
  }
];

export default function MiniGamePuzzle({ room, onComplete }) {
  const ref = doc(db, "rooms", room, "mini", "puzzle");

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const puzzle = PUZZLES[index];

  // Sync answers
  useEffect(() => {
    const unsub = onSnapshot(ref, snap => {
      if (!snap.exists()) return;
      setAnswers(snap.data().answers || {});
    });
    return () => unsub();
  }, []);

  // Show result only when both answered
  useEffect(() => {
    if (Object.keys(answers).length === 2) {
      setShowResult(true);
    }
  }, [answers]);

  async function choose(option) {
    await setDoc(
      ref,
      {
        answers: {
          ...answers,
          [crypto.randomUUID()]: option
        }
      },
      { merge: true }
    );
  }

  async function next() {
    if (index < PUZZLES.length - 1) {
      await setDoc(ref, { answers: {} }, { merge: true });
      setAnswers({});
      setShowResult(false);
      setIndex(i => i + 1);
    } else {
      // 🔥 PUZZLE COMPLETE
      await setDoc(ref, { answers: {} }, { merge: true });
      onComplete();
    }
  }

  const values = Object.values(answers);
  const matched =
    values.length === 2 && values[0] === values[1];

  return (
    <div style={card}>
      <h3 style={title}>Puzzle Match 🧩</h3>
      <p style={text}>{puzzle.text}</p>

      {!showResult && (
        <div style={grid}>
          {puzzle.options.map((opt, i) => (
            <button
              key={i}
              style={btn}
              onClick={() => choose(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {showResult && (
        <>
          <p style={result}>
            {matched ? "Puzzle solved 🔥" : "Mismatch 😄"}
          </p>
          <button style={continueBtn} onClick={next}>
            Continue ▶️
          </button>
        </>
      )}
    </div>
  );
}

/* ---------- STYLES ---------- */

const card = {
  maxWidth: 360,
  background: "#020617",
  padding: 24,
  borderRadius: 20,
  textAlign: "center"
};

const title = {
  fontSize: 18,
  marginBottom: 8
};

const text = {
  fontSize: 14,
  color: "#c7d2fe",
  marginBottom: 16
};

const grid = {
  display: "flex",
  justifyContent: "center",
  gap: 12
};

const btn = {
  padding: 18,
  fontSize: 20,
  borderRadius: 14,
  border: "none",
  background: "#38bdf8",
  cursor: "pointer"
};

const result = {
  fontSize: 16,
  marginBottom: 14,
  color: "#a5b4fc"
};

const continueBtn = {
  padding: "10px 18px",
  borderRadius: 14,
  border: "none",
  background: "#22c55e",
  fontWeight: 700,
  cursor: "pointer"
};
