The website is starting to come along but there is still more to be done

1. The blue color scheme in dark mode for text does not look good.
   I generated a color scheme with https://ui.shadcn.com/themes (keep in mind this comes from the react shadcn and not the solid shadcn that we are using.
   We may have to tweak it to get it to work in our project)

@layer base {
:root {
--background: 0 0% 100%;
--foreground: 240 10% 3.9%;
--card: 0 0% 100%;
--card-foreground: 240 10% 3.9%;
--popover: 0 0% 100%;
--popover-foreground: 240 10% 3.9%;
--primary: 240 5.9% 10%;
--primary-foreground: 0 0% 98%;
--secondary: 240 4.8% 95.9%;
--secondary-foreground: 240 5.9% 10%;
--muted: 240 4.8% 95.9%;
--muted-foreground: 240 3.8% 46.1%;
--accent: 240 4.8% 95.9%;
--accent-foreground: 240 5.9% 10%;
--destructive: 0 84.2% 60.2%;
--destructive-foreground: 0 0% 98%;
--border: 240 5.9% 90%;
--input: 240 5.9% 90%;
--ring: 240 5.9% 10%;
--radius: 0.5rem;
--chart-1: 12 76% 61%;
--chart-2: 173 58% 39%;
--chart-3: 197 37% 24%;
--chart-4: 43 74% 66%;
--chart-5: 27 87% 67%;
}

.dark {
--background: 240 10% 3.9%;
--foreground: 0 0% 98%;
--card: 240 10% 3.9%;
--card-foreground: 0 0% 98%;
--popover: 240 10% 3.9%;
--popover-foreground: 0 0% 98%;
--primary: 0 0% 98%;
--primary-foreground: 240 5.9% 10%;
--secondary: 240 3.7% 15.9%;
--secondary-foreground: 0 0% 98%;
--muted: 240 3.7% 15.9%;
--muted-foreground: 240 5% 64.9%;
--accent: 240 3.7% 15.9%;
--accent-foreground: 0 0% 98%;
--destructive: 0 62.8% 30.6%;
--destructive-foreground: 0 0% 98%;
--border: 240 3.7% 15.9%;
--input: 240 3.7% 15.9%;
--ring: 240 4.9% 83.9%;
--chart-1: 220 70% 50%;
--chart-2: 160 60% 45%;
--chart-3: 30 80% 55%;
--chart-4: 280 65% 60%;
--chart-5: 340 75% 55%;
}
}

2. Ideally, I want as much app state as possible to be stored in the query params of the page. I know that tanstack router has some really nice docs on doing this effectively https://tanstack.com/router/latest/docs/framework/solid/guide/search-params.

Currently our project is not using tanstack router (we are using @solidjs/start/router). I think we should switch to tanstack router (for solid js).
The installations docs are pretty simple

Installation
You can install TanStack Router with any NPM package manager.

sh

pnpm add @tanstack/solid-router

TanStack Router is currently only compatible with React (with ReactDOM) and Solid. If you would like to contribute to the React Native, Angular, or Vue adapter, please reach out to us on Discord.

Requirements
solid-jsv1.x.x
TypeScript is optional, but HIGHLY recommended! If you are using it, please ensure you are using typescript>=v5.3.x.

Important

We aim to support the last five minor versions of TypeScript. If you are using an older version, you may run into issues. Please upgrade to the latest version of TypeScript to ensure compatibility. We may drop support for older versions of TypeScript, outside of the range mentioned above, without warning in a minor or patch release.

## Tanstack router quick start

Quick Start
If you're feeling impatient and prefer to skip all of our wonderful documentation, here is the bare minimum to get going with TanStack Router using both file-based route generation and code-based route configuration:

Using File-Based Route Generation
File based route generation (through Vite, and other supported bundlers) is the recommended way to use TanStack Router as it provides the best experience, performance, and ergonomics for the least amount of effort.

Setup
You can setup the project using the following steps:

Install TanStack Router, Vite Plugin
sh

npm install @tanstack/solid-router
npm install -D @tanstack/router-plugin

# or

pnpm add @tanstack/solid-router
pnpm add -D @tanstack/router-plugin

# or

yarn add @tanstack/solid-router
yarn add -D @tanstack/router-plugin

# or

bun add @tanstack/solid-router
bun add -D @tanstack/router-plugin

