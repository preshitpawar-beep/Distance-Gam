export default function GameRoom({ params }) {
  const { room } = params;

  return (
    <main style={container}>
      <h2>Room Code: {room}</h2>
      <p>Both players open this room on their phones</p>

      <p style={{ marginTop: "20px", color: "#555" }}>
        (Game canvas will appear here next)
      </p>
    </main>
  );
}

const container = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "sans-serif"
};
