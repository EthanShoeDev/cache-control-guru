import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useColorMode } from '@kobalte/core';
import type { Component } from 'solid-js';

interface ThemeSwitchProps {
  class?: string;
}

export const ThemeSwitch: Component<ThemeSwitchProps> = (props) => {
  const { setColorMode, colorMode } = useColorMode();

  return (
    <div class={cn('flex items-center space-x-1', props.class)}>
      <Button
        variant="ghost"
        size="icon"
        title="Light Theme"
        aria-label="Light Theme"
        class={cn('h-8 w-8', colorMode() === 'light' && 'bg-accent')}
        onClick={() => setColorMode('light')}
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
        class={cn('h-8 w-8', colorMode() === 'dark' && 'bg-accent')}
        title="Dark Theme"
        aria-label="Dark Theme"
        onClick={() => setColorMode('dark')}
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
    </div>
  );
};
