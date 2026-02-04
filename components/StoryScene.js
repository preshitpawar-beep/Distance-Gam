"use client";

import { useState, useEffect } from "react";
import { story } from "../lib/story";
import { saveChoice, getChoices, clearChoices } from "../lib/multiplayer";

export default function StoryScene({ room }) {
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState(null);

  const scene = story[index];

  function choose(option) {
    saveChoice(room, scene.id, option);
    checkResult();
  }

  function checkResult() {
    const choices = getChoices(room, scene.id);

    if (choices.length < 2) {
      setResult("Waiting for the other player…");
      return;
    }

    if (choices[0] === choices[1]) {
      setResult(scene.match);
    } else {
      setResult(scene.mismatch);
    }

    setTimeout(() => {
      clearChoices(room, scene.id);
      setResult(null);
      setIndex(index + 1);
    }, 2500);
  }

  if (!scene) {
    return (
      <div style={card}>
        <h2>✨ End of Chapter 1 ✨</h2>
        <p>You finished this journey together.</p>
      </div>
    );
  }

  return (
    <div style={card}>
      <h2>{scene.title}</h2>
      <p style={text}>{scene.text}</p>

      {!result ? (
        <div style={choices}>
          {scene.choices.map((c, i) => (
            <button key={i} style={button} onClick={() => choose(c)}>
              {c}
            </button>
          ))}
        </div>
      ) : (
        <p style={resultStyle}>{result}</p>
      )}
    </div>
  );
}

const card = {
  width: "90%",
  maxWidth: "360px",
  background: "#020617",
  color: "white",
  padding: "22px",
  borderRadius: "18px",
  textAlign: "center"
};

const text = {
  color: "#cbd5f5",
  marginBottom: "20px"
};

const choices = {
  display: "flex",
  flexDirection: "column",
  gap: "12px"
};

const button = {
  padding: "14px",
  fontSize: "16px",
  borderRadius: "12px",
  border: "none",
  background: "#2563eb",
  color: "white"
};

const resultStyle = {
  marginTop: "20px",
  fontSize: "18px",
  color: "#a5b4fc"
};
