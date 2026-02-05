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
=====================================
FINAL GAME FLOW (LOCKED)
=====================================

RULES:
- Questions NEVER repeat in one run
- Both players are always on same screen
- Skip works globally
- Mini-games appear ONCE in fixed order
- Manual progression everywhere

FLOW:
5 prompts → Choice
5 prompts → Tap
5 prompts → Puzzle
5 prompts → Memory
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
  const [promptCounter, setPromptCounter] = useState(0);
  const [miniIndex, setMiniIndex] = useState(0);

  /* -------------------------------
     REAL-TIME ROOM STATE
  ------------------------------- */
  useEffect(() => {
    const unsub = onSnapshot(roomRef, snap => {
      if (!snap.exists()) return;
      const d = snap.data();

      if (d.stage) setStage(d.stage);
      if (typeof d.promptIndex === "number") setPromptIndex(d.promptIndex);
      if (Array.isArray(d.usedPrompts)) setUsedPrompts(d.usedPrompts);
      if (typeof d.promptCounter === "number") setPromptCounter(d.promptCounter);
      if (typeof d.miniIndex === "number") setMiniIndex(d.miniIndex);

      // GLOBAL SKIP
      if (d.skip === true) {
        advance();
        setDoc(roomRef, { skip: false }, { merge: true });
      }
    });

    return () => unsub();
  }, []);

  /* -------------------------------
     SINGLE SOURCE ADVANCE
  ------------------------------- */
  async function advance() {
    // STORY → PROMPTS
    if (stage === "story") {
      const nextCounter = promptCounter + 1;

      // find next unused prompt
      let nextPrompt = promptIndex + 1;
      while (
        usedPrompts.includes(nextPrompt) &&
        nextPrompt < STORY.length
      ) {
        nextPrompt++;
      }

      // no prompts left → end
      if (nextPrompt >= STORY.length) {
        await setDoc(roomRef, { stage: "end" }, { merge: true });
        return;
      }

      // trigger mini-game
      if (nextCounter % PROMPTS_BEFORE_GAME === 0) {
        await setDoc(
          roomRef,
          {
            stage: "mini",
            usedPrompts: [...usedPrompts, promptIndex],
            promptCounter: nextCounter
          },
          { merge: true }
        );
        return;
      }

      // normal next prompt
      await setDoc(
        roomRef,
        {
          promptIndex: nextPrompt,
          usedPrompts: [...usedPrompts, promptIndex],
          promptCounter: nextCounter
        },
        { merge: true }
      );
      return;
    }

    // MINI-GAME → NEXT STAGE
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

  /* -------------------------------
     END SCREEN
  ------------------------------- */
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

  /* -------------------------------
     MINI-GAMES
  ------------------------------- */
  if (stage === "mini") {
    const game = GAME_SEQUENCE[miniIndex];

    return (
      <>
        <SkipButton room={room} />
        {game === "choice" && (
          <MiniGameChoice room={room} onComplete={advance} />
        )}
        {game === "tap" && (
          <MiniGameTap onComplete={advance} />
        )}
        {game === "puzzle" && (
          <MiniGamePuzzle room={room} onComplete={advance} />
        )}
        {game === "memory" && (
          <MiniGameMemory room={room} onComplete={advance} />
        )}
      </>
    );
  }

  /* -------------------------------
     STORY PROMPTS
  ------------------------------- */
  return (
    <>
      <SkipButton room={room} />
      <StoryEngine room={room} onChapterComplete={advance} />
    </>
  );
}

/* -------------------------------
   SKIP BUTTON (GLOBAL)
------------------------------- */
function SkipButton({ room }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
      <button
        style={{
          padding: "6px 12px",
          borderRadius: 10,
          background: "#334155",
          color: "#e5e7eb",
          border: "none",
          cursor: "pointer"
        }}
        onClick={() =>
          setDoc(doc(db, "rooms", room), { skip: true }, { merge: true })
        }
      >
        Skip ⏭️
      </button>
    </div>
  );
}

/* -------------------------------
   STYLES
------------------------------- */
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
