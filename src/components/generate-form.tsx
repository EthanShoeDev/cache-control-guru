import { convertTimeUnitToSeconds, TimeInput, type TimeUnit } from '@/components/time-input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
} from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { directives } from '@/lib/cache-control';
import { cn } from '@/lib/utils';
import { createForm, formOptions } from '@tanstack/solid-form';
import { createEffect, type Component } from 'solid-js';

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



// const parseSeconds = (seconds: number): { value: number; unit: TimeUnit } => {
//   if (seconds % (60 * 60 * 24) === 0 && seconds >= 60 * 60 * 24) {
//     return { value: seconds / (60 * 60 * 24), unit: 'days' };
//   }
//   if (seconds % (60 * 60) === 0 && seconds >= 60 * 60) {
//     return { value: seconds / (60 * 60), unit: 'hours' };
//   }
//   if (seconds % 60 === 0 && seconds >= 60) {
//     return { value: seconds / 60, unit: 'minutes' };
//   }
//   return { value: seconds, unit: 'seconds' };
// };

const formSchemaToHeaderString = (values: FormSchema) => {
  const directives = [];

  if(values.cacheType === 'no-store') directives.push('no-store');
  if(values.cacheType === 'private') directives.push('private');
  if(values.cacheType === 'public') directives.push('public');

  if(values.freshBehavior === 'no-cache') directives.push('no-cache');

  if(values.mustRevalidate) directives.push('must-revalidate');
  if(values.proxyRevalidate && values.cacheType === 'public') directives.push('proxy-revalidate');
  if(values.immutable) directives.push('immutable');

  if(values.maxAge.enabled && values.cacheType !== 'no-store') {
    const maxAgeSecs = convertTimeUnitToSeconds(values.maxAge.value, values.maxAge.unit);
    directives.push(`max-age=${maxAgeSecs}`);
  }

  if(values.sMaxAge.enabled && values.cacheType !== 'no-store' && values.cacheType === 'public') {
    const sMaxAgeSecs = convertTimeUnitToSeconds(values.sMaxAge.value, values.sMaxAge.unit);
    directives.push(`s-maxage=${sMaxAgeSecs}`);
  }
  
  if(values.noTransform) directives.push('no-transform');

  if(values.staleWhileRevalidate.enabled && values.cacheType !== 'no-store') {
    const staleWhileRevalidateSecs = convertTimeUnitToSeconds(values.staleWhileRevalidate.value, values.staleWhileRevalidate.unit);
    directives.push(`stale-while-revalidate=${staleWhileRevalidateSecs}`);
  }
  
  if(values.staleIfError.enabled && values.cacheType !== 'no-store') {
    const staleIfErrorSecs = convertTimeUnitToSeconds(values.staleIfError.value, values.staleIfError.unit);
    directives.push(`stale-if-error=${staleIfErrorSecs}`);
  }
  
  return directives.join(', ');
}


const ONE_YEAR_IN_SECONDS = 31536000; // 365 days

