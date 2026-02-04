export const metadata = {
  title: "Miles Apart",
  description: "A 2-player game for long-distance love"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
