// Types
export type CacheControlDirective = {
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
      'Indicates the response body will not change over time, so clients should not revalidate even upon refresh (for HTTP/2+).',
    category: 'validation',
    type: 'response',
  },
  'stale-while-revalidate': {
    description:
      'Allows serving stale content while revalidating in the background.',
    category: 'validation',
    type: 'response',
  },
  'stale-if-error': {
    description:
      'Allows serving stale content if the origin server is unavailable.',
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
      name = parts[0].trim().toLowerCase();
      value = parts[1].trim();
    } else {
      name = directiveStr.trim().toLowerCase();
      value = undefined;
    }

    // Get directive info from dictionary or mark as unknown
    const directiveInfo = directives[name] || {
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

// Format time in seconds to a human-readable string
export function formatTime(seconds: number): string {
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
    parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  }

  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  }

  if (remainingSeconds > 0 || parts.length === 0) {
    parts.push(
      `${remainingSeconds} ${remainingSeconds === 1 ? 'second' : 'seconds'}`,
    );
  }

  return parts.join(', ');
}

// Calculate time in seconds based on value and unit
export function calculateSeconds(
  value: number,
  unit: 'seconds' | 'minutes' | 'hours' | 'days',
): number {
  switch (unit) {
    case 'seconds':
      return value;
    case 'minutes':
      return value * 60;
    case 'hours':
      return value * 3600;
    case 'days':
      return value * 86400;
    default:
      return value;
  }
}

// Generate a Cache-Control header string based on form values
export type FormValues = {
  cacheability: 'public' | 'private' | 'none';
  noStore: boolean;
  noCache: boolean;
  mustRevalidate: boolean;
  proxyRevalidate: boolean;
  maxAge: {
    value: number;
    unit: 'seconds' | 'minutes' | 'hours' | 'days';
    enabled: boolean;
  };
  sMaxAge: {
    value: number;
    unit: 'seconds' | 'minutes' | 'hours' | 'days';
    enabled: boolean;
  };
  staleWhileRevalidate: {
    value: number;
    unit: 'seconds' | 'minutes' | 'hours' | 'days';
    enabled: boolean;
  };
  staleIfError: {
    value: number;
    unit: 'seconds' | 'minutes' | 'hours' | 'days';
    enabled: boolean;
  };
  noTransform: boolean;
  immutable: boolean;
};

export function generateHeader(formValues: FormValues): string {
  const directives: string[] = [];

  // Cacheability directives
  if (formValues.cacheability === 'public') {
    directives.push('public');
  } else if (formValues.cacheability === 'private') {
    directives.push('private');
  }

  // Storage directives
  if (formValues.noStore) {
    directives.push('no-store');
  }

  if (formValues.noCache) {
    directives.push('no-cache');
  }

  // Validation directives
  if (formValues.mustRevalidate) {
    directives.push('must-revalidate');
  }

  if (formValues.proxyRevalidate) {
    directives.push('proxy-revalidate');
  }

  // Expiration directives
  if (formValues.maxAge.enabled && formValues.maxAge.value >= 0) {
    const seconds = calculateSeconds(
      formValues.maxAge.value,
      formValues.maxAge.unit,
    );
    directives.push(`max-age=${seconds}`);
  }

  if (formValues.sMaxAge.enabled && formValues.sMaxAge.value >= 0) {
    const seconds = calculateSeconds(
      formValues.sMaxAge.value,
      formValues.sMaxAge.unit,
    );
    directives.push(`s-maxage=${seconds}`);
  }

  if (
    formValues.staleWhileRevalidate.enabled &&
    formValues.staleWhileRevalidate.value >= 0
  ) {
    const seconds = calculateSeconds(
      formValues.staleWhileRevalidate.value,
      formValues.staleWhileRevalidate.unit,
    );
    directives.push(`stale-while-revalidate=${seconds}`);
  }

  if (formValues.staleIfError.enabled && formValues.staleIfError.value >= 0) {
    const seconds = calculateSeconds(
      formValues.staleIfError.value,
      formValues.staleIfError.unit,
    );
    directives.push(`stale-if-error=${seconds}`);
  }

  // Other directives
  if (formValues.noTransform) {
    directives.push('no-transform');
  }

  if (formValues.immutable) {
    directives.push('immutable');
  }

  return directives.join(', ');
}

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
      explanation += ` In this case, the value is ${seconds} seconds (${humanTime}).`;
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
