import {
  convertTimeUnitToSeconds,
  TimeInput,
  type TimeUnit,
} from '@/components/time-input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
} from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { directives, parseCacheControlHeader } from '@/lib/cache-control';
import { cn } from '@/lib/utils';
import { createForm, formOptions } from '@tanstack/solid-form';
import { createEffect, type Component, type JSX } from 'solid-js';

type TimeDirective = {
  enabled: boolean;
  value: number;
  unit: TimeUnit;
};

type FormSchema = {
  cacheType: 'public' | 'private' | 'no-store';
  freshBehavior: 'default' | 'no-cache';
  mustRevalidate: boolean;
  proxyRevalidate: boolean;
  immutable: boolean;
  noTransform: boolean;
  maxAge: TimeDirective;
  sMaxAge: TimeDirective;
  staleWhileRevalidate: TimeDirective;
  staleIfError: TimeDirective;
};

const formOpts = formOptions({
  defaultValues: {
    cacheType: 'public',
    freshBehavior: 'default',
    mustRevalidate: false,
    proxyRevalidate: false,
    immutable: false,
    noTransform: false,
    maxAge: {
      enabled: false,
      value: 3600,
      unit: 'seconds' as TimeUnit,
    },
    sMaxAge: {
      enabled: false,
      value: 3600,
      unit: 'seconds' as TimeUnit,
    },
    staleWhileRevalidate: {
      enabled: false,
      value: 60,
      unit: 'seconds' as TimeUnit,
    },
    staleIfError: {
      enabled: false,
      value: 300,
      unit: 'seconds' as TimeUnit,
    },
  } as FormSchema,
});

const formSchemaToHeaderString = (values: FormSchema) => {
  const directives = [];

  if (values.cacheType === 'no-store') directives.push('no-store');
  if (values.cacheType === 'private') directives.push('private');
  if (values.cacheType === 'public') directives.push('public');

  if (values.freshBehavior === 'no-cache') directives.push('no-cache');

  if (values.mustRevalidate) directives.push('must-revalidate');
  if (values.proxyRevalidate && values.cacheType === 'public')
    directives.push('proxy-revalidate');
  if (values.immutable) directives.push('immutable');

  if (values.maxAge.enabled && values.cacheType !== 'no-store') {
    const maxAgeSecs = convertTimeUnitToSeconds(
      values.maxAge.value,
      values.maxAge.unit,
    );
    directives.push(`max-age=${maxAgeSecs.toString()}`);
  }

  if (
    values.sMaxAge.enabled &&
    values.cacheType !== 'no-store' &&
    values.cacheType === 'public'
  ) {
    const sMaxAgeSecs = convertTimeUnitToSeconds(
      values.sMaxAge.value,
      values.sMaxAge.unit,
    );
    directives.push(`s-maxage=${sMaxAgeSecs.toString()}`);
  }

  if (values.noTransform) directives.push('no-transform');

  if (values.staleWhileRevalidate.enabled && values.cacheType !== 'no-store') {
    const staleWhileRevalidateSecs = convertTimeUnitToSeconds(
      values.staleWhileRevalidate.value,
      values.staleWhileRevalidate.unit,
    );
    directives.push(
      `stale-while-revalidate=${staleWhileRevalidateSecs.toString()}`,
    );
  }

  if (values.staleIfError.enabled && values.cacheType !== 'no-store') {
    const staleIfErrorSecs = convertTimeUnitToSeconds(
      values.staleIfError.value,
      values.staleIfError.unit,
    );
    directives.push(`stale-if-error=${staleIfErrorSecs.toString()}`);
  }

  return directives.join(', ');
};

