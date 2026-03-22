import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveFile, getFile, deleteFile } from './db';
import * as idb from 'idb-keyval';

vi.mock('idb-keyval', () => ({
  set: vi.fn(),
  get: vi.fn(),
  del: vi.fn()
}));

describe('IndexedDB utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('saveFile harus memanggil idb.set', async () => {
    const fakeFile = new File([''], 'test.pdf', { type: 'application/pdf' });
    await saveFile('test.pdf', fakeFile);
    expect(idb.set).toHaveBeenCalledWith('doc_test.pdf', fakeFile);
  });

  it('getFile harus memanggil idb.get', async () => {
    (idb.get as any).mockResolvedValue(new File([''], 'test.pdf'));
    const file = await getFile('test.pdf');
    expect(idb.get).toHaveBeenCalledWith('doc_test.pdf');
    expect(file?.name).toBe('test.pdf');
  });

  it('deleteFile harus memanggil idb.del', async () => {
    await deleteFile('test.pdf');
    expect(idb.del).toHaveBeenCalledWith('doc_test.pdf');
  });
});
