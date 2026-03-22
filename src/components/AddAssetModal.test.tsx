import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AddAssetModal from './AddAssetModal';
import { useStore } from '../store/useStore';

// Mock the store
vi.mock('../store/useStore', () => ({
  useStore: vi.fn()
}));

describe('AddAssetModal Component', () => {
  const mockAddAsset = vi.fn();
  const mockAddActivity = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useStore as any).mockImplementation((selector: any) => {
      // Mock different state slices based on the selector function name or implementation
      if (selector.toString().includes('state.addAsset')) return mockAddAsset;
      if (selector.toString().includes('state.addActivity')) return mockAddActivity;
      return null;
    });
  });

  it('harusnya tidak merender jika isOpen false', () => {
    render(<AddAssetModal isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByText('Tambah Aset Baru')).not.toBeInTheDocument();
  });

  it('harusnya merender jika isOpen true', () => {
    render(<AddAssetModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText('Tambah Aset Baru')).toBeInTheDocument();
  });

  it('harusnya memformat input valuasi dengan pemisah ribuan', () => {
    render(<AddAssetModal isOpen={true} onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText(/1\.500\.000\.000/);
    
    fireEvent.change(input, { target: { value: '1000000' } });
    expect(input).toHaveValue('1.000.000');
  });

  it('harusnya memanggil addAsset saat form disubmit', () => {
    render(<AddAssetModal isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.change(screen.getByPlaceholderText(/Contoh: Ruko/i), { target: { value: 'Aset Baru' } });
    fireEvent.change(screen.getByPlaceholderText(/1\.500\.000\.000/), { target: { value: '5000000' } });
    
    fireEvent.click(screen.getByText('Simpan Aset'));
    
    expect(mockAddAsset).toHaveBeenCalled();
    expect(mockAddActivity).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });
});
