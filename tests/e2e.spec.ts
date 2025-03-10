import { test, expect } from '@playwright/test';

test('has title and checkboxes', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Cache-Control Guru/);

  expect(await page.getByRole('checkbox').count()).toBeGreaterThan(0);
});

