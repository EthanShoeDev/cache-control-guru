# Cache Control Guru - Developer Guide

## Commands

- Dev server: `pnpm run dev`
- Build: `pnpm run build`
- Start production: `pnpm run start`
- Format: `pnpm run fmt`
- Lint: `pnpm run lint`
- Check format: `pnpm run fmt:check`
- Check lint: `pnpm run lint:check`

## Code Style Guidelines

- **TypeScript**: Strict mode enabled
- **Formatting**: 2 spaces, semicolons, single quotes, trailing commas
- **Imports**: Use path aliases (`@/*`) for imports, automatically sorted
- **Components**: Use Solid.js functional components with TypeScript types
- **Styling**: Use Tailwind CSS with class merging via `cn()` utility
- **UI Components**: Use Kobalte components with shadcn-style variants
- **Error Handling**: Use TypeScript to prevent runtime errors
- **Path Mapping**: Import from src using `@/*` syntax
- **File Structure**: Components in `/src/components`, routes in `/src/routes`

## Tech Stack

- SolidStart (SolidJS framework)
- TypeScript
- Tailwind CSS v4
- Kobalte UI components
- TanStack Form

## Shadcn-Solid Note

For any file that you are about to read from the `src/components/ui/` directory. Such as `src/components/ui/button.tsx` consider instead doing a web fetch of the corresponding docs page: https://shadcn-solid.com/docs/components/button. All the components in that dir are copied directly from shadcn-solid so we can trust their implementation most of the time. The docs have usage examples which is probably more useful for us.

## Please consult the specification often and regularly

ethan@Ethan-PC:~/cache-control-guru$ tree docs/specs
docs/specs
├── Cache-Control-for-Civilians.md
├── caching-best-practices-gotchas.md
├── caching-tutorial.md
├── mdn.md
└── rfc.md

0 directories, 5 files

## Depenendcy docs

ethan@Ethan-PC:~/cache-control-guru$ tree docs/dependencies/
docs/dependencies/
├── solidjs.md
└── tanstack-form.md

0 directories, 2 files
ethan@Ethan-PC:~/cache-control-guru$
