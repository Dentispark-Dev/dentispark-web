import { test, expect } from "@playwright/test";

test.describe("Applicant Roadmap (Mission Control)", () => {
  // Instead of logging in fully for this specific test, we can inject
  // mock Auth cookies so the middleware lets us pass into the /overview.
  
  test.beforeEach(async ({ context }) => {
    // 1. Mock Authentication Cookies to bypass middleware
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    
    await context.addCookies([
      {
        name: "accessToken",
        value: "mock_test_token_12345",
        domain: "localhost",
        path: "/"
      },
      {
        name: "userData",
        value: JSON.stringify({
          memberType: "STUDENT",
          profileStatus: "COMPLETED",
          auth: { tokenExpiredAt: futureDate.toISOString() }
        }),
        domain: "localhost",
        path: "/"
      }
    ]);
  });

  test("should render the 11-step applicant roadmap on the overview page", async ({ page }) => {
    // 2. Navigate to the dashboard
    await page.goto("/overview");
    
    // 3. Verify the Roadmap header is visible
    await expect(page.getByText("Applicant Roadmap", { exact: true })).toBeVisible();

    // 4. Verify Phase 1 is visible
    await expect(page.getByText("Research Schools")).toBeVisible();
    
    // 5. Verify the AI Tooling section is visible
    await expect(page.getByText("AI Application Hub")).toBeVisible();
  });
});
