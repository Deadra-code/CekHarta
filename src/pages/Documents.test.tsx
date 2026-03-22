import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Documents from './Documents';
import { useStore } from '../store/useStore';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react';

vi.mock('../components/DocumentViewer', () => ({
  default: ({ docName, onClose }: any) => (
    <div data-testid="doc-viewer">
      <span>{docName}</span>
      <button onClick={onClose}>Close</button>
    </div>
  )
}));

vi.mock('../store/useStore', () => ({
  useStore: vi.fn()
}));

vi.mock('../store/db', () => ({
  saveFile: vi.fn(),
  getFile: vi.fn(),
  deleteFile: vi.fn()
}));

const mockDeleteDocument = vi.fn();
const mockAddActivity = vi.fn();
const mockAddDocument = vi.fn();
const mockShowDialog = vi.fn(({ onConfirm }) => onConfirm?.());

describe('Documents Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useStore as any).mockReturnValue({
      documents: [
        { id: 'doc_1', name: 'Sertifikat.pdf', type: 'application/pdf', size: 1024, dateAdded: '2023-01-01T00:00:00Z' }
      ],
      deleteDocument: mockDeleteDocument,
      addActivity: mockAddActivity,
      addDocument: mockAddDocument,
      showDialog: mockShowDialog
    });
  });

  it('merender dokumen', () => {
    render(<MemoryRouter><Documents /></MemoryRouter>);
    expect(screen.getByText('Sertifikat.pdf')).toBeInTheDocument();
    // formatSize(1024) = 1 KB
    expect(screen.getByText(/1 KB/)).toBeInTheDocument();
  });

  it('memiliki tombol upload file', () => {
    render(<MemoryRouter><Documents /></MemoryRouter>);
    expect(screen.getByText('upload_file')).toBeInTheDocument();
  });

  it('menghapus dokumen saat tombol hapus diklik', async () => {
    render(<MemoryRouter><Documents /></MemoryRouter>);
    const deleteBtn = screen.getByText('delete');
    
    fireEvent.click(deleteBtn);
    await waitFor(() => {
      expect(mockDeleteDocument).toHaveBeenCalled();
    });
  });

  it('membuka DocumentViewer saat dokumen diklik', async () => {
    render(<MemoryRouter><Documents /></MemoryRouter>);
    const docItem = screen.getByText('Sertifikat.pdf');
    
    fireEvent.click(docItem);
    
    // Check if viewer is rendered (mocked version)
    await waitFor(() => {
        const viewer = screen.getByTestId('doc-viewer');
        expect(viewer).toBeInTheDocument();
        expect(within(viewer).getByText('Sertifikat.pdf')).toBeInTheDocument();
    });
  });

  it('mengunggah file saat input file berubah', async () => {
    render(<MemoryRouter><Documents /></MemoryRouter>);
    const input = screen.getByLabelText('Unggah File') as HTMLInputElement;
    
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    
    await act(async () => {
        fireEvent.change(input, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(mockAddDocument).toHaveBeenCalled();
    });
  });
});
