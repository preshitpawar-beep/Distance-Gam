export const metadata = {
  title: "Miles Apart",
  description: "A 2-player game for long-distance love"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js"></script>
      </head>
      <body style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
