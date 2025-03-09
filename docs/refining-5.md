I am trying to build a small web app like https://crontab.guru/ except my website will help you understand and generate cache-control headers for HTTP requests.

Its very important that my site follows to the specification very closely https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control

Currently I have a explain mode and generate mode.

I want to greatly improve the quality of the form and descriptions.

My website should make the deep complex tech specification easy for anyone. The form should guide them through the process of crafting the perfect cache-control header for their specific use case

I want you to greatly improve the src/components/generate-form.tsx such that it is

Current project

ethan@Ethan-PC:~/cache-control-guru$ just tree-src 
tree -h -I "node_modules|.git|.next|dist|.cache|docs" | cat
[4.0K]  .
├── [1.4K]  CLAUDE.md
├── [1.0K]  LICENSE
├── [2.1K]  README.md
├── [ 598]  app.config.ts
├── [ 299]  components.json
├── [ 834]  eslint.config.js
├── [ 218]  justfile
├── [1.7K]  package.json
├── [257K]  pnpm-lock.yaml
├── [ 356]  prettier.config.js
├── [4.0K]  public
│   ├── [ 664]  favicon.ico
│   ├── [ 697]  header.svg
│   ├── [ 919]  og-image.svg
│   ├── [ 132]  robots.txt
│   └── [ 434]  sitemap.xml
├── [4.0K]  src
│   ├── [1.6K]  app.css
│   ├── [ 193]  app.tsx
│   ├── [4.0K]  components
│   │   ├── [ 113]  devtools.tsx
│   │   ├── [5.7K]  explain-header.tsx
│   │   ├── [2.8K]  explain-input.tsx
│   │   ├── [ 22K]  generate-form.tsx
│   │   ├── [1.3K]  header-display.tsx
│   │   ├── [ 736]  mode-tabs.tsx
│   │   ├── [2.0K]  nav-bar.tsx
│   │   ├── [1.8K]  theme-switch.tsx
│   │   ├── [3.2K]  time-input.tsx
│   │   └── [4.0K]  ui
│   │       ├── [1.9K]  alert.tsx
│   │       ├── [2.1K]  button.tsx
│   │       ├── [1.5K]  card.tsx
│   │       ├── [2.1K]  checkbox.tsx
│   │       ├── [ 10K]  scroll-area.tsx
│   │       ├── [ 912]  separator.tsx
│   │       ├── [2.2K]  switch.tsx
│   │       ├── [4.3K]  tabs.tsx
│   │       ├── [3.5K]  textfield.tsx
│   │       └── [1.3K]  tooltip.tsx
│   ├── [ 214]  entry-client.tsx
│   ├── [3.8K]  entry-server.tsx
│   ├── [  45]  global.d.ts
│   ├── [4.0K]  lib
│   │   ├── [9.2K]  cache-control.ts
│   │   └── [2.9K]  utils.ts
│   ├── [2.9K]  routeTree.gen.ts
│   ├── [ 591]  router.tsx
│   └── [4.0K]  routes
│       ├── [ 710]  $404.tsx
│       ├── [ 851]  __root.tsx
│       ├── [5.3K]  about.tsx
│       └── [4.5K]  index.tsx
├── [2.6K]  tailwind.config.js
└── [ 445]  tsconfig.json

6 directories, 49 files

Form Structure and Options
The form should be organized into logical sections, each with specific options, descriptions, and tooltips. Below is a detailed breakdown:

1. Cache Type
   This section determines how the response can be cached, with mutually exclusive options:

Public:
Description: The response can be cached by any cache, including shared caches like CDNs.
Tooltip: Suitable for content that can be shared among multiple users, such as static images or CSS files.
Implementation: Radio button, enables s-maxage and proxy-revalidate options.
Private:
Description: The response is intended for a single user and can be cached only by the user's browser. Shared caches should not store it.
Tooltip: Use for personalized content or data that should not be shared, like user-specific pages.
Implementation: Radio button, hides s-maxage and proxy-revalidate options.
No caching (no-store):
Description: The response must not be stored in any cache, suitable for sensitive data.
Tooltip: Ensures that no part of the response is cached, important for privacy and security, overrides all other directives.
Implementation: Radio button, disables all other sections when selected. 2. Freshness Duration
This section sets how long the response is considered fresh, with conditional options based on cache type:

