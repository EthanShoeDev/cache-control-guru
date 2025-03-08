import { ExplainInput } from '@/components/explain-input';
import { GenerateForm } from '@/components/generate-form';
import { HeaderDisplay } from '@/components/header-display';
import { ModeTabs } from '@/components/mode-tabs';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { enhanceExplanation, parseHeader } from '@/lib/cache-control';
import { createSignal, For, Show } from 'solid-js';

export default function Home() {
  const [mode, setMode] = createSignal<'explain' | 'generate'>('explain');
  const [headerValue, setHeaderValue] = createSignal('');
  const [generatedHeader, setGeneratedHeader] = createSignal('');

  const handleExplain = (value: string) => {
    setHeaderValue(value);
  };

  const handleGenerate = (value: string) => {
    setGeneratedHeader(value);
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
                <ExplainInput
                  headerValue={headerValue()}
                  onExplain={handleExplain}
                />
              </TabsContent>
              <TabsContent value="generate">
                <GenerateForm onGenerate={handleGenerate} />
              </TabsContent>
            </Tabs>
          </div>

          <div class="space-y-6 md:col-span-7">
            <Tabs value={mode()}>
              <TabsContent value="explain">
                <div class="space-y-6">
                  <Show
                    when={headerValue()}
                    fallback={
                      <p class="text-muted-foreground">
                        Enter a Cache-Control header to see an explanation.
                      </p>
                    }
                  >
                    <h2 class="text-xl font-semibold">Header Explanation</h2>

                    <div class="space-y-4">
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
                  </Show>
                </div>
              </TabsContent>
              <TabsContent value="generate">
                <HeaderDisplay headerValue={generatedHeader()} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  );
}
