"use client";

import { useState } from "react";
import StoryEngine from "./StoryEngine";
import MiniGameMemory from "./MiniGameMemory";
import MiniGameChoice from "./MiniGameChoice";
import MiniGameTap from "./MiniGameTap";
import MiniGamePuzzle from "./MiniGamePuzzle";
import { markCompleted, hasCompleted } from "../lib/replay";

export default function GameFlow({ room }) {
  const [stage, setStage] = useState("story");
  const [miniIndex, setMiniIndex] = useState(0);
  const [storyDone, setStoryDone] = useState(false);

  const miniGames = [
    <MiniGameMemory onComplete={nextMini} />,
    <MiniGameChoice room={room} onComplete={nextMini} />,
    <MiniGameTap onComplete={nextMini} />,
    <MiniGamePuzzle onComplete={nextMini} />
  ];

  function nextMini() {
    if (miniIndex < miniGames.length - 1) {
      setMiniIndex((i) => i + 1);
      setStage("story");
    } else {
      setStoryDone(true);
    }
  }

  if (storyDone) {
    const replay = hasCompleted(room);
    markCompleted(room);

    return (
      <div style={card}>
        <h2 style={title}>💙 Together at Last</h2>

        <p style={text}>
          No matter the distance, every moment you shared
          brought you closer.
        </p>

        {replay ? (
          <p style={text}>
            You came back and played it again.
            That says more than the game ever could 💫
          </p>
        ) : (
          <p style={text}>
            This journey was only possible because
            you played it together.
          </p>
        )}

        <p style={ending}>✨ The End ✨</p>
      </div>
    );
  }

  return stage === "story" ? (
    <StoryEngine
      room={room}
      onChapterComplete={() => setStage("mini")}
    />
  ) : (
    miniGames[miniIndex]
  );
}

/* ---------- STYLES ---------- */

const card = {
  width: "100%",
  maxWidth: "360px",
  background: "#020617",
  borderRadius: "22px",
  padding: "28px 22px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  textAlign: "center"
};

const title = {
  fontSize: "22px",
  marginBottom: "14px"
};

const text = {
  fontSize: "14px",
  color: "#c7d2fe",
  marginBottom: "12px",
  lineHeight: "1.5"
};

const ending = {
  marginTop: "18px",
  fontSize: "16px",
  color: "#a5b4fc"
};
