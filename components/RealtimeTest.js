"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

export default function RealtimeTest({ room }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const ref = doc(db, "rooms", room);

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setCount(snap.data().count || 0);
      }
    });

    return () => unsub();
  }, [room]);

  async function increment() {
    const ref = doc(db, "rooms", room);
    await setDoc(ref, { count: count + 1 }, { merge: true });
  }

  return (
    <div style={card}>
      <h3>🔥 Live Sync Test</h3>
      <p style={{ marginBottom: 10 }}>
        Count (updates instantly):
      </p>
      <div style={number}>{count}</div>

      <button style={btn} onClick={increment}>
        Tap Me
      </button>

      <p style={hint}>
        Open this room on two phones and tap.
      </p>
    </div>
  );
}

const card = {
  background: "#020617",
  padding: 20,
  borderRadius: 16,
  textAlign: "center",
  color: "white"
};

const number = {
  fontSize: 32,
  marginBottom: 12,
  color: "#38bdf8"
};

const btn = {
  padding: "12px 20px",
  borderRadius: 12,
  border: "none",
  background: "#22c55e",
  color: "#020617",
  fontWeight: "600",
  cursor: "pointer"
};

const hint = {
  fontSize: 12,
  color: "#94a3b8",
  marginTop: 10
};
