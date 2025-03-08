import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Component } from 'solid-js';

interface ThemeSwitchProps {
  class?: string;
}

export const ThemeSwitch: Component<ThemeSwitchProps> = (props) => {
  const { theme, setTheme } = useTheme();

  return (
    <div class={cn('flex items-center space-x-1', props.class)}>
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8"
        title="Light Theme"
        aria-label="Light Theme"
        classList={{
          'bg-accent': theme() === 'light',
        }}
        onClick={() => setTheme('light')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-[1.2rem] w-[1.2rem]"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8"
        title="Dark Theme"
        aria-label="Dark Theme"
        classList={{
          'bg-accent': theme() === 'dark',
        }}
        onClick={() => setTheme('dark')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-[1.2rem] w-[1.2rem]"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8"
        title="System Theme"
        aria-label="System Theme"
        classList={{
          'bg-accent': theme() === 'system',
        }}
        onClick={() => setTheme('system')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-[1.2rem] w-[1.2rem]"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" x2="16" y1="21" y2="21" />
          <line x1="12" x2="12" y1="17" y2="21" />
        </svg>
      </Button>
    </div>
  );
};
