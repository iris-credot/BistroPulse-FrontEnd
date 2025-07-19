// src/i18n.js
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';

// This is the function that will be called from the provider
const initTranslations = async (locale, namespaces, i18nInstance) => {
  // If an instance is not provided, create a new one
  const i18n = i18nInstance || createInstance();

  await i18n
    .use(initReactI18next)
    .use(resourcesToBackend((language, namespace) => import(`./locales/${language}/${namespace}.json`)))
    .init({
      lng: locale,
      fallbackLng: 'en',
      ns: namespaces,
      defaultNS: namespaces[0],
      
      supportedLngs: ['en', 'fr', 'sw', 'rw'],
      preload: typeof window === 'undefined' ? ['en', 'fr', 'sw', 'rw'] : [],
    });

  return i18n;
};

// Export the initialization function
export default initTranslations;