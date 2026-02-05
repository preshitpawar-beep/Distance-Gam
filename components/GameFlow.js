"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

import StoryEngine from "./StoryEngine";
import MiniGameChoice from "./MiniGameChoice";
import MiniGameTap from "./MiniGameTap";
import MiniGamePuzzle from "./MiniGamePuzzle";
import { markCompleted, hasCompleted } from "../lib/replay";

/*
  GAME RULES (CONTENT-DRIVEN, NOT REPETITIVE)

  - 4 Levels total
  - Each level = 10 prompts
  - After each level → 1 mini-game
  - Total prompts ≈ 40+
  - Mini-games are spaced, not spammed
*/

const PROMPTS_PER_LEVEL = 10;
const TOTAL_LEVELS = 4;

export default function GameFlow({ room }) {
  const [stage, setStage] = useState("story"); // story | mini | end
  const [promptCount, setPromptCount] = useState(0);
  const [level, setLevel] = useState(1);
  const [miniIndex, setMiniIndex] = useState(0);

  const ref = doc(db, "rooms", room);

  /* ---------- REAL-TIME SKIP ---------- */
  useEffect(() => {
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;
      if (snap.data().skip === true) {
        advance();
        setDoc(ref, { skip: false }, { merge: true });
      }
    });
    return () => unsub();
  }, [promptCount, stage, level]);

  /* ---------- GAME PROGRESSION ---------- */
  function advance() {
    // From STORY → MINI-GAME every N prompts
    if (stage === "story") {
      const nextCount = promptCount + 1;
      setPromptCount(nextCount);

      // Level boundary reached → trigger mini-game
      if (nextCount % PROMPTS_PER_LEVEL === 0) {
        setStage("mini");
      }
      return;
    }

    // From MINI-GAME → next LEVEL or END
    if (stage === "mini") {
      if (level < TOTAL_LEVELS) {
        setLevel(l => l + 1);
        setMiniIndex(i => (i + 1) % 3);
        setStage("story");
      } else {
        setStage("end");
      }
    }
  }

  /* ---------- END SCREEN ---------- */
  if (stage === "end") {
    const replay = hasCompleted(room);
    markCompleted(room);

    return (
      <div style={card}>
        <h2 style={title}>🎉 Game Complete!</h2>

        <p style={text}>
          You survived all {TOTAL_LEVELS} levels 😄
        </p>

        {replay ? (
          <p style={text}>
            Back again? Respect. Absolute party legends 🕺💃
          </p>
        ) : (
          <p style={text}>
            That was chaotic, fast, and fun — exactly as intended.
          </p>
        )}

        <p style={ending}>✨ The End ✨</p>
      </div>
    );
  }

  /* ---------- UI ---------- */
  return (
    <div style={{ width: "100%" }}>
      {/* LEVEL HEADER */}
      <div style={levelBar}>
        <div style={levelText}>
          Level {level} / {TOTAL_LEVELS}
        </div>
        <div style={progressOuter}>
          <div
            style={{
              ...progressInner,
              width: `${(level / TOTAL_LEVELS) * 100}%`
            }}
          />
        </div>
      </div>

      {/* SKIP */}
      <div style={skipBar}>
        <button style={skipBtn} onClick={() => setDoc(ref, { skip: true }, { merge: true })}>
          Skip ⏭️
        </button>
      </div>

      {/* CONTENT */}
      {stage === "story" && (
        <StoryEngine room={room} onChapterComplete={advance} />
      )}

      {stage === "mini" && (
        <>
          {miniIndex === 0 && <MiniGameChoice room={room} onComplete={advance} />}
          {miniIndex === 1 && <MiniGameTap onComplete={advance} />}
          {miniIndex === 2 && <MiniGamePuzzle onComplete={advance} />}
        </>
      )}
    </div>
  );
}

/* ---------- STYLES ---------- */

const levelBar = {
  marginBottom: 12
};

const levelText = {
  fontSize: 14,
  marginBottom: 6,
  color: "#c7d2fe"
};

const progressOuter = {
  width: "100%",
  height: 8,
  background: "#1e293b",
  borderRadius: 6,
  overflow: "hidden"
};

const progressInner = {
  height: "100%",
  background: "#38bdf8",
  transition: "width 0.3s ease"
};

const skipBar = {
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: 10
};

const skipBtn = {
  padding: "6px 12px",
  borderRadius: 10,
  border: "none",
  background: "#334155",
  color: "#e5e7eb",
  fontSize: 12,
  cursor: "pointer"
};

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
