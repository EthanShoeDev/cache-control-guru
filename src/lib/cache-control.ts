// Types
type CacheControlDirective = {
  name: string;
  value?: string;
  description: string;
  category: 'general' | 'expiration' | 'validation' | 'other';
  type: 'response' | 'request' | 'both';
};

// Cache-Control directives dictionary with explanations
export const directives: Record<
  string,
  Omit<CacheControlDirective, 'name' | 'value'>
> = {
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
};

// Parse Cache-Control header string into individual directives
export function parseHeader(headerValue: string): CacheControlDirective[] {
  if (!headerValue || headerValue.trim() === '') {
    return [];
  }

  // Split by commas and trim whitespace
  const directiveStrings = headerValue.split(',').map((d) => d.trim());

  return directiveStrings.map((directiveStr) => {
    // Check if directive has a value (contains =)
    const hasValue = directiveStr.includes('=');
    let name: string;
    let value: string | undefined;

    if (hasValue) {
      const parts = directiveStr.split('=');
      name = parts[0]?.trim().toLowerCase() ?? '';
      value = parts[1]?.trim() ?? '';
    } else {
      name = directiveStr.trim().toLowerCase();
      value = undefined;
    }

    // Get directive info from dictionary or mark as unknown
    const directiveInfo = directives[name] ?? {
      description: 'Unknown directive or not standard.',
      category: 'other',
      type: 'both',
    };

    return {
      name,
      value,
      description: directiveInfo.description,
      category: directiveInfo.category,
      type: directiveInfo.type,
    };
  });
}

// Validate a Cache-Control header string
export function validateHeader(headerValue: string): {
  valid: boolean;
  error?: string;
} {
  if (!headerValue || headerValue.trim() === '') {
    return { valid: true };
  }

  // Split by commas and trim whitespace
  const directiveStrings = headerValue.split(',').map((d) => d.trim());

  // Check for empty directives
  if (directiveStrings.some((d) => d === '')) {
    return {
      valid: false,
      error: 'Invalid format: Empty directive found (consecutive commas)',
    };
  }

  for (const directiveStr of directiveStrings) {
    if (directiveStr.includes('=')) {
      const parts = directiveStr.split('=');
      const name = parts[0]?.trim().toLowerCase() ?? '';
      const value = parts[1]?.trim() ?? '';

      // Check directive name validity
      if (!name) {
        return {
          valid: false,
          error: `Invalid directive format: missing name before equals sign in "${directiveStr}"`,
        };
      }

      // Check if directive should have a value
      if (!directives[name]) {
        continue; // Unknown directive, we'll allow it
      }

      // For directives that require numeric values
      if (
        [
          'max-age',
          's-maxage',
          'stale-while-revalidate',
          'stale-if-error',
        ].includes(name)
      ) {
        if (!value || isNaN(Number(value))) {
          return {
            valid: false,
            error: `Invalid value for ${name}: must be a number`,
          };
        }
      }
    } else {
      const name = directiveStr.trim().toLowerCase();

      // Validation for directives that should have values
      if (
        [
          'max-age',
          's-maxage',
          'stale-while-revalidate',
          'stale-if-error',
        ].includes(name)
      ) {
        return {
          valid: false,
          error: `${name} directive requires a numeric value`,
        };
      }
    }
  }

  // Check for contradicting directives
  const directiveNames = directiveStrings.map((d) => {
    return d.includes('=')
      ? (d.split('=')[0]?.trim().toLowerCase() ?? '')
      : d.trim().toLowerCase();
  });

  if (
    directiveNames.includes('no-store') &&
    (directiveNames.includes('public') || directiveNames.includes('private'))
  ) {
    return {
      valid: false,
      error:
        'Contradicting directives: no-store cannot be used with public/private',
    };
  }

  if (directiveNames.includes('public') && directiveNames.includes('private')) {
    return {
      valid: false,
      error:
        'Contradicting directives: public and private cannot be used together',
    };
  }

  return { valid: true };
}

// Generate a human-readable explanation of the cache-control header
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
      const seconds = parseInt(maxAgeDir.value, 10);
      const humanTime = formatTime(seconds);

      if (seconds === 0) {
        explanation += `but is immediately considered stale. `;
      } else {
        explanation += `and will remain fresh for ${humanTime}. `;
      }

      if (hasSMaxAge) {
        const sMaxAgeDir = parsedDirectives.find((d) => d.name === 's-maxage');
        if (sMaxAgeDir?.value) {
          const sSeconds = parseInt(sMaxAgeDir.value, 10);
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
      const seconds = parseInt(swrDir.value, 10);
      const humanTime = formatTime(seconds);
      explanation += `After becoming stale, it can still be used for ${humanTime} while a background revalidation occurs. `;
    }
  }

  if (hasStaleIfError) {
    const sieDir = parsedDirectives.find((d) => d.name === 'stale-if-error');
    if (sieDir?.value) {
      const seconds = parseInt(sieDir.value, 10);
      const humanTime = formatTime(seconds);
      explanation += `If the server returns an error during revalidation, the stale response can be used for ${humanTime}. `;
    }
  }

  return explanation.trim();
}

