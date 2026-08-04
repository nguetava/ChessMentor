import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "ChessMentor",
  description: "Application interactive pour apprendre les echecs progressivement."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
