// @refresh reload
import {
  createHandler,
  type FetchEvent,
  StartServer,
} from '@solidjs/start/server';
import { createMemoryHistory } from '@tanstack/solid-router';
import { router } from './router';

const routerLoad = async (event: FetchEvent) => {
  const url = new URL(event.request.url);
  const path = url.href.replace(url.origin, '');

  router.update({
    history: createMemoryHistory({
      initialEntries: [path],
    }),
  });

  await router.load();
};

export default createHandler(
  () => (
    <StartServer
      document={({ assets, children, scripts }) => (
        <html lang="en" class="overflow-hidden">
          <head>
            <meta charset="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />

            {/* Performance & Preload Hints */}
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="color-scheme" content="light dark" />
            <meta
              name="theme-color"
              content="#121212"
              media="(prefers-color-scheme: dark)"
            />
            <meta
              name="theme-color"
              content="#ffffff"
              media="(prefers-color-scheme: light)"
            />
            <meta name="robots" content="index, follow" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta
              name="apple-mobile-web-app-status-bar-style"
              content="black-translucent"
            />

            {/* SEO Meta Tags */}
            <title>
              Cache-Control Guru - The HTTP Cache-Control header generator
            </title>
            <meta
              name="description"
              content="An easy to use tool for generating and explaining HTTP Cache-Control headers. Optimize your website's caching strategy in seconds."
            />
            <meta
              name="keywords"
              content="cache-control, http headers, web performance, caching, http caching, browser cache, cdn cache"
            />

            {/* OpenGraph Tags */}
            <meta
              property="og:title"
              content="Cache-Control Guru - The HTTP Cache-Control header generator"
            />
            <meta
              property="og:description"
              content="Generate and understand HTTP Cache-Control headers with ease. Optimize your website's performance."
            />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://cache-control.guru/" />
            <meta
              property="og:image"
              content="https://cache-control.guru/og-image.svg"
            />
            <meta property="og:image:type" content="image/svg+xml" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta
              name="twitter:title"
              content="Cache-Control Guru - The HTTP Cache-Control header generator"
            />
            <meta
              name="twitter:description"
              content="Generate and understand HTTP Cache-Control headers with ease. Optimize your website's performance."
            />
            <meta
              name="twitter:image"
              content="https://cache-control.guru/og-image.svg"
            />

            {/* Canonical URL */}
            <link rel="canonical" href="https://cache-control.guru/" />

            {assets}
          </head>
          <body class="transition-colors duration-200">
            <div id="app">{children}</div>
            {scripts}
          </body>
        </html>
      )}
    />
  ),
  undefined,
  routerLoad,
);
