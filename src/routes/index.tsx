import { ExplainInput } from '@/components/explain-input';
import { GenerateForm } from '@/components/generate-form';
import { HeaderDisplay } from '@/components/header-display';
import { ModeTabs } from '@/components/mode-tabs';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { enhanceExplanation, parseHeader } from '@/lib/cache-control';
import { createFileRoute } from '@tanstack/solid-router';
import { fallback, zodValidator } from '@tanstack/zod-adapter';
import { Accessor, For, Show } from 'solid-js';
import { z } from 'zod';

const pageSearchParamSchema = z.object({
  mode: fallback(z.enum(['explain', 'generate']), 'explain'),
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

  const mode = () => searchParams().mode;
  const header = () => searchParams().header;

  const navigate = Route.useNavigate();
  const setMode = (value: 'explain' | 'generate') => {
    void navigate({
      search: {
        mode: value,
        header: header(),
      },
    });
  };
  
  const setHeader = (value: string) => {
    void navigate({
      search: {
        mode: mode(),
        header: value,
      },
    });
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

        <ModeTabs mode={mode()} onChange={setMode} class="mx-auto max-w-md" />

        <div class="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div class="md:col-span-5">
            <Tabs
              value={mode()}
              onChange={(value) => setMode(value as 'explain' | 'generate')}
            >
              <TabsContent value="explain">
                <ExplainInput headerValue={header()} onExplain={setHeader} />
              </TabsContent>
              <TabsContent value="generate">
                <GenerateForm onGenerate={setHeader} />
              </TabsContent>
            </Tabs>
          </div>

          <div class="space-y-6 md:col-span-7">
            <Tabs value={mode()}>
              <TabsContent value="explain">
                <div class="space-y-6">
                  <Show
                    when={header()}
                    fallback={
                      <p class="text-muted-foreground">
                        Enter a Cache-Control header to see an explanation.
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
              </TabsContent>
              <TabsContent value="generate">
                <HeaderDisplay headerValue={header()} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  );
}
