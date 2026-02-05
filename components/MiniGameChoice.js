"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

export default function MiniGameChoice({ room, onComplete }) {
  const ref = doc(db, "rooms", room, "mini", "choice");
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const unsub = onSnapshot(ref, snap => {
      if (!snap.exists()) return;
      setAnswers(snap.data().answers || {});
    });
    return () => unsub();
  }, []);

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

  const values = Object.values(answers);
  const ready = values.length === 2;
  const matched = ready && values[0] === values[1];

  return (
    <div style={card}>
      <h3 style={title}>Same Choice 🎯</h3>
      <p style={text}>Try to pick the same option</p>

      {!ready && (
        <div style={options}>
          <button style={btn} onClick={() => choose("LEFT")}>
            LEFT ⬅️
          </button>
          <button style={btn} onClick={() => choose("RIGHT")}>
            RIGHT ➡️
          </button>
        </div>
      )}

      {ready && (
        <>
          <p style={result}>
            {matched ? "Perfect match 🔥" : "Not matched 😄"}
          </p>
          <button
            style={continueBtn}
            onClick={async () => {
              await setDoc(ref, { answers: {} }, { merge: true });
              onComplete();
            }}
          >
            Continue ▶️
          </button>
        </>
      )}
    </div>
  );
}

/* styles */
const card = { maxWidth: 360, padding: 24, background: "#020617", borderRadius: 20, textAlign: "center" };
const title = { fontSize: 18, marginBottom: 8 };
const text = { fontSize: 14, color: "#c7d2fe", marginBottom: 16 };
const options = { display: "flex", gap: 12, justifyContent: "center" };
const btn = { padding: 14, borderRadius: 14, background: "#38bdf8", border: "none", cursor: "pointer" };
const result = { marginBottom: 14, color: "#a5b4fc" };
const continueBtn = { padding: "10px 18px", borderRadius: 14, background: "#22c55e", border: "none", fontWeight: 700 };