// Format time in seconds to a human-readable string
function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) {
    return 'Invalid time value';
  }

  if (seconds === 0) {
    return '0 seconds';
  }

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];

  if (days > 0) {
    parts.push(`${String(days)} ${days === 1 ? 'day' : 'days'}`);
  }

  if (hours > 0) {
    parts.push(`${String(hours)} ${hours === 1 ? 'hour' : 'hours'}`);
  }

  if (minutes > 0) {
    parts.push(`${String(minutes)} ${minutes === 1 ? 'minute' : 'minutes'}`);
  }

  if (remainingSeconds > 0 || parts.length === 0) {
    parts.push(
      `${String(remainingSeconds)} ${remainingSeconds === 1 ? 'second' : 'seconds'}`,
    );
  }

  return parts.join(', ');
}

// // Calculate time in seconds based on value and unit
// function calculateSeconds(
//   value: number,
//   unit: 'seconds' | 'minutes' | 'hours' | 'days',
// ): number {
//   switch (unit) {
//     case 'seconds':
//       return value;
//     case 'minutes':
//       return value * 60;
//     case 'hours':
//       return value * 3600;
//     case 'days':
//       return value * 86400;
//     default:
//       return value;
//   }
// }

// // Generate a Cache-Control header string based on form values
// type FormValues = {
//   cacheability: 'public' | 'private' | 'none';
//   noStore: boolean;
//   noCache: boolean;
//   mustRevalidate: boolean;
//   proxyRevalidate: boolean;
//   maxAge: {
//     value: number;
//     unit: 'seconds' | 'minutes' | 'hours' | 'days';
//     enabled: boolean;
//   };
//   sMaxAge: {
//     value: number;
//     unit: 'seconds' | 'minutes' | 'hours' | 'days';
//     enabled: boolean;
//   };
//   staleWhileRevalidate: {
//     value: number;
//     unit: 'seconds' | 'minutes' | 'hours' | 'days';
//     enabled: boolean;
//   };
//   staleIfError: {
//     value: number;
//     unit: 'seconds' | 'minutes' | 'hours' | 'days';
//     enabled: boolean;
//   };
//   noTransform: boolean;
//   immutable: boolean;
// };

// function generateHeader(formValues: FormValues): string {
//   const directives: string[] = [];

//   // Cacheability directives
//   if (formValues.cacheability === 'public') {
//     directives.push('public');
//   } else if (formValues.cacheability === 'private') {
//     directives.push('private');
//   }

//   // Storage directives
//   if (formValues.noStore) {
//     directives.push('no-store');
//   }

//   if (formValues.noCache) {
//     directives.push('no-cache');
//   }

//   // Validation directives
//   if (formValues.mustRevalidate) {
//     directives.push('must-revalidate');
//   }

//   if (formValues.proxyRevalidate) {
//     directives.push('proxy-revalidate');
//   }

//   // Expiration directives
//   if (formValues.maxAge.enabled && formValues.maxAge.value >= 0) {
//     const seconds = calculateSeconds(
//       formValues.maxAge.value,
//       formValues.maxAge.unit,
//     );
//     directives.push(`max-age=${String(seconds)}`);
//   }

//   if (formValues.sMaxAge.enabled && formValues.sMaxAge.value >= 0) {
//     const seconds = calculateSeconds(
//       formValues.sMaxAge.value,
//       formValues.sMaxAge.unit,
//     );
//     directives.push(`s-maxage=${String(seconds)}`);
//   }

//   if (
//     formValues.staleWhileRevalidate.enabled &&
//     formValues.staleWhileRevalidate.value >= 0
//   ) {
//     const seconds = calculateSeconds(
//       formValues.staleWhileRevalidate.value,
//       formValues.staleWhileRevalidate.unit,
//     );
//     directives.push(`stale-while-revalidate=${String(seconds)}`);
//   }

//   if (formValues.staleIfError.enabled && formValues.staleIfError.value >= 0) {
//     const seconds = calculateSeconds(
//       formValues.staleIfError.value,
//       formValues.staleIfError.unit,
//     );
//     directives.push(`stale-if-error=${String(seconds)}`);
//   }

//   // Other directives
//   if (formValues.noTransform) {
//     directives.push('no-transform');
//   }

//   if (formValues.immutable) {
//     directives.push('immutable');
//   }

//   return directives.join(', ');
// }

// Enhance explanation with time formatting and contextual information
export function enhanceExplanation(directive: CacheControlDirective): string {
  let explanation = directive.description;

  // Add time context for directives with seconds
  if (
    directive.name === 'max-age' ||
    directive.name === 's-maxage' ||
    directive.name === 'stale-while-revalidate' ||
    directive.name === 'stale-if-error' ||
    directive.name === 'min-fresh' ||
    directive.name === 'max-stale'
  ) {
    if (directive.value && !isNaN(Number(directive.value))) {
      const seconds = parseInt(directive.value, 10);
      const humanTime = formatTime(seconds);
      explanation += ` In this case, the value is ${String(seconds)} seconds (${humanTime}).`;
    }
  }

  // Add interaction notes for certain directives
  if (directive.name === 'no-store' && directive.value === undefined) {
    explanation +=
      ' This is the most restrictive caching directive and overrides other caching directives.';
  }

  if (directive.name === 'immutable' && directive.value === undefined) {
    explanation +=
      ' Note: This directive is only supported in HTTP/2 and newer, and has limited browser support.';
  }

  return explanation;
}
