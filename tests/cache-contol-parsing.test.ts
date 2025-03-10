import { parseCacheControlHeader } from '@/lib/cache-control';
import { expect, test } from 'vitest';

test('parse "public, max-age=3600"', () => {
  const parseResult = parseCacheControlHeader('public, max-age=3600');
  expect(parseResult.valid).toBe(true);
  if (!parseResult.valid) return;
  expect(parseResult.directives.length).toBe(2);
  expect(parseResult.directives[0]?.name).toBe('public');
  expect(parseResult.directives[1]?.name).toBe('max-age');
  expect(parseResult.directives[1]?.value).toBe(3600);
});

test('parse "public, max-age=" (partially filled in header)', () => {
  const parseResult = parseCacheControlHeader('public, max-age=');
  expect(parseResult.valid).toBe(false);
  if (parseResult.valid) return;
  expect(parseResult.directives.length).toBe(2);
  expect(parseResult.directives[0]?.name).toBe('public');
  expect(parseResult.directives[1]?.name).toBe('max-age');
  expect(parseResult.directives[1]?.value).toBe(undefined);
  expect(parseResult.errors.length).toBe(1);
});

test('parse "AAAAAAAAA" (garbage header)', () => {
  const parseResult = parseCacheControlHeader('AAAAAAAAA');
  expect(parseResult.valid).toBe(false);
  if (parseResult.valid) return;
  expect(parseResult.errors.length).toBe(1);
});
