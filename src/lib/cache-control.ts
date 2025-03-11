import { formatDuration } from 'date-fns';
import { z } from 'zod';

type CacheControlDirective = {
  name: string;
  value?: string | number;
  description: string;
  category: 'general' | 'expiration' | 'validation' | 'other';
  type: 'response' | 'request' | 'both';
};

type DirectiveDefinition = Omit<CacheControlDirective, 'name' | 'value'>;

export const directives = {
  public: {
    description:
      'Response can be stored by any cache, including browsers and CDNs.\nUse for content that can be shared among users, such as static images or CSS files.',
    category: 'general',
    type: 'response',
  },
  private: {
    description:
      'Response is intended for a single user and must not be stored by shared caches like CDNs.\nUse for personalized content, like user-specific pages.',
    category: 'general',
    type: 'response',
  },
  'no-cache': {
    description:
      'Cache must revalidate with the origin server before using the cached copy, even if the response is fresh. Note: This DOES NOT mean "don\'t cache" - it means the response must be validated before use.',
    category: 'validation',
    type: 'both',
  },
  'no-store': {
    description:
      'Response must not be stored in any cache.\nUsed for sensitive data that should never be cached. Overrides all other directives.',
    category: 'general',
    type: 'both',
  },
  'max-age': {
    description:
      'Specifies the maximum time (in seconds) the response remains "fresh". During this time, the browser can use the cached version without checking with the server.',
    category: 'expiration',
    type: 'both',
  },
  's-maxage': {
    description:
      'Like max-age but applies only to shared caches (such as CDNs), overriding max-age. Allows different caching strategies for browsers vs. CDNs.',
    category: 'expiration',
    type: 'response',
  },
  'must-revalidate': {
    description:
      'Once a response becomes stale, the cache MUST verify it with the origin server before reuse. Prevents caches from using stale responses when disconnected from the origin.',
    category: 'validation',
    type: 'response',
  },
  'proxy-revalidate': {
    description:
      'Similar to must-revalidate but only applies to shared caches like CDNs. Allows browser caches to serve stale content offline while requiring CDNs to revalidate.',
    category: 'validation',
    type: 'response',
  },
  'no-transform': {
    description:
      'Prevents caches from modifying the response content (like image compression). Ensures content integrity by preventing proxies from altering your content in any way.',
    category: 'other',
    type: 'both',
  },
  immutable: {
    description:
      'Indicates the response body will not change during its freshness lifetime, preventing unnecessary revalidation on page reload. Best for versioned assets with hash filenames. Support: Chrome, Firefox, Edge support it; Safari has inconsistent support.',
    category: 'validation',
    type: 'response',
  },
  'stale-while-revalidate': {
    description:
      'Allows serving stale content while revalidating in the background. When a cached response becomes stale, it returns the stale response immediately while fetching a fresh copy in the background, eliminating waiting time for users. Example: with max-age=60, stale-while-revalidate=3600, content is fresh for 1 minute, then can be used while stale for up to 1 hour during revalidation.',
    category: 'validation',
    type: 'response',
  },
  'stale-if-error': {
    description:
      'Allows serving stale content if the origin server returns an error. Provides fallback during server outages to maintain user experience. If revalidation fails with a 5xx response, the stale content can still be used for the specified duration.',
    category: 'validation',
    type: 'response',
  },
  'min-fresh': {
    description:
      'Client requests responses that remain fresh for at least the specified time (in seconds). Used by clients to ensure they receive content that will remain fresh for a minimum period.',
    category: 'expiration',
    type: 'request',
  },
  'max-stale': {
    description:
      'Client is willing to accept responses that have exceeded their freshness lifetime by up to the specified time (in seconds). Indicates the client can tolerate somewhat outdated responses.',
    category: 'expiration',
    type: 'request',
  },
  'only-if-cached': {
    description:
      'Client only wants already-cached responses, preventing network requests. Useful for offline mode or poor connectivity scenarios.',
    category: 'other',
    type: 'request',
  },
} as const satisfies Record<string, DirectiveDefinition>;

type DirectiveName = keyof typeof directives;
const isDirective = (directive: string): directive is DirectiveName =>
  directive in directives;

