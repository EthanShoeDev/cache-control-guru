const sortImports = process.env.SORT_IMPORTS === 'true';

/** @type {import("prettier").Config} */
export default {
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  arrowParens: 'always',
  endOfLine: 'lf',
  trailingComma: 'all',
  plugins: [
    ...(sortImports ? ['prettier-plugin-organize-imports'] : []),
    'prettier-plugin-tailwindcss',
  ],
};
