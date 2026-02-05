"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

const CARDS = ["🐶", "🐱", "🐶", "🐱"];

export default function MiniGameMemory({ room, onComplete }) {
  const ref = doc(db, "rooms", room, "mini", "memory");

  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  // Sync answers
  useEffect(() => {
    const unsub = onSnapshot(ref, snap => {
      if (!snap.exists()) return;
      setAnswers(snap.data().answers || {});
    });
    return () => unsub();
  }, []);

  // Show result when both picked
  useEffect(() => {
    if (Object.keys(answers).length === 2) {
      setShowResult(true);
    }
  }, [answers]);

  async function pick(card) {
    await setDoc(
      ref,
      {
        answers: {
          ...answers,
          [crypto.randomUUID()]: card
        }
      },
      { merge: true }
    );
  }

  async function finish() {
    await setDoc(ref, { answers: {} }, { merge: true });
    onComplete();
  }

  const values = Object.values(answers);
  const matched =
    values.length === 2 && values[0] === values[1];

  return (
    <div style={card}>
      <h3 style={title}>Memory Match 🧠</h3>
      <p style={text}>Pick the same card</p>

      {!showResult && (
        <div style={grid}>
          {CARDS.map((c, i) => (
            <button
              key={i}
              style={btn}
              onClick={() => pick(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {showResult && (
        <>
          <p style={result}>
            {matched ? "Memory synced 🔥" : "Different picks 😄"}
          </p>
          <button style={continueBtn} onClick={finish}>
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
  gap: 12,
  flexWrap: "wrap"
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
