import { test, expect } from '@playwright/test';

test.describe('Cek Harta App', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the home page (development server should be running)
    await page.goto('http://localhost:5173/waris-tracker/');
  });

  test('harusnya menampilkan judul Cek Harta di Dasbor', async ({ page }) => {
    await expect(page.getByText('Cek Harta')).toBeVisible();
  });

  test('harusnya bisa membuka modal Tambah Aset', async ({ page }) => {
    // Click the FAB add button
    await page.getByLabel('Tambah Aset Baru').click();
    
    // Check if modal title is visible
    await expect(page.getByText('Tambah Aset Baru')).toBeVisible();
  });

  test('navigasi bawah harus berfungsi', async ({ page }) => {
    // Click the Assets tab using aria-label
    await page.getByLabel('Menu Aset').click();
    await expect(page).toHaveURL(/.*assets/);
    
    // Click the Dashboard tab
    await page.getByLabel('Menu Dasbor').click();
    await expect(page).toHaveURL(/.*waris-tracker\/$/);
  });
});
