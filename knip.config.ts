import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['src/entry-*.tsx', 'src/app.tsx', 'app.config.ts'],
  project: ['src/**'],
  ignore: ['src/**/*.gen.ts', 'src/components/ui/**'],
  ignoreDependencies: [/tailwind/],
};

export default config;
