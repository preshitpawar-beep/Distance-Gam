"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

import StoryEngine from "./StoryEngine";
import MiniGameChoice from "./MiniGameChoice";
import MiniGameTap from "./MiniGameTap";
import MiniGamePuzzle from "./MiniGamePuzzle";
import { markCompleted, hasCompleted } from "../lib/replay";

export default function GameFlow({ room }) {
  const [stage, setStage] = useState("story"); // story | mini | end
  const [miniIndex, setMiniIndex] = useState(0);
  const [storyDone, setStoryDone] = useState(false);

  const ref = doc(db, "rooms", room);

  // 🔥 Listen for skip events
  useEffect(() => {
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;

      const data = snap.data();
      if (data.skip === true) {
        advance();
        setDoc(ref, { skip: false }, { merge: true });
      }
    });

    return () => unsub();
  }, [miniIndex, stage]);

  function advance() {
    if (stage === "story") {
      setStage("mini");
      return;
    }

    if (stage === "mini") {
      if (miniIndex < 2) {
        setMiniIndex((i) => i + 1);
        setStage("story");
      } else {
        setStoryDone(true);
      }
    }
  }

  function skip() {
    setDoc(ref, { skip: true }, { merge: true });
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

  return (
    <div style={{ width: "100%" }}>
      <div style={skipBar}>
        <button style={skipBtn} onClick={skip}>
          Skip ⏭️
        </button>
      </div>

      {stage === "story" && (
        <StoryEngine room={room} onChapterComplete={advance} />
      )}

      {stage === "mini" && (
        <>
          {miniIndex === 0 && (
            <MiniGameChoice room={room} onComplete={advance} />
          )}
          {miniIndex === 1 && <MiniGameTap onComplete={advance} />}
          {miniIndex === 2 && <MiniGamePuzzle onComplete={advance} />}
        </>
      )}
    </div>
  );
}

/* ---------- STYLES ---------- */

const skipBar = {
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: "8px"
};

const skipBtn = {
  padding: "6px 12px",
  borderRadius: "10px",
  border: "none",
  background: "#334155",
  color: "#e5e7eb",
  fontSize: "12px",
  cursor: "pointer"
};

const card = {
  width: "100%",
  maxWidth: "360px",
  background: "#020617",
  borderRadius: "22px",
  padding: "28px 22px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  textAlign: "center",
  margin: "0 auto"
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
