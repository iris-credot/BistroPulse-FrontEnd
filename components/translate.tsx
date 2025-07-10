'use client';
import { useEffect, useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { translateText } from '@/lib/translate';

export default function Translator({ text }: { text: string }) {
  const { language } = useLanguage();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    const run = async () => {
      if (language === 'en') {
        setTranslated(text);
      } else {
        const result = await translateText(text, language);
        setTranslated(result);
      }
    };
    run();
  }, [text, language]);

  return <>{translated}</>;
}
