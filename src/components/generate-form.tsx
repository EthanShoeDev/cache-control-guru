import { TimeInput } from '@/components/time-input';
import { Card } from '@/components/ui/card';
import {
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
} from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { createEffect, createSignal, type Component } from 'solid-js';

interface GenerateFormProps {
  onGenerate: (headerValue: string) => void;
  class?: string;
}

type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days';

// Helper function to convert time to seconds
const convertToSeconds = (value: number, unit: TimeUnit): number => {
  switch (unit) {
    case 'minutes':
      return value * 60;
    case 'hours':
      return value * 60 * 60;
    case 'days':
      return value * 60 * 60 * 24;
    default:
      return value;
  }
};

export const GenerateForm: Component<GenerateFormProps> = (props) => {
  // Using createSignal for form state
  const [cacheability, setCacheability] = createSignal<
    'public' | 'private' | 'none'
  >('public');
  const [noStore, setNoStore] = createSignal(false);
  const [noCache, setNoCache] = createSignal(false);
  const [mustRevalidate, setMustRevalidate] = createSignal(false);
  const [proxyRevalidate, setProxyRevalidate] = createSignal(false);
  const [staleWhileRevalidate, setStaleWhileRevalidate] = createSignal(false);
  const [staleIfError, setStaleIfError] = createSignal(false);
  const [noTransform, setNoTransform] = createSignal(false);
  const [immutable, setImmutable] = createSignal(false);

  // Max-age state
  const [maxAgeEnabled, setMaxAgeEnabled] = createSignal(true);
  const [maxAgeValue, setMaxAgeValue] = createSignal(3600);
  const [maxAgeUnit, setMaxAgeUnit] = createSignal<TimeUnit>('seconds');

  // S-maxage state
  const [sMaxAgeEnabled, setSMaxAgeEnabled] = createSignal(false);
  const [sMaxAgeValue, setSMaxAgeValue] = createSignal(3600);
  const [sMaxAgeUnit, setSMaxAgeUnit] = createSignal<TimeUnit>('seconds');

  // Stale-while-revalidate state
  const [staleWhileRevalidateValue, setStaleWhileRevalidateValue] =
    createSignal(60);
  const [staleWhileRevalidateUnit, setStaleWhileRevalidateUnit] =
    createSignal<TimeUnit>('seconds');

  // Stale-if-error state
  const [staleIfErrorValue, setStaleIfErrorValue] = createSignal(300);
  const [staleIfErrorUnit, setStaleIfErrorUnit] =
    createSignal<TimeUnit>('seconds');

  // Effect to disable incompatible options when noStore is true
  createEffect(() => {
    if (noStore()) {
      setMaxAgeEnabled(false);
      setSMaxAgeEnabled(false);
      setNoCache(false);
      setMustRevalidate(false);
      setProxyRevalidate(false);
      setImmutable(false);
      setStaleWhileRevalidate(false);
      setStaleIfError(false);
    }
  });

  // Effect to disable s-maxage when private is selected
  createEffect(() => {
    if (cacheability() === 'private') {
      setSMaxAgeEnabled(false);
    }
  });

  // Generate header on any state change
  createEffect(() => {
    generateHeader();
  });

  // Function to generate the Cache-Control header
  const generateHeader = () => {
    const directives = [];

    // Cacheability directives
    if (cacheability() === 'public') directives.push('public');
    if (cacheability() === 'private') directives.push('private');

    // Basic caching control
    if (noStore()) directives.push('no-store');
    if (noCache()) directives.push('no-cache');

    // Validation directives
    if (mustRevalidate()) directives.push('must-revalidate');
    if (proxyRevalidate()) directives.push('proxy-revalidate');
    if (immutable()) directives.push('immutable');

    // Time-based directives
    if (maxAgeEnabled() && !noStore()) {
      const maxAgeSecs = convertToSeconds(maxAgeValue(), maxAgeUnit());
      directives.push(`max-age=${maxAgeSecs}`);
    }

    if (sMaxAgeEnabled() && !noStore() && cacheability() !== 'private') {
      const sMaxAgeSecs = convertToSeconds(sMaxAgeValue(), sMaxAgeUnit());
      directives.push(`s-maxage=${sMaxAgeSecs}`);
    }

    // Other directives
    if (noTransform()) directives.push('no-transform');

    // Extensions
    if (staleWhileRevalidate() && !noStore()) {
      const staleWhileRevalidateSecs = convertToSeconds(
        staleWhileRevalidateValue(),
        staleWhileRevalidateUnit(),
      );
      directives.push(`stale-while-revalidate=${staleWhileRevalidateSecs}`);
    }

    if (staleIfError() && !noStore()) {
      const staleIfErrorSecs = convertToSeconds(
        staleIfErrorValue(),
        staleIfErrorUnit(),
      );
      directives.push(`stale-if-error=${staleIfErrorSecs}`);
    }

    const headerValue = directives.join(', ');
    props.onGenerate(headerValue);
  };

  return (
    <div class={cn('space-y-6', props.class)}>
      <div class="space-y-6">
        {/* General Caching Section */}
        <div>
          <h3 class="text-primary mb-3 text-lg font-medium">General Caching</h3>
          <Card class="space-y-4 p-4">
            <div class="space-y-3">
              <p class="text-sm font-medium">Cacheability</p>
              <div class="flex flex-col gap-2">
                <label class="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="cacheability"
                    value="public"
                    checked={cacheability() === 'public'}
                    onChange={() => setCacheability('public')}
                    disabled={noStore()}
                    class="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                  />
                  <span class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Public
                  </span>
                </label>
                <p class="text-muted-foreground ml-6 text-xs">
                  Response can be stored by any cache, including browsers and
                  CDNs.
                </p>

                <label class="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="cacheability"
                    value="private"
                    checked={cacheability() === 'private'}
                    onChange={() => setCacheability('private')}
                    disabled={noStore()}
                    class="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                  />
                  <span class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Private
                  </span>
                </label>
                <p class="text-muted-foreground ml-6 text-xs">
                  Response is intended for a single user and must not be stored
                  by shared caches.
                </p>

                <label class="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="cacheability"
                    value="none"
                    checked={cacheability() === 'none'}
                    onChange={() => setCacheability('none')}
                    disabled={noStore()}
                    class="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                  />
                  <span class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    None
                  </span>
                </label>
                <p class="text-muted-foreground ml-6 text-xs">
                  Don't specify public or private explicitly.
                </p>
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <Checkbox
                  checked={noStore()}
                  onChange={(checked) => setNoStore(checked)}
                >
                  <div class="flex items-center space-x-2">
                    <CheckboxControl />
                    <CheckboxLabel class="text-sm leading-none font-medium">
                      No Store
                    </CheckboxLabel>
                  </div>
                </Checkbox>
              </div>
              <p class="text-muted-foreground ml-6 text-xs">
                Response must not be stored in any cache. Used for sensitive
                data.
              </p>
            </div>

            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <Checkbox
                  checked={noCache()}
                  onChange={(checked) => setNoCache(checked)}
                  disabled={noStore()}
                >
                  <div class="flex items-center space-x-2">
                    <CheckboxControl />
                    <CheckboxLabel class="text-sm leading-none font-medium">
                      No Cache
                    </CheckboxLabel>
                  </div>
                </Checkbox>
              </div>
              <p class="text-muted-foreground ml-6 text-xs">
                Cache must revalidate with the origin server before using the
                cached copy.
              </p>
            </div>
          </Card>
        </div>

        {/* Validation Section */}
        <div>
          <h3 class="text-primary mb-3 text-lg font-medium">Validation</h3>
          <Card class="space-y-4 p-4">
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <Checkbox
                  checked={mustRevalidate()}
                  onChange={(checked) => setMustRevalidate(checked)}
                  disabled={noStore()}
                >
                  <div class="flex items-center space-x-2">
                    <CheckboxControl />
                    <CheckboxLabel class="text-sm leading-none font-medium">
                      Must Revalidate
                    </CheckboxLabel>
                  </div>
                </Checkbox>
              </div>
              <p class="text-muted-foreground ml-6 text-xs">
                Cache must verify stale responses with the origin server before
                using them.
              </p>
            </div>

            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <Checkbox
                  checked={proxyRevalidate()}
                  onChange={(checked) => setProxyRevalidate(checked)}
                  disabled={noStore()}
                >
                  <div class="flex items-center space-x-2">
                    <CheckboxControl />
                    <CheckboxLabel class="text-sm leading-none font-medium">
                      Proxy Revalidate
                    </CheckboxLabel>
                  </div>
                </Checkbox>
              </div>
              <p class="text-muted-foreground ml-6 text-xs">
                Similar to must-revalidate but only applies to shared caches
                like CDNs.
              </p>
            </div>

            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <Checkbox
                  checked={immutable()}
                  onChange={(checked) => setImmutable(checked)}
                  disabled={noStore()}
                >
                  <div class="flex items-center space-x-2">
                    <CheckboxControl />
                    <CheckboxLabel class="text-sm leading-none font-medium">
                      Immutable
                    </CheckboxLabel>
                  </div>
                </Checkbox>
              </div>
              <p class="text-muted-foreground ml-6 text-xs">
                Indicates the response body will not change over time (for
                HTTP/2+).
              </p>
            </div>
          </Card>
        </div>

        {/* Expiration Section */}
        <div>
          <h3 class="text-primary mb-3 text-lg font-medium">Expiration</h3>
          <Card class="space-y-4 p-4">
            <TimeInput
              label="Max Age"
              value={maxAgeValue()}
              unit={maxAgeUnit()}
              enabled={maxAgeEnabled()}
              onValueChange={setMaxAgeValue}
              onUnitChange={setMaxAgeUnit}
              onEnabledChange={setMaxAgeEnabled}
              description="Maximum time the response can be used before revalidation."
              disabled={noStore()}
            />

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <TimeInput
                    label="Shared Max Age (s-maxage)"
                    value={sMaxAgeValue()}
                    unit={sMaxAgeUnit()}
                    enabled={sMaxAgeEnabled()}
                    onValueChange={setSMaxAgeValue}
                    onUnitChange={setSMaxAgeUnit}
                    onEnabledChange={setSMaxAgeEnabled}
                    description="Like max-age but only for shared caches (CDNs, proxies)."
                    disabled={noStore() || cacheability() === 'private'}
                  />
                </div>
              </TooltipTrigger>
              {cacheability() === 'private' && (
                <TooltipContent>
                  s-maxage cannot be used with private responses
                </TooltipContent>
              )}
            </Tooltip>
          </Card>
        </div>

        {/* Extensions Section */}
        <div>
          <h3 class="text-primary mb-3 text-lg font-medium">Extensions</h3>
          <Card class="space-y-4 p-4">
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <Checkbox
                  checked={staleWhileRevalidate()}
                  onChange={(checked) => setStaleWhileRevalidate(checked)}
                  disabled={noStore()}
                >
                  <div class="flex items-center space-x-2">
                    <CheckboxControl />
                    <CheckboxLabel class="text-sm leading-none font-medium">
                      Stale While Revalidate
                    </CheckboxLabel>
                  </div>
                </Checkbox>
              </div>
              <p class="text-muted-foreground ml-6 text-xs">
                Allows serving stale content while revalidating in the
                background.
              </p>
              {staleWhileRevalidate() && (
                <div class="mt-2 ml-6 flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    class="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus-visible:ring-1"
                    value={staleWhileRevalidateValue()}
                    onInput={(e) => {
                      const value = parseInt(
                        (e.target as HTMLInputElement).value,
                        10,
                      );
                      setStaleWhileRevalidateValue(isNaN(value) ? 0 : value);
                    }}
                    disabled={noStore() || !staleWhileRevalidate()}
                  />
                  <select
                    value={staleWhileRevalidateUnit()}
                    onChange={(e) =>
                      setStaleWhileRevalidateUnit(
                        (e.target as HTMLSelectElement).value as TimeUnit,
                      )
                    }
                    class="border-input bg-background inline-flex h-9 min-w-[100px] items-center rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus-visible:ring-1"
                    disabled={noStore() || !staleWhileRevalidate()}
                  >
                    <option value="seconds">seconds</option>
                    <option value="minutes">minutes</option>
                    <option value="hours">hours</option>
                    <option value="days">days</option>
                  </select>
                </div>
              )}
            </div>

            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <Checkbox
                  checked={staleIfError()}
                  onChange={(checked) => setStaleIfError(checked)}
                  disabled={noStore()}
                >
                  <div class="flex items-center space-x-2">
                    <CheckboxControl />
                    <CheckboxLabel class="text-sm leading-none font-medium">
                      Stale If Error
                    </CheckboxLabel>
                  </div>
                </Checkbox>
              </div>
              <p class="text-muted-foreground ml-6 text-xs">
                Allows using stale content when the origin server is
                unavailable.
              </p>
              {staleIfError() && (
                <div class="mt-2 ml-6 flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    class="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus-visible:ring-1"
                    value={staleIfErrorValue()}
                    onInput={(e) => {
                      const value = parseInt(
                        (e.target as HTMLInputElement).value,
                        10,
                      );
                      setStaleIfErrorValue(isNaN(value) ? 0 : value);
                    }}
                    disabled={noStore() || !staleIfError()}
                  />
                  <select
                    value={staleIfErrorUnit()}
                    onChange={(e) =>
                      setStaleIfErrorUnit(
                        (e.target as HTMLSelectElement).value as TimeUnit,
                      )
                    }
                    class="border-input bg-background inline-flex h-9 min-w-[100px] items-center rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus-visible:ring-1"
                    disabled={noStore() || !staleIfError()}
                  >
                    <option value="seconds">seconds</option>
                    <option value="minutes">minutes</option>
                    <option value="hours">hours</option>
                    <option value="days">days</option>
                  </select>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Other Section */}
        <div>
          <h3 class="text-primary mb-3 text-lg font-medium">
            Other Directives
          </h3>
          <Card class="space-y-4 p-4">
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <Checkbox
                  checked={noTransform()}
                  onChange={(checked) => setNoTransform(checked)}
                >
                  <div class="flex items-center space-x-2">
                    <CheckboxControl />
                    <CheckboxLabel class="text-sm leading-none font-medium">
                      No Transform
                    </CheckboxLabel>
                  </div>
                </Checkbox>
              </div>
              <p class="text-muted-foreground ml-6 text-xs">
                Prevents caches from modifying the response content (like image
                compression).
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
