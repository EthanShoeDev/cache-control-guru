import { createSignal, type Component, type JSX } from 'solid-js';
import { cn } from '@/lib/utils';

type Mode = 'explain' | 'generate';

interface ModeTabsProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
  class?: string;
}

export const ModeTabs: Component<ModeTabsProps> = (props) => {
  return (
    <div class={cn('flex rounded-lg bg-muted p-1', props.class)}>
      <button
        type="button"
        class={cn(
          'inline-flex flex-1 items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', 
          props.mode === 'explain' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
        )}
        onClick={() => props.onChange('explain')}
      >
        Explain
      </button>
      <button
        type="button"
        class={cn(
          'inline-flex flex-1 items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          props.mode === 'generate' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
        )}
        onClick={() => props.onChange('generate')}
      >
        Generate
      </button>
    </div>
  );
};