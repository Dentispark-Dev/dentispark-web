import { test, expect } from "@playwright/test";

test.describe("Authentication Routing Security", () => {
  test("should redirect unauthenticated users to login when accessing root", async ({ page }) => {
    // Navigate to the root level
    await page.goto("/");
    
    // The root is in `publicRoutes` so it should not redirect on its own,
    // assuming it acts as a landing page.
    await expect(page).toHaveURL("/");
  });

  test("should redirect unauthenticated users away from protected overview", async ({ page }) => {
    // Attempt to navigate to the protected dashboard
    await page.goto("/overview");
    
    // Validate the middleware correctly intercepted the request
    // and bounced the user to the login page
    await expect(page).toHaveURL(/.*\/login\?redirect=%2Foverview/);
  });
  
  test("should block unauthenticated access to mentor dashboard", async ({ page }) => {
    await page.goto("/mentor/overview");
    await expect(page).toHaveURL(/.*\/login\?redirect=%2Fmentor%2Foverview/);
  });
});