const headerStringToFormSchema = (
  parseResult: ReturnType<typeof parseCacheControlHeader>,
): FormSchema => {
  if (!parseResult.valid)
    throw new Error('Header string not valid, cannot convert to form schema');

  // Start with default values
  const newSchema: FormSchema = { ...formOpts.defaultValues };
  const directiveNames = parseResult.directives.map((d) => d.name);

  // Set cache type
  if (directiveNames.includes('no-store')) {
    newSchema.cacheType = 'no-store';
  } else if (directiveNames.includes('private')) {
    newSchema.cacheType = 'private';
  } else if (directiveNames.includes('public')) {
    newSchema.cacheType = 'public';
  }

  // Set freshness behavior
  if (directiveNames.includes('no-cache')) {
    newSchema.freshBehavior = 'no-cache';
  } else {
    newSchema.freshBehavior = 'default';
  }

  // Set boolean directives
  newSchema.mustRevalidate = directiveNames.includes('must-revalidate');
  newSchema.proxyRevalidate = directiveNames.includes('proxy-revalidate');
  newSchema.immutable = directiveNames.includes('immutable');
  newSchema.noTransform = directiveNames.includes('no-transform');

  // Set time-based directives
  const findTimeDirective = (name: string) => {
    const directive = parseResult.directives.find((d) => d.name === name);
    if (
      directive &&
      typeof directive.value === 'number' &&
      !isNaN(directive.value)
    ) {
      // Determine best time unit
      let value = directive.value;
      let unit: TimeUnit = 'seconds';

      if (value % (60 * 60 * 24) === 0 && value >= 60 * 60 * 24) {
        value = value / (60 * 60 * 24);
        unit = 'days';
      } else if (value % (60 * 60) === 0 && value >= 60 * 60) {
        value = value / (60 * 60);
        unit = 'hours';
      } else if (value % 60 === 0 && value >= 60) {
        value = value / 60;
        unit = 'minutes';
      }

      return {
        enabled: true,
        value,
        unit,
      };
    }
    return undefined;
  };

  const maxAge = findTimeDirective('max-age');
  if (maxAge) {
    newSchema.maxAge = maxAge;
  }

  const sMaxAge = findTimeDirective('s-maxage');
  if (sMaxAge) {
    newSchema.sMaxAge = sMaxAge;
  }

  const staleWhileRevalidate = findTimeDirective('stale-while-revalidate');
  if (staleWhileRevalidate) {
    newSchema.staleWhileRevalidate = staleWhileRevalidate;
  }

  const staleIfError = findTimeDirective('stale-if-error');
  if (staleIfError) {
    newSchema.staleIfError = staleIfError;
  }

  return newSchema;
};

const ONE_YEAR_IN_SECONDS = 31536000; // 365 days

