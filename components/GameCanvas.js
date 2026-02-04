"use client";

import StoryScene from "./StoryScene";

export default function GameCanvas({ room }) {
  return (
    <div style={container}>
      <StoryScene room={room} />
    </div>
  );
}

const container = {
  minHeight: "100vh",
  background: "linear-gradient(#020617, #020617)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};
