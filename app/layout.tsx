import type { Metadata } from "next";
import { Press_Start_2P, Nunito } from "next/font/google";
import "./globals.css";

const pixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

const body = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Whisk — AI baking studio",
  description:
    "Tap your pixel pantry, hit whisk, and Claude designs you a complete recipe card — with a coffee pairing.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${pixel.variable} ${body.variable} font-body antialiased`}>
        <div className="aurora" />
        <div className="aurora-blue" />
        {children}
      </body>
    </html>
  );
}
