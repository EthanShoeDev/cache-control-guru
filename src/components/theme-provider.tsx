import { createTheme } from '@/lib/utils';
import { createContext, useContext, type ParentComponent } from 'solid-js';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: () => Theme;
  systemTheme: () => 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  resolvedTheme: () => 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType>();

export const ThemeProvider: ParentComponent = (props) => {
  const themeContext = createTheme();

  return (
    <ThemeContext.Provider value={themeContext}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
