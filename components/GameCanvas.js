"use client";

import { useEffect } from "react";

export default function GameCanvas() {
  useEffect(() => {
    if (window.game) return;

    const config = {
      type: Phaser.AUTO,
      width: 360,
      height: 640,
      parent: "game-container",
      backgroundColor: "#0f172a",
      scene: {
        create
      }
    };

    window.game = new Phaser.Game(config);

    function create() {
      this.add.text(180, 300, "Miles Apart 💙", {
        fontSize: "24px",
        color: "#ffffff"
      }).setOrigin(0.5);

      this.add.text(180, 350, "Two players. One journey.", {
        fontSize: "14px",
        color: "#94a3b8"
      }).setOrigin(0.5);
    }
  }, []);

  return <div id="game-container" />;
}
