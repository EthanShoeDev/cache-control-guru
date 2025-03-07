import { createSignal, createMemo, type Component, For, Show } from 'solid-js';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { TimeInput } from '@/components/time-input';
import { generateHeader, type FormValues } from '@/lib/cache-control';
import { createForm } from '@tanstack/solid-form';
import { z } from 'zod';

interface GenerateFormProps {
  onGenerate: (headerValue: string) => void;
  class?: string;
}

type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days';

const timeValueSchema = z.object({
  value: z.number().min(0),
  unit: z.enum(['seconds', 'minutes', 'hours', 'days']),
  enabled: z.boolean(),
});

const formSchema = z.object({
  cacheability: z.enum(['public', 'private', 'none']),
  noStore: z.boolean(),
  noCache: z.boolean(),
  mustRevalidate: z.boolean(),
  proxyRevalidate: z.boolean(),
  maxAge: timeValueSchema,
  sMaxAge: timeValueSchema,
  staleWhileRevalidate: timeValueSchema,
  staleIfError: timeValueSchema,
  noTransform: z.boolean(),
  immutable: z.boolean(),
});

export const GenerateForm: Component<GenerateFormProps> = (props) => {
  const form = createForm(() => ({
    defaultValues: {
      cacheability: 'public' as const,
      noStore: false,
      noCache: false,
      mustRevalidate: false,
      proxyRevalidate: false,
      maxAge: {
        value: 3600,
        unit: 'seconds' as TimeUnit,
        enabled: true,
      },
      sMaxAge: {
        value: 7200,
        unit: 'seconds' as TimeUnit,
        enabled: false,
      },
      staleWhileRevalidate: {
        value: 60,
        unit: 'seconds' as TimeUnit,
        enabled: false,
      },
      staleIfError: {
        value: 300,
        unit: 'seconds' as TimeUnit,
        enabled: false,
      },
      noTransform: false,
      immutable: false,
    },
    onSubmit: ({ value }) => {
      const headerValue = generateHeader(value);
      props.onGenerate(headerValue);
    },
    // validatorAdapter: zodForm(formSchema),
  }));
  
  const disableCache = createMemo(() => form.getFieldValue('noStore'));
  
  return (
    <div class={cn('space-y-6', props.class)}>
      <form.Provider>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          class="space-y-6"
        >
          {/* General Caching Section */}
          <div>
            <h3 class="text-lg font-medium text-primary mb-3">General Caching</h3>
            <Card class="p-4 space-y-4">
              <div class="space-y-3">
                <p class="text-sm font-medium">Cacheability</p>
                <div class="flex flex-col gap-2">
                  <label class="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="cacheability"
                      value="public"
                      checked={form.getFieldValue('cacheability') === 'public'}
                      onChange={() => form.setFieldValue('cacheability', 'public')}
                      disabled={disableCache()}
                      class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Public
                    </span>
                  </label>
                  <p class="text-xs text-muted-foreground ml-6">Response can be stored by any cache, including browsers and CDNs.</p>
                  
                  <label class="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="cacheability"
                      value="private"
                      checked={form.getFieldValue('cacheability') === 'private'}
                      onChange={() => form.setFieldValue('cacheability', 'private')}
                      disabled={disableCache()}
                      class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Private
                    </span>
                  </label>
                  <p class="text-xs text-muted-foreground ml-6">Response is intended for a single user and must not be stored by shared caches.</p>
                  
                  <label class="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="cacheability"
                      value="none"
                      checked={form.getFieldValue('cacheability') === 'none'}
                      onChange={() => form.setFieldValue('cacheability', 'none')}
                      disabled={disableCache()}
                      class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      None
                    </span>
                  </label>
                  <p class="text-xs text-muted-foreground ml-6">Don't specify public or private explicitly.</p>
                </div>
              </div>
              
              <div class="space-y-2">
                <div class="flex items-center space-x-2">
                  <Checkbox 
                    checked={form.getFieldValue('noStore')}
                    onChange={(checked) => {
                      form.setFieldValue('noStore', checked);
                      // If no-store is enabled, disable other caching directives
                      if (checked) {
                        form.setFieldValue('maxAge.enabled', false);
                        form.setFieldValue('sMaxAge.enabled', false);
                        form.setFieldValue('staleWhileRevalidate.enabled', false);
                        form.setFieldValue('staleIfError.enabled', false);
                      }
                    }}
                    id="no-store"
                  />
                  <label 
                    for="no-store"
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    No Store
                  </label>
                </div>
                <p class="text-xs text-muted-foreground ml-6">
                  Response must not be stored in any cache. Used for sensitive data.
                </p>
              </div>
              
              <div class="space-y-2">
                <div class="flex items-center space-x-2">
                  <Checkbox 
                    checked={form.getFieldValue('noCache')}
                    onChange={(checked) => form.setFieldValue('noCache', checked)}
                    disabled={disableCache()}
                    id="no-cache"
                  />
                  <label 
                    for="no-cache"
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    No Cache
                  </label>
                </div>
                <p class="text-xs text-muted-foreground ml-6">
                  Cache must revalidate with the origin server before using the cached copy.
                </p>
              </div>
            </Card>
          </div>
          
          {/* Validation Section */}
          <div>
            <h3 class="text-lg font-medium text-primary mb-3">Validation</h3>
            <Card class="p-4 space-y-4">
              <div class="space-y-2">
                <div class="flex items-center space-x-2">
                  <Checkbox 
                    checked={form.getFieldValue('mustRevalidate')}
                    onChange={(checked) => form.setFieldValue('mustRevalidate', checked)}
                    disabled={disableCache()}
                    id="must-revalidate"
                  />
                  <label 
                    for="must-revalidate"
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Must Revalidate
                  </label>
                </div>
                <p class="text-xs text-muted-foreground ml-6">
                  Cache must verify stale responses with the origin server before using them.
                </p>
              </div>
              
              <div class="space-y-2">
                <div class="flex items-center space-x-2">
                  <Checkbox 
                    checked={form.getFieldValue('proxyRevalidate')}
                    onChange={(checked) => form.setFieldValue('proxyRevalidate', checked)}
                    disabled={disableCache()}
                    id="proxy-revalidate"
                  />
                  <label 
                    for="proxy-revalidate"
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Proxy Revalidate
                  </label>
                </div>
                <p class="text-xs text-muted-foreground ml-6">
                  Similar to must-revalidate but only applies to shared caches like CDNs.
                </p>
              </div>
              
              <div class="space-y-2">
                <div class="flex items-center space-x-2">
                  <Checkbox 
                    checked={form.getFieldValue('immutable')}
                    onChange={(checked) => form.setFieldValue('immutable', checked)}
                    disabled={disableCache()}
                    id="immutable"
                  />
                  <label 
                    for="immutable"
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Immutable
                  </label>
                </div>
                <p class="text-xs text-muted-foreground ml-6">
                  Indicates the response body will not change over time (for HTTP/2+).
                </p>
              </div>
            </Card>
          </div>
          
          {/* Expiration Section */}
          <div>
            <h3 class="text-lg font-medium text-primary mb-3">Expiration</h3>
            <Card class="p-4 space-y-4">
              <TimeInput
                label="Max Age"
                value={form.getFieldValue('maxAge.value')}
                unit={form.getFieldValue('maxAge.unit')}
                enabled={form.getFieldValue('maxAge.enabled')}
                onValueChange={(value) => form.setFieldValue('maxAge.value', value)}
                onUnitChange={(unit) => form.setFieldValue('maxAge.unit', unit)}
                onEnabledChange={(enabled) => form.setFieldValue('maxAge.enabled', enabled)}
                description="Maximum time the response can be used before revalidation."
                disabled={disableCache()}
              />
              
              <TimeInput
                label="Shared Max Age (s-maxage)"
                value={form.getFieldValue('sMaxAge.value')}
                unit={form.getFieldValue('sMaxAge.unit')}
                enabled={form.getFieldValue('sMaxAge.enabled')}
                onValueChange={(value) => form.setFieldValue('sMaxAge.value', value)}
                onUnitChange={(unit) => form.setFieldValue('sMaxAge.unit', unit)}
                onEnabledChange={(enabled) => form.setFieldValue('sMaxAge.enabled', enabled)}
                description="Like max-age but applies only to shared caches (CDNs)."
                disabled={disableCache()}
              />
              
              <TimeInput
                label="Stale While Revalidate"
                value={form.getFieldValue('staleWhileRevalidate.value')}
                unit={form.getFieldValue('staleWhileRevalidate.unit')}
                enabled={form.getFieldValue('staleWhileRevalidate.enabled')}
                onValueChange={(value) => form.setFieldValue('staleWhileRevalidate.value', value)}
                onUnitChange={(unit) => form.setFieldValue('staleWhileRevalidate.unit', unit)}
                onEnabledChange={(enabled) => form.setFieldValue('staleWhileRevalidate.enabled', enabled)}
                description="Time window to serve stale content while revalidating in background."
                disabled={disableCache()}
              />
              
              <TimeInput
                label="Stale If Error"
                value={form.getFieldValue('staleIfError.value')}
                unit={form.getFieldValue('staleIfError.unit')}
                enabled={form.getFieldValue('staleIfError.enabled')}
                onValueChange={(value) => form.setFieldValue('staleIfError.value', value)}
                onUnitChange={(unit) => form.setFieldValue('staleIfError.unit', unit)}
                onEnabledChange={(enabled) => form.setFieldValue('staleIfError.enabled', enabled)}
                description="Time window to serve stale content if the origin server is unavailable."
                disabled={disableCache()}
              />
            </Card>
          </div>
          
          {/* Other Section */}
          <div>
            <h3 class="text-lg font-medium text-primary mb-3">Other Directives</h3>
            <Card class="p-4 space-y-4">
              <div class="space-y-2">
                <div class="flex items-center space-x-2">
                  <Checkbox 
                    checked={form.getFieldValue('noTransform')}
                    onChange={(checked) => form.setFieldValue('noTransform', checked)}
                    id="no-transform"
                  />
                  <label 
                    for="no-transform"
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    No Transform
                  </label>
                </div>
                <p class="text-xs text-muted-foreground ml-6">
                  Prevents caches from modifying the response content (like image compression).
                </p>
              </div>
            </Card>
          </div>
          
          <Button type="submit" class="w-full">
            Generate Cache-Control Header
          </Button>
        </form>
      </form.Provider>
    </div>
  );
};