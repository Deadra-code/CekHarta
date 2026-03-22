import { test, expect } from '@playwright/test';

test.describe('Full Flow: Tambah, Ceklis, & Hapus Aset', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app (baseURL already configured in Playwright config)
    await page.goto('/');
  });

  test('harusnya bisa melakukan siklus lengkap (CRUD) sebuah aset', async ({ page }) => {
    // 1. Buka Modal Tambah Aset
    await page.getByLabel('Tambah Aset Baru').click();
    
    // 2. Isi form
    await page.getByPlaceholder('Contoh: Ruko Gading Serpong').fill('Pabrik Kosmetik Olay');
    await page.locator('select').selectOption('Aset Fisik Lainnya');
    await page.getByPlaceholder('Contoh: 1.500.000.000').fill('20000000000');
    
    // 3. Simpan
    await page.getByRole('button', { name: 'Simpan Aset' }).click();
    
    // 4. Verifikasi aset muncul di Dasbor dengan valuasi yang sesuai
    await expect(page.getByText('Pabrik Kosmetik Olay')).toBeVisible();


    // 5. Bekerja di Halaman Aset
    await page.getByLabel('Menu Aset').click();
    await expect(page.getByText('Pabrik Kosmetik Olay')).toBeVisible();
    
    // 6. Klik Detail Aset
    await page.getByText('Pabrik Kosmetik Olay').click();
    
    // 7. Toggle Ceklis
    const ceklisButton = page.getByText('Verifikasi Dokumen Kepemilikan');
    await expect(ceklisButton).toBeVisible();
    await ceklisButton.click();
    
    // 8. Cek Progress (1 / 2 Selesai)
    await expect(page.getByText('1 / 2 Selesai')).toBeVisible();

    // 9. Hapus Aset (Otomatis Accept Confirm Dialog)
    page.on('dialog', dialog => dialog.accept());
    await page.getByTitle('Hapus Aset').click();
    
    // 10. Verifikasi kembali ke halaman aset dan aset hilang
    await expect(page).toHaveURL(/.*assets/);
    await expect(page.getByText('Pabrik Kosmetik Olay')).not.toBeVisible();
  });
});
