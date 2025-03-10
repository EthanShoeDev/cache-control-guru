import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['src/entry-*.tsx', 'src/app.tsx', 'app.config.ts'],
  project: ['src/**'],
  ignore: ['src/**/*.gen.ts', 'src/components/ui/**'],
  ignoreDependencies: [
    /tailwind/, // Knip doesn't detect tailwind v4 plugins

    // We haven't made a component unit test yet but we might.
    // https://docs.solidjs.com/guides/testing#components-testing
    '@solidjs/testing-library',
    '@testing-library/user-event',
  ],
};

export default config;
