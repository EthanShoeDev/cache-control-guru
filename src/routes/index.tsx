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

function RouteComponent() {
  const searchParams =
    Route.useSearch() as unknown as Accessor<PageSearchParams>;

  const [textInputHeaderValue, setTextInputHeaderValue] = createSignal(
    searchParams().header ?? '',
  );

  const navigate = Route.useNavigate();
  const debouncedSearchParamUpdate = debounce(
    (search: PageSearchParams) => void navigate({ search, replace: true }),
    50,
  );

  createEffect(() => {
    const urlHeader = searchParams().header;
    const headerVal = textInputHeaderValue();

    if (urlHeader !== headerVal)
      debouncedSearchParamUpdate({ header: headerVal });
  });

  const headerParseResult = createMemo(() =>
    parseCacheControlHeader(textInputHeaderValue()),
  );

  return (
    <main class="container mx-auto max-w-5xl px-4 py-8">
      <div class="space-y-6">
        <div class="space-y-2 text-center">
          <h1 class="text-4xl font-bold tracking-tight">Cache-Control Guru</h1>
          <p class="text-muted-foreground text-xl">
            Understand and generate Cache-Control headers easily
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
                Examples:
              </h3>
              <div class="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setTextInputHeaderValue('max-age=3600, public')
                  }
                >
                  Public, cacheable for 1 hour
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setTextInputHeaderValue(
                      'private, no-cache, max-age=0, must-revalidate',
                    )
                  }
                >
                  Private, always revalidate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTextInputHeaderValue('no-store')}
                >
                  Don't cache at all
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setTextInputHeaderValue('max-age=31536000, immutable')
                  }
                >
                  Static asset (1 year)
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
