I want you to throughly read all of the specifications and articles within `docs/specs/`

ethan@Ethan-XPS:~/cache-control-guru/docs/specs$ tree
.
├── Cache-Control-for-Civilians.md
├── caching-best-practices-gotchas.md
├── caching-tutorial.md
├── mdn.md
└── rfc.md

1 directory, 5 files
ethan@Ethan-XPS:~/cache-control-guru/docs/specs$

and update our
form descriptions and explanations accordingly. src/components/generate-form.tsx, src/lib/cache-control.ts

We should embed as much wisdom from the articles into our form and website as a whole as we can.

While generally all strings we show to the user could probably be improved, I know specifically that as a user, I don't really know much about stale while revalidate and how it will make my http requests behave. We should improve that.

I also think we could do a better job describing the example. Maybe pull examples from the articles.

This website should help even the most junior engineer perfectly understand any cache control header.

We should keep in my best solidJs, and typescript practices. Trying to reduce code reuse where possible.

I also noticed in a few sections of the code we change some numeric relative time measurment into a string. We should use the date-fns package to do that instead.

I have already added date fns as a dependency.

Date-fns docs
https://date-fns.org/v4.1.0/docs/formatDuration

formatDuration
Return human-readable duration string i.e. "9 months 2 days"

Usage
ESM
CommonJS
CDN
unpkg
import { formatDuration } from "date-fns";
🦄 The function is also available in the FP submodule as formatDuration and formatDurationWithOptions. Read more about it in the FP guide.
Type
function formatDuration(
duration: Duration,
options?: FormatDurationOptions
): string
Arguments
Name Type Description
duration
Duration
The duration to format

options?
FormatDurationOptions
An object with options.

Returns
Type Description
string
The formatted date string

Examples
Format full duration

formatDuration({
years: 2,
months: 9,
weeks: 1,
days: 7,
hours: 5,
minutes: 9,
seconds: 30
})
//=> '2 years 9 months 1 week 7 days 5 hours 9 minutes 30 seconds'
Format partial duration

formatDuration({ months: 9, days: 2 })
//=> '9 months 2 days'
Customize the format

formatDuration(
{
years: 2,
months: 9,
weeks: 1,
days: 7,
hours: 5,
minutes: 9,
seconds: 30
},
{ format: ['months', 'weeks'] }
) === '9 months 1 week'
Customize the zeros presence

formatDuration({ years: 0, months: 9 })
//=> '9 months'
formatDuration({ years: 0, months: 9 }, { zero: true })
//=> '0 years 9 months'
Customize the delimiter

formatDuration({ years: 2, months: 9, weeks: 3 }, { delimiter: ', ' })
//=> '2 years, 9 months, 3 weeks'
Found an issue with this page?
Suggest edits by sending a PR
Open an issue with this documentation
Report a bug in the function

ethan@Ethan-XPS:~/cache-control-guru$ just tree-src
tree -h -I "node_modules|.git|dist|.cache|docs" | cat
[4.0K] .
├── [1.9K] CLAUDE.md
├── [1.0K] LICENSE
├── [2.1K] README.md
├── [ 662] app.config.ts
├── [ 299] components.json
├── [1.7K] eslint.config.js
├── [ 721] justfile
├── [ 522] knip.config.ts
├── [2.6K] package.json
├── [4.0K] playwright-report
│ └── [446K] index.html
├── [2.1K] playwright.config.ts
├── [276K] pnpm-lock.yaml
├── [ 356] prettier.config.js
├── [4.0K] public
│ ├── [ 664] favicon.ico
│ ├── [ 697] header.svg
│ ├── [ 919] og-image.svg
│ ├── [ 132] robots.txt
│ └── [ 434] sitemap.xml
├── [4.0K] src
│ ├── [1.6K] app.css
│ ├── [ 193] app.tsx
│ ├── [4.0K] components
│ │ ├── [ 113] devtools.tsx
│ │ ├── [ 43K] generate-form.tsx
│ │ ├── [2.0K] nav-bar.tsx
│ │ ├── [1.9K] theme-switch.tsx
│ │ ├── [3.5K] time-input.tsx
│ │ └── [4.0K] ui
│ │ ├── [2.1K] alert.tsx
│ │ ├── [2.1K] button.tsx
│ │ ├── [1.5K] card.tsx
│ │ ├── [2.1K] checkbox.tsx
│ │ ├── [ 11K] scroll-area.tsx
│ │ └── [ 912] separator.tsx
│ ├── [ 306] entry-client.tsx
│ ├── [3.9K] entry-server.tsx
│ ├── [ 45] global.d.ts
│ ├── [4.0K] lib
│ │ ├── [ 12K] cache-control.ts
│ │ └── [ 421] utils.ts
│ ├── [2.9K] routeTree.gen.ts
│ ├── [ 652] router.tsx
│ └── [4.0K] routes
│ ├── [ 710] $404.tsx
│ ├── [ 851] \_\_root.tsx
│ ├── [5.3K] about.tsx
│ └── [7.2K] index.tsx
├── [2.6K] tailwind.config.js
├── [4.0K] test-results
├── [4.0K] tests
│ ├── [2.3K] cache-contol-parsing.test.ts
│ └── [4.0K] e2e
│ └── [ 262] e2e.test.ts
├── [ 844] tsconfig.json
└── [ 529] vitest.config.ts

11 directories, 47 files
ethan@Ethan-XPS:~/cache-control-guru$
