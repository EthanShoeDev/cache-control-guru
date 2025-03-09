import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createEffect, createSignal, type Component } from 'solid-js';

interface ExplainInputProps {
  headerValue: string;
  onExplain: (value: string) => void;
  class?: string;
}

export const ExplainInput: Component<ExplainInputProps> = (props) => {
  // Using value getter to avoid ESLint warning about reactive variable
  const getHeaderValue = () => props.headerValue;
  const [inputValue, setInputValue] = createSignal(getHeaderValue());

  // Update input when headerValue prop changes
  createEffect(() => {
    setInputValue(getHeaderValue());
  });

  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    const value = e.currentTarget.value;
    setInputValue(value);
    props.onExplain(value);
  };

  const handleExample = (example: string) => {
    setInputValue(example);
    props.onExplain(example);
  };

  return (
    <div class={cn('space-y-4', props.class)}>
      <div class="space-y-3">
        <div class="flex flex-col space-y-2">
          <label
            for="cache-control-input"
            class="text-sm leading-none font-medium"
          >
            Cache-Control Header
          </label>
          <input
            id="cache-control-input"
            type="text"
            value={inputValue()}
            onInput={handleInput}
            placeholder="e.g. max-age=3600, no-cache, public"
            class={cn(
              'border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors',
              'focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'font-mono',
            )}
          />
        </div>
      </div>

      <div class="space-y-2">
        <h3 class="text-muted-foreground text-sm font-medium">Examples:</h3>
        <div class="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExample('max-age=3600, public')}
          >
            Public, cacheable for 1 hour
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleExample('private, no-cache, max-age=0, must-revalidate')
            }
          >
            Private, always revalidate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExample('no-store')}
          >
            Don't cache at all
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExample('max-age=31536000, immutable')}
          >
            Static asset (1 year)
          </Button>
        </div>
      </div>
    </div>
  );
};
