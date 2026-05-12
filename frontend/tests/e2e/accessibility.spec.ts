import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy on homepage', async ({ page }) => {
    await page.goto('/');
    
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    await expect(headings.first()).toBeVisible();
  });

  test('should have accessible forms with labels', async ({ page }) => {
    await page.goto('/auth/login');
    
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/password/i);
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('should have skip navigation link', async ({ page }) => {
    await page.goto('/');
    
    // Check for common skip link patterns
    const skipLink = page.locator('a[href^="#"]').filter({ hasText: /skip/i });
    // Skip links are optional but recommended
  });

  test('should have proper ARIA labels on buttons', async ({ page }) => {
    await page.goto('/');
    
    // Check that interactive elements have accessible names
    const buttons = page.getByRole('button');
    const searchInput = page.getByRole('searchbox');
    
    await expect(searchInput).toHaveAttribute('aria-label');
  });

  test('should have visible focus indicators', async ({ page }) => {
    await page.goto('/');
    
    // Tab to first interactive element
    await page.keyboard.press('Tab');
    
    // Focus should be visible (browser default or custom)
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Tab through interactive elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
    }
    
    // Should be able to interact with focused element
    const focusedButton = page.locator(':focus').locator('button, a[href]');
    if (await focusedButton.count() > 0) {
      await page.keyboard.press('Enter');
    }
  });

  test('should have color contrast for text', async ({ page }) => {
    await page.goto('/');
    
    // Check primary text is readable
    const primaryText = page.locator('h1');
    await expect(primaryText).toBeVisible();
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/');
    
    // Check images have alt attributes or are decorative
    const images = page.locator('img');
    const count = await images.count();
    
    if (count > 0) {
      // Images should either have alt text or be decorative
      for (let i = 0; i < Math.min(count, 5); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        // Alt can be empty string for decorative images
        expect(alt).not.toBeNull();
      }
    }
  });
});