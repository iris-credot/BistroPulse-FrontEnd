// In: /owner/settings/page.tsx (or wherever this file is located)

'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../../../../components/darkTheme';

// Interface for the Toggle component (unchanged)
interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

// FIX 1: Make DropdownProps generic to be reusable
// It can now work with any set of string values (like 'light'|'dark' or 'en'|'fr')
interface DropdownProps<T extends string> {
  value: T;
  options: { label: string; value: T }[];
  onChange: (value: T) => void;
  title: string; // Add a title prop for accessibility
}

// FIX 2: Correct the values for each language
const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'Kiswahili', value: 'sw' }, // Corrected value
  { label: 'Kinyarwanda', value: 'rw' }, // Corrected value
];

const Settings = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  // FIX 3: Add state for the selected language
  const [language, setLanguage] = useState<string>('en'); // Default to English

  // State for other settings (unchanged)
  const [twoFactor, setTwoFactor] = useState(true);
  const [mobilePush, setMobilePush] = useState(true);
  const [desktopNotification, setDesktopNotification] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Toggle component (unchanged)
  const Toggle = ({ enabled, onToggle }: ToggleProps) => (
    <div
      className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${
        enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
      }`}
      onClick={onToggle}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </div>
  );

  // FIX 4: Update the Dropdown component to use the generic interface
  const Dropdown = <T extends string>({ value, options, onChange, title }: DropdownProps<T>) => (
    <div className="relative w-full sm:w-48">
      <select
        title={title}
        value={value}
        // The type assertion 'as T' makes this generically safe
        onChange={(e) => onChange(e.target.value as T)}
        className="appearance-none bg-white dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-center items-center gap-4">
          <h1 className="text-lg sm:text-2xl font-semibold">Settings</h1>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="max-w-full sm:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {/* Appearance Dropdown */}
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
              <div>
                <h3 className="text-base sm:text-lg font-medium">Appearance</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Select your preferred theme.
                </p>
              </div>
              <Dropdown
                title="Theme Selector"
                value={darkMode ? 'dark' : 'light'}
                options={[
                  { label: 'Light Mode', value: 'light' },
                  { label: 'Dark Mode', value: 'dark' },
                ]}
                onChange={toggleDarkMode}
              />
            </div>

            {/* Language Dropdown */}
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
              <div>
                <h3 className="text-base sm:text-lg font-medium">Language</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Select your language
                </p>
              </div>
              {/* FIX 5: Implement the language dropdown correctly */}
              <Dropdown
                title="Language Selector"
                value={language}
                options={languageOptions}
                onChange={(value) => setLanguage(value)}
              />
            </div>

            {/* Other settings sections remain unchanged */}
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
              <div>
                <h3 className="text-base sm:text-lg font-medium">Two-factor Authentication</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Keep your account secure by enabling 2FA
                </p>
              </div>
              <Toggle enabled={twoFactor} onToggle={() => setTwoFactor(!twoFactor)} />
            </div>

            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
              <div>
                <h3 className="text-base sm:text-lg font-medium">Mobile Push Notifications</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Receive push notifications on mobile
                </p>
              </div>
              <Toggle enabled={mobilePush} onToggle={() => setMobilePush(!mobilePush)} />
            </div>

            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
              <div>
                <h3 className="text-base sm:text-lg font-medium">Desktop Notifications</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Receive push notifications on Desktop
                </p>
              </div>
              <Toggle
                enabled={desktopNotification}
                onToggle={() => setDesktopNotification(!desktopNotification)}
              />
            </div>

            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 border-b-0">
              <div>
                <h3 className="text-base sm:text-lg font-medium">Email Notifications</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Receive email updates
                </p>
              </div>
              <Toggle
                enabled={emailNotifications}
                onToggle={() => setEmailNotifications(!emailNotifications)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;