export const GenerateForm: Component<{
  textInputHeaderValue: string;
  setTextInputHeaderValue: (value: string) => void;
  class?: string;
}> = (props) => {
  const form = createForm(() => ({
    ...formOpts,
  }));

  const formState = form.useStore();

  createEffect(() => {
    if (formState().isPristine) return; // Don't update the text input if the form hasn't been touched
    if (!formState().isValid) return;
    props.setTextInputHeaderValue(formSchemaToHeaderString(formState().values));
  });

  createEffect(() => {
    const headerString = props.textInputHeaderValue;
    if (!headerString) return;
    const formValues = formState().values;
    const formGeneratedHeader = formSchemaToHeaderString(formValues);
    if (formGeneratedHeader === headerString) return;
    const parseResult = parseCacheControlHeader(headerString);
    if (!parseResult.valid) return;
    const formSchema = headerStringToFormSchema(parseResult);
    form.reset(formSchema);
  });

  const isNoStore = () => formState().values.cacheType === 'no-store';

  const ageDirectiveValidators = (value: TimeDirective) => {
    if (!value.enabled) return;
    const seconds = convertTimeUnitToSeconds(value.value, value.unit);
    if (seconds > ONE_YEAR_IN_SECONDS)
      return `According to RFC 2616: To mark a response as "never expires," an origin server sends an
   Expires date approximately one year from the time the response is
   sent. HTTP/1.1 servers SHOULD NOT send Expires dates more than one
   year in the future.`;
    if (seconds < 0)
      return `If the max-age value is negative (for example, -1) or isn't an integer (for example, 3599.99), then the caching behavior is unspecified. Caches are encouraged to treat the value as if it were 0 (this is noted in the Calculating Freshness Lifetime section of the HTTP specification).`;
    if (seconds == 0)
      return `Setting max-age=0 means the response is stale immediately, requiring revalidation. Note that max-age=0 is different from no-cache: While both cause revalidation, max-age=0 allows caching while no-cache hints that caches should validate the response before storing it.`;
  };

  return (
    <div class={cn('space-y-6', props.class)}>
      <div class="space-y-6">
        <div>
          <SectionDescription
            title="1. Cache Type"
            description="Determines which caches can store the response."
          />
          <Card class="space-y-4 p-4">
            <div class="space-y-3">
              <div class="flex flex-col gap-4">
                <form.Field name="cacheType">
                  {(field) => (
                    <>
                      <RadioOption
                        name="cacheType"
                        value="public"
                        checked={field().state.value === 'public'}
                        onChange={() => {
                          field().handleChange('public');
                        }}
                        label="Public"
                        description={directives.public.description}
                      />
                      <RadioOption
                        name="cacheType"
                        value="private"
                        checked={field().state.value === 'private'}
                        onChange={() => {
                          field().handleChange('private');
                        }}
                        label="Private"
                        description={directives.private.description}
                      />
                      <RadioOption
                        name="cacheType"
                        value="no-store"
                        checked={field().state.value === 'no-store'}
                        onChange={() => {
                          field().handleChange('no-store');
                        }}
                        label="No Caching (no-store)"
                        description={directives['no-store'].description}
                      />
                    </>
                  )}
                </form.Field>
              </div>
            </div>
          </Card>
        </div>

        <div class={isNoStore() ? 'opacity-50' : ''}>
          <SectionDescription
            title="2. Freshness Duration"
            description="Controls how long the response can be used before it becomes stale and potentially needs revalidation."
          />
          <Card class="space-y-4 p-4">
            <form.Field
              name="maxAge"
              validators={{
                onChange: ({ value }) => ageDirectiveValidators(value),
              }}
            >
              {(field) => (
                <div>
                  <TimeInput
                    label="Max Age"
                    value={field().state.value.value}
                    unit={field().state.value.unit}
                    enabled={field().state.value.enabled}
                    onValueChange={(value) => {
                      field().handleChange({ ...field().state.value, value });
                    }}
                    onUnitChange={(unit) => {
                      field().handleChange({ ...field().state.value, unit });
                    }}
                    onEnabledChange={(enabled) => {
                      field().handleChange({ ...field().state.value, enabled });
                    }}
                    description={`${directives['max-age'].description} After this time, the cache must revalidate the response with the server.`}
                    disabled={isNoStore()}
                  />
                  {field().state.meta.errors.join(', ') && (
                    <em role="alert">{field().state.meta.errors.join(', ')}</em>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="sMaxAge"
              validators={{
                onChange: ({ value }) => ageDirectiveValidators(value),
              }}
            >
              {(field) => (
                <div>
                  <TimeInput
                    label="Shared Max Age (s-maxage)"
                    value={field().state.value.value}
                    unit={field().state.value.unit}
                    enabled={field().state.value.enabled}
                    onValueChange={(value) => {
                      field().handleChange({ ...field().state.value, value });
                    }}
                    onUnitChange={(unit) => {
                      field().handleChange({ ...field().state.value, unit });
                    }}
                    onEnabledChange={(enabled) => {
                      field().handleChange({ ...field().state.value, enabled });
                    }}
                    description={`${directives['s-maxage'].description} Allows setting a different freshness duration for shared caches like CDNs.`}
                    disabled={
                      isNoStore() || formState().values.cacheType === 'private'
                    }
                  />
                </div>
              )}
            </form.Field>

            {formState().values.cacheType === 'private' && (
              <p class="mt-1 text-sm text-yellow-600 dark:text-yellow-500">
                s-maxage is only available with Public cache type
              </p>
            )}

            <div class="space-y-2">
              <form.Field name="immutable">
                {(field) => (
                  <>
                    <div class="flex items-center space-x-2">
                      <Checkbox
                        checked={field().state.value}
                        onChange={(checked) => {
                          field().handleChange(checked);
                        }}
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
                    <div class="mt-2 ml-6">
                      <p class="text-sm">
                        Prevents unnecessary revalidation specifically during page reload/refresh. While browsers normally use cached responses during navigation, they typically revalidate all resources when a user explicitly refreshes the page. This directive tells browsers "don't revalidate even on refresh."
                      </p>
                    </div>
                  </>
                )}
              </form.Field>

              {formState().values.immutable && (
                <>
                  <Alert variant="warning" class="mt-2">
                    <AlertTitle>Support Information:</AlertTitle>
                    <AlertDescription>
                      <ul class="list-disc space-y-1 pl-4">
                        <li>
                          <strong>CDNs:</strong> Cloudflare (Enterprise),
                          Fastly, Akamai
                        </li>
                        <li>
                          <strong>Not native:</strong> AWS CloudFront
                        </li>
                        <li>
                          <strong>Browsers:</strong> Chrome, Firefox, Edge;
                          limited Safari
                        </li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <div class="mt-3 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/20">
                    <h4 class="mb-2 font-medium text-blue-700 dark:text-blue-400">
                      Best practice for immutable:
                    </h4>
                    <p class="text-sm text-blue-700 dark:text-blue-400">
                      <strong>Only</strong> use with files that have
                      content-based hashes in their filenames (cache busting):
                    </p>
                    <ul class="mt-2 list-disc pl-5 text-sm text-blue-700 dark:text-blue-400">
                      <li>
                        Good: <code>/assets/main.a7e9f32.js</code>,{' '}
                        <code>/images/logo.34def12.png</code>
                      </li>
                      <li>
                        Bad: <code>/assets/main.js?v=123</code>,{' '}
                        <code>/images/logo.png</code>
                      </li>
                    </ul>
                    <p class="mt-2 text-sm text-blue-700 dark:text-blue-400">
                      <strong>Example:</strong>{' '}
                      <code>Cache-Control: max-age=31536000, immutable</code>
                    </p>
                    <p class="mt-2 text-sm text-blue-700 dark:text-blue-400">
                      This tells browsers "this resource will never change, so
                      don't bother checking for updates, even when the user
                      refreshes the page."
                    </p>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>

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
                <form.Field name="freshBehavior">
                  {(field) => (
                    <>
                      <div>
                        <label class="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="freshBehavior"
                            value="default"
                            checked={field().state.value === 'default'}
                            onChange={() => {
                              field().handleChange('default');
                            }}
                            disabled={isNoStore()}
                            class="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                          />
                          <span class="text-sm leading-none font-medium">
                            Use fresh responses without revalidation
                          </span>
                        </label>
                        <div class="mt-2 ml-6">
                          <p class="text-sm whitespace-pre-line">
                            This is the default browser behavior for normal navigation. Browsers use cached responses within their freshness period without checking with the server.
                          </p>
                          <p class="text-muted-foreground border-primary/20 mt-1 border-l-2 pl-2 text-xs">
                            Caches can serve the response directly without
                            contacting the origin server as long as it's within
                            the max-age timeframe.
                          </p>
                          <p class="text-muted-foreground mt-2 text-xs italic">
                            Note: During page refresh/reload, browsers typically still check with the server even for fresh responses. To prevent this, use the 'immutable' directive in the Freshness Duration section.
                          </p>
                        </div>
                      </div>

                      <div>
                        <label class="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="freshBehavior"
                            value="no-cache"
                            checked={field().state.value === 'no-cache'}
                            onChange={() => {
                              field().handleChange('no-cache');
                            }}
                            disabled={isNoStore()}
                            class="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                          />
                          <span class="text-sm leading-none font-medium">
                            Always revalidate responses (no-cache)
                          </span>
                        </label>
                        <div class="mt-2 ml-6">
                          <p class="text-sm whitespace-pre-line">
                            Requires checking with the server before using any
                            cached response.
                            <strong> Note:</strong> This does NOT mean "don't
                            cache" - the browser will still store the response,
                            but must validate it before use. For content that
                            should never be stored, use "no-store" instead.
                          </p>

                          <div class="mt-3 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/20">
                            <h4 class="mb-2 font-medium text-blue-700 dark:text-blue-400">
                              How no-cache works:
                            </h4>
                            <p class="text-sm text-blue-700 dark:text-blue-400">
                              1. Browser has a cached response
                            </p>
                            <p class="text-sm text-blue-700 dark:text-blue-400">
                              2. User requests the page
                            </p>
                            <p class="text-sm text-blue-700 dark:text-blue-400">
                              3. Browser MUST check with the server first (sends
                              validation request with
                              If-None-Match/If-Modified-Since)
                            </p>
                            <p class="text-sm text-blue-700 dark:text-blue-400">
                              4. Server responds with 304 Not Modified OR new
                              content
                            </p>
                            <p class="text-sm text-blue-700 dark:text-blue-400">
                              5. Only after this validation does the browser
                              show the content
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </form.Field>
              </div>
            </div>
          </Card>
        </div>

        <div class={isNoStore() ? 'opacity-50' : ''}>
          <SectionDescription
            title="4. Cache Behavior for Stale Responses"
            description="Controls how caches handle responses after they've become stale (exceeded their freshness lifetime)."
          />
          <Card class="space-y-4 p-4">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div class="space-y-3">
                <form.Field name="mustRevalidate">
                  {(field) => (
                    <>
                      <div class="flex items-center space-x-2">
                        <Checkbox
                          checked={field().state.value}
                          onChange={(checked) => {
                            field().handleChange(checked);
                          }}
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
                          Ensures that stale responses are not used without
                          checking with the server, improving accuracy.
                        </p>
                      </div>
                    </>
                  )}
                </form.Field>
              </div>

              <div class="space-y-3">
                <form.Field name="proxyRevalidate">
                  {(field) => (
                    <>
                      <div class="flex items-center space-x-2">
                        <Checkbox
                          checked={field().state.value}
                          onChange={(checked) => {
                            field().handleChange(checked);
                          }}
                          disabled={
                            isNoStore() ||
                            formState().values.cacheType === 'private'
                          }
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
                          Allows private caches to serve stale responses while
                          requiring shared caches to revalidate.
                        </p>
                      </div>
                    </>
                  )}
                </form.Field>

                {formState().values.cacheType === 'private' && (
                  <p class="text-sm text-yellow-600 dark:text-yellow-500">
                    Only available with Public cache type
                  </p>
                )}
              </div>
            </div>

            <div class="border-border mt-2 space-y-3 border-t pt-2">
              <h4 class="font-medium text-gray-700 dark:text-gray-300">
                Advanced Staleness Options
              </h4>
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <form.Field name="staleWhileRevalidate" validators={{}}>
                    {(field) => (
                      <div>
                        <TimeInput
                          label="Stale While Revalidate"
                          value={field().state.value.value}
                          unit={field().state.value.unit}
                          enabled={field().state.value.enabled}
                          onValueChange={(value) => {
                            field().handleChange({
                              ...field().state.value,
                              value,
                            });
                          }}
                          onUnitChange={(unit) => {
                            field().handleChange({
                              ...field().state.value,
                              unit,
                            });
                          }}
                          onEnabledChange={(enabled) => {
                            field().handleChange({
                              ...field().state.value,
                              enabled,
                            });
                          }}
                          description="Allows serving stale content while revalidating in the background. When a cached response becomes stale, it returns the stale response immediately while fetching a fresh copy."
                          disabled={isNoStore()}
                        />
                      </div>
                    )}
                  </form.Field>

                  {formState().values.staleWhileRevalidate.enabled && (
                    <>
                      <Alert variant="warning" class="mt-2">
                        <AlertTitle>Support Information:</AlertTitle>
                        <AlertDescription>
                          <ul class="list-disc space-y-1 pl-4">
                            <li>
                              <strong>CDNs:</strong> Cloudflare (Enterprise),
                              Fastly, Akamai
                            </li>
                            <li>
                              <strong>Not native:</strong> AWS CloudFront
                            </li>
                            <li>
                              <strong>Browsers:</strong> Chrome, Firefox, Edge;
                              limited Safari
                            </li>
                          </ul>
                        </AlertDescription>
                      </Alert>

                      <div class="mt-3 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/20">
                        <h4 class="mb-2 font-medium text-blue-700 dark:text-blue-400">
                          How it works (vs no-cache):
                        </h4>
                        <p class="text-sm text-blue-700 dark:text-blue-400">
                          1. Return stale content immediately to user (no
                          waiting)
                        </p>
                        <p class="text-sm text-blue-700 dark:text-blue-400">
                          2. Fetch fresh version in background
                        </p>
                        <p class="text-sm text-blue-700 dark:text-blue-400">
                          3. Update cache for future requests
                        </p>
                        <p class="mt-2 text-sm text-blue-700 dark:text-blue-400">
                          <strong>Key difference from no-cache:</strong> User
                          doesn't wait for revalidation (prioritizes speed over
                          freshness)
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <form.Field name="staleIfError">
                    {(field) => (
                      <div>
                        <TimeInput
                          label="Stale If Error"
                          value={field().state.value.value}
                          unit={field().state.value.unit}
                          enabled={field().state.value.enabled}
                          onValueChange={(value) => {
                            field().handleChange({
                              ...field().state.value,
                              value,
                            });
                          }}
                          onUnitChange={(unit) => {
                            field().handleChange({
                              ...field().state.value,
                              unit,
                            });
                          }}
                          onEnabledChange={(enabled) => {
                            field().handleChange({
                              ...field().state.value,
                              enabled,
                            });
                          }}
                          description="Allows serving stale content when server returns errors (5xx), improving reliability during outages."
                          disabled={isNoStore()}
                        />
                      </div>
                    )}
                  </form.Field>

                  {formState().values.staleIfError.enabled && (
                    <>
                      <Alert variant="warning" class="mt-2">
                        <AlertTitle>Support Information:</AlertTitle>
                        <AlertDescription>
                          <ul class="list-disc space-y-1 pl-4">
                            <li>
                              <strong>CDNs:</strong> Cloudflare (Enterprise),
                              Fastly, Akamai
                            </li>
                            <li>
                              <strong>Not supported:</strong> AWS CloudFront
                            </li>
                            <li>
                              <strong>Browsers:</strong> Limited (mainly Chrome)
                            </li>
                          </ul>
                        </AlertDescription>
                      </Alert>

                      <div class="mt-3 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/20">
                        <h4 class="mb-2 font-medium text-blue-700 dark:text-blue-400">
                          How it works:
                        </h4>
                        <p class="text-sm text-blue-700 dark:text-blue-400">
                          Serves stale content when server returns errors (5xx),
                          improving reliability during outages.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <SectionDescription
            title="5. Other Directives"
            description="Additional controls that can be applied to all responses regardless of cache status."
          />
          <Card class="space-y-4 p-4">
            <div class="space-y-3">
              <form.Field name="noTransform">
                {(field) => (
                  <>
                    <div class="flex items-center space-x-2">
                      <Checkbox
                        checked={field().state.value}
                        onChange={(checked) => {
                          field().handleChange(checked);
                        }}
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
                      <p class="text-sm">
                        {directives['no-transform'].description}
                      </p>
                      <p class="text-muted-foreground border-primary/20 mt-1 border-l-2 pl-2 text-xs">
                        Ensures content integrity by preventing proxies from
                        modifying your content.
                      </p>
                    </div>
                  </>
                )}
              </form.Field>

              {formState().values.noTransform && (
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

        <div class="flex justify-end">
          <Button
            variant="outline"
            onClick={() => {
              form.reset(formOpts.defaultValues);
            }}
            class="text-sm"
          >
            Reset to Defaults
          </Button>
        </div>

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
              responses, but still allows storing the response
            </p>
            <p>
              • <strong>s-maxage</strong> only applies to shared caches
              (relevant only for Public cache type)
            </p>
            <p>
              • <strong>immutable</strong> prevents revalidation on page refresh
              (HTTP/2+ support varies)
            </p>
            <p>
              • <strong>must-revalidate</strong> requires revalidation when
              stale
            </p>
            <p>
              • <strong>max-age=0</strong> is different from{' '}
              <strong>no-cache</strong>: max-age=0 makes content immediately
              stale but doesn't prevent caching
            </p>
            <p>
              • <strong>stale-while-revalidate</strong> and{' '}
              <strong>stale-if-error</strong> provide grace periods for using
              stale content
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

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

type RadioOptionProps = {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  description: string;
  disabled?: boolean;
  additionalContent?: JSX.Element;
};

const RadioOption: Component<RadioOptionProps> = (props) => {
  return (
    <div>
      <label class="flex items-center space-x-2">
        <input
          type="radio"
          name={props.name}
          value={props.value}
          checked={props.checked}
          onChange={props.onChange}
          disabled={props.disabled}
          class="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
        />
        <span class="text-sm leading-none font-medium">
          {props.label}
        </span>
      </label>
      <div class="mt-2 ml-6">
        <p class="text-sm whitespace-pre-line">
          {props.description}
        </p>
        {props.additionalContent}
      </div>
    </div>
  );
};
