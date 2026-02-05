"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

import StoryEngine from "./StoryEngine";
import MiniGameChoice from "./MiniGameChoice";
import MiniGameTap from "./MiniGameTap";
import MiniGamePuzzle from "./MiniGamePuzzle";
import MiniGameMemory from "./MiniGameMemory";
import { STORY } from "../lib/storyData";

/*
  ================================
  GAME DESIGN (FINAL & STABLE)
  ================================

  - Questions NEVER repeat in one run
  - All mini-games appear in a fixed order
  - Both players stay perfectly in sync
  - Progression is deterministic (no guessing)

  FLOW:
  5 prompts → Choice Game
  5 prompts → Tap Game
  5 prompts → Puzzle Game
  5 prompts → Memory Game
  → End
*/

const PROMPTS_BEFORE_GAME = 5;

const GAME_SEQUENCE = [
  "choice",
  "tap",
  "puzzle",
  "memory"
];

export default function GameFlow({ room }) {
  const roomRef = doc(db, "rooms", room);

  const [stage, setStage] = useState("story"); // story | mini | end
  const [promptIndex, setPromptIndex] = useState(0);
  const [usedPrompts, setUsedPrompts] = useState([]);
  const [miniIndex, setMiniIndex] = useState(0);
  const [promptCounter, setPromptCounter] = useState(0);

  /* --------------------------------
     REAL-TIME ROOM STATE
  -------------------------------- */
  useEffect(() => {
    const unsub = onSnapshot(roomRef, (snap) => {
      if (!snap.exists()) return;

      const data = snap.data();

      if (typeof data.promptIndex === "number") {
        setPromptIndex(data.promptIndex);
      }

      if (Array.isArray(data.usedPrompts)) {
        setUsedPrompts(data.usedPrompts);
      }

      if (typeof data.miniIndex === "number") {
        setMiniIndex(data.miniIndex);
      }

      if (typeof data.promptCounter === "number") {
        setPromptCounter(data.promptCounter);
      }

      if (data.stage) {
        setStage(data.stage);
      }
    });

    return () => unsub();
  }, []);

  /* --------------------------------
     ADVANCE LOGIC (SINGLE SOURCE)
  -------------------------------- */
  async function advance() {
    // STORY → count prompt
    if (stage === "story") {
      const nextPromptCounter = promptCounter + 1;

      // Pick next unused question
      let nextPrompt = promptIndex + 1;
      while (usedPrompts.includes(nextPrompt) && nextPrompt < STORY.length) {
        nextPrompt++;
      }

      // If no prompts left → go to end
      if (nextPrompt >= STORY.length) {
        await setDoc(roomRef, { stage: "end" }, { merge: true });
        return;
      }

      // Every N prompts → mini-game
      if (nextPromptCounter % PROMPTS_BEFORE_GAME === 0) {
        await setDoc(
          roomRef,
          {
            stage: "mini",
            usedPrompts: [...usedPrompts, promptIndex],
            promptCounter: nextPromptCounter
          },
          { merge: true }
        );
        return;
      }

      // Normal prompt advance
      await setDoc(
        roomRef,
        {
          promptIndex: nextPrompt,
          usedPrompts: [...usedPrompts, promptIndex],
          promptCounter: nextPromptCounter
        },
        { merge: true }
      );
      return;
    }

    // MINI-GAME → next prompt or end
    if (stage === "mini") {
      const nextMini = miniIndex + 1;

      if (nextMini >= GAME_SEQUENCE.length) {
        await setDoc(roomRef, { stage: "end" }, { merge: true });
        return;
      }

      await setDoc(
        roomRef,
        {
          stage: "story",
          miniIndex: nextMini
        },
        { merge: true }
      );
    }
  }

  /* --------------------------------
     END SCREEN
  -------------------------------- */
  if (stage === "end") {
    return (
      <div style={card}>
        <h2 style={title}>🎉 Game Complete!</h2>
        <p style={text}>
          You played all games and finished all questions 😄
        </p>
        <p style={ending}>✨ The End ✨</p>
      </div>
    );
  }

  /* --------------------------------
     MINI-GAMES
  -------------------------------- */
  if (stage === "mini") {
    const game = GAME_SEQUENCE[miniIndex];

    return (
      <>
        {game === "choice" && (
          <MiniGameChoice room={room} onComplete={advance} />
        )}
        {game === "tap" && (
          <MiniGameTap onComplete={advance} />
        )}
        {game === "puzzle" && (
          <MiniGamePuzzle onComplete={advance} />
        )}
        {game === "memory" && (
          <MiniGameMemory onComplete={advance} />
        )}
      </>
    );
  }

  /* --------------------------------
     STORY (PROMPTS)
  -------------------------------- */
  return (
    <StoryEngine
      room={room}
      onChapterComplete={advance}
    />
  );
}

/* --------------------------------
   STYLES
-------------------------------- */

const card = {
  width: "100%",
  maxWidth: 360,
  background: "#020617",
  borderRadius: 22,
  padding: "28px 22px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  textAlign: "center",
  margin: "0 auto"
};

const title = {
  fontSize: 22,
  marginBottom: 14
};

const text = {
  fontSize: 14,
  color: "#c7d2fe",
  marginBottom: 12,
  lineHeight: "1.5"
};

const ending = {
  marginTop: 18,
  fontSize: 16,
  color: "#a5b4fc"
};
