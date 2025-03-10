import { GenerateForm } from '@/components/generate-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  generateHeaderExplanation,
  parseCacheControlHeader,
} from '@/lib/cache-control';
import { narrow } from '@/lib/utils';
import { debounce } from '@solid-primitives/scheduled';
import { createFileRoute } from '@tanstack/solid-router';
import { fallback, zodValidator } from '@tanstack/zod-adapter';
import {
  type Accessor,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onMount,
} from 'solid-js';
import { z } from 'zod';

const pageSearchParamSchema = z.object({
  header: fallback(z.string().optional(), undefined),
});

type PageSearchParams = z.infer<typeof pageSearchParamSchema>;

export const Route = createFileRoute('/')({
  component: RouteComponent,
  validateSearch: zodValidator(pageSearchParamSchema),
});

const LOCAL_STORAGE_KEY = 'cache-control-header';

function RouteComponent() {
  const searchParams =
    Route.useSearch() as unknown as Accessor<PageSearchParams>;

  const [textInputHeaderValue, setTextInputHeaderValue] = createSignal(
    searchParams().header ?? '',
  );

  onMount(() => {
    const savedHeader = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!savedHeader) return;
    if (savedHeader === textInputHeaderValue()) return;
    if (searchParams().header) return;
    setTextInputHeaderValue(savedHeader);
  });

  const navigate = Route.useNavigate();
  const debouncedSaveHeaderValue = debounce((value: string) => {
    void navigate({ search: { header: value }, replace: true });
    localStorage.setItem(LOCAL_STORAGE_KEY, value);
  }, 50);

  createEffect(() => {
    const urlHeader = searchParams().header;
    const headerVal = textInputHeaderValue();

    if (urlHeader !== headerVal) debouncedSaveHeaderValue(headerVal);
  });

  const headerParseResult = createMemo(() =>
    parseCacheControlHeader(textInputHeaderValue()),
  );

  return (
    <main class="container mx-auto max-w-5xl px-4 py-8">
      <div class="space-y-6">
        <div class="space-y-3 text-center">
          <h1 class="text-4xl font-bold tracking-tight">Cache-Control Guru</h1>
          <p class="text-muted-foreground text-xl">
            Generate and understand HTTP caching headers easily
          </p>
        </div>

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
                  {textInputHeaderValue() && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        void navigator.clipboard.writeText(
                          textInputHeaderValue(),
                        );
                      }}
                    >
                      Copy
                    </Button>
                  )}
                </div>
                <input
                  id="cache-control-input"
                  type="text"
                  value={textInputHeaderValue()}
                  onInput={(e) =>
                    setTextInputHeaderValue(e.currentTarget.value)
                  }
                  placeholder="e.g. max-age=3600, no-cache, public"
                  class="border-input focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 font-mono text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <Show when={narrow(headerParseResult, (r) => !r.valid)}>
                {(invalidResult) => (
                  <Alert variant="destructive">
                    <AlertTitle>Invalid Header</AlertTitle>
                    <AlertDescription>
                      {invalidResult().errors.join(', ')}
                      <p class="mt-1 text-sm">
                        A browser would ignore this header or apply only the
                        valid parts.
                      </p>
                    </AlertDescription>
                  </Alert>
                )}
              </Show>
            </div>

            <div class="space-y-2">
              <h3 class="text-muted-foreground text-sm font-medium">
                Common Patterns:
              </h3>
              <div class="grid grid-cols-1 gap-2 md:grid-cols-3">
                <Button
                  variant="outline"
                  size="sm"
                  class="h-20 justify-start border-blue-100 hover:bg-blue-50/50 dark:border-blue-900 dark:hover:bg-blue-950/30"
                  onClick={() =>
                    setTextInputHeaderValue('max-age=31536000, immutable')
                  }
                >
                  <div class="text-left">
                    <div class="text-sm font-medium">
                      Static assets (hash filenames)
                    </div>
                    <div class="text-muted-foreground mt-1 font-mono text-xs">
                      max-age=31536000, immutable
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  class="h-20 justify-start border-blue-100 hover:bg-blue-50/50 dark:border-blue-900 dark:hover:bg-blue-950/30"
                  onClick={() => setTextInputHeaderValue('no-cache')}
                >
                  <div class="text-left">
                    <div class="text-sm font-medium">HTML pages</div>
                    <div class="text-muted-foreground mt-1 font-mono text-xs">
                      no-cache
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  class="h-20 justify-start border-blue-100 hover:bg-blue-50/50 dark:border-blue-900 dark:hover:bg-blue-950/30"
                  onClick={() => setTextInputHeaderValue('private, max-age=60')}
                >
                  <div class="text-left">
                    <div class="text-sm font-medium">API responses</div>
                    <div class="text-muted-foreground mt-1 font-mono text-xs">
                      private, max-age=60
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  class="h-20 justify-start border-blue-100 hover:bg-blue-50/50 dark:border-blue-900 dark:hover:bg-blue-950/30"
                  onClick={() =>
                    setTextInputHeaderValue(
                      'private, max-age=0, must-revalidate',
                    )
                  }
                >
                  <div class="text-left">
                    <div class="text-sm font-medium">Personalized content</div>
                    <div class="text-muted-foreground mt-1 font-mono text-xs">
                      private, max-age=0, must-revalidate
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  class="h-20 justify-start border-blue-100 hover:bg-blue-50/50 dark:border-blue-900 dark:hover:bg-blue-950/30"
                  onClick={() =>
                    setTextInputHeaderValue(
                      'max-age=60, stale-while-revalidate=3600, stale-if-error=86400',
                    )
                  }
                >
                  <div class="text-left">
                    <div class="text-sm font-medium">
                      Fast updates with fallbacks
                    </div>
                    <div class="text-muted-foreground mt-1 font-mono text-xs">
                      max-age=60, stale-while-revalidate=3600,
                      stale-if-error=86400
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  class="h-20 justify-start border-blue-100 hover:bg-blue-50/50 dark:border-blue-900 dark:hover:bg-blue-950/30"
                  onClick={() => setTextInputHeaderValue('no-store')}
                >
                  <div class="text-left">
                    <div class="text-sm font-medium">Sensitive data</div>
                    <div class="text-muted-foreground mt-1 font-mono text-xs">
                      no-store
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div class="mx-auto max-w-3xl space-y-8">
          <div class="space-y-6">
            <Show
              when={textInputHeaderValue()}
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
                    {headerParseResult().valid
                      ? generateHeaderExplanation(textInputHeaderValue())
                      : 'This Cache-Control header is invalid. Please correct the errors shown above.'}
                  </p>
                </Card>
              </div>
            </Show>
          </div>

          <div class="border-border border-t pt-6">
            <h2 class="mb-4 text-xl font-semibold">Configure Options</h2>
            <GenerateForm
              textInputHeaderValue={textInputHeaderValue()}
              setTextInputHeaderValue={setTextInputHeaderValue}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
