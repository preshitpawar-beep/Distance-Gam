"use client";

import { useState } from "react";

/*
  This component wraps ANY existing mini-game
  and repeats it for multiple rounds.

  It does NOT modify the game itself.
  It only controls how many times it runs.
*/

export default function MultiRoundGame({
  GameComponent,
  rounds = 5,
  title = "Game Mode",
  onComplete,
  gameProps = {}
}) {
  const [currentRound, setCurrentRound] = useState(1);

  function handleRoundComplete() {
    if (currentRound < rounds) {
      setCurrentRound(r => r + 1);
    } else {
      onComplete();
    }
  }

  return (
    <div style={container}>
      <div style={header}>
        <h3 style={titleStyle}>{title}</h3>
        <p style={roundText}>
          Round {currentRound} / {rounds}
        </p>
      </div>

      <GameComponent
        {...gameProps}
        onComplete={handleRoundComplete}
      />
    </div>
  );
}

/* ---------- STYLES ---------- */

const container = {
  width: "100%",
  maxWidth: 380,
  margin: "0 auto"
};

const header = {
  textAlign: "center",
  marginBottom: 12
};

const titleStyle = {
  fontSize: 18,
  marginBottom: 4
};

const roundText = {
  fontSize: 13,
  color: "#94a3b8"
};
