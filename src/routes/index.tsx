import { GenerateForm } from '@/components/generate-form';
import { ExplainHeader } from '@/components/explain-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { parseHeader, enhanceExplanation } from '@/lib/cache-control';
import { createFileRoute } from '@tanstack/solid-router';
import { fallback, zodValidator } from '@tanstack/zod-adapter';
import { Accessor, For, Show, createSignal } from 'solid-js';
import { z } from 'zod';

// We're removing the mode parameter and only keeping the header parameter
const pageSearchParamSchema = z.object({
  header: fallback(z.string(), ''),
});

type PageSearchParams = z.infer<typeof pageSearchParamSchema>;

export const Route = createFileRoute('/')({
  component: RouteComponent,
  validateSearch: zodValidator(pageSearchParamSchema),
});

function RouteComponent() {
  const searchParams =
    Route.useSearch() as unknown as Accessor<PageSearchParams>;

  const header = () => searchParams().header;

  const navigate = Route.useNavigate();
  const setHeader = (value: string) => {
    void navigate({
      search: {
        header: value,
      },
    });
  };

  // Example headers for quick selection
  const handleExample = (example: string) => {
    setHeader(example);
  };

  return (
    <main class="container mx-auto max-w-5xl px-4 py-8">
      <div class="space-y-6">
        <div class="space-y-2 text-center">
          <h1 class="text-4xl font-bold tracking-tight">Cache-Control Guru</h1>
          <p class="text-muted-foreground text-xl">
            Understand and generate Cache-Control headers easily
          </p>
        </div>

        {/* Header Input at the top */}
        <div class="mx-auto max-w-2xl">
          <div class="space-y-4">
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
                  value={header()}
                  onInput={(e) => setHeader(e.currentTarget.value)}
                  placeholder="e.g. max-age=3600, no-cache, public"
                  class="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 font-mono"
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
        </div>

        {/* Copy button for the header */}
        {header() && (
          <div class="flex justify-center">
            <Button 
              variant="secondary"
              onClick={() => {
                navigator.clipboard.writeText(header());
              }}
            >
              Copy Header
            </Button>
          </div>
        )}

        <div class="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Form Panel */}
          <div class="md:col-span-5">
            <h2 class="text-xl font-semibold mb-4">Configure Options</h2>
            {/* Pass the header value to the form and listen for changes */}
            <GenerateForm 
              headerValue={header()} 
              onGenerate={setHeader} 
            />
          </div>

          {/* Explanation Panel */}
          <div class="space-y-6 md:col-span-7">
            <Show
              when={header()}
              fallback={
                <p class="text-muted-foreground">
                  Configure options or enter a Cache-Control header to see an explanation.
                </p>
              }
            >
              <h2 class="text-xl font-semibold">Header Explanation</h2>

              <div class="space-y-4">
                <For each={parseHeader(header())}>
                  {(directive) => (
                    <Card class="p-4">
                      <h4 class="text-md flex items-center gap-1.5 font-medium">
                        <span class="bg-muted rounded px-1.5 py-0.5 font-mono text-sm">
                          {directive.name}
                          {directive.value !== undefined
                            ? `=${directive.value}`
                            : ''}
                        </span>
                        <span class="text-muted-foreground text-xs">
                          (
                          {directive.type === 'both'
                            ? 'request & response'
                            : directive.type}{' '}
                          directive)
                        </span>
                      </h4>
                      <p class="mt-2 text-sm">
                        {enhanceExplanation(directive)}
                      </p>
                    </Card>
                  )}
                </For>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </main>
  );
}