Max Age:
Description: Specifies the maximum time (in seconds) the response is considered fresh.
Tooltip: After this time, the cache must revalidate the response with the server. Setting to 0 means immediate staleness.
Implementation: Input field with unit selection (seconds, minutes, hours, days), convert to seconds for header (e.g., 1 hour = 3600 seconds). Minimum value: 0, no maximum limit, but warn for very large values (e.g., > 1 year, 31536000 seconds).
Consideration: If max-age=0, the response is stale immediately, requiring revalidation.
s-maxage (only if Public is selected):
Description: Similar to max-age, but only for shared caches.
Tooltip: Allows setting a different freshness duration for shared caches, which might be longer or shorter depending on needs.
Implementation: Input field with unit selection, same conversion and limits as max-age.
Consideration: If both max-age and s-maxage are set, s-maxage applies to shared caches, max-age to private caches.
Immutable:
Description: Indicates that the response body will not change, so the cache can assume it's always fresh.
Tooltip: Useful for versioned static assets where content never changes once served. Note: Only a hint for HTTP/2+, support varies.
Implementation: Checkbox, no argument needed.
Consideration: May be interpreted as indefinite caching, but not all caches respect it; include warning in tooltip. 3. Cache Behavior for Fresh Responses
This section determines how caches handle responses that are still fresh:

Use fresh responses without revalidation:
Description: The cache can use the response without checking if it's still fresh.
Tooltip: This is the default behavior; the cache uses the response if within its freshness period, defined by max-age or s-maxage.
Implementation: Radio button, default selection if no-cache is not chosen.
Always revalidate fresh responses (no-cache):
Description: The cache must revalidate even if the response is fresh.
Tooltip: Forces revalidation even for fresh responses, potentially increasing server load. Note: Can be combined with max-age, but max-age defines freshness period before revalidation.
Implementation: Radio button, mutually exclusive with the above.
Consideration: Selecting no-cache with max-age means the cache will revalidate even for fresh responses, which may be inefficient; include a note in the tooltip. 4. Cache Behavior for Stale Responses
This section handles how caches deal with responses that are no longer fresh, with conditional options:

must-revalidate:
Description: The cache must revalidate the response with the origin server before using it when it becomes stale.
Tooltip: Ensures that stale responses are not used without checking with the server, improving accuracy.
Implementation: Checkbox, no argument needed.
Consideration: Applies to both private and shared caches, must be used with max-age or s-maxage.
proxy-revalidate (only if Public is selected):
Description: Similar to must-revalidate, but only applies to shared caches.
Tooltip: Allows private caches to serve stale responses while requiring shared caches to revalidate, balancing performance and accuracy.
Implementation: Checkbox, no argument needed.
Consideration: Only relevant for shared caches, so hide if Private is selected.
stale-while-revalidate:
Description: Allows serving a stale response while revalidating in the background.
Tooltip: Improves performance by immediately serving the stale response and updating it asynchronously. Note: Extension, support varies across caches.
Implementation: Input field with unit selection (seconds, minutes, hours, days), convert to seconds for header. Minimum value: 0, no maximum limit, but warn for very large values.
Consideration: Include warning in tooltip about varying support, as it's an extension.
stale-if-error:
Description: Allows serving a stale response if the server is unavailable.
Tooltip: Provides a fallback during server outages to maintain user experience. Note: Extension, support varies.
Implementation: Input field with unit selection, same as above.
Consideration: Include warning in tooltip about varying support, as it's an extension. 5. Other Directives
This section includes additional control options:

