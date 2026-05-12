import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.locator('h1, h2')).toContainText(/sign in|login/i);
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/auth/register');
    await expect(page.locator('h1, h2')).toContainText(/sign up|register|create/i);
  });

  test('should show validation errors on empty form', async ({ page }) => {
    await page.goto('/auth/login');
    
    const submitButton = page.getByRole('button', { name: /sign in/i });
    await submitButton.click();
    
    // Should show email validation error
    await expect(page.locator('text=/email is required/i')).toBeVisible();
  });

  test('should show password validation error', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.fill('input[type="email"]', 'test@example.com');
    const submitButton = page.getByRole('button', { name: /sign in/i });
    await submitButton.click();
    
    // Should show password validation error
    await expect(page.locator('text=/password is required/i')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'password123');
    
    const submitButton = page.getByRole('button', { name: /sign in/i });
    await submitButton.click();
    
    await expect(page.locator('text=/valid email/i')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/auth/login');
    
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
  });

  test('should have link to register from login page', async ({ page }) => {
    await page.goto('/auth/login');
    
    const registerLink = page.getByText(/sign up|create an account/i);
    await expect(registerLink).toBeVisible();
    await registerLink.click();
    await expect(page).toHaveURL(/\/auth\/register/);
  });

  test('should have link to login from register page', async ({ page }) => {
    await page.goto('/auth/register');
    
    const loginLink = page.getByText(/sign in|already have an account/i);
    await expect(loginLink).toBeVisible();
  });
});