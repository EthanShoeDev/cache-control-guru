import { createSignal, type Component } from 'solid-js';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ExplainInputProps {
  headerValue: string;
  onExplain: (value: string) => void;
  class?: string;
}

export const ExplainInput: Component<ExplainInputProps> = (props) => {
  const [inputValue, setInputValue] = createSignal(props.headerValue);
  
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onExplain(inputValue());
  };
  
  const handleExample = (example: string) => {
    setInputValue(example);
    props.onExplain(example);
  };
  
  return (
    <div class={cn('space-y-4', props.class)}>
      <form onSubmit={handleSubmit} class="space-y-3">
        <div class="flex flex-col space-y-2">
          <label for="cache-control-input" class="text-sm font-medium leading-none">
            Cache-Control Header
          </label>
          <input 
            id="cache-control-input"
            type="text"
            value={inputValue()} 
            onInput={(e) => setInputValue(e.currentTarget.value)}
            placeholder="e.g. max-age=3600, no-cache, public"
            class={cn(
              'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'font-mono',
            )}
          />
        </div>
        
        <Button type="submit" class="w-full">
          Explain Header
        </Button>
      </form>
      
      <div class="space-y-2">
        <h3 class="text-sm font-medium text-muted-foreground">Examples:</h3>
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
            onClick={() => handleExample('private, no-cache, max-age=0, must-revalidate')}
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