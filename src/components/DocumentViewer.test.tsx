import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import DocumentViewer from './DocumentViewer';
import { getFile } from '../store/db';

vi.mock('../store/db', () => ({
  getFile: vi.fn()
}));

// Mock URL.createObjectURL and revokeObjectURL
(globalThis as any).URL.createObjectURL = vi.fn(() => 'mock-url');
(globalThis as any).URL.revokeObjectURL = vi.fn();

describe('DocumentViewer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('harusnya menampilkan loading saat memuat file', async () => {
    (getFile as any).mockReturnValue(new Promise(() => {})); // Never resolves
    render(<DocumentViewer docId="1" docName="test.jpg" docType="image/jpeg" onClose={() => {}} />);
    expect(screen.getByText(/Memuat dokumen/)).toBeInTheDocument();
  });

  it('harusnya merender gambar jika tipe file adalah image', async () => {
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    (getFile as any).mockResolvedValue(mockFile);

    render(<DocumentViewer docId="1" docName="test.jpg" docType="image/jpeg" onClose={() => {}} />);

    await waitFor(() => {
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'mock-url');
    });
  });

  it('harusnya merender iframe jika tipe file adalah PDF', async () => {
    const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });
    (getFile as any).mockResolvedValue(mockFile);

    render(<DocumentViewer docId="1" docName="test.pdf" docType="application/pdf" onClose={() => {}} />);

    await waitFor(() => {
      const iframe = screen.getByTitle('test.pdf');
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute('src', 'mock-url');
    });
  });

  it('harusnya menampilkan pesan error jika file tidak ditemukan', async () => {
    (getFile as any).mockResolvedValue(null);

    render(<DocumentViewer docId="1" docName="test.jpg" docType="image/jpeg" onClose={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText(/Gagal memuat dokumen/)).toBeInTheDocument();
    });
  });
});
