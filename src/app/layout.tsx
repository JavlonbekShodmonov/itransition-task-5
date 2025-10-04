import "./globals.css";

export const metadata = {
  title: "User Admin App",
  description: "User management system with Next.js + MongoDB",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