no-transform:
Description: Prevents caches from modifying the response content, such as image compression.
Tooltip: Ensures content integrity, important for resources where exact bytes matter, like APIs or specific media.
Implementation: Checkbox, no argument needed.
Consideration: Useful for preventing proxy optimizations that might alter the response.
Mutual Exclusions and Interactions
The form must handle mutual exclusions and interactions between directives:

Mutual Exclusions:
"No caching (no-store)" is mutually exclusive with all other caching directives; if selected, disable all other sections.
Cache Type (Public, Private, No caching) must be a single selection, implemented via radio buttons.
No-cache and Use fresh responses without revalidation are mutually exclusive, implemented via radio buttons.
Interactions:
If no-cache is selected, max-age still defines freshness, but the cache will revalidate even for fresh responses; include a note in the tooltip.
s-maxage and proxy-revalidate are only relevant for Public cache type, so hide them if Private is selected.
Immutable may override max-age in practice, but include a note that it's only a hint and support varies.
Edge Cases and Considerations
The form must handle edge cases and provide appropriate feedback:

Max-age=0: Treated as immediate staleness, requiring revalidation; include a note in the tooltip.
Large Values: For max-age, s-maxage, stale-while-revalidate, and stale-if-error, warn users if values exceed 1 year (31536000 seconds) to avoid unintended long-term caching.
Immutable Support: Note that immutable is only for HTTP/2+, and support may vary; include in tooltip.
Extension Directives: stale-while-revalidate and stale-if-error are extensions; include warnings in tooltips about varying support across caches.
Conflicting Directives: Ensure the form prevents invalid combinations, such as selecting both Public and Private, by using radio buttons for cache type.
Implementation Details
To ensure a smooth user experience, the form should include:

Input Validation: Ensure all numeric inputs (max-age, s-maxage, stale-while-revalidate, stale-if-error) are non-negative integers. Convert units (seconds, minutes, hours, days) to seconds for the final header, using the following conversion:
Seconds: No conversion.
Minutes: Multiply by 60.
Hours: Multiply by 3600.
Days: Multiply by 86400.
Dynamic Updates: Use JavaScript to show/hide sections based on selections, e.g., hide s-maxage and proxy-revalidate if Private is chosen, disable all sections if no-store is selected.
Tooltips: Implement hover-over tooltips for each option, displaying the detailed explanation from the descriptions above.
Reset Functionality: Include a "Reset" button to clear all selections and start over, setting default to Public and Use fresh responses without revalidation.
Generated Header: Compile selected options into a Cache-Control header string, ensuring directives are comma-separated and in alphabetical order for readability (e.g., "max-age=3600, public").
Table of Directive Interactions
Directive Interaction Notes
no-store Overrides all other directives; no caching occurs.
no-cache Requires revalidation even for fresh responses; max-age still defines freshness.
must-revalidate Requires revalidation when stale; works with max-age to define freshness duration.
s-maxage Only applies to shared caches; relevant only for Public cache type.
immutable Hints at indefinite caching; may override max-age in practice, note support for HTTP/2+.
Conclusion
This plan provides a detailed roadmap for implementing the Cache-Control Guru generate form, ensuring it is intuitive, handles all relevant directives, and guides users through the process. By organizing options into clear sections, providing detailed descriptions and tooltips, and addressing mutual exclusions and edge cases, the form will make crafting Cache-Control headers accessible and effective for all users.

Key Citations
Cache-Control HTTP header directives MDN

-----
After first pass

You tried to implement `docs/refining-5.md` but one of the strings you used was: 


"This is an extension directive with varying support across caches." (in `src/components/generate-form.tsx`)


 This is not nearly a good enough explanation of whats going to happen. Think about this from a users 
  perspective. What types of caches typically will and will not have support? AWS Cloudfront, Cloudflare? Will they always or only when certain things are configured? Who
   knows. You should research that and improve the website accordingly

Also I wonder if a lot of these descriptions and things shouldn't be updated in `src/lib/cache-control.ts` we don't want to duplicate concerns of describing the spec.

Also, the tooltips only appear when hovering item labels but not descriptions. That is bad user experience. The tool tip targets should be more obvious, maybe make a circled information icon component