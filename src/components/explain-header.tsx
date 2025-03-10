import { Card } from '@/components/ui/card';
import {
  enhanceExplanation,
  parseHeader,
  type CacheControlDirective,
} from '@/lib/cache-control';
import { cn } from '@/lib/utils';
import { createMemo, For, Show, type Component } from 'solid-js';

type ExplainHeaderProps = {
  headerValue: string;
  class?: string;
};

export const ExplainHeader: Component<ExplainHeaderProps> = (props) => {
  const parsedDirectives = createMemo(() => parseHeader(props.headerValue));

  const categorizedDirectives = createMemo(() => {
    const directives = parsedDirectives();
    return {
      general: directives.filter((d) => d.category === 'general'),
      expiration: directives.filter((d) => d.category === 'expiration'),
      validation: directives.filter((d) => d.category === 'validation'),
      other: directives.filter((d) => d.category === 'other'),
    };
  });

  return (
    <div class={cn('space-y-6', props.class)}>
      <Show when={props.headerValue.trim() !== ''}>
        <h2 class="text-xl font-semibold">Header Explanation</h2>

        <div class="space-y-4">
          <Show when={parsedDirectives().length === 0}>
            <p class="text-muted-foreground">
              No valid directives found in the header.
            </p>
          </Show>

          <Show when={categorizedDirectives().general.length > 0}>
            <DirectiveCategory
              title="General Caching"
              directives={categorizedDirectives().general}
            />
          </Show>

          <Show when={categorizedDirectives().expiration.length > 0}>
            <DirectiveCategory
              title="Expiration"
              directives={categorizedDirectives().expiration}
            />
          </Show>

          <Show when={categorizedDirectives().validation.length > 0}>
            <DirectiveCategory
              title="Validation"
              directives={categorizedDirectives().validation}
            />
          </Show>

          <Show when={categorizedDirectives().other.length > 0}>
            <DirectiveCategory
              title="Other Directives"
              directives={categorizedDirectives().other}
            />
          </Show>
        </div>

        <Show when={parsedDirectives().length > 1}>
          <SummarySection directives={parsedDirectives()} />
        </Show>
      </Show>

      <Show when={props.headerValue.trim() === ''}>
        <p class="text-muted-foreground">
          Enter a Cache-Control header to see an explanation.
        </p>
      </Show>
    </div>
  );
};

type DirectiveCategoryProps = {
  title: string;
  directives: CacheControlDirective[];
};

const DirectiveCategory: Component<DirectiveCategoryProps> = (props) => {
  return (
    <div class="space-y-2">
      <h3 class="text-primary text-lg font-medium">{props.title}</h3>
      <div class="space-y-3">
        <For each={props.directives}>
          {(directive) => (
            <Card class="p-4">
              <h4 class="text-md flex items-center gap-1.5 font-medium">
                <span class="bg-muted rounded px-1.5 py-0.5 font-mono text-sm">
                  {directive.name}
                  {directive.value !== undefined ? `=${directive.value}` : ''}
                </span>
                <span class="text-muted-foreground text-xs">
                  (
                  {directive.type === 'both'
                    ? 'request & response'
                    : directive.type}{' '}
                  directive)
                </span>
              </h4>
              <p class="mt-2 text-sm">{enhanceExplanation(directive)}</p>
            </Card>
          )}
        </For>
      </div>
    </div>
  );
};

type SummarySectionProps = {
  directives: CacheControlDirective[];
};

const SummarySection: Component<SummarySectionProps> = (props) => {
  // Logic to generate summary based on directives
  const summary = createMemo(() => {
    const directives = props.directives;

    // Check for contradictions or special cases
    const hasNoStore = directives.some((d) => d.name === 'no-store');
    const hasNoCache = directives.some((d) => d.name === 'no-cache');
    const hasPublic = directives.some((d) => d.name === 'public');
    const hasPrivate = directives.some((d) => d.name === 'private');
    const hasMaxAge = directives.some((d) => d.name === 'max-age');
    const hasMustRevalidate = directives.some(
      (d) => d.name === 'must-revalidate',
    );

    if (hasNoStore) {
      return 'This response should not be stored in any cache. Other caching directives will be ignored.';
    }

    if (hasNoCache && hasMaxAge) {
      return 'This response can be cached but must be revalidated with the server before use, even if still fresh according to max-age.';
    }

    if (hasPublic && hasPrivate) {
      return 'Conflicting directives: "public" and "private" should not be used together. "private" will take precedence.';
    }

    if (hasMaxAge && !hasNoCache && !hasMustRevalidate) {
      const maxAgeDir = directives.find((d) => d.name === 'max-age');
      if (maxAgeDir?.value) {
        const seconds = parseInt(maxAgeDir.value, 10);
        if (seconds === 0) {
          return 'This response can be cached but is immediately stale and requires revalidation before use.';
        } else if (seconds <= 60) {
          return 'This response can be cached for a short period without revalidation.';
        } else {
          return 'This response can be cached and used without revalidation until it becomes stale.';
        }
      }
    }

    return 'This Cache-Control header combines multiple directives that affect how the response is cached.';
  });

  return (
    <div class="pt-2">
      <h3 class="text-primary text-lg font-medium">Summary</h3>
      <Card class="bg-muted/30 mt-2 p-4">
        <p>{summary()}</p>
      </Card>
    </div>
  );
};
