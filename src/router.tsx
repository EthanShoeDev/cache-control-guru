import { createRouter as createTanstackSolidRouter } from '@tanstack/solid-router';
import { routeTree } from './routeTree.gen';

function createRouter() {
  const router = createTanstackSolidRouter({
    defaultErrorComponent: (err) => <div>{err.error.stack}</div>,
    routeTree,
    defaultPreload: 'intent',
    defaultStaleTime: 5000,
    scrollRestoration: true,
  });
  return router;
}

export const router = createRouter();

declare module '@tanstack/solid-router' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- interface needed here
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
