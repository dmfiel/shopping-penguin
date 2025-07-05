import React, { useContext, useEffect, useState, type ReactNode } from 'react';

export const ThemeContext = React.createContext({
  theme: 'light',
  toggleTheme: () => null
});

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<string>('dark');

  const toggleTheme = (): null => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    return null;
  };

  // Allow the user to modify their dark mode preference externally
  const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)');
  useEffect(() => setTheme(darkModePreference.matches ? 'dark' : 'light'), []);
  darkModePreference.addEventListener('change', e =>
    setTheme(e.matches ? 'dark' : 'light')
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeButton({ size }: { size?: number }) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="w-fit whitespace-nowrap
 dark:bg-yellow-400 dark:hover:bg-yellow-500 bg-gray-800 hover:bg-gray-700 py-1 px-2 rounded-md my-2 text-white dark:text-black cursor-pointer"
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      aria-label={
        theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'
      }
    >
      {size === 3
        ? theme === 'light'
          ? '🌙 Switch to Dark'
          : '☀️ Switch to Light'
        : size === 1
        ? theme === 'light'
          ? '🌙'
          : '☀️'
        : theme === 'light'
        ? '🌙 Dark'
        : '☀️ Light'}
    </button>
  );
}

export default ThemeProvider;