export const GenerateForm: Component<{
  textInputHeaderValue: string;
  setTextInputHeaderValue: (value: string) => void;
  class?: string;
}> = (props) => {
  // let updatingFromInput = false;

  const form = createForm(() => ({
    ...formOpts,
  }));

  const formState = form.useStore();

  createEffect(() => {
    if(!formState().isValid) return;
    props.setTextInputHeaderValue(formSchemaToHeaderString(formState().values))
  })

  // createEffect(() => {
  //   // const headerValue = props.headerValue;

  //   // if (headerValue === '' || updatingFromInput) return;

  //   // const validation = validateHeader(headerValue);
  //   // if (!validation.valid) {
  //   //   form.setFieldValue('headerText', headerValue);
  //   //   return;
  //   // }

  //   const parsedDirectives = parseHeader(headerValue);
  //   // updatingFromInput = true;

  //   try {
  //     const newValues = { ...defaultValues };

  //     if (parsedDirectives.some((d) => d.name === 'no-store')) {
  //       newValues.cacheType = 'no-store';
  //     } else if (parsedDirectives.some((d) => d.name === 'private')) {
  //       newValues.cacheType = 'private';
  //     } else if (parsedDirectives.some((d) => d.name === 'public')) {
  //       newValues.cacheType = 'public';
  //     }

  //     if (parsedDirectives.some((d) => d.name === 'no-cache')) {
  //       newValues.freshBehavior = 'no-cache';
  //     }

  //     newValues.mustRevalidate = parsedDirectives.some(
  //       (d) => d.name === 'must-revalidate',
  //     );
  //     newValues.proxyRevalidate = parsedDirectives.some(
  //       (d) => d.name === 'proxy-revalidate',
  //     );
  //     newValues.immutable = parsedDirectives.some(
  //       (d) => d.name === 'immutable',
  //     );
  //     newValues.noTransform = parsedDirectives.some(
  //       (d) => d.name === 'no-transform',
  //     );

  //     const maxAgeDirective = parsedDirectives.find(
  //       (d) => d.name === 'max-age',
  //     );
  //     if (maxAgeDirective && maxAgeDirective.value) {
  //       const seconds = parseInt(maxAgeDirective.value, 10);
  //       if (!isNaN(seconds)) {
  //         const { value, unit } = parseSeconds(seconds);
  //         newValues.maxAge = {
  //           enabled: true,
  //           value,
  //           unit,
  //         };
  //       }
  //     }

  //     const sMaxAgeDirective = parsedDirectives.find(
  //       (d) => d.name === 's-maxage',
  //     );
  //     if (sMaxAgeDirective && sMaxAgeDirective.value) {
  //       const seconds = parseInt(sMaxAgeDirective.value, 10);
  //       if (!isNaN(seconds)) {
  //         const { value, unit } = parseSeconds(seconds);
  //         newValues.sMaxAge = {
  //           enabled: true,
  //           value,
  //           unit,
  //         };
  //       }
  //     }

  //     const swrDirective = parsedDirectives.find(
  //       (d) => d.name === 'stale-while-revalidate',
  //     );
  //     if (swrDirective && swrDirective.value) {
  //       const seconds = parseInt(swrDirective.value, 10);
  //       if (!isNaN(seconds)) {
  //         const { value, unit } = parseSeconds(seconds);
  //         newValues.staleWhileRevalidate = {
  //           enabled: true,
  //           value,
  //           unit,
  //         };
  //       }
  //     }

  //     const sieDirective = parsedDirectives.find(
  //       (d) => d.name === 'stale-if-error',
  //     );
  //     if (sieDirective && sieDirective.value) {
  //       const seconds = parseInt(sieDirective.value, 10);
  //       if (!isNaN(seconds)) {
  //         const { value, unit } = parseSeconds(seconds);
  //         newValues.staleIfError = {
  //           enabled: true,
  //           value,
  //           unit,
  //         };
  //       }
  //     }

  //     newValues.headerText = headerValue;

  //     form.reset(newValues);
  //   } finally {
  //     updatingFromInput = false;
  //   }
  // });

  // const generateHeader = (values: FormSchema) => {
  //   const directives = [];

  //   if (values.cacheType === 'public') directives.push('public');
  //   if (values.cacheType === 'private') directives.push('private');
  //   if (values.cacheType === 'no-store') directives.push('no-store');

  //   if (values.freshBehavior === 'no-cache') directives.push('no-cache');

  //   if (values.mustRevalidate) directives.push('must-revalidate');
  //   if (values.proxyRevalidate && values.cacheType === 'public')
  //     directives.push('proxy-revalidate');
  //   if (values.immutable) directives.push('immutable');

  //   if (values.maxAge.enabled && values.cacheType !== 'no-store') {
  //     const maxAgeSecs = convertToSeconds(
  //       values.maxAge.value,
  //       values.maxAge.unit,
  //     );
  //     directives.push(`max-age=${maxAgeSecs}`);
  //   }

  //   if (
  //     values.sMaxAge.enabled &&
  //     values.cacheType !== 'no-store' &&
  //     values.cacheType === 'public'
  //   ) {
  //     const sMaxAgeSecs = convertToSeconds(
  //       values.sMaxAge.value,
  //       values.sMaxAge.unit,
  //     );
  //     directives.push(`s-maxage=${sMaxAgeSecs}`);
  //   }

  //   if (values.noTransform) directives.push('no-transform');

  //   if (
  //     values.staleWhileRevalidate.enabled &&
  //     values.cacheType !== 'no-store'
  //   ) {
  //     const staleWhileRevalidateSecs = convertToSeconds(
  //       values.staleWhileRevalidate.value,
  //       values.staleWhileRevalidate.unit,
  //     );
  //     directives.push(`stale-while-revalidate=${staleWhileRevalidateSecs}`);
  //   }

  //   if (values.staleIfError.enabled && values.cacheType !== 'no-store') {
  //     const staleIfErrorSecs = convertToSeconds(
  //       values.staleIfError.value,
  //       values.staleIfError.unit,
  //     );
  //     directives.push(`stale-if-error=${staleIfErrorSecs}`);
  //   }

  //   directives.sort();

  //   const headerValue = directives.join(', ');

  //   props.onGenerate(headerValue);
  // };

  // const resetForm = () => {
  //   form.reset(defaultValues);
  //   generateHeader(defaultValues);
  // };

  // createEffect(() => {
  //   const currentValues = formState().values;

  //   if (updatingFromInput) return;

  //   if (currentValues.cacheType === 'no-store') {
  //     form.setFieldValue('maxAge', { ...currentValues.maxAge, enabled: false });
  //     form.setFieldValue('sMaxAge', {
  //       ...currentValues.sMaxAge,
  //       enabled: false,
  //     });
  //     form.setFieldValue('mustRevalidate', false);
  //     form.setFieldValue('proxyRevalidate', false);
  //     form.setFieldValue('immutable', false);
  //     form.setFieldValue('staleWhileRevalidate', {
  //       ...currentValues.staleWhileRevalidate,
  //       enabled: false,
  //     });
  //     form.setFieldValue('staleIfError', {
  //       ...currentValues.staleIfError,
  //       enabled: false,
  //     });
  //     form.setFieldValue('freshBehavior', 'default');
  //   }

  //   if (currentValues.cacheType === 'private') {
  //     form.setFieldValue('sMaxAge', {
  //       ...currentValues.sMaxAge,
  //       enabled: false,
  //     });
  //     form.setFieldValue('proxyRevalidate', false);
  //   }

  //   generateHeader(formState().values);
  // });

  const isNoStore = () => formState().values.cacheType === 'no-store';

  // const hasMaxAgeZero = () =>
  //   formState().values.maxAge.enabled && formState().values.maxAge.value === 0;

  // const maxAgeExceedsYear = () => {
  //   const maxAge = formState().values.maxAge;
  //   if (!maxAge.enabled) return false;
  //   return convertToSeconds(maxAge.value, maxAge.unit) > ONE_YEAR_IN_SECONDS;
  // };

  // const sMaxAgeExceedsYear = () => {
  //   const sMaxAge = formState().values.sMaxAge;
  //   if (!sMaxAge.enabled) return false;
  //   return convertToSeconds(sMaxAge.value, sMaxAge.unit) > ONE_YEAR_IN_SECONDS;
  // };

  // const staleWhileRevalidateExceedsYear = () => {
  //   const swr = formState().values.staleWhileRevalidate;
  //   if (!swr.enabled) return false;
  //   return convertToSeconds(swr.value, swr.unit) > ONE_YEAR_IN_SECONDS;
  // };

  // const staleIfErrorExceedsYear = () => {
  //   const sie = formState().values.staleIfError;
  //   if (!sie.enabled) return false;
  //   return convertToSeconds(sie.value, sie.unit) > ONE_YEAR_IN_SECONDS;
  // };

  // const validateHeaderText = ({ value }: { value: string }) => {
  //   const result = validateHeader(value);
  //   return result.valid ? undefined : result.error;
  // };

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
      return `Setting max-age=0 means the response is stale immediately,
                    requiring revalidation.`;
  };

  return (
    <div class={cn('space-y-6', props.class)}>
      <div class="space-y-6">
        {/* <form.Field
          name="headerText"
          validators={{
            onChange: validateHeaderText,
          }}
        >
          {(field) => (
            <Show when={field().state.meta.errors.length > 0}>
              <Alert variant="warning" class="mb-4">
                <AlertTitle>Invalid Header Format</AlertTitle>
                <AlertDescription>
                  {field().state.meta.errors[0]}
                  <p class="mt-1 text-sm">
                    The form options will continue to work normally with the
                    last valid configuration. If you change any form option, it
                    will generate a new valid header.
                  </p>
                </AlertDescription>
              </Alert>
            </Show>
          )}
        </form.Field> */}

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
                <form.Field name="cacheType">
                  {(field) => (
                    <>
                      <div>
                        <label class="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="cacheType"
                            value="public"
                            checked={field().state.value === 'public'}
                            onChange={() => {
                              field().handleChange('public');
                            }}
                            class="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                          />
                          <span class="text-sm leading-none font-medium">
                            Public
                          </span>
                        </label>
                        <div class="mt-2 ml-6">
                          <p class="text-sm">
                            {directives.public?.description}
                          </p>
                          <p class="text-muted-foreground border-primary/20 mt-1 border-l-2 pl-2 text-xs">
                            Suitable for content that can be shared among
                            multiple users, such as static images or CSS files.
                          </p>
                        </div>
                      </div>

                      <div>
                        <label class="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="cacheType"
                            value="private"
                            checked={field().state.value === 'private'}
                            onChange={() => {
                              field().handleChange('private');
                            }}
                            class="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                          />
                          <span class="text-sm leading-none font-medium">
                            Private
                          </span>
                        </label>
                        <div class="mt-2 ml-6">
                          <p class="text-sm">
                            {directives.private?.description}
                          </p>
                          <p class="text-muted-foreground border-primary/20 mt-1 border-l-2 pl-2 text-xs">
                            Use this for personalized content or data that
                            should not be shared, like user-specific pages.
                          </p>
                        </div>
                      </div>

                      <div>
                        <label class="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="cacheType"
                            value="no-store"
                            checked={field().state.value === 'no-store'}
                            onChange={() => {
                              field().handleChange('no-store');
                            }}
                            class="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                          />
                          <span class="text-sm leading-none font-medium">
                            No caching (no-store)
                          </span>
                        </label>
                        <div class="mt-2 ml-6">
                          <p class="text-sm">
                            {directives['no-store']?.description}
                          </p>
                          <p class="text-muted-foreground border-primary/20 mt-1 border-l-2 pl-2 text-xs">
                            Ensures that no part of the response is cached,
                            important for privacy and security. This overrides
                            all other directives.
                          </p>
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
                    description={`${directives['max-age']?.description ?? ''} After this time, the cache must revalidate the response with the server.`}
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
                    description={`${directives['s-maxage']?.description ?? ''} Allows setting a different freshness duration for shared caches like CDNs.`}
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

            {/* {sMaxAgeExceedsYear() && (
              <Alert variant="warning" class="mt-2">
                <AlertTitle>Warning:</AlertTitle>
                <AlertDescription>
                  You've set a very long s-maxage value (over 1 year). This may
                  lead to outdated content being served by CDNs for an extended
                  period.
                </AlertDescription>
              </Alert>
            )} */}

            <div class="space-y-2">
              <form.Field name="immutable">
                {(field) => (
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
                )}
              </form.Field>

              <p class="text-muted-foreground text-sm">
                {directives.immutable?.description} Best for versioned static
                assets with hashed filenames that never change.
              </p>

              {formState().values.immutable && (
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
                          <p class="text-sm">
                            This is the default behavior; the cache uses the
                            response if within its freshness period.
                          </p>
                          <p class="text-muted-foreground border-primary/20 mt-1 border-l-2 pl-2 text-xs">
                            Caches can serve the response directly without
                            contacting the origin server as long as it's within
                            the max-age timeframe.
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
                            Always revalidate fresh responses (no-cache)
                          </span>
                        </label>
                        <div class="mt-2 ml-6">
                          <p class="text-sm">
                            {directives['no-cache']?.description}
                          </p>
                          <p class="text-muted-foreground border-primary/20 mt-1 border-l-2 pl-2 text-xs">
                            Forces revalidation even for fresh responses,
                            potentially increasing server load. Can be combined
                            with max-age, but max-age still defines the
                            freshness period.
                          </p>
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
                        {directives['must-revalidate']?.description}
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
                        {directives['proxy-revalidate']?.description}
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

            <div class="border-border mt-2 space-y-3 border-t pt-2">
              <form.Field name="staleWhileRevalidate" validators={{}}>
                {(field) => (
                  <div>
                    <TimeInput
                      label="Stale While Revalidate"
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
                        field().handleChange({
                          ...field().state.value,
                          enabled,
                        });
                      }}
                      description="Allows a stale response to be served while a background revalidation occurs."
                      disabled={isNoStore()}
                    />
                  </div>
                )}
              </form.Field>

              {formState().values.staleWhileRevalidate.enabled && (
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

              {/* {staleWhileRevalidateExceedsYear() && (
                <Alert variant="warning" class="mt-2">
                  <AlertTitle>Warning:</AlertTitle>
                  <AlertDescription>
                    You've set a very long stale-while-revalidate value (over 1
                    year). This may lead to very outdated content being served.
                  </AlertDescription>
                </Alert>
              )} */}
            </div>

            <div class="border-border mt-2 space-y-3 border-t pt-2">
              <form.Field name="staleIfError">
                {(field) => (
                  <div>
                    <TimeInput
                      label="Stale If Error"
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
                        field().handleChange({
                          ...field().state.value,
                          enabled,
                        });
                      }}
                      description="Allows a stale response to be served if the origin server returns an error."
                      disabled={isNoStore()}
                    />
                  </div>
                )}
              </form.Field>

              {formState().values.staleIfError.enabled && (
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

              {/* {staleIfErrorExceedsYear() && (
                <Alert variant="warning" class="mt-2">
                  <AlertTitle>Warning:</AlertTitle>
                  <AlertDescription>
                    You've set a very long stale-if-error value (over 1 year).
                    This may lead to very outdated content being served during
                    errors.
                  </AlertDescription>
                </Alert>
              )} */}
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
                        {directives['no-transform']?.description}
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
