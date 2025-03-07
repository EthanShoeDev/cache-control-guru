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