import { ColorModeProvider, ColorModeScript } from '@kobalte/core';
import { MetaProvider } from '@solidjs/meta';
import { Outlet, createRootRoute } from '@tanstack/solid-router';

import NavBar from '@/components/nav-bar';
import { ScrollArea } from '@/components/ui/scroll-area';
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
          <ScrollArea class="h-[calc(100vh-64px)]">
            <Outlet />
          </ScrollArea>
        </ColorModeProvider>
        <Devtools />
      </Suspense>
    </MetaProvider>
  );
}
