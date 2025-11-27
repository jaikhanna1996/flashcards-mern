import React, { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const THEME_STORAGE_KEY = 'fc_theme';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
      const darkMode = savedTheme === 'dark';
      setIsDark(darkMode);
      document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    } else {
      // Default to light theme
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
    
    // Save to localStorage
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme ? 'dark' : 'light');
    } catch {}
    
    // Dispatch custom event for other components that might need to know
    window.dispatchEvent(
      new CustomEvent('fc:theme-changed', { detail: { theme: newTheme ? 'dark' : 'light' } })
    );
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className="
        w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600
        bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700
        flex items-center justify-center transition-all duration-200
        shadow-sm hover:shadow-md
      "
    >
      {isDark ? (
        <FiSun className="w-4 h-4 text-yellow-500" />
      ) : (
        <FiMoon className="w-4 h-4 text-gray-600" />
      )}
    </button>
  );
}