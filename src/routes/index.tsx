import { createSignal } from 'solid-js';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { parseHeader, enhanceExplanation } from '@/lib/cache-control';

export default function Home() {
  const [mode, setMode] = createSignal<'explain' | 'generate'>('explain');
  const [headerValue, setHeaderValue] = createSignal('');
  const [inputValue, setInputValue] = createSignal('');
  
  const handleExplain = (e: Event) => {
    e.preventDefault();
    setHeaderValue(inputValue());
  };
  
  const handleExample = (example: string) => {
    setInputValue(example);
    setHeaderValue(example);
  };
  
  return (
    <main class="container mx-auto py-8 px-4 max-w-5xl">
      <div class="space-y-6">
        <div class="text-center space-y-2">
          <h1 class="text-4xl font-bold tracking-tight">Cache-Control Guru</h1>
          <p class="text-xl text-muted-foreground">
            Understand and generate Cache-Control headers easily
          </p>
        </div>
        
        <div class="flex rounded-lg bg-muted p-1 max-w-md mx-auto">
          <button
            type="button"
            class={`inline-flex flex-1 items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              mode() === 'explain' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setMode('explain')}
          >
            Explain
          </button>
          <button
            type="button"
            class={`inline-flex flex-1 items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              mode() === 'generate' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setMode('generate')}
          >
            Generate
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div class="md:col-span-5">
            {mode() === 'explain' ? (
              <div class="space-y-4">
                <form onSubmit={handleExplain} class="space-y-3">
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
                      class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono"
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
            ) : (
              <div class="space-y-4">
                <Card class="p-4">
                  <p class="text-center text-muted-foreground">
                    Generator coming soon! For now, try out the Explain mode.
                  </p>
                </Card>
              </div>
            )}
          </div>
          
          <div class="md:col-span-7 space-y-6">
            <div class="space-y-6">
              {headerValue() ? (
                <>
                  <h2 class="text-xl font-semibold">Header Explanation</h2>
                  
                  <div class="space-y-4">
                    {parseHeader(headerValue()).map((directive) => (
                      <Card class="p-4">
                        <h4 class="text-md font-medium flex items-center gap-1.5">
                          <span class="font-mono bg-muted px-1.5 py-0.5 rounded text-sm">
                            {directive.name}{directive.value !== undefined ? `=${directive.value}` : ''}
                          </span>
                          <span class="text-xs text-muted-foreground">
                            ({directive.type === 'both' ? 'request & response' : directive.type} directive)
                          </span>
                        </h4>
                        <p class="mt-2 text-sm">{enhanceExplanation(directive)}</p>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <p class="text-muted-foreground">Enter a Cache-Control header to see an explanation.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
