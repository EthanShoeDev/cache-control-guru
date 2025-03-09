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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { directives } from '@/lib/cache-control';
import { createEffect, createSignal, Show, type Component } from 'solid-js';

// InfoIcon component for tooltips
const InfoIcon: Component<{ tooltip: string }> = (props) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span class="inline-flex items-center justify-center ml-1 w-4 h-4 rounded-full bg-primary/10 text-primary hover:bg-primary/20 cursor-help text-xs">
          i
        </span>
      </TooltipTrigger>
      <TooltipContent class="max-w-[300px]">
        {props.tooltip}
      </TooltipContent>
    </Tooltip>
  );
};

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

// Constants for warnings
const ONE_YEAR_IN_SECONDS = 31536000; // 365 days

export const GenerateForm: Component<GenerateFormProps> = (props) => {
  // State for Cache Type section (mutually exclusive radio buttons)
  const [cacheType, setCacheType] = createSignal<'public' | 'private' | 'no-store'>(
    'public'
  );

  // State for Cache Behavior for Fresh Responses section (mutually exclusive)
  const [freshBehavior, setFreshBehavior] = createSignal<'default' | 'no-cache'>(
    'default'
  );

  // State for validation options
  const [mustRevalidate, setMustRevalidate] = createSignal(false);
  const [proxyRevalidate, setProxyRevalidate] = createSignal(false);
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
  const [staleWhileRevalidateEnabled, setStaleWhileRevalidateEnabled] = createSignal(false);
  const [staleWhileRevalidateValue, setStaleWhileRevalidateValue] = createSignal(60);
  const [staleWhileRevalidateUnit, setStaleWhileRevalidateUnit] = createSignal<TimeUnit>('seconds');

  // Stale-if-error state
  const [staleIfErrorEnabled, setStaleIfErrorEnabled] = createSignal(false);
  const [staleIfErrorValue, setStaleIfErrorValue] = createSignal(300);
  const [staleIfErrorUnit, setStaleIfErrorUnit] = createSignal<TimeUnit>('seconds');

  // No-transform state
  const [noTransform, setNoTransform] = createSignal(false);

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
    return convertToSeconds(sMaxAgeValue(), sMaxAgeUnit()) > ONE_YEAR_IN_SECONDS;
  };

  const staleWhileRevalidateExceedsYear = () => {
    if (!staleWhileRevalidateEnabled()) return false;
    return convertToSeconds(staleWhileRevalidateValue(), staleWhileRevalidateUnit()) > ONE_YEAR_IN_SECONDS;
  };

  const staleIfErrorExceedsYear = () => {
    if (!staleIfErrorEnabled()) return false;
    return convertToSeconds(staleIfErrorValue(), staleIfErrorUnit()) > ONE_YEAR_IN_SECONDS;
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
  const resetForm = () => {
    setCacheType('public');
    setFreshBehavior('default');
    setMaxAgeEnabled(true);
    setMaxAgeValue(3600);
    setMaxAgeUnit('seconds');
    setSMaxAgeEnabled(false);
    setSMaxAgeValue(3600);
    setSMaxAgeUnit('seconds');
    setMustRevalidate(false);
    setProxyRevalidate(false);
    setImmutable(false);
    setStaleWhileRevalidateEnabled(false);
    setStaleWhileRevalidateValue(60);
    setStaleWhileRevalidateUnit('seconds');
    setStaleIfErrorEnabled(false);
    setStaleIfErrorValue(300);
    setStaleIfErrorUnit('seconds');
    setNoTransform(false);
  };

  // Function to generate the Cache-Control header
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
    if (proxyRevalidate() && cacheType() === 'public') directives.push('proxy-revalidate');
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
    
    const headerValue = directives.join(', ');
    props.onGenerate(headerValue);
  };

  return (
    <div class={cn('space-y-6', props.class)}>
      <div class="space-y-6">
        {/* 1. Cache Type Section */}
        <div>
          <h3 class="text-primary mb-3 text-lg font-medium">1. Cache Type</h3>
          <Card class="space-y-4 p-4">
            <div class="space-y-3">
              <p class="text-sm font-medium">Select how the response can be cached:</p>
              <div class="flex flex-col gap-2">
                <label class="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="cacheType"
                    value="public"
                    checked={cacheType() === 'public'}
                    onChange={() => setCacheType('public')}
                    class="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                  />
                  <span class="text-sm leading-none font-medium flex items-center">
                    Public
                    <InfoIcon tooltip="Suitable for content that can be shared among multiple users, such as static images or CSS files." />
                  </span>
                </label>
                <p class="text-muted-foreground ml-6 text-xs">
                  {directives.public.description}
                </p>

                <label class="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="cacheType"
                    value="private"
                    checked={cacheType() === 'private'}
                    onChange={() => setCacheType('private')}
                    class="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                  />
                  <span class="text-sm leading-none font-medium flex items-center">
                    Private
                    <InfoIcon tooltip="Use for personalized content or data that should not be shared, like user-specific pages." />
                  </span>
                </label>
                <p class="text-muted-foreground ml-6 text-xs">
                  {directives.private.description}
                </p>

                <label class="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="cacheType"
                    value="no-store"
                    checked={cacheType() === 'no-store'}
                    onChange={() => setCacheType('no-store')}
                    class="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                  />
                  <span class="text-sm leading-none font-medium flex items-center">
                    No caching (no-store)
                    <InfoIcon tooltip="Ensures that no part of the response is cached, important for privacy and security, overrides all other directives." />
                  </span>
                </label>
                <p class="text-muted-foreground ml-6 text-xs">
                  {directives['no-store'].description}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* 2. Freshness Duration Section */}
        <div class={isNoStore() ? 'opacity-50' : ''}>
          <h3 class="text-primary mb-3 text-lg font-medium">2. Freshness Duration</h3>
          <Card class="space-y-4 p-4">
            <div className="relative">
              <TimeInput
                label={
                  <div class="flex items-center">
                    Max Age
                    <InfoIcon tooltip="Specifies the maximum time the response is considered fresh. After this time, the cache must revalidate the response with the server." />
                  </div>
                }
                value={maxAgeValue()}
                unit={maxAgeUnit()}
                enabled={maxAgeEnabled()}
                onValueChange={setMaxAgeValue}
                onUnitChange={setMaxAgeUnit}
                onEnabledChange={setMaxAgeEnabled}
                description={directives['max-age'].description}
                disabled={isNoStore()}
              />
            </div>

            {hasMaxAgeZero() && (
              <Alert variant="warning" class="mt-2">
                <AlertTitle>Note:</AlertTitle>
                <AlertDescription>
                  Setting max-age=0 means the response is stale immediately, requiring revalidation.
                </AlertDescription>
              </Alert>
            )}

            {maxAgeExceedsYear() && (
              <Alert variant="warning" class="mt-2">
                <AlertTitle>Warning:</AlertTitle>
                <AlertDescription>
                  You've set a very long max-age value (over 1 year). This may lead to outdated content being served for an extended period.
                </AlertDescription>
              </Alert>
            )}

            <div className="relative">
              <TimeInput
                label={
                  <div class="flex items-center">
                    Shared Max Age (s-maxage)
                    <InfoIcon tooltip={
                      cacheType() === 'private' 
                        ? "s-maxage cannot be used with private responses" 
                        : "Similar to max-age, but only for shared caches. Allows setting a different freshness duration for shared caches like CDNs."
                    } />
                  </div>
                }
                value={sMaxAgeValue()}
                unit={sMaxAgeUnit()}
                enabled={sMaxAgeEnabled()}
                onValueChange={setSMaxAgeValue}
                onUnitChange={setSMaxAgeUnit}
                onEnabledChange={setSMaxAgeEnabled}
                description={directives['s-maxage'].description}
                disabled={isNoStore() || cacheType() === 'private'}
              />
            </div>

            {cacheType() === 'private' && (
              <p class="text-yellow-600 dark:text-yellow-500 ml-6 text-xs mt-1">
                s-maxage is only available with Public cache type
              </p>
            )}

            {sMaxAgeExceedsYear() && (
              <Alert variant="warning" class="mt-2">
                <AlertTitle>Warning:</AlertTitle>
                <AlertDescription>
                  You've set a very long s-maxage value (over 1 year). This may lead to outdated content being served by CDNs for an extended period.
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
                    <InfoIcon tooltip={directives.immutable.description} />
                  </div>
                </Checkbox>
              </div>
              <p class="text-muted-foreground ml-6 text-xs">
                Indicates that the response body will not change, so the cache can assume it's always fresh.
              </p>
              {immutable() && (
                <Alert variant="warning" class="mt-2 ml-6">
                  <AlertTitle>Support Information:</AlertTitle>
                  <AlertDescription>
                    <ul class="list-disc pl-4 space-y-1">
                      <li><strong>Browsers:</strong> Supported in Chrome, Firefox, and Edge, but has inconsistent support in Safari</li>
                      <li><strong>Required:</strong> HTTP/2 or newer protocol</li>
                      <li><strong>Best for:</strong> Versioned static assets with hashed filenames that never change</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </Card>
        </div>

        {/* 3. Cache Behavior for Fresh Responses */}
        <div class={isNoStore() ? 'opacity-50' : ''}>
          <h3 class="text-primary mb-3 text-lg font-medium">3. Cache Behavior for Fresh Responses</h3>
          <Card class="space-y-4 p-4">
            <div class="space-y-3">
              <p class="text-sm font-medium">How should caches handle responses that are still fresh?</p>
              <div class="flex flex-col gap-2">
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
                  <span class="text-sm leading-none font-medium flex items-center">
                    Use fresh responses without revalidation
                    <InfoIcon tooltip="This is the default behavior; the cache uses the response if within its freshness period, defined by max-age or s-maxage." />
                  </span>
                </label>
                <p class="text-muted-foreground ml-6 text-xs">
                  The cache can use the response without checking if it's still fresh.
                </p>

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
                  <span class="text-sm leading-none font-medium flex items-center">
                    Always revalidate fresh responses (no-cache)
                    <InfoIcon tooltip="Forces revalidation even for fresh responses, potentially increasing server load. Can be combined with max-age, but max-age still defines the freshness period." />
                  </span>
                </label>
                <p class="text-muted-foreground ml-6 text-xs">
                  {directives['no-cache'].description}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* 4. Cache Behavior for Stale Responses */}
        <div class={isNoStore() ? 'opacity-50' : ''}>
          <h3 class="text-primary mb-3 text-lg font-medium">4. Cache Behavior for Stale Responses</h3>
          <Card class="space-y-4 p-4">
            <div class="space-y-2">
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
                    <InfoIcon tooltip="Ensures that stale responses are not used without checking with the server, improving accuracy." />
                  </div>
                </Checkbox>
              </div>
              <p class="text-muted-foreground ml-6 text-xs">
                {directives['must-revalidate'].description}
              </p>
            </div>

            <div class="space-y-2">
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
                    <InfoIcon tooltip="Allows private caches to serve stale responses while requiring shared caches to revalidate, balancing performance and accuracy." />
                  </div>
                </Checkbox>
              </div>
              <p class="text-muted-foreground ml-6 text-xs">
                {directives['proxy-revalidate'].description}
              </p>
              {cacheType() === 'private' && proxyRevalidate() === false && (
                <p class="text-yellow-600 dark:text-yellow-500 ml-6 text-xs mt-1">
                  Only available with Public cache type
                </p>
              )}
            </div>

            <div class="relative">
              <TimeInput
                label={
                  <div class="flex items-center">
                    Stale While Revalidate
                    <InfoIcon tooltip={directives['stale-while-revalidate'].description} />
                  </div>
                }
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
                  <ul class="list-disc pl-4 space-y-1">
                    <li><strong>CDNs:</strong> Cloudflare (Enterprise plan), Fastly (full support), Akamai (full support)</li>
                    <li><strong>Not supported natively:</strong> AWS CloudFront (requires Lambda@Edge)</li>
                    <li><strong>Browsers:</strong> Chrome, Firefox, Edge support it; Safari has limited support</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {staleWhileRevalidateExceedsYear() && (
              <Alert variant="warning" class="mt-2">
                <AlertTitle>Warning:</AlertTitle>
                <AlertDescription>
                  You've set a very long stale-while-revalidate value (over 1 year). This may lead to very outdated content being served.
                </AlertDescription>
              </Alert>
            )}

            <div class="relative">
              <TimeInput
                label={
                  <div class="flex items-center">
                    Stale If Error
                    <InfoIcon tooltip={directives['stale-if-error'].description} />
                  </div>
                }
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
                  <ul class="list-disc pl-4 space-y-1">
                    <li><strong>CDNs:</strong> Cloudflare (Enterprise plan), Fastly (full support), Akamai (supported)</li>
                    <li><strong>Not supported:</strong> AWS CloudFront (no native support)</li>
                    <li><strong>Browsers:</strong> Limited support (mainly Chrome)</li>
                    <li><strong>Varnish:</strong> Available through custom VCL configuration</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {staleIfErrorExceedsYear() && (
              <Alert variant="warning" class="mt-2">
                <AlertTitle>Warning:</AlertTitle>
                <AlertDescription>
                  You've set a very long stale-if-error value (over 1 year). This may lead to very outdated content being served during errors.
                </AlertDescription>
              </Alert>
            )}
          </Card>
        </div>

        {/* 5. Other Directives */}
        <div>
          <h3 class="text-primary mb-3 text-lg font-medium">5. Other Directives</h3>
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
                    <InfoIcon tooltip="Ensures content integrity, important for resources where exact bytes matter, like APIs or specific media." />
                  </div>
                </Checkbox>
              </div>
              <p class="text-muted-foreground ml-6 text-xs">
                {directives['no-transform'].description}
              </p>
              {noTransform() && (
                <div class="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-md p-2 mt-2 ml-6">
                  <p class="text-xs text-blue-700 dark:text-blue-400">
                    <strong>Use Case:</strong> Add this when proxies should not compress your images, 
                    transform your JSON formats, or alter your content in any way that would 
                    change the bytes received by the client.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Reset Button */}
        <div class="flex justify-end">
          <Button 
            variant="outline" 
            onClick={resetForm}
            class="text-sm"
          >
            Reset to Defaults
          </Button>
        </div>

        {/* Directive Interactions Info */}
        <div>
          <Separator class="my-4" />
          <h3 class="text-primary mb-3 text-lg font-medium">Directive Interactions</h3>
          <div class="text-sm text-muted-foreground space-y-2">
            <p>• <strong>no-store</strong> overrides all other directives; no caching occurs</p>
            <p>• <strong>no-cache</strong> requires revalidation even for fresh responses</p>
            <p>• <strong>s-maxage</strong> only applies to shared caches (relevant only for Public cache type)</p>
            <p>• <strong>immutable</strong> hints at indefinite caching (HTTP/2+ support varies)</p>
            <p>• <strong>must-revalidate</strong> requires revalidation when stale</p>
          </div>
        </div>
      </div>
    </div>
  );
};