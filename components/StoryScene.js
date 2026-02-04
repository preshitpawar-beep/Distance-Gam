"use client";

import { useState } from "react";
import { story } from "../lib/story";

export default function StoryScene() {
  const [index, setIndex] = useState(0);
  const scene = story[index];

  function choose(option) {
    // For now, just move forward
    if (index < story.length - 1) {
      setIndex(index + 1);
    } else {
      alert("✨ End of Chapter 1 ✨");
    }
  }

  return (
    <div style={card}>
      <h2>{scene.title}</h2>
      <p style={text}>{scene.text}</p>

      <div style={choices}>
        {scene.choices.map((c, i) => (
          <button key={i} style={button} onClick={() => choose(c)}>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

const card = {
  width: "90%",
  maxWidth: "360px",
  background: "#020617",
  color: "white",
  padding: "20px",
  borderRadius: "16px",
  textAlign: "center"
};

const text = {
  color: "#cbd5f5",
  marginBottom: "20px"
};

const choices = {
  display: "flex",
  flexDirection: "column",
  gap: "10px"
};

const button = {
  padding: "12px",
  fontSize: "16px",
  borderRadius: "10px",
  border: "none",
  background: "#2563eb",
  color: "white"
};