const numericDirectives = [
  'max-age',
  's-maxage',
  'stale-while-revalidate',
  'stale-if-error',
  'min-fresh',
  'max-stale',
] as const satisfies DirectiveName[];
const isNumericDirective = (
  directive: string,
): directive is (typeof numericDirectives)[number] =>
  numericDirectives.includes(directive as (typeof numericDirectives)[number]);

// Type definition for the parse result
type ParseResult =
  | { valid: true; directives: CacheControlDirective[] }
  | { valid: false; directives: CacheControlDirective[]; errors: string[] };

// Schema for validating Cache-Control headers
const cacheControlSchema = z.string().transform((header): ParseResult => {
  const directivesArray = parseHeader(header);
  const errors: string[] = [];

  // Check for unknown directives
  const unknownDirectives = directivesArray.filter((d) => !isDirective(d.name));
  if (unknownDirectives.length > 0) {
    errors.push(
      `Unknown directive(s): ${unknownDirectives.map((d) => d.name).join(', ')}`,
    );
  }

  // Check for numeric directives with invalid or missing values
  const numericDirectivesWithInvalidValues = directivesArray.filter(
    (d) =>
      isNumericDirective(d.name) &&
      (d.value === undefined || d.value === '' || isNaN(Number(d.value))),
  );
  if (numericDirectivesWithInvalidValues.length > 0) {
    errors.push(
      `Invalid or missing value for directive(s): ${numericDirectivesWithInvalidValues.map((d) => d.name).join(', ')}`,
    );
  }

  // Validate directive combinations
  const names = new Set(directivesArray.map((d) => d.name));
  if (names.has('no-store') && (names.has('public') || names.has('private'))) {
    errors.push('no-store cannot be combined with public or private');
  }
  if (names.has('public') && names.has('private')) {
    errors.push('public and private are mutually exclusive');
  }

  // Special case for handling garbage headers (completely invalid input)
  if (
    directivesArray.length > 0 &&
    !directivesArray.some((d) => isDirective(d.name)) &&
    errors.length === 0
  ) {
    errors.push('Unknown or invalid Cache-Control directive');
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
      directives: directivesArray,
    };
  }

  return {
    valid: true,
    directives: directivesArray,
  };
});

function parseHeader(headerValue: string): CacheControlDirective[] {
  if (!headerValue) return [];

  return headerValue
    .split(',')
    .map((d) => d.trim())
    .filter((directiveStr) => directiveStr.length > 0)
    .map((directiveStr) => {
      const [directiveName, directiveValue] = directiveStr
        .split('=')
        .map((s) => s.trim());
      const name = directiveName ?? ''; // Ensure name is a string

      const directiveInfo = isDirective(name)
        ? directives[name]
        : ({
            description: 'Unknown directive',
            category: 'other',
            type: 'both',
          } as const);

      // Handle empty values for numeric directives
      let value: string | number | undefined = directiveValue;
      if (isNumericDirective(name)) {
        if (directiveValue === undefined || directiveValue === '') {
          value = undefined;
        } else {
          value = Number(directiveValue);
        }
      }

      return {
        name,
        value,
        description: directiveInfo.description,
        category: directiveInfo.category,
        type: directiveInfo.type,
      };
    });
}

export function parseCacheControlHeader(headerString: string): ParseResult {
  if (!headerString.trim()) {
    return { valid: true, directives: [] };
  }

  // Use Zod schema to validate and parse the header
  const result = cacheControlSchema.safeParse(headerString);

  if (result.success) {
    return result.data;
  } else {
    // In case of an error in the transformation, return a useful error message
    // This should rarely happen as most errors are handled within the transform
    return {
      valid: false,
      directives: parseHeader(headerString),
      errors: result.error.errors.map((e) => e.message),
    };
  }
}

