// src/app/components/TranslationProvider.tsx
'use client';

import { I18nextProvider } from 'react-i18next';
import initTranslations from '@/i18n'; // Adjust the path to your i18n.js file
import { createInstance } from 'i18next';
import { ReactNode } from 'react';

// Define the props for the provider
interface TranslationProviderProps {
  children: ReactNode;
  locale: string;
  namespaces: string[];
}

export default function TranslationsProvider({
  children,
  locale,
  namespaces,
  
}: TranslationProviderProps) {
  // Create a new i18next instance on every render
  // This is important to avoid sharing the same instance between different users
  const i18n = createInstance();

  // Initialize translations for the given locale and namespaces
  initTranslations(locale, namespaces, i18n);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}