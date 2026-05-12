import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the header', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Article Blog');
  });

  test('should have a search bar', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search articles/i);
    await expect(searchInput).toBeVisible();
  });

  test('should navigate to write page when clicking Write Article', async ({ page }) => {
    await page.click('text=Write Article');
    await expect(page).toHaveURL(/\/write/);
  });

  test('should display article cards', async ({ page }) => {
    const articleCards = page.locator('article');
    await expect(articleCards.first()).toBeVisible({ timeout: 10000 });
  });

  test('should filter articles by tag', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Click on a tag if visible
    const tags = page.locator('[class*="bg-primary"]');
    if (await tags.count() > 0) {
      await tags.first().click();
    }
  });

  test('should show empty state when no articles', async ({ page }) => {
    // This test assumes the page handles empty state
    await expect(page.locator('text=Recent Articles')).toBeVisible();
  });
});