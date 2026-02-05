"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { STORY } from "../lib/storyData";

export default function StoryEngine({ room, onChapterComplete }) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [choices, setChoices] = useState({});
  const [showResult, setShowResult] = useState(false);

  const scene = STORY[sceneIndex];
  const ref = doc(db, "rooms", room, "story", String(sceneIndex));

  // Listen for real-time choices
  useEffect(() => {
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;
      setChoices(snap.data().choices || {});
    });
    return () => unsub();
  }, [sceneIndex]);

  // When both players have chosen → show result
  useEffect(() => {
    if (Object.keys(choices).length === 2) {
      setShowResult(true);
    }
  }, [choices]);

  async function choose(option) {
    await setDoc(
      ref,
      {
        choices: {
          ...choices,
          [crypto.randomUUID()]: option
        }
      },
      { merge: true }
    );
  }

  async function next() {
    // Clear this scene’s data
    await setDoc(ref, { choices: {} }, { merge: true });

    setShowResult(false);
    setChoices({});
    setSceneIndex(i => i + 1);

    // Notify GameFlow we finished one prompt
    if (onChapterComplete) {
      onChapterComplete();
    }
  }

  if (!scene) return null;

  const values = Object.values(choices);
  const matched =
    values.length === 2 && values[0] === values[1];

  return (
    <div style={card}>
      <h2 style={title}>{scene.title}</h2>
      <p style={text}>{scene.text}</p>

      {!showResult && (
        <div style={choicesBox}>
          {scene.choices.map((c, i) => (
            <button
              key={i}
              style={button}
              onClick={() => choose(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {showResult && (
        <>
          <p style={result}>
            {matched ? scene.match : scene.mismatch}
          </p>

          <button style={nextBtn} onClick={next}>
            Next ▶️
          </button>
        </>
      )}
    </div>
  );
}

/* ---------- STYLES ---------- */

const card = {
  width: "100%",
  maxWidth: 360,
  background: "#020617",
  borderRadius: 22,
  padding: "26px 22px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  textAlign: "center"
};

const title = {
  fontSize: 20,
  marginBottom: 12
};

const text = {
  fontSize: 14,
  color: "#c7d2fe",
  marginBottom: 22,
  lineHeight: "1.5"
};

const choicesBox = {
  display: "flex",
  flexDirection: "column",
  gap: 12
};

const button = {
  padding: 14,
  fontSize: 15,
  borderRadius: 14,
  border: "none",
  background: "#38bdf8",
  color: "#020617",
  fontWeight: 600,
  cursor: "pointer"
};

const result = {
  fontSize: 16,
  color: "#a5b4fc",
  marginBottom: 16
};

const nextBtn = {
  padding: "10px 18px",
  borderRadius: 14,
  border: "none",
  background: "#22c55e",
  color: "#020617",
  fontWeight: 700,
  cursor: "pointer"
};
