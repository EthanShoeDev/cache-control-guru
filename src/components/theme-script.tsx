import { type Component } from 'solid-js';

// This is a special case where we need to use innerHTML
// to ensure the script runs immediately
/* eslint-disable solid/no-innerhtml */
export const ThemeScript: Component = () => {
  const script = `
  (function() {
    function getTheme() {
      try {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark' || storedTheme === 'light') {
          return storedTheme;
        }
        // Default to system preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return systemPrefersDark ? 'dark' : 'light';
      } catch (e) {
        return 'light';
      }
    }

    const theme = getTheme();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body && document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body && document.body.classList.remove('dark');
    }
  })();
  `;

  return <script innerHTML={script} />;
};
/* eslint-enable solid/no-innerhtml */
