import { test, expect } from '@playwright/test';

test.describe('Flow Manajemen Kontak', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Menu Kontak').click();
  });

  test('harusnya bisa menambah dan menghapus kontak', async ({ page }) => {
    // 1. Tambah Kontak (We click the FAB, whose text content has 'person_add')
    await page.getByText('person_add').click();
    
    // 2. Isi form
    await page.getByPlaceholder('Budi Santoso S.H.').fill('Joko Anwar');
    await page.getByPlaceholder('Pengacara Hukum Keluarga').fill('Notaris Kepercayaan');
    await page.getByPlaceholder('budi@contoh.com').fill('joko@test.com');
    await page.getByPlaceholder('08123456789').fill('0800112233');
    
    // 3. Simpan
    await page.getByRole('button', { name: 'Simpan Kontak' }).click();
    
    // 4. Verifikasi Kontak muncul
    await expect(page.getByText('Joko Anwar')).toBeVisible();
    
    // 5. Hapus Kontak (The delete button has text 'delete' which is the material icon text)
    // We filter buttons to find the specific delete text
    await page.locator('button').filter({ hasText: 'delete' }).click();
    
    // 6. Verifikasi kontak hilang (The empty state message should appear)
    await expect(page.getByText('Belum ada kontak terdaftar.')).toBeVisible();
  });
});
