import type { ClassValue } from 'clsx';
import clsx from 'clsx';
import { createSignal, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import { twMerge } from 'tailwind-merge';

export const cn = (...classLists: ClassValue[]) => twMerge(clsx(classLists));

type Theme = 'dark' | 'light' | 'system';

/**
 * Creates a theme management system that:
 * 1. Adds dark class to both documentElement and body (differs from shadcn-solid docs)
 * 2. Handles system theme detection and localStorage persistence
 * 3. Forces a repaint when theme changes to ensure styles apply correctly
 *
 * Note: The implementation adds the dark class to both documentElement AND body,
 * which differs from the shadcn-solid docs that only add it to documentElement.
 * This is done to ensure that both Tailwind and direct CSS selectors work properly,
 * as some libraries might target body while others rely on documentElement.
 */
export function createTheme() {
  const [theme, setTheme] = createSignal<Theme>('system');
  const [store, setStore] = createStore({
    systemTheme: 'light' as 'light' | 'dark',
  });

  onMount(() => {
    // Initialize from localStorage on the client side only
    if (typeof localStorage !== 'undefined') {
      const storedTheme = localStorage.getItem('theme') as Theme;
      if (storedTheme) {
        setTheme(storedTheme);
      }
    }

    // Check for system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setStore('systemTheme', mediaQuery.matches ? 'dark' : 'light');

      mediaQuery.onchange = (e) => {
        setStore('systemTheme', e.matches ? 'dark' : 'light');
        updateDocumentClass();
      };
    }

    updateDocumentClass();
  });

  const updateDocumentClass = () => {
    if (typeof document === 'undefined') return;

    const resolvedTheme = theme() === 'system' ? store.systemTheme : theme();
    if (resolvedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }

    // Force a repaint to ensure styles are applied
    const currentColor = document.body.style.color;
    document.body.style.color = '';
    // Trigger reflow by accessing offsetHeight and using void to avoid lint errors
    void document.body.offsetHeight;
    document.body.style.color = currentColor;
  };

  const setThemeValue = (newTheme: Theme) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
    setTheme(newTheme);
    updateDocumentClass();
  };

  return {
    theme,
    systemTheme: () => store.systemTheme,
    setTheme: setThemeValue,
    resolvedTheme: () => (theme() === 'system' ? store.systemTheme : theme()),
  };
}
