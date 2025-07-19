import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ReactNode } from "react";
import { Providers } from "./provider"; // We will create this next
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "BistroPulse",
  description: "Food delivery at lightning speed.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        {/* All providers are wrapped in a single client component */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}