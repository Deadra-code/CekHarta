import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AssetDetail from './AssetDetail';
import { useStore } from '../store/useStore';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('../store/useStore', () => ({
  useStore: vi.fn()
}));

const mockDeleteAsset = vi.fn();
const mockToggleChecklist = vi.fn();
const mockAddContact = vi.fn();
const mockDeleteContact = vi.fn();

describe('AssetDetail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useStore as any).mockReturnValue({
      assets: [
        { 
          id: '1', name: 'Rumah Menteng', category: 'Real Estat', status: 'Dalam Proses', valuationLabel: 'Rp 10.000',
          checklist: [
            { id: 'c1', title: 'Ceklis 1', description: 'Desc 1', isCompleted: false },
            { id: 'c2', title: 'Hubungi Notaris', description: 'Desc 2', isCompleted: true }
          ]
        }
      ],
      deleteAsset: mockDeleteAsset,
      toggleChecklist: mockToggleChecklist,
      contacts: [
        { id: '1', name: 'Pak Notaris', role: 'Notaris', phone: '08123', email: 'notaris@test.com' }
      ],
      addContact: mockAddContact,
      deleteContact: mockDeleteContact,
      showDialog: vi.fn(({ onConfirm }) => onConfirm?.())
    });
  });

  it('merender detail aset', () => {
    render(
      <MemoryRouter initialEntries={['/assets/1']}>
        <Routes>
          <Route path="/assets/:id" element={<AssetDetail />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Rumah Menteng')).toBeInTheDocument();
    expect(screen.getByText('Ceklis 1')).toBeInTheDocument();
    expect(screen.getByText('1 / 2 Selesai')).toBeInTheDocument();
  });

  it('bisa menghapus aset', () => {
    render(
      <MemoryRouter initialEntries={['/assets/1']}>
        <Routes>
          <Route path="/assets/:id" element={<AssetDetail />} />
        </Routes>
      </MemoryRouter>
    );
    const deleteBtn = screen.getByTitle('Hapus Aset');
    fireEvent.click(deleteBtn);
    expect(mockDeleteAsset).toHaveBeenCalledWith('1');
  });

  it('bisa mencentang ceklis', () => {
    render(
      <MemoryRouter initialEntries={['/assets/1']}>
        <Routes>
          <Route path="/assets/:id" element={<AssetDetail />} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Ceklis 1'));
    expect(mockToggleChecklist).toHaveBeenCalledWith('1', 'c1');
  });

  it('menampilkan Error jika ID tidak cocok / tidak ditemukan', () => {
    render(
      <MemoryRouter initialEntries={['/assets/999']}>
        <Routes>
          <Route path="/assets/:id" element={<AssetDetail />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Aset Tidak Ditemukan')).toBeInTheDocument();
  });
});
