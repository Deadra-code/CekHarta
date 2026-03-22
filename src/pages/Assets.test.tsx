import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Assets from './Assets';
import { useStore } from '../store/useStore';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../store/useStore', () => ({
  useStore: vi.fn()
}));

describe('Assets Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useStore as any).mockReturnValue({
      assets: [
        { id: '1', name: 'Rumah Menteng', category: 'Real Estat', status: 'Siap', valuationLabel: 'Rp 10.000', progressPercentage: 100 },
        { id: '2', name: 'Mobil BMW', category: 'Kendaraan Klasik', status: 'Dalam Proses', valuationLabel: 'Rp 5.000', progressPercentage: 50 },
      ]
    });
  });

  it('merender daftar aset', () => {
    render(<MemoryRouter><Assets /></MemoryRouter>);
    expect(screen.getByText('Rumah Menteng')).toBeInTheDocument();
    expect(screen.getByText('Mobil BMW')).toBeInTheDocument();
  });

  it('bisa memfilter aset berdasarkan pencarian', () => {
    render(<MemoryRouter><Assets /></MemoryRouter>);
    const searchInput = screen.getByLabelText('Cari Aset');
    fireEvent.change(searchInput, { target: { value: 'BMW' } });
    
    expect(screen.getByText('Mobil BMW')).toBeInTheDocument();
    expect(screen.queryByText('Rumah Menteng')).not.toBeInTheDocument();
  });

  it('menampilkan pesat kosong jika pencarian tidak cocok', () => {
    render(<MemoryRouter><Assets /></MemoryRouter>);
    const searchInput = screen.getByLabelText('Cari Aset');
    fireEvent.change(searchInput, { target: { value: 'Pesawat Terbang' } });
    
    expect(screen.getByText('Tidak ada aset yang sesuai kriteria pencarian.')).toBeInTheDocument();
  });
});
