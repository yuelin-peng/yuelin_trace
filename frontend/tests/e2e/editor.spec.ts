import { test, expect } from '@playwright/test';

test.describe('Article Editor', () => {
  test.beforeEach(async ({ page }) => {
    // Note: Editor requires authentication, these tests assume auth is bypassed in test environment
    await page.goto('/write');
  });

  test('should display editor header', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/new article|article/i);
  });

  test('should have title input', async ({ page }) => {
    const titleInput = page.getByPlaceholder(/title/i);
    await expect(titleInput).toBeVisible();
  });

  test('should have toolbar buttons', async ({ page }) => {
    await expect(page.getByText(/edit|preview/i)).toBeVisible();
    await expect(page.getByText(/image|video|code/i)).toBeVisible();
  });

  test('should have save draft button', async ({ page }) => {
    const saveButton = page.getByRole('button', { name: /save draft/i });
    await expect(saveButton).toBeVisible();
  });

  test('should have publish button', async ({ page }) => {
    const publishButton = page.getByRole('button', { name: /publish/i });
    await expect(publishButton).toBeVisible();
  });

  test('should toggle preview mode', async ({ page }) => {
    const previewButton = page.getByRole('button', { name: /preview/i });
    await previewButton.click();
    
    // Should show preview content
    await expect(page.getByText(/preview will appear/i)).toBeVisible();
  });

  test('should navigate back from editor', async ({ page }) => {
    const backButton = page.locator('a').filter({ has: page.locator('svg') }).first();
    await backButton.click();
    await expect(page).toHaveURL('/');
  });
});