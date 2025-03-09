import { GenerateForm } from '@/components/generate-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { enhanceExplanation, parseHeader } from '@/lib/cache-control';
import { createFileRoute } from '@tanstack/solid-router';
import { fallback, zodValidator } from '@tanstack/zod-adapter';
import { Accessor, For, Show } from 'solid-js';
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
                <div class="flex items-center justify-between">
                  <label
                    for="cache-control-input"
                    class="text-sm leading-none font-medium"
                  >
                    Cache-Control Header
                  </label>
                  {header() && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        void navigator.clipboard.writeText(header());
                      }}
                    >
                      Copy
                    </Button>
                  )}
                </div>
                <input
                  id="cache-control-input"
                  type="text"
                  value={header()}
                  onInput={(e) => setHeader(e.currentTarget.value)}
                  placeholder="e.g. max-age=3600, no-cache, public"
                  class="border-input focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 font-mono text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            <div class="space-y-2">
              <h3 class="text-muted-foreground text-sm font-medium">
                Examples:
              </h3>
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
                    handleExample(
                      'private, no-cache, max-age=0, must-revalidate',
                    )
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

        {/* Single column layout with form followed by explanation */}
        <div class="mx-auto max-w-3xl space-y-8">
          {/* Form Panel */}
          <div>
            <h2 class="mb-4 text-xl font-semibold">Configure Options</h2>
            {/* Pass the header value to the form and listen for changes */}
            <GenerateForm headerValue={header()} onGenerate={setHeader} />
          </div>

          {/* Explanation Panel */}
          <div class="space-y-6">
            <Show
              when={header()}
              fallback={
                <p class="text-muted-foreground text-center italic">
                  Configure options or enter a Cache-Control header above to see
                  an explanation.
                </p>
              }
            >
              <div class="border-border border-t pt-6">
                <h2 class="mb-4 text-xl font-semibold">Header Explanation</h2>
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
              </div>
            </Show>
          </div>
        </div>
      </div>
    </main>
  );
}
