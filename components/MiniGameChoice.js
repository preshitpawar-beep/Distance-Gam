"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

const QUESTIONS = [
  {
    text: "Pick the same option!",
    options: ["🔥 Fire", "🌊 Water"]
  },
  {
    text: "Try to match!",
    options: ["🍕 Pizza", "🍔 Burger"]
  },
  {
    text: "Telepathy test!",
    options: ["😎 Cool", "🤪 Crazy"]
  }
];

export default function MiniGameChoice({ room, onComplete }) {
  const roomRef = doc(db, "rooms", room, "mini", "choice");

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const question = QUESTIONS[index];

  // Sync answers in real time
  useEffect(() => {
    const unsub = onSnapshot(roomRef, snap => {
      if (!snap.exists()) return;
      setAnswers(snap.data().answers || {});
    });
    return () => unsub();
  }, []);

  // Show result when both answered
  useEffect(() => {
    if (Object.keys(answers).length === 2) {
      setShowResult(true);
    }
  }, [answers]);

  async function choose(option) {
    await setDoc(
      roomRef,
      {
        answers: {
          ...answers,
          [crypto.randomUUID()]: option
        }
      },
      { merge: true }
    );
  }

  async function nextQuestion() {
    if (index < QUESTIONS.length - 1) {
      // Move to next question
      await setDoc(roomRef, { answers: {} }, { merge: true });
      setAnswers({});
      setShowResult(false);
      setIndex(i => i + 1);
    } else {
      // 🔥 GAME COMPLETE → MOVE ON
      await setDoc(roomRef, { answers: {} }, { merge: true });
      onComplete();
    }
  }

  const values = Object.values(answers);
  const matched =
    values.length === 2 && values[0] === values[1];

  return (
    <div style={card}>
      <h3 style={title}>Same Choice 🎯</h3>
      <p style={text}>{question.text}</p>

      {!showResult && (
        <div style={options}>
          {question.options.map((opt, i) => (
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
            {matched ? "Perfect match 🔥" : "Not this time 😄"}
          </p>

          <button style={continueBtn} onClick={nextQuestion}>
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

const options = {
  display: "flex",
  flexDirection: "column",
  gap: 12
};

const btn = {
  padding: 14,
  borderRadius: 14,
  border: "none",
  background: "#38bdf8",
  fontWeight: 600,
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
