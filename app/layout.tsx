import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paper Recommender",
  description: "Private daily paper recommendations"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