// Enhanced explanation generator
export function generateHeaderExplanation(headerValue: string): string {
  if (!headerValue || headerValue.trim() === '') {
    return '';
  }

  const parsedDirectives = parseHeader(headerValue);
  if (parsedDirectives.length === 0) {
    return 'This Cache-Control header is empty or invalid.';
  }

  // Check for specific directives
  const hasNoStore = parsedDirectives.some((d) => d.name === 'no-store');
  const hasNoCache = parsedDirectives.some((d) => d.name === 'no-cache');
  const hasPublic = parsedDirectives.some((d) => d.name === 'public');
  const hasPrivate = parsedDirectives.some((d) => d.name === 'private');
  const hasMaxAge = parsedDirectives.some((d) => d.name === 'max-age');
  const hasMustRevalidate = parsedDirectives.some(
    (d) => d.name === 'must-revalidate',
  );
  const hasImmutable = parsedDirectives.some((d) => d.name === 'immutable');
  const hasSMaxAge = parsedDirectives.some((d) => d.name === 's-maxage');
  const hasStaleWhileRevalidate = parsedDirectives.some(
    (d) => d.name === 'stale-while-revalidate',
  );
  const hasStaleIfError = parsedDirectives.some(
    (d) => d.name === 'stale-if-error',
  );

  let explanation = '';

  // Storage and cacheability
  if (hasNoStore) {
    return 'This response must not be stored in any cache. It will not be saved by browsers or shared caches like CDNs. This is the most restrictive directive and overrides any other caching directives.';
  }

  // Determine cacheability scope
  if (hasPrivate) {
    explanation =
      'This response is private and should only be stored in browser caches, not in shared caches like CDNs or proxies. ';
  } else if (hasPublic) {
    explanation =
      'This response can be stored by any cache, including browsers and shared caches like CDNs. ';
  } else {
    explanation = 'This response can be cached ';
  }

  // Add freshness lifetime
  if (hasMaxAge) {
    const maxAgeDir = parsedDirectives.find((d) => d.name === 'max-age');
    if (maxAgeDir?.value) {
      const seconds = Number(maxAgeDir.value);
      const humanTime = formatTime(seconds);

      if (seconds === 0) {
        explanation += `but is immediately considered stale. `;
      } else {
        explanation += `and will remain fresh for ${humanTime}. `;
      }

      if (hasSMaxAge) {
        const sMaxAgeDir = parsedDirectives.find((d) => d.name === 's-maxage');
        if (sMaxAgeDir?.value) {
          const sSeconds = Number(sMaxAgeDir.value);
          const sHumanTime = formatTime(sSeconds);
          explanation += `For shared caches like CDNs, it will remain fresh for ${sHumanTime}. `;
        }
      }
    }
  } else if (!hasNoCache) {
    explanation += `with default freshness lifetime. `;
  }

  // Add validation behavior
  if (hasNoCache) {
    explanation += `Caches must revalidate with the origin server before using this response, even if it's still fresh. `;
  }

  if (hasMustRevalidate) {
    explanation += `Once stale, this response must be revalidated with the origin server before being used. `;
  }

  // Special cases
  if (hasImmutable) {
    explanation += `This response will not change during its freshness lifetime, so clients shouldn't revalidate it even when the user refreshes the page. `;
  }

  if (hasStaleWhileRevalidate) {
    const swrDir = parsedDirectives.find(
      (d) => d.name === 'stale-while-revalidate',
    );
    if (swrDir?.value) {
      const seconds = Number(swrDir.value);
      const humanTime = formatTime(seconds);
      explanation += `After becoming stale, it can still be used for ${humanTime} while a background revalidation occurs. `;
    }
  }

  if (hasStaleIfError) {
    const sieDir = parsedDirectives.find((d) => d.name === 'stale-if-error');
    if (sieDir?.value) {
      const seconds = Number(sieDir.value);
      const humanTime = formatTime(seconds);
      explanation += `If the server returns an error during revalidation, the stale response can be used for ${humanTime}. `;
    }
  }

  return explanation.trim();
}

// Time formatting utility using date-fns
function formatTime(seconds: number): string {
  if (seconds < 0) return 'invalid';
  if (seconds === 0) return '0 seconds';

  // Only include non-zero values in duration object
  const duration: Record<string, number> = {};

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (days > 0) duration.days = days;
  if (hours > 0) duration.hours = hours;
  if (minutes > 0) duration.minutes = minutes;
  if (secs > 0) duration.seconds = secs;

  return formatDuration(duration);
}
