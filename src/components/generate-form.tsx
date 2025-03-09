import { TimeInput } from '@/components/time-input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
} from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { directives, parseHeader } from '@/lib/cache-control';
import { cn } from '@/lib/utils';
import { createEffect, createSignal, type Component } from 'solid-js';

// SectionDescription component for section headers
const SectionDescription: Component<{ title: string; description: string }> = (
  props,
) => {
  return (
    <div class="mb-3">
      <h3 class="text-primary text-lg font-medium">{props.title}</h3>
      <p class="text-muted-foreground mt-1 text-sm">{props.description}</p>
    </div>
  );
};

interface GenerateFormProps {
  headerValue: string;
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

// Helper function to parse seconds to a unit and value
const parseSeconds = (seconds: number): { value: number; unit: TimeUnit } => {
  if (seconds % (60 * 60 * 24) === 0 && seconds >= 60 * 60 * 24) {
    return { value: seconds / (60 * 60 * 24), unit: 'days' };
  }
  if (seconds % (60 * 60) === 0 && seconds >= 60 * 60) {
    return { value: seconds / (60 * 60), unit: 'hours' };
  }
  if (seconds % 60 === 0 && seconds >= 60) {
    return { value: seconds / 60, unit: 'minutes' };
  }
  return { value: seconds, unit: 'seconds' };
};

// Constants for warnings
const ONE_YEAR_IN_SECONDS = 31536000; // 365 days

export const GenerateForm: Component<GenerateFormProps> = (props) => {
  // State for Cache Type section (mutually exclusive radio buttons)
  const [cacheType, setCacheType] = createSignal<
    'public' | 'private' | 'no-store'
  >('public');

  // State for Cache Behavior for Fresh Responses section (mutually exclusive)
  const [freshBehavior, setFreshBehavior] = createSignal<
    'default' | 'no-cache'
  >('default');

  // State for validation options
  const [mustRevalidate, setMustRevalidate] = createSignal(false);
  const [proxyRevalidate, setProxyRevalidate] = createSignal(false);
  const [immutable, setImmutable] = createSignal(false);

  // Max-age state
  const [maxAgeEnabled, setMaxAgeEnabled] = createSignal(false);
  const [maxAgeValue, setMaxAgeValue] = createSignal(3600);
  const [maxAgeUnit, setMaxAgeUnit] = createSignal<TimeUnit>('seconds');

  // S-maxage state
  const [sMaxAgeEnabled, setSMaxAgeEnabled] = createSignal(false);
  const [sMaxAgeValue, setSMaxAgeValue] = createSignal(3600);
  const [sMaxAgeUnit, setSMaxAgeUnit] = createSignal<TimeUnit>('seconds');

  // Stale-while-revalidate state
  const [staleWhileRevalidateEnabled, setStaleWhileRevalidateEnabled] =
    createSignal(false);
  const [staleWhileRevalidateValue, setStaleWhileRevalidateValue] =
    createSignal(60);
  const [staleWhileRevalidateUnit, setStaleWhileRevalidateUnit] =
    createSignal<TimeUnit>('seconds');

  // Stale-if-error state
  const [staleIfErrorEnabled, setStaleIfErrorEnabled] = createSignal(false);
  const [staleIfErrorValue, setStaleIfErrorValue] = createSignal(300);
  const [staleIfErrorUnit, setStaleIfErrorUnit] =
    createSignal<TimeUnit>('seconds');

  // No-transform state
  const [noTransform, setNoTransform] = createSignal(false);

  // Track last parsed header to avoid redundant parsing
  const [lastParsedHeader, setLastParsedHeader] = createSignal('');

  // Effect to update form state based on header input
  createEffect(() => {
    const headerValue = props.headerValue;

    // Skip processing if the header value hasn't changed
    if (headerValue === lastParsedHeader()) return;

    // Update our tracking of the last parsed header
    setLastParsedHeader(headerValue);

    // If header is empty, reset to default state but don't emit changes
    if (!headerValue) {
      resetForm(false);
      return;
    }

    // Parse the header into directives
    const parsedDirectives = parseHeader(headerValue);

    // Reset form first to clear any previous state
    resetForm(false);

    // Update cache type
    if (parsedDirectives.some((d) => d.name === 'no-store')) {
      setCacheType('no-store');
    } else if (parsedDirectives.some((d) => d.name === 'private')) {
      setCacheType('private');
    } else if (parsedDirectives.some((d) => d.name === 'public')) {
      setCacheType('public');
    } else {
      setCacheType('public'); // Default to public if not specified
    }

    // Update fresh behavior
    if (parsedDirectives.some((d) => d.name === 'no-cache')) {
      setFreshBehavior('no-cache');
    } else {
      setFreshBehavior('default');
    }

    // Update validation options
    setMustRevalidate(
      parsedDirectives.some((d) => d.name === 'must-revalidate'),
    );
    setProxyRevalidate(
      parsedDirectives.some((d) => d.name === 'proxy-revalidate'),
    );
    setImmutable(parsedDirectives.some((d) => d.name === 'immutable'));
    setNoTransform(parsedDirectives.some((d) => d.name === 'no-transform'));

    // Update max-age
    const maxAgeDirective = parsedDirectives.find((d) => d.name === 'max-age');
    if (maxAgeDirective && maxAgeDirective.value) {
      const seconds = parseInt(maxAgeDirective.value, 10);
      if (!isNaN(seconds)) {
        const { value, unit } = parseSeconds(seconds);
        setMaxAgeEnabled(true);
        setMaxAgeValue(value);
        setMaxAgeUnit(unit);
      }
    }

    // Update s-maxage
    const sMaxAgeDirective = parsedDirectives.find(
      (d) => d.name === 's-maxage',
    );
    if (sMaxAgeDirective && sMaxAgeDirective.value) {
      const seconds = parseInt(sMaxAgeDirective.value, 10);
      if (!isNaN(seconds)) {
        const { value, unit } = parseSeconds(seconds);
        setSMaxAgeEnabled(true);
        setSMaxAgeValue(value);
        setSMaxAgeUnit(unit);
      }
    }

    // Update stale-while-revalidate
    const swrDirective = parsedDirectives.find(
      (d) => d.name === 'stale-while-revalidate',
    );
    if (swrDirective && swrDirective.value) {
      const seconds = parseInt(swrDirective.value, 10);
      if (!isNaN(seconds)) {
        const { value, unit } = parseSeconds(seconds);
        setStaleWhileRevalidateEnabled(true);
        setStaleWhileRevalidateValue(value);
        setStaleWhileRevalidateUnit(unit);
      }
    }

    // Update stale-if-error
    const sieDirective = parsedDirectives.find(
      (d) => d.name === 'stale-if-error',
    );
    if (sieDirective && sieDirective.value) {
      const seconds = parseInt(sieDirective.value, 10);
      if (!isNaN(seconds)) {
        const { value, unit } = parseSeconds(seconds);
        setStaleIfErrorEnabled(true);
        setStaleIfErrorValue(value);
        setStaleIfErrorUnit(unit);
      }
    }
  });

  // Computed property to check if all inputs should be disabled based on no-store
  const isNoStore = () => cacheType() === 'no-store';

  // Computed property to check for max-age=0 warning
  const hasMaxAgeZero = () => maxAgeEnabled() && maxAgeValue() === 0;

  // Computed properties to check for large durations
  const maxAgeExceedsYear = () => {
    if (!maxAgeEnabled()) return false;
    return convertToSeconds(maxAgeValue(), maxAgeUnit()) > ONE_YEAR_IN_SECONDS;
  };

  const sMaxAgeExceedsYear = () => {
    if (!sMaxAgeEnabled()) return false;
    return (
      convertToSeconds(sMaxAgeValue(), sMaxAgeUnit()) > ONE_YEAR_IN_SECONDS
    );
  };

  const staleWhileRevalidateExceedsYear = () => {
    if (!staleWhileRevalidateEnabled()) return false;
    return (
      convertToSeconds(
        staleWhileRevalidateValue(),
        staleWhileRevalidateUnit(),
      ) > ONE_YEAR_IN_SECONDS
    );
  };

  const staleIfErrorExceedsYear = () => {
    if (!staleIfErrorEnabled()) return false;
    return (
      convertToSeconds(staleIfErrorValue(), staleIfErrorUnit()) >
      ONE_YEAR_IN_SECONDS
    );
  };

  // Effect to handle mutual exclusions and interactions
  createEffect(() => {
    // If no-store is selected, disable other caching options
    if (isNoStore()) {
      setMaxAgeEnabled(false);
      setSMaxAgeEnabled(false);
      setMustRevalidate(false);
      setProxyRevalidate(false);
      setImmutable(false);
      setStaleWhileRevalidateEnabled(false);
      setStaleIfErrorEnabled(false);
      setFreshBehavior('default');
    }

    // If private cache type, disable s-maxage and proxy-revalidate
    if (cacheType() === 'private') {
      setSMaxAgeEnabled(false);
      setProxyRevalidate(false);
    }

    // Generate header on any state change
    generateHeader();
  });

  // Function to reset form to default state
  const resetForm = (emitChanges = true) => {
    // Cache type and behavior
    setCacheType('public');
    setFreshBehavior('default');

    // Validation options
    setMustRevalidate(false);
    setProxyRevalidate(false);
    setImmutable(false);
    setNoTransform(false);

    // Time-based directives
    setMaxAgeEnabled(false);
    setMaxAgeValue(3600);
    setMaxAgeUnit('seconds');
    setSMaxAgeEnabled(false);
    setSMaxAgeValue(3600);
    setSMaxAgeUnit('seconds');

    // Extensions
    setStaleWhileRevalidateEnabled(false);
    setStaleWhileRevalidateValue(60);
    setStaleWhileRevalidateUnit('seconds');
    setStaleIfErrorEnabled(false);
    setStaleIfErrorValue(300);
    setStaleIfErrorUnit('seconds');

    // Generate and emit the header if requested
    if (emitChanges) {
      generateHeader();
    }
  };

  // Function to generate the Cache-Control header based on form state
  const generateHeader = () => {
    const directives = [];

    // Cache Type directives
    if (cacheType() === 'public') directives.push('public');
    if (cacheType() === 'private') directives.push('private');
    if (cacheType() === 'no-store') directives.push('no-store');

    // Fresh Behavior directives
    if (freshBehavior() === 'no-cache') directives.push('no-cache');

    // Validation directives
    if (mustRevalidate()) directives.push('must-revalidate');
    if (proxyRevalidate() && cacheType() === 'public')
      directives.push('proxy-revalidate');
    if (immutable()) directives.push('immutable');

    // Time-based directives
    if (maxAgeEnabled() && !isNoStore()) {
      const maxAgeSecs = convertToSeconds(maxAgeValue(), maxAgeUnit());
      directives.push(`max-age=${maxAgeSecs}`);
    }

    if (sMaxAgeEnabled() && !isNoStore() && cacheType() === 'public') {
      const sMaxAgeSecs = convertToSeconds(sMaxAgeValue(), sMaxAgeUnit());
      directives.push(`s-maxage=${sMaxAgeSecs}`);
    }

    // Other directives
    if (noTransform()) directives.push('no-transform');

    // Extensions
    if (staleWhileRevalidateEnabled() && !isNoStore()) {
      const staleWhileRevalidateSecs = convertToSeconds(
        staleWhileRevalidateValue(),
        staleWhileRevalidateUnit(),
      );
      directives.push(`stale-while-revalidate=${staleWhileRevalidateSecs}`);
    }

    if (staleIfErrorEnabled() && !isNoStore()) {
      const staleIfErrorSecs = convertToSeconds(
        staleIfErrorValue(),
        staleIfErrorUnit(),
      );
      directives.push(`stale-if-error=${staleIfErrorSecs}`);
    }

    // Sort directives alphabetically for readability
    directives.sort();

    // Create the final header value
    const headerValue = directives.join(', ');

    // Only update if the header value actually changed
    if (headerValue !== lastParsedHeader()) {
      // Update tracking to avoid circular processing
      setLastParsedHeader(headerValue);

      // Notify parent of new value
      props.onGenerate(headerValue);
    }
  };

  return (
    <div class={cn('space-y-6', props.class)}>
      <div class="space-y-6">
        {/* 1. Cache Type Section */}
        <div>
          <SectionDescription
            title="1. Cache Type"
            description="Determines which caches can store the response. This is the most basic setting for controlling caching behavior."
          />
          <Card class="space-y-4 p-4">
            <div class="space-y-3">
              <p class="text-sm font-medium">
                Select how the response can be cached:
              </p>
              <div class="flex flex-col gap-4">
                <div>
                  <label class="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="cacheType"
                      value="public"
                      checked={cacheType() === 'public'}
                      onChange={() => setCacheType('public')}
                      class="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                    />
                    <span class="text-sm leading-none font-medium">Public</span>
                  </label>
                  <div class="mt-2 ml-6">
                    <p class="text-sm">{directives.public.description}</p>
                    <p class="text-muted-foreground border-primary/20 mt-1 border-l-2 pl-2 text-xs">
                      Suitable for content that can be shared among multiple
                      users, such as static images or CSS files.
                    </p>
                  </div>
                </div>

                <div>
                  <label class="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="cacheType"
                      value="private"
                      checked={cacheType() === 'private'}
                      onChange={() => setCacheType('private')}
                      class="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                    />
                    <span class="text-sm leading-none font-medium">
                      Private
                    </span>
                  </label>
                  <div class="mt-2 ml-6">
                    <p class="text-sm">{directives.private.description}</p>
                    <p class="text-muted-foreground border-primary/20 mt-1 border-l-2 pl-2 text-xs">
                      Use this for personalized content or data that should not
                      be shared, like user-specific pages.
                    </p>
                  </div>
                </div>

                <div>
                  <label class="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="cacheType"
                      value="no-store"
                      checked={cacheType() === 'no-store'}
                      onChange={() => setCacheType('no-store')}
                      class="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                    />
                    <span class="text-sm leading-none font-medium">
                      No caching (no-store)
                    </span>
                  </label>
                  <div class="mt-2 ml-6">
                    <p class="text-sm">{directives['no-store'].description}</p>
                    <p class="text-muted-foreground border-primary/20 mt-1 border-l-2 pl-2 text-xs">
                      Ensures that no part of the response is cached, important
                      for privacy and security. This overrides all other
                      directives.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 2. Freshness Duration Section */}
        <div class={isNoStore() ? 'opacity-50' : ''}>
          <SectionDescription
            title="2. Freshness Duration"
            description="Controls how long the response can be used before it becomes stale and potentially needs revalidation."
          />
          <Card class="space-y-4 p-4">
            <div>
              <TimeInput
                label="Max Age"
                value={maxAgeValue()}
                unit={maxAgeUnit()}
                enabled={maxAgeEnabled()}
                onValueChange={setMaxAgeValue}
                onUnitChange={setMaxAgeUnit}
                onEnabledChange={setMaxAgeEnabled}
                description={`${directives['max-age'].description} After this time, the cache must revalidate the response with the server.`}
                disabled={isNoStore()}
              />
            </div>

            {hasMaxAgeZero() && (
              <Alert variant="warning" class="mt-2">
                <AlertTitle>Note:</AlertTitle>
                <AlertDescription>
                  Setting max-age=0 means the response is stale immediately,
                  requiring revalidation.
                </AlertDescription>
              </Alert>
            )}

            {maxAgeExceedsYear() && (
              <Alert variant="warning" class="mt-2">
                <AlertTitle>Warning:</AlertTitle>
                <AlertDescription>
                  You've set a very long max-age value (over 1 year). This may
                  lead to outdated content being served for an extended period.
                </AlertDescription>
              </Alert>
            )}

            <div>
              <TimeInput
                label="Shared Max Age (s-maxage)"
                value={sMaxAgeValue()}
                unit={sMaxAgeUnit()}
                enabled={sMaxAgeEnabled()}
                onValueChange={setSMaxAgeValue}
                onUnitChange={setSMaxAgeUnit}
                onEnabledChange={setSMaxAgeEnabled}
                description={`${directives['s-maxage'].description} Allows setting a different freshness duration for shared caches like CDNs.`}
                disabled={isNoStore() || cacheType() === 'private'}
              />
            </div>

            {cacheType() === 'private' && (
              <p class="mt-1 text-sm text-yellow-600 dark:text-yellow-500">
                s-maxage is only available with Public cache type
              </p>
            )}

            {sMaxAgeExceedsYear() && (
              <Alert variant="warning" class="mt-2">
                <AlertTitle>Warning:</AlertTitle>
                <AlertDescription>
                  You've set a very long s-maxage value (over 1 year). This may
                  lead to outdated content being served by CDNs for an extended
                  period.
                </AlertDescription>
              </Alert>
            )}

            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <Checkbox
                  checked={immutable()}
                  onChange={(checked) => setImmutable(checked)}
                  disabled={isNoStore()}
                >
                  <div class="flex items-center space-x-2">
                    <CheckboxControl />
                    <CheckboxLabel class="text-sm leading-none font-medium">
                      Immutable
                    </CheckboxLabel>
                  </div>
                </Checkbox>
              </div>
              <p class="text-muted-foreground text-sm">
                {directives.immutable.description} Best for versioned static
                assets with hashed filenames that never change.
              </p>
              {immutable() && (
                <Alert variant="warning" class="mt-2">
                  <AlertTitle>Support Information:</AlertTitle>
                  <AlertDescription>
                    <ul class="list-disc space-y-1 pl-4">
                      <li>
                        <strong>Browsers:</strong> Supported in Chrome, Firefox,
                        and Edge, but has inconsistent support in Safari
                      </li>
                      <li>
                        <strong>Required:</strong> HTTP/2 or newer protocol
                      </li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </Card>
        </div>

        {/* 3. Cache Behavior for Fresh Responses */}
        <div class={isNoStore() ? 'opacity-50' : ''}>
          <SectionDescription
            title="3. Cache Behavior for Fresh Responses"
            description="Controls whether fresh responses (within their freshness lifetime) can be used without checking with the server first."
          />
          <Card class="space-y-4 p-4">
            <div class="space-y-3">
              <p class="text-sm font-medium">
                How should caches handle responses that are still fresh?
              </p>
              <div class="flex flex-col gap-4">
                <div>
                  <label class="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="freshBehavior"
                      value="default"
                      checked={freshBehavior() === 'default'}
                      onChange={() => setFreshBehavior('default')}
                      disabled={isNoStore()}
                      class="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                    />
                    <span class="text-sm leading-none font-medium">
                      Use fresh responses without revalidation
                    </span>
                  </label>
                  <div class="mt-2 ml-6">
                    <p class="text-sm">
                      This is the default behavior; the cache uses the response
                      if within its freshness period.
                    </p>
                    <p class="text-muted-foreground border-primary/20 mt-1 border-l-2 pl-2 text-xs">
                      Caches can serve the response directly without contacting
                      the origin server as long as it's within the max-age
                      timeframe.
                    </p>
                  </div>
                </div>

                <div>
                  <label class="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="freshBehavior"
                      value="no-cache"
                      checked={freshBehavior() === 'no-cache'}
                      onChange={() => setFreshBehavior('no-cache')}
                      disabled={isNoStore()}
                      class="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                    />
                    <span class="text-sm leading-none font-medium">
                      Always revalidate fresh responses (no-cache)
                    </span>
                  </label>
                  <div class="mt-2 ml-6">
                    <p class="text-sm">{directives['no-cache'].description}</p>
                    <p class="text-muted-foreground border-primary/20 mt-1 border-l-2 pl-2 text-xs">
                      Forces revalidation even for fresh responses, potentially
                      increasing server load. Can be combined with max-age, but
                      max-age still defines the freshness period.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 4. Cache Behavior for Stale Responses */}
        <div class={isNoStore() ? 'opacity-50' : ''}>
          <SectionDescription
            title="4. Cache Behavior for Stale Responses"
            description="Controls how caches handle responses after they've become stale (exceeded their freshness lifetime)."
          />
          <Card class="space-y-4 p-4">
            <div class="space-y-3">
              <div class="flex items-center space-x-2">
                <Checkbox
                  checked={mustRevalidate()}
                  onChange={(checked) => setMustRevalidate(checked)}
                  disabled={isNoStore()}
                >
                  <div class="flex items-center space-x-2">
                    <CheckboxControl />
                    <CheckboxLabel class="text-sm leading-none font-medium">
                      Must Revalidate
                    </CheckboxLabel>
                  </div>
                </Checkbox>
              </div>
              <div class="mt-2 ml-6">
                <p class="text-sm">
                  {directives['must-revalidate'].description}
                </p>
                <p class="text-muted-foreground border-primary/20 mt-1 border-l-2 pl-2 text-xs">
                  Ensures that stale responses are not used without checking
                  with the server, improving accuracy.
                </p>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-center space-x-2">
                <Checkbox
                  checked={proxyRevalidate()}
                  onChange={(checked) => setProxyRevalidate(checked)}
                  disabled={isNoStore() || cacheType() === 'private'}
                >
                  <div class="flex items-center space-x-2">
                    <CheckboxControl />
                    <CheckboxLabel class="text-sm leading-none font-medium">
                      Proxy Revalidate
                    </CheckboxLabel>
                  </div>
                </Checkbox>
              </div>
              <div class="mt-2 ml-6">
                <p class="text-sm">
                  {directives['proxy-revalidate'].description}
                </p>
                <p class="text-muted-foreground border-primary/20 mt-1 border-l-2 pl-2 text-xs">
                  Allows private caches to serve stale responses while requiring
                  shared caches to revalidate.
                </p>
              </div>
              {cacheType() === 'private' && (
                <p class="text-sm text-yellow-600 dark:text-yellow-500">
                  Only available with Public cache type
                </p>
              )}
            </div>

            <div class="border-border mt-2 space-y-3 border-t pt-2">
              <div>
                <TimeInput
                  label="Stale While Revalidate"
                  value={staleWhileRevalidateValue()}
                  unit={staleWhileRevalidateUnit()}
                  enabled={staleWhileRevalidateEnabled()}
                  onValueChange={setStaleWhileRevalidateValue}
                  onUnitChange={setStaleWhileRevalidateUnit}
                  onEnabledChange={setStaleWhileRevalidateEnabled}
                  description="Allows a stale response to be served while a background revalidation occurs."
                  disabled={isNoStore()}
                />
              </div>

              {staleWhileRevalidateEnabled() && (
                <Alert variant="warning" class="mt-2">
                  <AlertTitle>Support Information:</AlertTitle>
                  <AlertDescription>
                    <ul class="list-disc space-y-1 pl-4">
                      <li>
                        <strong>CDNs:</strong> Cloudflare (Enterprise plan),
                        Fastly (full support), Akamai (full support)
                      </li>
                      <li>
                        <strong>Not supported natively:</strong> AWS CloudFront
                        (requires Lambda@Edge)
                      </li>
                      <li>
                        <strong>Browsers:</strong> Chrome, Firefox, Edge support
                        it; Safari has limited support
                      </li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {staleWhileRevalidateExceedsYear() && (
                <Alert variant="warning" class="mt-2">
                  <AlertTitle>Warning:</AlertTitle>
                  <AlertDescription>
                    You've set a very long stale-while-revalidate value (over 1
                    year). This may lead to very outdated content being served.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div class="border-border mt-2 space-y-3 border-t pt-2">
              <div>
                <TimeInput
                  label="Stale If Error"
                  value={staleIfErrorValue()}
                  unit={staleIfErrorUnit()}
                  enabled={staleIfErrorEnabled()}
                  onValueChange={setStaleIfErrorValue}
                  onUnitChange={setStaleIfErrorUnit}
                  onEnabledChange={setStaleIfErrorEnabled}
                  description="Allows a stale response to be served if the origin server returns an error."
                  disabled={isNoStore()}
                />
              </div>

              {staleIfErrorEnabled() && (
                <Alert variant="warning" class="mt-2">
                  <AlertTitle>Support Information:</AlertTitle>
                  <AlertDescription>
                    <ul class="list-disc space-y-1 pl-4">
                      <li>
                        <strong>CDNs:</strong> Cloudflare (Enterprise plan),
                        Fastly (full support), Akamai (supported)
                      </li>
                      <li>
                        <strong>Not supported:</strong> AWS CloudFront (no
                        native support)
                      </li>
                      <li>
                        <strong>Browsers:</strong> Limited support (mainly
                        Chrome)
                      </li>
                      <li>
                        <strong>Varnish:</strong> Available through custom VCL
                        configuration
                      </li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {staleIfErrorExceedsYear() && (
                <Alert variant="warning" class="mt-2">
                  <AlertTitle>Warning:</AlertTitle>
                  <AlertDescription>
                    You've set a very long stale-if-error value (over 1 year).
                    This may lead to very outdated content being served during
                    errors.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </Card>
        </div>

        {/* 5. Other Directives */}
        <div>
          <SectionDescription
            title="5. Other Directives"
            description="Additional controls that can be applied to all responses regardless of cache status."
          />
          <Card class="space-y-4 p-4">
            <div class="space-y-3">
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
              <div class="mt-2 ml-6">
                <p class="text-sm">{directives['no-transform'].description}</p>
                <p class="text-muted-foreground border-primary/20 mt-1 border-l-2 pl-2 text-xs">
                  Ensures content integrity by preventing proxies from modifying
                  your content.
                </p>
              </div>
              {noTransform() && (
                <div class="mt-2 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/20">
                  <p class="text-sm text-blue-700 dark:text-blue-400">
                    <strong>Use Case:</strong> Add this when proxies should not
                    compress your images, transform your JSON formats, or alter
                    your content in any way that would change the bytes received
                    by the client.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Reset Button */}
        <div class="flex justify-end">
          <Button variant="outline" onClick={() => resetForm()} class="text-sm">
            Reset to Defaults
          </Button>
        </div>

        {/* Directive Interactions Info */}
        <div>
          <Separator class="my-4" />
          <h3 class="text-primary mb-3 text-lg font-medium">
            Directive Interactions
          </h3>
          <div class="text-muted-foreground space-y-2 text-sm">
            <p>
              • <strong>no-store</strong> overrides all other directives; no
              caching occurs
            </p>
            <p>
              • <strong>no-cache</strong> requires revalidation even for fresh
              responses
            </p>
            <p>
              • <strong>s-maxage</strong> only applies to shared caches
              (relevant only for Public cache type)
            </p>
            <p>
              • <strong>immutable</strong> hints at indefinite caching (HTTP/2+
              support varies)
            </p>
            <p>
              • <strong>must-revalidate</strong> requires revalidation when
              stale
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
