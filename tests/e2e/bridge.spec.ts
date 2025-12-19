import { test, expect } from '@playwright/test';

/**
 * E2E Test: Complete Bridge Flow
 * 
 * Tests the full CCTP bridge flow:
 * 1. Connect wallet
 * 2. Select chains and amount
 * 3. Approve USDC
 * 4. Burn USDC (with fee collection)
 * 5. Wait for attestation
 * 6. Switch chains
 * 7. Mint USDC
 */

test.describe('Bridge Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should complete full bridge transfer', async ({ page }) => {
        // Step 1: Connect wallet
        await page.click('button:has-text("Connect Wallet")');
        await page.click('button:has-text("MetaMask")');

        // Wait for wallet connection
        await expect(page.locator('text=/0x[a-fA-F0-9]{4}/')).toBeVisible({ timeout: 10000 });

        // Step 2: Navigate to bridge
        await page.click('a[href="/dashboard/transactions"]');
        await page.click('button:has-text("Bridge")');

        // Step 3: Select chains
        await page.selectOption('select[name="fromChain"]', '11155111'); // Ethereum Sepolia
        await page.selectOption('select[name="toChain"]', '43113'); // Avalanche Fuji

        // Step 4: Enter amount
        await page.fill('input[name="amount"]', '10');

        // Verify fee calculation
        await expect(page.locator('text=/Fee: 0.01 USDC/')).toBeVisible();
        await expect(page.locator('text=/You will receive: 9.99 USDC/')).toBeVisible();

        // Step 5: Start bridge
        await page.click('button:has-text("Bridge USDC")');

        // Step 6: Approve transaction (mock)
        // In real test, this would interact with MetaMask
        await expect(page.locator('text=/Approving USDC/')).toBeVisible({ timeout: 5000 });

        // Step 7: Burn transaction
        await expect(page.locator('text=/Burning USDC/')).toBeVisible({ timeout: 30000 });

        // Step 8: Attestation
        await expect(page.locator('text=/Waiting for attestation/')).toBeVisible();

        // Step 9: Ready to mint
        await expect(page.locator('text=/Ready to mint/')).toBeVisible({ timeout: 120000 }); // 2 min

        // Step 10: Switch chain prompt
        await expect(page.locator('text=/Switch to Avalanche Fuji/')).toBeVisible();

        // Step 11: Complete mint
        await page.click('button:has-text("Complete Transfer")');

        // Step 12: Verify success
        await expect(page.locator('text=/Transfer complete/')).toBeVisible({ timeout: 30000 });
    });

    test('should show stuck transaction warning', async ({ page }) => {
        // Navigate to transactions page
        await page.goto('/dashboard/transactions');

        // Mock a stuck transaction in localStorage
        await page.evaluate(() => {
            const stuckTransfer = {
                id: 'test_stuck_1',
                fromChainId: 11155111,
                toChainId: 43113,
                amount: '10',
                status: 'attestation',
                createdAt: Date.now() - (40 * 60 * 1000), // 40 minutes ago
                updatedAt: Date.now() - (40 * 60 * 1000),
            };
            localStorage.setItem('nexux_bridge_transfers', JSON.stringify([stuckTransfer]));
        });

        // Reload page
        await page.reload();

        // Verify stuck transaction warning
        await expect(page.locator('text=/Stuck transaction detected/')).toBeVisible();
        await expect(page.locator('text=/40 minutes/')).toBeVisible();
    });

    test('should validate minimum amount', async ({ page }) => {
        await page.goto('/dashboard/transactions');
        await page.click('button:has-text("Bridge")');

        // Try to bridge less than minimum
        await page.fill('input[name="amount"]', '0.5');

        // Verify error message
        await expect(page.locator('text=/Minimum bridge amount is 1 USDC/')).toBeVisible();

        // Verify button is disabled
        await expect(page.locator('button:has-text("Bridge USDC")')).toBeDisabled();
    });

    test('should track analytics', async ({ page }) => {
        // Start a bridge transfer
        await page.goto('/dashboard/transactions');
        await page.click('button:has-text("Bridge")');
        await page.fill('input[name="amount"]', '10');
        await page.click('button:has-text("Bridge USDC")');

        // Check analytics in localStorage
        const analytics = await page.evaluate(() => {
            const stored = localStorage.getItem('nexux_bridge_analytics');
            return stored ? JSON.parse(stored) : [];
        });

        expect(analytics.length).toBeGreaterThan(0);
        expect(analytics[0].eventType).toBe('bridge_started');
        expect(analytics[0].amount).toBe('10');
    });
});
