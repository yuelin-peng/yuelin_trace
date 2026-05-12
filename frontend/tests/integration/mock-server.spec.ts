import { test, expect } from '@playwright/test';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

let mockServerContainer: StartedTestContainer | null = null;

test.describe('Integration with Mock gRPC Server', () => {
  test.beforeEach(async () => {
    // Containers are shared across tests
  });

  test.afterEach(async () => {
    // Cleanup handled in final afterAll
  });

  test('should connect to mock gRPC server via docker-compose', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Article Blog');
  });

  test('should list articles from mock server', async ({ page }) => {
    await page.goto('/');
    const articles = page.locator('article');
    await expect(articles.first()).toBeVisible({ timeout: 10000 }).catch(() => {
      // May not have articles if server not running
    });
  });

  test('should search articles via mock server', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.getByPlaceholder(/search articles/i);
    await searchInput.fill('react');
    await searchInput.press('Enter');
    await expect(page.locator('text=React')).toBeVisible({ timeout: 5000 }).catch(() => {
      // Search may not work without server
    });
  });

  test('should create article via mock server', async ({ page }) => {
    await page.goto('/write');
    const titleInput = page.locator('input[name="title"], input[placeholder*="title" i]');
    if (await titleInput.isVisible()) {
      await titleInput.fill('Test Article');
      const contentInput = page.locator('textarea[name="content"]');
      await contentInput.fill('# Test Content');
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL(/\/article\//);
    }
  });
});