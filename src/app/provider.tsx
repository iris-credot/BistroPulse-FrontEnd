"use client"; // This is the most important line!

import { ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n"; // Your i18n initialization file
import { ThemeProvider } from "../../components/darkTheme"; // Adjust path if necessary

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </I18nextProvider>
  );
}