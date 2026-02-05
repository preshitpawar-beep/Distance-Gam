"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  doc,
  onSnapshot,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { STORY } from "../lib/storyData";

export default function StoryEngine({ room, onChapterComplete }) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [choices, setChoices] = useState({});
  const [status, setStatus] = useState("choose"); 
  // choose | result

  const scene = STORY[sceneIndex];
  const ref = doc(db, "rooms", room, "story", String(sceneIndex));

  // 🔥 Listen for real-time choices
  useEffect(() => {
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setChoices(data.choices || {});
      }
    });

    return () => unsub();
  }, [sceneIndex]);

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

  useEffect(() => {
    const values = Object.values(choices);
    if (values.length === 2) {
      setStatus("result");

      const timeout = setTimeout(async () => {
        setStatus("choose");
        setChoices({});
        setSceneIndex((i) => i + 1);

        if (onChapterComplete) {
          onChapterComplete();
        }
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [choices]);

  if (!scene) {
    return null;
  }

  const values = Object.values(choices);
  const matched =
    values.length === 2 && values[0] === values[1];

  return (
    <div style={card}>
      <h2 style={title}>{scene.title}</h2>
      <p style={text}>{scene.text}</p>

      {status === "choose" && (
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

      {status === "result" && (
        <p style={result}>
          {matched ? scene.match : scene.mismatch}
        </p>
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
  padding: "26px 22px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  textAlign: "center"
};

const title = {
  fontSize: "20px",
  marginBottom: "12px"
};

const text = {
  fontSize: "14px",
  color: "#c7d2fe",
  marginBottom: "22px",
  lineHeight: "1.5"
};

const choicesBox = {
  display: "flex",
  flexDirection: "column",
  gap: "12px"
};

const button = {
  padding: "14px",
  fontSize: "15px",
  borderRadius: "14px",
  border: "none",
  background: "#38bdf8",
  color: "#020617",
  fontWeight: "600",
  cursor: "pointer"
};

const result = {
  fontSize: "16px",
  color: "#a5b4fc",
  marginTop: "10px"
};
