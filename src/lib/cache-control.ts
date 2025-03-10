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
      'Response can be stored by any cache, including browsers and CDNs.',
    category: 'general',
    type: 'response',
  },
  private: {
    description:
      'Response is intended for a single user and must not be stored by shared caches like CDNs.',
    category: 'general',
    type: 'response',
  },
  'no-cache': {
    description:
      'Cache must revalidate with the origin server before using the cached copy, even if the response is fresh.',
    category: 'validation',
    type: 'both',
  },
  'no-store': {
    description:
      'Response must not be stored in any cache. Used for sensitive data that should never be cached.',
    category: 'general',
    type: 'both',
  },
  'max-age': {
    description:
      'Specifies the maximum time (in seconds) the response can be used before it must be revalidated.',
    category: 'expiration',
    type: 'both',
  },
  's-maxage': {
    description:
      'Like max-age but applies only to shared caches (such as CDNs), overriding max-age.',
    category: 'expiration',
    type: 'response',
  },
  'must-revalidate': {
    description:
      'Cache must verify stale responses with the origin server before using them.',
    category: 'validation',
    type: 'response',
  },
  'proxy-revalidate': {
    description:
      'Similar to must-revalidate but only applies to shared caches like CDNs.',
    category: 'validation',
    type: 'response',
  },
  'no-transform': {
    description:
      'Prevents caches from modifying the response content (like image compression).',
    category: 'other',
    type: 'both',
  },
  immutable: {
    description:
      'Indicates the response body will not change over time, so clients should not revalidate even upon refresh (for HTTP/2+). Support: Chrome, Firefox, Edge support it; Safari has inconsistent support.',
    category: 'validation',
    type: 'response',
  },
  'stale-while-revalidate': {
    description:
      "Allows serving stale content while revalidating in the background. This improves performance by returning cached content immediately while asynchronously checking if it's still current. Support varies across CDNs: Cloudflare requires Enterprise plan with Cache Rules, AWS CloudFront needs Lambda@Edge customization, Fastly and Akamai fully support it. Chrome, Firefox, and Edge browsers support it; Safari has limited support.",
    category: 'validation',
    type: 'response',
  },
  'stale-if-error': {
    description:
      'Allows serving stale content if the origin server is unavailable. This provides a fallback during server outages to maintain user experience. Support varies across CDNs: Cloudflare requires Enterprise plan, AWS CloudFront has no native support, Fastly and Akamai support it. Browser support is limited (mainly Chrome).',
    category: 'validation',
    type: 'response',
  },
  'min-fresh': {
    description:
      'Client requests responses that remain fresh for at least the specified time (in seconds).',
    category: 'expiration',
    type: 'request',
  },
  'max-stale': {
    description:
      'Client is willing to accept responses that have exceeded their freshness lifetime by up to the specified time (in seconds).',
    category: 'expiration',
    type: 'request',
  },
  'only-if-cached': {
    description:
      'Client only wants already-cached responses, preventing network requests.',
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
  const result = parseCacheControlHeader(headerValue);

  if (!result.valid) {
    return `Invalid Cache-Control header: ${result.errors.join(', ')}`;
  }

  if (!result.directives.length) {
    return 'No caching directives specified.';
  }

  const explanations = result.directives.map((directive) => {
    let base = directive.description;

    if (typeof directive.value === 'number') {
      const humanTime = formatTime(directive.value);
      base += ` (${humanTime})`;
    }

    return `${directive.name}${directive.value !== undefined ? `=${directive.value.toString()}` : ''}: ${base}`;
  });

  return explanations.join('\n');
}

// Time formatting utility
function formatTime(seconds: number): string {
  if (seconds < 0) return 'invalid';

  const units = [
    { value: Math.floor(seconds / 86400), name: 'day' },
    { value: Math.floor((seconds % 86400) / 3600), name: 'hour' },
    { value: Math.floor((seconds % 3600) / 60), name: 'minute' },
    { value: seconds % 60, name: 'second' },
  ];

  const parts = units
    .filter((unit) => unit.value > 0)
    .map(
      (unit) =>
        `${unit.value.toString()} ${unit.name}${unit.value !== 1 ? 's' : ''}`,
    );

  return parts.length ? parts.join(', ') : '0 seconds';
}
