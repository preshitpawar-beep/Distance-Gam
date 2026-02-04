export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "sans-serif",
      gap: "20px"
    }}>
      <h1>💙 Miles Apart</h1>
      <p>A 2-player game for long-distance love</p>

      <a href="/lobby">
        <button style={buttonStyle}>Create / Join Room</button>
      </a>
    </main>
  );
}

const buttonStyle = {
  padding: "15px 25px",
  fontSize: "18px",
  borderRadius: "10px",
  border: "none",
  background: "#2563eb",
  color: "white"
};
