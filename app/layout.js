export const metadata = {
  title: "Miles Apart",
  description: "A playful 2-player game for couples"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          backgroundColor: "#020617",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
        }}
      >
        {children}
      </body>
    </html>
  );
}