# or

deno add npm:@tanstack/solid-router npm:@tanstack/router-plugin
Configure the Vite Plugin
tsx

// vite.config.ts
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig({
plugins: [
TanStackRouterVite({ target: 'solid', autoCodeSplitting: true }),
solid(),
// ...,
],
})
Tip

If you are not using Vite, or any of the supported bundlers, you can check out the TanStack Router CLI guide for more info.

Create the following files:

src/routes/**root.tsx
src/routes/index.tsx
src/routes/about.tsx
src/main.tsx
src/routes/**root.tsx
tsx

import { createRootRoute, Link, Outlet } from '@tanstack/solid-router'

export const Route = createRootRoute({
component: () => (
<>

<div class="p-2 flex gap-2">
<Link to="/" class="[&.active]:font-bold">
Home
</Link>{' '}
<Link to="/about" class="[&.active]:font-bold">
About
</Link>
</div>
<hr />
<Outlet />
</>
),
})
src/routes/index.tsx
tsx

import { createLazyFileRoute } from '@tanstack/solid-router'

export const Route = createLazyFileRoute('/')({
component: Index,
})

function Index() {
return (

<div class="p-2">
<h3>Welcome Home!</h3>
</div>
)
}
src/routes/about.tsx
tsx

import { createLazyFileRoute } from '@tanstack/solid-router'

export const Route = createLazyFileRoute('/about')({
component: About,
})

function About() {
return <div class="p-2">Hello from About!</div>
}
src/main.tsx
Regardless of whether you are using the @tanstack/router-plugin package and running the npm run dev/npm run build scripts, or manually running the tsr watch/tsr generate commands from your package scripts, the route tree file will be generated at src/routeTree.gen.ts.

Import the generated route tree and create a new router instance:

tsx

import { render } from 'solid-js/web'
import { RouterProvider, createRouter } from '@tanstack/solid-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/solid-router' {
interface Register {
router: typeof router
}
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
render(() => <RouterProvider router={router} />, rootElement)
}
If you are working with this pattern you should change the id of the root <div> on your index.html file to <div id='root'></div>

Using Code-Based Route Configuration
Important

The following example shows how to configure routes using code, and for simplicity's sake is in a single file for this demo. While code-based generation allows you to declare many routes and even the router instance in a single file, we recommend splitting your routes into separate files for better organization and performance as your application grows.

tsx

import { render } from 'solid-js/web'
import {
Outlet,
RouterProvider,
Link,
createRouter,
createRoute,
createRootRoute,
} from '@tanstack/solid-router'

const rootRoute = createRootRoute({
component: () => (
<>

<div class="p-2 flex gap-2">
<Link to="/" class="[&.active]:font-bold">
Home
</Link>{' '}
<Link to="/about" class="[&.active]:font-bold">
About
</Link>
</div>
<hr />
<Outlet />
</>
),
})

const indexRoute = createRoute({
getParentRoute: () => rootRoute,
path: '/',
component: function Index() {
return (

<div class="p-2">
<h3>Welcome Home!</h3>
</div>
)
},
})

const aboutRoute = createRoute({
getParentRoute: () => rootRoute,
path: '/about',
component: function About() {
return <div class="p-2">Hello from About!</div>
},
})

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute])

const router = createRouter({ routeTree })

declare module '@tanstack/solid-router' {
interface Register {
router: typeof router
}
}

const rootElement = document.getElementById('app')!
if (!rootElement.innerHTML) {
render(() => <RouterProvider router={router} />, rootElement)
}
If you glossed over these examples or didn't understand something, we don't blame you, because there's so much more to learn to really take advantage of TanStack Router! Let's move on.

After integrating tanstack router we should web fetch https://tanstack.com/router/latest/docs/framework/solid/guide/search-params and make the generate / explain tab store its state in the search params

3. We need more detail for the generate form descriptions.

For example a user can select Public / Private / None. The description for None is: "Don't specify public or private explicitly."
But as a user I have no idea what implication that has to how the request will be cached? We need to explain that by setting this to None then xyz happens.
Again sticking to the specification is very important here: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control

The other form options should be updated accordingly as well

4. Fix up the about page and README.md file.
   Both should acknowledge the project dependencies and inspirations.

Really try hard to make the README look good in github.
