'use client';
import { useLanguage } from './LanguageProvider';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'French' },
   { code: 'rw', label: 'Kinyarwanda' },
    { code: 'sw', label: 'Swahili' },
  { code: 'es', label: 'Spanish' },
  { code: 'de', label: 'German' },
  { code: 'ar', label: 'Arabic' },
  { code: 'zh', label: 'Chinese' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <select
    title='f'
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="border px-2 py-1 rounded"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}
