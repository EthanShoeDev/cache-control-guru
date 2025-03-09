import { ColorModeProvider, ColorModeScript } from '@kobalte/core';
import { MetaProvider } from '@solidjs/meta';
import { Outlet, createRootRoute } from '@tanstack/solid-router';

import NavBar from '@/components/nav-bar';
import { clientOnly } from '@solidjs/start';
import { Suspense } from 'solid-js';
const Devtools = clientOnly(() => import('../components/devtools'));

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <MetaProvider>
      <Suspense>
        <ColorModeScript />
        <ColorModeProvider>
          <NavBar />
          <Outlet />
        </ColorModeProvider>
        <Devtools />
      </Suspense>
    </MetaProvider>
  );
}
