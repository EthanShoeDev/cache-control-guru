import { GenerateForm } from '@/components/generate-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  enhanceExplanation,
  generateHeaderExplanation,
  parseHeader,
  validateHeader,
} from '@/lib/cache-control';
import { createFileRoute } from '@tanstack/solid-router';
import { fallback, zodValidator } from '@tanstack/zod-adapter';
import {
  Accessor,
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
} from 'solid-js';
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
  const navigate = Route.useNavigate();

  // Header value as entered by the user, always used in URL params
  const [headerValue, setHeaderValue] = createSignal('');

  // Flag to prevent infinite loops
  const [isUpdatingFromUrl, setIsUpdatingFromUrl] = createSignal(false);

  // Create a memo for header validation
  const headerValidation = createMemo(() => {
    return validateHeader(headerValue());
  });

  // Sync from URL to local state on initial load
  createEffect(() => {
    const urlHeader = searchParams().header;

    // Only update if different and not currently updating manually
    if (urlHeader !== headerValue() && !isUpdatingFromUrl()) {
      setHeaderValue(urlHeader);
    }
  });

  // Update URL to match manually entered value
  const updateUrl = (value: string) => {
    // Set flag to prevent circular updates
    setIsUpdatingFromUrl(true);

    try {
      // Update URL with replace to avoid browser history issues
      void navigate({ search: { header: value } }, { replace: true });
    } finally {
      // Clear flag after a brief delay
      setTimeout(() => setIsUpdatingFromUrl(false), 50);
    }
  };

  // Handle manual input from the text field
  const handleManualInput = (value: string) => {
    // Always update header value and URL, 
    // allowing users to type invalid headers freely
    setHeaderValue(value);
    updateUrl(value);
  };

  // When form options change, update the header value and URL
  const handleFormGenerate = (value: string) => {
    setHeaderValue(value);
    updateUrl(value);
  };

  // Example headers for quick selection
  const handleExample = (example: string) => {
    setHeaderValue(example);
    updateUrl(example);
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
                  {headerValue() && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        void navigator.clipboard.writeText(headerValue());
                      }}
                    >
                      Copy
                    </Button>
                  )}
                </div>
                <input
                  id="cache-control-input"
                  type="text"
                  value={headerValue()}
                  onInput={(e) => handleManualInput(e.currentTarget.value)}
                  placeholder="e.g. max-age=3600, no-cache, public"
                  class="border-input focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 font-mono text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Show validation error if header is invalid */}
              <Show
                when={
                  !headerValidation().valid && headerValue().trim() !== ''
                }
              >
                <Alert variant="destructive">
                  <AlertTitle>Invalid Header</AlertTitle>
                  <AlertDescription>
                    {headerValidation().error}
                    <p class="mt-1 text-sm">
                      A browser would ignore this header or apply only the valid
                      parts.
                    </p>
                  </AlertDescription>
                </Alert>
              </Show>
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

        {/* Single column layout with explanation followed by form */}
        <div class="mx-auto max-w-3xl space-y-8">
          {/* Explanation Panel - Now moved above the form */}
          <div class="space-y-6">
            <Show
              when={headerValue()}
              fallback={
                <p class="text-muted-foreground text-center italic">
                  Configure options or enter a Cache-Control header above to see
                  an explanation.
                </p>
              }
            >
              <div class="border-border pt-2">
                <h2 class="mb-4 text-xl font-semibold">Header Explanation</h2>
                <Card class="p-4">
                  <p class="text-base">
                    {headerValidation().valid
                      ? generateHeaderExplanation(headerValue())
                      : 'This Cache-Control header is invalid. Please correct the errors shown above.'}
                  </p>
                </Card>

                <Show
                  when={
                    headerValidation().valid &&
                    parseHeader(headerValue()).length > 0
                  }
                >
                  <details class="mt-4">
                    <summary class="text-muted-foreground hover:text-foreground cursor-pointer text-sm">
                      View detailed directive explanations
                    </summary>
                    <div class="mt-4 space-y-4">
                      <For each={parseHeader(headerValue())}>
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
                  </details>
                </Show>
              </div>
            </Show>
          </div>

          {/* Form Panel - Now below the explanation */}
          <div class="border-border border-t pt-6">
            <h2 class="mb-4 text-xl font-semibold">Configure Options</h2>
            {/* Pass the header value to the form and listen for changes */}
            <GenerateForm
              headerValue={headerValue()}
              onGenerate={handleFormGenerate}
            />
            
            {/* Message explaining interaction between invalid headers and form - this used to be here but we're handling it in the form itself now */}
          </div>
        </div>
      </div>
    </main>
  );
}
