// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google"; // Geist is the new name for Vercel's font
import { ReactNode } from "react";
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from "../../components/darkTheme";
import TranslationsProvider from "../../components/translatoeProvider"; // Corrected typo here
import "./globals.css";

// 1. CRITICAL: DO NOT import i18n config here. This causes the server/client error.
// import '../i18n'; 

const i18nNamespaces = ['translation'];

// Use the correct font loader from next/font
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans", // Define CSS variable
});

export const metadata: Metadata = {
  title: "BistroPulse",
  description: "Food delivery at lightning speed.",
  icons: {
    icon: "/icon.png", // Recommended to use your main icon here
  },
};

// 2. Corrected and simplified the component props interface
interface RootLayoutProps {
  children: ReactNode;
  params: {
    locale: string;
  };
}

export default function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) { // 3. Simplified and corrected function signature
  return (
    <html lang={locale} suppressHydrationWarning> 
      <body className={`${geistSans.variable} antialiased`}>
        <ThemeProvider>
          <TranslationsProvider
            namespaces={i18nNamespaces}
            locale={locale}
          >
            {/* Toaster can be placed here, inside the client providers */}
            <Toaster position="top-right" reverseOrder={false} />
            {children}
          </TranslationsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}