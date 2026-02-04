"use client";

import { useEffect, useState } from "react";
import { STORY } from "../lib/storyData";
import {
  saveChoice,
  getChoices,
  clearChoices
} from "../lib/multiplayer";

export default function StoryEngine({ room }) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [status, setStatus] = useState("choose"); // choose | waiting | result

  const scene = STORY[sceneIndex];

  function handleChoice(choice) {
    saveChoice(room, scene.id, choice);
    setStatus("waiting");
  }

  useEffect(() => {
    if (status !== "waiting") return;

    const interval = setInterval(() => {
      const choices = getChoices(room, scene.id);

      if (choices.length === 2) {
        clearInterval(interval);
        setStatus("result");
      }
    }, 800);

    return () => clearInterval(interval);
  }, [status, room, scene]);

  useEffect(() => {
    if (status !== "result") return;

    const timeout = setTimeout(() => {
      clearChoices(room, scene.id);
      setStatus("choose");
      setSceneIndex((prev) => prev + 1);
    }, 2500);

    return () => clearTimeout(timeout);
  }, [status, room, scene]);

  if (!scene) {
    return (
      <div style={card}>
        <h2 style={title}>✨ Journey Complete ✨</h2>
        <p style={text}>
          You made it through every moment together.
        </p>
      </div>
    );
  }

  const choices = getChoices(room, scene.id);
  const matched =
    choices.length === 2 && choices[0] === choices[1];

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
              onClick={() => handleChoice(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {status === "waiting" && (
        <p style={waiting}>Waiting for the other player…</p>
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

const waiting = {
  fontSize: "14px",
  color: "#94a3b8"
};

const result = {
  fontSize: "16px",
  color: "#a5b4fc",
  marginTop: "10px"
};
